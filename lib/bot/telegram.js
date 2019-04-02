const token = `621727075:AAGJ8ctVVgMy4APg16MXe5W8Gh-Ng5dZUp0`;

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });

const sayHello = ({
    chat: { id: chatId }
}) => bot.sendMessage(chatId, 'Чему бы вы хотели научиться?');

const OFFSET = 5;

let _searchResults = {};

module.exports = ({ esearch }) => {
    const getCourses = ({ search }) => async (msg) => {
        if (!_searchResults[msg.chat.id].q ||
            _searchResults[msg.chat.id].q !== msg.text) {
            _searchResults[msg.chat.id] = await search(msg.text);
        }
    
        if (_searchResults[msg.chat.id].data.length) {
            await _searchResults[msg.chat.id].data
                .splice(0, OFFSET)
                .map(async ({ url }, i) => {
                    await bot.sendMessage(msg.chat.id, url);
                    if (i === OFFSET - 1) {
                        if (_searchResults[msg.chat.id].data.length) {
                            const options = {
                                reply_markup: JSON.stringify({
                                    inline_keyboard: [ [{ text: 'Показать', callback_data: msg.text }] ]
                                })
                            };
                            await bot.sendMessage(msg.chat.id, `Найдено ещё ${_searchResults[msg.chat.id].data.length}`, options);
                            await bot.once('callback_query', async (msg) => {
                                console.log(123, msg)
                                return
                                await process({ 
                                chat: { id: msg.chat.id } 
                            })});
                        } else {
                            _searchResults[msg.chat.id] = {
                                q: '',
                                data: []
                            };
                        }
                    }
                });
        } else {
            bot.sendMessage(msg.chat.id, 'Ничего не найдено');
        }
    };

    bot.on('message', async msg => {
        if (!_searchResults[msg.chat.id]) {
            _searchResults[msg.chat.id] = {
                q: '',
                data: []
            };
        }

        return /\/start$/.test(msg.text)
            ? sayHello(msg)
            : await getCourses(esearch)(msg)
    });
};