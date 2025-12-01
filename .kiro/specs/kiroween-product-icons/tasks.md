# Implementation Plan

- [x] 1. Set up project structure
  - Create product-icons/icons/ directory if it doesn't exist
  - _Requirements: 4.1_

- [x] 2. Create SVG icon files
  - [x] 2.1 Create pumpkin.svg icon
    - Design jack-o'-lantern with triangular eyes and jagged mouth
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/pumpkin.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1_

  - [x] 2.2 Create eyeball.svg icon
    - Design single eye with iris and pupil
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/eyeball.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.2_

  - [x] 2.3 Create dead-tree-branch.svg icon
    - Design bare, twisted branch with sharp angles
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/dead-tree-branch.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.3_

  - [x] 2.4 Create lightning-bolt.svg icon
    - Design zigzag bolt shape
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/lightning-bolt.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.4_

  - [x] 2.5 Create witch-hat.svg icon
    - Design pointed hat with wide brim
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/witch-hat.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.5_

  - [x] 2.6 Create cauldron.svg icon
    - Design round pot with handles and bubbling contents
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/cauldron.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.6_

  - [x] 2.7 Create coffin.svg icon
    - Design traditional coffin shape
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/coffin.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.7_

  - [x] 2.8 Create skull.svg icon
    - Design simplified skull with eye sockets and nasal cavity
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/skull.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.8_

  - [x] 2.9 Create haunted-eye.svg icon
    - Design eye with eerie details, distinct from regular eyeball
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/haunted-eye.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.9_

- [x] 3. Create product-icon-theme.json configuration






  - [x] 3.1 Create iconDefinitions section

    - Map each icon name to its SVG file path
    - Include all 9 unique icons (pumpkin, eyeball, dead-tree-branch, lightning-bolt, witch-hat, cauldron, coffin, skull, haunted-eye)
    - _Requirements: 1.4, 4.2_


  - [x] 3.2 Map VS Code icon identifiers




    - Map explorer-view-icon to pumpkin
    - Map search-view-icon to eyeball
    - Map scm-view-icon to dead-tree-branch
    - Map debug-view-icon to lightning-bolt
    - Map extensions-view-icon to witch-hat
    - Map settings-view-icon to cauldron
    - Map terminal-view-icon to coffin
    - Map error-icon to skull
    - Map info-icon to haunted-eye
    - Map warning-icon to pumpkin
    - _Requirements: 1.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

- [x] 4. Update package.json with product icon theme contribution




  - [x] 4.1 Add productIconThemes contribution point


    - Add contributes.productIconThemes array if it doesn't exist
    - Add entry with id "kiroween-icons", label "Kiroween Icons", path "./product-icons/product-icon-theme.json"
    - _Requirements: 4.4_

- [x] 5. Final validation
  - [x] 5.1 Verify directory structure
    - Confirm all SVG files exist in product-icons/icons/
    - Confirm product-icon-theme.json exists in product-icons/
    - _Requirements: 4.1_

- [x] 6. Property-Based Testing
  - [x] 6.1 Set up fast-check testing framework
    - Add fast-check as dev dependency
    - Create test script in package.json
    - Configure to run 100 iterations per property
    - _Requirements: Testing Strategy_

  - [x] 6.2 Implement Property 1: SVG Structure Compliance
    - **Property 1: SVG Structure Compliance**
    - Test that all SVG files have stroke="currentColor", fill="none", no gradients, and SVG namespace
    - **Validates: Requirements 2.1, 2.3, 2.5**

  - [x] 6.3 Implement Property 2: Consistent Stroke Width
    - **Property 2: Consistent Stroke Width**
    - Test that all SVG files have stroke-width="2"
    - **Validates: Requirements 2.2**

  - [x] 6.4 Implement Property 3: Standard ViewBox
    - **Property 3: Standard ViewBox**
    - Test that all SVG files have viewBox="0 0 24 24"
    - **Validates: Requirements 2.4**

  - [x] 6.5 Implement Property 4: Icon Reference Integrity
    - **Property 4: Icon Reference Integrity**
    - Test that all icon paths in product-icon-theme.json resolve to existing files
    - **Validates: Requirements 4.5**
