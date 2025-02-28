import { NextResponse } from 'next/server';
import { generateScript } from '../../../lib/scripts/podcast-writer';
import {
  createNewAudioRow,
  getAudioUrlsFromDatabase,
  saveScriptToDB,
} from '../../../lib/queries';
import { getSignedUrls } from '../../../lib/scripts/text-to-audio';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { userEmail } = await req.json();
    if (!userEmail) {
      throw new Error('User email is required');
    }
    const rowId = await createNewAudioRow(userEmail);
    const scriptObj = await generateScript(userEmail);
    await saveScriptToDB(scriptObj, rowId);
    return NextResponse.json({
      message: 'Podcast creation completed successfully',
      script: scriptObj,
      rowId: rowId,
    });
  } catch (error) {
    console.error('Error during podcast creation:', error);
    return NextResponse.json(
      { message: 'Error occurred during podcast creation', error },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fetchSignedUrls = url.searchParams.get('signedUrls') === 'true';
  const userEmail = url.searchParams.get('userEmail');
  if (!userEmail) {
    return NextResponse.json(
      { error: 'User email is required' },
      { status: 400 }
    );
  }

  if (fetchSignedUrls) {
    try {
      const signedUrls = await getSignedUrls(userEmail);
      return NextResponse.json(signedUrls);
    } catch (error) {
      console.error('Error fetching signed URLs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch signed URLs' },
        { status: 500 }
      );
    }
  } else {
    try {
      const audio_row = await getAudioUrlsFromDatabase(userEmail);

      console.log('loaded audio row', audio_row);

      const validAudioFields = ['section1', 'section2', 'section3']; // 'intro',  'conclusion'
      const audioData: { [key: string]: Blob } = {};

      for (const field of validAudioFields) {
        if (audio_row[field]) {
          audioData[field] = audio_row[field];
        }
      }

      // TODO: also return the scriptObj so that we can use the tab names in the audio player card

      return NextResponse.json(audioData);
    } catch (error) {
      console.error('Error fetching audio data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audio data' },
        { status: 500 }
      );
    }
  }
}
