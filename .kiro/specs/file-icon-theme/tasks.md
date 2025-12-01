# Implementation Plan

- [x] 1. Refactor to shared icons directory





  - Create shared-icons/ directory at project root
  - Move all existing SVG files from product-icons/icons/ to shared-icons/
  - Update product-icons/product-icon-theme.json to reference ../shared-icons/ paths
  - Update product-icons/kiroween-icons.css if it references icon paths
  - Verify product icons still work after refactor
  - _Requirements: 8.3_




- [x] 2. Create missing SVG icons for file theme






  - Design and implement ghost.svg in shared-icons/ for JSON files (classic ghost shape)
  - Design and implement scroll.svg in shared-icons/ for Markdown files (rolled scroll or book)
  - Create coffin-open.svg variant in shared-icons/ (same coffin with lid separated/open)
  - Verify all new SVGs use 24x24 viewBox
  - Verify all new SVGs use stroke-based design with no color fills
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 5.2, 6.1, 6.2, 6.3_

- [ ]* 2.1 Write property test for icon viewBox consistency
  - **Property 1: All icons use consistent viewBox dimensions**
  - **Validates: Requirements 1.2, 2.2, 3.2, 4.2, 5.3, 6.2**


- [-]* 2.2 Write property test for monochrome stroke styling

  - **Property 2: All icons follow monochrome stroke-based styling**
  - **Validates: Requirements 6.1, 6.3**

- [x] 3. Create file icon theme configuration



- [x] 3.1 Create file-icon-theme.json with VSCode schema reference

  - Add $schema property pointing to vscode://schemas/icon-theme
  - Create iconDefinitions object with entries for all six icons
  - Map each icon ID to its corresponding SVG file path in ../shared-icons/
  - _Requirements: 8.1, 8.4_

- [x] 3.2 Configure file extension mappings

  - Map "js" extension to pumpkin icon
  - Map "ts" extension to skull icon
  - Map "json" extension to ghost icon
  - Map "md" extension to scroll icon
  - _Requirements: 1.1, 2.1, 3.1, 4.1_


- [x] 3.3 Configure folder icon mappings




  - Set "folder" property to coffin icon (closed state)
  - Set "folderExpanded" property to coffin-open icon
  - _Requirements: 5.1, 5.2_

- [ ]* 3.4 Write property test for configuration integrity
  - **Property 3: Configuration integrity - all mappings reference valid icons**
  - **Validates: Requirements 7.3, 8.3**

- [ ]* 3.5 Write property test for schema compliance
  - **Property 4: Configuration follows VSCode schema**
  - **Validates: Requirements 8.1, 8.4**

- [ ]* 3.6 Write unit tests for file extension mappings
  - Test JavaScript file mapping (Example 1)
  - Test TypeScript file mapping (Example 2)
  - Test JSON file mapping (Example 3)
  - Test Markdown file mapping (Example 4)
  - Test folder icon mappings (Example 5)
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 5.2_
-

- [x] 4. Register icon theme in extension manifest


- [x] 4.1 Update package.json with iconThemes contribution


  - Add iconThemes array to contributes section
  - Define icon theme with id "kiroween-file-icons"
  - Set label to "Kiroween File Icons"
  - Set path to "./file-icons/file-icon-theme.json"
  - _Requirements: 7.1, 7.2_

- [ ]* 4.2 Write unit test for extension manifest registration
  - Test that package.json contains iconThemes contribution (Example 6)
  - Verify correct path reference
  - _Requirements: 7.1, 7.2_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
