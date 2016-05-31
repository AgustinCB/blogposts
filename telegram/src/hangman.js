'use strict'

import config from '../config.json'
import * as utils from './utils'
import fs

let words = new Map()

const MAX_TRIES = 6

const Status = utils.Enum({
  'PLAYING': 0,
  'WON': 1,
  'LOST': 2,
})

function init(onsuccess, onerror) {
  fs.readFile('../words.txt', (err, data) => {
    if (err) {
      onerror(err)
      return
    }

    data.split('\n').forEach((word) => {
      word = word.toLowerCase()

      if (!words.has(word.length)) {
        words.set(word.length, [])
      }

      words.get(word.length).push(word)
    })

    onsuccess()
  })
}

export default class Hangman {
  constructor() {
    start(0)
  }

  start(level) {
    let word_length = level + 4

    if (!words.has(word_length)) {
      this.state = Status['WON']
      return
    }

    this.level = level
    this.state = Status['PLAYING']
    this.message = ''
    this.word = utils.sample(words[word_length])
    this.guesses = []
    this.successes = Array(word_length).fill('_')
  }

  guess(letterorword) {
    let isletter = letterorword.length == 1
    let success = false

    letterorword.forEach((letter, index) => {
      if (isletter) {
        this.word.forEach((word_letter, word_index) => {
          if (word_letter == letter) {
            this.successes[word_index] = letter
            success = true
          }
        })
      } else {
        if (this.word[index] && this.word[index] == letter) {
          this.successes[index] = letter
          success = true
        }
      }
    })

    updateStatus(success)
  }

  updateStatus(success) {
    if (this.wrongs == MAX_TRIES) {
      this.status = Status['LOST']
      return
    }

    if (this.successes.join('') == this.word) {
      start(this.level + 1)
      this.message = "Congrats!! You cleared the level!"
      return
    }

    this.message = success ? "Good guess!" : "Bad luck, try again!"
  }

  statusScreen() {
    let statusscreen
    switch (this.state) {
      case Status['PLAYING']:
        statussreen = gameScreen()
        break
      case Status['WON']:
        statusscreen = 'Well done! You defeated the bot!'
        break
      case Status['LOST']:
        statusscreen = 'Ha-ha, looser! You lost! Ha-ha!'
        break
    }
    return statusscreen
  }

  gameScreen() {
    let drawLevel = () => {
      return `Level $(this.level + 1)`
    }
    let drawHangman = () => {
      let tries = this.wrongs
      return ''
    }
    let drawWord = () => {
      return this.successes.join(' ')
    }

    return `$(this.message)
    $(drawLevel())
    $(drawHangman())

    $(drawWord)
    `
  }

  get wrongs () {
    return this.guesses.length - this.successes.filter((letter) => letter != '_').length
  }
}
