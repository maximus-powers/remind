import { NextResponse } from 'next/server';
import { generateScript } from '../../scripts/podcast-writer';
import { createNewAudioRow, getAudioUrlsFromDatabase, saveScriptToDB } from '../../queries';
import { getSignedUrls } from '../../scripts/text-to-audio';

export const maxDuration = 60;

// new functiont hat runs the generate podcast script (not the runMakePodcast function)


export async function POST() {
  try {
    const rowId = await createNewAudioRow(); // TODO: make sure this is actually returning the rowId
    const scriptObj = await generateScript();
    await saveScriptToDB(scriptObj, rowId);
    return NextResponse.json({ message: 'Podcast creation completed successfully', script: scriptObj, rowId: rowId });
  } catch (error) {
    console.error('Error during podcast creation:', error);
    return NextResponse.json({ message: 'Error occurred during podcast creation', error }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fetchSignedUrls = url.searchParams.get('signedUrls') === 'true';

  if (fetchSignedUrls) {
    try {
      const signedUrls = await getSignedUrls();
      return NextResponse.json(signedUrls);
    } catch (error) {
      console.error('Error fetching signed URLs:', error);
      return NextResponse.json({ error: 'Failed to fetch signed URLs' }, { status: 500 });
    }
  } else {
    try {
      const audio_row = await getAudioUrlsFromDatabase();

      console.log("loaded audio row", audio_row);

      const validAudioFields = ['section1', 'section2', 'section3']; // 'intro',  'conclusion'
      const audioData: { [key: string]: Blob } = {};

      for (const field of validAudioFields) {
        if (audio_row[field]) {
          audioData[field] = audio_row[field];
        }
      }
      
      return NextResponse.json(audioData);
    } catch (error) {
      console.error('Error fetching audio data:', error);
      return NextResponse.json({ error: 'Failed to fetch audio data' }, { status: 500 });
    }
  }
}

