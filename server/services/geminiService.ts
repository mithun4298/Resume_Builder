import axios from 'axios';
import crypto from 'crypto';

// Encrypt your API key before storing it in the environment variable
const ENCRYPTION_KEY = process.env.GEMINI_ENCRYPTION_KEY || 'default_key_32bytes_long!'; // Must be 32 bytes
const IV = process.env.GEMINI_IV || 'default_iv_16bytes!'; // Must be 16 bytes

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

function decrypt(text: string): string {
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Store the encrypted API key in your environment variable
const encryptedApiKey = process.env.GEMINI_API_KEY_ENCRYPTED || '';
const apiKey = decrypt(encryptedApiKey);

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

export async function generateGeminiContent(prompt: string) {
  try {
    const data = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    const response = await axios.post(`${GEMINI_API_URL}?key=${apiKey}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      throw new Error('Gemini API rate limit exceeded. Please try again later.');
    }
    throw new Error(error.message || 'Gemini API request failed');
  }
}

// Utility to encrypt the API key for setup
export function setupGeminiApiKey(rawKey: string) {
  return encrypt(rawKey);
}
