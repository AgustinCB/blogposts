'use strict'

import * as utils from './utils'
import fs from 'fs'

let words = new Map()

const MAX_TRIES = 6

const Status = utils.Enum({
  'PLAYING': 0,
  'WON': 1,
  'LOST': 2
})

const hangman =
`    ----    
    |  |    
    0  |    
   /|\\ |    
   / \\ |    
       |    
      / \\   `.split('\n')
const hangmanindexes = [
  [ 2, 4 ],
  [ 3, 4 ],
  [ 3, 3 ],
  [ 3, 5 ],
  [ 4, 3 ],
  [ 4, 5 ]
].reverse()

export function init (onsuccess, onerror) {
  fs.readFile('../words.txt', (err, data) => {
    if (err) {
      onerror(err)
      return
    }

    data.toString().split('\n').forEach((word) => {
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
  constructor () {
    this.start(0)
  }

  start (level) {
    let wordlength = level + 4

    if (!words.has(wordlength)) {
      this.state = Status['WON']
      return
    }

    this.level = level
    this.state = Status['PLAYING']
    this.message = ''
    this.word = utils.sample(words[wordlength])
    this.guesses = []
    this.successes = Array(wordlength).fill('_')
  }

  guess (letterorword) {
    let isletter = letterorword.length === 1
    let success = false

    letterorword.forEach((letter, index) => {
      if (isletter) {
        this.word.forEach((wordletter, wordindex) => {
          if (wordletter === letter) {
            this.successes[wordindex] = letter
            success = true
          }
        })
      } else {
        if (this.word[index] && this.word[index] === letter) {
          this.successes[index] = letter
          success = true
        }
      }
    })

    this.updateStatus(success)
  }

  updateStatus (success) {
    if (this.wrongs === MAX_TRIES) {
      this.status = Status['LOST']
      return
    }

    if (this.successes.join('') === this.word) {
      this.start(this.level + 1)
      this.message = 'Congrats!! You cleared the level!'
      return
    }

    this.message = success ? 'Good guess!' : 'Bad luck, try again!'
  }

  statusScreen () {
    let statusscreen
    switch (this.state) {
      case Status['PLAYING']:
        statusscreen = this.gameScreen()
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

  gameScreen () {
    let drawLevel = () => {
      return `Level ${this.level + 1}`
    }
    let drawHangman = () => {
      let drawing = hangman.slice()
      for (let i = 0; i < MAX_TRIES - this.wrongs; i++) {
        let index = hangmanindexes[i]
        drawing[index[0]][index[1]] = ' '
      }
      return drawing.join('\n')
    }
    let drawWord = () => {
      return this.successes.join(' ')
    }

    return `${this.message}
    ${drawLevel()}
    ${drawHangman()}

    ${drawWord}
    `
  }

  get wrongs () {
    return this.guesses.length - this.successes.filter((letter) => letter !== '_').length
  }
}
