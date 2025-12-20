// script.js

(() => {
    let highestZIndex = 10;
    let bsodShown = false;
    const openWindows = new Set();
    const maximizedWindows = new Set();
    const windowRestoreState = new Map();
    const MAXIMIZE_LABEL = "";
    const SOUND_KEY = "win98-sound-enabled";
    const SOUND_VOLUME_KEY = "win98-sound-volume";
    const RECYCLE_KEY = "win98-recycle-empty";
    const PAGE_ICONS = {
        about: "about-icon.png",
        gallery: "gallery-icon.png",
        contact: "contact-icon.png",
        help: "help-icon.png",
        find: "search-iconm.png",
    };

    const PROJECT_FOLDERS = [{
            id: "engr210",
            title: "Engr Graphics - Moustrap Car",
            icon: "engr210-icon.png",
            contents: [
                "Design sketches",
                "3D CAD iterations",
                "Machining + assembly photos",
            ],
        },
        {
            id: "engr230",
            title: "Engr 230 Statics - Truss Bridge Design",
            icon: "engr230-icon.png",
            contents: [
                "Free-body diagrams",
                "Load cases + stress calcs",
                "Final bridge render",
            ],
        },
        {
            id: "engr270",
            title: "Engr 270 Material Science",
            icon: "engr270-icon.png",
            contents: [
                "Lab notes",
                "Microstructure images",
                "Material property charts",
            ],
        },
        {
            id: "susty",
            title: "Sustainability Project",
            icon: "susty-icon.png",
            contents: [
                "Concept brief",
                "Energy model snapshots",
                "Pilot build photos",
            ],
        },
        {
            id: "racing",
            title: "Racing",
            icon: "racing-icon.png",
            contents: [
                "Chassis setup notes",
                "Data logs",
                "Trackside gallery",
            ],
        },
        {
            id: "diy",
            title: "DIY Projects",
            icon: "diy-icon.png",
            contents: [
                "Shop jigs",
                "Electronics experiments",
                "Random builds",
            ],
        },
    ];

    const SEARCH_ENTRIES = [{
            label: "About Me",
            type: "open",
            key: "about",
            meta: "Bio and background",
        },
        {
            label: "Project Gallery",
            type: "open",
            key: "gallery",
            meta: "All project folders",
        },
        {
            label: "Engr Graphics - Mousetrap Car",
            type: "project",
            key: "engr210",
            meta: "ENGR 210",
        },
        {
            label: "Engr 230 Statics - Truss Bridge Design",
            type: "project",
            key: "engr230",
            meta: "ENGR 230",
        },
        {
            label: "Engr 270 Material Science",
            type: "project",
            key: "engr270",
            meta: "ENGR 270",
        },
        {
            label: "Sustainability Project",
            type: "project",
            key: "susty",
            meta: "Sustainability",
        },
        {
            label: "Racing",
            type: "project",
            key: "racing",
            meta: "Time attack, rally, endurance",
        },
        {
            label: "DIY Projects",
            type: "project",
            key: "diy",
            meta: "Builds and experiments",
        },
        {
            label: "Contact",
            type: "open",
            key: "contact",
            meta: "Email and LinkedIn",
        },
        {
            label: "Games",
            type: "open",
            key: "games",
            meta: "Solitaire, Minesweeper, Snake",
        },
        {
            label: "Notepad",
            type: "open",
            key: "notepad",
            meta: "Write notes",
        },
        {
            label: "MS-DOS Prompt",
            type: "open",
            key: "dos",
            meta: "Retro command prompt",
        },
        {
            label: "Find",
            type: "open",
            key: "find",
            meta: "Search this site",
        },
        {
            label: "Help",
            type: "open",
            key: "help",
            meta: "How to use the site",
        },
    ];

    const PAGES = {
        about: {
            title: "About Me",
            html: `
        <p>
          I'm Oleg, an international engineering student and robotics technician based in the Bay Area. With a background in computer science, racing, and sustainability projects, I like turning complex ideas into practical, efficient systems. When I'm not in class or at work, I'm usually building robots, tuning race cars, or designing interactive exhibits that make technology easier to understand.
        </p>
        <div class="project-media-collection">
          <div class="project-media">
            <img src="assets/aboutme/1.jpg" alt="Oleg working on a robotics project">
            <p class="project-media-caption">Robotics build day</p>
          </div>
          <div class="project-media">
            <img src="assets/aboutme/2.jpg" alt="Oleg at a race car setup session">
            <p class="project-media-caption">Trackside setup</p>
          </div>
          <div class="project-media">
            <img src="assets/aboutme/3.jpg" alt="Oleg presenting an engineering project">
            <p class="project-media-caption">Presenting an engineering demo</p>
          </div>
          <div class="project-media">
            <img src="assets/aboutme/4.jpg" alt="Oleg in the shop prototyping">
            <p class="project-media-caption">Shop prototyping</p>
          </div>
        </div>
      `,
        },
        gallery: {
            title: "Project Gallery",
            html: `
        <p>
          Here you’ll soon find a curated gallery of my projects: race car builds,
          robotics systems, sustainability exhibits, and more.
        </p>
        <p>
          This section is under construction 🚧 and will be updated after finals
          season. Come back in early 2025 for a proper portfolio of photos and
          build notes.
        </p>
      `,
        },
        contact: {
            title: "Contact",
            html: `
        <p>You can reach me here:</p>
        <p>
          Email:
          <a href="mailto:oleg@oleg-nik.com">oleg@oleg-nik.com</a>
        </p>
        <p>
          LinkedIn:
          <a href="https://www.linkedin.com/in/oleg-nikitashin-2b038a20a/"
             target="_blank" rel="noopener noreferrer">
            linkedin.com/in/oleg-nikitashin-2b038a20a
          </a>
        </p>
      `,
        },
        find: {
            title: "Find",
            html: "",
        },
        help: {
            title: "Help",
            html: "",
        },
    };

    PAGES.gallery.html = renderGalleryHTML();
    PAGES.find.html = renderFindHTML();
    PAGES.help.html = renderHelpHTML();

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        showFirstLoadScreen();
        // Ensure games window starts hidden (defensive)
        const popupGames = document.getElementById("popup-games");
        if (popupGames) {
            popupGames.classList.add("hidden");
        }

        initDesktopIcons();
        initStartMenu();
        initQuickLaunch();
        initWindowControls();
        initGlobalClickHandlers();
        initClock();
        initDragging();
        initSoundControl();
        initTimeControl();
        initTicTacToeIcon();
        initRecycleBin();
    }

    function initTicTacToeIcon() {
        const gamesWindow = document.getElementById("popup-games");
        if (gamesWindow) {
            wireGameIcons(gamesWindow);
        }
    }

    /* --------------------------------------------------
     * Desktop / Start Menu
     * -------------------------------------------------- */

    function initDesktopIcons() {
        const desktop = document.getElementById("desktop");
        if (!desktop) return;

        const icons = desktop.querySelectorAll(".desktop-icon");
        setInitialIconPositions(icons, desktop);

        const dragState = {
            active: false,
            icon: null,
            offsetX: 0,
            offsetY: 0,
            moved: false,
            startX: 0,
            startY: 0,
        };

        const startDrag = (point, icon) => {
            dragState.active = true;
            dragState.icon = icon;
            dragState.moved = false;
            dragState.startX = point.clientX;
            dragState.startY = point.clientY;
            dragState.offsetX = point.clientX - icon.offsetLeft;
            dragState.offsetY = point.clientY - icon.offsetTop;
        };

        const moveDrag = (point) => {
            if (!dragState.active || !dragState.icon) return;
            const deltaX = Math.abs(point.clientX - dragState.startX);
            const deltaY = Math.abs(point.clientY - dragState.startY);
            const slop = 6;
            if (!dragState.moved && deltaX < slop && deltaY < slop) {
                return;
            }
            dragState.moved = true;
            const maxX = desktop.clientWidth - dragState.icon.offsetWidth;
            const maxY = desktop.clientHeight - dragState.icon.offsetHeight;
            const x = Math.min(Math.max(point.clientX - dragState.offsetX, 0), maxX);
            const y = Math.min(Math.max(point.clientY - dragState.offsetY, 0), maxY);
            dragState.icon.style.left = `${x}px`;
            dragState.icon.style.top = `${y}px`;
        };

        const endDrag = () => {
            dragState.active = false;
            dragState.icon = null;
        };

        icons.forEach((icon) => {
            icon.addEventListener("click", (e) => {
                if (dragState.moved) {
                    dragState.moved = false;
                    return;
                }
                e.preventDefault();
                const target = icon.dataset.open;
                handleOpenTarget(target);
            });

            icon.addEventListener("mousedown", (e) => {
                e.preventDefault();
                startDrag(e, icon);
            });

            icon.addEventListener("touchstart", (e) => {
                const touch = e.touches[0];
                if (!touch) return;
                e.preventDefault();
                startDrag(touch, icon);
            }, { passive: false });

            icon.addEventListener("touchend", (e) => {
                if (e.cancelable) e.preventDefault();
                if (dragState.moved) {
                    dragState.moved = false;
                    return;
                }
                const now = Date.now();
                const lastTap = Number(icon.dataset.lastTap || 0);
                if (now - lastTap < 350) {
                    if (e.cancelable) e.preventDefault();
                    const target = icon.dataset.open;
                    handleOpenTarget(target);
                }
                icon.dataset.lastTap = String(now);
            }, { passive: false });
        });

        document.addEventListener("mousemove", (e) => {
            moveDrag(e);
        });

        document.addEventListener("touchmove", (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            if (!dragState.active) return;
            e.preventDefault();
            moveDrag(touch);
        }, { passive: false });

        document.addEventListener("mouseup", endDrag);
        document.addEventListener("touchend", endDrag);
    }

    function setInitialIconPositions(icons, desktop) {
        if (!icons.length) return;

        const gap = 16;
        const startX = 12;
        const startY = 12;
        let x = startX;
        let y = startY;

        // Use the first icon's rendered size as a baseline
        const sample = icons[0];
        const iconWidth = sample.offsetWidth || 96;
        const iconHeight = sample.offsetHeight || 72;
        const maxY = desktop.clientHeight - iconHeight - gap;

        icons.forEach((icon) => {
            if (icon.dataset.fixed === "true") return;
            icon.style.left = `${x}px`;
            icon.style.top = `${y}px`;

            // Advance down; wrap to next column if we run past the desktop height
            y += iconHeight + gap;
            if (y > maxY) {
                y = startY;
                x += iconWidth + gap;
            }
        });
    }

    function initStartMenu() {
        const startButton = document.getElementById("start-button");
        const startMenu = document.getElementById("start-menu");

        if (!startButton || !startMenu) return;

        startButton.addEventListener("click", (e) => {
            e.stopPropagation();
            startMenu.classList.toggle("hidden");
        });

        // Items inside Start menu
        const items = startMenu.querySelectorAll(".start-menu-item");
        items.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const action = item.dataset.action;
                const target = item.dataset.open;
                if (action) {
                    handleStartAction(action);
                } else {
                    handleOpenTarget(target);
                }
                startMenu.classList.add("hidden");
            });
        });
    }

    function initQuickLaunch() {
        const quickButtons = document.querySelectorAll(".quick-button");
        quickButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                handleQuickAction(action);
            });
        });
    }

    function initGlobalClickHandlers() {
        const startMenu = document.getElementById("start-menu");
        const startButton = document.getElementById("start-button");

        // Click outside Start menu closes it
        document.addEventListener("click", (e) => {
            if (!startMenu || !startButton) return;
            const clickedInsideMenu = startMenu.contains(e.target);
            const clickedStartButton = startButton.contains(e.target);
            if (!clickedInsideMenu && !clickedStartButton) {
                startMenu.classList.add("hidden");
            }
        });
    }

    function handleOpenTarget(target) {
        if (!target) return;

        if (target === "recycle-bin") {
            openRecycleBinWindow();
            return;
        }
        if (target === "tictactoe") {
            openTicTacToeWindow();
            return;
        }
        if (target === "games") {
            openGamesWindow();
            return;
        }
        if (target === "notepad") {
            openNotepadWindow();
            return;
        }
        if (target === "dos") {
            openDosWindow();
            return;
        }

        // Otherwise it's a standalone content window
        openContentWindow(target);
    }

    function handleQuickAction(action) {
        const startMenu = document.getElementById("start-menu");
        if (startMenu) {
            startMenu.classList.add("hidden");
        }

        switch (action) {
            case "minimize-all":
                minimizeAllWindows();
                break;
            case "open-ie":
                openInternetExplorerWindow();
                break;
            case "email":
                openEmailClient();
                break;
            default:
                break;
        }
    }

    function handleStartAction(action) {
        switch (action) {
            case "windows-update":
                // Open external site in a new tab/window
                window.open("https://www.nikitashin.com", "_blank", "noopener");
                break;
            case "shutdown":
                // Attempt to close the tab if permitted; otherwise hide all windows
                shutdownAll();
                break;
            default:
                break;
        }
    }
    /* --------------------------------------------------
     * Content Windows (About / Gallery / Contact)
     * -------------------------------------------------- */

    function openContentWindow(pageKey) {
        const page = PAGES[pageKey];
        if (!page) return;

        const windowId = `window-${pageKey}`;
        let windowEl = document.getElementById(windowId);

        if (!windowEl) {
            windowEl = createContentWindow(windowId, pageKey, page);
            document.body.appendChild(windowEl);
            wireWindowControls(windowEl);
        } else {
            const contentArea = windowEl.querySelector(".window-body");
            if (contentArea) {
                const pageContent = getPageContent(pageKey, page);
                contentArea.innerHTML = `
          <h1>${page.title}</h1>
          ${pageContent}
        `;
            }
        }

        if (pageKey === "gallery") {
            wireProjectFolders(windowEl);
        }
        if (pageKey === "find") {
            wireFindWindow(windowEl);
        }

        showWindow(windowEl);
        centerWindow(windowEl, true);
    }

    function createContentWindow(id, pageKey, page) {
        const icon = PAGE_ICONS[pageKey] || "about-icon.png";
        const pageContent = getPageContent(pageKey, page);
        const section = document.createElement("section");
        section.id = id;
        section.className = "window window--primary hidden";
        section.setAttribute("role", "dialog");
        section.setAttribute("aria-modal", "false");
        section.setAttribute("aria-labelledby", `${id}-title`);

        section.innerHTML = `
      <header class="window-titlebar drag-handle">
        <div class="window-titlebar-left">
          <img src="${icon}" alt="" class="window-title-icon" aria-hidden="true">
          <span id="${id}-title" class="window-title">
            ${page.title}
          </span>
        </div>
        <div class="window-titlebar-controls">
          <button type="button" class="window-control window-control--minimize" data-action="minimize" data-target="${id}" aria-label="Minimize">
            _
          </button>
          <button type="button" class="window-control window-control--maximize" data-action="maximize" data-target="${id}" aria-label="Maximize">
            ${MAXIMIZE_LABEL}
          </button>
          <button type="button" class="window-control window-control--close" data-action="close" data-target="${id}" aria-label="Close">
            X
          </button>
        </div>
      </header>
      <div class="window-body">
        <h1>${page.title}</h1>
        ${pageContent}
      </div>
    `;

        return section;
    }

    function getPageContent(pageKey, page) {
        if (pageKey === "gallery") {
            return renderGalleryHTML();
        }
        if (pageKey === "find") {
            return renderFindHTML();
        }
        if (pageKey === "help") {
            return renderHelpHTML();
        }
        return page.html;
    }

    function renderGalleryHTML() {
        const folders = PROJECT_FOLDERS.map(
            (folder) => `
          <button type="button" class="project-folder" data-folder="${folder.id}" aria-label="${folder.title}">
            <span class="project-folder-icon">
              <img src="${folder.icon}" alt="${folder.title}">
            </span>
            <span class="desktop-icon-label">${folder.title}</span>
          </button>
        `
        ).join("");

        return `
        <div class="project-folders project-folders--grid" aria-label="Project folders">
          ${folders}
        </div>
      `;
    }

    function renderFindHTML() {
        return `
        <div class="find-window">
          <label class="find-label" for="find-input">Search</label>
          <div class="find-input-row">
            <input id="find-input" class="find-input" type="search" placeholder="Search projects, pages, tools">
            <button type="button" class="find-clear" data-action="clear-find">Clear</button>
          </div>
          <div class="find-results" role="listbox">
            ${renderFindResultsHTML("")}
          </div>
        </div>
      `;
    }

    function renderHelpHTML() {
        return `
        <div class="help-window">
          <p>Welcome! This portfolio works like a Windows 98 desktop. Use the tips below to explore everything.</p>
          <div class="project-section-grid">
            <section class="project-section">
              <h3>Navigation</h3>
              <ul class="project-bullets">
                <li>Double-click desktop icons to open windows.</li>
                <li>Use Start to open Find, Help, or system tools.</li>
                <li>Taskbar shows open windows; click to restore/minimize.</li>
              </ul>
            </section>
            <section class="project-section">
              <h3>Project Gallery</h3>
              <ul class="project-bullets">
                <li>Open Project Gallery to see all folders.</li>
                <li>Double-click a folder to open the full project view.</li>
                <li>Each folder has images, summaries, and results.</li>
              </ul>
            </section>
            <section class="project-section">
              <h3>Windows Controls</h3>
              <ul class="project-bullets">
                <li>Use minimize and maximize buttons like classic Win98.</li>
                <li>Drag title bars to move windows around.</li>
                <li>Use the Quick Launch icons for shortcuts.</li>
              </ul>
            </section>
            <section class="project-section">
              <h3>Extras</h3>
              <ul class="project-bullets">
                <li>Play classic games in the Games window.</li>
                <li>Open Notepad for quick notes.</li>
                <li>Try MS-DOS commands like DIR and CD.</li>
              </ul>
            </section>
          </div>
        </div>
      `;
    }

    function renderFindResultsHTML(query) {
        const term = query.trim().toLowerCase();
        const results = SEARCH_ENTRIES.filter((entry) => {
            if (!term) return true;
            const haystack = `${entry.label} ${entry.meta || ""}`.toLowerCase();
            return haystack.includes(term);
        });

        if (!results.length) {
            return `<div class="find-empty">No matches found.</div>`;
        }

        return results
            .map((entry) => {
                const meta = entry.meta ? `<span class="find-meta">${entry.meta}</span>` : "";
                return `
          <button type="button" class="find-result" data-find="item" data-type="${entry.type}" data-key="${entry.key}">
            <span class="find-title">${entry.label}</span>
            ${meta}
          </button>
        `;
            })
            .join("");
    }

    function wireFindWindow(windowEl) {
        const findWindow = windowEl.querySelector(".find-window");
        if (!findWindow || findWindow.dataset.bound === "true") return;
        findWindow.dataset.bound = "true";

        const input = findWindow.querySelector("#find-input");
        const results = findWindow.querySelector(".find-results");
        const clearBtn = findWindow.querySelector("[data-action='clear-find']");

        const updateResults = () => {
            if (!results) return;
            const value = input ? input.value : "";
            results.innerHTML = renderFindResultsHTML(value || "");
        };

        if (input) {
            input.addEventListener("input", updateResults);
        }

        if (clearBtn && input) {
            clearBtn.addEventListener("click", () => {
                input.value = "";
                updateResults();
                input.focus();
            });
        }

        if (results) {
            results.addEventListener("click", (e) => {
                const target = e.target.closest("[data-find='item']");
                if (!target) return;
                const type = target.dataset.type;
                const key = target.dataset.key;
                if (type === "project") {
                    openProjectFolder(key);
                    return;
                }
                handleOpenTarget(key);
            });
        }
    }

    function wireProjectFolders(windowEl) {
        const folderArea = windowEl.querySelector(".project-folders");
        if (!folderArea || folderArea.dataset.bound === "true") return;
        folderArea.dataset.bound = "true";

        const activateFolder = (target) => {
            if (!target) return;
            const folderId = target.dataset.folder;
            if (!folderId) return;
            openProjectFolder(folderId);
        };

        folderArea.addEventListener("dblclick", (e) => {
            const target = e.target.closest("[data-folder]");
            activateFolder(target);
        });

        folderArea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                const target = e.target.closest("[data-folder]");
                activateFolder(target);
            }
        });
    }

    function openProjectFolder(folderId) {
        const folder = PROJECT_FOLDERS.find((f) => f.id === folderId);
        if (!folder) return;

        const windowId = `project-${folder.id}`;
        let windowEl = document.getElementById(windowId);

        if (!windowEl) {
            windowEl = document.createElement("section");
            windowEl.id = windowId;
            windowEl.className = "window window--folder hidden";
            windowEl.setAttribute("role", "dialog");
            windowEl.setAttribute("aria-modal", "false");
            windowEl.setAttribute("aria-labelledby", `${windowId}-title`);
            windowEl.innerHTML = buildFolderWindow(folder, windowId);
            document.body.appendChild(windowEl);
            wireWindowControls(windowEl);
        } else {
            const body = windowEl.querySelector(".window-body");
            if (body) {
                body.innerHTML = renderProjectFolderBody(folder);
            }
        }

        showWindow(windowEl);
        centerWindow(windowEl, false);
    }

    function buildFolderWindow(folder, windowId) {
        return `
      <header class="window-titlebar drag-handle">
        <div class="window-titlebar-left">
          <img src="${folder.icon}" alt="" class="window-title-icon" aria-hidden="true">
          <span id="${windowId}-title" class="window-title">${folder.title}</span>
        </div>
        <div class="window-titlebar-controls">
          <button type="button" class="window-control window-control--minimize" data-action="minimize" data-target="${windowId}" aria-label="Minimize">
            _
          </button>
          <button type="button" class="window-control window-control--maximize" data-action="maximize" data-target="${windowId}" aria-label="Maximize">
            ${MAXIMIZE_LABEL}
          </button>
          <button type="button" class="window-control window-control--close" data-action="close" data-target="${windowId}" aria-label="Close">
            X
          </button>
        </div>
      </header>
      <div class="window-body">
        ${renderProjectFolderBody(folder)}
      </div>
    `;
    }

    function renderProjectFolderBody(folder) {
        if (folder.id === "engr230") {
            return renderEngr230Project();
        }
        if (folder.id === "engr210") {
            return renderEngr210Project();
        }
        if (folder.id === "racing") {
            return renderRacingProject();
        }
        const fileList = folder.contents.map((item) => `<li>${item}</li>`).join("");
        return `
      <div class="folder-body">
        <div class="folder-body-header">
          <div class="folder-body-path">C:\\Projects\\${folder.title}</div>
          <div class="folder-body-meta">Under construction</div>
        </div>
        <p class="folder-body-text">
          More photos, notes, and downloads live here. This folder view keeps the Win98
          vibe until the full uploads ship.
        </p>
        <div class="folder-body-pane">
          <div class="folder-body-icon">
            <img src="${folder.icon}" alt="${folder.title}">
            <span class="desktop-icon-label">${folder.title}</span>
          </div>
          <div class="folder-body-list">
            <p>Incoming files:</p>
            <ul>
              ${fileList}
            </ul>
          </div>
        </div>
      </div>
    `;
    }

    function renderEngr210Project() {
        return `
      <div class="folder-body folder-body--project">
        <div class="folder-body-header">
          <div class="folder-body-path">C:\\Projects\\Engr210\\MousetrapCar</div>
          <div class="folder-body-meta">Distance-first build | Rapid CAD + prototyping</div>
        </div>

        <div class="project-hero">
          <div>
            <h2 class="project-title">Mousetrap Car — ENGR 210</h2>
            <p class="project-subtitle">Lightweight, high-efficiency mousetrap-powered racer</p>
          </div>
          <div class="stat-cards">
            <div class="stat-card">
              <span class="stat-label">Best Run</span>
              <span class="stat-value">New college record 100+ yards</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Team</span>
              <span class="stat-value">3 students</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Tooling</span>
              <span class="stat-value">Fusion 360, Bambu X1C, 70W Lasercut</span>
            </div>
          </div>
          <div class="project-media">
            <img src="assets/projects/engr210/mouse-trap-car0.gif" alt="Mousetrap car test animation">
            <p class="project-media-caption">Main build GIF — launch and rollout</p>
          </div>
        </div>

        <div class="project-section-grid">
          <section class="project-section">
            <h3>Project Description</h3>
            <p>Hands-on CAD-to-track project to maximize travel distance with a mousetrap-powered car. We iterated fast in Fusion 360 and built prototypes to validate friction, alignment, and energy transfer.</p>
            <ul class="project-bullets">
              <li>Applied modeling + simulation to refine geometry before cutting parts.</li>
              <li>Optimized lever arm and wheel sizing for smooth unwinding and low drag.</li>
              <li>Focused on high strength-to-mass and repeatable launches.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>Planning & Roles</h3>
            <p>As a three-person team, I organized brainstorming in Miro and split work by specialty.</p>
            <ul class="project-bullets">
              <li>Oleg: requirements, CAD, simulation, test plans.</li>
              <li>Teammates: fabrication, alignment checks, and track testing.</li>
              <li>Weekly milestones with measurable distance targets.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>CAD & Simulation</h3>
            <ul class="project-bullets">
              <li>Fusion 360 models for chassis, axle seats, and lever arm geometry.</li>
              <li>Checked wheel runout and axle straightness to reduce scrub losses.</li>
              <li>Balanced mass distribution to keep the front end planted during launch.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>Build, Test, Improve</h3>
            <p>First prototype beat last year’s CSM distance record; we kept iterating against a written plan.</p>
            <ul class="project-bullets">
              <li>Fine-tuned axle friction with bushings and low-drag wheel surfaces.</li>
              <li>Adjusted string routing and lever length for smoother torque delivery.</li>
              <li>Documented every run with distance and observations to drive changes.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>Gallery</h3>
            <div class="project-media-collection">
              <div class="project-media">
                <img src="assets/projects/engr210/mouse-trap-car1.png" alt="Mousetrap car chassis closeup">
                <p class="project-media-caption">Chassis and axle routing</p>
              </div>
              <div class="project-media">
                <img src="assets/projects/engr210/mouse-trap-car2.png" alt="Mousetrap car lever arm setup">
                <p class="project-media-caption">Lever arm and string routing</p>
              </div>
              <div class="project-media">
                <img src="assets/projects/engr210/mouse-trap-car3.gif" alt="Mousetrap car wheels and bearings">
                <p class="project-media-caption">Wheel alignment and bushings</p>
              </div>
              <div class="project-media">
                <img src="assets/projects/engr210/mouse-trap-car4.jpg" alt="Mousetrap car testing on track">
                <p class="project-media-caption">Test run setup</p>
              </div>
              <div class="project-media">
                <img src="assets/projects/engr210/mouse-trap-car5.jpg" alt="Mousetrap car team review">
                <p class="project-media-caption">Team review and tweaks</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
    }

    function renderRacingProject() {
        const galleryImages = [
            { src: "assets/projects/racing/racing0.5.jpg", caption: "3s-gte preseason rebuild" },
            { src: "assets/projects/racing/racing1.jpg", caption: "First podium" },
            { src: "assets/projects/racing/racing2.jpg", caption: "Setup tweaks on winter openpit practice" },
            { src: "assets/projects/racing/racing3.jpg", caption: "First winter win in RWD" },
            //{ src: "assets/projects/racing/racing4.jpg", caption: "Launch off the line" },
            { src: "assets/projects/racing/racing5.jpg", caption: "Mid-corner load" },
            { src: "assets/projects/racing/racing6.jpg", caption: "Happy Camper" },
            { src: "assets/projects/racing/racing7.jpg", caption: "LADA Time Attack NRing Curcuit" },
            { src: "assets/projects/racing/racing8.jpg", caption: "Second Place" },
            { src: "assets/projects/racing/racing9.jpg", caption: "Podium finish" },
            { src: "assets/projects/racing/racing10.jpg", caption: "Fans" },
            { src: "assets/projects/racing/racing11.jpg", caption: "Look at the hood.." },
            { src: "assets/projects/racing/racing12.jpg", caption: "Again Second Place" },
            { src: "assets/projects/racing/racing13.jpg", caption: "Winter Open Rally Cup" },
            { src: "assets/projects/racing/racing14.jpg", caption: "Team RS" },
            { src: "assets/projects/racing/racing15.jpg", caption: "ADM Curcuit, winter practice" },
            { src: "assets/projects/racing/racing16.jpg", caption: "LTAC podium" },
            { src: "assets/projects/racing/racing17.jpg", caption: "Fixing stuff in a field" },
            { src: "assets/projects/racing/racing18.jpg", caption: "Fresh Paint" },
            { src: "assets/projects/racing/racing19.jpg", caption: "After race" },
            { src: "assets/projects/racing/racing20.jpg", caption: "After race 2" },
            { src: "assets/projects/racing/racing21.jpg", caption: "Toyota Celica Gt-Four" },
            { src: "assets/projects/racing/racing22.jpg", caption: "Karting Championship" },
            { src: "assets/projects/racing/racing23.jpg", caption: "Team RS on ADM" },
            { src: "assets/projects/racing/racing24.jpg", caption: "First podium in Time Attack on RWD car" },
        ];

        const galleryHtml = galleryImages
            .map(
                (img) => `
              <div class="project-media">
                <img src="${img.src}" alt="${img.caption}">
                <p class="project-media-caption">${img.caption}</p>
              </div>
            `
            )
            .join("");

        return `
      <div class="folder-body folder-body--project">
        <div class="folder-body-header">
          <div class="folder-body-path">C:\\Projects\\Racing</div>
          <div class="folder-body-meta">Time attack | Rally | Endurance karting</div>
        </div>

        <div class="project-hero">
          <div>
            <h2 class="project-title">Racing Portfolio</h2>
            <p class="project-subtitle">National Lada Time Attack Cup (RWD) — Champion 2019, Vice-Champion 2020</p>
          </div>
          <div class="stat-cards">
            <div class="stat-card">
              <span class="stat-label">Titles</span>
              <span class="stat-value">40+ podiums</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Disciplines</span>
              <span class="stat-value">Time attack, rally, sprint and endurance karting</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Engineering</span>
              <span class="stat-value">Toyota and Fiat chassis mech + electrical upgrades</span>
            </div>
          </div>
          <div class="project-media">
            <img src="assets/projects/racing/racing0.jpg" alt="Lada time attack car on track">
            <p class="project-media-caption">Winter Open Rally Cup — AWD platform</p>
          </div>
        </div>

        <div class="project-section-grid">
          <section class="project-section">
            <h3>Project Overview</h3>
            <p>Competitive driving and engineering program across time attack, rally, and endurance karting. Two-time winner of the National Lada Time Attack Cup (RWD): 2019 champion, 2020 vice champion.</p>
            <ul class="project-bullets">
              <li>Multiple podiums in endurance karting, rally, and time attack events.</li>
              <li>Driver, data analyst, and builder for RWD platforms.</li>
              <li>Continuous iteration on setup, reliability, and drivability.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>Engineering Focus</h3>
            <ul class="project-bullets">
              <li>Mechanical: suspension geometry tweaks, brake cooling, aero trim, weight reduction.</li>
              <li>Electrical: harness refresh, sensor integration, data logging for lap analysis.</li>
              <li>Legacy platform work: modernizing an old Fiat chassis with custom wiring and hardware.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>Development & Ops</h3>
            <ul class="project-bullets">
              <li>Track walks, tire/pressure baselines, and alignment changes between sessions.</li>
              <li>Data-driven adjustments using onboard logging to refine braking points and throttle maps.</li>
              <li>Quick-turn fixes during events to keep cars reliable across stints.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>Gallery</h3>
            <div class="project-media-collection">
              ${galleryHtml}
            </div>
          </section>
        </div>
      </div>
    `;
    }

    function renderEngr230Project() {
        return `
      <div class="folder-body folder-body--project">
        <div class="folder-body-header">
          <div class="folder-body-path">C:\\Projects\\Engr230\\TrussBridge</div>
          <div class="folder-body-meta">Lightweight bridge | Tested FoS 2.18</div>
        </div>

        <div class="project-hero">
          <div>
            <h2 class="project-title">Truss Bridge — Engr 230 Statics</h2>
            <p class="project-subtitle">24 cm span | Mass &lt; 10 g | Mid-span load 66 N (req.)</p>
          </div>
          <div class="stat-cards">
            <div class="stat-card">
              <span class="stat-label">Max Load</span>
              <span class="stat-value">144 N</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">FoS (test)</span>
              <span class="stat-value">2.18x</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Mass</span>
              <span class="stat-value">&lt; 10 g</span>
            </div>
          </div>
          <div class="project-media">
            <img src="assets/projects/engr230/PrattDesign1.jpg" alt="Pratt/Warren hybrid layout overview">
            <p class="project-media-caption">Pratt/Warren hybrid layout overview</p>
          </div>
        </div>

        <div class="project-section-grid">
          <section class="project-section">
            <h3>Project Description</h3>
            <p>Two-person build of a balsa truss that exceeds a 1.5 safety factor while staying under 10 g. Full cycle: sketch → simulate → build → test to failure.</p>
            <div class="project-media">
              <img src="assets/projects/engr230/JHUtrussbridge.jpg" alt="JHU truss bridge build">
              <p class="project-media-caption">JHU Truss Bridge — build setup before testing</p>
            </div>
            <ul class="project-bullets">
              <li>Design for high strength-to-weight, bonus for non-standard geometry.</li>
              <li>Capture load, deflection, and failure mode during testing.</li>
              <li>Apply tension/compression design rules for slender members.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>Design Specs</h3>
            <div class="spec-table" role="table">
              <div class="spec-row"><span>Structure</span><span>Dual planar trusses + cross bracing</span></div>
              <div class="spec-row"><span>Span</span><span>24 cm</span></div>
              <div class="spec-row"><span>Height</span><span>10 cm max</span></div>
              <div class="spec-row"><span>Clear width / height</span><span>3.5 cm / 3.5 cm</span></div>
              <div class="spec-row"><span>Load case</span><span>66 N at mid-span (down)</span></div>
              <div class="spec-row"><span>FoS target</span><span>&ge; 1.5</span></div>
              <div class="spec-row"><span>Material</span><span>3.175 mm balsa, E = 2.55 GPa</span></div>
              <div class="spec-row"><span>Strength</span><span>73 MPa tension / 6.9 MPa compression</span></div>
              <div class="spec-row"><span>Design style</span><span>Pratt/Warren hybrid (non-standard)</span></div>
            </div>
            <div class="project-media">
              <img src="assets/projects/engr230/BridgeConstructionMovie.gif" alt="Bridge construction timelapse for Engr 230 truss project">
              <p class="project-media-caption">Build sequence timelapse — gluing, bracing, and deck assembly</p>
            </div>
          </section>

          <section class="project-section">
            <h3>Design Approach</h3>
            <p>Compared Warren, Camelback, and Pratt, then chose a Pratt-inspired layout with Warren diagonals to shorten compression members and cut weight.</p>
            <div class="project-media">
              <img src="assets/projects/engr230/Brainstorm.jpg" alt="Brainstorm sketches for truss concepts">
              <p class="project-media-caption">Early brainstorming sketches comparing truss geometries</p>
            </div>
            <ul class="project-bullets">
              <li>Few, short compression members to reduce buckling risk.</li>
              <li>Straight load paths for predictable tension in the bottom chord.</li>
              <li>Simple joints to minimize glue mass.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>Analysis & Simulation</h3>
            <ul class="project-bullets">
              <li>Modeled in JHU Truss Simulator; Method of Joints for all nodes.</li>
              <li>Critical compression: top chords ~43 N; expected first buckle at mid-span.</li>
              <li>Tension: bottom chord segments ~28 N; support verticals ~33 N.</li>
              <li>Uniform member section (3.175 mm square) used for stress + FoS checks.</li>
            </ul>
          </section>

          <section class="project-section">
            <h3>Testing & Failure</h3>
            <p>Instron 3369, 5 mm/min, mid-span loading. Max load 144 N → FoS 2.18. Failure was a top-chord compression buckle near mid-span, matching simulation.</p>
            <ul class="project-bullets">
              <li>Failure driver: slenderness + slight joint misalignment reducing buckling capacity.</li>
              <li>Tension members remained intact; glue weight kept under spec.</li>
            </ul>
            <div class="project-media">
              <img src="assets/projects/engr230/Pratt_test1.jpg" alt="Pratt truss test mid-load">
              <p class="project-media-caption">Pratt hybrid under load during Instron test</p>
            </div>
            <div class="project-media">
              <img src="assets/projects/engr230/Pratt_test2.jpg" alt="Pratt truss failure moment">
              <p class="project-media-caption">Final buckling failure at top chord near mid-span</p>
            </div>
            <div class="project-media">
              <img src="assets/projects/engr230/PrattDesign0.jpg" alt="Pratt design sketch iteration 0">
              <p class="project-media-caption">Pratt/Warren hybrid layout iteration 0</p>
            </div>
            <div class="project-media">
              <img src="assets/projects/engr230/PrattDesign1.jpg" alt="Pratt design sketch iteration 1">
              <p class="project-media-caption">Pratt/Warren hybrid layout iteration 1</p>
            </div>
          </section>

          <section class="project-section">
            <h3>Appendix (calc highlights)</h3>
            <ul class="project-bullets">
              <li>FBD + joint-by-joint solutions; method of sections check at mid-panel.</li>
              <li>Buckling calc on top chord using compressive strength 6.9 MPa.</li>
              <li>Stress = F / A with A = 1.008e-5 m²; FoS = allowable / |stress|.</li>
            </ul>
          </section>
        </div>
      </div>
    `;
    }

    /* --------------------------------------------------
     * Games Window + BSOD
     * -------------------------------------------------- */

    function wireGameIcons(container) {
        if (!container || container.dataset.gamesBound === "true") return;
        container.dataset.gamesBound = "true";
        const gameButtons = container.querySelectorAll("[data-open-game]");
        gameButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const game = btn.dataset.openGame;
                if (game === "tictactoe") {
                    openTicTacToeWindow();
                }
            });
        });
    }

    function openGamesWindow() {
        const gamesWindow = document.getElementById("popup-games");
        const bsodScreen = document.getElementById("bsod-screen");
        if (!gamesWindow || !bsodScreen) return;

        if (!bsodShown) {
            // First time: show BSOD, then open window
            bsodShown = true;
            bsodScreen.classList.remove("hidden");
            bsodScreen.classList.add("shown");

            setTimeout(() => {
                bsodScreen.classList.add("hidden");
                showWindow(gamesWindow);
                centerWindow(gamesWindow, false);
                wireGameIcons(gamesWindow);
            }, 1800);
        } else {
            // Next times: just toggle window
            const isHidden = gamesWindow.classList.contains("hidden") || gamesWindow.style.display === "none";
            if (isHidden) {
                showWindow(gamesWindow);
                centerWindow(gamesWindow, false);
                wireGameIcons(gamesWindow);
            } else {
                hideWindow(gamesWindow);
            }
        }
    }

    /* --------------------------------------------------
     * Window Controls (minimize / maximize / close)
     * -------------------------------------------------- */

    function initWindowControls() {
        wireWindowControls(document);
    }

    function wireWindowControls(container) {
        const controls = container.querySelectorAll(".window-control");
        controls.forEach((control) => {
            control.addEventListener("click", (e) => {
                e.stopPropagation();
                const action = control.dataset.action;
                const targetId = control.dataset.target;

                if (!action || !targetId) return;

                switch (action) {
                    case "minimize":
                        minimizeWindow(targetId);
                        break;
                    case "maximize":
                        toggleMaximize(targetId);
                        break;
                    case "close":
                        closeWindow(targetId);
                        break;
                }
            });
        });
    }

    function minimizeWindow(targetId) {
        const windowEl = document.getElementById(targetId);
        if (!windowEl) return;

        hideWindow(windowEl);
        renderTaskbarButtons();
    }

    function minimizeAllWindows() {
        const windows = document.querySelectorAll(".window:not(.hidden)");
        windows.forEach((win) => {
            if (win.id) {
                minimizeWindow(win.id);
            }
        });
    }

    function toggleMaximize(targetId) {
        const windowEl = document.getElementById(targetId);
        if (!windowEl) return;

        if (maximizedWindows.has(targetId)) {
            maximizedWindows.delete(targetId);
            const prev = windowRestoreState.get(targetId) || {};
            windowEl.style.top = prev.top || "";
            windowEl.style.left = prev.left || "";
            windowEl.style.width = prev.width || "";
            windowEl.style.height = prev.height || "";
            windowEl.style.transform = prev.transform || "";
            windowRestoreState.delete(targetId);
        } else {
            windowRestoreState.set(targetId, {
                top: windowEl.style.top,
                left: windowEl.style.left,
                width: windowEl.style.width,
                height: windowEl.style.height,
                transform: windowEl.style.transform,
            });
            maximizedWindows.add(targetId);
            windowEl.style.top = "0";
            windowEl.style.left = "0";
            windowEl.style.width = "100%";
            windowEl.style.height = "100%";
            windowEl.style.transform = "none";
        }

        bringToFront(windowEl);
    }

    function closeWindow(targetId) {
        const windowEl = document.getElementById(targetId);
        if (!windowEl) return;
        hideWindow(windowEl);
        openWindows.delete(targetId);
        renderTaskbarButtons();

        // Reset position so next open recenters
        windowEl.style.top = "50%";
        windowEl.style.left = "50%";
        windowEl.style.width = "";
        windowEl.style.height = "";
        windowEl.style.transform = "translate(-50%, -50%)";
    }

    /* --------------------------------------------------
     * Z-index / Position / Dragging
     * -------------------------------------------------- */

    function bringToFront(element) {
        highestZIndex += 1;
        element.style.zIndex = String(highestZIndex);
    }

    function showWindow(windowEl) {
        windowEl.classList.remove("hidden");
        windowEl.style.display = "";
        bringToFront(windowEl);
        if (windowEl.id) {
            openWindows.add(windowEl.id);
            renderTaskbarButtons();
        }
    }

    function hideWindow(windowEl) {
        windowEl.classList.add("hidden");
        windowEl.style.display = "none";
    }

    function renderTaskbarButtons() {
        const minimizedArea = document.getElementById("minimized-windows");
        if (!minimizedArea) return;
        minimizedArea.innerHTML = "";

        const entries = [];
        openWindows.forEach((id) => {
            const windowEl = document.getElementById(id);
            if (windowEl) {
                const titleEl = windowEl.querySelector(".window-title");
                const title = titleEl ? titleEl.textContent.trim() : "Window";
                const hidden =
                    windowEl.classList.contains("hidden") ||
                    windowEl.style.display === "none";
                entries.push({ id, title, hidden });
            }
        });

        const counts = entries.reduce((acc, { title }) => {
            acc[title] = (acc[title] || 0) + 1;
            return acc;
        }, {});

        entries.forEach(({ id, title, hidden }) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "taskbar-item";
            btn.dataset.restore = id;
            const suffix = counts[title] > 1 ? ` (${counts[title]})` : "";
            btn.textContent = `${title}${suffix}`;

            btn.addEventListener("click", () => {
                const targetWindow = document.getElementById(id);
                if (!targetWindow) return;
                const isHidden =
                    targetWindow.classList.contains("hidden") ||
                    targetWindow.style.display === "none";
                if (isHidden) {
                    showWindow(targetWindow);
                    centerWindow(
                        targetWindow,
                        targetWindow.classList.contains("window--primary")
                    );
                } else {
                    minimizeWindow(id);
                }
                renderTaskbarButtons();
            });

            minimizedArea.appendChild(btn);
        });
    }

    function centerWindow(windowEl, isPrimary) {
        // Basic defaults – can be adjusted in CSS as well
        if (isPrimary) {
            windowEl.style.width = "70%";
            windowEl.style.height = "60%";
        }
        windowEl.style.top = "50%";
        windowEl.style.left = "50%";
        windowEl.style.transform = "translate(-50%, -50%)";
    }

    function initDragging() {
        const dragState = {
            active: false,
            windowEl: null,
            offsetX: 0,
            offsetY: 0,
        };

        const startDrag = (point, target) => {
            // Ignore clicks on window control buttons so they don't initiate drag
            if (target.closest(".window-control")) return;

            const handle = target.closest(".drag-handle");
            if (!handle) return;

            const windowEl = handle.closest(".window");
            if (!windowEl) return;

            const rect = windowEl.getBoundingClientRect();
            const absLeft = rect.left + window.scrollX;
            const absTop = rect.top + window.scrollY;
            windowEl.style.left = `${absLeft}px`;
            windowEl.style.top = `${absTop}px`;
            windowEl.style.transform = "none";

            dragState.active = true;
            dragState.windowEl = windowEl;
            dragState.offsetX = point.clientX - absLeft;
            dragState.offsetY = point.clientY - absTop;
            bringToFront(windowEl);
        };

        const moveDrag = (point) => {
            if (!dragState.active || !dragState.windowEl) return;

            const x = point.clientX - dragState.offsetX;
            const y = point.clientY - dragState.offsetY;

            dragState.windowEl.style.left = `${x}px`;
            dragState.windowEl.style.top = `${y}px`;
        };

        const endDrag = () => {
            dragState.active = false;
            dragState.windowEl = null;
        };

        document.addEventListener("mousedown", (e) => {
            startDrag(e, e.target);
        });

        document.addEventListener("mousemove", (e) => {
            moveDrag(e);
        });

        document.addEventListener("mouseup", endDrag);

        document.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            startDrag(touch, e.target);
        }, { passive: true });

        document.addEventListener("touchmove", (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            if (!dragState.active) return;
            e.preventDefault();
            moveDrag(touch);
        }, { passive: false });

        document.addEventListener("touchend", endDrag);
    }

    function openInternetExplorerWindow() {
        const ieWindow = document.getElementById("popup-ie");
        if (!ieWindow) return;
        showWindow(ieWindow);
        bringToFront(ieWindow);
        centerWindow(ieWindow, false);
    }

    function openNotepadWindow() {
        const noteWindow = document.getElementById("popup-notepad");
        if (!noteWindow) return;
        showWindow(noteWindow);
        centerWindow(noteWindow, false);
    }

    function openDosWindow() {
        const dosWindow = document.getElementById("popup-dos");
        if (!dosWindow) return;
        showWindow(dosWindow);
        centerWindow(dosWindow, false);
        initDos();
        const input = document.getElementById("dos-input");
        if (input) input.focus();
    }

    function openEmailClient() {
        window.location.href = "mailto:nikitashin.ov@gmail.com";
    }

    function shutdownAll() {
        const windows = document.querySelectorAll(".window");
        windows.forEach((win) => hideWindow(win));
        openWindows.clear();
        renderTaskbarButtons();
    }

    function showFirstLoadScreen() {
        const loading = document.getElementById("loading-screen");
        if (!loading) return;
        const key = "win98-loading-shown";
        const already = sessionStorage.getItem(key);
        if (already) {
            loading.remove();
            return;
        }
        loading.classList.remove("hidden");
        setTimeout(() => {
            loading.classList.add("hidden");
            sessionStorage.setItem(key, "true");
        }, 1200);
    }

    /* --------------------------------------------------
     * Sound Control
     * -------------------------------------------------- */

    function initSoundControl() {
        const soundBtn = document.getElementById("sound-button");
        const soundIcon = document.getElementById("sound-icon");
        const menu = document.getElementById("sound-menu");
        const volumePanel = document.getElementById("volume-panel");
        const volumeSlider = document.getElementById("volume-slider");
        const volumeValue = document.getElementById("volume-value");
        if (!soundBtn || !soundIcon || !menu || !volumePanel || !volumeSlider || !volumeValue) return;

        let soundEnabled = getSoundPreference();
        let volumeLevel = getVolumePreference();
        updateSoundIcon(soundEnabled, soundIcon);
        setSoundState(soundEnabled);
        setVolumeState(volumeLevel, volumeValue);

        const hideMenu = () => {
            menu.classList.add("hidden");
        };

        const openMenuAt = (x, y) => {
            menu.classList.remove("hidden");
            const mh = menu.offsetHeight || 0;
            const mw = menu.offsetWidth || 0;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const left = Math.min(Math.max(x, 4), vw - mw - 4);
            const top = Math.max(4, Math.min(y - mh, vh - mh - 4));
            menu.style.left = `${left}px`;
            menu.style.top = `${top}px`;
        };

        soundBtn.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            openMenuAt(e.clientX, e.clientY);
        });

        // Long press on touch to open
        let touchTimer = null;
        soundBtn.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            touchTimer = setTimeout(() => {
                openMenuAt(touch.clientX, touch.clientY);
            }, 500);
        }, { passive: true });

        soundBtn.addEventListener("touchend", () => {
            if (touchTimer) clearTimeout(touchTimer);
        });

        soundBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            setSoundPreference(soundEnabled);
            setSoundState(soundEnabled);
            updateSoundIcon(soundEnabled, soundIcon);
            hideMenu();
            hideVolumePanel();
        });

        menu.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-sound]");
            if (!btn) return;
            const action = btn.dataset.sound;
            if (action === "volume") {
                const rect = soundBtn.getBoundingClientRect();
                openVolumePanel(rect.left, rect.top - 4);
                hideMenu();
                return;
            }
            soundEnabled = action === "on";
            setSoundPreference(soundEnabled);
            setSoundState(soundEnabled);
            updateSoundIcon(soundEnabled, soundIcon);
            hideMenu();
            hideVolumePanel();
        });

        document.addEventListener("click", (e) => {
            if (menu.contains(e.target) || soundBtn.contains(e.target)) return;
            hideMenu();
            if (!volumePanel.contains(e.target)) {
                hideVolumePanel();
            }
        });

        volumeSlider.addEventListener("input", () => {
            volumeLevel = Number(volumeSlider.value) / 100;
            setVolumePreference(volumeLevel);
            setVolumeState(volumeLevel, volumeValue);
        });

        function openVolumePanel(x, y) {
            volumeSlider.value = String(Math.round(volumeLevel * 100));
            setVolumeState(volumeLevel, volumeValue);
            volumePanel.classList.remove("hidden");
            const panelWidth = volumePanel.offsetWidth || 0;
            const panelHeight = volumePanel.offsetHeight || 0;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const left = Math.min(Math.max(x, 4), vw - panelWidth - 4);
            const top = Math.max(4, Math.min(y - panelHeight, vh - panelHeight - 4));
            volumePanel.style.left = `${left}px`;
            volumePanel.style.top = `${top}px`;
        }

        function hideVolumePanel() {
            volumePanel.classList.add("hidden");
        }
    }

    /* --------------------------------------------------
     * Time / Calendar Control
     * -------------------------------------------------- */

    function initTimeControl() {
        const timeBtn = document.getElementById("time-button");
        const menu = document.getElementById("calendar-menu");
        if (!timeBtn || !menu) return;

        const hideMenu = () => menu.classList.add("hidden");

        const openMenuAt = (x, y) => {
            menu.classList.remove("hidden");
            const mh = menu.offsetHeight || 0;
            const mw = menu.offsetWidth || 0;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const left = Math.min(Math.max(x, 4), vw - mw - 4);
            const top = Math.max(4, Math.min(y - mh, vh - mh - 4));
            menu.style.left = `${left}px`;
            menu.style.top = `${top}px`;
        };

        timeBtn.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            openMenuAt(e.clientX, e.clientY);
        });

        let touchTimer = null;
        timeBtn.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            touchTimer = setTimeout(() => openMenuAt(touch.clientX, touch.clientY), 500);
        }, { passive: true });

        timeBtn.addEventListener("touchend", () => {
            if (touchTimer) clearTimeout(touchTimer);
        });

        timeBtn.addEventListener("click", () => {
            openCalendarWindow();
            hideMenu();
        });

        menu.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-calendar='open']");
            if (!btn) return;
            openCalendarWindow();
            hideMenu();
        });

        document.addEventListener("click", (e) => {
            if (menu.contains(e.target) || timeBtn.contains(e.target)) return;
            hideMenu();
        });
    }

    function getSoundPreference() {
        const stored = localStorage.getItem(SOUND_KEY);
        if (stored === "false") return false;
        return true;
    }

    function setSoundPreference(enabled) {
        localStorage.setItem(SOUND_KEY, enabled ? "true" : "false");
    }

    function updateSoundIcon(enabled, iconEl) {
        iconEl.src = enabled ? "sound_on-icon.png" : "sound_off-icon.png";
        iconEl.alt = enabled ? "Sound on" : "Sound off";
    }

    function setSoundState(enabled) {
        document.documentElement.dataset.sound = enabled ? "on" : "off";
        window.__win98SoundEnabled = enabled;
    }

    function getVolumePreference() {
        const stored = localStorage.getItem(SOUND_VOLUME_KEY);
        if (stored === null || stored === undefined || stored === "") return 1;
        const num = Number(stored);
        if (Number.isNaN(num)) return 1;
        return Math.min(Math.max(num, 0), 1);
    }

    function setVolumePreference(level) {
        localStorage.setItem(SOUND_VOLUME_KEY, String(level));
    }

    function setVolumeState(level, valueEl) {
        const pct = Math.round(level * 100);
        if (valueEl) valueEl.textContent = `${pct}%`;
        document.documentElement.dataset.volume = String(pct);
        window.__win98Volume = level;
    }

    /* --------------------------------------------------
     * Tic Tac Toe
     * -------------------------------------------------- */

    function openTicTacToeWindow() {
        const windowId = "window-tictactoe";
        let windowEl = document.getElementById(windowId);

        if (!windowEl) {
            windowEl = document.createElement("section");
            windowEl.id = windowId;
            windowEl.className = "window window--primary hidden";
            windowEl.setAttribute("role", "dialog");
            windowEl.setAttribute("aria-modal", "false");
            windowEl.setAttribute("aria-labelledby", `${windowId}-title`);
            windowEl.innerHTML = buildTicTacToeWindow(windowId);
            document.body.appendChild(windowEl);
            wireWindowControls(windowEl);
            initTicTacToe(windowEl);
        } else {
            showWindow(windowEl);
        }

        showWindow(windowEl);
        centerWindow(windowEl, true);
    }

    function buildTicTacToeWindow(windowId) {
        return `
      <header class="window-titlebar drag-handle">
        <div class="window-titlebar-left">
          <img src="cd_rom-icon.png" alt="" class="window-title-icon" aria-hidden="true">
          <span id="${windowId}-title" class="window-title">Tic Tac Toe</span>
        </div>
        <div class="window-titlebar-controls">
          <button type="button" class="window-control window-control--minimize" data-action="minimize" data-target="${windowId}" aria-label="Minimize">
            _
          </button>
          <button type="button" class="window-control window-control--maximize" data-action="maximize" data-target="${windowId}" aria-label="Maximize">
            ${MAXIMIZE_LABEL}
          </button>
          <button type="button" class="window-control window-control--close" data-action="close" data-target="${windowId}" aria-label="Close">
            X
          </button>
        </div>
      </header>
      <div class="window-body">
        <div class="ttt-wrap">
          <div class="ttt-status">Your turn (X)</div>
          <div class="ttt-grid">
            ${Array.from({ length: 9 }, (_, i) => `<button class="ttt-cell" data-index="${i}"></button>`).join("")}
          </div>
          <div class="ttt-actions">
            <button type="button" class="ttt-reset">Reset</button>
          </div>
        </div>
      </div>
    `;
    }

    function initTicTacToe(windowEl) {
        if (!windowEl || windowEl.dataset.tttBound === "true") return;
        windowEl.dataset.tttBound = "true";
        const statusEl = windowEl.querySelector(".ttt-status");
        const cells = Array.from(windowEl.querySelectorAll(".ttt-cell"));
        const resetBtn = windowEl.querySelector(".ttt-reset");

        const state = {
            board: Array(9).fill(null),
            player: "X",
            ai: "O",
            gameOver: false,
        };

        const winningLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        function render() {
            cells.forEach((cell, idx) => {
                cell.textContent = state.board[idx] || "";
            });
            if (state.gameOver) return;
            statusEl.textContent = `Your turn (${state.player})`;
        }

        function checkWinner(board) {
            for (const [a, b, c] of winningLines) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }
            if (board.every(Boolean)) return "tie";
            return null;
        }

        function minimax(board, isAiTurn) {
            const winner = checkWinner(board);
            if (winner === state.ai) return { score: 1 };
            if (winner === state.player) return { score: -1 };
            if (winner === "tie") return { score: 0 };

            const moves = [];
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    const newBoard = board.slice();
                    newBoard[i] = isAiTurn ? state.ai : state.player;
                    const result = minimax(newBoard, !isAiTurn);
                    moves.push({ index: i, score: result.score });
                }
            }
            if (isAiTurn) {
                return moves.reduce((best, move) => (move.score > best.score ? move : best), { score: -Infinity });
            }
            return moves.reduce((best, move) => (move.score < best.score ? move : best), { score: Infinity });
        }

        function aiMove() {
            const best = minimax(state.board, true);
            if (best.index === undefined) return;
            state.board[best.index] = state.ai;
            const winner = checkWinner(state.board);
            if (winner) {
                endGame(winner);
            } else {
                statusEl.textContent = "Your turn (X)";
            }
            render();
        }

        function endGame(winner) {
            state.gameOver = true;
            if (winner === "tie") {
                statusEl.textContent = "Tie game!";
            } else if (winner === state.player) {
                statusEl.textContent = "You win!";
            } else {
                statusEl.textContent = "Computer wins.";
            }
        }

        function handlePlayerMove(index) {
            if (state.gameOver || state.board[index]) return;
            state.board[index] = state.player;
            const winner = checkWinner(state.board);
            if (winner) {
                endGame(winner);
            } else {
                statusEl.textContent = "Computer thinking...";
                aiMove();
            }
            render();
        }

        cells.forEach((cell) => {
            cell.addEventListener("click", () => {
                handlePlayerMove(Number(cell.dataset.index));
            });
        });

        resetBtn.addEventListener("click", () => {
            state.board = Array(9).fill(null);
            state.gameOver = false;
            statusEl.textContent = "Your turn (X)";
            render();
        });

        render();
    }

    /* --------------------------------------------------
     * Recycle Bin
     * -------------------------------------------------- */

    function initRecycleBin() {
        const bin = document.getElementById("recycle-bin");
        const menu = document.getElementById("recycle-menu");
        const icon = document.getElementById("recycle-icon");
        if (!bin || !menu || !icon) return;

        let isEmpty = getRecycleState();
        updateRecycleIcon(isEmpty, icon);

        const hideMenu = () => menu.classList.add("hidden");

        const openMenuAt = (x, y) => {
            menu.classList.remove("hidden");
            const mh = menu.offsetHeight || 0;
            const mw = menu.offsetWidth || 0;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const left = Math.min(Math.max(x, 4), vw - mw - 4);
            const top = Math.max(4, Math.min(y - mh, vh - mh - 4));
            menu.style.left = `${left}px`;
            menu.style.top = `${top}px`;
        };

        bin.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            openMenuAt(e.clientX, e.clientY);
        });

        let touchTimer = null;
        bin.addEventListener("touchstart", (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            touchTimer = setTimeout(() => openMenuAt(touch.clientX, touch.clientY), 500);
        }, { passive: true });

        bin.addEventListener("touchend", () => {
            if (touchTimer) clearTimeout(touchTimer);
        });

        bin.addEventListener("dblclick", () => {
            openRecycleBinWindow();
        });

        menu.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-recycle]");
            if (!btn) return;
            const action = btn.dataset.recycle;
            switch (action) {
                case "open":
                    openRecycleBinWindow();
                    break;
                case "empty":
                    isEmpty = true;
                    setRecycleState(isEmpty);
                    updateRecycleIcon(isEmpty, icon);
                    playRecycleSound();
                    break;
                case "close":
                    alert("Nice try. The Recycle Bin never really closes.");
                    break;
                case "delete":
                    alert("WTF?! You just deleted the Recycle Bin.");
                    bin.remove();
                    break;
            }
            hideMenu();
        });

        document.addEventListener("click", (e) => {
            if (menu.contains(e.target) || bin.contains(e.target)) return;
            hideMenu();
        });
    }

    function updateRecycleIcon(isEmpty, iconEl) {
        iconEl.src = isEmpty ? "recycle_bin_empty-icon.png" : "recycle_bin_full-icon.png";
        iconEl.alt = isEmpty ? "Recycle Bin (empty)" : "Recycle Bin (full)";
    }

    function setRecycleState(empty) {
        localStorage.setItem(RECYCLE_KEY, empty ? "true" : "false");
    }

    function getRecycleState() {
        const stored = localStorage.getItem(RECYCLE_KEY);
        return stored === "true";
    }

    function playRecycleSound() {
        try {
            const audio = new Audio("recycle_bin.wav");
            const vol = typeof window.__win98Volume === "number" ? window.__win98Volume : 1;
            audio.volume = vol;
            audio.play().catch(() => {});
        } catch (err) {
            // ignore
        }
    }

    function openRecycleBinWindow() {
        const windowId = "popup-recycle";
        let windowEl = document.getElementById(windowId);

        if (!windowEl) {
            windowEl = document.createElement("section");
            windowEl.id = windowId;
            windowEl.className = "window window--primary hidden";
            windowEl.setAttribute("role", "dialog");
            windowEl.setAttribute("aria-modal", "false");
            windowEl.setAttribute("aria-labelledby", `${windowId}-title`);
            windowEl.innerHTML = buildRecycleWindow(windowId);
            document.body.appendChild(windowEl);
            wireWindowControls(windowEl);
        }

        showWindow(windowEl);
        centerWindow(windowEl, true);
    }

    function buildRecycleWindow(windowId) {
        return `
      <header class="window-titlebar drag-handle">
        <div class="window-titlebar-left">
          <img src="recycle_bin_full-icon.png" alt="" class="window-title-icon" aria-hidden="true">
          <span id="${windowId}-title" class="window-title">Recycle Bin</span>
        </div>
        <div class="window-titlebar-controls">
          <button type="button" class="window-control window-control--minimize" data-action="minimize" data-target="${windowId}" aria-label="Minimize">
            _
          </button>
          <button type="button" class="window-control window-control--maximize" data-action="maximize" data-target="${windowId}" aria-label="Maximize">
            ${MAXIMIZE_LABEL}
          </button>
          <button type="button" class="window-control window-control--close" data-action="close" data-target="${windowId}" aria-label="Close">
            X
          </button>
        </div>
      </header>
      <div class="window-body">
        ${renderRecycleBody()}
      </div>
    `;
    }

    function renderRecycleBody() {
        return `
      <div class="folder-body">
        <div class="folder-body-header">
          <div class="folder-body-path">C:\\Recycle Bin</div>
          <div class="folder-body-meta">Backlog tasks</div>
        </div>
        <p class="folder-body-text">
          Backlog of tasks parked in the bin. Double-click to restore or leave them for later.
        </p>
        <div class="project-section">
          <h3>Tasks</h3>
          <ul class="project-bullets">
            <li>Archive old project assets</li>
            <li>Clean up temporary builds</li>
            <li>Organize screenshots and exports</li>
            <li>Review drafts before final publish</li>
            <li>Clear completed bug tickets</li>
          </ul>
        </div>
      </div>
    `;
    }

    /* --------------------------------------------------
     * Calendar Window
     * -------------------------------------------------- */

    function openCalendarWindow() {
        const windowId = "popup-calendar";
        let windowEl = document.getElementById(windowId);

        if (!windowEl) {
            windowEl = document.createElement("section");
            windowEl.id = windowId;
            windowEl.className = "window window--calendar hidden";
            windowEl.setAttribute("role", "dialog");
            windowEl.setAttribute("aria-modal", "false");
            windowEl.setAttribute("aria-labelledby", `${windowId}-title`);
            windowEl.innerHTML = buildCalendarWindow(windowId);
            document.body.appendChild(windowEl);
            wireWindowControls(windowEl);
        } else {
            const body = windowEl.querySelector(".window-body");
            if (body) {
                body.innerHTML = renderCalendarBody();
            }
        }

        showWindow(windowEl);
        centerWindow(windowEl, false);
    }

    function buildCalendarWindow(windowId) {
        return `
      <header class="window-titlebar drag-handle">
        <div class="window-titlebar-left">
          <img src="time_and_date-icon.png" alt="" class="window-title-icon" aria-hidden="true">
          <span id="${windowId}-title" class="window-title">Calendar</span>
        </div>
        <div class="window-titlebar-controls">
          <button type="button" class="window-control window-control--minimize" data-action="minimize" data-target="${windowId}" aria-label="Minimize">
            _
          </button>
          <button type="button" class="window-control window-control--maximize" data-action="maximize" data-target="${windowId}" aria-label="Maximize">
            ${MAXIMIZE_LABEL}
          </button>
          <button type="button" class="window-control window-control--close" data-action="close" data-target="${windowId}" aria-label="Close">
            X
          </button>
        </div>
      </header>
      <div class="window-body">
        ${renderCalendarBody()}
      </div>
    `;
    }

    function renderCalendarBody() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.toLocaleString("default", { month: "long" });
        const day = now.getDate();
        const weekday = now.toLocaleString("default", { weekday: "long" });

        const firstDay = new Date(year, now.getMonth(), 1).getDay();
        const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
        const weeks = [];
        let currentDay = 1;
        for (let row = 0; row < 6; row++) {
            const cells = [];
            for (let col = 0; col < 7; col++) {
                const cellIndex = row * 7 + col;
                const dateNumber = cellIndex - firstDay + 1;
                if (dateNumber > 0 && dateNumber <= daysInMonth) {
                    const isToday = dateNumber === day;
                    cells.push(`<div class="cal-cell ${isToday ? "cal-cell--today" : ""}">${dateNumber}</div>`);
                } else {
                    cells.push(`<div class="cal-cell cal-cell--empty"></div>`);
                }
            }
            weeks.push(`<div class="cal-row">${cells.join("")}</div>`);
        }

        return `
      <div class="calendar-wrap">
        <div class="calendar-header">
          <div class="calendar-title">${month} ${year}</div>
          <div class="calendar-today">${weekday}, ${month} ${day}</div>
        </div>
        <div class="calendar-grid">
          <div class="cal-head">Sun</div>
          <div class="cal-head">Mon</div>
          <div class="cal-head">Tue</div>
          <div class="cal-head">Wed</div>
          <div class="cal-head">Thu</div>
          <div class="cal-head">Fri</div>
          <div class="cal-head">Sat</div>
          ${weeks.join("")}
        </div>
      </div>
    `;
    }

    /* --------------------------------------------------
     * Clock
     * -------------------------------------------------- */

    function initClock() {
        const clockEl = document.getElementById("taskbar-clock");
        const clockText = document.getElementById("taskbar-clock-text") || clockEl;
        if (!clockEl || !clockText) return;

        function updateClock() {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            clockText.textContent = timeString;
        }

        updateClock();
        setInterval(updateClock, 60 * 1000); // update every minute
    }

    /* --------------------------------------------------
     * DOS Prompt
     * -------------------------------------------------- */

    function initDos() {
        const screen = document.getElementById("dos-screen");
        const input = document.getElementById("dos-input");
        if (!screen || !input) return;

        if (!screen.dataset.initialized) {
            screen.textContent = "Microsoft(R) Windows 98\n(C)Copyright Microsoft Corp 1981-1999\n\nC:\\>";
            screen.dataset.initialized = "true";
        }

        input.onkeydown = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                runDosCommand(input.value.trim(), screen);
                input.value = "";
                scrollDos(screen);
            }
        };
    }

    function runDosCommand(cmd, screen) {
        if (!cmd) {
            appendDosLine(screen, "C:\\>");
            return;
        }
        const parts = cmd.split(" ");
        const base = parts[0].toLowerCase();
        switch (base) {
            case "dir":
                appendDosLine(
                    screen,
                    " Volume in drive C has no label.\n Directory of C:\\\n\n ABOUTME     <DIR>\n PROJECTGALLERY <DIR>\n CONTACT     <DIR>\n GAMES       <DIR>\n NOTEPAD     EXE\n"
                );
                break;
            case "cd":
                if (!parts[1]) {
                    appendDosLine(screen, "Path not found");
                    break;
                }
                switch (parts[1].toLowerCase()) {
                    case "aboutme":
                        appendDosLine(screen, "Opening ABOUT ME...");
                        openContentWindow("about");
                        break;
                    case "contact":
                        appendDosLine(screen, "Opening CONTACT...");
                        openContentWindow("contact");
                        break;
                    case "projectgallery":
                        appendDosLine(screen, "Opening PROJECT GALLERY...");
                        openContentWindow("gallery");
                        break;
                    case "games":
                        appendDosLine(screen, "Opening GAMES...");
                        openGamesWindow();
                        break;
                    case "notepad":
                        appendDosLine(screen, "Opening NOTEPAD...");
                        openNotepadWindow();
                        break;
                    default:
                        appendDosLine(screen, "Path not found");
                        break;
                }
                break;
            case "help":
                appendDosLine(
                    screen,
                    "Supported commands: DIR, CD ABOUT-ME, HELP, CLS, EXIT"
                );
                break;
            case "cls":
                screen.textContent = "";
                break;
            case "exit":
                const win = document.getElementById("popup-dos");
                if (win) hideWindow(win);
                break;
            default:
                appendDosLine(screen, `'${cmd}' is not recognized as an internal or external command.`);
        }
        appendDosLine(screen, "C:\\>");
    }

    function appendDosLine(screen, text) {
        screen.textContent += `\n${text}`;
    }

    function scrollDos(screen) {
        screen.scrollTop = screen.scrollHeight;
    }
})();
