// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand(); // Открыть на весь экран

// Устанавливаем цвета окна Telegram под дизайн
tg.setHeaderColor('#0f172a');
tg.setBackgroundColor('#0f172a');

function closeApp() {
    tg.close();
}

// Позже вы можете добавить сюда функцию fetch() или WebSockets
// для динамического обновления цен с вашего Python скрипта.