const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.GEMINI_ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 bytes
const IV = process.env.GEMINI_IV || 'abcdef1234567890'; // 16 bytes

function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

function decrypt(text) {
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Usage:
// node geminiKeyTool.js encrypt <API_KEY>
// node geminiKeyTool.js decrypt <ENCRYPTED_KEY>

const [,, mode, value] = process.argv;
if (!mode || !value) {
  console.log('Usage: node geminiKeyTool.js encrypt <API_KEY>');
  console.log('   or: node geminiKeyTool.js decrypt <ENCRYPTED_KEY>');
  process.exit(1);
}

if (mode === 'encrypt') {
  console.log('Encrypted:', encrypt(value));
} else if (mode === 'decrypt') {
  console.log('Decrypted:', decrypt(value));
} else {
  console.log('Unknown mode:', mode);
}
