// The Riddle class. Export it as the default export.
//
// Properties (received in the constructor):
// - id
// - name
// - taskDescription
// - correctAnswer
//
// Method:
// - ask(prompt)
//   - show the riddle (name and taskDescription) to the player
//   - ask the player for an answer using the `prompt` function that is passed in
//   - keep asking until the answer is correct
export default class Riddle {
    constructor(id, name, taskDescription, correctAnswer, difficulty, timeLimit, hint) {
        this.id = id
        this.name = name
        this.taskDescription = taskDescription
        this.correctAnswer = correctAnswer
        this.difficulty = difficulty
        this.timeLimit = timeLimit
        this.hint = hint
        this.penalty = false

    }
    ask(prompt) {

        console.log(`Riddle:${this.taskDescription}`)
        let userInput = ''

        userInput = prompt('what your answer?');



        while (userInput.trim().toLowerCase() !== this.correctAnswer.toLowerCase()) {
            if (userInput === 'hint') {
                console.log("add 10 seconds penalty")
                userInput = prompt(`${this.hint}`)
                this.penalty = true

            }
            userInput = prompt('the answer mistake!\n try again\n')
        }
        console.log('well done!corecct answer!')
    }
}