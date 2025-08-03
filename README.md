# 🐺 VibeWolf Security Scanner

**The Guardian Wolf for "Vibe" Developers** 🛡️

## 🎆 **Mission**

Being a "Vibe Code Developer" myself I know the pitfalls of unprotected projects. 

VibeWolf protects "Vibe Code Developers" and seasoned developers from the dangerous implications of publishing apps with exposed APIs, hardcoded secrets, and security vulnerabilities to app stores. 

**VibeWolf is designed to be used BEFORE backend migration and app store deployment - not during active development!**

📝 **Developer-Friendly Approach:**
- ✅ **Silent during development** - No annoying real-time warnings
- ✅ **On-demand scanning** - Scan when YOU'RE ready
- ✅ **Pre-deployment focus** - Perfect for final security audits
- ✅ **App store preparation** - Catch issues before submission

## ⚡ **What VibeWolf Catches**

### 🔴 **Critical Threats:**
- **Hardcoded API Keys** - Exposed Firebase, Google Maps, payment keys
- **Database Credentials** - MongoDB, PostgreSQL connection strings  
- **Authentication Secrets** - JWT secrets, OAuth tokens
- **Insecure Firebase Rules** - `allow read, write: if true`

### 🟠 **High-Risk Issues:**
- **XSS Vulnerabilities** - Dynamic HTML injection
- **Code Injection** - `eval()`, `Function()` usage
- **Weak Cryptography** - MD5, SHA1 algorithms
- **CORS Misconfigurations** - Wildcard origins with credentials

### 🟡 **Security Best Practices:**
- **Insecure Storage** - Passwords in localStorage
- **HTTP vs HTTPS** - Unencrypted API calls
- **Timing Attacks** - Unsafe string comparisons

## 🚀 **Features**

### 🎯 **83% Noise Reduction - Industry-Leading Accuracy:**
- ✅ **Smart detection** - Only flags REAL security issues, not false positives
- ✅ **Context-aware scanning** - Understands React, Vue, Angular patterns
- ✅ **Refined algorithms** - No more `userProfile`, `useState` false alarms
- ✅ **Professional results** - From 23 false positives down to 4 real issues

### 🎛️ **Interactive Issue Management:**
- ✅ **Right-click dropdowns** - Manage any VibeWolf issue directly in Problems tab
- ✅ **Smart ignore options** - This instance, this file, or project-wide
- ✅ **Whitelist patterns** - Add similar patterns to prevent future flags
- ✅ **Detailed fix guides** - Step-by-step security remediation instructions
- ✅ **False positive reporting** - Help improve VibeWolf detection

### 📊 **Triple Output System:**
- ✅ **Visual Problems panel** - Red/yellow squiggly lines with hover details
- ✅ **Terminal output** - Professional VibeWolf-branded scan results
- ✅ **Markdown reports** - Auto-generated `!VIBEWOLF-SECURITY-REPORT.md`
- ✅ **Top-visible files** - Reports appear at top of file explorer

### 🎯 **Configurable Vulnerability Detection:**
- ✅ **Enable/disable specific types** - Turn off Firebase, HTTP, XSS checks per project
- ✅ **Severity filtering** - Show only HIGH/CRITICAL issues if desired
- ✅ **Tech stack adaptation** - Configure for React, Vue, Angular, Node.js
- ✅ **Team consistency** - Share configuration across development teams

### **Command Palette:**
- `🐺 VibeWolf: Scan Current File`
- `🐺 VibeWolf: Scan Entire Workspace` 
- `🐺 VibeWolf: Scan Selected Folder`
- `🐺 VibeWolf: Generate Security Report`

### **Security Panel:**
🐺 VibeWolf Security Issues (12) ├── 📁 src/components/Login.jsx (3) │ ├── 🔴 Line 23: Hardcoded API key detected │ ├── 🟠 Line 45: XSS vulnerability in innerHTML │ └── 🟡 Line 67: Insecure HTTP request


## 📊 **Perfect for:**

### **🆕 New Developers:**
- Learn security best practices early
- Avoid costly mistakes before app store submission
- Understand why certain patterns are dangerous

### **🏢 Development Teams:**
- Enforce security standards across projects
- Catch vulnerabilities in code reviews
- Generate security reports for compliance

### **📱 Mobile App Developers:**
- React Native security scanning
- Firebase configuration validation
- API key exposure prevention

## 📅 **Recommended Workflow**

### **🟢 During Development (VibeWolf Silent):**
1. **Code freely** with APIs, passwords, and test data
2. **Focus on functionality** without security interruptions
3. **Use hardcoded values** for rapid prototyping
4. **VibeWolf stays quiet** - no annoying warnings!

### **🟡 Pre-Deployment Phase (Activate VibeWolf):**
1. **Ready for backend migration?** Time to scan!
2. **Run:** `🐺 VibeWolf: Scan Entire Workspace`
3. **Review security issues** found by VibeWolf
4. **Fix critical issues** before moving secrets to backend

### **🔴 App Store Preparation (Final Scan):**
1. **Backend migration complete?** Final security check!
2. **Generate security report** for compliance
3. **Verify no secrets** remain in frontend code
4. **Deploy with confidence** to app stores!

## 🛡️ **Why VibeWolf Matters**

**Real Example from Testing:**
```javascript
// ❌ CRITICAL - This would be exposed in your published app!
const firebaseConfig = {
  apiKey: "AIzaGxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx"
};
VibeWolf immediately warns:

🔴 Critical: Hardcoded secrets exposed in frontend code
💡 Fix: Move secrets to server-side or use environment variables
🎉 Success Stories
Coffee Profile App Scan Results:

✅ Found 7 vulnerabilities (1 Critical, 3 High, 3 Medium)
✅ Prevented Firebase API key exposure
✅ Caught unsafe eval() usage in 3 files
✅ Generated detailed HTML security report
🔧 Installation
Package the extension:
bash
npm install -g vsce
vsce package
Install in Windsurf:
Open Windsurf
Press Ctrl+Shift+P
Type "Extensions: Install from VSIX"
Select your .vsix file
Start protecting your code! 🐺⚡
🌟 The VibeWolf Promise
"No developer should accidentally expose their secrets to the world."

VibeWolf is your guardian wolf - always watching, always protecting, ensuring your apps are secure before they reach millions of users.

☕ Support VibeWolf
VibeWolf is completely FREE and always will be! 🎉

If VibeWolf has saved you from a security disaster or helped protect your app, consider buying me a coffee! ☕

Buy Me A Coffee

Every coffee helps:

🐺 Keep VibeWolf updated with new vulnerability patterns
🛡️ Add support for more frameworks and languages
⚡ Improve scanning performance and accuracy
📚 Create more security education content
Your support keeps the guardian wolf strong! 🐺💪

📜 License
MIT License - Use VibeWolf freely in personal and commercial projects!

Built with ❤️ for the "Vibe Coder" Developer Community
Protect. Secure. Ship with confidence. 🐺🛡️

"No developer should accidentally expose their secrets to the world."

