import { NextResponse } from 'next/server';
import { createNewAudioRow } from '../../queries';
// create new audio row
export async function POST(req) {
    console.log(req);
    const newAudioId = await createNewAudioRow();
    return NextResponse.json({ id: newAudioId });
}
