import { Common_Locators } from "../Locators/Common_Locators";
import { Datacells } from "../interface";
class GenerateRandomData {
    // genraterandomString.js

    genraterandomString(length, options = {}) {
        if (!Number.isInteger(length) || length <= 0) {
            throw new Error('Length must be a positive integer');
        }

        const {
            includeUppercase = true,
            includeLowercase = true,
            includeNumbers = true,
            includeSymbols = false,
            excludeSimilar = false,
        } = options;

        let chars = '';
        if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (includeNumbers) chars += '0123456789';
        if (includeSymbols) chars += '!@#$%^&*()-_=+[]{};:,.<>?';

        if (excludeSimilar) {
            chars = chars.replace(/[O0Il]/g, '');
        }

        if (!chars) {
            throw new Error('At least one character set must be enabled');
        }

        const cryptoAPI =
            typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues
                ? globalThis.crypto
                : require('crypto').webcrypto;

        const result = [];
        const randomBuffer = new Uint32Array(length);
        cryptoAPI.getRandomValues(randomBuffer);

        const max = Math.floor(0xFFFFFFFF / chars.length) * chars.length;

        for (let i = 0; i < randomBuffer.length; i++) {
            let value = randomBuffer[i];
            while (value >= max) {
                value = cryptoAPI.getRandomValues(new Uint32Array(1))[0];
            }
            result.push(chars[value % chars.length]);
        }

        return result.join('');
    }

    /**
     * 
// Example usage
console.log(genraterandomString(5, { includeSymbols: false, excludeSimilar: true }));

     */
}
export const generateRandomData = new GenerateRandomData();
