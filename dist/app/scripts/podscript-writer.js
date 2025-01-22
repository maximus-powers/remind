import { getTabsWithOldestAverageLastIncluded, getOldestCardsByTab } from '../../api/queries';
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';
dotenv.config();
// query the database to find the 3 tab ids with the oldest average cards "last_included" date
// query the 25 cards from each tab id with the oldest "last_incldued" dates
// LLM tasks:
// 1. Find a theme we can weave with the cards available, return the 21 ids of the cards that are to be included (7 from each tab, chosen for relevance to the theme)
// 2. Generate the script:
//// Introduction
//// Section for Tab 1 (includes content from the 7 cards, and 3 new concepts)
//// Section for Tab 2 (includes content from the 7 cards, and 3 new concepts)
//// Section for Tab 3 (includes content from the 7 cards, and 3 new concepts)
//// Conclusion
// Function to generate the script
async function generateScript() {
    // Step 1: Get the 3 tab ids with the oldest average cards "last_included" date
    const tabIds = await getTabsWithOldestAverageLastIncluded();
    // Step 2: Get the 25 cards from each tab id with the oldest "last_included" dates
    const cardsByTab = await getOldestCardsByTab(tabIds);
    // Step 3: Find a theme and select 7 cards from each tab
    const selectedCards = cardsByTab.map(tab => {
        // Placeholder for theme selection logic
        return tab.cards.slice(0, 7); // Select the first 7 cards for simplicity
    });
    // Step 4: Generate the script using GPT-4
    const openai = new OpenAI({ apiKey: 'your-openai-api-key', model: 'gpt-4' });
    const promptTemplate = new PromptTemplate({
        template: `
      Generate a podcast script with the following structure:
      Introduction
      Section for Tab 1 (includes content from the 7 cards, and 3 new concepts)
      Section for Tab 2 (includes content from the 7 cards, and 3 new concepts)
      Section for Tab 3 (includes content from the 7 cards, and 3 new concepts)
      Conclusion

      Cards content:
      Tab 1:
      {{tab1Content}}
      Tab 2:
      {{tab2Content}}
      Tab 3:
      {{tab3Content}}
    `,
        inputVariables: ['tab1Content', 'tab2Content', 'tab3Content'],
    });
    const chain = promptTemplate.pipe(openai);
    const script = await chain.invoke({
        tab1Content: selectedCards[0].map(card => card.text).join('\n'),
        tab2Content: selectedCards[1].map(card => card.text).join('\n'),
        tab3Content: selectedCards[2].map(card => card.text).join('\n'),
    });
    return script;
}
// Run the script generation function
generateScript().then(script => {
    console.log(script);
}).catch(error => {
    console.error('Error generating script:', error);
});
