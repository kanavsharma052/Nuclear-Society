// --- MERGED AND REFINED App.js ---
// Combines the best features of 'Test' and 'Dolphin' branches.

// 1. MERGED APPLICATION DATA (from both branches)
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

// 2. CORE APPLICATION LOGIC (Primarily from 'Test' branch for stability)
const sections = {
  1: 'Introduction', 2: 'Motivation', 3: 'Motivation', 4: 'Motivation', 5: 'Motivation', 6: 'Motivation',
  7: "India's Program", 8: "India's Program", 9: 'Challenges', 10: 'Challenges', 11: 'Challenges', 12: 'Challenges',
  13: 'Your Role', 14: 'Your Role', 15: 'Outcomes', 16: 'Outcomes', 17: 'Outcomes',
  18: 'Timeline', 19: 'Timeline', 20: 'Timeline'
};

let currentSlide = 1;
const totalSlides = 20;
let slides, prevBtn, nextBtn, currentSlideSpan, totalSlidesSpan, sectionNameSpan, navDots;

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing merged presentation...');
  initializeElements();
  setupNavigation();
  setupKeyboardNavigation();
  setupTouchNavigation(); // Added from Dolphin
  createNavigationDots();
  updateSlideInfo();
  updateButtonStates();
  // CRITICAL: Load content for the first slide immediately.
  loadSlideSpecificContent(1);
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

  // Accessibility improvements (from Dolphin)
  if (prevBtn) prevBtn.setAttribute('aria-label', 'Go to previous slide');
  if (nextBtn) nextBtn.setAttribute('aria-label', 'Go to next slide');
  slides.forEach((slide, index) => {
    slide.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}: ${sections[index + 1] || 'Introduction'}`);
    slide.setAttribute('role', 'region');
  });
}

// Using robust navigation from 'Test'
function setupNavigation() {
  if (prevBtn) {
    prevBtn.onclick = function(e) {
      e.preventDefault(); e.stopPropagation();
      previousSlide();
    };
  }
  if (nextBtn) {
    nextBtn.onclick = function(e) {
      e.preventDefault(); e.stopPropagation();
      nextSlide();
    };
  }
}

// Using advanced keyboard navigation from 'Test'
function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'ArrowLeft': e.preventDefault(); previousSlide(); break;
      case 'ArrowRight': case ' ': e.preventDefault(); nextSlide(); break;
      case 'Home': e.preventDefault(); goToSlide(1); break;
      case 'End': e.preventDefault(); goToSlide(totalSlides); break;
    }
  });
}

// Using touch navigation from 'Dolphin'
function setupTouchNavigation() {
    let touchStartX = 0;
    document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    document.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) { // Swipe threshold
            if (diff > 0) nextSlide(); // Swipe left
            else previousSlide(); // Swipe right
        }
    }, { passive: true });
}

// Using accessible and robust dot creation from 'Test'
function createNavigationDots() {
  if (!navDots) return;
  navDots.innerHTML = '';
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    if (i === 1) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${i}`);
    dot.setAttribute('tabindex', '0');

    dot.onclick = (function(slideNum) {
      return function(e) {
        e.preventDefault(); e.stopPropagation();
        goToSlide(slideNum);
      };
    })(i);

    dot.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToSlide(i);
      }
    });
    navDots.appendChild(dot);
  }
}

function previousSlide() {
  if (currentSlide > 1) goToSlide(currentSlide - 1);
}

function nextSlide() {
  if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
}

function goToSlide(slideNumber) {
  if (slideNumber < 1 || slideNumber > totalSlides || slideNumber === currentSlide) return;

  document.querySelector('.slide.active')?.classList.remove('active');
  document.querySelector(`[data-slide="${slideNumber}"]`)?.classList.add('active');
  
  currentSlide = slideNumber;

  updateSlideInfo();
  updateNavigationDots();
  updateButtonStates();
  loadSlideSpecificContent(slideNumber); // Reliable lazy loading
}

// CRITICAL FIX: This function ensures charts only load when needed.
function loadSlideSpecificContent(slideNumber) {
    // A small delay ensures the slide is visible before drawing the chart.
    setTimeout(() => {
        switch(slideNumber) {
            case 2: createSankeyDiagram(); break;
            case 5: createInvestmentChart(); break;
            case 12: createWorkforceChart(); break;
            // Add cases for new charts if needed
        }
    }, 100);
}

function updateSlideInfo() {
  if (currentSlideSpan) currentSlideSpan.textContent = currentSlide;
  if (sectionNameSpan) sectionNameSpan.textContent = sections[currentSlide] || 'Introduction';
}

function updateNavigationDots() {
  if (!navDots) return;
  navDots.querySelectorAll('.nav-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index + 1 === currentSlide);
  });
}

// Using the more detailed button state update from 'Test'
function updateButtonStates() {
  if (prevBtn) {
    prevBtn.disabled = currentSlide === 1;
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
  }
  if (nextBtn) {
    nextBtn.disabled = currentSlide === totalSlides;
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    nextBtn.textContent = (currentSlide === totalSlides) ? 'Complete' : 'Next';
  }
}

// --- 3. CHARTING FUNCTIONS (Using superior implementations from 'Test') ---

// Using the superior, responsive D3 Sankey from 'Test'
function createSankeyDiagram() {
  const container = document.getElementById('sankeyChart');
  if (!container || container.dataset.loaded === 'true') return;
  console.log('Creating Sankey diagram...');
  container.innerHTML = '';
  container.dataset.loaded = 'true';

  const margin = { top: 30, right: 20, bottom: 20, left: 20 };
  const width = Math.max(800, container.clientWidth || 800) - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = d3.select(container).append('svg')
    .attr('width', '100%').attr('height', '100%')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');
  
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const nodesData = [
    { id: 'Coal', x: 50, y: 80, value: 720, color: '#B4413C' }, { id: 'Oil & Gas', x: 50, y: 140, value: 280, color: '#DB4545' },
    { id: 'Nuclear', x: 50, y: 200, value: 50, color: '#1FB8CD' }, { id: 'Renewables', x: 50, y: 260, value: 120, color: '#5D878F' },
    { id: 'Electricity', x: 350, y: 150, value: 890, color: '#FFC185' }, { id: 'Transportation', x: 350, y: 260, value: 280, color: '#964325' },
    { id: 'Industry', x: 650, y: 100, value: 400, color: '#944454' }, { id: 'Residential', x: 650, y: 160, value: 300, color: '#D2BA4C' },
    { id: 'Commercial', x: 650, y: 220, value: 190, color: '#13343B' }
  ];
  
  appData.energyFlowData.forEach(link => {
    const sourceNode = nodesData.find(n => n.id === link.source);
    const targetNode = nodesData.find(n => n.id === link.target);
    if (!sourceNode || !targetNode) return;
    const midX = (sourceNode.x + targetNode.x) / 2;
    g.append('path')
      .attr('d', `M${sourceNode.x + 80},${sourceNode.y + 15} Q${midX},${sourceNode.y + 15} ${midX},${(sourceNode.y + targetNode.y) / 2} Q${midX},${targetNode.y + 15} ${targetNode.x - 80},${targetNode.y + 15}`)
      .attr('stroke', sourceNode.color).attr('stroke-width', Math.max(3, link.value / 15))
      .attr('fill', 'none').attr('opacity', 0.6);
  });

  const nodes = g.selectAll('.node').data(nodesData).enter().append('g').attr('transform', d => `translate(${d.x},${d.y})`);
  nodes.append('rect').attr('width', 160).attr('height', 30).attr('x', -80).attr('y', 0).attr('fill', d => d.color).attr('rx', 6).attr('stroke', '#fff');
  nodes.append('text').attr('text-anchor', 'middle').attr('x', 0).attr('y', 12).attr('fill', 'white').attr('font-size', '12px').attr('font-weight', 'bold').text(d => d.id);
  nodes.append('text').attr('text-anchor', 'middle').attr('x', 0).attr('y', 25).attr('fill', 'white').attr('font-size', '10px').text(d => `${d.value} TWh`);
  
  svg.append('text').attr('x', (width + margin.left + margin.right) / 2).attr('y', 20).attr('text-anchor', 'middle').style('font-size', '16px').style('font-weight', 'bold').text("India's Energy Flow (2024)");
}

// Using well-structured Chart.js implementation from 'Test'
function createInvestmentChart() {
  const ctx = document.getElementById('investmentChart')?.getContext('2d');
  if (!ctx || window.investmentChart) return;
  console.log('Creating investment chart...');

  window.investmentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: appData.investmentData.map(d => d.country),
      datasets: [
        { label: 'Investment ($B)', data: appData.investmentData.map(d => d.investment), backgroundColor: '#1FB8CD', yAxisID: 'y' },
        { label: 'Projects', data: appData.investmentData.map(d => d.projects), backgroundColor: '#FFC185', type: 'line', yAxisID: 'y1', tension: 0.4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { title: { display: true, text: 'Global Nuclear Investment & Projects (2024)', font: { size: 16 } }, legend: { position: 'top' } },
      scales: {
        y: { type: 'linear', position: 'left', title: { display: true, text: 'Investment ($B)' }, beginAtZero: true },
        y1: { type: 'linear', position: 'right', title: { display: true, text: 'Number of Projects' }, beginAtZero: true, grid: { drawOnChartArea: false } }
      }
    }
  });
}

// Using well-structured Chart.js implementation from 'Test'
function createWorkforceChart() {
  const ctx = document.getElementById('workforceChart')?.getContext('2d');
  if (!ctx || window.workforceChart) return;
  console.log('Creating workforce chart...');

  window.workforceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: appData.workforceProjections.map(d => d.year),
      datasets: [
        { label: 'Current Workforce', data: appData.workforceProjections.map(d => d.current), borderColor: '#B4413C', fill: true, tension: 0.4 },
        { label: 'Required Workforce', data: appData.workforceProjections.map(d => d.required), borderColor: '#1FB8CD', fill: true, tension: 0.4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { title: { display: true, text: 'Nuclear Workforce Projections (2024-2050)', font: { size: 16 } }, legend: { position: 'top' } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Number of Workers' }, ticks: { callback: value => (value / 1000) + 'K' } },
        x: { title: { display: true, text: 'Year' } }
      }
    }
  });
}

// Handle window resize for the D3 chart
window.addEventListener('resize', () => {
  if (currentSlide === 2) {
    // Debounce resize to prevent performance issues
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        const container = document.getElementById('sankeyChart');
        if (container) container.dataset.loaded = 'false'; // Force redraw
        createSankeyDiagram();
    }, 250);
  }
});
