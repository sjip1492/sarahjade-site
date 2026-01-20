// Array of sound files
const soundFiles = [
  '/assets/sounds/squeak-1.mp3',
  '/assets/sounds/squeak-2.mp3',
  '/assets/sounds/squeak-3.mp3',
  '/assets/sounds/squeak-4.mp3'
];

// Sound state
let soundEnabled = true;

// Create audio element for hover sound
const hoverSound = new Audio();
hoverSound.volume = 0.5;

// Function to play random sound
function playRandomSound() {
  if (!soundEnabled) return;
  
  const randomIndex = Math.floor(Math.random() * soundFiles.length);
  hoverSound.src = soundFiles[randomIndex];
  hoverSound.currentTime = 0;
  hoverSound.play();
}

// Add hover sound to all blur-bg elements
document.querySelectorAll('.blur-bg').forEach(element => {
  element.addEventListener('mouseenter', playRandomSound);
});

// Create mute button
function createMuteButton() {
  const muteBtn = document.createElement('button');
  muteBtn.id = 'mute-sound-btn';
  muteBtn.innerHTML = '🔊'; // Speaker icon
  muteBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid white;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  `;
  
  muteBtn.addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    muteBtn.innerHTML = soundEnabled ? '🔊' : '🔇';
    muteBtn.style.backgroundColor = soundEnabled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 0, 0, 0.3)';
  });
  
  muteBtn.addEventListener('mouseenter', function() {
    muteBtn.style.transform = 'scale(1.1)';
  });
  
  muteBtn.addEventListener('mouseleave', function() {
    muteBtn.style.transform = 'scale(1)';
  });
  
  document.body.appendChild(muteBtn);
}

// Initialize mute button when page loads
document.addEventListener('DOMContentLoaded', createMuteButton);