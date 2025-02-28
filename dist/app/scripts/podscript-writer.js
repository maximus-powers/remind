import {
  getTabsWithOldestAverageLastIncluded,
  getOldestCardsByTab,
  getTabNameFromID,
} from '../api/queries';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const model = openai('gpt-4o', { structuredOutputs: true });
export async function generateScript() {
  // get the 3 tab ids with the oldest average cards "last_included" date
  const tabIds = await getTabsWithOldestAverageLastIncluded();
  // get the 25 cards from each tab id with the oldest "last_included" dates
  const cardsByTab = await getOldestCardsByTab(tabIds);
  // TODO: how should we handle cases where a tab has less than 7 cards? Get another tab?
  // find a theme and select cards from each tab
  const themeResponse = await generateObject({
    model: model,
    schemaName: 'lessonPlan',
    schemaDescription:
      'A curriculum of curated educational content that follows a central theme.',
    schema: z.object({
      theme: z.string().describe('A theme to be used for the lesson today.'),
      section1: z
        .array(z.number())
        .describe(
          `5-10 card ids from tab ${cardsByTab[0].tabId} that fit the theme`
        ),
      section2: z
        .array(z.number())
        .describe(
          `5-10 card ids from tab ${cardsByTab[1].tabId} that fit the theme`
        ),
      section3: z
        .array(z.number())
        .describe(
          `5-10 card ids from tab ${cardsByTab[2].tabId} that fit the theme.`
        ),
    }),
    prompt: `Given the following cards, find a common theme and select relevant card ids from each tab that are most relevant to the theme.
    Cards from tab ${cardsByTab[0].tabId}: ${cardsByTab[0].cards.map((card) => card.id).join(', ')}\n
    Cards from tab ${cardsByTab[1].tabId}: ${cardsByTab[1].cards.map((card) => card.id).join(', ')}\n
    Cards from tab ${cardsByTab[2].tabId}: ${cardsByTab[2].cards.map((card) => card.id).join(', ')}`,
  });
  const outlineObject = themeResponse.object;
  // extract the cards from the cardsByTab arrays that are in the outlineObject
  const section1Cards = cardsByTab[0].cards.filter((card) =>
    outlineObject.section1.includes(card.id)
  );
  const section2Cards = cardsByTab[1].cards.filter((card) =>
    outlineObject.section2.includes(card.id)
  );
  const section3Cards = cardsByTab[2].cards.filter((card) =>
    outlineObject.section3.includes(card.id)
  );
  if (
    !cardsByTab[0].cards.length ||
    !cardsByTab[1].cards.length ||
    !cardsByTab[2].cards.length
  ) {
    throw new Error('Not enough cards to generate a script');
  }
  if (outlineObject.theme === null) {
    throw new Error('Could not find a theme for the lesson');
  }
  // generate script
  const scriptResponse = await generateObject({
    model: model,
    schemaName: 'podscript',
    schemaDescription: `Pure dialogue for an educational lesson about ${outlineObject.theme} for a podcast.`,
    schema: z.object({
      title: z
        .string()
        .describe(`A funny title for the lesson about ${outlineObject.theme}.`),
      intro: z
        .string()
        .describe(`An introduction to the lesson about ${outlineObject.theme}`),
      section1: z
        .array(z.string())
        .describe(
          `A short summary of the concept of each card from tab ${cardsByTab[0].tabId}`
        ),
      section2: z
        .array(z.string())
        .describe(
          `A short summary of the concept of each card from tab ${cardsByTab[1].tabId}`
        ),
      section3: z
        .array(z.string())
        .describe(
          `A short summary of the concept of each card from tab ${cardsByTab[2].tabId}`
        ),
      conclusion: z
        .string()
        .describe(
          'A brief summary of the lesson and rapid fire mentions of cards and topics covered during the lesson.'
        ),
    }),
    prompt: `Use these cards to make an advanced educational podcast script (pure dialogue for one reader), that will be 5-10 minutes long. 
    The podcast is called "The Daily Byte" and the theme of today's lesson is ${outlineObject.theme}.
    For each section, you will need to follow the cards from the tabs associated with that section:
    Section 1 Cards: ${section1Cards.map((card) => `${card.title}: ${card.text}`).join('\n')}\n
    Section 2 Cards: ${section2Cards.map((card) => `${card.title}: ${card.text}`).join('\n')}\n
    Section 3 Cards: ${section3Cards.map((card) => `${card.title}: ${card.text}`).join('\n')}\n
    `,
  });
  // add names to the sections based on the Names from the tabs
  const tabNames = await Promise.all(
    tabIds.map((tabId) => getTabNameFromID(tabId))
  );
  console.log(tabNames);
  return {
    title: scriptResponse.object.title,
    intro: scriptResponse.object.intro,
    section1: {
      tab_id: tabNames[0].id,
      tab_name: tabNames[0].name,
      snippets: scriptResponse.object.section1.map((snippet, index) => ({
        card_id: outlineObject.section1[index],
        text: snippet,
      })),
    },
    section2: {
      tab_id: tabNames[1].id,
      tab_name: tabNames[1].name,
      snippets: scriptResponse.object.section2.map((snippet, index) => ({
        card_id: outlineObject.section2[index],
        text: snippet,
      })),
    },
    section3: {
      tab_id: tabNames[2].id,
      tab_name: tabNames[2].name,
      snippets: scriptResponse.object.section3.map((snippet, index) => ({
        card_id: outlineObject.section3[index],
        text: snippet,
      })),
    },
    conclusion: scriptResponse.object.conclusion,
  };
}
// // run
generateScript()
  .then((script) => {
    console.log(script);
  })
  .catch((error) => {
    console.error('Error generating script:', error);
  });
