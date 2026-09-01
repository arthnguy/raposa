# Raposa

A browser extension that periodically quizzes you on language flashcards. Made for consistent and lowkey practice.

## Features

- Create decks and cards to practice with
- Adjust timing for how long you get to translate and how often a challenge appears
- Enable/disable timer when you don't want to be interrupted when busy
- Display difference between your answer and the back of the card

(note that if you are using an adblocker, the challenges may not pop up as of right now)

![Options Navigation](/src/assets/options-navigation.gif)
![Timer Ticking](/src/assets/timer-ticking.gif)
![Answer Challenge](/src/assets/answer-challenge.gif)

## Installation (non-Chrome Store)
1. Clone and install dependencies

```bash
git clone https://github.com/arthnguy/raposa
cd raposa
npm install 
```

2. Build it

```bash
npm run build
```

3. Load into Chrome
    - Go to chrome://extensions
    - Toggle Developer mode on (top right)
    - Click "Load unpacked" (top left)
    - Select the build output folder from step 2

## Tech stack

- WXT + React (TypeScript)
- Tailwind
- Chrome API (storage, alarms, tab)

## Future plans

- More editing options in settings such as moving cards, importing Anki decks, and renaming the deck