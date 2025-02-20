import { generateScript } from "./podscript-writer";
import { ScriptToSpeech } from "./text-to-audio";

export async function runMakePodcast() {
    const scriptObject = await generateScript();
    await ScriptToSpeech(scriptObject);
}