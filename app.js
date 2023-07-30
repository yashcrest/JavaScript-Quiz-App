//importing questions array
import questions from './questions.js'
const questionNumber = document.querySelector('.question-number');
const totalQuestions = document.querySelector('.total-questions');
const question = document.querySelector('.question');
const opt_1 = document.querySelector('.opt-1');
const opt_2 = document.querySelector('.opt-2');
const opt_3 = document.querySelector('.opt-3');
const opt_4 = document.querySelector('.opt-4');
const btn_next = document.querySelector('.btn-next');
const btn_begin =document.querySelector('.btn-begin')
const begin_quiz = document.querySelector('.begin-quiz')
const question_area = document.querySelector('.question-area')
const error_msg = document.querySelector('.error-msg')
const quizArea = document.querySelector('.quiz-area');
const answerArea = document.querySelector('.answer-area');
const score = document.querySelector('#score');
const answerList = document.querySelector('#answer-list');

//Tracking questions number
let index = 0
let currentScore = 0;
let currentQuestionNumber = 1;
totalQuestions.textContent = questions.length;
const opt_inputs = Array.from(document.getElementsByName('option')); //by default getElementsByName gives a Node List which is not the same as Array. hence, the reason for converting the input to array using Array.from()
let questionsArray = [];

//generating random questions sequence
function randomQuestion(){
    while(questionsArray.length < questions.length){
        const random = questions[Math.floor(Math.random() * questions.length)]
        if(!questionsArray.includes(random)){
            questionsArray.push(random);
        }
    }
}

//function begin quiz
function beginQuiz(){
        begin_quiz.classList.add('hidden');
        //this is to show the quiz area
        question_area.classList.remove('hidden');
}


//display questions
function displayQuestion(index){
    randomQuestion()
    const currentQuestion = questionsArray[index];
    question.textContent = currentQuestion.question;
    opt_1.textContent = currentQuestion.options[0];
    opt_2.textContent = currentQuestion.options[1];
    opt_3.textContent = currentQuestion.options[2];
    opt_4.textContent = currentQuestion.options[3];
    questionNumber.textContent = currentQuestionNumber;
}

//check question
function checkAnswer(selectedOption){
    const correctAnswer = questionsArray[index].answer;
    if(selectedOption.nextElementSibling.textContent === correctAnswer){
        currentScore++
    }

}

//function to handle "next" button
function nextQuestion(){
        const selectedOption = opt_inputs.find(option => option.checked);
        //if no option is selected
        if(!selectedOption){
            error_msg.classList.remove('hidden');
            setTimeout(() => error_msg.classList.add('hidden'), 1000);
            return;
        }
        checkAnswer(selectedOption);
        selectedOption.checked = false;
        index ++;
        currentQuestionNumber ++;

        //check if there are more questions! 
        if(index < questions.length){
            displayQuestion(index);
            // console.log(currentQuestionIndex);
        } else {
            quizArea.classList.add('hidden');
            answerArea.classList.remove('hidden');
            score.textContent = `You scored: ${currentScore}/${questions.length}`;
            console.log(`You score is ${currentScore}/${questions.length}`)
        }
    
}

btn_next.addEventListener('click', nextQuestion);
btn_begin.addEventListener('click', beginQuiz);
displayQuestion(index);
