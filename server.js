// server.js

const express = require('express');
const path = require('path');

const app = express();

// Установка заголовков для разрешения загрузки через iframe с любых источников
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOWALL'); // Разрешает встраивание с любых сайтов
    res.setHeader('Content-Security-Policy', "frame-ancestors *"); // Также разрешает встраивание с любых источников
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

// Указываем директорию для статических файлов (HTML, JS и другие)
app.use(express.static(path.join(__dirname)));

// Запускаем сервер на порту 3001
app.listen(3001, () => {
    console.log('Сервер запущен на http://localhost:3001');
});
