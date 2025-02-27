// QUERIES FOR FULL CARDS TABLE

import { NextRequest, NextResponse } from 'next/server';
import { addNewCard } from '../../queries';

// add card (to tab)
export async function POST(req: NextRequest) {
  const { title, text, tabId, userEmail } = await req.json();
  const newCard = await addNewCard(title, text, tabId, userEmail);
  return NextResponse.json(newCard);
}
