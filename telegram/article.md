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

  isProcessed (id) {
    return this.processed_messages.has(id)
  }
}

Hangman.init(() => {
  let messageManager = new MessageManager()
  let hangman

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

Now, let's fill the start command.

```javascript
// Matches /start
bot.onText(/\/start/, function (msg, match) {
  messageManager.process(msg)

  hangman = new Hangman()
  let chatId = msg.chat.id
  bot.sendMessage(chatId, hangman.statusScreen())

  console.log('start', msg)
})
```

Pretty easy to understand. We create a new hangman game, then we get the chat id from the message and send the status screen to the user.

### The guess command

Let's go to fill the guess command.

```javascript
// Matches /guess [try]
bot.onText(/\/guess ([a-zA-Z]+)/, function (msg, match) {
  messageManager.process(msg)

  let guess = match[1]
  hangman.guess(guess)
  let chatId = msg.chat.id
  bot.sendMessage(chatId, hangman.statusScreen())

  console.log('guess', guess, msg)
})
```

Again, self explanatory code. We pass our guess to hangman and send the status screen to the user.

### The restart command

And finally, let's write the restart command.

```javascript
// Matches /restart
bot.onText(/\/restart/, function (msg, match) {
  messageManager.process(msg)

  hangman.start(0)
  let chatId = msg.chat.id
  bot.sendMessage(chatId, hangman.statusScreen())

  console.log('restart', msg)
})
```

I don't even think I have to explain that at this point!

### Handling multiple games at once.

As you may notice already, this will work very nicely if and only if our have one connection per game. In the case two different users at the same tries to play, they would be receiving the results of the same game and trying at the same time to resolve that game with very confusing results. 

So we have now to add some kind of way to handle that case. Let's look at how the code would look!

```javascript
Hangman.init(() => {
  let messageManager = new MessageManager()
  let hangmanGames = new Map()

  // Matches /start
  bot.onText(/\/start/, function (msg, match) {
    messageManager.process(msg)

    let hangman = new Hangman()
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
      return bot.sendMessage(chatId, "You have to start a game to play! Please, use /start command.")
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
      return bot.sendMessage(chatId, "You have to start a game to play! Please, use /start command.")
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
```

As you can see, we created a Map object in which we store all the chats by chat id. We also handle the case of people trying to play before starting to play.

## So... In resume...

So, in resume, Telegram rules, you should use it and drop WhatsApp right now and writing bots for the platform is actually stupidly easy. 

In some weeks, I promise an article explaining how to write a program to defeat our Telegram bot using very simple statistics.

Feel free to share with Telegram bots and check the [Code used in the article] in github to see the full example!

P.D.: You also play with the bot by writing to @TocTocHangmanBot!

## Code links

[Telegram Bot API]: https://github.com/yagop/node-telegram-bot-api
[Code used in the article]: https://github.com/AgustinCB/toctoctech/tree/master/telegram

## References

[1]: https://en.wikipedia.org/wiki/Eating_your_own_dog_food
[2]: https://core.telegram.org/bots#global-commands
[3]: https://core.telegram.org/bots/api#setwebhook
