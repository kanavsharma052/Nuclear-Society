// Nuclear Society Presentation JavaScript

class NuclearPresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 20;
        this.slides = document.querySelectorAll('.slide');
        this.sections = [
            { name: 'Introduction', start: 0, end: 0 },
            { name: 'Motivation', start: 1, end: 5 },
            { name: "India's 3-Stage Nuclear Program", start: 6, end: 7 },
            { name: 'Challenges', start: 8, end: 11 },
            { name: 'Your Role', start: 12, end: 13 },
            { name: 'Outcomes and Opportunities', start: 14, end: 16 },
            { name: 'Timeline', start: 17, end: 19 }
        ];
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.createDots();
        this.updateSlideCounter();
        this.updateSectionIndicator();
        this.loadTableData();
        this.setupKeyboardNavigation();
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());

        this.updateNavigationButtons();
    }

    createDots() {
        const dotsContainer = document.getElementById('slide-dots');
        dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === this.currentSlide) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= this.totalSlides) return;

        // Remove active class from current slide
        this.slides[this.currentSlide].classList.remove('active');
        if (slideIndex < this.currentSlide) {
            this.slides[this.currentSlide].classList.add('prev');
        } else {
            this.slides[this.currentSlide].classList.remove('prev');
        }

        // Update current slide
        this.currentSlide = slideIndex;

        // Add active class to new slide
        this.slides[this.currentSlide].classList.add('active');
        this.slides[this.currentSlide].classList.remove('prev');

        this.updateDots();
        this.updateNavigationButtons();
        this.updateSlideCounter();
        this.updateSectionIndicator();
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        prevBtn.disabled = this.currentSlide === 0;
        nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }

    updateSlideCounter() {
        document.getElementById('current-slide').textContent = this.currentSlide + 1;
        document.getElementById('total-slides').textContent = this.totalSlides;
    }

    updateSectionIndicator() {
        const currentSection = this.sections.find(section => 
            this.currentSlide >= section.start && this.currentSlide <= section.end
        );
        
        if (currentSection) {
            document.getElementById('current-section').textContent = currentSection.name;
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    event.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    event.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    event.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    event.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
    }

    async loadTableData() {
        try {
            await this.loadInvestmentsData();
            await this.loadStagesData();
            await this.loadSafetyData();
            await this.loadSoftwareData();
            await this.loadStartupsData();
            await this.loadPublicationsData();
        } catch (error) {
            console.error('Error loading table data:', error);
        }
    }

    async loadInvestmentsData() {
        try {
            const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/a3c5a5a14dc1de2fa2d9e37d6619a621/a946cb42-6303-477a-a5dc-d1d4ea0ba82d/0b589ddd.csv');
            const csvText = await response.text();
            const data = Papa.parse(csvText, { header: true }).data;
            
            const tableBody = document.querySelector('#investments-table tbody');
            tableBody.innerHTML = '';

            // Filter out empty rows and count valid rows
            const validRows = data.filter(row => 
                row['Country/Organization'] && 
                row['Country/Organization'].trim() !== '' &&
                row['Country/Organization'] !== 'undefined'
            );

            if (validRows.length === 0) {
                throw new Error('No valid data found in CSV');
            }

            validRows.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row['Country/Organization'] || ''}</td>
                    <td>${row['Investment Amount (USD)'] || ''}</td>
                    <td>${row['Focus Area'] || ''}</td>
                    <td>${row['Timeline'] || ''}</td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading investments data:', error);
            this.populateInvestmentsDataFallback();
        }
    }

    populateInvestmentsDataFallback() {
        const tableBody = document.querySelector('#investments-table tbody');
        const fallbackData = [
            ['USA', '$60 billion', 'SMR Development, Advanced Reactors', '2023-2030'],
            ['China', '$440 billion', 'Nuclear Fleet Expansion', '2021-2035'],
            ['France', '$52 billion', 'New Nuclear Program', '2023-2035'],
            ['UK', '$30 billion', 'Nuclear Renaissance', '2024-2035'],
            ['India', '$26 billion', 'Nuclear Capacity Addition', '2023-2032'],
            ['Japan', '$20 billion', 'Reactor Restarts, New Tech', '2023-2030']
        ];

        tableBody.innerHTML = '';
        fallbackData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    async loadStagesData() {
        try {
            const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/a3c5a5a14dc1de2fa2d9e37d6619a621/a946cb42-6303-477a-a5dc-d1d4ea0ba82d/f18a9f57.csv');
            const csvText = await response.text();
            const data = Papa.parse(csvText, { header: true }).data;
            
            const tableBody = document.querySelector('#stages-table tbody');
            tableBody.innerHTML = '';

            const validRows = data.filter(row => 
                row['Stage'] && 
                row['Stage'].trim() !== '' &&
                row['Stage'] !== 'undefined'
            );

            if (validRows.length === 0) {
                throw new Error('No valid data found in CSV');
            }

            validRows.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row['Stage'] || ''}</td>
                    <td>${row['Reactor Type'] || ''}</td>
                    <td>${row['Fuel'] || ''}</td>
                    <td>${row['Purpose'] || ''}</td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading stages data:', error);
            this.populateStagesDataFallback();
        }
    }

    populateStagesDataFallback() {
        const tableBody = document.querySelector('#stages-table tbody');
        const fallbackData = [
            ['Stage 1', 'Pressurized Heavy Water Reactor (PHWR)', 'Natural Uranium', 'Plutonium production from natural uranium'],
            ['Stage 2', 'Fast Breeder Reactor (FBR)', 'Plutonium + Uranium', 'Convert U-238 to Pu-239, breed U-233 from Thorium'],
            ['Stage 3', 'Advanced Heavy Water Reactor (AHWR)', 'U-233 + Thorium', 'Self-sustaining thorium fuel cycle']
        ];

        tableBody.innerHTML = '';
        fallbackData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    async loadSafetyData() {
        try {
            const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/a3c5a5a14dc1de2fa2d9e37d6619a621/a946cb42-6303-477a-a5dc-d1d4ea0ba82d/e61d0e68.csv');
            const csvText = await response.text();
            const data = Papa.parse(csvText, { header: true }).data;
            
            const tableBody = document.querySelector('#safety-table tbody');
            tableBody.innerHTML = '';

            const validRows = data.filter(row => 
                row['Safety Generation'] && 
                row['Safety Generation'].trim() !== '' &&
                row['Safety Generation'] !== 'undefined'
            );

            if (validRows.length === 0) {
                throw new Error('No valid data found in CSV');
            }

            validRows.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row['Safety Generation'] || ''}</td>
                    <td>${row['Timeline'] || ''}</td>
                    <td>${row['Key Features'] || ''}</td>
                    <td>${row['Example Systems'] || ''}</td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading safety data:', error);
            this.populateSafetyDataFallback();
        }
    }

    populateSafetyDataFallback() {
        const tableBody = document.querySelector('#safety-table tbody');
        const fallbackData = [
            ['Gen I', '1950s-1960s', 'Basic safety systems', 'Manual controls, basic containment'],
            ['Gen II', '1970s-1990s', 'Active safety systems', 'Emergency cooling, redundant systems'],
            ['Gen III', '1990s-2010s', 'Advanced active safety', 'Digital controls, improved containment'],
            ['Gen III+', '2010s-Present', 'Passive safety systems', 'Gravity-driven cooling, walk-away safe'],
            ['Gen IV', '2030s+', 'Inherent safety', 'Physics-based safety, fail-safe design']
        ];

        tableBody.innerHTML = '';
        fallbackData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    async loadSoftwareData() {
        try {
            const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/a3c5a5a14dc1de2fa2d9e37d6619a621/a946cb42-6303-477a-a5dc-d1d4ea0ba82d/8f43b7de.csv');
            const csvText = await response.text();
            const data = Papa.parse(csvText, { header: true }).data;
            
            const tableBody = document.querySelector('#software-table tbody');
            tableBody.innerHTML = '';

            const validRows = data.filter(row => 
                row['Software Tool'] && 
                row['Software Tool'].trim() !== '' &&
                row['Software Tool'] !== 'undefined'
            );

            if (validRows.length === 0) {
                throw new Error('No valid data found in CSV');
            }

            validRows.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row['Software Tool'] || ''}</td>
                    <td>${row['Application'] || ''}</td>
                    <td>${row['License'] || ''}</td>
                    <td>${row['Learning Difficulty'] || ''}</td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading software data:', error);
            this.populateSoftwareDataFallback();
        }
    }

    populateSoftwareDataFallback() {
        const tableBody = document.querySelector('#software-table tbody');
        const fallbackData = [
            ['OpenMC', 'Monte Carlo neutronics', 'Open Source', 'Intermediate'],
            ['OpenFOAM', 'Computational Fluid Dynamics', 'Open Source', 'Advanced'],
            ['MCNP', 'Radiation transport', 'Commercial', 'Advanced'],
            ['RELAP5', 'Thermal hydraulics', 'Government', 'Advanced'],
            ['SCALE', 'Nuclear analysis', 'Government', 'Intermediate'],
            ['Serpent', 'Reactor physics', 'Academic', 'Intermediate']
        ];

        tableBody.innerHTML = '';
        fallbackData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    async loadStartupsData() {
        try {
            const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/a3c5a5a14dc1de2fa2d9e37d6619a621/a946cb42-6303-477a-a5dc-d1d4ea0ba82d/5245aa80.csv');
            const csvText = await response.text();
            const data = Papa.parse(csvText, { header: true }).data;
            
            const tableBody = document.querySelector('#startups-table tbody');
            tableBody.innerHTML = '';

            const validRows = data.filter(row => 
                row['Category'] && 
                row['Category'].trim() !== '' &&
                row['Category'] !== 'undefined'
            );

            if (validRows.length === 0) {
                throw new Error('No valid data found in CSV');
            }

            validRows.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row['Category'] || ''}</td>
                    <td>${row['Number of Startups'] || ''}</td>
                    <td>${row['Total Funding (USD Millions)'] || ''}</td>
                    <td>${row['Key Examples'] || ''}</td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading startups data:', error);
            this.populateStartupsDataFallback();
        }
    }

    populateStartupsDataFallback() {
        const tableBody = document.querySelector('#startups-table tbody');
        const fallbackData = [
            ['Small Modular Reactors', '25', '8,500', 'NuScale, Rolls-Royce SMR, TerraPower'],
            ['Advanced Reactors', '18', '6,200', 'Kairos Power, X-energy, Commonwealth Fusion'],
            ['Fusion Technology', '35', '12,300', 'Helion Energy, TAE Technologies, Commonwealth Fusion'],
            ['Nuclear Services', '42', '3,800', 'Orano, Westinghouse, BWXT'],
            ['Digital/AI Solutions', '28', '2,100', 'Atomic Canyon, Deep Isolation, Lightbridge'],
            ['Waste Management', '15', '1,900', 'Deep Isolation, Holtec, Orano']
        ];

        tableBody.innerHTML = '';
        fallbackData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    async loadPublicationsData() {
        try {
            const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/a3c5a5a14dc1de2fa2d9e37d6619a621/a946cb42-6303-477a-a5dc-d1d4ea0ba82d/8045823a.csv');
            const csvText = await response.text();
            const data = Papa.parse(csvText, { header: true }).data;
            
            const tableBody = document.querySelector('#publications-table tbody');
            tableBody.innerHTML = '';

            const validRows = data.filter(row => 
                row['Research Area'] && 
                row['Research Area'].trim() !== '' &&
                row['Research Area'] !== 'undefined'
            );

            if (validRows.length === 0) {
                throw new Error('No valid data found in CSV');
            }

            validRows.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row['Research Area'] || ''}</td>
                    <td>${row['2023 Publications'] || ''}</td>
                    <td>${row['Growth Rate (%)'] || ''}</td>
                    <td>${row['Top Journals'] || ''}</td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading publications data:', error);
            this.populatePublicationsDataFallback();
        }
    }

    populatePublicationsDataFallback() {
        const tableBody = document.querySelector('#publications-table tbody');
        const fallbackData = [
            ['Reactor Physics', '2,845', '12.3', 'Nuclear Science & Engineering, Annals of Nuclear Energy'],
            ['Nuclear Safety', '1,923', '18.7', 'Nuclear Engineering & Design, Progress in Nuclear Energy'],
            ['Fuel Technology', '1,654', '15.2', 'Journal of Nuclear Materials, Nuclear Technology'],
            ['Thermal Hydraulics', '1,432', '14.8', 'Nuclear Engineering & Design, International Journal of Heat Transfer'],
            ['Waste Management', '1,234', '22.1', 'Progress in Nuclear Energy, Radioactive Waste Management'],
            ['Advanced Reactors', '1,123', '28.4', 'Nuclear Engineering & Design, Nuclear Technology'],
            ['Digital Twin/AI', '856', '35.6', 'Annals of Nuclear Energy, Nuclear Engineering & Technology'],
            ['SMR Technology', '734', '41.2', 'Nuclear Engineering & Design, Progress in Nuclear Energy']
        ];

        tableBody.innerHTML = '';
        fallbackData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
            `;
            tableBody.appendChild(tr);
        });
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NuclearPresentation();
});

// Add smooth scrolling for tables
document.addEventListener('DOMContentLoaded', () => {
    const tables = document.querySelectorAll('.table-container');
    tables.forEach(table => {
        table.style.scrollBehavior = 'smooth';
    });
});