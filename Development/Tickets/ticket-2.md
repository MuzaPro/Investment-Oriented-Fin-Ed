# Ticket #2: Enhanced Monthly Contribution Input System

## Priority: High
## Estimated Effort: 1 day

## Description
The current monthly contribution input is limited in both range and context. Users need a more realistic and informative way to set monthly contributions that reflect typical investment patterns. This ticket implements a dual-input system with percentage-based suggestions and scaling options to make the contribution step more meaningful and educational.

## Acceptance Criteria
1. Users can input contributions via both slider and direct input field
2. Percentage-based suggestions (5%, 10%, 15% of typical income) are available
3. Option to display values in thousands is implemented
4. Input range for contributions is more realistic and contextually appropriate
5. Tooltips provide educational context for contribution recommendations
6. All charts and calculations update correctly with the new input system

## Technical Implementation Details

### 1. Update HTML Structure for Step 4

Modify the monthly contribution input in Step 4 to include the enhanced features:

```html
<!-- Replace the existing input group in step4 with this enhanced version -->
<div class="input-group highlight-input">
  <div class="input-header">
    <label for="monthlyContribution">Monthly Contribution (₪):</label>
    <div class="input-tooltip">
      <i class="fas fa-info-circle"></i>
      <span class="tooltip-text">Financial advisors typically recommend saving 10-15% of your monthly income for investments.</span>
    </div>
  </div>
  
  <!-- Percentage-based presets -->
  <div class="contribution-presets">
    <button class="preset-button" data-percent="5">5% of income</button>
    <button class="preset-button" data-percent="10">10% of income</button>
    <button class="preset-button" data-percent="15">15% of income</button>
  </div>
  
  <!-- Dual input system -->
  <div class="dual-input">
    <div class="number-input-container">
      <input type="number" id="monthlyContributionNumber" min="0" step="100" value="100">
      <span class="currency-symbol">₪</span>
    </div>
    <div class="range-container">
      <input type="range" id="monthlyContribution" min="0" max="5000" step="100" value="100">
      <span id="contributionValue">100</span>
    </div>
  </div>
  
  <!-- Scale toggle -->
  <div class="scale-toggle">
    <label class="switch">
      <input type="checkbox" id="scaleValues">
      <span class="slider round"></span>
    </label>
    <span class="scale-label">Display values in thousands (K)</span>
  </div>
</div>
```

### 2. Add Required CSS

Add the following CSS to style the new elements:

```css
/* Add to styles.css */

/* Input header with tooltip */
.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.input-tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: var(--primary-color);
}

.input-tooltip .tooltip-text {
  visibility: hidden;
  width: 250px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.9rem;
  font-weight: normal;
}

.input-tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Percentage presets */
.contribution-presets {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.preset-button {
  background-color: #f1f1f1;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  font-size: 0.9rem;
}

.preset-button:hover {
  background-color: #e0e0e0;
}

.preset-button.active {
  background-color: var(--primary-color);
  color: white;
}

/* Dual input system */
.dual-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.number-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.number-input-container input {
  padding-right: 30px;
  width: 100%;
}

.currency-symbol {
  position: absolute;
  right: 10px;
  color: #666;
}

/* Scale toggle */
.scale-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--primary-color);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.scale-label {
  font-size: 0.9rem;
  color: #666;
}
```

### 3. Implement JavaScript Functions

Add the following JavaScript to implement the dual-input functionality:

```javascript
// Add these functions to script.js

// Assumed average monthly salary in Israel (for percentage calculations)
const AVERAGE_MONTHLY_INCOME = 10000; // ₪10,000

// Function to initialize the enhanced contribution inputs
function initEnhancedContributionInputs() {
  const rangeInput = document.getElementById('monthlyContribution');
  const numberInput = document.getElementById('monthlyContributionNumber');
  const valueDisplay = document.getElementById('contributionValue');
  const scaleToggle = document.getElementById('scaleValues');
  const presetButtons = document.querySelectorAll('.preset-button');
  
  // Sync range and number inputs
  rangeInput.addEventListener('input', function() {
    const value = this.value;
    numberInput.value = value;
    updateContributionValueDisplay(value, scaleToggle.checked);
    initContributionChart();
  });
  
  numberInput.addEventListener('input', function() {
    const value = this.value;
    // Ensure the range input can handle the number value
    if (value <= rangeInput.max && value >= rangeInput.min) {
      rangeInput.value = value;
    }
    updateContributionValueDisplay(value, scaleToggle.checked);
    initContributionChart();
  });
  
  // Handle scale toggle
  scaleToggle.addEventListener('change', function() {
    updateContributionValueDisplay(numberInput.value, this.checked);
  });
  
  // Handle preset buttons
  presetButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Clear active state from all buttons
      presetButtons.forEach(btn => btn.classList.remove('active'));
      // Add active state to clicked button
      this.classList.add('active');
      
      const percentValue = parseInt(this.getAttribute('data-percent'));
      const contributionValue = (percentValue / 100) * AVERAGE_MONTHLY_INCOME;
      
      // Update both inputs
      numberInput.value = contributionValue;
      
      // Update range input if within its bounds
      if (contributionValue <= rangeInput.max) {
        rangeInput.value = contributionValue;
      }
      
      updateContributionValueDisplay(contributionValue, scaleToggle.checked);
      initContributionChart();
    });
  });
  
  // Initialize value display
  updateContributionValueDisplay(rangeInput.value, scaleToggle.checked);
}

// Function to update the displayed contribution value
function updateContributionValueDisplay(value, useThousands) {
  const valueDisplay = document.getElementById('contributionValue');
  
  if (useThousands) {
    // Display in thousands (K)
    valueDisplay.textContent = formatCurrency(value / 1000) + 'K';
  } else {
    // Display normal value
    valueDisplay.textContent = formatCurrency(value);
  }
}

// Modify the contributionChart initialization to use the new input
function initContributionChart() {
  // Existing code...
  
  // Update to use the number input for more precise values
  const monthlyContribution = parseFloat(document.getElementById('monthlyContributionNumber').value);
  
  // Rest of existing function...
}

// Add to DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  // Other initialization...
  
  initEnhancedContributionInputs();
});
```

### 4. Update Step 5 (Full Calculator) to Match

Update the monthly contribution input in the full calculator (Step 5) to maintain consistency:

```html
<!-- Replace the existing monthly contribution input in step5 -->
<div class="input-group">
  <label for="monthlyContributionFull">Monthly Contribution (₪):</label>
  <div class="dual-input">
    <div class="number-input-container">
      <input type="number" id="monthlyContributionFull" min="0" step="100" value="100">
      <span class="currency-symbol">₪</span>
    </div>
  </div>
</div>
```

## Testing Instructions
1. Verify sliders and number inputs stay synchronized
2. Test preset buttons (5%, 10%, 15%) and confirm they set appropriate values
3. Test the "Display values in thousands" toggle to ensure proper formatting
4. Verify charts update correctly with all input methods
5. Check tooltips display properly with relevant information
6. Test mobile responsiveness of the new input system
7. Verify the Step 5 (full calculator) implementation works correctly

## Dependencies
This ticket depends on Ticket #1 (Chart Optimization) for proper chart updates.

## Notes
- The AVERAGE_MONTHLY_INCOME constant can be adjusted if needed
- The default max value for the range input is set to ₪5,000 but can be adjusted based on typical contribution patterns
- Consider adding additional percentage presets if user testing suggests they would be valuable