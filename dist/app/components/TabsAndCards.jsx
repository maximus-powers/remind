"use client";
import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Button, Card, CardContent, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
const StyledTab = styled(Tab)({
    minWidth: 'auto',
    padding: '0 16px',
    margin: '0 5px 0 0',
    textTransform: 'none',
    color: 'white',
    backgroundColor: '#374151', // bg-slate-700
    borderRadius: '8px 8px 0 0',
    '&.Mui-selected': {
        color: '#1976d2',
        backgroundColor: '#64748B', // bg-slate-500
    },
});
const TabsAndCards = () => {
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    useEffect(() => {
        const fetchTabsAndCards = async () => {
            const baseUrl = window.location.origin;
            const response = await fetch(`${baseUrl}/api/data/tabs`);
            const tabsWithCards = await response.json();
            const reversedTabsWithCards = tabsWithCards.map((tab) => (Object.assign(Object.assign({}, tab), { cards: tab.cards.reverse() })));
            setTabs(reversedTabsWithCards);
        };
        fetchTabsAndCards();
    }, []);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const addNewTabHandler = async () => {
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/data/tabs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: `Tab ${tabs.length + 1}` }),
        });
        const newTab = await response.json();
        setTabs([...tabs, newTab]);
    };
    const deleteExistingTabHandler = async (index) => {
        const baseUrl = window.location.origin;
        const tabId = tabs[index].id;
        await fetch(`${baseUrl}/api/data/tabs/${tabId}`, { method: 'DELETE' });
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);
        setSelectedTab(0);
    };
    const updateTabTitleHandler = async (index, title) => {
        const baseUrl = window.location.origin;
        const newTabs = [...tabs];
        newTabs[index].name = title;
        setTabs(newTabs);
        await fetch(`${baseUrl}/api/data/tabs/${newTabs[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: title }),
        });
    };
    const addNewCardHandler = async (tabIndex) => {
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/data/cards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: '', text: '', tabId: tabs[tabIndex].id }),
        });
        const newCard = await response.json();
        const newTabs = [...tabs];
        newTabs[tabIndex].cards.unshift(newCard);
        setTabs(newTabs);
    };
    const deleteExistingCardHandler = async (tabIndex, cardIndex) => {
        const baseUrl = window.location.origin;
        const cardId = tabs[tabIndex].cards[cardIndex].id;
        await fetch(`${baseUrl}/api/data/cards/${cardId}`, { method: 'DELETE' });
        const newTabs = [...tabs];
        newTabs[tabIndex].cards.splice(cardIndex, 1);
        setTabs(newTabs);
    };
    const updateCardContentHandler = async (tabIndex, cardIndex) => {
        const baseUrl = window.location.origin;
        const cardId = tabs[tabIndex].cards[cardIndex].id;
        const { title, text } = tabs[tabIndex].cards[cardIndex];
        await fetch(`${baseUrl}/api/data/cards/${cardId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, text }),
        });
    };
    const handleCardKeyDown = (event, tabIndex, cardIndex) => {
        if (event.key === 'Enter') {
            updateCardContentHandler(tabIndex, cardIndex);
        }
    };
    const handleInputChange = (event, tabIndex, cardIndex, field) => {
        const newTabs = [...tabs];
        newTabs[tabIndex].cards[cardIndex][field] = event.target.value;
        setTabs(newTabs);
    };
    return (<div className="p-5 bg-gray-800 text-white">
      <div className="flex items-center">
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" className="flex-grow" TabIndicatorProps={{ style: { display: 'none' } }}>
          {tabs.map((tab, index) => (<StyledTab key={index} label={<input value={tab.name} onChange={(e) => updateTabTitleHandler(index, e.target.value)} className="text-white bg-transparent w-24"/>}/>))}
        </Tabs>
        <Button onClick={addNewTabHandler} variant="contained" color="primary" className="mb-5 whitespace-nowrap w-8">
          <Add />
        </Button>
      </div>
      {tabs.map((tab, tabIndex) => {
            var _a;
            return (<div key={tabIndex} hidden={selectedTab !== tabIndex} className="bg-slate-500 p-5 rounded-b-lg">
          <Button onClick={() => addNewCardHandler(tabIndex)} variant="outlined" sx={{ color: 'white', borderColor: 'white', marginBottom: "15px" }} className="mr-2 mb-5 w-full">
            <Add /> Add Card
          </Button>
          <div className="flex flex-wrap gap-2">
            {(_a = tab.cards) === null || _a === void 0 ? void 0 : _a.map((card, cardIndex) => (<Card key={cardIndex} className="w-full mb-2">
                <CardContent className="flex flex-col md:flex-row">
                  <input value={card.title} onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)} onBlur={() => updateCardContentHandler(tabIndex, cardIndex)} onChange={(e) => handleInputChange(e, tabIndex, cardIndex, 'title')} placeholder="Title" className="mr-2 p-1 mb-2 md:mb-10 border border-gray-300 rounded w-full md:w-auto"/>
                  <textarea value={card.text} onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)} onBlur={() => updateCardContentHandler(tabIndex, cardIndex)} onChange={(e) => handleInputChange(e, tabIndex, cardIndex, 'text')} placeholder="Text" className="flex-grow p-1 border border-gray-300 rounded w-full md:w-auto" rows={3}/>
                  <IconButton onClick={() => deleteExistingCardHandler(tabIndex, cardIndex)} className="text-red-500 w-12">
                    <Delete />
                  </IconButton>
                </CardContent>
              </Card>))}
          </div>
          <Button onClick={() => deleteExistingTabHandler(tabIndex)} variant="outlined" sx={{ color: '#ef4444', borderColor: '#ef4444', marginTop: "10px" }}>
            <Delete /> Delete Tab
          </Button>
        </div>);
        })}
    </div>);
};
export default TabsAndCards;
