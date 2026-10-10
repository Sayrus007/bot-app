const tg = window.Telegram.WebApp;
tg.expand(); // Открываем WebApp на весь экран

const panel = document.getElementById('panel');
const toggleBtn = document.getElementById('toggleBtn');
const toggleIcon = document.getElementById('toggleIcon');

// Сворачивание панели
toggleBtn.addEventListener('click', () => {
  panel.classList.toggle('collapsed');
  if (panel.classList.contains('collapsed')) {
    toggleIcon.className = 'fa-solid fa-bars';
  } else {
    toggleIcon.className = 'fa-solid fa-xmark';
  }
});

// Отправка команд из Web App в Python-бот
function sendCommand(cmd) {
  // Телеграм закроет Web App и отправит эти данные боту, 
  // если настроено через web_app_data, либо мы используем tg.sendData
  tg.sendData(cmd);
}

// Заглушка для обновления тиков (в реальном проекте данные приходят по WebSocket)
setInterval(() => {
    let currentBtc = parseFloat(document.getElementById('btc-tick').innerText);
    document.getElementById('btc-tick').innerText = (currentBtc + (Math.random() * 10 - 5)).toFixed(2);
}, 2000);