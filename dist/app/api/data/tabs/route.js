// QUERIES FOR FULL TABS TABLE
import { NextResponse } from 'next/server';
import { getAllTabsAndCards, addNewTab } from '../../queries';
export async function GET() {
    const tabsWithCards = await getAllTabsAndCards();
    return NextResponse.json(tabsWithCards);
}
export async function POST(req) {
    const { name } = await req.json();
    const newTab = await addNewTab(name);
    return NextResponse.json(newTab);
}
