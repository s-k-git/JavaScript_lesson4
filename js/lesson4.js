const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

class Quiz {
  constructor(quizData) {
    this._quizzes = quizData.results;
    this._correctAnswersNum = 0;
  }
  getQuizCategory(index) {
    return this._quizzes[index - 1].category;
  }
  getQuizDifficulty(index) {
    return this._quizzes[index - 1].difficulty;
  }
  getQuizQuestion(index) {
    return this._quizzes[index - 1].question;
  }
  getIncorrectAnswer(index) {
    return this._quizzes[index - 1].incorrect_answers;
  }
  getcorrectAnswer(index) {
    return this._quizzes[index - 1].correct_answer;
  }
  countCorrectAnswers(index, answer) {
    const correctAnswer = this._quizzes[index - 1].correct_answer;
    if (answer === correctAnswer) {
      return this._correctAnswersNum++;
    }
  }
  getCorrectAnswersNum() {
    return this._correctAnswersNum;
  }
};

const titleElement = document.getElementById('title');
const questionElement = document.getElementById('question');
const startButton = document.getElementById('start-button');
const genreElement = document.getElementById('genre');
const difficultyElement = document.getElementById('difficulty');

startButton.addEventListener('click', () => {
  startButton.style.display = "none";
  fetchQuizData(1);
});

const fetchQuizData = async (index) => {
  titleElement.textContent = '取得中';
  questionElement.textContent = '少々お待ち下さい';

  try {
    const response = await fetch(API_URL);
    const quizData = await response.json();
    const quizInstance = new Quiz(quizData);
    setNextQuiz(quizInstance, index);
  } catch (err) {
    titleElement.textContent = "取得失敗";
    questionElement.style.display = "none";
    console.log(err);
  }
};

const setNextQuiz = (quizInstance, index) => {
  makeQuiz(quizInstance, index);
};

const makeQuiz = (quizInstance, index) => {
  if (index <= quizInstance._quizzes.length) {
    let randomNo = Math.floor(Math.random() * 4);
    let no0 = `choices${randomNo % 4}`;
    let no1 = `choices${(randomNo + 1) % 4}`;
    let no2 = `choices${(randomNo + 2) % 4}`;
    let no3 = `choices${(randomNo + 3) % 4}`;

    const choices0Element = document.getElementById(no0);
    const choices1Element = document.getElementById(no1);
    const choices2Element = document.getElementById(no2);
    const choices3Element = document.getElementById(no3);

    titleElement.innerHTML = `問題 ${index}`;
    genreElement.innerHTML = `【ジャンル】 ${quizInstance.getQuizCategory(index)}`;
    difficultyElement.innerHTML = `【難易度】 ${quizInstance.getQuizDifficulty(index)}`;
    questionElement.innerHTML = `【クイズ】${quizInstance.getQuizQuestion(index)}`;

    const button0Element = document.createElement('button');
    button0Element.innerHTML = quizInstance.getcorrectAnswer(index);
    choices0Element.appendChild(button0Element);
    button0Element.addEventListener('click', () => {
      const answer = quizInstance.getcorrectAnswer(index);
      quizInstance.countCorrectAnswers(index, answer);
      index++;
      choices0Element.removeChild(choices0Element.firstChild);
      choices1Element.removeChild(choices1Element.firstChild);
      choices2Element.removeChild(choices2Element.firstChild);
      choices3Element.removeChild(choices3Element.firstChild);
      setNextQuiz(quizInstance, index);
    });

    const button1Element = document.createElement('button');
    button1Element.innerHTML = quizInstance.getIncorrectAnswer(index)[0];
    choices1Element.appendChild(button1Element);
    button1Element.addEventListener('click', () => {
      index++;
      choices0Element.removeChild(choices0Element.firstChild);
      choices1Element.removeChild(choices1Element.firstChild);
      choices2Element.removeChild(choices2Element.firstChild);
      choices3Element.removeChild(choices3Element.firstChild);
      setNextQuiz(quizInstance, index);
    });

    const button2Element = document.createElement('button');
    button2Element.innerHTML = quizInstance.getIncorrectAnswer(index)[1];
    choices2Element.appendChild(button2Element);
    button2Element.addEventListener('click', () => {
      index++;
      choices0Element.removeChild(choices0Element.firstChild);
      choices1Element.removeChild(choices1Element.firstChild);
      choices2Element.removeChild(choices2Element.firstChild);
      choices3Element.removeChild(choices3Element.firstChild);
      setNextQuiz(quizInstance, index);
    });

    const button3Element = document.createElement('button');
    button3Element.innerHTML = quizInstance.getIncorrectAnswer(index)[2];
    choices3Element.appendChild(button3Element);
    button3Element.addEventListener('click', () => {
      index++;
      choices0Element.removeChild(choices0Element.firstChild);
      choices1Element.removeChild(choices1Element.firstChild);
      choices2Element.removeChild(choices2Element.firstChild);
      choices3Element.removeChild(choices3Element.firstChild);
      setNextQuiz(quizInstance, index);
    });
  } else {
    finish(quizInstance);
  }
};

const finish = (quizInstance) => {
  const choices0Element = document.getElementById(`choices0`);
  titleElement.innerHTML = `あなたの正解数は${quizInstance.getCorrectAnswersNum()}です!!`;
  genreElement.innerHTML = "";
  difficultyElement.innerHTML = "";
  questionElement.innerHTML = "再度チャレンジしたい場合は以下のボタンをクリック";
  const button0Element = document.createElement('button');
  button0Element.innerHTML = "ホームへ戻る";
  choices0Element.appendChild(button0Element);
  button0Element.addEventListener("click", () => {
    window.location.reload(false);
  })
};
