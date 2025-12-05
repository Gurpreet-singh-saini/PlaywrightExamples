# 🔐 Encryption & Decryption Flow - Easy Explanation

## **Simple Analogy: LOCKED BOX WITH A KEY**

Imagine you have a secret note:
- **Plaintext (Secret)**: `gurpreet1@yopmail.com`
- **Lock it in a box with KEY**: `defaultSALT`
- **Encrypted (Locked Box)**: `U2FsdGVkX18TsvXCG3MSmT6...` (looks like garbage)
- **Unlock it with same KEY**: `defaultSALT`
- **Decrypted (Secret revealed)**: `gurpreet1@yopmail.com` ✓

---

## **Step-by-Step Flow**

### **STEP 1: BEFORE (Plain Secrets)**
```
config/.env (UNSAFE)
├── LOGIN_EMAIL=gurpreet1@yopmail.com   ← Can see password!
├── LOGIN_PASSWORD=Abc@12345            ← Can see password!
└── SALT=defaultSALT
```

### **STEP 2: ENCRYPTION (Lock the box)**
```
Run: node encryptEnv.js

Input:  gurpreet1@yopmail.com + defaultSALT
        ↓ (encrypt)
Output: U2FsdGVkX18TsvXCG3MSmT6CYxd4Y3Q9g5mU0Sld3c+WFP/h9UYyu2mkMz5cHIOY
```

### **STEP 3: AFTER (Encrypted Secrets)**
```
config/.env (SAFE)
├── LOGIN_EMAIL=U2FsdGVkX18TsvXCG3MSmT6...   ← Looks like garbage!
├── LOGIN_PASSWORD=U2FsdGVkX1/k5WxFsAohu...  ← Looks like garbage!
└── SALT=defaultSALT                         ← Key stays plain
```

### **STEP 4: TEST RUNS (Unlock the box)**
```
Test starts: npx playwright test
   ↓
Read .env file
   ├── LOGIN_EMAIL = U2FsdGVkX18TsvXCG3MSmT6... (encrypted)
   ├── LOGIN_PASSWORD = U2FsdGVkX1/k5WxFsAohu... (encrypted)
   └── SALT = defaultSALT (key)
   ↓
Check: Does it start with "U2FsdGVkX1"? YES → It's encrypted!
   ↓
Decrypt using SALT key
   ├── Email decrypted ✓ → gurpreet1@yopmail.com
   └── Password decrypted ✓ → Abc@12345
   ↓
Use real credentials
   ├── Fill email field: gurpreet1@yopmail.com
   ├── Fill password field: Abc@12345
   └── Click Sign In button
   ↓
Test completes ✅
```

---

## **The Three Key Components**

| Component | Purpose | Example |
|-----------|---------|---------|
| **PLAINTEXT** | Your real secret | `gurpreet1@yopmail.com` |
| **SALT (Key)** | Encryption/Decryption key | `defaultSALT` |
| **ENCRYPTED** | Locked version (what's stored) | `U2FsdGVkX18TsvXCG3MSmT6...` |

---

## **Why This is Secure?**

❌ **Before (Unsafe)**
```
Anyone who opens .env can see your password:
├── LOGIN_EMAIL=gurpreet1@yopmail.com   ← EXPOSED!
└── LOGIN_PASSWORD=Abc@12345            ← EXPOSED!
```

✅ **After (Safe)**
```
Even if someone opens .env, they see garbage:
├── LOGIN_EMAIL=U2FsdGVkX18TsvXCG3MSmT6...   ← Can't read it
└── LOGIN_PASSWORD=U2FsdGVkX1/k5WxFsAohu...  ← Can't read it
```

Without the SALT key, they can't decrypt it! 🔒

---

## **Your Files & What They Do**

```
📁 project/
├── config/
│   └── .env                      ← Stores ENCRYPTED credentials
│
├── utils/
│   └── CryptojsUtil.js           ← Has encrypt() and decrypt() functions
│
├── tests/
│   └── LoginTest.spec.js         ← Reads .env, decrypts, uses credentials
│
└── encryptEnv.js                 ← One-time script to encrypt secrets
```

---

## **What Happens Inside Each File**

### **1️⃣ config/.env (Stores encrypted data)**
```javascript
LOGIN_EMAIL=U2FsdGVkX18TsvXCG3MSmT6CYxd4Y3Q9g5mU0Sld3c+WFP/h9UYyu2mkMz5cHIOY
LOGIN_PASSWORD=U2FsdGVkX1/k5WxFsAohuRNMQsbreRJO3CLon5uhdug=
SALT=defaultSALT
```

### **2️⃣ utils/CryptojsUtil.js (Decrypts data)**
```javascript
function decrypt(cipherText) {
  const SALT = process.env.SALT || "defaultSALT";  // Get the KEY
  const bytes = CryptoJS.AES.decrypt(cipherText, SALT);  // Unlock with key
  return bytes.toString(CryptoJS.enc.Utf8);  // Convert to readable text
}
```

### **3️⃣ tests/LoginTest.spec.js (Uses decrypted data)**
```javascript
let username = process.env.LOGIN_EMAIL;  // Read: U2FsdGVkX18TsvXCG3...

// Check if it's encrypted
if (username && username.startsWith("U2FsdGVkX1")) {
  username = decrypt(username);  // Decrypt it!
  // Now username = gurpreet1@yopmail.com ✓
}

await loginPage.fillUsername(username);  // Use real password
```

---

## **Visual Flow Diagram**

```
┌──────────────────┐
│ Your Password    │
│ gurpreet1@....   │
└────────┬─────────┘
         │
         │ (ENCRYPT with SALT)
         ▼
┌────────────────────────┐
│ Encrypted             │
│ U2FsdGVkX18TsvX...    │
│ Saved in .env file    │
└────────┬───────────────┘
         │
         │ (TEST RUNS)
         ▼
┌────────────────────────┐
│ Read .env file         │
│ Get encrypted value    │
└────────┬───────────────┘
         │
         │ (DECRYPT with SALT)
         ▼
┌────────────────────────┐
│ Your Password          │
│ gurpreet1@....         │
│ Ready to use! ✓        │
└────────┬───────────────┘
         │
         │ (USE FOR LOGIN)
         ▼
┌────────────────────────┐
│ Test fills form         │
│ Test logs in ✅         │
└────────────────────────┘
```

---

## **Key Points to Remember**

✅ **SALT** = The KEY that locks and unlocks  
✅ **Encryption** = Turning readable text into garbage  
✅ **Decryption** = Turning garbage back into readable text  
✅ **Your .env file** = Safe to commit because it's encrypted  
✅ **During test** = Everything is decrypted in memory (temporary)  

---

## **Why AES Encryption?**

AES is a strong encryption method used by banks and governments. It's very hard to break without the correct SALT key. That's why your .env file is safe even if someone sees it!

---

## **TLDR (Too Long, Didn't Read)**

1. **Encryption**: `password + SALT` → `U2FsdGVkX1...` (locked)
2. **Storage**: Save locked version in .env (safe!)
3. **Decryption**: `U2FsdGVkX1... + SALT` → `password` (unlocked)
4. **Usage**: Use decrypted password in your test
5. **Result**: Secure credentials + working tests ✅
