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
  ],
  reactorSpecs: [
    {"reactor": "BSMR-200", "capacity": "200 MWe", "timeline": "2028-2030", "applications": "Industrial, Grid"},
    {"reactor": "BSMR-55", "capacity": "55 MWe", "timeline": "2030-2032", "applications": "Remote, Island"}
  ],
  timelineData: [
    {"phase": "Lecture Series", "duration": "Months 1-3", "description": "Nuclear physics and reactor theory"},
    {"phase": "Software Training", "duration": "Months 4-6", "description": "OpenMC, OpenFOAM, simulation tools"},
    {"phase": "Team Formation", "duration": "Months 7-9", "description": "Mission mode teams with KPI tracking"}
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

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  setupNavigation();
  setupKeyboardNavigation();
  createNavigationDots();
  initializeCharts();
  updateSlideInfo();
});

function initializeElements() {
  slides = document.querySelectorAll('.slide');
  prevBtn = document.getElementById('prevBtn');
  nextBtn = document.getElementById('nextBtn');
  currentSlideSpan = document.getElementById('currentSlide');
  totalSlidesSpan = document.getElementById('totalSlides');
  sectionNameSpan = document.getElementById('sectionName');
  navDots = document.getElementById('navDots');
  
  totalSlidesSpan.textContent = totalSlides;
}

function setupNavigation() {
  prevBtn.addEventListener('click', previousSlide);
  nextBtn.addEventListener('click', nextSlide);
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'ArrowLeft':
        previousSlide();
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'Home':
        goToSlide(1);
        break;
      case 'End':
        goToSlide(totalSlides);
        break;
    }
  });
}

function createNavigationDots() {
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    if (i === 1) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    navDots.appendChild(dot);
  }
}

function previousSlide() {
  if (currentSlide > 1) {
    goToSlide(currentSlide - 1);
  }
}

function nextSlide() {
  if (currentSlide < totalSlides) {
    goToSlide(currentSlide + 1);
  }
}

function goToSlide(slideNumber) {
  if (slideNumber < 1 || slideNumber > totalSlides) return;
  
  // Remove active class from current slide
  const currentSlideElement = document.querySelector('.slide.active');
  if (currentSlideElement) {
    currentSlideElement.classList.remove('active');
    currentSlideElement.classList.add('prev');
  }
  
  // Add active class to new slide
  const newSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
  if (newSlideElement) {
    newSlideElement.classList.remove('prev');
    newSlideElement.classList.add('active');
  }
  
  // Clean up prev class after transition
  setTimeout(() => {
    slides.forEach(slide => slide.classList.remove('prev'));
  }, 500);
  
  currentSlide = slideNumber;
  updateSlideInfo();
  updateNavigationDots();
  updateButtonStates();
}

function updateSlideInfo() {
  currentSlideSpan.textContent = currentSlide;
  sectionNameSpan.textContent = sections[currentSlide] || 'Introduction';
}

function updateNavigationDots() {
  const dots = navDots.querySelectorAll('.nav-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index + 1 === currentSlide);
  });
}

function updateButtonStates() {
  prevBtn.disabled = currentSlide === 1;
  nextBtn.disabled = currentSlide === totalSlides;
  
  if (currentSlide === 1) {
    prevBtn.style.opacity = '0.5';
  } else {
    prevBtn.style.opacity = '1';
  }
  
  if (currentSlide === totalSlides) {
    nextBtn.style.opacity = '0.5';
  } else {
    nextBtn.style.opacity = '1';
  }
}

function initializeCharts() {
  // Initialize charts after a short delay to ensure DOM is ready
  setTimeout(() => {
    createSankeyDiagram();
    createInvestmentChart();
    createWorkforceChart();
  }, 100);
}

function createSankeyDiagram() {
  const container = document.getElementById('sankeyChart');
  if (!container) return;
  
  // Create a simplified Sankey-style visualization using D3
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const width = container.clientWidth - margin.left - margin.right;
  const height = container.clientHeight - margin.top - margin.bottom;
  
  // Clear existing content
  container.innerHTML = '';
  
  const svg = d3.select('#sankeyChart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom + margin.top);
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Create nodes and links data
  const nodesData = [
    { id: 'Coal', x: 50, y: 100, value: 720 },
    { id: 'Oil & Gas', x: 50, y: 200, value: 280 },
    { id: 'Nuclear', x: 50, y: 300, value: 50 },
    { id: 'Renewables', x: 50, y: 400, value: 120 },
    { id: 'Electricity', x: 250, y: 200, value: 890 },
    { id: 'Transportation', x: 250, y: 350, value: 280 },
    { id: 'Industry', x: 450, y: 150, value: 400 },
    { id: 'Residential', x: 450, y: 220, value: 300 },
    { id: 'Commercial', x: 450, y: 290, value: 190 }
  ];
  
  const linksData = appData.energyFlowData;
  
  // Color scale
  const colorScale = d3.scaleOrdinal()
    .domain(['Coal', 'Oil & Gas', 'Nuclear', 'Renewables', 'Electricity', 'Transportation', 'Industry', 'Residential', 'Commercial'])
    .range(['#B4413C', '#DB4545', '#1FB8CD', '#5D878F', '#FFC185', '#964325', '#944454', '#D2BA4C', '#13343B']);
  
  // Draw links
  linksData.forEach(link => {
    const sourceNode = nodesData.find(n => n.id === link.source);
    const targetNode = nodesData.find(n => n.id === link.target);
    
    if (sourceNode && targetNode) {
      const linkWidth = Math.max(2, link.value / 20);
      
      g.append('path')
        .attr('d', `M${sourceNode.x + 60},${sourceNode.y} 
                   C${(sourceNode.x + targetNode.x) / 2},${sourceNode.y} 
                   ${(sourceNode.x + targetNode.x) / 2},${targetNode.y} 
                   ${targetNode.x - 60},${targetNode.y}`)
        .attr('stroke', colorScale(link.source))
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
  
  nodes.append('rect')
    .attr('width', 120)
    .attr('height', d => Math.max(20, d.value / 20))
    .attr('x', -60)
    .attr('y', -10)
    .attr('fill', d => colorScale(d.id))
    .attr('rx', 4);
  
  nodes.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', 5)
    .attr('fill', 'white')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text(d => d.id);
  
  nodes.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', 20)
    .attr('fill', 'white')
    .attr('font-size', '10px')
    .text(d => `${d.value} TWh`);
}

function createInvestmentChart() {
  const ctx = document.getElementById('investmentChart');
  if (!ctx) return;
  
  const chart = new Chart(ctx, {
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
          borderWidth: 1,
          type: 'line',
          yAxisID: 'y1'
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
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Number of Projects'
          },
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
  if (!ctx) return;
  
  const chart = new Chart(ctx, {
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
          tension: 0.4
        },
        {
          label: 'Required Workforce',
          data: appData.workforceProjections.map(d => d.required),
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          borderWidth: 3,
          fill: true,
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
      },
      elements: {
        point: {
          radius: 6,
          hoverRadius: 8
        }
      }
    }
  });
}

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
  setTimeout(() => {
    createSankeyDiagram();
  }, 100);
});

// Smooth scrolling for content within slides
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach(slide => {
    slide.style.scrollBehavior = 'smooth';
  });
});

// Add touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next slide
      nextSlide();
    } else {
      // Swipe right - previous slide
      previousSlide();
    }
  }
}

// Intersection Observer for slide visibility
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
};

const slideObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Trigger any slide-specific animations or actions
      const slideNumber = parseInt(entry.target.dataset.slide);
      if (slideNumber && slideNumber !== currentSlide) {
        // Update current slide if different
        currentSlide = slideNumber;
        updateSlideInfo();
        updateNavigationDots();
        updateButtonStates();
      }
    }
  });
}, observerOptions);

// Observe all slides
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach(slide => {
    slideObserver.observe(slide);
  });
});

// Add animation classes for enhanced transitions
function addSlideAnimations() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide, index) => {
    slide.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', addSlideAnimations);

// Performance optimization: lazy load charts
const chartObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const slideNumber = parseInt(entry.target.dataset.slide);
      
      // Load specific charts when their slides become visible
      if (slideNumber === 2 && !entry.target.dataset.sankeyLoaded) {
        setTimeout(createSankeyDiagram, 100);
        entry.target.dataset.sankeyLoaded = 'true';
      } else if (slideNumber === 5 && !entry.target.dataset.investmentLoaded) {
        setTimeout(createInvestmentChart, 100);
        entry.target.dataset.investmentLoaded = 'true';
      } else if (slideNumber === 12 && !entry.target.dataset.workforceLoaded) {
        setTimeout(createWorkforceChart, 100);
        entry.target.dataset.workforceLoaded = 'true';
      }
    }
  });
}, { threshold: 0.1 });

// Observe slides with charts
document.addEventListener('DOMContentLoaded', function() {
  const chartSlides = document.querySelectorAll('[data-slide="2"], [data-slide="5"], [data-slide="12"]');
  chartSlides.forEach(slide => {
    chartObserver.observe(slide);
  });
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
  // Add ARIA labels
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) {
    prevBtn.setAttribute('aria-label', 'Go to previous slide');
  }
  
  if (nextBtn) {
    nextBtn.setAttribute('aria-label', 'Go to next slide');
  }
  
  // Add slide announcements for screen readers
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide, index) => {
    slide.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}: ${sections[index + 1] || 'Introduction'}`);
    slide.setAttribute('role', 'region');
  });
});

// Error handling for chart creation
function safeCreateChart(createFunction, chartName) {
  try {
    createFunction();
  } catch (error) {
    console.warn(`Failed to create ${chartName}:`, error);
    // Could add fallback content here
  }
}

// Export functions for potential external use
window.NuclearPresentation = {
  goToSlide,
  nextSlide,
  previousSlide,
  getCurrentSlide: () => currentSlide,
  getTotalSlides: () => totalSlides
};