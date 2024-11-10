function loadContent(section) {
  // Check if this is a local HTML section (partial) or a full page
  if (['bio', 'news', 'cv', 'work'].includes(section)) {
    fetch(`/partials/${section}.html`)
      .then(response => {
        if (!response.ok) throw new Error('Content not found');
        return response.text();
      })
      .then(html => {
        document.getElementById('content').innerHTML = html;
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
  function loadHeadshot() {
    document.getElementById('content').innerHTML = `
      <img src="/assets/images/headshot.jpg" alt="Your Photo" class="img-fluid rounded">
    `;
  }