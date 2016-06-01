'use strict'

import config from '../config.json'
import * as Hangman from './hangman'
import TelegramBot from 'node-telegram-bot-api'

let bot = new TelegramBot(config.TOKEN, { polling: true })

class MessageManager {
  construct () {
    this.processed_messages = new Map()
  }

  process (message) {
    this.processed_messages.set(message.message_id, message)
  }

  getMessage (id) {
    return this.processed_messages.get(id)
  }

  isMessage (id) {
    return this.processed_messages.has(id)
  }
}

Hangman.init(() => {
  let messageManager = new MessageManager()

  // Matches /start
  bot.onText(/\/start/, function (msg, match) {
    messageManager.process(msg)
    console.log('start', msg)
  })

  // Matches /guess [try]
  bot.onText(/\/guess ([a-zA-Z]+)/, function (msg, match) {
    messageManager.process(msg)
    console.log('guess', match[1], msg)
  })

  // Matches /restart
  bot.onText(/\/restart/, function (msg, match) {
    messageManager.process(msg)
    console.log('restart', msg)
  })

  bot.onText(/.*/, function (msg) {
    if (messageManager.has(msg.message_id)) return
    console.log('default', msg)
  })
})
