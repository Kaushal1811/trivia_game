import React, { useEffect, useState } from "react";

const Quiz = () => {
  const [question, setquestion] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  useEffect(() => {
    fetchquestion(10);
  }, []);

  const fetchquestion = async (amount) => {
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=${amount}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setquestion(data.results);
        setCurrentQuestionIndex(0);
        setIsQuizFinished(false);
        setIsSubmitted(false);
        setSelectedAnswerIndex(null);
        setFeedback("");
      } 
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleOptionClick = (index, option) => {
    if (!isSubmitted) {
      setSelectedAnswerIndex(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswerIndex === null) return;

    const correctAnswer = question[currentQuestionIndex] && question[currentQuestionIndex].correct_answer;
    const selectedAnswer = question[currentQuestionIndex].incorrect_answers
      .concat(question[currentQuestionIndex].correct_answer)
      .sort()[selectedAnswerIndex];

    if (selectedAnswer === correctAnswer) {
      setFeedback("Your answer is a Correct!");
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setFeedback(`Your answer is a Wrong!\nThe correct answer was: ${correctAnswer}`);
      setWrongAnswers(wrongAnswers + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < question.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
      setSelectedAnswerIndex(null);
      setFeedback("");
    } else {
      setIsQuizFinished(true);
    }
  };

  const getBorderClass = (index) => {
    if (!isSubmitted) return selectedAnswerIndex === index ? 'selected-option' : '';
    const correctAnswer = question[currentQuestionIndex]?.correct_answer;
    const option = question[currentQuestionIndex].incorrect_answers
      .concat(question[currentQuestionIndex].correct_answer)
      .sort()[index];

    if (option === correctAnswer) return 'correct-answer';
    if (index === selectedAnswerIndex && option !== correctAnswer) return 'wrong-answer';
    return '';
  };

  const getOptionLabel = (index) => {
    const labels = ['A', 'B', 'C', 'D'];
    return labels[index] || '';
  };

  return (
    <div className='quiz-container'>
      {question.length > 0 && !isQuizFinished ? (
        <div className='quiz-content'>
          {question[currentQuestionIndex] ? (
            <div>
              <h2 className="font-semibold">Question {currentQuestionIndex + 1}</h2>
              <p className="font-semibold mb-4">{question[currentQuestionIndex].question}</p>

              {question[currentQuestionIndex].incorrect_answers
                .concat(question[currentQuestionIndex].correct_answer)
                .sort()
                .map((option, index) => (
                  <div
                    key={index}
                    className={`option ${getBorderClass(index)}`}
                    onClick={() => handleOptionClick(index, option)}
                  >
                    <span className='option-label font-medium'>{getOptionLabel(index)}</span>
                    <span className='option-text font-medium'>{option}</span>
                  </div>
                ))}

              {!isSubmitted && (
                <button className="mt-4 px-8 py-3 rounded-3xl bg-sky-600" onClick={handleSubmit} disabled={selectedAnswerIndex === null}>
                  Submit
                </button>
              )}

              {isSubmitted && (
                <div>
                  <p>{feedback}</p>
                  <button onClick={handleNext} className="mt-4 px-8 py-3 rounded-3xl bg-violet-700">
                    {currentQuestionIndex < question.length - 1 ? "Next" : "Finish"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Loading question...</p>
          )}
        </div>
      ) : isQuizFinished ? (
        <div className='quiz-content'>
          <h2 className="font-bold text-4xl mb-4">Quiz Finished!</h2>
          <p>Total question served: {question.length}</p>
          <p>Total Correct Answers: {correctAnswers}</p>
          <p>Total Incorrect Answers: {wrongAnswers}</p>
        </div>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default Quiz;
