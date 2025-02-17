import OpenAI from "openai";
import { generateScript } from "./podscript-writer";
import { saveAudioToDatabase, createNewAudioRow } from "../api/queries";


export async function ScriptToSpeech(scriptObject: Awaited<ReturnType<typeof generateScript>>) {
    const openai = new OpenAI();

    const rowId = await createNewAudioRow();

    // tts title
    const titleText = scriptObject.title;
    const titleMp3 = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: "alloy",
        input: titleText,
    });
    const titleBuffer = Buffer.from(await titleMp3.arrayBuffer());
    await saveAudioToDatabase(rowId, 'title', titleBuffer);

    // tts the intro and outro sections
    for (const introOutroKey of ['intro', 'conclusion']) {
        const fullSectionText = "Intro:" + "\n" + scriptObject[introOutroKey as 'intro' | 'conclusion'];

        const mp3 = await openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "alloy",
            input: fullSectionText,
        });
        const introOutroBuffer = Buffer.from(await mp3.arrayBuffer());
        await saveAudioToDatabase(rowId, introOutroKey, introOutroBuffer);
    }

    // tts for each section
    for (const sectionKey of ['section1', 'section2', 'section3']) {
        const section = scriptObject[sectionKey as 'section1' | 'section2' | 'section3'];
        const fullSectionText = section.tab_name + "\n" + section.snippets.join("\n");

        // open ai generate code
        const mp3 = await openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "alloy",
            input: fullSectionText,
        });
        const sectionBuffer = Buffer.from(await mp3.arrayBuffer());
        await saveAudioToDatabase(rowId, sectionKey, sectionBuffer);
    }
}

// use openai tts endpoint to convert text to audio

// save the audio in bytecode to the database audio table

// remember that when they play the audio, it should update the "was_played" field in the audio table, but should also update the last_included for each of the cards that were included in the audio (these ids should be stored in a list in the audio table)