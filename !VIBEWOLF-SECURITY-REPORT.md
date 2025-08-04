# 🐺 VibeWolf Security Report

> **Project:** windsurf-security-scanner  
> **Scan Date:** 8/5/2025, 2:58:44 AM  
> **Guardian Wolf Status:** 🛡️ 61 Issues Found

## 📊 Security Overview

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 16 | ⚠️ Immediate Action Required |
| 🟠 High | 12 | 🔧 Fix Before Deployment |
| 🟡 Medium | 33 | 📋 Review Recommended |
| 🔵 Low | 0 | ✅ Clear |

## 🔴 CRITICAL Issues (16) - URGENT

### 1. injection-rules.js 🚨

**📁 Location:** `out/rules/injection-rules.js:7`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'SELECT.*?\\+.*?["\']',
```

---

### 2. injection-rules.js 🚨

**📁 Location:** `out/rules/injection-rules.js:8`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'INSERT.*?\\+.*?["\']',
```

---

### 3. injection-rules.js 🚨

**📁 Location:** `out/rules/injection-rules.js:9`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'UPDATE.*?\\+.*?["\']',
```

---

### 4. injection-rules.js 🚨

**📁 Location:** `out/rules/injection-rules.js:10`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'DELETE.*?\\+.*?["\']',
```

---

### 5. injection-rules.js 🚨

**📁 Location:** `out/rules/injection-rules.js:13`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'WHERE.*?\\+.*?["\']',
```

---

### 6. injection-rules.js 🚨

**📁 Location:** `out/rules/injection-rules.js:14`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'ORDER BY.*?\\+.*?["\']'
```

---

### 7. xss-rules.js 🚨

**📁 Location:** `out/rules/xss-rules.js:9`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'insertAdjacentHTML\\s*\\([^)]*\\+',
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

### 9. injection-rules.ts 🚨

**📁 Location:** `src/rules/injection-rules.ts:6`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'SELECT.*?\\+.*?["\']',
```

---

### 10. injection-rules.ts 🚨

**📁 Location:** `src/rules/injection-rules.ts:7`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'INSERT.*?\\+.*?["\']',
```

---

### 11. injection-rules.ts 🚨

**📁 Location:** `src/rules/injection-rules.ts:8`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'UPDATE.*?\\+.*?["\']',
```

---

### 12. injection-rules.ts 🚨

**📁 Location:** `src/rules/injection-rules.ts:9`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'DELETE.*?\\+.*?["\']',
```

---

### 13. injection-rules.ts 🚨

**📁 Location:** `src/rules/injection-rules.ts:12`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'WHERE.*?\\+.*?["\']',
```

---

### 14. injection-rules.ts 🚨

**📁 Location:** `src/rules/injection-rules.ts:13`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'ORDER BY.*?\\+.*?["\']'
```

---

### 15. xss-rules.ts 🚨

**📁 Location:** `src/rules/xss-rules.ts:8`

**🔍 Issue Type:** SQL INJECTION

**📝 Description:** Potential SQL injection vulnerability detected

**💻 Code:**
```javascript
'insertAdjacentHTML\\s*\\([^)]*\\+',
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


## 🟠 HIGH Issues (12) - HIGH PRIORITY

### 1. create-real-png.js ⚠️

**📁 Location:** `create-real-png.js:27`

**🔍 Issue Type:** WEAK CRYPTO

**📝 Description:** Weak cryptographic algorithm detected

**💻 Code:**
```javascript
const crc = require('crypto').createHash('md5').update(ihdr.slice(4, 21)).digest();
```

---

### 2. security-rules.js ⚠️

**📁 Location:** `out/rules/security-rules.js:73`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'Access-Control-Allow-Origin.*?\\*',
```

---

### 3. security-rules.js ⚠️

**📁 Location:** `out/rules/security-rules.js:74`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'cors.*?origin.*?true',
```

---

### 4. security-rules.js ⚠️

**📁 Location:** `out/rules/security-rules.js:75`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'allowedOrigins.*?\\*',
```

---

### 5. security-rules.js ⚠️

**📁 Location:** `out/rules/security-rules.js:76`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'Access-Control-Allow-Credentials.*?true.*?\\*'
```

---

### 6. security-rules.ts ⚠️

**📁 Location:** `src/rules/security-rules.ts:82`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'Access-Control-Allow-Origin.*?\\*',
```

---

### 7. security-rules.ts ⚠️

**📁 Location:** `src/rules/security-rules.ts:83`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'cors.*?origin.*?true',
```

---

### 8. security-rules.ts ⚠️

**📁 Location:** `src/rules/security-rules.ts:84`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'allowedOrigins.*?\\*',
```

---

### 9. security-rules.ts ⚠️

**📁 Location:** `src/rules/security-rules.ts:85`

**🔍 Issue Type:** CORS ISSUES

**📝 Description:** Insecure CORS configuration detected

**💻 Code:**
```javascript
'Access-Control-Allow-Credentials.*?true.*?\\*'
```

---

### 10. test-extension.js ⚠️

**📁 Location:** `test-extension.js:14`

**🔍 Issue Type:** XSS VULNERABILITIES

**📝 Description:** Potential XSS vulnerability through dynamic HTML injection

**💻 Code:**
```javascript
document.getElementById('content').innerHTML = userInput + '<p>Welcome!</p>';
```

---

### 11. test-extension.js ⚠️

**📁 Location:** `test-extension.js:19`

**🔍 Issue Type:** UNSAFE EVAL

**📝 Description:** Unsafe code execution detected

**💻 Code:**
```javascript
eval(code); // Dangerous!
```

---

### 12. test-extension.js ⚠️

**📁 Location:** `test-extension.js:29`

**🔍 Issue Type:** WEAK CRYPTO

**📝 Description:** Weak cryptographic algorithm detected

**💻 Code:**
```javascript
const hash = crypto.createHash('md5').update('password').digest('hex');
```


## 🟡 MEDIUM Issues (33) - MODERATE

### 1. create-logo.js ⚡

**📁 Location:** `create-logo.js:5`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
const logoSvg = `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
```

---

### 2. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:8`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow read, write: if true',
```

---

### 3. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:9`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow.*if.*true',
```

---

### 4. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:12`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'firebase-admin.*apiKey',
```

---

### 5. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:13`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'serviceAccountKey',
```

---

### 6. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:18`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'cors.*origin.*\\*'
```

---

### 7. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:26`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'serviceAccountKey.*private_key',
```

---

### 8. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:27`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'admin\\.initializeApp\\(\\{[^}]*serviceAccountKey',
```

---

### 9. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:29`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow read, write: if true',
```

---

### 10. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:30`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow.*if.*true.*firestore',
```

---

### 11. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:39`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'http://(?!localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0)',
```

---

### 12. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:40`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'fetch\\s*\\(\\s*.*http://',
```

---

### 13. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:41`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'axios\\.(get|post|put|delete)\\s*\\(.*http://',
```

---

### 14. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:42`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'XMLHttpRequest.*?open\\([^)]*http://'
```

---

### 15. security-rules.js ⚡

**📁 Location:** `out/rules/security-rules.js:74`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'cors.*?origin.*?true',
```

---

### 16. security-report.html ⚡

**📁 Location:** `security-report.html:37`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
<div class="code">url = `http://api.example.com/search?q=${query}`;</div>
```

---

### 17. security-report.html ⚡

**📁 Location:** `security-report.html:48`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
<div class="code">url = `http://api.example.com/search?q=${query}`;</div>
```

---

### 18. security-report.html ⚡

**📁 Location:** `security-report.html:59`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
<div class="code">fetch(`http://api.example.com/search?q=${term}`);</div>
```

---

### 19. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:7`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow read, write: if true',
```

---

### 20. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:8`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow.*if.*true',
```

---

### 21. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:12`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'firebase-admin.*apiKey',
```

---

### 22. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:13`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'serviceAccountKey',
```

---

### 23. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:20`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'cors.*origin.*\\*'
```

---

### 24. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:29`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'serviceAccountKey.*private_key',
```

---

### 25. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:30`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'admin\\.initializeApp\\(\\{[^}]*serviceAccountKey',
```

---

### 26. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:33`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow read, write: if true',
```

---

### 27. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:34`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'allow.*if.*true.*firestore',
```

---

### 28. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:45`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'http://(?!localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0)',
```

---

### 29. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:46`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'fetch\\s*\\(\\s*.*http://',
```

---

### 30. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:47`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'axios\\.(get|post|put|delete)\\s*\\(.*http://',
```

---

### 31. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:48`

**🔍 Issue Type:** INSECURE HTTP

**📝 Description:** Insecure HTTP requests detected

**💻 Code:**
```javascript
'XMLHttpRequest.*?open\\([^)]*http://'
```

---

### 32. security-rules.ts ⚡

**📁 Location:** `src/rules/security-rules.ts:83`

**🔍 Issue Type:** FIREBASE SECURITY

**📝 Description:** Firebase configuration should use environment variables for better security practices

**💻 Code:**
```javascript
'cors.*?origin.*?true',
```

---

### 33. test-extension.js ⚡

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
**12 high-risk security issue(s) detected**

### 📋 ADDITIONAL VULNERABILITIES
**33 medium/low security issue(s) detected**

---

## 🐺 About CodeWolf

**CodeWolf Security Scanner** - The Guardian Wolf for Developers

- 🎯 **83% Noise Reduction** - Only flags real security issues
- 🎛️ **Interactive Management** - Right-click to manage issues
- 📊 **Triple Output** - Visual + Terminal + This Report

*"No developer should accidentally expose their secrets to the world."* 🛡️

---

**Generated by CodeWolf v2.0.0** | [Support on Ko-fi](https://ko-fi.com/watsy) ☕

---
*Generated by CodeWolf Security Scanner - Your Guardian Wolf 🐺*
