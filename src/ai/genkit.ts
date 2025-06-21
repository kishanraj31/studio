import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  // This warning will be logged on the server during development if the key is missing.
  console.warn(
    'WARNING: The GOOGLE_API_KEY environment variable is not set. AI features will be disabled.'
  );
}

export const ai = genkit({
  plugins: [googleAI({apiKey})],
  // Use a model that supports multimodal inputs (image + text)
  model: 'googleai/gemini-1.5-flash-latest',
});
