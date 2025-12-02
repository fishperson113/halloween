# Implementation Plan

- [x] 1. Verify and correct package.json path references





  - Check current path for product icon theme in package.json
  - Update path from `./product-icons/product-icon-theme.json` to `./themes/product-icon-theme.json` if needed
  - Verify color theme path is correct
  - Validate package.json structure has no "main", "activationEvents", or "commands" fields
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 3.3_

- [ ]* 1.1 Write property test for package.json validation
  - **Property 1: Package.json contains no code-related fields**
  - **Property 2: Package.json contributes section contains only theme contributions**
  - **Property 3: Package.json specifies valid VSCode engine version**
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

- [ ]* 1.2 Write property test for theme path validation
  - **Property 5: All package.json theme paths reference existing files**
  - **Validates: Requirements 3.1, 3.2, 3.3**
- [x] 2. Verify product icon theme font paths




- [ ] 2. Verify product icon theme font paths

  - Open themes/product-icon-theme.json
  - Verify font path references `./kiroween-icons.ttf` (relative to the JSON file)
  - Confirm kiroween-icons.ttf exists in themes/ directory
  - _Requirements: 3.5_

- [ ]* 2.1 Write property test for icon font path validation
  - **Property 6: Product icon theme font paths are valid**
  - **Validates: Requirements 3.5**
-

- [x] 3. Clean up build artifacts




  - Check for and remove package-lock.json if it exists
  - Verify no extension.js or extension.ts files exist
  - Verify no out/ directory exists
  - Verify no node_modules/ directory exists
  - Document current clean state
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 3.1 Write property test for build artifact detection
  - **Property 4: Project root contains no build artifacts**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

- [x] 4. Optimize .vscodeignore file




  - Add .vscode/ exclusion pattern
  - Add .git/ exclusion pattern
  - Add .kiro/ exclusion pattern
  - Add assets/*.svg exclusion pattern (exclude source SVGs)
  - Add themes/*.css and themes/*.html exclusion patterns (exclude generated previews)
  - Keep necessary files: themes/*.json, themes/*.ttf, package.json, README.md
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 4.1 Write property test for .vscodeignore validation
  - **Property 7: .vscodeignore excludes development files**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**



- [x] 5. Checkpoint - Validate extension structure



  - Ensure all tests pass, ask the user if questions arise
  - Run validation to confirm package.json is correct
  - Verify all theme files are in correct locations
  - Confirm no build artifacts remain
  - Check .vscodeignore is properly configured
-

- [x] 6. Package and test extension




  - Run `vsce package --allow-missing-repository` to create .vsix file
  - Verify packaging completes without errors
  - Check .vsix file size is reasonable (minimal)
  - Document successful packaging
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 7. Final verification
  - Document final folder structure
  - Confirm extension is ready for installation
  - Provide installation instructions for local testing
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.5_
