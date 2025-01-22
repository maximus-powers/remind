// THESE ARE QUERY FUNCTIONS FOR A SPECIFIC TAB
import { NextResponse } from 'next/server';
import { deleteTabById, updateTabNameById } from '../../../queries';
// delete tab
export async function DELETE(req) {
    try {
        const { pathname } = new URL(req.url);
        const id = pathname.split('/').pop();
        if (!id) {
            throw new Error('Invalid ID');
        }
        await deleteTabById(id);
        return NextResponse.json({});
    }
    catch (_a) {
        return NextResponse.json({ error: 'Failed to delete tab' }, { status: 500 });
    }
}
// update tab name
export async function PUT(req) {
    try {
        const { pathname } = new URL(req.url);
        const id = pathname.split('/').pop();
        if (!id) {
            throw new Error('Invalid ID');
        }
        const { name } = await req.json();
        await updateTabNameById(id, name);
        return NextResponse.json({});
    }
    catch (_a) {
        return NextResponse.json({ error: 'Failed to update tab' }, { status: 500 });
    }
}
