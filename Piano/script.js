const pianoKeys = document.querySelectorAll(".piano-keys .key"),
  volumeSlider = document.querySelector(".volume-slider input"),
  keysCheckbox = document.querySelector(".keys-checkbox input");

let allKeys = [],
  audioContext = null,
  masterGain = null; // Global gain node

const keyFrequencies = {
  a: 261.63, w: 277.18, s: 293.66, e: 311.13, d: 329.63,
  f: 349.23, t: 369.99, g: 392.00, y: 415.30, h: 440.00,
  u: 466.16, j: 493.88, k: 523.25, o: 554.37, l: 587.33,
  p: 622.25, ";": 659.25
};

const initializeAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.setValueAtTime(parseFloat(volumeSlider.value) || 0.5, audioContext.currentTime);
    if (audioContext.state === "suspended") {
      audioContext.resume().then(() => console.log("AudioContext resumed successfully"))
        .catch((err) => console.error("Failed to resume AudioContext:", err));
    }
  }
};

const playTune = (key) => {
  console.log(`Playing key: ${key}`);
  const frequency = keyFrequencies[key];
  if (!frequency) {
    console.warn(`No frequency found for key: ${key}`);
    return;
  }

  initializeAudioContext();

  const oscillator = audioContext.createOscillator();
  oscillator.connect(masterGain);
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.5);

  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  if (clickedKey) {
    clickedKey.classList.add("active");
    setTimeout(() => clickedKey.classList.remove("active"), 150);
  } else {
    console.warn(`No key element found for data-key: ${key}`);
  }
};

pianoKeys.forEach((key) => {
  const keyValue = key.dataset.key;
  allKeys.push(keyValue);
  key.addEventListener("click", () => playTune(keyValue));
  console.log(`Registered key: ${keyValue}`);
});

const handleVolume = (e) => {
  const volume = parseFloat(e.target.value) || 0.5;
  console.log(`Volume changed to: ${volume}`);
  if (masterGain) {
    masterGain.gain.setValueAtTime(volume, audioContext.currentTime);
  }
};

const showHideKeys = () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
  console.log("Toggled key labels visibility");
};

const pressedKey = (e) => {
  if (allKeys.includes(e.key)) {
    console.log(`Keydown: ${e.key}`);
    playTune(e.key);
  }
};

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);
document.addEventListener("click", initializeAudioContext, {_TIMESTAMP: true });
