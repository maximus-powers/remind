// THESE ARE QUERY FUNCTIONS FOR A SPECIFIC CARD
import { NextResponse } from 'next/server';
import { deleteCardById, updateCardContentById } from '../../../queries';
// delete the card
export async function DELETE(req) {
    try {
        const { pathname } = new URL(req.url);
        const id = pathname.split('/').pop();
        if (!id) {
            throw new Error('Invalid ID');
        }
        await deleteCardById(id);
        return NextResponse.json({});
    }
    catch (_a) {
        return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
    }
}
// update the cards text and title
export async function PUT(req) {
    try {
        const { pathname } = new URL(req.url);
        const id = pathname.split('/').pop();
        if (!id) {
            throw new Error('Invalid ID');
        }
        const { title, text } = await req.json();
        await updateCardContentById(id, title, text);
        return NextResponse.json({});
    }
    catch (_a) {
        return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
    }
}
