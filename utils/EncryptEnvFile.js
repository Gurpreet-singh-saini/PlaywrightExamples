/*
import CryptoJSUtilFile from "crypto-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentDir = __dirname;
// Go one level above (back to 'src')
const srcDir = path.resolve(currentDir, "..");

// Change to 'config' folder
const configDir = path.resolve(srcDir, "config");
let envFilePath = `${configDir}\\.env`;
if (process.env.NODE_ENV) {
  envFilePath = `${configDir}\\.env.${process.env.NODE_ENV}`;
}

//console.log(envFilePath);

export function encryptEnvFile() {
  const SALT = process.env.SALT || "defaultSALT";
  // Read the .env file
  const envFileContent = fs.readFileSync(envFilePath, "utf8");
  const envLines = envFileContent.split("\n");

  // Encrypt values and update the array
  const encryptedLines = envLines.map((line) => {
    const [key, value] = line.split("=");

    if (value) {
      const encryptedValue = CryptoJSUtilFile.AES.encrypt(
        value,
        SALT,
      ).toString();
      return `${key}=${encryptedValue}`;
    }

    return line;
  });

  // Join the lines and write back to the .env file
  const updatedEnvContent = encryptedLines.join("\n");
  fs.writeFileSync(envFilePath, updatedEnvContent, "utf8");

  console.log("Encryption complete. Updated .env file.");
}
export function decryptEnvFile() {
  const SALT = process.env.SALT || "defaultSALT";
  // Read the .env file
  const envFileContent = fs.readFileSync(envFilePath, "utf8");
  const envLines = envFileContent.split("\n");

  // Encrypt values and update the array
  const decryptedLines = envLines.map((line) => {
    const [key, value] = line.split("=");

    if (value) {
      const decryptedValue = CryptoJSUtilFile.AES.decrypt(value, SALT).toString(
        CryptoJSUtilFile.enc.Utf8,
      );

      return `${key}=${decryptedValue}`;
    }

    return line;
  });

  // Join the lines and write back to the .env file
  const updatedEnvContent = decryptedLines.join("\n");
  fs.writeFileSync(envFilePath, updatedEnvContent, "utf8");

  console.log("Decryption complete. Updated .env file.");
}
*/

import CryptoJSUtilFile from "crypto-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentDir = __dirname;
const srcDir = path.resolve(currentDir, "..");

// config folder
const configDir = path.resolve(srcDir, "config");

let envFilePath = `${configDir}\\.env`;
if (process.env.NODE_ENV) {
  envFilePath = `${configDir}\\.env.${process.env.NODE_ENV}`;
}

// Load dotenv from the correct path
dotenv.config({ path: envFilePath });

// SALT from .env file or default
const SALT = process.env.SALT || "defaultSALT";

export function encryptEnvFile() {
  console.log(`\n🔐 Starting encryption...`);
  console.log(`File: ${envFilePath}`);
  console.log(`SALT: ${SALT}\n`);
  
  const envFileContent = fs.readFileSync(envFilePath, "utf8");
  const envLines = envFileContent.split("\n");

  const encryptedLines = envLines.map((line) => {
    if (!line.trim() || line.startsWith("#")) return line;
    if (!line.includes("=")) return line;

    const [key, value] = line.split("=");

    // Don't encrypt SALT - it's the decryption key!
    if (key === "SALT") {
      return line;
    }

    // skip values already encrypted
    if (value && value.startsWith("U2FsdGVkX1")) {
      console.log(`  ⏭️  ${key} already encrypted, skipping`);
      return line;
    }

    if (value) {
      const encryptedValue = CryptoJSUtilFile.AES.encrypt(value, SALT).toString();
      console.log(`  ✓ Encrypted ${key}`);
      console.log(`    Before: ${value}`);
      console.log(`    After:  ${encryptedValue}`);
      return `${key}=${encryptedValue}`;
    }

    return line;
  });

  const updatedEnvContent = encryptedLines.join("\n");
  fs.writeFileSync(envFilePath, updatedEnvContent, "utf8");

  console.log(`\n✅ .env encrypted successfully!\n`);
}

/* AUTO-RUN WHEN EXECUTED DIRECTLY */
// Call the function automatically when script runs
encryptEnvFile();
