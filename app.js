// Application data
const appData = {
  energyFlowData: [
    {"source": "Coal", "target": "Electricity", "value": 720},
    {"source": "Oil & Gas", "target": "Transportation", "value": 280},
    {"source": "Nuclear", "target": "Electricity", "value": 50},
    {"source": "Renewables", "target": "Electricity", "value": 120},
    {"source": "Electricity", "target": "Industry", "value": 400},
    {"source": "Electricity", "target": "Residential", "value": 300},
    {"source": "Electricity", "target": "Commercial", "value": 190}
  ],
  investmentData: [
    {"country": "USA", "investment": 85, "projects": 12},
    {"country": "China", "investment": 120, "projects": 18},
    {"country": "India", "investment": 45, "projects": 8},
    {"country": "France", "investment": 35, "projects": 6},
    {"country": "UK", "investment": 28, "projects": 5}
  ],
  workforceProjections: [
    {"year": 2024, "current": 100000, "required": 100000},
    {"year": 2030, "current": 150000, "required": 200000},
    {"year": 2040, "current": 250000, "required": 300000},
    {"year": 2050, "current": 375000, "required": 375000}
  ]
};

// Section mapping
const sections = {
  1: 'Introduction',
  2: 'Motivation', 3: 'Motivation', 4: 'Motivation', 5: 'Motivation', 6: 'Motivation',
  7: "India's Program", 8: "India's Program",
  9: 'Challenges', 10: 'Challenges', 11: 'Challenges', 12: 'Challenges',
  13: 'Your Role', 14: 'Your Role',
  15: 'Outcomes', 16: 'Outcomes', 17: 'Outcomes',
  18: 'Timeline', 19: 'Timeline', 20: 'Timeline'
};

// Application state
let currentSlide = 1;
const totalSlides = 20;

// DOM elements
let slides, prevBtn, nextBtn, currentSlideSpan, totalSlidesSpan, sectionNameSpan, navDots;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing presentation...');
  initializeElements();
  setupNavigation();
  setupKeyboardNavigation();
  createNavigationDots();
  updateSlideInfo();
  updateButtonStates();
  
  // Initialize charts with delay
  setTimeout(() => {
    initializeCharts();
  }, 500);
});

function initializeElements() {
  slides = document.querySelectorAll('.slide');
  prevBtn = document.getElementById('prevBtn');
  nextBtn = document.getElementById('nextBtn');
  currentSlideSpan = document.getElementById('currentSlide');
  totalSlidesSpan = document.getElementById('totalSlides');
  sectionNameSpan = document.getElementById('sectionName');
  navDots = document.getElementById('navDots');
  
  console.log('Elements initialized:', {
    slides: slides.length,
    prevBtn: !!prevBtn,
    nextBtn: !!nextBtn,
    navDots: !!navDots
  });
  
  totalSlidesSpan.textContent = totalSlides;
}

function setupNavigation() {
  // Remove any existing listeners and add new ones
  if (prevBtn) {
    prevBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Previous button clicked');
      previousSlide();
      return false;
    };
  }
  
  if (nextBtn) {
    nextBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Next button clicked');
      nextSlide();
      return false;
    };
  }
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    console.log('Key pressed:', e.key);
    
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        previousSlide();
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides);
        break;
    }
  });
}

function createNavigationDots() {
  if (!navDots) return;
  
  navDots.innerHTML = ''; // Clear existing dots
  
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    if (i === 1) dot.classList.add('active');
    
    // Use closure to capture the correct slide number
    dot.onclick = (function(slideNum) {
      return function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Dot clicked for slide:', slideNum);
        goToSlide(slideNum);
        return false;
      };
    })(i);
    
    dot.setAttribute('aria-label', `Go to slide ${i}`);
    dot.setAttribute('tabindex', '0');
    
    // Add keyboard support for dots
    dot.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToSlide(i);
      }
    });
    
    navDots.appendChild(dot);
  }
  
  console.log('Navigation dots created:', totalSlides);
}

function previousSlide() {
  console.log('previousSlide called, currentSlide:', currentSlide);
  if (currentSlide > 1) {
    goToSlide(currentSlide - 1);
  }
}

function nextSlide() {
  console.log('nextSlide called, currentSlide:', currentSlide);
  if (currentSlide < totalSlides) {
    goToSlide(currentSlide + 1);
  }
}

function goToSlide(slideNumber) {
  console.log('goToSlide called with:', slideNumber, 'current:', currentSlide);
  
  if (slideNumber < 1 || slideNumber > totalSlides || slideNumber === currentSlide) {
    console.log('Invalid slide number or same slide, returning');
    return;
  }
  
  // Remove active class from current slide
  const currentSlideElement = document.querySelector('.slide.active');
  if (currentSlideElement) {
    currentSlideElement.classList.remove('active');
  }
  
  // Add active class to new slide
  const newSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
  if (newSlideElement) {
    newSlideElement.classList.add('active');
    console.log('Activated slide:', slideNumber);
  } else {
    console.error('Could not find slide element for:', slideNumber);
  }
  
  // Update current slide number
  currentSlide = slideNumber;
  
  // Update UI
  updateSlideInfo();
  updateNavigationDots();
  updateButtonStates();
  
  // Load slide-specific content
  loadSlideSpecificContent(slideNumber);
}

function loadSlideSpecificContent(slideNumber) {
  switch(slideNumber) {
    case 2:
      setTimeout(() => createSankeyDiagram(), 100);
      break;
    case 5:
      setTimeout(() => createInvestmentChart(), 100);
      break;
    case 12:
      setTimeout(() => createWorkforceChart(), 100);
      break;
  }
}

function updateSlideInfo() {
  if (currentSlideSpan) {
    currentSlideSpan.textContent = currentSlide;
  }
  if (sectionNameSpan) {
    sectionNameSpan.textContent = sections[currentSlide] || 'Introduction';
  }
  console.log('Updated slide info:', currentSlide, sections[currentSlide]);
}

function updateNavigationDots() {
  if (!navDots) return;
  
  const dots = navDots.querySelectorAll('.nav-dot');
  dots.forEach((dot, index) => {
    if (index + 1 === currentSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function updateButtonStates() {
  // Update previous button
  if (prevBtn) {
    prevBtn.disabled = currentSlide === 1;
    prevBtn.style.opacity = currentSlide === 1 ? '0.5' : '1';
  }
  
  // CRITICAL FIX: Update next button - disable on last slide
  if (nextBtn) {
    nextBtn.disabled = currentSlide === totalSlides;
    nextBtn.style.opacity = currentSlide === totalSlides ? '0.5' : '1';
    
    // Update button text for last slide
    if (currentSlide === totalSlides) {
      nextBtn.textContent = 'Complete';
    } else {
      nextBtn.textContent = 'Next';
    }
  }
  
  console.log('Button states updated:', {
    prevDisabled: currentSlide === 1,
    nextDisabled: currentSlide === totalSlides,
    currentSlide: currentSlide
  });
}

function initializeCharts() {
  console.log('Initializing charts...');
  createSankeyDiagram();
}

function createSankeyDiagram() {
  const container = document.getElementById('sankeyChart');
  if (!container) {
    console.log('Sankey chart container not found');
    return;
  }
  
  console.log('Creating Sankey diagram...');
  
  // Clear existing content
  container.innerHTML = '';
  
  // Get container dimensions
  const containerRect = container.getBoundingClientRect();
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = Math.max(800, containerRect.width || 800) - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;
  
  // Create SVG with proper responsiveness
  const svg = d3.select('#sankeyChart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Define nodes with positions
  const nodesData = [
    { id: 'Coal', x: 50, y: 80, value: 720, color: '#B4413C' },
    { id: 'Oil & Gas', x: 50, y: 140, value: 280, color: '#DB4545' },
    { id: 'Nuclear', x: 50, y: 200, value: 50, color: '#1FB8CD' },
    { id: 'Renewables', x: 50, y: 260, value: 120, color: '#5D878F' },
    { id: 'Electricity', x: 350, y: 150, value: 890, color: '#FFC185' },
    { id: 'Transportation', x: 350, y: 260, value: 280, color: '#964325' },
    { id: 'Industry', x: 650, y: 100, value: 400, color: '#944454' },
    { id: 'Residential', x: 650, y: 160, value: 300, color: '#D2BA4C' },
    { id: 'Commercial', x: 650, y: 220, value: 190, color: '#13343B' }
  ];
  
  const linksData = appData.energyFlowData;
  
  // Draw links first
  linksData.forEach(link => {
    const sourceNode = nodesData.find(n => n.id === link.source);
    const targetNode = nodesData.find(n => n.id === link.target);
    
    if (sourceNode && targetNode) {
      const linkWidth = Math.max(3, link.value / 15);
      
      // Create curved path
      const midX = (sourceNode.x + targetNode.x) / 2;
      const path = `M${sourceNode.x + 80},${sourceNode.y + 15} 
                   Q${midX},${sourceNode.y + 15} ${midX},${(sourceNode.y + targetNode.y) / 2}
                   Q${midX},${targetNode.y + 15} ${targetNode.x - 80},${targetNode.y + 15}`;
      
      g.append('path')
        .attr('d', path)
        .attr('stroke', sourceNode.color)
        .attr('stroke-width', linkWidth)
        .attr('fill', 'none')
        .attr('opacity', 0.6);
    }
  });
  
  // Draw nodes
  const nodes = g.selectAll('.node')
    .data(nodesData)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x},${d.y})`);
  
  // Node rectangles
  nodes.append('rect')
    .attr('width', 160)
    .attr('height', 30)
    .attr('x', -80)
    .attr('y', 0)
    .attr('fill', d => d.color)
    .attr('rx', 6)
    .attr('stroke', '#fff')
    .attr('stroke-width', 1);
  
  // Node labels
  nodes.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', 12)
    .attr('fill', 'white')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text(d => d.id);
  
  // Node values
  nodes.append('text')
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', 25)
    .attr('fill', 'white')
    .attr('font-size', '10px')
    .text(d => `${d.value} TWh`);
  
  // Add title
  svg.append('text')
    .attr('x', (width + margin.left + margin.right) / 2)
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text('India\'s Energy Flow (2024)');
  
  console.log('Sankey diagram created successfully');
}

function createInvestmentChart() {
  const ctx = document.getElementById('investmentChart');
  if (!ctx || window.investmentChart) return;
  
  console.log('Creating investment chart...');
  
  window.investmentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: appData.investmentData.map(d => d.country),
      datasets: [
        {
          label: 'Investment ($B)',
          data: appData.investmentData.map(d => d.investment),
          backgroundColor: '#1FB8CD',
          borderColor: '#13343B',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Projects',
          data: appData.investmentData.map(d => d.projects),
          backgroundColor: '#FFC185',
          borderColor: '#964325',
          borderWidth: 2,
          type: 'line',
          yAxisID: 'y1',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Global Nuclear Investment & Projects (2024)',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Investment ($B)'
          },
          beginAtZero: true
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Number of Projects'
          },
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    }
  });
}

function createWorkforceChart() {
  const ctx = document.getElementById('workforceChart');
  if (!ctx || window.workforceChart) return;
  
  console.log('Creating workforce chart...');
  
  window.workforceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: appData.workforceProjections.map(d => d.year),
      datasets: [
        {
          label: 'Current Workforce',
          data: appData.workforceProjections.map(d => d.current),
          borderColor: '#B4413C',
          backgroundColor: 'rgba(180, 65, 60, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Required Workforce',
          data: appData.workforceProjections.map(d => d.required),
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Nuclear Workforce Projections (2024-2050)',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Workers'
          },
          ticks: {
            callback: function(value) {
              return (value / 1000) + 'K';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      }
    }
  });
}

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
  setTimeout(() => {
    if (currentSlide === 2) {
      createSankeyDiagram();
    }
  }, 100);
});

// Touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', function(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  }
}

// Export functions for debugging
window.NuclearPresentation = {
  goToSlide,
  nextSlide,
  previousSlide,
  getCurrentSlide: () => currentSlide,
  getTotalSlides: () => totalSlides,
  createSankeyDiagram,
  createInvestmentChart,
  createWorkforceChart
};

// Additional debugging
console.log('Nuclear Presentation app loaded successfully');