---
layout: content-post
title: CV
url: cv
---
<div class="cv-toggle">
  <button class="cv-toggle-btn active" data-cv="professional" onclick="switchCV('professional')">Professional</button>
  <button class="cv-toggle-btn" data-cv="academic" onclick="switchCV('academic')">Academic</button>
</div>

<div class="cv-actions">
  <!-- <a id="cv-open-btn" href="/assets/pdf/cv-professional.pdf" target="_blank" class="cv-action-btn">Open PDF ↗</a> -->
  <a id="cv-download-btn" href="/assets/pdf/cv-professional.pdf" download="SarahJadePratt_CV_Professional.pdf" class="cv-action-btn">Download ↓</a>
</div>

<div class="cv-viewer-wrap">
  <object
    id="cv-object"
    class="cv-object"
    data="/assets/pdf/cv-professional.pdf"
    type="application/pdf"
  >
    <p class="cv-fallback">
      Your browser cannot display PDFs inline.
      <a id="cv-fallback-link" href="/assets/pdf/cv-professional.pdf" target="_blank">Open PDF in a new tab.</a>
    </p>
  </object>
</div>
