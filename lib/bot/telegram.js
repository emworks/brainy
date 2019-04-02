const token = `621727075:AAGJ8ctVVgMy4APg16MXe5W8Gh-Ng5dZUp0`;

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });

const sayHello = ({ 
    chat: { id: chatId }
}) => bot.sendMessage(chatId, 'Чему бы вы хотели научиться?');

const getSearcher = ({ search }) => async ({ 
    chat: { id: chatId }, text
}) => {
    const courses = await search(text, 5);
    if (courses.length) {
        courses.map(({
            _id, 
            title, 
            url, 
            description, 
            sourceId, 
            dateFrom, 
            rating 
        }) => {
            let message = `${title}\n${url}\n${description}\n${sourceId}`;
            bot.sendMessage(chatId, message);
        });
    } else {
        bot.sendMessage(chatId, 'Ничего не найдено');
    }
};

module.exports = ({ esearch }) => {
    bot.on('message', async msg => /\/start$/.test(msg.text)
        ? sayHello(msg) : await getSearcher(esearch)(msg)
    );
};