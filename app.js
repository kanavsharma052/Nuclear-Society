// Nuclear Society Presentation – Fixed JavaScript (2025-07-23)
class NuclearPresentation {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.currentSlide = 0;

    /* Optional semantic sections (not used for logic) */
    this.sections = [];

    // Activate the first slide
    if (this.slides[0]) this.slides[0].classList.add('active');

    this.init();
    window.addEventListener('resize', () => this.fixSankeyDiagram());
  }

  init() {
    this.setupNavigation();
    this.createDots();
    this.updateSlideCounter();
    this.updateSectionIndicator();
    this.buildSankey();
    this.setupKeyboardNavigation();
    setTimeout(() => this.fixSankeyDiagram(), 60);
  }

  /* ---------- navigation ---------- */
  setupNavigation() {
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.prevBtn.addEventListener('click', () => this.previousSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    this.updateNavigationButtons();
  }

  createDots() {
    const dotsContainer = document.getElementById('slide-dots');
    if (!dotsContainer) return; // guard

    dotsContainer.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === this.currentSlide ? ' active' : '');
      dot.addEventListener('click', () => this.goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  updateDots() {
    const dots = document.querySelectorAll('#slide-dots .dot');
    dots.forEach((d, idx) => d.classList.toggle('active', idx === this.currentSlide));
  }

  goToSlide(idx) {
    if (idx < 0 || idx >= this.totalSlides) return;
    this.slides[this.currentSlide].classList.remove('active');
    if (idx < this.currentSlide) {
      this.slides[this.currentSlide].classList.add('prev');
    } else {
      this.slides[this.currentSlide].classList.remove('prev');
    }
    this.currentSlide = idx;
    this.slides[this.currentSlide].classList.add('active');
    this.slides[this.currentSlide].classList.remove('prev');
    this.updateDots();
    this.updateNavigationButtons();
    this.updateSlideCounter();
    this.updateSectionIndicator();
  }
  nextSlide() { if (this.currentSlide < this.totalSlides - 1) this.goToSlide(this.currentSlide + 1); }
  previousSlide() { if (this.currentSlide > 0) this.goToSlide(this.currentSlide - 1); }

  updateNavigationButtons() {
    this.prevBtn.disabled = this.currentSlide === 0;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
  }
  updateSlideCounter() {
    const cur = document.getElementById('current-slide');
    const tot = document.getElementById('total-slides');
    if (cur) cur.textContent = this.currentSlide + 1;
    if (tot) tot.textContent = this.totalSlides;
  }
  updateSectionIndicator() {
    const el = document.getElementById('current-section');
    if (!el) return;
    const sec = this.sections.find(s => this.currentSlide >= s.start && this.currentSlide <= s.end);
    el.textContent = sec ? sec.name : '';
  }

  /* ---------- keyboard ---------- */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault(); this.previousSlide(); break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // space
          e.preventDefault(); this.nextSlide(); break;
        case 'Home':
          e.preventDefault(); this.goToSlide(0); break;
        case 'End':
          e.preventDefault(); this.goToSlide(this.totalSlides - 1); break;
      }
    });
  }

  /* ---------- Sankey with Chart.js ---------- */
  buildSankey() {
    const ctx = document.getElementById('energySankey');
    if (!ctx) return;

    // Fetch CSV and build chart
    Papa.parse('india_energy_sankey_data.csv', {
      header: true,
      download: true,
      complete: (results) => {
        const data = results.data.filter(r => r.Source);
        const labels = [...new Set(data.flatMap(r => [r.Source, r.Target]))];
        const nodes = labels.map(l => ({ name: l }));
        const links = data.map(r => ({ source: r.Source, target: r.Target, value: +r.Value }));

        new Chart(ctx, {
          type: 'sankey',
          data: {
            datasets: [{
              label: 'India Energy Flow',
              colorFrom: 'source',
              colorTo: 'target',
              colorMode: 'gradient',
              data: links,
              nodeId: labels,
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }
    });
  }

  fixSankeyDiagram() {
    // Chart.js handles responsiveness automatically
  }
}

document.addEventListener('DOMContentLoaded', () => new NuclearPresentation());
