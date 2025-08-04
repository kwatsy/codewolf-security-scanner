# CodeWolf Rebranding Checklist

## Overview
Rebranding from "VibeWolf" to "CodeWolf" - systematic approach to ensure nothing breaks.

## Files to Update

### 1. Package Configuration
- [x] `package.json` - name, displayName, description, repository URL
- [ ] `package-lock.json` - will auto-update when we reinstall

### 2. Source Code Files
- [x] `src/extension.ts` - class names, comments, output channel names
- [x] `src/scanner/security-scanner.ts` - class names, comments, branding
- [x] `src/interfaces/` - all interface files for naming consistency
- [x] `src/rules/` - all rule files for comments/branding
- [x] `src/templates/report-generator.ts` - HTML generation, branding
- [x] `src/utils/` - utility files for any branding references

### 3. Templates and Assets
- [x] `src/templates/report.html` - title, branding, CSS classes, wolf references
- [ ] Any icon files (if they exist)
- [ ] CSS styling references

### 4. Documentation
- [x] `README.md` - all references, installation instructions, examples
- [x] `CHANGELOG.md` - add rebrand entry
- [ ] Any other .md files

### 5. Configuration Files
- [ ] `.vscode/launch.json` - debug configuration names
- [ ] `tsconfig.json` - check for any path references
- [ ] `.gitignore` - verify no VibeWolf-specific entries

## Text Replacements Needed

### Case-sensitive replacements:
- `VibeWolf` → `CodeWolf`
- `vibewolf` → `codewolf`
- `VIBEWOLF` → `CODEWOLF`
- `vibe-wolf` → `code-wolf`

### Specific terms to check:
- Extension display name
- Output channel names
- CSS class names
- HTML titles and headers
- Command palette entries
- Configuration section names

## Testing Checklist
- [x] Extension compiles without errors
- [ ] Extension loads in VS Code
- [ ] All commands work (scan, generate report)
- [ ] HTML report generates correctly
- [ ] Branding appears correctly in UI
- [ ] No broken references or missing assets

## Version Update
- [x] Bump version to 2.0.0 to mark major rebrand
- [x] Update changelog with rebrand details

## Post-Rebrand Tasks
- [ ] Test full extension functionality
- [ ] Generate sample report to verify branding
- [ ] Update any external documentation
- [ ] Consider GitHub repository rename

## Notes
- Keep backup of current working version
- Test after each major file group update
- Verify no hardcoded "vibewolf" strings remain
