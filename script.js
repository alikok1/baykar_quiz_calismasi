const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval;

document.addEventListener('DOMContentLoaded', () => fetchQuestions());

const fetchQuestions = async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        questions = data.slice(0, 10).map(post => ({
            question: post.title,
            options: [
                post.body.substring(0, 10),
                post.body.substring(10, 20),
                post.body.substring(20, 30),
                post.body.substring(30, 40)
            ],
            answer: post.body.substring(0, 10) // Örnek cevap
        }));
        startQuiz();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
};

const startQuiz = () => {
    currentQuestionIndex = 0;
    userAnswers = [];
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    showQuestion();
};

const showQuestion = () => {
    clearInterval(timerInterval);
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').innerText = currentQuestion.question;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const optionText = document.createElement('div');
        optionText.classList.add('option');
        optionText.innerText = `${String.fromCharCode(65 + index)}. ${option}`;
        optionText.dataset.answer = option;
        optionText.style.pointerEvents = "none";
        optionText.style.cursor = "default";

        optionText.addEventListener('click', () => handleAnswer(option));
        optionsContainer.appendChild(optionText);
    });

    let timer = 30;
    document.getElementById('timer').innerText = `Kalan Süre: ${timer} saniye`;

    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').innerText = `Kalan Süre: ${timer} saniye`;
        if (timer === 20) {
            optionsContainer.childNodes.forEach(option => {
                option.style.pointerEvents = "auto";
                option.style.cursor = "pointer";
            });
        }
        if (timer <= 0) {
            clearInterval(timerInterval);
            handleAnswer(null);
        }
    }, 1000);
};

const handleAnswer = (answer) => {
    userAnswers.push({
        question: questions[currentQuestionIndex].question,
        answer: answer
    });

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
};

const showResults = () => {
    clearInterval(timerInterval);
    document.getElementById('quiz-container').style.display = 'none';
    const resultTableBody = document.getElementById('result-table').querySelector('tbody');
    resultTableBody.innerHTML = '';

    userAnswers.forEach((userAnswer, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${index + 1}</td>
      <td>${userAnswer.question}</td>
      <td>${userAnswer.answer !== null ? userAnswer.answer : 'Cevap Verilmedi'}</td>
    `;
        resultTableBody.appendChild(row);
    });

    document.getElementById('result-container').style.display = 'block';
};

document.getElementById('restart').addEventListener('click', startQuiz);