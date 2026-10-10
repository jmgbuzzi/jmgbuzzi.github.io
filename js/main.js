/* ==========================================================================
   main.js — all the interactive bits. Plain JavaScript, no libraries.
   1. Theme toggle
   2. Formula bar + sheet tabs (follow the section you're looking at)
   3. Skill data bars
   4. Projects table (rendered from data/projects.json)
   5. Ctrl+Z easter egg
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Theme toggle ---------- */
  // The starting theme is set by the small script in <head>; this handles the button.
  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');

  function updateToggleLabel() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  themeToggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: theme just won't be remembered */ }
    updateToggleLabel();
  });
  updateToggleLabel();


  /* ---------- 2. Formula bar + sheet tabs ---------- */
  // Every section has data-cell (e.g. "Skills!A1") and data-formula (e.g. "=SKILLS()").
  var cellRef = document.getElementById('cell-ref');
  var formula = document.getElementById('formula');
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[data-cell]'));
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.sheet-tabs .tab'));
  var activeId = null;
  var clickLockUntil = 0;

  function setActive(section) {
    if (!section || section.id === activeId) return;
    activeId = section.id;
    cellRef.textContent = section.getAttribute('data-cell');
    formula.textContent = section.getAttribute('data-formula');
    tabs.forEach(function (tab) {
      if (tab.getAttribute('data-tab') === section.id) {
        tab.setAttribute('aria-current', 'true');
      } else {
        tab.removeAttribute('aria-current');
      }
    });
  }

  // Clicking anywhere inside a section "selects" it
  sections.forEach(function (section) {
    section.addEventListener('click', function () { setActive(section); });
  });

  // Clicking a tab or nav link selects the target section straight away
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (target && target.hasAttribute('data-cell')) {
        setActive(target);
        // Keep this choice while the page smooth-scrolls there
        clickLockUntil = Date.now() + 1000;
      }
    });
  });

  // While scrolling: the active section is the last one whose top has passed
  // a line just below the sticky app bar.
  var appBar = document.querySelector('.app-bar');
  var scrollQueued = false;

  function updateFromScroll() {
    scrollQueued = false;
    if (Date.now() < clickLockUntil) return;
    var line = appBar.offsetHeight + window.innerHeight * 0.25;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) current = section;
    });
    // At the very bottom of the page, Contact may never reach the line, so force it
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = sections[sections.length - 1];
    setActive(current);
  }

  window.addEventListener('scroll', function () {
    // Wait for the next frame so we check at most once per frame
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateFromScroll);
    }
  }, { passive: true });
  updateFromScroll();


  /* ---------- 3. Skill data bars ---------- */
  // Bar width comes from the level, like conditional formatting.
  var LEVEL_WIDTH = { beginner: 35, intermediate: 60, advanced: 85 };
  var skillCards = Array.prototype.slice.call(document.querySelectorAll('.skill-card'));

  function fillBar(card) {
    var width = LEVEL_WIDTH[card.getAttribute('data-level')] || 0;
    card.querySelector('.bar-fill').style.width = width + '%';
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    // Animate each bar from 0 the first time it scrolls into view
    var barObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillCards.forEach(function (card) { barObserver.observe(card); });
  } else {
    skillCards.forEach(fillBar);
  }


  /* ---------- 4. Projects table ---------- */
  var projectsTable = document.getElementById('projects-table');
  var projectsBody = document.getElementById('projects-body');

  // Small helper: create an element with a class and optional text
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function messageRow(message) {
    var tr = el('tr', 'pipeline-row');
    tr.appendChild(el('td', 'col-num', '1'));
    var td = el('td', '', message);
    td.colSpan = 4;
    var cursor = el('span', 'cursor');
    cursor.setAttribute('aria-hidden', 'true');
    td.appendChild(cursor);
    tr.appendChild(td);
    return tr;
  }

  function externalLink(href, label) {
    var a = el('a', '', label + ' ↗');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    return a;
  }

  function projectRow(project, index) {
    var tr = document.createElement('tr');

    // #
    tr.appendChild(el('td', 'col-num', String(index + 1)));

    // Project: optional thumbnail, title, summary
    var tdProject = document.createElement('td');
    if (project.image) {
      var img = el('img', 'project-thumb');
      img.src = project.image;
      img.alt = 'Screenshot of ' + project.title;
      img.width = 160;
      img.height = 90;
      img.loading = 'lazy';
      tdProject.appendChild(img);
    }
    tdProject.appendChild(el('div', 'project-title', project.title));
    if (project.summary) tdProject.appendChild(el('p', 'project-summary', project.summary));
    tr.appendChild(tdProject);

    // Question answered
    tr.appendChild(el('td', '', project.question || ''));

    // Tools as chips
    var tdTools = document.createElement('td');
    var chips = el('div', 'chips');
    (project.tools || []).forEach(function (tool) { chips.appendChild(el('span', 'chip', tool)); });
    tdTools.appendChild(chips);
    tr.appendChild(tdTools);

    // Links
    var tdLinks = document.createElement('td');
    var links = el('div', 'project-links');
    if (project.repo) links.appendChild(externalLink(project.repo, 'Code'));
    if (project.demo) links.appendChild(externalLink(project.demo, 'Live'));
    if (!project.repo && !project.demo) links.appendChild(el('span', 'project-summary', '—'));
    tdLinks.appendChild(links);
    tr.appendChild(tdLinks);

    return tr;
  }

  function renderProjects(projects) {
    projectsBody.textContent = '';
    projectsTable.classList.toggle('is-empty', !projects.length);

    if (!projects.length) {
      projectsBody.appendChild(messageRow('Project pipeline loading — first case studies coming November 2026'));
      return;
    }

    // Featured first, then newest date ("YYYY-MM" strings sort correctly as text)
    projects.sort(function (a, b) {
      if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
      return String(b.date || '').localeCompare(String(a.date || ''));
    });

    projects.forEach(function (project, i) { projectsBody.appendChild(projectRow(project, i)); });
  }

  fetch('data/projects.json')
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) { renderProjects(data.projects || []); })
    .catch(function (error) {
      // Usually means the page was opened by double-clicking index.html:
      // browsers block reading local files. Use a local server instead (see README).
      projectsBody.textContent = '';
      projectsTable.classList.add('is-empty');
      projectsBody.appendChild(messageRow('Couldn\'t load projects — preview through a local server (see README)'));
      console.warn('Could not load data/projects.json:', error);
    });


  /* ---------- 5. Ctrl+Z / Cmd+Z easter egg ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2800);
  }

  document.addEventListener('keydown', function (event) {
    var isUndo = (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z';
    if (!isUndo) return;

    // Leave real undo alone when typing in a field
    var t = event.target;
    var isTyping = t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    if (isTyping) return;

    showToast('Nice try — this intern can\'t be undone.');
  });
})();
