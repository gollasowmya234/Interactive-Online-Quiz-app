// --- QUIZ DATA (12 Questions) ---
const quizData = [
    {
        question: "What chemical element has the atomic number 6?",
        options: ["Oxygen", "Carbon", "Nitrogen", "Hydrogen"],
        answer: "Carbon"
    },
    {
        question: "Which language is primarily used for styling web pages?",
        options: ["Python", "SQL", "CSS", "JavaScript"],
        answer: "CSS"
    },
    {
        question: "The speed of light in a vacuum is approximately:",
        options: ["300 km/s", "300,000 km/s", "30,000 km/s", "3,000 km/s"],
        answer: "300,000 km/s"
    },
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Management Links", "Hyperlink and Text Markup"],
        answer: "Hyper Text Markup Language"
    },
    {
        question: "In which year did the Titanic sink?",
        options: ["1912", "1905", "1923", "1918"],
        answer: "1912"
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Mars", "Saturn", "Jupiter", "Uranus"],
        answer: "Jupiter"
    },
    {
        question: "Who painted the famous artwork, the Mona Lisa?",
        options: ["Vincent van Gogh", "Claude Monet", "Pablo Picasso", "Leonardo da Vinci"],
        answer: "Leonardo da Vinci"
    },
    {
        question: "What is the capital city of Japan?",
        options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
        answer: "Tokyo"
    },
    {
        question: "Which programming language is commonly used for data science and machine learning?",
        options: ["C++", "Python", "Java", "Ruby"],
        answer: "Python"
    },
    {
        question: "The process by which plants make their own food is called?",
        options: ["Respiration", "Transpiration", "Photosynthesis", "Germination"],
        answer: "Photosynthesis"
    },
    {
        question: "Which is the smallest continent by land area?",
        options: ["Europe", "Antarctica", "Australia", "South America"],
        answer: "Australia"
    },
    {
        question: "What musical term means to play 'very fast'?",
        options: ["Andante", "Allegro", "Presto", "Largo"],
        answer: "Presto"
    }
];

// --- GLOBAL STATE ---
let currentQuestionIndex = 0;
let score = 0;
let timerSeconds = 120; // Total time for the quiz is 120 seconds (2 minutes)
let timerInterval = null;
let quizStartTime = null;
let isAnswerLocked = false;

// --- DOM REFERENCES ---
const startScreen = document.getElementById('start-screen');
const questionSection = document.getElementById('question-section');
const resultsScreen = document.getElementById('results-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const feedbackMessage = document.getElementById('feedback-message');
const nextButton = document.getElementById('next-button');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// --- EVENT LISTENERS ---
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', initQuiz);

// --- FUNCTIONS ---

/**
 * Initializes the quiz state and shows the start screen.
 */
function initQuiz() {
    // Reset state
    currentQuestionIndex = 0;
    score = 0;
    timerSeconds = 120; // Reset to 120 seconds
    isAnswerLocked = false;
    quizStartTime = null;
    if (timerInterval) clearInterval(timerInterval);

    // Update UI
    scoreDisplay.textContent = 'Score: 0';
    timerDisplay.textContent = 'Time: 02:00'; // Updated initial time display (120s)
    
    // Show start screen
    startScreen.classList.remove('hidden');
    questionSection.classList.add('hidden');
    resultsScreen.classList.add('hidden');
}

/**
 * Starts the quiz: hides start screen, shows question section, and starts the timer.
 */
function startQuiz() {
    startScreen.classList.add('hidden');
    questionSection.classList.remove('hidden');
    quizStartTime = Date.now();
    startTimer();
    displayQuestion();
}

/**
 * Starts and manages the countdown timer.
 */
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    const updateTimer = () => {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        const timeString = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerDisplay.textContent = timeString;

        // Visual alert when time is low
        if (timerSeconds <= 10) {
            timerDisplay.classList.add('text-red-700', 'animate-pulse');
        } else {
            timerDisplay.classList.remove('text-red-700', 'animate-pulse');
        }

        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = 'Time: 00:00 - TIME UP!';
            showResults(true); // Show results due to timeout
        } else {
            timerSeconds--;
        }
    };

    updateTimer(); // Initial call to show the starting time
    timerInterval = setInterval(updateTimer, 1000);
}

/**
 * Renders the current question and its options to the DOM.
 */
function displayQuestion() {
    // Reset question UI elements for the new question
    optionsContainer.innerHTML = '';
    feedbackMessage.classList.add('hidden');
    nextButton.disabled = true;
    nextButton.classList.add('opacity-50', 'cursor-not-allowed');
    nextButton.classList.remove('hover:bg-green-600');
    isAnswerLocked = false;

    // Check if the quiz is over
    if (currentQuestionIndex >= quizData.length) {
        showResults(false);
        return;
    }

    const currentQ = quizData[currentQuestionIndex];
    questionText.textContent = `Q${currentQuestionIndex + 1}: ${currentQ.question}`;

    // Create buttons for each option
    currentQ.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'w-full text-left p-4 bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium rounded-lg shadow-sm hover:bg-indigo-100 transition duration-200 focus:outline-none';
        button.onclick = () => selectAnswer(button, option, currentQ.answer);
        optionsContainer.appendChild(button);
    });
}

/**
 * Handles user selecting an answer, provides feedback, and updates score.
 * @param {HTMLElement} selectedButton - The button element clicked by the user.
 * @param {string} selectedAnswer - The text of the selected option.
 * @param {string} correctAnswer - The correct answer for the question.
 */
function selectAnswer(selectedButton, selectedAnswer, correctAnswer) {
    if (isAnswerLocked) return;

    isAnswerLocked = true;
    let isCorrect = selectedAnswer === correctAnswer;

    // 1. Provide immediate visual feedback
    const allButtons = optionsContainer.querySelectorAll('button');
    allButtons.forEach(button => {
        button.disabled = true; // Disable all options after first click
        button.classList.remove('hover:bg-indigo-100'); 

        if (button.textContent === correctAnswer) {
            // Highlight the correct answer in green
            button.classList.remove('bg-indigo-50', 'border-indigo-200', 'text-indigo-800');
            button.classList.add('bg-green-100', 'border-green-400', 'text-green-800', 'ring-2', 'ring-green-500');
        } else if (button === selectedButton && !isCorrect) {
            // Highlight the user's wrong answer in red
            button.classList.remove('bg-indigo-50', 'border-indigo-200', 'text-indigo-800');
            button.classList.add('bg-red-100', 'border-red-400', 'text-red-800', 'ring-2', 'ring-red-500');
        }
    });

    // 2. Update score and display text feedback
    if (isCorrect) {
        score++;
        feedbackMessage.textContent = 'Correct! Great job.';
        feedbackMessage.classList.remove('text-red-600');
        feedbackMessage.classList.add('text-green-600');
    } else {
        feedbackMessage.textContent = 'Incorrect. The correct answer is highlighted.';
        feedbackMessage.classList.remove('text-green-600');
        feedbackMessage.classList.add('text-red-600');
    }
    feedbackMessage.classList.remove('hidden');
    scoreDisplay.textContent = `Score: ${score}`;

    // 3. Enable the 'Next' button
    nextButton.disabled = false;
    nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
    nextButton.classList.add('hover:bg-green-600');
}

/**
 * Advances to the next question or shows results if the quiz is over.
 */
function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

/**
 * Displays the final score and time taken.
 * @param {boolean} timedOut - True if the quiz ended because the timer ran out.
 */
function showResults(timedOut) {
    clearInterval(timerInterval);
    
    // Calculate elapsed time
    const timeElapsed = Math.round((Date.now() - quizStartTime) / 1000);

    // Hide question section and show results
    questionSection.classList.add('hidden');
    startScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');

    const finalScoreElement = document.getElementById('final-score');
    const timeTakenElement = document.getElementById('time-taken');

    finalScoreElement.textContent = `You scored ${score} out of ${quizData.length} questions!`;
    
    if (timedOut) {
        timeTakenElement.textContent = `Time ran out! You answered ${currentQuestionIndex} questions.`;
    } else {
        timeTakenElement.textContent = `You completed the quiz in ${timeElapsed} seconds.`;
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initQuiz);
