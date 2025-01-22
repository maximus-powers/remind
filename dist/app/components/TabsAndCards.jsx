"use client";
import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Button, Card, CardContent, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
const TabsAndCards = () => {
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    useEffect(() => {
        const fetchTabsAndCards = async () => {
            const response = await fetch('/api/data/tabs');
            const tabsWithCards = await response.json();
            setTabs(tabsWithCards);
        };
        fetchTabsAndCards();
    }, []);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const addNewTabHandler = async () => {
        const response = await fetch('/api/data/tabs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: `Tab ${tabs.length + 1}` }),
        });
        const newTab = await response.json();
        setTabs([...tabs, newTab]);
    };
    const deleteExistingTabHandler = async (index) => {
        const tabId = tabs[index].id;
        await fetch(`/api/data/tabs/${tabId}`, { method: 'DELETE' });
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);
        setSelectedTab(0);
    };
    const updateTabTitleHandler = async (index, title) => {
        const newTabs = [...tabs];
        newTabs[index].name = title;
        setTabs(newTabs);
        await fetch(`/api/data/tabs/${newTabs[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: title }),
        });
    };
    const addNewCardHandler = async (tabIndex) => {
        const response = await fetch('/api/data/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: '', text: '', tabId: tabs[tabIndex].id }),
        });
        const newCard = await response.json();
        const newTabs = [...tabs];
        newTabs[tabIndex].cards.push(newCard);
        setTabs(newTabs);
    };
    const deleteExistingCardHandler = async (tabIndex, cardIndex) => {
        const cardId = tabs[tabIndex].cards[cardIndex].id;
        await fetch(`/api/data/cards/${cardId}`, { method: 'DELETE' });
        const newTabs = [...tabs];
        newTabs[tabIndex].cards.splice(cardIndex, 1);
        setTabs(newTabs);
    };
    const updateCardContentHandler = async (tabIndex, cardIndex) => {
        const cardId = tabs[tabIndex].cards[cardIndex].id;
        const { title, text } = tabs[tabIndex].cards[cardIndex];
        await fetch(`/api/data/cards/${cardId}`, {
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
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" className="flex-grow">
          {tabs.map((tab, index) => (<Tab key={index} label={<input value={tab.name} onChange={(e) => updateTabTitleHandler(index, e.target.value)} className="min-w-[100px] text-white bg-transparent border-none border-b border-white"/>}/>))}
        </Tabs>
        <Button onClick={addNewTabHandler} variant="contained" color="primary" className="ml-2">
          <Add /> Add Tab
        </Button>
      </div>
      {tabs.map((tab, tabIndex) => {
            var _a;
            return (<div key={tabIndex} hidden={selectedTab !== tabIndex} className="mt-5">
          <div className="flex flex-wrap gap-2">
            {(_a = tab.cards) === null || _a === void 0 ? void 0 : _a.map((card, cardIndex) => (<Card key={cardIndex} className="w-full mb-2">
                <CardContent className="flex items-center">
                  <input value={card.title} onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)} onBlur={() => updateCardContentHandler(tabIndex, cardIndex)} onChange={(e) => handleInputChange(e, tabIndex, cardIndex, 'title')} placeholder="Title" className="mr-2 p-1 border border-gray-300 rounded"/>
                  <input value={card.text} onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)} onBlur={() => updateCardContentHandler(tabIndex, cardIndex)} onChange={(e) => handleInputChange(e, tabIndex, cardIndex, 'text')} placeholder="Text" className="flex-grow p-1 border border-gray-300 rounded"/>
                  <IconButton onClick={() => deleteExistingCardHandler(tabIndex, cardIndex)} className="text-red-500">
                    <Delete />
                  </IconButton>
                </CardContent>
              </Card>))}
          </div>
          <Button onClick={() => addNewCardHandler(tabIndex)} variant="outlined" sx={{ color: 'white', borderColor: 'white' }} className="mr-2">
            <Add /> Add Card
          </Button>
          <Button onClick={() => deleteExistingTabHandler(tabIndex)} variant="outlined" color="primary">
            <Delete /> Delete Tab
          </Button>
        </div>);
        })}
    </div>);
};
export default TabsAndCards;
