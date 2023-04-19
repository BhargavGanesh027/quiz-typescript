import { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { fetchQuiz } from "./API";
import { Difficulty, QuestionState } from "./API";
import { GlobalStyle, Wrapper } from "./App.styles";
import { stringify } from "querystring";

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string | any>(Difficulty.EASY);
  const [startAgain, setStartAgain] = useState(true);

  const startQuiz = async () => {
    setLoading(true);
    setStartAgain(false);
    setGameOver(false);

    const newQuestions = await fetchQuiz(questionCount, difficulty);
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) {
        setScore((prev) => prev + 1);
      }
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === questionCount) {
      setGameOver(true);
      setStartAgain(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>React Quiz</h1>
        {startAgain ? (
          <div className="input-wrapper">
            <p className="score">Enter the Amount of Questions</p>
            <input
              type={"number"}
              value={questionCount}
              className="input"
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            />
            <p className="score">Select the Difficulty</p>
            <select
              className="select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value={Difficulty.EASY}>{Difficulty.EASY}</option>
              <option value={Difficulty.MEDIUM}>{Difficulty.MEDIUM}</option>
              <option value={Difficulty.HARD}>{Difficulty.HARD}</option>
            </select>
          </div>
        ) : null}
        {(gameOver || userAnswers.length === questionCount) && startAgain ? (
          <button className="start" onClick={startQuiz}>
            Start
          </button>
        ) : null}
        {userAnswers.length === questionCount && !startAgain && !loading ? (
          <button className="start" onClick={() => setStartAgain(true)}>
            Start Again
          </button>
        ) : null}
        {!gameOver && !startAgain ? (
          <p className="score">Score: {score}</p>
        ) : null}
        {loading ? <p className="">Loading Questions ...</p> : null}
        {!loading && !gameOver && !startAgain && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={questionCount}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver && !loading && number !== questionCount - 1 ? (
          <button onClick={nextQuestion} className="next">
            Next
          </button>
        ) : null}
      </Wrapper>
    </>
  );
}

export default App;
