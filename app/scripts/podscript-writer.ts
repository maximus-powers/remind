import { getTabsWithOldestAverageLastIncluded, getOldestCardsByTab } from '../api/queries';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

async function generateScript() {
  // get the 3 tab ids with the oldest average cards "last_included" date
  const tabIds = await getTabsWithOldestAverageLastIncluded();

  // get the 25 cards from each tab id with the oldest "last_included" dates
  const cardsByTab = await getOldestCardsByTab(tabIds);

  // find a theme and select 7 cards from each tab
  const openai = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY, model: 'gpt-4o' });
  const themePromptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Given the following cards, find a common theme and select 7 card ids from each tab that are most relevant to the theme.
      
      Cards content:
      Tab 1:
      {tab1Content}
      Tab 2:
      {tab2Content}
      Tab 3:
      {tab3Content}
      
      Return the selected card ids in the following format:
      {
        "tab1": ["id1", "id2", "id3", "id4", "id5", "id6", "id7"],
        "tab2": ["id1", "id2", "id3", "id4", "id5", "id6", "id7"],
        "tab3": ["id1", "id2", "id3", "id4", "id5", "id6", "id7"]
      }`
    ],
    [
      "human",
      `{tab1Content}\n{tab2Content}\n{tab3Content}`
    ]
  ]);

  const themeChain = themePromptTemplate.pipe(
    openai.withStructuredOutput(
      z.object({
        tab1: z.array(z.string()).length(7),
        tab2: z.array(z.string()).length(7),
        tab3: z.array(z.string()).length(7),
      })
    )
  );

  if (!cardsByTab[0].cards.length || !cardsByTab[1].cards.length || !cardsByTab[2].cards.length) {
    throw new Error('Not enough cards to generate a script');
  }

  const themeResponse = await themeChain.invoke({
    tab1Content: cardsByTab[0].cards.map(card => card.text).join('\n'),
    tab2Content: cardsByTab[1].cards.map(card => card.text).join('\n'),
    tab3Content: cardsByTab[2].cards.map(card => card.text).join('\n'),
  });

  const selectedCards = themeResponse;

  // generate script
  const scriptPromptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Generate a podcast script with the following structure:
      Introduction
      Section for Tab 1 (includes content from the 7 cards, and 3 new concepts)
      Section for Tab 2 (includes content from the 7 cards, and 3 new concepts)
      Section for Tab 3 (includes content from the 7 cards, and 3 new concepts)
      Conclusion

      Cards content:
      Tab 1:
      {tab1Content}
      Tab 2:
      {tab2Content}
      Tab 3:
      {tab3Content}`
    ],
    [
      "human",
      `{tab1Content}\n{tab2Content}\n{tab3Content}`
    ]
  ]);

  const scriptChain = scriptPromptTemplate.pipe(openai);
  const script = await scriptChain.invoke({
    tab1Content: selectedCards.tab1.map(id => cardsByTab[0].cards.find(card => card.id === id)?.text || '').join('\n'),
    tab2Content: selectedCards.tab2.map(id => cardsByTab[1].cards.find(card => card.id === id)?.text || '').join('\n'),
    tab3Content: selectedCards.tab3.map(id => cardsByTab[2].cards.find(card => card.id === id)?.text || '').join('\n'),
  });

  return script;
}

// run
generateScript().then(script => {
  console.log(script);
}).catch(error => {
  console.error('Error generating script:', error);
});