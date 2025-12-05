/*

import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configDir = path.resolve(__dirname, "..", "config");

dotenv.config({ path: path.resolve(configDir, ".env") });

function encrypt(text) {
  const SALT = process.env.SALT || "omg";
  return CryptoJS.AES.encrypt(text, SALT).toString();
}

function decrypt(cipherText) {
  const SALT = process.env.SALT || "defaultSALT";
  const bytes = CryptoJS.AES.decrypt(cipherText, SALT);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };
*/


import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Resolve config directory and load environment file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configDir = path.resolve(__dirname, "..", "config");

dotenv.config({
  path: path.resolve(configDir, ".env"),
});

// --- SALT VALIDATION ---------------------------------------------------------

function getSalt() {
  const SALT = process.env.SALT;

  if (!SALT || typeof SALT !== "string" || SALT.trim() === "") {
    throw new Error(
      " SALT is missing or invalid. Set SALT in config/.env before running.");
  }

  return SALT;
}

// --- ENCRYPT -----------------------------------------------------------------

function encrypt(plainText) {
  if (typeof plainText !== "string") {
    throw new Error(` encrypt() expected a string, got: ${typeof plainText}`);
  }

  const SALT = getSalt();

  try {
    return CryptoJS.AES.encrypt(plainText, SALT).toString();
  } catch (err) {
    throw new Error(` Encryption failed: ${err.message}`);
  }
}

// --- DECRYPT -----------------------------------------------------------------

function decrypt(cipherText) {
  if (!cipherText || typeof cipherText !== "string") {
    throw new Error(
      ` decrypt() expected a valid encrypted string, got: ${cipherText}`
    );
  }

  const SALT = getSalt();

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SALT);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error(
        " Decryption returned empty string — wrong SALT or corrupted ciphertext."
      );
    }

    return decrypted;
  } catch (err) {
    throw new Error(` Decryption failed: ${err.message}`);
  }
}

export { encrypt, decrypt };
