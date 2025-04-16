// Global variables for charts
let inflationChart = null;
let investmentChart = null;
let contributionChart = null;
let fullChart = null;

// Global variable for initial amount
let initialAmount = 1000;

// Format currency in Israeli Shekels
function formatCurrency(amount) {
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format percentage
function formatPercentage(value) {
    return new Intl.NumberFormat('en', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value / 100);
}

// Function to calculate values for charts
function calculateValues(initialAmount, years, inflationRate, investmentReturn, monthlyContribution = 0) {
    // Handle invalid inputs
    initialAmount = parseFloat(initialAmount) || 1000;
    years = parseInt(years) || 10;
    inflationRate = parseFloat(inflationRate) || 2.5;
    investmentReturn = parseFloat(investmentReturn) || 7.5;
    monthlyContribution = parseFloat(monthlyContribution) || 0;
    
    // Ensure years is an integer and within reasonable range
    years = Math.min(Math.max(Math.floor(years), 1), 50);
    
    // Generate time points (years)
    let timePoints = Array.from({ length: years + 1 }, (_, i) => i);
    
    // Calculate invested money growth with initial amount only
    let investedInitialOnly = timePoints.map(year => 
        initialAmount * Math.pow(1 + investmentReturn / 100, year)
    );
    
    // Calculate uninvested money (inflation adjusted)
    let uninvested = timePoints.map(year => 
        initialAmount / Math.pow(1 + inflationRate / 100, year)
    );
    
    // Calculate invested money with monthly contributions
    let investedWithContribution = timePoints.map(year => {
        // Initial amount with compound growth
        let base = initialAmount * Math.pow(1 + investmentReturn / 100, year);
        
        if (monthlyContribution > 0 && year > 0) {
            // Sum of compounded monthly contributions
            let monthlyRate = investmentReturn / 100 / 12;
            let months = year * 12;
            let monthlySum = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            return base + monthlySum;
        }
        
        return base;
    });
    
    // Calculate initial amount as a flat line
    let initialAmountLine = Array(years + 1).fill(initialAmount);
    
    return { 
        timePoints, 
        investedInitialOnly, 
        uninvested, 
        investedWithContribution,
        initialAmountLine
    };
}

// Initialize inflation chart (Step 2)
function initInflationChart() {
    if (inflationChart) {
        inflationChart.destroy();
    }
    
    const initialAmount = parseFloat(document.getElementById('initialAmount').value);
    const years = parseInt(document.getElementById('years2').value);
    const inflationRate = parseFloat(document.getElementById('inflationRate').value);
    
    const { timePoints, uninvested, initialAmountLine } = calculateValues(
        initialAmount, years, inflationRate, 0, 0
    );
    
    const ctx = document.getElementById('inflationChart').getContext('2d');
    
    inflationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timePoints,
            datasets: [
                {
                    label: 'Initial Amount',
                    data: initialAmountLine,
                    borderColor: '#95a5a6',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Purchasing Power (Inflation Adjusted)',
                    data: uninvested,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatCurrency(context.parsed.y);
                            return label;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: uninvested[years],
                            yMax: uninvested[years],
                            xMin: years,
                            xMax: years,
                            borderColor: '#e74c3c',
                            borderWidth: 2,
                            borderDash: [2, 2],
                            label: {
                                content: formatCurrency(uninvested[years]),
                                enabled: true,
                                position: 'center',
                                backgroundColor: '#e74c3c'
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount (₪)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
    
    // Update the insight text
    const difference = initialAmount - uninvested[years];
    const percentLoss = (difference / initialAmount) * 100;
    document.getElementById('inflationInsight').textContent = 
        `In ${years} years, your ${formatCurrency(initialAmount)} will only buy what ${formatCurrency(uninvested[years])} buys today - a loss of ${percentLoss.toFixed(1)}% in purchasing power.`;
}

// Initialize investment chart (Step 3)
function initInvestmentChart() {
    if (investmentChart) {
        investmentChart.destroy();
    }
    
    const initialAmount = parseFloat(document.getElementById('initialAmount').value);
    const years = parseInt(document.getElementById('years3').value);
    const inflationRate = parseFloat(document.getElementById('inflationRate3').value);
    const investmentReturn = parseFloat(document.getElementById('investmentReturn').value);
    
    const { timePoints, investedInitialOnly, uninvested, initialAmountLine } = calculateValues(
        initialAmount, years, inflationRate, investmentReturn, 0
    );
    
    const ctx = document.getElementById('investmentChart').getContext('2d');
    
    // Find crossover point (where investment overtakes inflation)
    let crossoverPoint = timePoints.findIndex((_, i) => 
        i > 0 && investedInitialOnly[i] > initialAmount && investedInitialOnly[i-1] <= initialAmount
    );
    
    if (crossoverPoint === -1) {
        crossoverPoint = 1; // Default if not found
    }
    
    investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timePoints,
            datasets: [
                {
                    label: 'Initial Amount',
                    data: initialAmountLine,
                    borderColor: '#95a5a6',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Purchasing Power (Inflation Adjusted)',
                    data: uninvested,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true,
                    tension: 0.1
                },
                {
                    label: 'Investment Growth',
                    data: investedInitialOnly,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatCurrency(context.parsed.y);
                            return label;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        point1: {
                            type: 'point',
                            xValue: crossoverPoint,
                            yValue: investedInitialOnly[crossoverPoint],
                            backgroundColor: '#2ecc71',
                            radius: 5,
                            label: {
                                content: 'Break Even',
                                enabled: true,
                                position: 'top',
                                backgroundColor: '#2ecc71'
                            }
                        },
                        line1: {
                            type: 'line',
                            yMin: investedInitialOnly[years],
                            yMax: investedInitialOnly[years],
                            xMin: years,
                            xMax: years,
                            borderColor: '#2ecc71',
                            borderWidth: 2,
                            borderDash: [2, 2],
                            label: {
                                content: formatCurrency(investedInitialOnly[years]),
                                enabled: true,
                                position: 'center',
                                backgroundColor: '#2ecc71'
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount (₪)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
    
    // Update the insight text
    const growthMultiple = investedInitialOnly[years] / initialAmount;
    const vsInflation = investedInitialOnly[years] / uninvested[years];
    document.getElementById('investmentInsight').textContent = 
        `By investing at ${investmentReturn}%, your ${formatCurrency(initialAmount)} grows to ${formatCurrency(investedInitialOnly[years])} after ${years} years - ${growthMultiple.toFixed(1)}× your initial amount and ${vsInflation.toFixed(1)}× more valuable than keeping it uninvested.`;
}

// Initialize contribution chart (Step 4)
function initContributionChart() {
    if (contributionChart) {
        contributionChart.destroy();
    }
    
    const initialAmount = parseFloat(document.getElementById('initialAmount').value);
    const years = parseInt(document.getElementById('years4').value);
    const inflationRate = parseFloat(document.getElementById('inflationRate4').value);
    const investmentReturn = parseFloat(document.getElementById('investmentReturn4').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    
    const { timePoints, investedInitialOnly, uninvested, investedWithContribution, initialAmountLine } = calculateValues(
        initialAmount, years, inflationRate, investmentReturn, monthlyContribution
    );
    
    const ctx = document.getElementById('contributionChart').getContext('2d');
    
    contributionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timePoints,
            datasets: [
                {
                    label: 'Initial Amount',
                    data: initialAmountLine,
                    borderColor: '#95a5a6',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Purchasing Power (Inflation Adjusted)',
                    data: uninvested,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true,
                    tension: 0.1
                },
                {
                    label: 'Investment (Initial Amount Only)',
                    data: investedInitialOnly,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true,
                    tension: 0.1
                },
                {
                    label: 'Investment with Monthly Contributions',
                    data: investedWithContribution,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    pointRadius: 4,
                    fill: true,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatCurrency(context.parsed.y);
                            return label;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: investedWithContribution[years],
                            yMax: investedWithContribution[years],
                            xMin: years,
                            xMax: years,
                            borderColor: '#3498db',
                            borderWidth: 2,
                            borderDash: [2, 2],
                            label: {
                                content: formatCurrency(investedWithContribution[years]),
                                enabled: true,
                                position: 'center',
                                backgroundColor: '#3498db'
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount (₪)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
    
    // Calculate totals for insight
    const totalContributions = monthlyContribution * 12 * years;
    const finalAmount = investedWithContribution[years];
    const investmentGrowth = finalAmount - (initialAmount + totalContributions);
    const growthMultiple = finalAmount / initialAmount;
    
    // Update the insight text
    document.getElementById('contributionInsight').textContent = 
        `Adding just ${formatCurrency(monthlyContribution)} monthly grows your investment to ${formatCurrency(finalAmount)} after ${years} years - ${growthMultiple.toFixed(1)}× your initial investment!`;
}

// Initialize full calculator chart (Step 5)
function initFullChart() {
    if (fullChart) {
        fullChart.destroy();
    }
    
    const initialAmount = parseFloat(document.getElementById('initialAmountFull').value);
    const years = parseInt(document.getElementById('yearsFull').value);
    const inflationRate = parseFloat(document.getElementById('inflationRateFull').value);
    const investmentReturn = parseFloat(document.getElementById('investmentReturnFull').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContributionFull').value);
    
    const { timePoints, investedInitialOnly, uninvested, investedWithContribution, initialAmountLine } = calculateValues(
        initialAmount, years, inflationRate, investmentReturn, monthlyContribution
    );
    
    const ctx = document.getElementById('fullChart').getContext('2d');
    
    // Get toggle states
    const showInitial = document.getElementById('toggleInitial').checked;
    const showInflation = document.getElementById('toggleInflation').checked;
    const showInvestment = document.getElementById('toggleInvestment').checked;
    const showContribution = document.getElementById('toggleContribution').checked;
    
    // Prepare datasets based on toggle states
    const datasets = [];
    
    if (showInitial) {
        datasets.push({
            label: 'Initial Amount',
            data: initialAmountLine,
            borderColor: '#95a5a6',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
        });
    }
    
    if (showInflation) {
        datasets.push({
            label: 'Purchasing Power (Inflation Adjusted)',
            data: uninvested,
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            fill: true,
            tension: 0.1
        });
    }
    
    if (showInvestment) {
        datasets.push({
            label: 'Investment (Initial Amount Only)',
            data: investedInitialOnly,
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46, 204, 113, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            fill: true,
            tension: 0.1
        });
    }
    
    if (showContribution) {
        datasets.push({
            label: 'Investment with Monthly Contributions',
            data: investedWithContribution,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 3,
            pointRadius: 4,
            fill: true,
            tension: 0.1
        });
    }
    
    fullChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timePoints,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatCurrency(context.parsed.y);
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount (₪)'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
    
    // Update summary details
    updateSummary(initialAmount, years, inflationRate, investmentReturn, monthlyContribution, investedInitialOnly, uninvested, investedWithContribution);
}

// Update summary in full calculator
function updateSummary(initialAmount, years, inflationRate, investmentReturn, monthlyContribution, investedInitialOnly, uninvested, investedWithContribution) {
    // Calculate totals
    const totalContributions = monthlyContribution * 12 * years;
    const finalAmount = investedWithContribution[years];
    const finalUninvested = uninvested[years];
    const investmentGrowth = finalAmount - (initialAmount + totalContributions);
    const comparisonValue = finalAmount - finalUninvested;
    const roi = (investmentGrowth / (initialAmount + totalContributions)) * 100;
    
    // Update summary display
    document.getElementById('initialSummary').textContent = formatCurrency(initialAmount);
    document.getElementById('contributionsSummary').textContent = formatCurrency(totalContributions);
    document.getElementById('growthSummary').textContent = formatCurrency(investmentGrowth);
    document.getElementById('finalSummary').textContent = formatCurrency(finalAmount);
    document.getElementById('comparisonSummary').textContent = "+" + formatCurrency(comparisonValue);
    document.getElementById('roiSummary').textContent = roi.toFixed(1) + "%";
}

// Navigation functions
function navigateToStep(stepNumber) {
    // Update active step
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
    
    // Update progress bar
    const progressPercentage = ((stepNumber - 1) / 4) * 100;
    document.querySelector('.progress').style.width = `${progressPercentage}%`;
    
    // Show active content
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    // Initialize or update charts based on step
    if (stepNumber === 2) {
        initInflationChart();
    } else if (stepNumber === 3) {
        initInvestmentChart();
    } else if (stepNumber === 4) {
        initContributionChart();
    } else if (stepNumber === 5) {
        // Transfer values from previous steps to full calculator
        document.getElementById('initialAmountFull').value = document.getElementById('initialAmount').value;
        document.getElementById('yearsFull').value = document.getElementById('years4').value;
        document.getElementById('yearsValueFull').textContent = document.getElementById('years4').value;
        document.getElementById('inflationRateFull').value = document.getElementById('inflationRate4').value;
        document.getElementById('inflationValueFull').textContent = document.getElementById('inflationRate4').value;
        document.getElementById('investmentReturnFull').value = document.getElementById('investmentReturn4').value;
        document.getElementById('returnValueFull').textContent = document.getElementById('investmentReturn4').value;
        document.getElementById('monthlyContributionFull').value = document.getElementById('monthlyContribution').value;
        
        initFullChart();
    }
}

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
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateChartsTheme(isDarkMode);
}

// Function to update chart themes
function updateChartsTheme(isDarkMode) {
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
    
    // Update annotations
    if (chart.options.plugins?.annotation?.annotations) {
        const annotations = chart.options.plugins.annotation.annotations;
        
        for (let key in annotations) {
            const annotation = annotations[key];
            if (annotation.label?.backgroundColor) {
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
    
    chart.update();
}

// Helper function to convert hex to rgba
function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Step 1: Begin button event listener
    document.getElementById('beginButton').addEventListener('click', function() {
        initialAmount = parseFloat(document.getElementById('initialAmount').value);
        navigateToStep(2);
    });
    
    // Navigation buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function() {
            const targetStep = this.getAttribute('data-target');
            navigateToStep(parseInt(targetStep));
        });
    });
    
    // Learn More toggles
    document.querySelectorAll('.learn-more-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.classList.toggle('active');
        });
    });
    
    // Step 2: Inflation step inputs
    document.getElementById('years2').addEventListener('input', function() {
        document.getElementById('yearsValue2').textContent = this.value;
        initInflationChart();
    });
    
    document.getElementById('inflationRate').addEventListener('input', function() {
        document.getElementById('inflationValue').textContent = this.value;
        initInflationChart();
    });
    
    // Step 3: Investment step inputs
    document.getElementById('years3').addEventListener('input', function() {
        document.getElementById('yearsValue3').textContent = this.value;
        initInvestmentChart();
    });
    
    document.getElementById('inflationRate3').addEventListener('input', function() {
        document.getElementById('inflationValue3').textContent = this.value;
        initInvestmentChart();
    });
    
    document.getElementById('investmentReturn').addEventListener('input', function() {
        document.getElementById('returnValue').textContent = this.value;
        initInvestmentChart();
    });
    
    // Step 4: Contribution step inputs
    document.getElementById('years4').addEventListener('input', function() {
        document.getElementById('yearsValue4').textContent = this.value;
        initContributionChart();
    });
    
    document.getElementById('inflationRate4').addEventListener('input', function() {
        document.getElementById('inflationValue4').textContent = this.value;
        initContributionChart();
    });
    
    document.getElementById('investmentReturn4').addEventListener('input', function() {
        document.getElementById('returnValue4').textContent = this.value;
        initContributionChart();
    });
    
    document.getElementById('monthlyContribution').addEventListener('input', function() {
        document.getElementById('contributionValue').textContent = this.value;
        initContributionChart();
    });
    
    // Step 5: Full calculator inputs
    document.getElementById('initialAmountFull').addEventListener('input', initFullChart);
    
    document.getElementById('yearsFull').addEventListener('input', function() {
        document.getElementById('yearsValueFull').textContent = this.value;
        initFullChart();
    });
    
    document.getElementById('inflationRateFull').addEventListener('input', function() {
        document.getElementById('inflationValueFull').textContent = this.value;
        initFullChart();
    });
    
    document.getElementById('investmentReturnFull').addEventListener('input', function() {
        document.getElementById('returnValueFull').textContent = this.value;
        initFullChart();
    });
    
    document.getElementById('monthlyContributionFull').addEventListener('input', initFullChart);
    
    // Chart toggles
    document.getElementById('toggleInitial').addEventListener('change', initFullChart);
    document.getElementById('toggleInflation').addEventListener('change', initFullChart);
    document.getElementById('toggleInvestment').addEventListener('change', initFullChart);
    document.getElementById('toggleContribution').addEventListener('change', initFullChart);
    
    // Initialize theme
    initTheme();
    
    // Start with step 1 active
    navigateToStep(1);
});