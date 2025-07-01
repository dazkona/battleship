# SIMPLE BATTLESHIP GAME

The key ideas behind this project are:

- Creating a browser game without using a dedicated game engine or framework, but instead leveraging web frameworks like Next.js and React.
- Implementing a professional game loop in React, a fundamental requirement for any game.
- Introducing a professional game messaging system to React, essential for a production-ready game.

You can play online at: :video_game: https://battleship-ashy-nu.vercel.app/

## POINTS TO ACHIEVE

- Fully responsive and mobile-compatible.
- Rapid development (completed in ~20 hours). **(\*)**
- Scalable and vastly improvable using existing structures.
- Some design in the minimum time available, and some animation or effect.
- Correct game logic.
- Clean code and clean architecture principles.
- Automated testing (I know this version covers about 5%, but I wanted to have all the tests working now and wait for the next version to achieve 100% coverage.).

### (\*) Using AI during the development

To maximize development speed, I leveraged AI tools (DeepSeek and Copilot) for:

- Writing test case scenarios.
- Creating complex CSS elements, for graphics and specific components.
- Help me define the Github Actions workflow.
- Refining code comments for better clarity.
- Write this document, ha ha ha :-P

## NEXT ELEMENTS I WANT TO WORK IN TO IMPROVE

- Add i18n/internationalization support.
- Improve the visual and the effects.
- Implement two-player turn-based gameplay.
- A component to show the list of attacks done, like on Chess games.
- Scoreboard stored in localstorage.

## To execute the project

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## To execute the Tests

Component testing using React Testing Library

```bash
npm run test
```

E2E testing using Cypress

```bash
# Launch the dev server
npm run dev
# Execute cypress tests when server is running
npx cypress run
```
