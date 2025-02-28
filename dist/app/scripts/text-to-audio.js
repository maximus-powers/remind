import OpenAI from 'openai';
export async function ScriptToSpeech(scriptObject) {
  const openai = new OpenAI();
  const createNewAudioRow = async () => {
    const baseUrl = window.location.origin;
    const response = await fetch(`${baseUrl}/api/data/audio`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to create new audio row');
    }
    const data = await response.json();
    return data.id;
  };
  const rowId = await createNewAudioRow();
  const saveAudio = async (field, buffer) => {
    const baseUrl = window.location.origin;
    const response = await fetch(`${baseUrl}/api/data/audio/${rowId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field, buffer: buffer.toString('base64') }),
    });
    if (!response.ok) {
      throw new Error('Failed to save audio');
    }
  };
  // tts title
  const titleText = scriptObject.title;
  const titleMp3 = await openai.audio.speech.create({
    model: 'tts-1-hd',
    voice: 'alloy',
    input: titleText,
  });
  const titleBuffer = Buffer.from(await titleMp3.arrayBuffer());
  await saveAudio('title', titleBuffer);
  // tts the intro and outro sections
  for (const introOutroKey of ['intro', 'conclusion']) {
    const fullSectionText = 'Intro:' + '\n' + scriptObject[introOutroKey];
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'alloy',
      input: fullSectionText,
    });
    const introOutroBuffer = Buffer.from(await mp3.arrayBuffer());
    await saveAudio(introOutroKey, introOutroBuffer);
  }
  // tts for each section
  for (const sectionKey of ['section1', 'section2', 'section3']) {
    const section = scriptObject[sectionKey];
    const fullSectionText =
      section.tab_name + '\n' + section.snippets.join('\n');
    // open ai generate code
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1-hd',
      voice: 'alloy',
      input: fullSectionText,
    });
    const sectionBuffer = Buffer.from(await mp3.arrayBuffer());
    await saveAudio(sectionKey, sectionBuffer);
  }
}
