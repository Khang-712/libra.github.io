const pianoKeys = document.querySelectorAll(".piano-keys .key"),
  volumeSlider = document.querySelector(".volume-slider input"),
  keysCheckbox = document.querySelector(".keys-checkbox input");

let allKeys = [],
  audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Initialize Web Audio API context

// Map of data-key values to frequencies (in Hz) for a single octave (C4 to B4)
const keyFrequencies = {
  a: 261.63, // C4
  w: 277.18, // C#4
  s: 293.66, // D4
  e: 311.13, // D#4
  d: 329.63, // E4
  f: 349.23, // F4
  t: 369.99, // F#4
  g: 392.00, // G4
  y: 415.30, // G#4
  h: 440.00, // A4
  u: 466.16, // A#4
  j: 493.88, // B4
  k: 523.25, // C5
  o: 554.37, // C#5
  l: 587.33, // D5
  p: 622.25, // D#5
  ";": 659.25 // E5
};

const playTune = (key) => {
  const frequency = keyFrequencies[key];
  if (!frequency) return; // Skip if no frequency for the key

  // Create an oscillator for the sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Connect oscillator to gain node and gain node to output
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Set oscillator type (sine wave for a clean piano-like sound)
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  // Set volume from slider (default to 0.5 if not set)
  gainNode.gain.setValueAtTime(volumeSlider.value || 0.5, audioContext.currentTime);

  // Start the sound
  oscillator.start();

  // Stop the sound after 0.5 seconds with a fade-out
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
  oscillator.stop(audioContext.currentTime + 0.5);

  // Visual feedback for the clicked key
  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  clickedKey.classList.add("active");
  setTimeout(() => {
    clickedKey.classList.remove("active");
  }, 150);
};

pianoKeys.forEach((key) => {
  allKeys.push(key.dataset.key); // Add data-key value to allKeys array
  key.addEventListener("click", () => playTune(key.dataset.key));
});

const handleVolume = (e) => {
  // Volume is handled in playTune via gainNode
};

const showHideKeys = () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
};

const pressedKey = (e) => {
  if (allKeys.includes(e.key)) playTune(e.key);
};

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);
