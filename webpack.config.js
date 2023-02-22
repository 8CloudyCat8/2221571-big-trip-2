// Подключение модулей
const path = require('path'); // модуль для работы с путями
const CopyPlugin = require('copy-webpack-plugin'); // плагин для копирования файлов

// Экспорт конфигурации webpack
module.exports = {
    // Точка входа для сборки
    entry: './src/main.js',
    // Настройка выходного файла
    output: {
        filename: 'bundle.js', // имя выходного файла
        path: path.resolve(__dirname, 'build'), // путь для сохранения файла
        clean: true, // очистка папки build перед сохранением
    },
    // Настройка генерации source map
    devtool: 'source-map',
    // Настройка плагинов
    plugins: [
        // Плагин для копирования файлов
        new CopyPlugin({
            patterns: [{
                from: 'public'
            }], // копируем все файлы из папки public
        }),
    ],
    // Настройка загрузчиков
    module: {
        rules: [
            // Загрузчик для JavaScript файлов
            {
                test: /.js$/, // загружаем только файлы с расширением .js
                exclude: /(node_modules)/, // исключаем папку node_modules
                use: ['babel loader'] // используем babel для транспиляции кода
            },
            // Загрузчик для CSS файлов
            {
                test: /.css$/i, // загружаем только файлы с расширением .css
                use: ['style-loader', 'css-loader'], // используем style-loader и css-loader для обработки CSS кода
            }
        ]
    }
};
