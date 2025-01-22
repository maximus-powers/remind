"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Button, Card, CardContent, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface TabType {
  id: number;
  name: string;
  cards: CardType[];
}

interface CardType {
  id: number;
  title: string;
  text: string;
}

const Home = () => {
  const [tabs, setTabs] = useState<TabType[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data/tabs');
      const tabsWithCards = await response.json();
      setTabs(tabsWithCards);
    };
    fetchData();
  }, []);

  const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const addTab = async () => {
    const response = await fetch('/api/data/tabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: `Tab ${tabs.length + 1}` }),
    });
    const newTab = await response.json();
    setTabs([...tabs, newTab]);
  };

  const deleteTab = async (index: number) => {
    const tabId = tabs[index].id;
    await fetch(`/api/data/tabs/${tabId}`, { method: 'DELETE' });
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    setSelectedTab(0);
  };

  const handleTabTitleChange = async (index: number, title: string) => {
    const newTabs = [...tabs];
    newTabs[index].name = title;
    setTabs(newTabs);
    await fetch(`/api/data/tabs/${newTabs[index].id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: title }),
    });
  };

  const addCard = async (tabIndex: number) => {
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

  const deleteCard = async (tabIndex: number, cardIndex: number) => {
    const cardId = tabs[tabIndex].cards[cardIndex].id;
    await fetch(`/api/data/cards/${cardId}`, { method: 'DELETE' });
    const newTabs = [...tabs];
    newTabs[tabIndex].cards.splice(cardIndex, 1);
    setTabs(newTabs);
  };

  const handleCardBlur = async (tabIndex: number, cardIndex: number) => {
    const cardId = tabs[tabIndex].cards[cardIndex].id;
    const { title, text } = tabs[tabIndex].cards[cardIndex];
    await fetch(`/api/data/cards/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text }),
    });
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, tabIndex: number, cardIndex: number) => {
    if (event.key === 'Enter') {
      handleCardBlur(tabIndex, cardIndex);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, tabIndex: number, cardIndex: number, field: 'title' | 'text') => {
    const newTabs = [...tabs];
    newTabs[tabIndex].cards[cardIndex][field] = event.target.value;
    setTabs(newTabs);
  };

  return (
    <div className="p-5 bg-gray-800 text-white">
      <div className="flex items-center">
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" className="flex-grow">
          {tabs.map((tab, index) => (
            <Tab key={index} label={
              <input
                value={tab.name}
                onChange={(e) => handleTabTitleChange(index, e.target.value)}
                className="min-w-[100px] text-white bg-transparent border-none border-b border-white"
              />
            } />
          ))}
        </Tabs>
        <Button onClick={addTab} variant="contained" color="primary" className="ml-2">
          <Add /> Add Tab
        </Button>
      </div>
      {tabs.map((tab, tabIndex) => (
        <div key={tabIndex} hidden={selectedTab !== tabIndex} className="mt-5">
          <div className="flex flex-wrap gap-2">
            {tab.cards?.map((card, cardIndex) => (
              <Card key={cardIndex} className="w-full mb-2">
                <CardContent className="flex items-center">
                  <input
                    value={card.title}
                    onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)}
                    onBlur={() => handleCardBlur(tabIndex, cardIndex)}
                    onChange={(e) => handleInputChange(e, tabIndex, cardIndex, 'title')}
                    placeholder="Title"
                    className="mr-2 p-1 border border-gray-300 rounded"
                  />
                  <input
                    value={card.text}
                    onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)}
                    onBlur={() => handleCardBlur(tabIndex, cardIndex)}
                    onChange={(e) => handleInputChange(e, tabIndex, cardIndex, 'text')}
                    placeholder="Text"
                    className="flex-grow p-1 border border-gray-300 rounded"
                  />
                  <IconButton onClick={() => deleteCard(tabIndex, cardIndex)} className="text-red-500">
                    <Delete />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={() => addCard(tabIndex)} variant="outlined" sx={{ color: 'white', borderColor: 'white' }} className="mr-2">
            <Add /> Add Card
          </Button>
          <Button onClick={() => deleteTab(tabIndex)} variant="outlined" color="primary">
            <Delete /> Delete Tab
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Home;
