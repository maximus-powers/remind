// THESE ARE QUERY FUNCTIONS FOR A SPECIFIC CARD

import { NextRequest, NextResponse } from 'next/server';
import { deleteCardById, updateCardContentById } from '../../../queries';

// delete the card
export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const id = parseInt(pathname.split('/').pop() || '', 10);
    if (!id) {
      throw new Error('Invalid ID');
    }
    await deleteCardById(id);
    return NextResponse.json({});
  } catch {
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}

// update the cards text and title
export async function PUT(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    const id = parseInt(pathname.split('/').pop() || '', 10);
    if (!id) {
      throw new Error('Invalid ID');
    }
    const { title, text } = await req.json();
    await updateCardContentById(id, title, text);
    return NextResponse.json({});
  } catch {
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}