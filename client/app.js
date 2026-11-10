// Entry point of the game. Run it with: node app.js
//
// This file should:
// 1. Import PromptSync (from 'prompt-sync') and create the `prompt` function.
// 2. Import the Riddle class, the Player class, and the array of all riddles (from riddles/index.js).
// 3. Show a welcome message and ask the player for their name, then create a Player object.
// 4. Loop over all riddles. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method
//    - save the end time (Date.now())
//    - save the time using player.recordTime()
// 5. After the loop, call player.showStats() to show total time and average time per riddle.
import PromptSync from 'prompt-sync';

import Player from './classes/Player.js';
import Riddle from './classes/Riddle.js';
// import{getAllRiddles,createRiddle,updateRiddle,deleteRiddle} from './api/riddlesApi.js'
import { findPlayerByName, createPlayer, updatePlayer, getAllPlayers } from './api/playersApi.js';


const prompt = PromptSync();

console.log('welcome to Riddle games!')
let inputName = prompt(`wath's is your name?`)

let existingPlayer = await findPlayerByName(inputName);

if (existingPlayer) {
    if (existingPlayer.lowestTime !== null && existingPlayer.lowestTime !== undefined) {
        console.log(`Hi ${existingPlayer.name}! Your previous lowest time was ${existingPlayer.lowestTime} seconds.`);
    } else {
        console.log(`Hi ${existingPlayer.name}! Welcome to the game.`);
    }
} else {

    await createPlayer(inputName);
}

console.log("Time to Beat");

const player1 = new Player(inputName)

let choice = '';


while (choice !== '0') {
    console.log('\n--- Main Menu ---');
    console.log('What do you want to do?');
    console.log('1. Play the game');
    console.log('2. Create a new riddle');
    console.log('3. Read all riddles');
    console.log('4. Update an existing riddle');
    console.log('5. Delete a riddle');
    console.log('6. View leaderboard');
    console.log('0. Exit');

    choice = prompt('Enter your choice (0-6): ').trim();

    switch (choice) {
        case '1':
            console.log('\n--> Starting the game...');
            break;
        case '2':
            console.log('\n--> Creating a new riddle...');
            createRiddle();
            break;
        case '3':
            console.log('\n--> Reading all riddles...');
            getAllRiddles();
            break;
        case '4':
            console.log('\n--> Updating an existing riddle...');
            updateRiddle();
            break;
        case '5':
            console.log('\n--> Deleting a riddle...');
            deleteRiddle();
            break;
        case '6':
            console.log('\n--> Viewing leaderboard...');
            const allPlayers = await getAllPlayers();
            const finishedPlayers = allPlayers
                .filter(p => p.lowestTime !== null && p.lowestTime !== undefined)
                .sort((a, b) => a.lowestTime - b.lowestTime);

            console.log('\n🏆 Leaderboard:');
            if (finishedPlayers.length === 0) {
                console.log('No players on the leaderboard yet.');
            } else {
                finishedPlayers.forEach((p, index) => {
                    console.log(`${index + 1}. ${p.name} - ${p.lowestTime} seconds`);
                });
            }
            break;
        case '0':
            console.log('\nExiting... Goodbye!');
            break;
        default:
            console.log('\nInvalid choice, please enter a number between 0 and 6.');
    }
}


const level = prompt('Choose difficulty:easy/medium/hard')

getAllRiddles().forEach(riddle => {


    if (riddle.difficulty === level) {

        const newRiddle = new Riddle(riddle.id, riddle.name, riddle.taskDescription, riddle.correctAnswer, riddle.difficulty, riddle.timeLimit, riddle.hint)
        let startTime = Date.now();
        newRiddle.ask(prompt);
        let endTime = Date.now();
        if ((endTime - startTime) / 1000 > riddle.timeLimit) {
            riddle.penalty ? player1.recordTime(startTime / 1000, (endTime / 1000) + 15) : player1.recordTime(startTime / 1000, (endTime / 1000) + 5)
            console.log("Too slow! 5 seconds penalty applied")
        }
        else
            riddle.penalty ? player1.recordTime(startTime / 1000, (endTime / 1000) + 10) : player1.recordTime(startTime / 1000, endTime / 1000)

    }


});
for (let i = AllRiddles.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [AllRiddles[i], AllRiddles[j]] = [AllRiddles[j], AllRiddles[i]];
}
console.log(AllRiddles)
player1.showStats();

const finalTime = Math.round(player1.totalTime || 0);

console.log(`Great job, ${inputName}!`);
console.log(`Your time: ${finalTime} seconds`);

if (existingPlayer) {
    if (existingPlayer.lowestTime === null || finalTime < existingPlayer.lowestTime) {
        existingPlayer.lowestTime = finalTime;
        await updatePlayer(existingPlayer);
        console.log("New record! Time updated.");
    }
}


const API_URL = 'http://localhost:3000/riddles';

async function getAllRiddles() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`error server: ${response.status}`);

        const riddles = await response.json();
        console.log('\n--- All Riddles ---');
        console.table(riddles);
        return riddles;
    } catch (error) {
        console.error('failed on load riddles', error.message);
    }
}

async function createRiddle() {
    try {
        console.log('\n--- Create a New Riddle ---');
        const name = prompt('Enter riddle name: ');
        const description = prompt('Enter description: ');
        const correctAnswer = prompt('Enter correct answer: ');
        const difficulty = prompt('Enter difficulty:');
        const timeLimit = prompt('enter timeLimit:')
        const hint = prompt('enter hint')

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, correctAnswer, difficulty, timeLimit, hint })
        });

        if (!response.ok) throw new Error(`error server ${response.status}`);

        const newRiddle = await response.json();
        console.log('\nRiddle saved!');
        return newRiddle;
    } catch (error) {
        console.error('failed on create riddle', error.message);
    }
}

async function updateRiddle() {
    try {
        console.log('\n--- Update an Existing Riddle ---');
        const id = prompt('Enter riddle ID to update: ');

        console.log('Enter new details (leave blank or fill as needed):');
        const name = prompt('Enter new riddle name: ');
        const description = prompt('Enter new description: ');
        const correctAnswer = prompt('Enter new correct answer: ');
        const difficulty = prompt('Enter new difficulty:');
        const timeLimit = prompt('enter new timeLimit:')
        const hint = prompt('enter new hint')

        const updatedData = {};
        if (name) updatedData.name = name;
        if (description) updatedData.description = description;
        if (correctAnswer) updatedData.correctAnswer = correctAnswer;
        if (difficulty) updatedData.difficulty = difficulty;
        if (timeLimit) updatedData.timeLimit = timeLimit;
        if (hint) updatedData.hint = hint

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) throw new Error(`error server ${response.status}`);

        const result = await response.json();
        console.log('\nRiddle updated successfully!');
        return result;
    } catch (error) {
        console.error('failed on update riddle', error.message);
    }
}

async function deleteRiddle() {
    try {
        console.log('\n--- Delete a Riddle ---');
        const id = prompt('Enter riddle ID to delete: ');

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error(`error server ${response.status}`);

        console.log('\nRiddle deleted successfully!');
    } catch (error) {
        console.error('failed on delete riddle', error.message);
    }
}



