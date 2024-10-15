const { createInterface } = require('readline');

const questionnaire = createInterface(process.stdin, process.stdout);

const questions = [
    'What is your name',
    'How are you',
    'How old are you',
    'What are your plans for this evening'
];

const answers = [];

const questionsPromices = questions.map(question => {
    return () => new Promise((res, _) => {
        questionnaire.question(`${question}\n`, (answer) => {
            answers.push(answer);
            res();
        });
    })
});

questionnaire.on('close', () => {
    console.log(answers);
});

const askQuestion = async () => {
    for (const question of questionsPromices) {
        await question();
    }

    questionnaire.close();
}

askQuestion();