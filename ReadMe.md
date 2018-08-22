CMU RoboOrg RoboIC Scoring System
--------

This repository contains the code to run the scoring system and display for the RI Annual Build a Robot competition.

## How to Deploy
To deploy the server, the computer must have (Nodejs)[https://nodejs.org/en/] installed. After you clone the repository, you can follow the steps to run it
1. Edit `server.js` for *The teamnames*, *Number of Course* and *Difficulty level of the system*.
2. Install the dependencies through npm. `npm install `
3. Run the system with `nodejs server.js`

## How to Use it
Once the system is running, you can access the website at [http://localhost:3000](http://localhost:3000). The website will show you the score. To add score to the system, navgiate to [http://localhost:3000/add](http://localhost:3000/add).


## Changelog
- 22/08/2017: Added ReadMe.md and rebranded for 2018.
- 08/2017: Initial Construction of the System