let audioContext, analyzer, dataArray;
let isInitialized = false;

export async function initAudioReactive() {
  if (isInitialized) return;
  
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;

    dataArray = new Uint8Array(analyzer.frequencyBinCount);

    // Using user mic as specified in the original snippet. 
    // This requires user gesture / permission.
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyzer);

    isInitialized = true;
    animateReactive();
  } catch (err) {
    console.warn("Audio Reactive Engine could not initialize:", err);
  }
}

function animateReactive() {
  if (!isInitialized) return;

  analyzer.getByteFrequencyData(dataArray);

  const bass = dataArray.slice(0, 10).reduce((a,b)=>a+b) / 10;
  const mid = dataArray.slice(10, 40).reduce((a,b)=>a+b) / 30;
  const treble = dataArray.slice(40, 80).reduce((a,b)=>a+b) / 40;

  document.documentElement.style.setProperty('--bass', (bass / 255).toFixed(3));
  document.documentElement.style.setProperty('--mid', (mid / 255).toFixed(3));
  document.documentElement.style.setProperty('--treble', (treble / 255).toFixed(3));

  requestAnimationFrame(animateReactive);
}
