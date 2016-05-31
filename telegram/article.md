# Telegram bots, hangmen, nodejs and why life is beautiful

I recently rediscovered Telegram. I already knew the program, but since nobody seemed to use it, aside of me and other three freaks, ended desinstalling it. However, a new client I'm working with uses it as his main communication way so I came back.

And it was a really nice experience. Has a sweet interface, a nice design, lots of features and is incredible extensible.

So, today, I want hold your hand and go with you to the fantastic world of Telegram bot programming. Please, fasten your belt, this journey will be full of emotions.

## The idea

We will make a game. More specifically, a hangman game. We will use nodejs. Why? Because I'm the fucking driver, so I choose the music.

The bot will behave in this way:

- When receiving the /start command it will create a new game, show the current screen to user and wait for instructions.
- When receiving the /guess [wordorletter] command it will try to guess that word or letter and return the result to the user. If the game was solved, it will congrat the user. Otherwise, will tell the user what a loser he is.
- When receiving the /restart command it will restart the current game with a new word.

Pretty simple, as you can see. 

## First thing's first

The first step is to create the bot. 

One of the reasons why Telegram is so great, is because they follow a very simple principle: [they eat their own dog food](https://en.wikipedia.org/wiki/Eating_your_own_dog_food). A good example, is that you create a Telegram using a Telegram bot: BotFather. 

Start a chat with @BotFather and type /newbot. It will ask you for a new name for the bot (the name that will be displayed in the chat) and username. The username has to be unique and end in bot. 

After creating it, BotFather will give you a Token string. Save it for later, we will need when we start coding.

Once you do that, you may add a description or picture using the commands /setdescription and /setuserpic. There's a good set of other options, I recommend you experiment with it.

The next step is to set up the commands available. Type /setcommands and when the BotFather asks you about what commands to allow, send this message:

'''
guess - Guess a word or letter to the hangman
restart - Restart the game
'''

Why isn't there the start command? Because that's a [global command](https://core.telegram.org/bots#global-commands).

## The game begins


