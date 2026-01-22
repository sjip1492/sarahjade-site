/**
 * Unified content loader for both AJAX and PJAX navigation.
 * Fetches content from a URL and updates the #content element.
 * 
 * @param {string} url - URL to fetch content from
 * @param {Object} options - Configuration options
 * @param {boolean} options.updateTitle - Whether to update document title (default: false)
 * @param {boolean} options.updateHistory - Whether to push to history state (default: false)
 * @returns {Promise<void>}
 */
async function loadContentFromUrl(url, { updateTitle = false, updateHistory = false } = {}) {
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
  } catch (error) {
    console.error('Failed to load content:', error);
    contentEl.innerHTML = '<p>Error loading content. Please try again.</p>';
    contentEl.style.opacity = '1';
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
  
  if (knownSections.includes(section)) {
    // Known partial; load from section path
    loadContentFromUrl(`/${section}`, { updateTitle: false });
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
    loadContentFromUrl(url, { updateTitle: true, updateHistory: true }).catch(() => {
      window.location.href = a.href;
    });
  });

  // Handle back/forward navigation
  window.addEventListener("popstate", (e) => {
    const url = (e.state && e.state.url) ? e.state.url : window.location.href;
    // Load without pushing to history (popstate already handled it)
    loadContentFromUrl(url, { updateTitle: true, updateHistory: false }).catch(() => {
      window.location.href = url;
    });
  });
})();