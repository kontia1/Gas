const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
require('dotenv').config();

// Get environment variables
const { TELEGRAM_API_KEY, CHAT_ID, GAS_THRESHOLD } = process.env;

// Set up Telegram bot
const bot = new TelegramBot(TELEGRAM_API_KEY, { polling: true });

// Function to check the gas price
const checkGasPrice = async () => {
  try {
    // Fetch gas price from an API (for example, ETH gas station API)
    const response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    const gasPrice = response.data.fast / 10; // Converting to Gwei

    console.log(`Current Gas Price: ${gasPrice} Gwei`);

    if (gasPrice <= GAS_THRESHOLD) {
      // Send a Telegram message if the gas price is below the threshold
      bot.sendMessage(CHAT_ID, `Gas price is now below your threshold! Current price: ${gasPrice} Gwei`);
    }
  } catch (error) {
    console.error('Error fetching gas price:', error);
  }
};

// Set up cron job to check gas price every 5 minutes
cron.schedule('*/5 * * * *', checkGasPrice);

// Initial check when the bot starts
checkGasPrice();
