# 🧪 VibeWolf Security Scanner - Testing Guide

## 🎯 **Quick Test Checklist**

### ✅ **1. Icon Verification**
- [ ] Extension shows proper PNG icon in Extensions panel
- [ ] Icon displays clearly at different sizes
- [ ] VibeWolf shield and wolf design visible

### ✅ **2. Installation Test**
- [ ] Install `vibewolf-security-scanner-1.0.0.vsix`
- [ ] Extension activates without errors
- [ ] Welcome message appears: "🛡️ Windsurf Security Scanner activated!"

### ✅ **3. Functionality Test**
- [ ] Open `test-extension.js` (included in project)
- [ ] Run: `🐺 VibeWolf: Scan Current File`
- [ ] Verify 5 security issues are detected:
  - 1 CRITICAL: Hardcoded API key
  - 2 HIGH: XSS vulnerability, unsafe eval
  - 2 MEDIUM: Insecure HTTP, weak crypto

### ✅ **4. Real-Time Scanning**
- [ ] Type a hardcoded API key in a file
- [ ] Red squiggly lines appear immediately
- [ ] Hover tooltip shows fix recommendation

### ✅ **5. Command Palette**
- [ ] Press `Ctrl+Shift+P`
- [ ] All VibeWolf commands appear with 🐺 emoji:
  - `🐺 VibeWolf: Scan Current File`
  - `🐺 VibeWolf: Scan Entire Workspace`
  - `🐺 VibeWolf: Scan Selected Folder`
  - `🐺 VibeWolf: Generate Security Report`

### ✅ **6. Security Report**
- [ ] Run: `🐺 VibeWolf: Generate Security Report`
- [ ] HTML report opens in new tab
- [ ] Report shows vulnerability summary and details
- [ ] Report includes severity counts and file breakdown

### ✅ **7. Uninstall Test (CRITICAL)**
- [ ] Uninstall VibeWolf from Extensions panel
- [ ] **NO RESTART REQUIRED** ✅
- [ ] Reinstall immediately
- [ ] All functionality works perfectly
- [ ] No conflicts or errors

## 🔍 **Detailed Testing Scenarios**

### **Scenario 1: Coffee Profile App Testing**
```bash
# Test on your actual project
1. Open Coffee Profile App in Windsurf
2. Run: 🐺 VibeWolf: Scan Entire Workspace
3. Should find Firebase API key exposure
4. Should find other security issues
5. Generate security report
```

### **Scenario 2: Real-Time Detection**
```javascript
// Type this in a .js file and watch VibeWolf react:
const apiKey = "AIzaGyCuoc9mP3WqqRSOv8VY-vxXdVaWZE--BxU";
document.innerHTML = userInput + "<script>alert('xss')</script>";
eval("console.log('dangerous')");
```

### **Scenario 3: Multiple File Types**
- [ ] Test .js files
- [ ] Test .jsx files  
- [ ] Test .ts files
- [ ] Test .tsx files
- [ ] Test .html files
- [ ] Test .vue files
- [ ] Test .svelte files

## 🐛 **Troubleshooting**

### **If Extension Doesn't Activate:**
1. Check Windsurf Developer Console (`Help > Toggle Developer Tools`)
2. Look for VibeWolf activation messages
3. Verify no TypeScript compilation errors

### **If Scanning Doesn't Work:**
1. Ensure file has supported extension (.js, .jsx, .ts, .tsx, .html, .vue, .svelte)
2. Check if real-time scanning is enabled in settings
3. Try manual scan with Command Palette

### **If Uninstall Requires Restart:**
1. This should NOT happen with the new version
2. If it does, report as a bug
3. Check console for disposal errors

## 📊 **Expected Results**

### **test-extension.js Results:**
```
🎯 Expected VibeWolf detections:
- 1 CRITICAL: Hardcoded API key (line 8)
- 1 HIGH: XSS vulnerability (line 15)  
- 1 HIGH: Unsafe eval usage (line 20)
- 1 MEDIUM: Insecure HTTP request (line 24)
- 1 MEDIUM: Weak cryptography (line 28)
Total: 5 security issues
```

### **Coffee Profile App Results:**
```
Expected findings:
- Firebase API key exposure
- Potentially other security patterns
- Clean HTML security report generation
```

## ✅ **Success Criteria**

### **All Tests Pass:**
- [ ] Professional PNG icon displays correctly
- [ ] All 5 test vulnerabilities detected
- [ ] Real-time scanning works
- [ ] Security reports generate properly
- [ ] **Uninstall works without restart** 🎉
- [ ] Reinstall works immediately
- [ ] No console errors or warnings

### **Ready for Production:**
- [ ] Extension packages successfully (14.04 MB VSIX)
- [ ] All documentation updated
- [ ] Changelog created
- [ ] Testing guide completed

## 🎉 **Final Verification**

**The VibeWolf Security Scanner is ready for:**
- ✅ Distribution to other developers
- ✅ Professional use in development workflows  
- ✅ Integration with CI/CD pipelines
- ✅ Publication to VS Code Marketplace (if desired)

**Your guardian wolf is ready to protect developers worldwide!** 🐺🛡️
