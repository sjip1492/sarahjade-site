var cvFiles = {
  professional: {
    path: '/assets/pdf/cv-professional.pdf',
    download: 'SarahJadePratt_CV_Professional.pdf'
  },
  academic: {
    path: '/assets/pdf/cv-academic.pdf',
    download: 'SarahJadePratt_CV_Academic.pdf'
  }
};

function switchCV(type) {
  var cv = cvFiles[type];
  var obj = document.getElementById('cv-object');
  var openBtn = document.getElementById('cv-open-btn');
  var dlBtn = document.getElementById('cv-download-btn');
  var fallback = document.getElementById('cv-fallback-link');

  if (obj) obj.data = cv.path;
  if (openBtn) openBtn.href = cv.path;
  if (dlBtn) { dlBtn.href = cv.path; dlBtn.download = cv.download; }
  if (fallback) fallback.href = cv.path;

  document.querySelectorAll('.cv-toggle-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.cv === type);
  });
}
