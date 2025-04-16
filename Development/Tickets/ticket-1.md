# Ticket #1: Chart Optimization and Real-time Updates

## Priority: High
## Estimated Effort: 1 day

## Description
Currently, charts are being completely recreated when input values change, causing unnecessary animations and potential performance issues. Additionally, charts don't maintain their state when learning sections are expanded/collapsed. This ticket addresses both issues by optimizing chart updates and implementing proper resize handling.

## Acceptance Criteria
1. Charts update without full re-animation when input values change
2. Charts properly resize when "Learn More" sections are expanded/collapsed
3. Performance is improved, especially on mobile devices
4. All chart functionality remains intact

## Technical Implementation Details

### 1. Chart Update Optimization

#### Step 1: Refactor Chart Update Mechanism
Modify all chart initialization functions to use data updates instead of recreating charts:

```javascript
// Example for the inflation chart - apply similar approach to all charts
function updateInflationChart() {
  // Get current values
  const initialAmount = parseFloat(document.getElementById('initialAmount').value);
  const years = parseInt(document.getElementById('years2').value);
  const inflationRate = parseFloat(document.getElementById('inflationRate').value);
  
  // Calculate new data
  const { timePoints, uninvested, initialAmountLine } = calculateValues(
    initialAmount, years, inflationRate, 0, 0
  );
  
  if (inflationChart) {
    // Update existing chart data instead of recreation
    inflationChart.data.labels = timePoints;
    inflationChart.data.datasets[0].data = initialAmountLine;
    inflationChart.data.datasets[1].data = uninvested;
    
    // Update any annotations
    inflationChart.options.plugins.annotation.annotations.line1.yMin = uninvested[years];
    inflationChart.options.plugins.annotation.annotations.line1.yMax = uninvested[years];
    inflationChart.options.plugins.annotation.annotations.line1.label.content = formatCurrency(uninvested[years]);
    
    // Disable animation for updates
    const originalAnimation = inflationChart.options.animation;
    inflationChart.options.animation = false;
    
    // Apply updates
    inflationChart.update();
    
    // Restore original animation setting for next initialization
    inflationChart.options.animation = originalAnimation;
  } else {
    // First-time initialization with full animation
    initInflationChart();
  }
  
  // Update insight text
  updateInflationInsight(initialAmount, years, uninvested[years]);
}
```

#### Step 2: Create Helper Functions for Chart Updates
Add utility functions to manage chart animations and updates:

```javascript
// Configuration for animation states
const chartAnimationConfig = {
  initial: {
    duration: 1000,
    easing: 'easeOutQuad'
  },
  update: {
    duration: 0  // No animation for updates
  }
};

// Helper to update chart with specific animation settings
function updateChartData(chart, newData, newLabels, animate = false) {
  if (!chart) return false;
  
  // Store original animation config
  const originalAnimation = {...chart.options.animation};
  
  // Set animation based on parameter
  chart.options.animation = animate ? 
    chartAnimationConfig.initial : 
    chartAnimationConfig.update;
  
  // Update chart data
  if (newLabels) chart.data.labels = newLabels;
  
  // Update datasets
  newData.forEach((data, index) => {
    if (chart.data.datasets[index]) {
      chart.data.datasets[index].data = data;
    }
  });
  
  // Apply changes
  chart.update();
  
  // Restore original animation settings
  chart.options.animation = originalAnimation;
  
  return true;
}
```

#### Step 3: Implement Debounce for Input Handlers
Add debounce functionality to prevent excessive updates:

```javascript
// Add to the top of your script.js file
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

// Then modify all input event listeners, for example:
document.getElementById('years2').addEventListener('input', debounce(function() {
  document.getElementById('yearsValue2').textContent = this.value;
  updateInflationChart(); // Call the new update function instead of initInflationChart
}, 100)); // 100ms debounce
```

### 2. Chart Resizing for "Learn More" Sections

#### Step 1: Set Up Resize Observer
Add functionality to detect and handle size changes:

```javascript
// Add to the initialization section of your script
function initChartResizeObservers() {
  const chartContainers = document.querySelectorAll('.chart-container');
  
  chartContainers.forEach(container => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        // Find which chart is in this container
        const containerId = entry.target.closest('.step-content').id;
        resizeChartInContainer(containerId);
      }
    });
    
    resizeObserver.observe(container);
  });
}

// Function to resize the appropriate chart
function resizeChartInContainer(containerId) {
  switch(containerId) {
    case 'step2':
      if (inflationChart) inflationChart.resize();
      break;
    case 'step3':
      if (investmentChart) investmentChart.resize();
      break;
    case 'step4':
      if (contributionChart) contributionChart.resize();
      break;
    case 'step5':
      if (fullChart) fullChart.resize();
      break;
  }
}

// Add to DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  // Other initialization code...
  
  initChartResizeObservers();
});
```

#### Step 2: Modify Learn More Toggle Handler
Update the toggle handler to trigger chart resize:

```javascript
// Modify the existing learn-more-toggle event handlers
document.querySelectorAll('.learn-more-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
    const content = this.nextElementSibling;
    content.classList.toggle('active');
    
    // Allow transition to complete before resize
    setTimeout(() => {
      const containerId = this.closest('.step-content').id;
      resizeChartInContainer(containerId);
    }, 300); // Match to CSS transition duration
  });
});
```

#### Step 3: Update CSS for Smooth Transitions
Add proper transitions to avoid layout jumps:

```css
/* Add to styles.css */
.learn-more-content {
  transition: max-height 0.3s ease-out;
  max-height: 0;
  overflow: hidden;
}

.learn-more-content.active {
  max-height: 1000px; /* Arbitrary large value */
}

.chart-container {
  transition: height 0.3s ease;
}
```

## Testing Instructions
1. Test all sliders and inputs to verify charts update without full re-animation
2. Toggle "Learn More" sections and verify charts resize properly
3. Test on mobile devices to verify performance improvements
4. Verify all chart functionality remains intact (tooltips, legends, etc.)
5. Test rapid input changes to verify debounce functionality

## Dependencies
None - this is a foundational update that should be implemented first.

## Notes
- This change focuses on performance and UX improvement without changing visual appearance
- All current functionality should be preserved
- Pay special attention to maintaining all chart annotations and tooltips