"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Button } from "@/app/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface TabType {
  id: number
  name: string
  cards: CardType[]
}

interface CardType {
  id: number
  title: string
  text: string
}

const tabColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
]

export default function TabsAndCards() {
  const [tabs, setTabs] = useState<TabType[]>([])
  const [selectedTab, setSelectedTab] = useState(0)
  const [editTabIndex, setEditTabIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchTabsAndCards = async () => {
      const baseUrl = window.location.origin
      const userEmail = localStorage.getItem("userEmail");
      const response = await fetch(`${baseUrl}/api/data/tabs?userEmail=${userEmail}`)
      const tabsWithCards = await response.json()
      const reversedTabsWithCards = tabsWithCards.map((tab: TabType) => ({
        ...tab,
        cards: tab.cards.reverse(),
      }))
      setTabs(reversedTabsWithCards)
    }
    fetchTabsAndCards()
  }, [])

  const addNewTabHandler = async () => {
    const baseUrl = window.location.origin
    const userEmail = localStorage.getItem("userEmail");
    const response = await fetch(`${baseUrl}/api/data/tabs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `Tab ${tabs.length + 1}`, userEmail }),
    })
    const newTab = await response.json()
    setTabs([...tabs, newTab])
    setSelectedTab(tabs.length)
  }

  const deleteExistingTabHandler = async (index: number) => {
    const baseUrl = window.location.origin
    const tabId = tabs[index].id
    await fetch(`${baseUrl}/api/data/tabs/${tabId}`, { method: "DELETE" })
    const newTabs = tabs.filter((_, i) => i !== index)
    setTabs(newTabs)
    setSelectedTab(0)
  }

  const updateTabTitleHandler = async (index: number, title: string) => {
    const baseUrl = window.location.origin
    const newTabs = [...tabs]
    newTabs[index].name = title
    setTabs(newTabs)
    await fetch(`${baseUrl}/api/data/tabs/${newTabs[index].id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: title }),
    })
  }

  const addNewCardHandler = async (tabIndex: number) => {
    const baseUrl = window.location.origin
    const userEmail = localStorage.getItem("userEmail");
    const response = await fetch(`${baseUrl}/api/data/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "", text: "", tabId: tabs[tabIndex].id, userEmail }),
    })
    const newCard = await response.json()
    const newTabs = [...tabs]
    newTabs[tabIndex].cards.unshift(newCard)
    setTabs(newTabs)
  }

  const deleteExistingCardHandler = async (tabIndex: number, cardIndex: number) => {
    const baseUrl = window.location.origin
    const cardId = tabs[tabIndex].cards[cardIndex].id
    await fetch(`${baseUrl}/api/data/cards/${cardId}`, { method: "DELETE" })
    const newTabs = [...tabs]
    newTabs[tabIndex].cards.splice(cardIndex, 1)
    setTabs(newTabs)
  }

  const updateCardContentHandler = async (tabIndex: number, cardIndex: number) => {
    const baseUrl = window.location.origin
    const cardId = tabs[tabIndex].cards[cardIndex].id
    const { title, text } = tabs[tabIndex].cards[cardIndex]
    await fetch(`${baseUrl}/api/data/cards/${cardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text }),
    })
  }

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    tabIndex: number,
    cardIndex: number,
  ) => {
    if (event.key === "Enter") {
      updateCardContentHandler(tabIndex, cardIndex)
    }
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    tabIndex: number,
    cardIndex: number,
    field: "title" | "text",
  ) => {
    const newTabs = [...tabs]
    newTabs[tabIndex].cards[cardIndex][field] = event.target.value
    setTabs(newTabs)
  }

  return (
    <div className="p-1 bg-white text-black dark:bg-background dark:text-white">
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(index)}
            onDoubleClick={() => setEditTabIndex(index)}
            className={`${tabColors[index % tabColors.length]} text-white py-2 px-5 rounded-lg transition-all duration-200 ease-in-out ${
              selectedTab === index ? "font-bold shadow-lg -mb-px" : "opacity-70 hover:opacity-100"
            }`}
          >
            {editTabIndex === index ? (
              <Input
                value={tab.name}
                onChange={(e) => updateTabTitleHandler(index, e.target.value)}
                onBlur={() => setEditTabIndex(null)}
                className="bg-transparent border-none text-white placeholder-white::placeholder w-auto"
                placeholder="Tab name"
                style={{ width: `${tab.name.length + 3}ch` }}
              />
            ) : (
              <span>{tab.name}</span>
            )}
          </button>
        ))}
        <Button onClick={addNewTabHandler} variant="outline" className="flex-grow rounded-lg">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {tabs.map((tab, tabIndex) => (
        <div key={tab.id} className={`${selectedTab === tabIndex ? "block" : "hidden"}`}>
          <Button onClick={() => addNewCardHandler(tabIndex)} variant="outline" className="w-full mb-4">
            <Plus className="mr-2 h-4 w-4" /> Add Card
          </Button>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tab.cards?.map((card, cardIndex) => (
              <Card key={card.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      value={card.title}
                      onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)}
                      onBlur={() => updateCardContentHandler(tabIndex, cardIndex)}
                      onChange={(e) => handleInputChange(e, tabIndex, cardIndex, "title")}
                      placeholder="Title"
                      className="flex-grow"
                    />
                    <Button
                      onClick={() => deleteExistingCardHandler(tabIndex, cardIndex)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={card.text}
                    onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)}
                    onBlur={() => updateCardContentHandler(tabIndex, cardIndex)}
                    onChange={(e) => handleInputChange(e, tabIndex, cardIndex, "text")}
                    placeholder="Text"
                    rows={3}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={() => deleteExistingTabHandler(tabIndex)} variant="destructive" className="mt-4">
            <Trash2 className="mr-2 h-4 w-4" /> Delete Tab
          </Button>
        </div>
      ))}
    </div>
  )
}

