// QUERIES FOR FULL TABS TABLE

import { NextRequest, NextResponse } from 'next/server';
import { getAllTabsAndCards, addNewTab } from '../../../lib/queries';

export async function GET(req: NextRequest) {
  const userEmail = req.nextUrl.searchParams.get('userEmail') || '';
  const tabsWithCards = await getAllTabsAndCards(userEmail);
  return NextResponse.json(tabsWithCards);
}

export async function POST(req: NextRequest) {
  const { name, userEmail } = await req.json();
  const newTab = await addNewTab(name, userEmail);
  return NextResponse.json(newTab);
}
