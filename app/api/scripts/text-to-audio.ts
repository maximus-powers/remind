import OpenAI from "openai";
import { generateScript } from "./podscript-writer";
import { createNewAudioRow, updateAudioUrlInDatabase, getAudioUrlsFromDatabase } from "../queries";
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    endpoint: `https://s3.us-west-004.backblazeb2.com`,
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.ACCOUNT_ID,
    signatureVersion: 'v4'
});

async function uploadToBackblaze(fileBuffer: Buffer, fileName: string) {
    const params = {
        Bucket: "study-bot"!,
        Key: fileName,
        Body: fileBuffer,
        ContentType: 'audio/mpeg'
    };
    const response = await s3.upload(params).promise();
    return `https://s3.us-west-004.backblazeb2.com/study-bot/${response.Key}`;
}

export async function ScriptToSpeech(scriptObject: Awaited<ReturnType<typeof generateScript>>) {
    const openai = new OpenAI();
    const rowId = await createNewAudioRow();

    for (const introOutroKey of ['intro', 'conclusion']) {
        const fullSectionText = "Intro:" + "\n" + scriptObject[introOutroKey as 'intro' | 'conclusion'];
        const mp3 = await openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "alloy",
            input: fullSectionText,
        });
        const introOutroBuffer = Buffer.from(await mp3.arrayBuffer());
        const fileUrl = await uploadToBackblaze(introOutroBuffer, `${introOutroKey}.mp3`);
        await updateAudioUrlInDatabase(rowId, introOutroKey, fileUrl);
    }

    for (const sectionKey of ['section1', 'section2', 'section3']) {
        const section = scriptObject[sectionKey as 'section1' | 'section2' | 'section3'];
        const fullSectionText = section.tab_name + "\n" + section.snippets.map(snippet => snippet.text).join("\n");
        const mp3 = await openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "alloy",
            input: fullSectionText,
        });
        const sectionBuffer = Buffer.from(await mp3.arrayBuffer());
        const fileUrl = await uploadToBackblaze(sectionBuffer, `${sectionKey}.mp3`);
        await updateAudioUrlInDatabase(rowId, sectionKey, fileUrl);
    }
}

export async function getSignedUrls() {
    const audioUrls = await getAudioUrlsFromDatabase();
    const signedUrls: { [key: string]: string } = {};

    for (const key in audioUrls) {
        if (audioUrls[key]) {
            const params = {
                Bucket: "study-bot",
                Key: `${key}.mp3`,
                Expires: 60 * 60 // 1 hour
            };
            signedUrls[key] = s3.getSignedUrl('getObject', params);
            console.log(`Signed URL for ${key}: ${signedUrls[key]}`);
        }
    }

    return signedUrls;
}