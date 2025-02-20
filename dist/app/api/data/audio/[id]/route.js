import { NextResponse } from 'next/server';
import { saveAudioToDatabase } from '../../../queries';
// save audio to database
export async function PUT(req) {
    try {
        const { pathname } = req.nextUrl;
        const id = parseInt(pathname.split('/').pop() || '', 10);
        if (!id) {
            throw new Error('Invalid ID');
        }
        const { field, buffer } = await req.json();
        await saveAudioToDatabase(id, field, Buffer.from(buffer, 'base64'));
        return NextResponse.json({});
    }
    catch (_a) {
        return NextResponse.json({ error: 'Failed to save audio' }, { status: 500 });
    }
}
