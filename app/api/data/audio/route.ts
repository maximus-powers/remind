import { NextResponse } from 'next/server';
import { runMakePodcast } from '../../scripts/make-podcast';

export async function POST() {
  try {
    await runMakePodcast();
    return NextResponse.json({ message: 'Podcast creation completed successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error occurred during podcast creation', error }, { status: 500 });
  }
}
