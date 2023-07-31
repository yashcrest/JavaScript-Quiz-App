const question = document.querySelector('.question')
const option1 = document.querySelector('#option-1');
const option2 = document.querySelector('#option-2');
const option3 = document.querySelector('#option-3');
const option4 = document.querySelector('#option-4');
const beginBtn = document.querySelector('.begin-btn');
const selectCategory = document.querySelector('#select-category');
const questionNumber = document.querySelector('.question-number');
const totalQuestions = document.querySelector('.total-questions');
const nextBtn = document.querySelector('.next-btn');
const previousBtn = document.querySelector('.previous-btn');
const restartBtn = document.querySelector('.restart-btn')
const error_msg = document.querySelector('.error-msg');
const display_answer = document.querySelector('.display-answer');
const beginQuiz = document.querySelector('.begin-quiz');
const quizArea = document.querySelector('.quiz-area');
const endArea = document.querySelector('.end-area');
const totalScore = document.querySelector('.total-score');

let randomOptions =[]
let currentQuestionIndex = 0;
let opts_input = Array.from(document.getElementsByName('options'));
let quizData = null;
let userScore = 0;
let currentQuestionNumber = 1
let category_id = 18; //default category --> Computer Science
let quizCategory = null;

async function getCategory(){
    let url = 'https://opentdb.com/api_category.php'
    try {
        let category = await fetch(url);
        return await category.json();
    } catch(error){
        console.log(error);
    }
}

async function displayCategory(){
    quizCategory = await getCategory();
    console.log(quizCategory);
    let triviaCategories = quizCategory.trivia_categories;
    //displaying cateogry
    triviaCategories.forEach(category => {
        let option = document.createElement('option')
        option.setAttribute('value', `${category.id}`);
        option.textContent = category.name;
        selectCategory.appendChild(option);
    })
}

function updateCategoryID() {
    category_id = selectCategory.value;
}


async function getQuizData(){
    let url = `https://opentdb.com/api.php?amount=10&category=${category_id}&type=multiple`;
    try{
        let data = await fetch(url);
        return await data.json();
    } catch (error) {
        console.log(error);
    }
}

async function startquiz(){
    updateCategoryID();
    beginQuiz.classList.add('hidden');
    quizArea.classList.remove('hidden');
    endArea.classList.add('hidden')
    quizData = await getQuizData();
    console.log(quizData);//getting the questions/answers array from API
    renderHTML();
}

function renderHTML(){
    //remove correct-answer class from previous selected option
    opts_input.forEach(opt => opt.nextElementSibling.classList.remove('correct-answer'));
    
    //questions options
    let options = [decodeHTML(quizData.results[currentQuestionIndex].incorrect_answers[0]),
    decodeHTML(quizData.results[currentQuestionIndex].incorrect_answers[1]), 
    decodeHTML(quizData.results[currentQuestionIndex].incorrect_answers[2]),
    decodeHTML(quizData.results[currentQuestionIndex].correct_answer),
];
    // console.log('Options: ' + options);
    shuffleOptions(options);

    // console.log('Randomized Options: '+ randomOptions)

    //decoding HTML encoding
    const decodeQuestion = decodeHTML(quizData.results[currentQuestionIndex].question);
    question.textContent = decodeQuestion;

    //assigning options to HTML element
    questionNumber.textContent = currentQuestionNumber;
    totalQuestions.textContent = quizData.results.length;
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

function nextQuestion(){
    let selectedOption = opts_input.find(opt => opt.checked);
    let correctAnswer = quizData.results[currentQuestionIndex].correct_answer;

     //condtion if no option is selected
     if(!selectedOption){
        console.log('no option selected');
        error_msg.textContent = 'No skipping questions!'
        error_msg.classList.remove('hidden');
        setTimeout(() => {
            error_msg.classList.add('hidden');
        }, 1000);
        return;
    }

    //check answer
    if(selectedOption.nextElementSibling.textContent === correctAnswer){
        userScore ++;
        console.log(`Score : ${userScore}`);
        selectedOption.nextElementSibling.classList.add('correct-answer')
    } else{
        console.log('incorrect');
        console.log('Correct answer: ' + correctAnswer);
        console.log(`Score: ${userScore}`);
        display_answer.textContent = correctAnswer;
        display_answer.classList.remove('hidden');
        setTimeout(() => {
            display_answer.classList.add('hidden');
            renderHTML()
            
        },1000);
    }

    setTimeout(() => {
        currentQuestionNumber ++;
        currentQuestionIndex ++;
        randomOptions = [];
        clearSelectedOption();
        if(currentQuestionIndex < quizData.results.length){
            renderHTML();
        } else{ // to handle end of quiz
            quizArea.classList.add('hidden')
            endArea.classList.remove('hidden');
            console.log('end of quiz!')
            console.log(`Your total score is: ${userScore}`)
            totalScore.textContent = `Score: ${userScore} out of ${quizData.results.length}`
        }
    }, 1000);
}


function previousQuestion(){
    if(currentQuestionIndex <= 0){
        error_msg.textContent = 'This is the first question'
        error_msg.classList.remove('hidden');
        setTimeout(() => {
            error_msg.textContent = 'Please select an option.'
            error_msg.classList.add('hidden');
        }, 1000);
        return;
    }
    currentQuestionNumber --;
    currentQuestionIndex --;
    randomOptions =[];
    clearSelectedOption();
    renderHTML();
}

function clearSelectedOption() {
    opts_input.forEach(opt => opt.checked = false);
}

//for decomding HTML-encoding 
function decodeHTML(html){
    let txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

nextBtn.addEventListener('click', nextQuestion);
previousBtn.addEventListener('click', previousQuestion);
beginBtn.addEventListener('click', startquiz);
restartBtn.addEventListener('click', startquiz); // the logic is still not right
displayCategory();

