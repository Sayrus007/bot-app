// 1. Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand(); // Открыть на весь экран
tg.setHeaderColor('#000000');
tg.setBackgroundColor('#000000');

// 2. Логика бокового меню (Сворачивание/Разворачивание)
const panel = document.getElementById('panel');
const toggleBtn = document.getElementById('toggleBtn');
const toggleIcon = document.getElementById('toggleIcon');

if (toggleBtn && panel && toggleIcon) {
    toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 600) {
            panel.classList.toggle('open-mobile');
            panel.classList.remove('collapsed');
        } else {
            panel.classList.toggle('collapsed');
        }
        
        if (panel.classList.contains('collapsed') && window.innerWidth > 600) {
            toggleIcon.className = 'fa-solid fa-bars';
        } else if (!panel.classList.contains('open-mobile') && window.innerWidth <= 600) {
            toggleIcon.className = 'fa-solid fa-bars';
        } else {
            toggleIcon.className = 'fa-solid fa-xmark';
        }
    });

    if (window.innerWidth <= 600) {
        toggleIcon.className = 'fa-solid fa-bars';
    }
}

// ==========================================
// 3. WEBSOCKETS (СВЯЗЬ С PYTHON БОТОМ)
// ==========================================

// ВНИМАНИЕ: Если тестируете с телефона через Wi-Fi, замените localhost на IP компьютера (например: ws://192.168.1.5:8000/ws)
const wsUrl = "ws://localhost:8000/ws";
let ws;

function connectWebSocket() {
    ws = new WebSocket(wsUrl);

    ws.onopen = function() {
        const textEl = document.getElementById('connection-text');
        const dotEl = document.getElementById('connection-dot');
        if (textEl) textEl.innerText = "Система онлайн (Подключено)";
        if (dotEl) {
            dotEl.style.background = "#22c55e";
            dotEl.style.boxShadow = "0 0 10px #22c55e";
        }
    };

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        // Обновляем цены
        const xauEl = document.getElementById('xau-price');
        const btcEl = document.getElementById('btc-price');
        
        if (xauEl && xauEl.innerText !== data.xau_price.toFixed(2)) {
            xauEl.innerText = data.xau_price.toFixed(2);
            xauEl.style.color = "#ffffff";
            setTimeout(() => xauEl.style.color = "#38bdf8", 200);
        }
        
        if (btcEl && btcEl.innerText !== data.btc_price.toFixed(2)) {
            btcEl.innerText = data.btc_price.toFixed(2);
            btcEl.style.color = "#ffffff";
            setTimeout(() => btcEl.style.color = "#38bdf8", 200);
        }
        
        // Обновляем статус бота
        const statusElements = document.querySelectorAll('.status-indicator-text');
        statusElements.forEach(el => {
            const isActive = data.status === "ВКЛЮЧЕН";
            el.innerText = isActive ? "В работе" : "Остановлен";
            el.style.color = isActive ? "#22c55e" : "#f87171";
        });

        // Обновляем список сделок
        const tradesContainer = document.getElementById('trades-container');
        if (tradesContainer) {
            if (data.trades && data.trades.length > 0) {
                tradesContainer.innerHTML = '';
                data.trades.forEach(trade => {
                    const typeClass = trade.type === "BUY" ? "buy" : "sell";
                    tradesContainer.innerHTML += `
                        <div class="trade-item">
                            <div class="trade-info">
                                <span class="symbol">${trade.symbol}</span>
                                <span class="type ${typeClass}">${trade.type}</span>
                            </div>
                            <div class="trade-details">
                                <span class="price">${trade.price}</span>
                                <span class="time">${trade.time}</span>
                            </div>
                        </div>
                    `;
                });
            } else {
                tradesContainer.innerHTML = '<div style="color: #94a3b8; font-size: 0.9rem;">Нет открытых позиций</div>';
            }
        }
    };

    ws.onclose = function() {
        const textEl = document.getElementById('connection-text');
        const dotEl = document.getElementById('connection-dot');
        if (textEl) textEl.innerText = "Связь потеряна. Переподключение...";
        if (dotEl) {
            dotEl.style.background = "#f87171";
            dotEl.style.boxShadow = "0 0 10px #f87171";
        }
        
        // Автоматическое переподключение через 3 секунды
        setTimeout(connectWebSocket, 3000);
    };
}

// Запускаем подключение при открытии приложения
connectWebSocket();

// 4. ФУНКЦИЯ ДЛЯ КНОПОК
function sendCommand(actionName) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: actionName }));
        if (actionName === 'start') {
            tg.showAlert('Команда отправлена: Запуск бота 🟢');
        } else if (actionName === 'stop') {
            tg.showAlert('Команда отправлена: Остановка бота 🔴');
        }
    } else {
        tg.showAlert('Ошибка: Нет связи с сервером. Проверьте запущен ли Python-бот.');
    }
}
