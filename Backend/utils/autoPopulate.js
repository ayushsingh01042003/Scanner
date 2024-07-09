import { TextServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';
import dotenv from "dotenv"
dotenv.config()

async function autoPopulate(key) {
  const message = `Generate a boundary-based regex pattern for identifying ${key} in text. Only respond with the regex pattern, nothing else.`;
  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(process.env.GEMINI_API_KEY),
  });

  try {
    const result = await client.generateText({
      model: 'models/text-bison-001',
      prompt: { text: message },
    });
    return "\\b"+result[0].candidates[0].output.replace(/\^/g, '').replace(/`/g, '').replace(/\$/g, '')+"\\b"
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return { error: 'Failed to get response from Gemini' };
  }
}

export default autoPopulate;
