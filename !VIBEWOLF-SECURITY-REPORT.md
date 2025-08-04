# 🐺 VibeWolf Security Report

> **Project:** windsurf-security-scanner  
> **Scan Date:** 8/4/2025, 3:37:43 PM  
> **Guardian Wolf Status:** 🛡️ 61 Issues Found

## 📊 Security Overview

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 16 | ⚠️ Immediate Action Required |
| 🟠 High | 14 | 🔧 Fix Before Deployment |
| 🟡 Medium | 31 | 📋 Review Recommended |
| 🔵 Low | 0 | ✅ Clear |

## 🔴 CRITICAL Issues (16) - URGENT

### 1. scanner.js 🚨

**📁 Location:** `out/scanner.js:37`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'insertAdjacentHTML\\s*\\([^)]*\\+',
```

---

### 2. scanner.js 🚨

**📁 Location:** `out/scanner.js:193`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'SELECT.*?\\+.*?["\']',
```

---

### 3. scanner.js 🚨

**📁 Location:** `out/scanner.js:194`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'INSERT.*?\\+.*?["\']',
```

---

### 4. scanner.js 🚨

**📁 Location:** `out/scanner.js:195`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'UPDATE.*?\\+.*?["\']',
```

---

### 5. scanner.js 🚨

**📁 Location:** `out/scanner.js:196`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'DELETE.*?\\+.*?["\']',
```

---

### 6. scanner.js 🚨

**📁 Location:** `out/scanner.js:199`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'WHERE.*?\\+.*?["\']',
```

---

### 7. scanner.js 🚨

**📁 Location:** `out/scanner.js:200`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'ORDER BY.*?\\+.*?["\']'
```

---

### 8. security-report.html 🚨

**📁 Location:** `security-report.html:70`

**🔍 Issue Type:** EXPOSED SECRETS

**📝 Description:** Hardcoded secrets, credentials, or sensitive data exposed in frontend code

**💻 Code:**
```javascript
<div class="code">apiKey: "AIzaGxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",</div>
```

---

### 9. scanner.ts 🚨

**📁 Location:** `src/scanner.ts:57`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'insertAdjacentHTML\\s*\\([^)]*\\+',
```

---

### 10. scanner.ts 🚨

**📁 Location:** `src/scanner.ts:245`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'SELECT.*?\\+.*?["\']',
```

---

### 11. scanner.ts 🚨

**📁 Location:** `src/scanner.ts:246`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'INSERT.*?\\+.*?["\']',
```

---

### 12. scanner.ts 🚨

**📁 Location:** `src/scanner.ts:247`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'UPDATE.*?\\+.*?["\']',
```

---

### 13. scanner.ts 🚨

**📁 Location:** `src/scanner.ts:248`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'DELETE.*?\\+.*?["\']',
```

---

### 14. scanner.ts 🚨

**📁 Location:** `src/scanner.ts:251`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'WHERE.*?\\+.*?["\']',
```

---

### 15. scanner.ts 🚨

**📁 Location:** `src/scanner.ts:252`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'ORDER BY.*?\\+.*?["\']'
```

---

### 16. test-extension.js 🚨

**📁 Location:** `test-extension.js:8`

**🔍 Issue Type:** EXPOSED SECRETS

**📝 Description:** Hardcoded secrets, credentials, or sensitive data exposed in frontend code

**💻 Code:**
```javascript
apiKey: "AIzaGxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
```


## 🟠 HIGH Issues (14) - HIGH PRIORITY

### 1. create-real-png.js ⚠️

**📁 Location:** `create-real-png.js:27`

**🔍 Issue Type:** WEAK CRYPTO

**📝 Description:** Weak cryptographic algorithm detected

**💻 Code:**
```javascript
const crc = require('crypto').createHash('md5').update(ihdr.slice(4, 21)).digest();
```

---

### 2. scanner.js ⚠️

**📁 Location:** `out/scanner.js:126`

**🔍 Issue Type:** UNSAFE EVAL

**📝 Description:** Unsafe code execution detected

**💻 Code:**
```javascript
// Unsafe eval() usage (improved Firebase Functions exclusion)
```

---

### 3. scanner.js ⚠️

**📁 Location:** `out/scanner.js:208`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'Access-Control-Allow-Origin.*?\\*',
```

---

### 4. scanner.js ⚠️

**📁 Location:** `out/scanner.js:209`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'cors.*?origin.*?true',
```

---

### 5. scanner.js ⚠️

**📁 Location:** `out/scanner.js:210`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'allowedOrigins.*?\\*',
```

---

### 6. scanner.js ⚠️

**📁 Location:** `out/scanner.js:211`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'Access-Control-Allow-Credentials.*?true.*?\\*'
```

---

### 7. scanner.ts ⚠️

**📁 Location:** `src/scanner.ts:166`

**🔍 Issue Type:** UNSAFE EVAL

**📝 Description:** Unsafe code execution detected

**💻 Code:**
```javascript
// Unsafe eval() usage (improved Firebase Functions exclusion)
```

---

### 8. scanner.ts ⚠️

**📁 Location:** `src/scanner.ts:262`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'Access-Control-Allow-Origin.*?\\*',
```

---

### 9. scanner.ts ⚠️

**📁 Location:** `src/scanner.ts:263`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'cors.*?origin.*?true',
```

---

### 10. scanner.ts ⚠️

**📁 Location:** `src/scanner.ts:264`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'allowedOrigins.*?\\*',
```

---

### 11. scanner.ts ⚠️

**📁 Location:** `src/scanner.ts:265`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'Access-Control-Allow-Credentials.*?true.*?\\*'
```

---

### 12. test-extension.js ⚠️

**📁 Location:** `test-extension.js:14`

**🔍 Issue Type:** XSS VULNERABILITIES

**📝 Description:** Potential XSS vulnerability through dynamic HTML injection

**💻 Code:**
```javascript
document.getElementById('content').innerHTML = userInput + '<p>Welcome!</p>';
```

---

### 13. test-extension.js ⚠️

**📁 Location:** `test-extension.js:19`

**🔍 Issue Type:** UNSAFE EVAL

**📝 Description:** Unsafe code execution detected

**💻 Code:**
```javascript
eval(code); // Dangerous!
```

---

### 14. test-extension.js ⚠️

**📁 Location:** `test-extension.js:29`

**🔍 Issue Type:** WEAK CRYPTO

**📝 Description:** Weak cryptographic algorithm detected

**💻 Code:**
```javascript
const hash = crypto.createHash('md5').update('password').digest('hex');
```


## 🟡 MEDIUM Issues (31) - MODERATE

### 1. create-logo.js ⚡

**📁 Location:** `create-logo.js:5`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
const logoSvg = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
```

---

### 2. scanner.js ⚡

**📁 Location:** `out/scanner.js:96`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow read, write: if true',
```

---

### 3. scanner.js ⚡

**📁 Location:** `out/scanner.js:97`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow.*if.*true',
```

---

### 4. scanner.js ⚡

**📁 Location:** `out/scanner.js:100`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'firebase-admin.*apiKey',
```

---

### 5. scanner.js ⚡

**📁 Location:** `out/scanner.js:101`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'serviceAccountKey',
```

---

### 6. scanner.js ⚡

**📁 Location:** `out/scanner.js:106`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'cors.*origin.*\\*'
```

---

### 7. scanner.js ⚡

**📁 Location:** `out/scanner.js:116`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'serviceAccountKey.*private_key',
```

---

### 8. scanner.js ⚡

**📁 Location:** `out/scanner.js:119`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow read, write: if true',
```

---

### 9. scanner.js ⚡

**📁 Location:** `out/scanner.js:120`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow.*if.*true.*firestore',
```

---

### 10. scanner.js ⚡

**📁 Location:** `out/scanner.js:144`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'http://(?!localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0)',
```

---

### 11. scanner.js ⚡

**📁 Location:** `out/scanner.js:145`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'fetch\\s*\\(\\s*.*http://',
```

---

### 12. scanner.js ⚡

**📁 Location:** `out/scanner.js:146`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'axios\\.(get|post|put|delete)\\s*\\(.*http://',
```

---

### 13. scanner.js ⚡

**📁 Location:** `out/scanner.js:147`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'XMLHttpRequest.*?open\\([^)]*http://'
```

---

### 14. scanner.js ⚡

**📁 Location:** `out/scanner.js:209`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'cors.*?origin.*?true',
```

---

### 15. security-report.html ⚡

**📁 Location:** `security-report.html:37`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
<div class="code">url = `http://api.example.com/search?q=${query}`;</div>
```

---

### 16. security-report.html ⚡

**📁 Location:** `security-report.html:48`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
<div class="code">url = `http://api.example.com/search?q=${query}`;</div>
```

---

### 17. security-report.html ⚡

**📁 Location:** `security-report.html:59`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
<div class="code">fetch(`http://api.example.com/search?q=${term}`);</div>
```

---

### 18. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:128`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow read, write: if true',
```

---

### 19. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:129`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow.*if.*true',
```

---

### 20. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:133`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'firebase-admin.*apiKey',
```

---

### 21. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:134`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'serviceAccountKey',
```

---

### 22. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:141`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'cors.*origin.*\\*'
```

---

### 23. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:153`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'serviceAccountKey.*private_key',
```

---

### 24. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:157`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow read, write: if true',
```

---

### 25. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:158`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow.*if.*true.*firestore',
```

---

### 26. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:188`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'http://(?!localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0)',
```

---

### 27. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:189`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'fetch\\s*\\(\\s*.*http://',
```

---

### 28. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:190`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'axios\\.(get|post|put|delete)\\s*\\(.*http://',
```

---

### 29. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:191`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'XMLHttpRequest.*?open\\([^)]*http://'
```

---

### 30. scanner.ts ⚡

**📁 Location:** `src/scanner.ts:263`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'cors.*?origin.*?true',
```

---

### 31. test-extension.js ⚡

**📁 Location:** `test-extension.js:23`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
fetch('http://api.example.com/data')
```


## 🎯 Action Plan

### 🚨 CRITICAL VULNERABILITIES DETECTED
**16 critical security issue(s) found**

### ⚠️ HIGH RISK VULNERABILITIES
**14 high-risk security issue(s) detected**

### 📋 ADDITIONAL VULNERABILITIES
**31 medium/low security issue(s) detected**

---

## 🐺 About VibeWolf

**VibeWolf Security Scanner** - The Guardian Wolf for Developers

- 🎯 **83% Noise Reduction** - Only flags real security issues
- 🎛️ **Interactive Management** - Right-click to manage issues
- 📊 **Triple Output** - Visual + Terminal + This Report

*"No developer should accidentally expose their secrets to the world."* 🛡️

---

**Generated by VibeWolf v1.0.8** | [Buy me a coffee](https://buymeacoffee.com/watsy) ☕

---
*Generated by VibeWolf Security Scanner - Your Guardian Wolf 🐺*
