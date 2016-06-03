'use strict'

import config from '../config.json'
import * as Hangman from './hangman'
import TelegramBot from 'node-telegram-bot-api'

let bot = new TelegramBot(config.TOKEN, { polling: true })

class MessageManager {
  constructor () {
    this.processed_messages = new Map()
  }

  process (message) {
    this.processed_messages.set(message.message_id, message)
  }

  getMessage (id) {
    return this.processed_messages.get(id)
  }

  isProcessed (id) {
    return this.processed_messages.has(id)
  }
}

Hangman.init(() => {
  let messageManager = new MessageManager()
  let hangmanGames = new Map()

  // Matches /start
  bot.onText(/\/start/, function (msg, match) {
    messageManager.process(msg)

    let hangman = new Hangman.Hangman()
    let chatId = msg.chat.id
    hangmanGames.set(chatId, hangman)
    bot.sendMessage(chatId, hangman.statusScreen())

    console.log('start', msg)
  })

  // Matches /guess [try]
  bot.onText(/\/guess ([a-zA-Z]+)/, function (msg, match) {
    messageManager.process(msg)

    let guess = match[1]
    let chatId = msg.chat.id
    let hangman = hangmanGames.get(chatId)

    if (!hangman) {
      return bot.sendMessage(chatId, 'You have to start a game to play! Please, use /start command.')
    }

    hangman.guess(guess)
    bot.sendMessage(chatId, hangman.statusScreen())

    console.log('guess', guess, msg)
  })

  // Matches /restart
  bot.onText(/\/restart/, function (msg, match) {
    messageManager.process(msg)

    let chatId = msg.chat.id
    let hangman = hangmanGames.get(chatId)

    if (!hangman) {
      return bot.sendMessage(chatId, 'You have to start a game to play! Please, use /start command.')
    }

    hangman.start(0)
    bot.sendMessage(chatId, hangman.statusScreen())

    console.log('restart', msg)
  })

  bot.onText(/.*/, function (msg) {
    if (messageManager.isProcessed(msg.message_id)) return
    console.log('unrecognized command', msg)
  })
})
