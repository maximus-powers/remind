import { NextResponse } from 'next/server';
import { runMakePodcast } from '../../scripts/make-podcast';
import { getMostRecentAudioBlob } from '../../queries';

export async function POST() {
  try {
    await runMakePodcast();
    return NextResponse.json({ message: 'Podcast creation completed successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error occurred during podcast creation', error }, { status: 500 });
  }
}

export async function GET() {
  // this should call the blobs from the audio table with the current date of the created_at field
  const audio_row = await getMostRecentAudioBlob();

  console.log("loaded audio row", audio_row);

  const validAudioFields = ['intro', 'section1', 'section2', 'section3', 'conclusion'];
  const audioData: { [key: string]: Blob } = {};

  for (const field of validAudioFields) {
    if (audio_row[field]) {
      audioData[field] = audio_row[field];
    }
  }
  
  return NextResponse.json(audioData);
}

