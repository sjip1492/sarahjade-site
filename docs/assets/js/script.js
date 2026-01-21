function loadContent(section) {
  // Check if this is a local HTML section (partial) or a full page
  if (['bio', 'news', 'cv', 'portfolio', 'work_index', 'news_index'].includes(section)) {
    fetch(`/${section}`)
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
document.addEventListener("DOMContentLoaded", () => {
  const icon = document.querySelector(".signature-icon");
  if (!icon) {
    console.warn("[signature-icon] not found in DOM");
    return;
  }

  // Desktop-only: allow laptops/desktops, block touch devices
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const hasHover = window.matchMedia("(hover: hover)").matches;
  const hasTouch = (navigator.maxTouchPoints || 0) > 0;

  const isDesktop = hasFinePointer && hasHover && !hasTouch;

  console.log("[signature-icon] hasFinePointer:", hasFinePointer, "hasHover:", hasHover, "hasTouch:", hasTouch, "=> isDesktop:", isDesktop);

  if (!isDesktop) return;

  // Build paths that work under baseurl:
  // Take the directory of the current icon src and use it to form other paths.
  const originalSrc = icon.currentSrc || icon.getAttribute("src");
  const url = new URL(originalSrc, window.location.href);

  // Example: if original is /myrepo/assets/images/favicon/web-app-manifest-512x512.png
  const imagesBase = url.pathname.replace(/\/favicon\/[^/]+$/, "/");
  const frogSrc = imagesBase + "frog.png";

  // If you’re on a subpath site, prefer using the same base as images:
  const basePrefix = imagesBase.split("/assets/")[0]; // e.g. "/myrepo"
  const audioSrc = basePrefix + "/assets/audio/frog2.wav";

  console.log("[signature-icon] original:", originalSrc);
  console.log("[signature-icon] frogSrc:", frogSrc);
  console.log("[signature-icon] audioSrc:", audioSrc);

  const audio = new Audio(audioSrc);
  audio.preload = "auto";
  audio.loop = true;

  let isOn = false;

  const turnOn = async () => {
    isOn = true;
    icon.src = frogSrc;

    try {
      await audio.play();
      console.log("[signature-icon] audio playing");
    } catch (e) {
      console.warn("[signature-icon] audio.play() failed:", e);
    }
  };

  const turnOff = () => {
    isOn = false;
    icon.src = originalSrc;
    audio.pause();
    audio.currentTime = 0;
    console.log("[signature-icon] toggled off");
  };

  icon.style.cursor = "pointer";

  icon.addEventListener("click", (e) => {
    console.log("[signature-icon] clicked");
    if (isOn) turnOff();
    else turnOn();
  });

});


