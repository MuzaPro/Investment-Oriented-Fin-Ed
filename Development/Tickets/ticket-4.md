# Ticket #4: Visual Assets Integration

## Priority: Medium
## Estimated Effort: 1 day

## Description
Enhance the educational value and visual appeal of each step by integrating step-specific SVG illustrations. Currently, only the introduction step has a visual element (coins). Each step should have a relevant, thematic illustration that reinforces the concept being taught. These illustrations should be responsive, compatible with both light and dark modes, and enhance rather than distract from the learning experience.

## Acceptance Criteria
1. Each step has a relevant, concept-reinforcing SVG illustration
2. Illustrations adapt appropriately to both light and dark mode
3. Illustrations are responsive across device sizes
4. Subtle animations enhance the illustrations without being distracting
5. Visual elements are accessible (proper alt text, not essential for understanding content)

## Technical Implementation Details

### 1. Add HTML Structure for Visual Elements

Add the following HTML to each step content section:

```html
<!-- Step 2: Add after the heading -->
<div class="step-visual" id="inflationVisual">
  <!-- SVG will be loaded here via JavaScript -->
</div>

<!-- Step 3: Add after the heading -->
<div class="step-visual" id="investmentVisual">
  <!-- SVG will be loaded here via JavaScript -->
</div>

<!-- Step 4: Add after the heading -->
<div class="step-visual" id="contributionVisual">
  <!-- SVG will be loaded here via JavaScript -->
</div>

<!-- Step 5: Add after the heading -->
<div class="step-visual" id="calculatorVisual">
  <!-- SVG will be loaded here via JavaScript -->
</div>
```

### 2. Add CSS for Visual Elements

Add the following CSS to style the visual elements:

```css
/* Add to styles.css */
.step-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  max-height: 150px;
  overflow: hidden;
}

.step-visual svg {
  max-width: 100%;
  height: 100%;
  max-height: 150px;
}

/* Dark mode adjustments for SVGs */
.dark-mode .step-visual .light-theme-element {
  display: none;
}

.step-visual .dark-theme-element {
  display: none;
}

.dark-mode .step-visual .dark-theme-element {
  display: block;
}

/* Animation classes */
.inflation-animation .coin {
  animation: shrink 3s ease-in-out infinite alternate;
}

.investment-animation .growth {
  animation: grow 3s ease-in-out infinite alternate;
}

.contribution-animation .drops {
  animation: drip 1.5s ease-in-out infinite;
}

.calculator-animation .dial {
  animation: rotate 10s linear infinite;
}

/* Animation keyframes */
@keyframes shrink {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.7); opacity: 0.6; }
}

@keyframes grow {
  from { transform: scaleY(0.7); }
  to { transform: scaleY(1); }
}

@keyframes drip {
  0% { transform: translateY(-5px); opacity: 0; }
  50% { transform: translateY(5px); opacity: 1; }
  100% { transform: translateY(15px); opacity: 0; }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive layout */
@media (min-width: 768px) {
  .step-visual {
    position: absolute;
    top: 25px;
    right: 25px;
    width: 120px;
    height: 120px;
    margin-bottom: 0;
  }
  
  .step-content {
    /* Ensure there's room for the absolute-positioned visual */
    padding-right: 150px;
  }
}
```

### 3. Add JavaScript to Load and Animate SVGs

Add the following JavaScript to load and initialize the SVGs:

```javascript
// Add to script.js

// Function to load SVGs for each step
function loadStepVisuals() {
  // Load inflation visual (Step 2)
  loadSvg('assets/images/inflation.svg', document.getElementById('inflationVisual'), 'inflation-animation');
  
  // Load investment visual (Step 3)
  loadSvg('assets/images/investment.svg', document.getElementById('investmentVisual'), 'investment-animation');
  
  // Load contribution visual (Step 4)
  loadSvg('assets/images/contribution.svg', document.getElementById('contributionVisual'), 'contribution-animation');
  
  // Load calculator visual (Step 5)
  loadSvg('assets/images/calculator.svg', document.getElementById('calculatorVisual'), 'calculator-animation');
}

// Helper function to load SVG from file
function loadSvg(url, container, animationClass) {
  fetch(url)
    .then(response => response.text())
    .then(svgContent => {
      container.innerHTML = svgContent;
      container.classList.add(animationClass);
      
      // Apply theme-specific adjustments to SVG elements
      applyThemeToSvg(container);
    })
    .catch(error => {
      console.error('Error loading SVG:', error);
    });
}

// Function to apply current theme to SVG elements
function applyThemeToSvg(container) {
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  // Update SVG fill/stroke colors based on theme
  if (isDarkMode) {
    const elements = container.querySelectorAll('path, circle, rect, ellipse, polygon');
    elements.forEach(el => {
      // Only modify elements not specifically designed for dark/light theme
      if (!el.classList.contains('theme-specific')) {
        // Convert light theme colors to dark theme
        if (el.getAttribute('fill') === '#333333' || el.getAttribute('fill') === '#000000') {
          el.setAttribute('fill', '#e0e0e0');
        }
        if (el.getAttribute('stroke') === '#333333' || el.getAttribute('stroke') === '#000000') {
          el.setAttribute('stroke', '#e0e0e0');
        }
      }
    });
  }
}

// Add to the theme toggle function
function toggleDarkMode() {
  // Existing code...
  
  // Update SVG theme
  document.querySelectorAll('.step-visual').forEach(container => {
    applyThemeToSvg(container);
  });
}

// Add to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  // Other initialization...
  
  loadStepVisuals();
});
```

### 4. Optimize SVG Animations for Performance

For performance optimization, add the will-change property to animated elements:

```css
/* Add to the animation classes in styles.css */
.inflation-animation .coin,
.investment-animation .growth,
.contribution-animation .drops,
.calculator-animation .dial {
  will-change: transform;
}
```

### 5. Add Responsive Layout Adjustments

Add CSS to handle visual elements properly on different screen sizes:

```css
/* Add to the existing media queries in styles.css */
@media (max-width: 767px) {
  .step-visual {
    margin: 1rem auto 2rem auto;
    height: 100px;
  }
  
  /* Make animations more subtle on mobile */
  @keyframes shrink {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(0.85); opacity: 0.8; }
  }
  
  @keyframes grow {
    from { transform: scaleY(0.85); }
    to { transform: scaleY(1); }
  }
}

@media (min-width: 992px) {
  .step-visual {
    width: 150px;
    height: 150px;
    top: 30px;
    right: 30px;
  }
  
  .step-content {
    padding-right: 190px;
  }
}
```

## Testing Instructions
1. Verify each step displays the appropriate illustration
2. Toggle between light and dark modes to ensure illustrations adapt properly
3. Check responsive layout on mobile, tablet, and desktop devices
4. Ensure animations work appropriately and enhance rather than distract from content
5. Test with slow internet connections to verify the page loads properly even if SVGs are delayed

## Dependencies
This ticket depends on Ticket #3 (Dark Mode Implementation) for theme adaptation of SVGs.

## Notes
- The SVG files should be placed in the `assets/images/` directory as referenced in the code
- Each SVG should include elements with appropriate class names for animations
- Consider adding a fallback image or icon if SVG loading fails
- For best performance, SVG files should be optimized (compressed) before integration