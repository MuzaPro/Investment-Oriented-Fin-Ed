# Visual Assets List for Investment Education Page

This document details all the visual assets needed for the enhanced Investment Education Page. All assets should be placed in the `assets/images/` directory with the specified filenames to match the code implementation.

## SVG Illustrations Required

### 1. Inflation Illustration
- **Filename:** `inflation.svg`
- **Description:** A visual representation of money losing value over time
- **Concept:** A coin or stack of coins that appears to be shrinking/melting
- **Key Elements:**
  - Include elements with class `coin` to enable shrinking animation
  - Use colors that work in both light and dark modes (or include theme-specific elements)
  - Simple, clean design with clear visual metaphor
  
**Animation:** The coin(s) will slowly shrink to represent loss of purchasing power

### 2. Investment Illustration
- **Filename:** `investment.svg`
- **Description:** Visual representation of money growing through investment
- **Concept:** A growing plant/tree with money/coins as leaves or fruits
- **Key Elements:**
  - Include elements with class `growth` to enable growing animation
  - The plant should be simple but recognizable
  - Money elements (coins/notes) should be integrated with the plant
  
**Animation:** The plant grows upward to represent investment growth

### 3. Contribution Illustration
- **Filename:** `contribution.svg`
- **Description:** Visual representation of regular additions accelerating growth
- **Concept:** Water droplets feeding a plant, or coins being added to a stack/jar
- **Key Elements:**
  - Include elements with class `drops` to enable dripping animation
  - Visual connection between regular additions and accelerated growth
  - Clear cause-and-effect visual relationship
  
**Animation:** Droplets/coins falling or flowing to represent regular contributions

### 4. Calculator Illustration
- **Filename:** `calculator.svg`
- **Description:** Visual representation of financial control and planning
- **Concept:** Dashboard, control panel, or financial instrument
- **Key Elements:**
  - Include elements with class `dial` for rotation animation
  - Should represent control, precision, and financial planning
  - Can include calculator, chart, or dashboard elements
  
**Animation:** Subtle rotation of dials or gauges to represent adjustability

## Design Guidelines

### General Requirements
1. **File Format:** SVG format only (scalable vector graphics)
2. **Size:** Optimized for display at approximately 150px × 150px
3. **Style:** Consistent style across all illustrations
4. **Colors:** Use a consistent color palette that works in both light and dark modes

### Dark Mode Compatibility
To ensure SVGs work properly in dark mode, use one of these approaches:

1. **Auto-adaptation:** Allow the JavaScript to automatically adjust colors
   - Use standard colors that will be converted (e.g., #333333 to #e0e0e0 in dark mode)

2. **Theme-specific Elements:** Include separate elements for dark/light themes
   - Add class `light-theme-element` to elements visible only in light mode
   - Add class `dark-theme-element` to elements visible only in dark mode

3. **Theme-neutral:** Use colors that work well in both themes
   - Primary colors from the app's theme (blue, green) work well in both modes
   - Avoid very light or very dark colors that won't translate well between themes

### Animation Considerations
- Keep animations subtle and meaningful to avoid distraction
- Ensure animations relate directly to the financial concept being illustrated
- Use the specified class names to enable proper animation via CSS

### Accessibility
- Include appropriate metadata in SVGs (title, desc elements)
- Use semantic grouping when possible
- Ensure sufficient contrast within the illustrations

## Additional Assets

### Icons
The application uses Font Awesome icons, which are loaded via CDN. No additional icon files are needed.

### Favicon
- **Filename:** `favicon.ico`
- **Description:** Simple icon representing the application for browser tabs
- **Placement:** Root directory (not in assets/images)

### Open Graph Image
- **Filename:** `og-image.png`
- **Description:** Preview image for social media sharing
- **Size:** 1200 × 630 pixels
- **Placement:** Root directory (not in assets/images)

## SVG Technical Requirements

For optimal performance and compatibility:

1. **Optimization:**
   - Compress SVGs to remove unnecessary code
   - Consider using tools like SVGO to optimize

2. **Animation Support:**
   - Ensure IDs/classes are properly set for animated elements
   - Keep animations simple (transform-based) for performance

3. **Responsiveness:**
   - Use viewBox attribute for proper scaling
   - Avoid fixed width/height attributes

4. **Code Quality:**
   - Use descriptive IDs and classes
   - Group related elements

## Example Structure for an SVG file

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-labelledby="title desc">
  <title id="title">Investment Growth</title>
  <desc id="desc">Illustration of investment growth represented by a money tree</desc>
  
  <!-- Background elements -->
  <rect width="100" height="100" fill="none" />
  
  <!-- Main elements for light theme -->
  <g class="light-theme-element">
    <!-- SVG elements visible in light mode -->
  </g>
  
  <!-- Main elements for dark theme -->
  <g class="dark-theme-element">
    <!-- SVG elements visible in dark mode -->
  </g>
  
  <!-- Theme-neutral elements -->
  <g>
    <!-- SVG elements visible in both modes -->
    
    <!-- Animated element -->
    <g class="growth">
      <!-- Elements that will be animated -->
    </g>
  </g>
</svg>
```