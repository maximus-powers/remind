// use openai tts endpoint to convert text to audio

// save the audio in bytecode to the database audio table

// remember that when they play the audio, it should update the "was_played" field in the audio table, but should also update the last_included for each of the cards that were included in the audio (these ids should be stored in a list in the audio table)