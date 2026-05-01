/**
 * Unified content loader for both AJAX and PJAX navigation.
 * Fetches content from a URL and updates the #content element.
 *
 * @param {string} url - URL to fetch content from
 * @param {Object} options - Configuration options
 * @param {boolean} options.updateTitle - Whether to update document title (default: false)
 * @param {boolean} options.updateHistory - Whether to push to history state (default: false)
 * @param {boolean} options.hideSidebars - Whether to hide sidebar navigation (default: false)
 * @returns {Promise<void>}
 */
async function loadContentFromUrl(url, { updateTitle = false, updateHistory = false, hideSidebars = false } = {}) {
  const contentEl = document.getElementById('content');
  if (!contentEl) {
    console.error('Content element not found');
    return;
  }

  try {
    contentEl.style.opacity = '0.6';

    const response = await fetch(url, {
      headers: { 'X-Requested-With': 'fetch' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract #content from a full HTML document, otherwise use the raw partial
    let contentToInsert = html;
    if (html.includes('</html>')) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const nextContent = doc.querySelector('#content');
      if (nextContent) {
        contentToInsert = nextContent.innerHTML;
        if (updateTitle && doc.title) {
          document.title = doc.title;
        }
      }
    }

    contentEl.innerHTML = contentToInsert;
    contentEl.style.opacity = '1';

    if (updateHistory) {
      history.pushState({ url }, '', url);
    }

    if (window.initBlurWipe) {
      window.initBlurWipe(contentEl);
    }

    const inferredHide = hideSidebars || shouldHideSidebarsForUrl(url);
    toggleSidebars(!inferredHide);
  } catch (error) {
    console.error('Failed to load content:', error);
    contentEl.innerHTML = '<p>Error loading content. Please try again.</p>';
    contentEl.style.opacity = '1';
  }
}

/**
 * Toggle visibility of sidebar navigation.
 * Expands the central column to full width when sidebars are hidden.
 *
 * @param {boolean} show - true = show sidebars, false = hide and expand centre
 */
function toggleSidebars(show) {
  const contentEl = document.getElementById('content');
  if (!contentEl) return;

  const row = contentEl.closest('.row');
  if (!row) return;

  const sideCols = row.querySelectorAll(':scope > .col-md-3');
  const centralCol = row.querySelector(':scope > .col-md-6, :scope > .col-md-12');

  if (show) {
    sideCols.forEach(col => (col.style.display = ''));
    if (centralCol) {
      centralCol.classList.remove('col-md-12');
      centralCol.classList.add('col-md-6');
    }
  } else {
    sideCols.forEach(col => (col.style.display = 'none'));
    if (centralCol) {
      centralCol.classList.remove('col-md-6');
      centralCol.classList.add('col-md-12');
    }
  }
}

/**
 * Sidebar button loader. Handles named sections and direct URL paths.
 * All navigation pushes a history state so browser back/forward works.
 *
 * @param {string} section - Section name ('', 'news', 'cv', …) or a URL path
 */
function loadContent(section) {
  // Empty string or 'bio' both mean the home/bio page
  if (section === '' || section === 'bio') {
    loadContentFromUrl('/', { updateTitle: true, updateHistory: true, hideSidebars: false });
    return;
  }

  const knownSections = ['news', 'cv', 'contact', 'portfolio', 'portfolio_item', 'news_index'];
  const mainSections  = ['news', 'cv', 'contact', 'portfolio', 'news_index'];

  if (knownSections.includes(section)) {
    const isPortfolioItem = !mainSections.includes(section);
    loadContentFromUrl(`/${section}`, {
      updateTitle:   true,
      updateHistory: true,
      hideSidebars:  isPortfolioItem,
    });
  } else if (section.startsWith('/') || section.includes('.')) {
    // Direct URL path — treat as a portfolio item
    loadContentFromUrl(section, {
      updateTitle:   true,
      updateHistory: true,
      hideSidebars:  true,
    });
  } else {
    // External URL — full navigation
    window.location.href = section;
  }
}

/**
 * PJAX: intercept internal link clicks and handle browser back/forward.
 */
(function () {
  function isInternalLink(a) {
    if (!a || !a.getAttribute) return false;
    const href = a.getAttribute('href');
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    if (a.hasAttribute('download')) return false;
    if (a.target && a.target !== '_self') return false;
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || !isInternalLink(a)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    const url = new URL(a.href, window.location.origin).toString();
    const hideSidebars = shouldHideSidebarsForUrl(url);
    loadContentFromUrl(url, { updateTitle: true, updateHistory: true, hideSidebars }).catch(() => {
      window.location.href = a.href;
    });
  });

  window.addEventListener('popstate', (e) => {
    const url = (e.state && e.state.url) ? e.state.url : window.location.href;
    const hideSidebars = shouldHideSidebarsForUrl(url);
    loadContentFromUrl(url, { updateTitle: true, updateHistory: false, hideSidebars }).catch(() => {
      window.location.href = url;
    });
  });

  // Record the initial page load so the first back-press can restore it
  history.replaceState({ url: window.location.href }, '', window.location.href);
})();

// Lock sidebar columns to their initial rendered height so buttons never grow
// or shrink as the central content panel changes. align-self: flex-start opts
// each sidebar out of the row's align-items: stretch so the central column
// can still change height freely.
window.addEventListener('load', () => {
  const sidebars = document.querySelectorAll('.row.d-flex-nimp > .col-md-3');
  sidebars.forEach(col => {
    const h = col.getBoundingClientRect().height;
    col.style.height    = h + 'px';
    col.style.alignSelf = 'flex-start';
  });
});

function shouldHideSidebarsForUrl(urlString) {
  const u = new URL(urlString, window.location.origin);
  const path = u.pathname.replace(/\/+$/, '');
  // Hide sidebars for portfolio items, but not the portfolio index itself
  return path.startsWith('/portfolio') && path !== '/portfolio';
}
