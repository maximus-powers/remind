'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { TabsSkeleton, CardsSkeleton, LoadingSpinner, } from '@/app/components/loading-skeleton';
const tabColors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
];
export default function TabsAndCards() {
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [editTabIndex, setEditTabIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCardLoading, setIsCardLoading] = useState(false);
    const [loadingCardAction, setLoadingCardAction] = useState(null);
    useEffect(() => {
        const fetchTabsAndCards = async () => {
            setIsLoading(true);
            try {
                const baseUrl = window.location.origin;
                const userEmail = localStorage.getItem('userEmail');
                const response = await fetch(`${baseUrl}/api/data/tabs?userEmail=${userEmail}`);
                const tabsWithCards = await response.json();
                const reversedTabsWithCards = tabsWithCards.map((tab) => (Object.assign(Object.assign({}, tab), { cards: tab.cards.reverse() })));
                setTabs(reversedTabsWithCards);
            }
            catch (error) {
                console.error('Error fetching tabs and cards:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchTabsAndCards();
    }, []);
    const addNewTabHandler = async () => {
        setIsLoading(true);
        try {
            const baseUrl = window.location.origin;
            const userEmail = localStorage.getItem('userEmail');
            const response = await fetch(`${baseUrl}/api/data/tabs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: `Tab ${tabs.length + 1}`, userEmail }),
            });
            const newTab = await response.json();
            setTabs([...tabs, newTab]);
            setSelectedTab(tabs.length);
        }
        catch (error) {
            console.error('Error adding new tab:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const deleteExistingTabHandler = async (index) => {
        setIsLoading(true);
        try {
            const baseUrl = window.location.origin;
            const tabId = tabs[index].id;
            await fetch(`${baseUrl}/api/data/tabs/${tabId}`, { method: 'DELETE' });
            const newTabs = tabs.filter((_, i) => i !== index);
            setTabs(newTabs);
            setSelectedTab(0);
        }
        catch (error) {
            console.error('Error deleting tab:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const updateTabTitleHandler = async (index, title) => {
        try {
            const baseUrl = window.location.origin;
            const newTabs = [...tabs];
            newTabs[index].name = title;
            setTabs(newTabs);
            await fetch(`${baseUrl}/api/data/tabs/${newTabs[index].id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: title }),
            });
        }
        catch (error) {
            console.error('Error updating tab title:', error);
        }
    };
    const addNewCardHandler = async (tabIndex) => {
        setLoadingCardAction({ tabIndex, action: 'add' });
        setIsCardLoading(true);
        try {
            const baseUrl = window.location.origin;
            const userEmail = localStorage.getItem('userEmail');
            const response = await fetch(`${baseUrl}/api/data/cards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: '',
                    text: '',
                    tabId: tabs[tabIndex].id,
                    userEmail,
                }),
            });
            const newCard = await response.json();
            const newTabs = [...tabs];
            newTabs[tabIndex].cards.unshift(newCard);
            setTabs(newTabs);
        }
        catch (error) {
            console.error('Error adding new card:', error);
        }
        finally {
            setIsCardLoading(false);
            setLoadingCardAction(null);
        }
    };
    const deleteExistingCardHandler = async (tabIndex, cardIndex) => {
        setLoadingCardAction({ tabIndex, cardIndex, action: 'delete' });
        setIsCardLoading(true);
        try {
            const baseUrl = window.location.origin;
            const cardId = tabs[tabIndex].cards[cardIndex].id;
            await fetch(`${baseUrl}/api/data/cards/${cardId}`, { method: 'DELETE' });
            const newTabs = [...tabs];
            newTabs[tabIndex].cards.splice(cardIndex, 1);
            setTabs(newTabs);
        }
        catch (error) {
            console.error('Error deleting card:', error);
        }
        finally {
            setIsCardLoading(false);
            setLoadingCardAction(null);
        }
    };
    const updateCardContentHandler = async (tabIndex, cardIndex) => {
        setLoadingCardAction({ tabIndex, cardIndex, action: 'update' });
        setIsCardLoading(true);
        try {
            const baseUrl = window.location.origin;
            const cardId = tabs[tabIndex].cards[cardIndex].id;
            const { title, text } = tabs[tabIndex].cards[cardIndex];
            await fetch(`${baseUrl}/api/data/cards/${cardId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, text }),
            });
        }
        catch (error) {
            console.error('Error updating card:', error);
        }
        finally {
            setIsCardLoading(false);
            setLoadingCardAction(null);
        }
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
    if (isLoading && tabs.length === 0) {
        return (<div className="p-1 bg-white text-black dark:bg-background dark:text-white">
        <TabsSkeleton />
        <CardsSkeleton />
      </div>);
    }
    return (<div className="p-1 bg-white text-black dark:bg-background dark:text-white">
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {tabs.map((tab, index) => (<button key={tab.id} onClick={() => setSelectedTab(index)} onDoubleClick={() => setEditTabIndex(index)} className={`${tabColors[index % tabColors.length]} text-white py-2 px-5 rounded-lg transition-all duration-200 ease-in-out ${selectedTab === index
                ? 'font-bold shadow-lg -mb-px'
                : 'opacity-70 hover:opacity-100'}`} disabled={isLoading}>
            {editTabIndex === index ? (<Input value={tab.name} onChange={(e) => updateTabTitleHandler(index, e.target.value)} onBlur={() => setEditTabIndex(null)} className="bg-transparent border-none text-white placeholder-white::placeholder w-auto" placeholder="Tab name" style={{ width: `${tab.name.length + 3}ch` }}/>) : (<span>{tab.name}</span>)}
          </button>))}
        <Button onClick={addNewTabHandler} variant="outline" className="flex-grow rounded-lg" disabled={isLoading}>
          {isLoading ? (<LoadingSpinner size="small"/>) : (<Plus className="h-4 w-4"/>)}
        </Button>
      </div>
      {tabs.map((tab, tabIndex) => {
            var _a, _b, _c;
            return (<div key={tab.id} className={`${selectedTab === tabIndex ? 'block' : 'hidden'}`}>
          <Button onClick={() => addNewCardHandler(tabIndex)} variant="outline" className="w-full mb-4" disabled={isCardLoading &&
                    (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.tabIndex) === tabIndex &&
                    (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.action) === 'add'}>
            {isCardLoading &&
                    (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.tabIndex) === tabIndex &&
                    (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.action) === 'add' ? (<LoadingSpinner size="small"/>) : (<>
                <Plus className="mr-2 h-4 w-4"/> Add Card
              </>)}
          </Button>

          {((_b = (_a = tabs[tabIndex]) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.length) === 0 && !isCardLoading ? (<div className="text-center py-8 text-muted-foreground">
              No cards yet. Click &quot;Add Card&quot; to create one.
            </div>) : (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(_c = tab.cards) === null || _c === void 0 ? void 0 : _c.map((card, cardIndex) => (<Card key={card.id} className={isCardLoading && (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.cardIndex) === cardIndex
                            ? 'opacity-70'
                            : ''}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Input value={card.title} onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)} onBlur={() => updateCardContentHandler(tabIndex, cardIndex)} onChange={(e) => handleInputChange(e, tabIndex, cardIndex, 'title')} placeholder="Title" className="flex-grow" disabled={isCardLoading &&
                            (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.cardIndex) === cardIndex}/>
                      <Button onClick={() => deleteExistingCardHandler(tabIndex, cardIndex)} variant="ghost" size="icon" className="text-destructive flex-shrink-0" disabled={isCardLoading &&
                            (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.cardIndex) === cardIndex}>
                        {isCardLoading &&
                            (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.cardIndex) === cardIndex &&
                            (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.action) === 'delete' ? (<LoadingSpinner size="small"/>) : (<Trash2 className="h-4 w-4"/>)}
                      </Button>
                    </div>
                    <Textarea value={card.text} onKeyDown={(e) => handleCardKeyDown(e, tabIndex, cardIndex)} onBlur={() => updateCardContentHandler(tabIndex, cardIndex)} onChange={(e) => handleInputChange(e, tabIndex, cardIndex, 'text')} placeholder="Text" rows={3} disabled={isCardLoading &&
                            (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.cardIndex) === cardIndex}/>
                    {isCardLoading &&
                            (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.cardIndex) === cardIndex &&
                            (loadingCardAction === null || loadingCardAction === void 0 ? void 0 : loadingCardAction.action) === 'update' && (<div className="mt-2 flex justify-end">
                          <LoadingSpinner size="small"/>
                        </div>)}
                  </CardContent>
                </Card>))}
            </div>)}

          <Button onClick={() => deleteExistingTabHandler(tabIndex)} variant="destructive" className="mt-4" disabled={isLoading}>
            {isLoading ? (<LoadingSpinner size="small"/>) : (<>
                <Trash2 className="mr-2 h-4 w-4"/> Delete Tab
              </>)}
          </Button>
        </div>);
        })}
    </div>);
}
