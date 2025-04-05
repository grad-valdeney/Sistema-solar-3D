const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startBtn = document.getElementById('startBtn');
const colorName = document.getElementById('colorName');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

startBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = context.getImageData(canvas.width / 2, canvas.height / 2, 1, 1);
  const [r, g, b] = imageData.data;
  const color = detectColor(r, g, b);
  speakColor(color);
  colorName.innerHTML = `Cor: <strong>${color.toUpperCase()}</strong>`;
});

function detectColor(r, g, b) {
  if (r > g && r > b) return "vermelho";
  if (g > r && g > b) return "verde";
  if (b > r && b > g) return "azul";
  return "indefinida";
}

function speakColor(color) {
  const msg = new SpeechSynthesisUtterance("Cor detectada: " + color);
  speechSynthesis.speak(msg);
}