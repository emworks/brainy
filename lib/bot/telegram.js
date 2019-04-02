const token = `621727075:AAGJ8ctVVgMy4APg16MXe5W8Gh-Ng5dZUp0`;

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });

const sayHello = ({
    chat: { id: chatId }
}) => bot.sendMessage(chatId, 'Чему бы вы хотели научиться?');

const OFFSET = 5;

const getCourses = ({ search }) => async ({
    chat: { id: chatId }, text
}) => {
    const process = async (query) => {
        console.log(2, _searchResults[chatId].q, _searchResults[chatId].data.length)
        if (!_searchResults[chatId].q ||
            _searchResults[chatId].q !== text) {
            _searchResults[chatId] = await search(text);
        }
    
        if (_searchResults[chatId].data.length) {
            await _searchResults[chatId].data
                .splice(0, OFFSET)
                .map(async ({ url }, i) => {
                    await bot.sendMessage(chatId, url);
                    if (i === OFFSET - 1) {
                        if (_searchResults[chatId].data.length) {
                            const options = {
                                reply_markup: JSON.stringify({
                                    inline_keyboard: [ [{ text: 'Показать', callback_data: text }] ]
                                })
                            };
                            await bot.sendMessage(chatId, `Найдено ещё ${_searchResults[chatId].data.length}`, options);
                            await bot.once('callback_query', async (q) => await process(q));
                        } else {
                            _searchResults[chatId] = {
                                q: '',
                                data: []
                            };
                        }
                    }
                });
        } else {
            bot.sendMessage(chatId, 'Ничего не найдено');
        }
    };
    await process(text);
};

let _searchResults = {};

module.exports = ({ esearch }) => {
    bot.on('message', async msg => {
        if (!_searchResults[msg.chat.id]) {
            _searchResults[msg.chat.id] = {
                q: '',
                data: []
            };
        }
console.log(1, msg)
        return /\/start$/.test(msg.text)
            ? sayHello(msg)
            : await getCourses(esearch)(msg)
    });
};