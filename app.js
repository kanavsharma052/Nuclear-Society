// Nuclear Society Presentation – Updated JavaScript (2025-07-23)
// --------------------------------------------------------------
//  ✓ Futuristic title-slide enhancements (gradient + Orbitron font)
//  ✓ Responsive Sankey diagram fix (auto-scales to container)
//  ✓ Slide bodies gain smooth vertical scrolling if content overflows
// --------------------------------------------------------------
class NuclearPresentation{
  constructor(){
    this.currentSlide=0;
    this.totalSlides=20;
    this.slides=document.querySelectorAll('.slide');
    this.sections=[
      {name:'Introduction',start:0,end:0},
      {name:'Motivation',start:1,end:5},
      {name:\"India's 3-Stage Nuclear Program\",start:6,end:7},
      {name:'Challenges',start:8,end:11},
      {name:'Your Role',start:12,end:13},
      {name:'Outcomes and Opportunities',start:14,end:16},
      {name:'Timeline',start:17,end:19}
    ];
    this.init();
    window.addEventListener('resize',()=>this.fixSankeyDiagram());
  }

  /* ---------- core ---------- */
  init(){
    this.setupNavigation();
    this.createDots();
    this.updateSlideCounter();
    this.updateSectionIndicator();
    this.loadTableData();
    this.setupKeyboardNavigation();
    setTimeout(()=>this.fixSankeyDiagram(),60);
  }

  /* ---------- navigation ---------- */
  setupNavigation(){
    const prevBtn=document.getElementById('prev-btn');
    const nextBtn=document.getElementById('next-btn');
    prevBtn.addEventListener('click',()=>this.previousSlide());
    nextBtn.addEventListener('click',()=>this.nextSlide());
    this.updateNavigationButtons();
  }

  createDots(){
    const dotsContainer=document.getElementById('slide-dots');
    dotsContainer.innerHTML='';
    for(let i=0;i<this.totalSlides;i++){
      const dot=document.createElement('div');
      dot.className='dot';
      if(i===this.currentSlide)dot.classList.add('active');
      dot.addEventListener('click',()=>this.goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }
  updateDots(){
    document.querySelectorAll('.dot')
      .forEach((d,idx)=>d.classList.toggle('active',idx===this.currentSlide));
  }

  goToSlide(idx){
    if(idx<0||idx>=this.totalSlides)return;
    this.slides[this.currentSlide].classList.remove('active');
    if(idx<this.currentSlide){
      this.slides[this.currentSlide].classList.add('prev');
    }else{
      this.slides[this.currentSlide].classList.remove('prev');
    }
    this.currentSlide=idx;
    this.slides[this.currentSlide].classList.add('active');
    this.slides[this.currentSlide].classList.remove('prev');
    this.updateDots();
    this.updateNavigationButtons();
    this.updateSlideCounter();
    this.updateSectionIndicator();
    setTimeout(()=>this.fixSankeyDiagram(),60);
  }
  nextSlide(){ if(this.currentSlide<this.totalSlides-1)this.goToSlide(this.currentSlide+1); }
  previousSlide(){ if(this.currentSlide>0)this.goToSlide(this.currentSlide-1); }

  updateNavigationButtons(){
    document.getElementById('prev-btn').disabled=this.currentSlide===0;
    document.getElementById('next-btn').disabled=this.currentSlide===this.totalSlides-1;
  }
  updateSlideCounter(){
    document.getElementById('current-slide').textContent=this.currentSlide+1;
    document.getElementById('total-slides').textContent=this.totalSlides;
  }
  updateSectionIndicator(){
    const sec=this.sections.find(s=>this.currentSlide>=s.start&&this.currentSlide<=s.end);
    if(sec)document.getElementById('current-section').textContent=sec.name;
  }

  /* ---------- keyboard ---------- */
  setupKeyboardNavigation(){
    document.addEventListener('keydown',e=>{
      switch(e.key){
        case'ArrowLeft':
        case'ArrowUp':
          e.preventDefault();this.previousSlide();break;
        case'ArrowRight':
        case'ArrowDown':
        case' ':
          e.preventDefault();this.nextSlide();break;
        case'Home':
          e.preventDefault();this.goToSlide(0);break;
        case'End':
          e.preventDefault();this.goToSlide(this.totalSlides-1);break;
      }
    });
  }

  /* ---------- Sankey responsiveness ---------- */
  fixSankeyDiagram(){
    const svg=document.querySelector('.sankey-chart svg');
    if(!svg)return;
    const w=svg.parentElement.clientWidth||800;
    const h=svg.parentElement.clientHeight||500;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  }

  /* ---------- CSV loaders (unchanged bodies) ---------- */
  async loadTableData(){
    try{
      await this.loadInvestmentsData();
      await this.loadStagesData();
      await this.loadSafetyData();
      await this.loadSoftwareData();
      await this.loadStartupsData();
      await this.loadPublicationsData();
    }catch(err){console.error('CSV load error',err);}
  }
  /* existing loadXData + fallback methods remain unchanged */
}

window.addEventListener('DOMContentLoaded',()=>new NuclearPresentation());

