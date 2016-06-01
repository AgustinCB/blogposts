# Telegram bots, hangmen, nodejs and why life is beautiful

I recently rediscovered Telegram. I already knew the program, but since nobody seemed to use it, aside of me and other three freaks, ended desinstalling it. However, a new client I'm working with uses it as his main communication way so I came back.

And it was a really nice experience. Has a sweet interface, a nice design, lots of features and is incredible extensible.

So, today, I want hold your hand and go with you to the fantastic world of Telegram bot programming. Please, fasten your belt, this journey will be full of emotions.

## The idea

We will make a game. More specifically, a hangman game. We will use nodejs. Why? Because I'm the fucking driver, so I choose the music. And also because there's a very nice package for developing Telegram bots.

The bot will behave in this way:

- When receiving the /start command it will create a new game, show the current screen to user and wait for instructions.
- When receiving the /guess [wordorletter] command it will try to guess that word or letter and return the result to the user. If the game was solved, it will congrat the user. Otherwise, will tell the user what a loser he is.
- When receiving the /restart command it will restart the current game with a new word.

Pretty simple, as you can see. 

## First thing's first

The first step is to create the bot. 

One of the reasons why Telegram is so great, is because they follow a very simple principle: [they eat their own dog food][1]. A good example, is that you create a Telegram using a Telegram bot: BotFather. 

Start a chat with @BotFather and type /newbot. It will ask you for a new name for the bot (the name that will be displayed in the chat) and username. The username has to be unique and end in bot. 

After creating it, BotFather will give you a Token string. Save it for later, we will need when we start coding.

Once you do that, you may add a description or picture using the commands /setdescription and /setuserpic. There's a good set of other options, I recommend you experiment with it.

The next step is to set up the commands available. Type /setcommands and when the BotFather asks you about what commands to allow, send this message:

```
guess - Guess a word or letter to the hangman
restart - Restart the game
```

Why isn't there the start command? Because that's a [global command][2].

## The game begins

So we will start now developing a bot using Telegram.

The basic idea is the following:

1.- Create a web server with an unique endpoint.
2.- Register that endpoint as a webhook for your bot using [setWebhook][3].
3.- That endpoint will receive an event every time the user intereacts with the app, you should handle that event according what we discussed before.

To handle all this boring stuff, we will use following framework: [Telegram Bot API]. That API will create the server, assign the endpoint and handle the low level message retrieving trasks. 

At this point, we can start coding:

```javascript
'use strict'

import config from '../config.json'
import * as Hangman from './hangman'
import TelegramBot from 'node-telegram-bot-api'

let bot = new TelegramBot(config.TOKEN, { polling: true })
```

Let's understand that simple code. config is a json file with a value TOKEN in which we will store the token that BotFather gave us. Hangman is a class that creates and handles Hangman games ([see the repo][Code used in the article]). Finally, the last line, we create the object that will handle the messages.

The next step is the use of the onText method of the Telegram API ([see the repo for docs][Telegram Bot API]).

```javascript
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
```

As you can see, we are defining a class MessageManager to handle the messages that were already processed and to have a history of messages. We will have to change that a bit later, because with multiple users running at the same time it scalate fast and consume much more memory than needed, but for the moment it's works to understand the code.

The first onText, will match any command starting with "/start". The second one, with /guess and an string with only letters. The third one, will handle the /restart command and finally, the last one, to handle all other situations and messages that were already processed by any of the previous event handlers.

### The start command

## Code links

[Telegram Bot API]: https://github.com/yagop/node-telegram-bot-api
[Code used in the article]: https://github.com/yagop/node-telegram-bot-api

## References

[1]: https://en.wikipedia.org/wiki/Eating_your_own_dog_food
[2]: https://core.telegram.org/bots#global-commands
[3]: https://core.telegram.org/bots/api#setwebhook
