# Implementation Plan

- [ ] 1. Set up project structure and testing framework
  - Create product-icons/icons/ directory if it doesn't exist
  - Install fast-check for property-based testing
  - Set up test file structure
  - _Requirements: 4.1_

- [ ] 2. Create SVG icon files
  - [ ] 2.1 Create pumpkin.svg icon
    - Design jack-o'-lantern with triangular eyes and jagged mouth
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/pumpkin.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1_

  - [ ] 2.2 Create eyeball.svg icon
    - Design single eye with iris and pupil
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/eyeball.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.2_

  - [ ] 2.3 Create dead-tree-branch.svg icon
    - Design bare, twisted branch with sharp angles
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/dead-tree-branch.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.3_

  - [ ] 2.4 Create lightning-bolt.svg icon
    - Design zigzag bolt shape
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/lightning-bolt.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.4_

  - [ ] 2.5 Create witch-hat.svg icon
    - Design pointed hat with wide brim
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/witch-hat.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.5_

  - [ ] 2.6 Create cauldron.svg icon
    - Design round pot with handles and bubbling contents
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/cauldron.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.6_

  - [ ] 2.7 Create coffin.svg icon
    - Design traditional coffin shape
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/coffin.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.7_

  - [ ] 2.8 Create skull.svg icon
    - Design simplified skull with eye sockets and nasal cavity
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/skull.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.8_

  - [ ] 2.9 Create haunted-eye.svg icon
    - Design eye with eerie details, distinct from regular eyeball
    - Ensure stroke="currentColor", fill="none", stroke-width="2", viewBox="0 0 24 24"
    - Save to product-icons/icons/haunted-eye.svg
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.9_

  - [ ]* 2.10 Write property test for SVG structure compliance
    - **Property 1: SVG Structure Compliance**
    - **Validates: Requirements 2.1, 2.3, 2.5**
    - Test that all SVG files have stroke="currentColor", fill="none", no gradients
    - Run 100 iterations across all icon files

  - [ ]* 2.11 Write property test for consistent stroke width
    - **Property 2: Consistent Stroke Width**
    - **Validates: Requirements 2.2**
    - Test that all SVG files have stroke-width="2"
    - Run 100 iterations across all icon files

  - [ ]* 2.12 Write property test for standard viewBox
    - **Property 3: Standard ViewBox**
    - **Validates: Requirements 2.4**
    - Test that all SVG files have viewBox="0 0 24 24"
    - Run 100 iterations across all icon files

- [ ] 3. Create product-icon-theme.json configuration
  - [ ] 3.1 Create iconDefinitions section
    - Map each icon name to its SVG file path
    - Include all 9 unique icons (pumpkin, eyeball, dead-tree-branch, lightning-bolt, witch-hat, cauldron, coffin, skull, haunted-eye)
    - _Requirements: 1.4, 4.2_

  - [ ] 3.2 Map VS Code icon identifiers
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

  - [ ]* 3.3 Write property test for icon reference integrity
    - **Property 4: Icon Reference Integrity**
    - **Validates: Requirements 4.5**
    - Test that all icon paths in iconDefinitions resolve to existing files
    - Run 100 iterations across all icon references

  - [ ]* 3.4 Write unit test for complete icon set
    - Verify all 10 required VS Code icon identifiers are mapped
    - Verify iconDefinitions contains all unique icons
    - _Requirements: 1.1, 3.1-3.10_

  - [ ]* 3.5 Write unit test for valid JSON structure
    - Parse product-icon-theme.json and verify it's valid JSON
    - Verify it contains iconDefinitions object
    - Verify all required icon identifier mappings exist
    - _Requirements: 1.4, 4.2_

- [ ] 4. Update package.json with product icon theme contribution
  - [ ] 4.1 Add productIconThemes contribution point
    - Add contributes.productIconThemes array if it doesn't exist
    - Add entry with id "kiroween-icons", label "Kiroween Icons", path "./product-icons/product-icon-theme.json"
    - _Requirements: 4.4_

  - [ ]* 4.2 Write unit test for package.json configuration
    - Verify package.json contains productIconThemes contribution
    - Verify the contribution has correct id, label, and path
    - _Requirements: 4.4_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Final validation and documentation
  - [ ] 6.1 Verify directory structure
    - Confirm all SVG files exist in product-icons/icons/
    - Confirm product-icon-theme.json exists in product-icons/
    - _Requirements: 4.1_

  - [ ]* 6.2 Write unit test for directory structure
    - Verify all expected SVG files exist
    - Verify product-icon-theme.json exists
    - _Requirements: 4.1_

  - [ ] 6.3 Create manual testing checklist
    - Document steps for testing in VS Code
    - Include verification steps for theme activation and icon display
    - _Requirements: 1.5_
