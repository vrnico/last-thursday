/**
 * Last Thursday // App Logic
 * SPA routing, card rendering, detail views
 */

(function () {
    // DOM refs
    const gridView = document.getElementById('project-grid');
    const detailView = document.getElementById('project-detail');
    const cardsContainer = document.getElementById('cards-container');
    const detailHeader = document.getElementById('detail-header');
    const backBtn = document.getElementById('back-btn');
    const homeLink = document.getElementById('home-link');
    const tabs = document.querySelectorAll('.tab');

    // Current project in detail view
    let currentProject = null;

    // ---- Rendering ----

    function renderCards() {
        cardsContainer.innerHTML = PROJECTS.map(project => `
            <article class="project-card" data-id="${project.id}">
                <span class="card-status ${project.hasDemo ? 'has-demo' : 'no-demo'}"
                      title="${project.hasDemo ? 'Live demo available' : 'No demo'}"></span>
                <span class="card-week">Week ${project.week}</span>
                <h3 class="card-title">${project.title}</h3>
                <p class="card-description">${project.description}</p>
                <div class="card-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </article>
        `).join('');

        // Card click handlers
        cardsContainer.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                window.location.hash = id;
            });
        });
    }

    function showGrid() {
        gridView.classList.add('active');
        detailView.classList.remove('active');
        currentProject = null;
        document.title = 'Last Thursday // Multiverse Schools';
    }

    function showDetail(projectId) {
        const project = PROJECTS.find(p => p.id === projectId);
        if (!project) {
            showGrid();
            return;
        }

        currentProject = project;
        gridView.classList.remove('active');
        detailView.classList.add('active');
        document.title = `${project.title} // Last Thursday`;

        // Header
        detailHeader.innerHTML = `
            <div class="detail-week">Week ${project.week}</div>
            <h2>${project.title}</h2>
            <p class="detail-description">${project.description}</p>
        `;

        // Reset to overview tab
        setActiveTab('overview');

        // Render all panels
        renderOverview(project);
        renderDemo(project);
        renderVideos(project);
        renderResources(project);
    }

    function renderOverview(project) {
        const panel = document.getElementById('panel-overview');
        panel.innerHTML = `<div class="readme-content">${project.readme}</div>`;
    }

    function renderDemo(project) {
        const panel = document.getElementById('panel-demo');

        if (project.demo.type === 'iframe' && project.demo.url) {
            panel.innerHTML = `
                <div class="demo-container">
                    <iframe src="${project.demo.url}" title="${project.title} demo"
                            sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
                </div>
            `;
        } else if (project.demo.type === 'link' && project.demo.url && project.demo.url !== '#') {
            panel.innerHTML = `
                <div class="demo-container demo-placeholder">
                    <div class="placeholder-icon">&#9654;</div>
                    <p>This demo opens in a new tab.</p>
                    <a href="${project.demo.url}" target="_blank" rel="noopener" class="demo-link">
                        Launch Demo
                    </a>
                </div>
            `;
        } else {
            panel.innerHTML = `
                <div class="no-content">
                    <p>No live demo available for this project.</p>
                    <p style="margin-top: 0.5rem; font-size: 0.85rem;">
                        Check the Overview and Videos tabs for more info.
                    </p>
                </div>
            `;
        }
    }

    function renderVideos(project) {
        const panel = document.getElementById('panel-videos');

        if (project.videos.length === 0) {
            panel.innerHTML = `
                <div class="no-content">
                    <p>No videos linked yet for this project.</p>
                </div>
            `;
            return;
        }

        panel.innerHTML = `
            <div class="videos-grid">
                ${project.videos.map(video => `
                    <div class="video-card">
                        <iframe src="${video.url}" title="${video.label}"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                        <div class="video-label">${video.label}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderResources(project) {
        const panel = document.getElementById('panel-resources');

        if (project.resources.length === 0) {
            panel.innerHTML = `
                <div class="no-content">
                    <p>No additional resources linked yet.</p>
                </div>
            `;
            return;
        }

        panel.innerHTML = `
            <div class="resources-list">
                ${project.resources.map(res => `
                    <div class="resource-item">
                        <span class="resource-icon">${res.icon}</span>
                        <div class="resource-info">
                            <div class="resource-title">${res.title}</div>
                            <div class="resource-desc">${res.description}</div>
                        </div>
                        <a href="${res.url}" target="_blank" rel="noopener" class="resource-link">
                            Open &rarr;
                        </a>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ---- Tabs ----

    function setActiveTab(tabName) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
        document.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.toggle('active', p.id === `panel-${tabName}`);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => setActiveTab(tab.dataset.tab));
    });

    // ---- Routing ----

    function handleRoute() {
        const hash = window.location.hash.slice(1);
        if (hash && hash !== '') {
            showDetail(hash);
        } else {
            showGrid();
        }
    }

    window.addEventListener('hashchange', handleRoute);

    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '';
    });

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '';
    });

    // ---- Init ----

    renderCards();
    handleRoute();
})();
