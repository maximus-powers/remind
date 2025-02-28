// QUERIES FOR FULL CARDS TABLE
import { NextResponse } from 'next/server';
import { addNewCard } from '../../../lib/queries';
// add card (to tab)
export async function POST(req) {
    const { title, text, tabId, userEmail } = await req.json();
    const newCard = await addNewCard(title, text, tabId, userEmail);
    return NextResponse.json(newCard);
}
