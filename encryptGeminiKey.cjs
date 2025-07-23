const crypto = require('crypto');

const ENCRYPTION_KEY = 'abcdefghijklmnopqrstuvwxyz123456'; // 32 chars
const IV = '1234567890123456'; // 16 chars
const apiKey = 'AIzaSyBXTCrzsV8m4gZF982duYOdWhkCl8gozPE';

const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(IV));
let encrypted = cipher.update(apiKey, 'utf8');
encrypted = Buffer.concat([encrypted, cipher.final()]);
console.log(encrypted.toString('hex'));
