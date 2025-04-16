# Ticket #3: Dark Mode Implementation

## Priority: Medium
## Estimated Effort: 1 day

## Description
Implement a complete dark mode feature for the Investment Education Page. This includes creating a theme toggle, establishing dark theme color variables, adapting all UI components, and ensuring charts render appropriately in both light and dark modes. The theme preference should persist across sessions.

## Acceptance Criteria
1. A toggle button to switch between light and dark modes is added to the UI
2. All UI elements adapt appropriately to the chosen theme
3. Charts and visualizations have appropriate colors in dark mode
4. User's theme preference is saved and persists across sessions
5. Smooth transition animations when switching themes
6. All text maintains appropriate contrast and readability in both themes

## Technical Implementation Details

### 1. Add CSS Variables for Theme Colors

First, we need to expand our CSS variables to support both themes:

```css
/* Modify the existing :root section in styles.css */
:root {
  /* Light theme (default) */
  --background-color: #f9f9f9;
  --card-background: #ffffff;
  --text-color: #333333;
  --text-light: #7f8c8d;
  --border-color: #e0e0e0;
  --input-background: #ffffff;
  --chart-grid-color: rgba(0, 0, 0, 0.1);
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --inflated-color: #e74c3c;
  --investment-color: #2ecc71;
  --contribution-color: #3498db;
  --initial-color: #95a5a6;
  --info-background: #f8f9fa;
  
  /* Dark theme variables */
  --dark-background-color: #121212;
  --dark-card-background: #1e1e1e;
  --dark-text-color: #e0e0e0;
  --dark-text-light: #a0a0a0;
  --dark-border-color: #333333;
  --dark-input-background: #2a2a2a;
  --dark-chart-grid-color: rgba(255, 255, 255, 0.1);
  --dark-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  --dark-inflated-color: #ff6b6b;
  --dark-investment-color: #5ce892;
  --dark-contribution-color: #5dade2;
  --dark-initial-color: #bdc3c7;
  --dark-info-background: #2a2a2a;
  
  /* Common variables (unchanged in dark mode) */
  --primary-color: #3498db;
  --primary-hover: #2980b9;
  --secondary-color: #2ecc71;
  --tertiary-color: #e74c3c;
  --transition: all 0.3s ease;
}

/* Add dark mode class selector that will be toggled */
body.dark-mode {
  background-color: var(--dark-background-color);
  color: var(--dark-text-color);
}

/* Add dark mode overrides for all major components */
.dark-mode .step-content {
  background-color: var(--dark-card-background);
  box-shadow: var(--dark-shadow);
}

.dark-mode input[type="number"],
.dark-mode input[type="range"] {
  background-color: var(--dark-input-background);
  border-color: var(--dark-border-color);
  color: var(--dark-text-color);
}

.dark-mode .insight-box,
.dark-mode .learn-more-content,
.dark-mode .summary-container {
  background-color: var(--dark-info-background);
  border-color: var(--dark-border-color);
}

.dark-mode .summary-label {
  color: var(--dark-text-light);
}

.dark-mode .nav-button {
  background-color: var(--dark-card-background);
  border-color: var(--dark-border-color);
  color: var(--dark-text-color);
}

.dark-mode .preset-button {
  background-color: var(--dark-input-background);
  color: var(--dark-text-color);
}

.dark-mode .footer {
  color: var(--dark-text-light);
}

/* Add more component-specific overrides as needed */
```

### 2. Add Theme Toggle Button to HTML

Add a theme toggle button to the header area:

```html
<!-- Add this just after the opening <div class="container"> in index.html -->
<div class="theme-toggle">
  <button id="themeToggle" aria-label="Toggle dark mode">
    <i class="fas fa-sun light-icon"></i>
    <i class="fas fa-moon dark-icon"></i>
  </button>
</div>
```

Add corresponding CSS:

```css
/* Add to styles.css */
.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.theme-toggle button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--primary-color);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.theme-toggle button:hover {
  background-color: rgba(52, 152, 219, 0.1);
}

/* Toggle icon visibility based on theme */
.dark-icon {
  display: none;
}

.light-icon {
  display: inline-block;
}

body.dark-mode .dark-icon {
  display: inline-block;
}

body.dark-mode .light-icon {
  display: none;
}

/* Adjust container for theme toggle position */
.container {
  position: relative;
  padding-top: 40px;
}
```

### 3. Add JavaScript for Theme Toggle and Persistence

Add the following JavaScript to implement theme toggling and persistence:

```javascript
// Add to script.js

// Function to initialize theme
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('darkMode');
  
  // Apply saved preference if available
  if (savedTheme === 'true') {
    document.body.classList.add('dark-mode');
    updateChartsTheme(true);
  }
  
  // Add event listener for theme toggle
  themeToggle.addEventListener('click', toggleDarkMode);
}

// Function to toggle dark mode
function toggleDarkMode() {
  // Toggle class on body
  const isDarkMode = document.body.classList.toggle('dark-mode');
  
  // Save preference to localStorage
  localStorage.setItem('darkMode', isDarkMode);
  
  // Update chart themes
  updateChartsTheme(isDarkMode);
}

// Add to DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
  // Other initialization...
  
  initTheme();
});
```

### 4. Implement Chart Theme Adaptation

Add functionality to update chart colors for dark mode:

```javascript
// Add to script.js

// Function to update all charts for theme changes
function updateChartsTheme(isDarkMode) {
  // Define theme-specific colors
  const chartTheme = {
    gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    textColor: isDarkMode ? '#e0e0e0' : '#666666',
    initialColor: isDarkMode ? '#bdc3c7' : '#95a5a6',
    inflationColor: isDarkMode ? '#ff6b6b' : '#e74c3c',
    investmentColor: isDarkMode ? '#5ce892' : '#2ecc71',
    contributionColor: isDarkMode ? '#5dade2' : '#3498db'
  };
  
  // Update each chart if it exists
  if (inflationChart) {
    updateChartColors(inflationChart, chartTheme);
  }
  
  if (investmentChart) {
    updateChartColors(investmentChart, chartTheme);
  }
  
  if (contributionChart) {
    updateChartColors(contributionChart, chartTheme);
  }
  
  if (fullChart) {
    updateChartColors(fullChart, chartTheme);
  }
}

// Function to update chart colors
function updateChartColors(chart, theme) {
  // Update scales
  if (chart.options.scales.x) {
    chart.options.scales.x.grid.color = theme.gridColor;
    chart.options.scales.x.ticks.color = theme.textColor;
    chart.options.scales.y.grid.color = theme.gridColor;
    chart.options.scales.y.ticks.color = theme.textColor;
  }
  
  // Update datasets
  chart.data.datasets.forEach(dataset => {
    // Match dataset by label and update colors
    if (dataset.label.includes('Initial Amount')) {
      dataset.borderColor = theme.initialColor;
    } else if (dataset.label.includes('Inflation') || dataset.label.includes('Purchasing Power')) {
      dataset.borderColor = theme.inflationColor;
      dataset.backgroundColor = hexToRgba(theme.inflationColor, 0.1);
    } else if (dataset.label.includes('Investment') && !dataset.label.includes('Contributions')) {
      dataset.borderColor = theme.investmentColor;
      dataset.backgroundColor = hexToRgba(theme.investmentColor, 0.1);
    } else if (dataset.label.includes('Contributions') || dataset.label.includes('Monthly')) {
      dataset.borderColor = theme.contributionColor;
      dataset.backgroundColor = hexToRgba(theme.contributionColor, 0.1);
    }
  });
  
  // Update any annotations
  if (chart.options.plugins && chart.options.plugins.annotation) {
    const annotations = chart.options.plugins.annotation.annotations;
    
    for (let key in annotations) {
      const annotation = annotations[key];
      
      // Update annotation colors based on type
      if (annotation.label && annotation.label.backgroundColor) {
        if (annotation.label.backgroundColor === '#e74c3c') {
          annotation.label.backgroundColor = theme.inflationColor;
          annotation.borderColor = theme.inflationColor;
        } else if (annotation.label.backgroundColor === '#2ecc71') {
          annotation.label.backgroundColor = theme.investmentColor;
          annotation.borderColor = theme.investmentColor;
        } else if (annotation.label.backgroundColor === '#3498db') {
          annotation.label.backgroundColor = theme.contributionColor;
          annotation.borderColor = theme.contributionColor;
        }
      }
    }
  }
  
  // Apply updates
  chart.update();
}

// Helper function to convert hex to rgba
function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
```

### 5. Modify Chart Initialization Functions

Update all chart initialization functions to use theme-aware colors:

```javascript
// Modify each chart initialization function to get theme colors

// Example modification for initInflationChart
function initInflationChart() {
  // Get theme-based colors
  const isDarkMode = document.body.classList.contains('dark-mode');
  const chartTheme = {
    gridColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    textColor: isDarkMode ? '#e0e0e0' : '#666666',
    initialColor: isDarkMode ? '#bdc3c7' : '#95a5a6',
    inflationColor: isDarkMode ? '#ff6b6b' : '#e74c3c',
  };
  
  // Existing code...
  
  // Use theme colors in datasets
  inflationChart = new Chart(ctx, {
    // Existing config...
    data: {
      // Existing data...
      datasets: [
        {
          label: 'Initial Amount',
          data: initialAmountLine,
          borderColor: chartTheme.initialColor,
          // Rest of config...
        },
        {
          label: 'Purchasing Power (Inflation Adjusted)',
          data: uninvested,
          borderColor: chartTheme.inflationColor,
          backgroundColor: hexToRgba(chartTheme.inflationColor, 0.1),
          // Rest of config...
        }
      ]
    },
    options: {
      // Existing options...
      scales: {
        x: {
          // Existing config...
          grid: {
            color: chartTheme.gridColor
          },
          ticks: {
            color: chartTheme.textColor,
            // Existing config...
          }
        },
        y: {
          // Existing config...
          grid: {
            color: chartTheme.gridColor
          },
          ticks: {
            color: chartTheme.textColor,
            // Existing config...
          }
        }
      }
    }
  });
  
  // Rest of function...
}

// Apply similar changes to the other chart initialization functions
```

## Testing Instructions
1. Toggle between light and dark mode and verify all UI elements adapt appropriately
2. Refresh the page and verify the theme preference persists
3. Verify charts are readable and maintain appropriate colors in dark mode
4. Test theme toggle across different devices and screen sizes
5. Check all text for sufficient contrast and readability in both themes
6. Verify smooth transition animations when switching themes
7. Test all interactive elements (buttons, sliders, inputs) in dark mode

## Dependencies
This ticket depends on Ticket #1 (Chart Optimization) for proper chart updates.

## Notes
- Pay special attention to ensuring sufficient contrast for text and UI elements in dark mode
- Chart colors have been carefully selected to maintain visual hierarchy in both themes
- Consider testing with users who prefer dark mode to gather feedback on the implementation