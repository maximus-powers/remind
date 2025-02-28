// QUERIES FOR FULL TABS TABLE
import { NextResponse } from 'next/server';
import { getAllTabsAndCards, addNewTab } from '../../../lib/queries';
export async function GET(req) {
    const userEmail = req.nextUrl.searchParams.get('userEmail') || '';
    const tabsWithCards = await getAllTabsAndCards(userEmail);
    return NextResponse.json(tabsWithCards);
}
export async function POST(req) {
    const { name, userEmail } = await req.json();
    const newTab = await addNewTab(name, userEmail);
    return NextResponse.json(newTab);
}
