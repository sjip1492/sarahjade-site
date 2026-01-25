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
    // Add loading hint
    contentEl.style.opacity = '0.6';

    const response = await fetch(url, {
      headers: { 'X-Requested-With': 'fetch' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract content from full HTML if needed
    let contentToInsert = html;
    if (html.includes('</html>')) {
      // Full HTML document; extract #content
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const nextContent = doc.querySelector('#content');
      if (nextContent) {
        contentToInsert = nextContent.innerHTML;
        if (updateTitle && doc.title) {
          document.title = doc.title;
        }
      }
    }

    // Update content
    contentEl.innerHTML = contentToInsert;
    contentEl.style.opacity = '1';

    // Update history if requested
    if (updateHistory) {
      history.pushState({ url }, '', url);
    }

    // Re-initialize animations on newly injected content
    if (window.initBlurWipe) {
      window.initBlurWipe(contentEl);
    }

    // Handle sidebar visibility
  const inferredHide = hideSidebars || shouldHideSidebarsForUrl(url);
  toggleSidebars(!inferredHide);
  } catch (error) {
    console.error('Failed to load content:', error);
    contentEl.innerHTML = '<p>Error loading content. Please try again.</p>';
    contentEl.style.opacity = '1';
  }
}

/**
 * Toggle visibility of sidebar navigation and back button.
 * When showing sidebars, hides the back button and shows nav buttons.
 * When hiding sidebars, shows the back button and hides nav buttons.
 * Also adjusts central pane width to fill space when sidebars are hidden.
 * 
 * @param {boolean} show - Whether to show sidebars (true = show nav buttons, false = show back button)
 */
function toggleSidebars(show) {
  const contentEl = document.getElementById('content');
  if (!contentEl) return;

  const row = contentEl.closest('.row');
  if (!row) return;

  const sideCols = row.querySelectorAll(':scope > .col-md-3');
  const centralCol = row.querySelector(':scope > .col-md-6, :scope > .col-md-12');
  const backBtn = document.getElementById('back-button');

  if (show) {
    // Show sidebars
    sideCols.forEach(col => (col.style.display = ''));

    // Hide back button
    if (backBtn) backBtn.style.display = 'none';

    // Restore central column width
    if (centralCol) {
      centralCol.classList.remove('col-md-12');
      centralCol.classList.add('col-md-6');
    }
  } else {
    // Hide sidebars
    sideCols.forEach(col => (col.style.display = 'none'));

    // Show back button
    if (backBtn) backBtn.style.display = '';

    // Expand central column
    if (centralCol) {
      centralCol.classList.remove('col-md-6');
      centralCol.classList.add('col-md-12');
    }
  }
}


/**
 * Legacy AJAX loader for sidebar buttons. Supports both partials and full pages.
 * Now delegates to unified loadContentFromUrl.
 * 
 * @param {string} section - Section name or URL to load
 */
function loadContent(section) {
  const knownSections = ['bio', 'news', 'cv', 'portfolio', 'portfolio_item', 'news_index'];
  const mainSections = ['bio', 'news', 'cv', 'portfolio', 'news_index'];
  
  // Check if it's a known partial or a direct URL
  if (knownSections.includes(section)) {
    // Known partial; load from section path
    // Portfolio items: hide sidebars and don't update URL
    const isPortfolioItem = !mainSections.includes(section);
    loadContentFromUrl(`/${section}`, { 
      updateTitle: false,
      updateHistory: false,
      hideSidebars: isPortfolioItem
    });
  } else if (section.startsWith('/') || section.includes('.')) {
    // Direct URL (e.g., /portfolio/upaies.html or /portfolio/upaies)
    // Treat as portfolio item
    loadContentFromUrl(section, { 
      updateTitle: false,
      updateHistory: false,
      hideSidebars: true
    });
  } else {
    // External link; full navigation
    window.location.href = section;
  }
  
}

/**
 * PJAX: Intercept internal link clicks and handle back/forward navigation.
 * This enables smooth navigation without full page reloads.
 */
(function () {
  function isInternalLink(a) {
    if (!a || !a.getAttribute) return false;
    const href = a.getAttribute("href");
    if (!href) return false;

    // Ignore anchors, mailto, tel, downloads, and new tabs
    if (href.startsWith("#")) return false;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
    if (a.hasAttribute("download")) return false;
    if (a.target && a.target !== "_self") return false;

    // Only same-origin
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  // Intercept clicks on internal links
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    if (!isInternalLink(a)) return;

    // Respect modified clicks (open in new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    const url = new URL(a.href, window.location.origin).toString();
    
    // Load with history update
    const hideSidebars = shouldHideSidebarsForUrl(url);
    loadContentFromUrl(url, { updateTitle: true, updateHistory: true, hideSidebars }).catch(() => {
      window.location.href = a.href;
    });
  });

  // Handle back/forward navigation
  window.addEventListener("popstate", (e) => {
    const url = (e.state && e.state.url) ? e.state.url : window.location.href;
    // Load without pushing to history (popstate already handled it)
    const hideSidebars = shouldHideSidebarsForUrl(url);
    loadContentFromUrl(url, { updateTitle: true, updateHistory: false, hideSidebars })
    .catch(() => {
      window.location.href = url;
    });
  });
})();
function shouldHideSidebarsForUrl(urlString) {
  const u = new URL(urlString, window.location.origin);
  const path = u.pathname.replace(/\/+$/, ''); // trim trailing slash

  // Hide sidebars for portfolio *items*, but not the portfolio index
  return path.startsWith('/portfolio') && path !== '/portfolio';
}
