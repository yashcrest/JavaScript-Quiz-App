const question = document.querySelector('.question')
const option1 = document.querySelector('#option-1');
const option2 = document.querySelector('#option-2');
const option3 = document.querySelector('#option-3');
const option4 = document.querySelector('#option-4');
const beginBtn = document.querySelector('.begin-btn');
const nextBtn = document.querySelector('.next-btn');
const previousBtn = document.querySelector('.previous-btn');
const checkBtn = document.querySelector('.check-answer');
const restartBtn = document.querySelector('.restart-btn')
const error_msg = document.querySelector('.error-msg');
const beginQuiz = document.querySelector('.begin-quiz');
const quizArea = document.querySelector('.quiz-area');
const endArea = document.querySelector('.end-area');
const totalScore = document.querySelector('.total-score');

let randomOptions =[]
let currentQuestionIndex = 0;
let opts_input = Array.from(document.getElementsByName('options'));
let quizData = null;
let userScore = 0;

async function getQuizData(){
    let url = 'https://opentdb.com/api.php?amount=10&category=18&type=multiple';
    try{
        let data = await fetch(url);
        return await data.json();
    } catch (error) {
        console.log(error);
    }
}

async function startquiz(){
    beginQuiz.classList.add('hidden');
    quizArea.classList.remove('hidden');
    endArea.classList.add('hidden')
    quizData = await getQuizData();
    console.log(quizData);//getting the questions/answers array from API
    renderHTML();
}

function renderHTML(){
    //questions options
    let options = [quizData.results[currentQuestionIndex].incorrect_answers[0],
    quizData.results[currentQuestionIndex].incorrect_answers[1], 
    quizData.results[currentQuestionIndex].incorrect_answers[2],
    quizData.results[currentQuestionIndex].correct_answer,
];
    console.log('Options: ' + options);
    shuffleOptions(options);

    console.log('Randomized Options: '+ randomOptions)

    //assigning options to HTML element
    question.textContent = quizData.results[currentQuestionIndex].question;
    option1.nextElementSibling.textContent = randomOptions[0];
    option2.nextElementSibling.textContent = randomOptions[1];
    option3.nextElementSibling.textContent = randomOptions[2];
    option4.nextElementSibling.textContent = randomOptions[3];
}

function shuffleOptions(options){
    while (randomOptions.length < options.length){
        let randomItem = options[Math.floor(Math.random()* options.length)]
        if(!randomOptions.includes(randomItem)){
            randomOptions.push(randomItem)
        }
    }
}

async function checkAnswer(){
    //check if you can pass results directly when calling getQuizData
    let selectedOption = opts_input.find(opt => opt.checked);
    //condtion if no option is selected
    if(!selectedOption){
        console.log('no option selected');
        error_msg.classList.remove('hidden');
        setTimeout(() => {
            error_msg.classList.add('hidden');
        }, 1000);
        return;
    }
    let correctAnswer = quizData.results[currentQuestionIndex].correct_answer;
    console.log('Correct answer: ' + correctAnswer);
    if(selectedOption.nextElementSibling.textContent === correctAnswer){
        console.log('correct answer');
        userScore ++;
        console.log(`Current Score: ${userScore}`)
    } else {
        console.log('incorrect answer')
    }
}

function nextQuestion(){
    let selectedOption = opts_input.find(opt => opt.checked);
    //condtion if no option is selected
    if(!selectedOption){
        console.log('no option selected');
        error_msg.textContent = 'No skipping questions!'
        error_msg.classList.remove('hidden');
        setTimeout(() => {
            error_msg.textContent = 'Please select an option.'
            error_msg.classList.add('hidden');
        }, 1000);
        return;
    }
    currentQuestionIndex ++;
    randomOptions = [];
    clearSelectedOption();

    
    if(currentQuestionIndex < quizData.results.length){
        renderHTML();
    } else { //handle end of quiz
        quizArea.classList.add('hidden')
        endArea.classList.remove('hidden');
        console.log('end of quiz!')
        console.log(`Your total score is: ${userScore}`)
        totalScore.textContent = `You total score is ${userScore}/10`
    }
}

function previousQuestion(){
    if(currentQuestionIndex < 0){
        error_msg.textContent = 'This is the first question'
        error_msg.classList.remove('hidden');
        setTimeout(() => {
            error_msg.textContent = 'Please select an option.'
            error_msg.classList.add('hidden');
        }, 1000);
        return;
    }
    currentQuestionIndex --;
    randomOptions =[];
    clearSelectedOption();
    renderHTML();
}

function clearSelectedOption() {
    opts_input.forEach(opt => opt.checked = false);
}

nextBtn.addEventListener('click', nextQuestion);
previousBtn.addEventListener('click', previousQuestion);
checkBtn.addEventListener('click', checkAnswer);
beginBtn.addEventListener('click', startquiz);
restartBtn.addEventListener('click', startquiz);

//things left : handle end of quiz(display end msg, score)✅, display question number, show correct option when incorrect option is selected.
//restart button logic is not right.