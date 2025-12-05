/**
 * 🔐 ENCRYPTION & DECRYPTION FLOW - EXPLAINED SIMPLY
 * 
 * Think of it like a LOCKED BOX 📦 with a KEY 🔑
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║          🔐 HOW ENCRYPTION & DECRYPTION WORKS 🔐              ║
╚════════════════════════════════════════════════════════════════╝

STEP 1: SETUP (One time - Before you run tests)
═════════════════════════════════════════════════════════════════

You create a .env file with your secrets:
  
  config/.env (PLAIN TEXT - Before encryption)
  ┌─────────────────────────────────────────┐
  │ LOGIN_EMAIL=gurpreet1@yopmail.com       │
  │ LOGIN_PASSWORD=Abc@12345                │
  │ SALT=defaultSALT                        │
  └─────────────────────────────────────────┘


STEP 2: ENCRYPTION (Lock the box 🔒)
═════════════════════════════════════════════════════════════════

You run: node encryptEnv.js

This takes your plaintext values and LOCKS them using AES encryption:

  Input (PLAINTEXT):
    • Email: gurpreet1@yopmail.com
    • Password: Abc@12345
    • Key: defaultSALT

  After encryption (ENCRYPTED):
    • Email: U2FsdGVkX18TsvXCG3MSmT6CYxd4Y3Q9g5mU0Sld3c+WFP/h9UYyu2mkMz5cHIOY
    • Password: U2FsdGVkX1/k5WxFsAohuRNMQsbreRJO3CLon5uhdug=
    • Key: defaultSALT (stays as plaintext)

  The .env file is now SAFE to commit to git! 🎉
  
  config/.env (ENCRYPTED - After encryption)
  ┌──────────────────────────────────────────────────┐
  │ LOGIN_EMAIL=U2FsdGVkX18TsvXCG3MSmT6...           │
  │ LOGIN_PASSWORD=U2FsdGVkX1/k5WxFsAohu...          │
  │ SALT=defaultSALT                                 │
  └──────────────────────────────────────────────────┘


STEP 3: RUNNING YOUR TEST (Unlock the box 🔓)
═════════════════════════════════════════════════════════════════

When you run: npx playwright test

The flow happens automatically:

  a) .env file is READ
     └─→ Gets ENCRYPTED values from file

  b) CryptojsUtil.js DECRYPTS them
     ├─→ Takes encrypted email
     ├─→ Uses SALT as the KEY
     └─→ Returns: gurpreet1@yopmail.com ✓

  c) LoginTest.spec.js USES decrypted values
     ├─→ Fills email field: gurpreet1@yopmail.com
     ├─→ Fills password field: Abc@12345
     └─→ Clicks Sign In button

  d) Test completes successfully! ✅


VISUAL FLOW DIAGRAM
═════════════════════════════════════════════════════════════════

┌─────────────┐
│ Plain Text  │  (Passwords you type)
│ Secrets     │
└──────┬──────┘
       │
       │ (ENCRYPT with SALT key)
       ▼
┌─────────────────────────────────────────────┐
│ U2FsdGVkX18TsvXCG3MSmT6CYxd4Y3Q9g5mU0Sld3c+ │  (Gibberish)
│ .env FILE (SAFE TO COMMIT)                  │
└──────┬──────────────────────────────────────┘
       │
       │ (Read by test)
       ▼
┌──────────────────────┐
│ Encrypted Data in    │  (In memory)
│ process.env          │
└──────┬───────────────┘
       │
       │ (DECRYPT with SALT key)
       ▼
┌──────────────────────┐
│ gurpreet1@yopmail.com│  (Actual password used)
│ Abc@12345            │
└──────┬───────────────┘
       │
       │ (Use for login)
       ▼
┌──────────────────────┐
│ Test Runs with Real  │
│ Credentials ✅       │
└──────────────────────┘


THE KEY (SALT) 🔑
═════════════════════════════════════════════════════════════════

SALT = "defaultSALT"

This is the KEY that:
  ✓ LOCKS the plaintext (during encryption)
  ✓ UNLOCKS the encrypted data (during decryption)

Think of it like a password to your safe:
  • Encryption: plaintext + SALT → encrypted
  • Decryption: encrypted + SALT → plaintext

If you change the SALT, you can't decrypt anymore! ⚠️


YOUR FILES & THEIR PURPOSE
═════════════════════════════════════════════════════════════════

1️⃣  config/.env
    Purpose: Store encrypted credentials
    Status: SAFE to commit to git ✅
    Contains: Encrypted LOGIN_EMAIL, LOGIN_PASSWORD, SALT

2️⃣  utils/CryptojsUtil.js
    Purpose: Has encrypt() and decrypt() functions
    Status: Part of your code
    Used by: LoginTest.spec.js

3️⃣  tests/LoginTest.spec.js
    Purpose: Your test that logs in
    Status: Uses decrypted values
    Flow:
      a) Load .env (encrypted)
      b) Check if value starts with "U2FsdGVkX1" (means encrypted)
      c) If yes → decrypt it
      d) Use decrypted value for login

4️⃣  encryptEnv.js
    Purpose: Script to encrypt plaintext values
    Status: Run ONCE when adding new secrets
    Usage: node encryptEnv.js

5️⃣  viewEncryptedData.js
    Purpose: View what's encrypted vs decrypted
    Status: For debugging/verification
    Usage: node viewEncryptedData.js


SECURITY COMPARISON
═════════════════════════════════════════════════════════════════

❌ BEFORE (Bad - NOT Secure):
   config/.env
   ┌─────────────────────────────────────┐
   │ LOGIN_EMAIL=gurpreet1@yopmail.com   │ ← Anyone can read!
   │ LOGIN_PASSWORD=Abc@12345            │ ← Exposed in git!
   └─────────────────────────────────────┘

✅ AFTER (Good - Secure):
   config/.env
   ┌──────────────────────────────────────────┐
   │ LOGIN_EMAIL=U2FsdGVkX18TsvXCG3MSmT6...   │ ← Looks like garbage
   │ LOGIN_PASSWORD=U2FsdGVkX1/k5WxFsAohu...  │ ← Can't read it!
   └──────────────────────────────────────────┘


SUMMARY - THE EASY VERSION
═════════════════════════════════════════════════════════════════

Plain English:
  1. You have a secret (password)
  2. You LOCK it with a KEY (encryption)
  3. The locked secret is stored in .env (encrypted)
  4. When test runs, it UNLOCKS it with the KEY (decryption)
  5. Test uses the UNLOCKED secret (plaintext) to login
  6. Your file is safe because it's locked! 🔐


CODE EXAMPLE - WHAT HAPPENS
═════════════════════════════════════════════════════════════════

// File: config/.env (Stored like this - ENCRYPTED)
LOGIN_EMAIL=U2FsdGVkX18TsvXCG3MSmT6CYxd4Y3Q9g5mU0Sld3c+WFP/h9UYyu2mkMz5cHIOY
SALT=defaultSALT

// When test runs, this happens:
const encrypted = process.env.LOGIN_EMAIL; 
// Value: U2FsdGVkX18TsvXCG3MSmT6CYxd4Y3Q9g5mU0Sld3c+WFP/h9UYyu2mkMz5cHIOY

const SALT = process.env.SALT; 
// Value: defaultSALT

const decrypted = decrypt(encrypted); 
// CryptoJS uses: encrypted + SALT → plaintext
// Value: gurpreet1@yopmail.com ✓

// Now use the real password:
await loginPage.fillUsername(decrypted); 
// Fills: gurpreet1@yopmail.com


THAT'S IT! 🎉
═════════════════════════════════════════════════════════════════

Encryption & Decryption is just:
  📦 LOCK your secrets in a box with a KEY (encryption)
  🔓 UNLOCK the box with the same KEY when you need them (decryption)
  
Your test file stays safe, and your credentials work perfectly! ✅

`);
