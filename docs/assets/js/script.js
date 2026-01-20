function loadContent(section) {
  // Check if this is a local HTML section (partial) or a full page
  if (['bio', 'news', 'cv', 'work', 'work_index', 'news_index'].includes(section)) {
    fetch(`/partials/${section}.html`)
      .then(response => {
        if (!response.ok) throw new Error('Content not found');
        return response.text();
      })
      .then(html => {
        const content = document.getElementById('content');
        content.innerHTML = html;

        // re-init wipe on newly injected content
        if (window.initBlurWipe) window.initBlurWipe(content);
      })
      .catch(error => {
        console.error(error);
        document.getElementById('content').innerHTML = "<p>Error loading content.</p>";
      });
  } else {
    // For external or full page links, load normally
    window.location.href = section;
  }
}