import { useState, useCallback } from 'react';
import WelcomePage from './components/WelcomePage';
import QuestionCard from './components/QuestionCard';
import ResumePage from './components/ResumePage';
import LoadingPage from './components/LoadingPage';
import ResultPage from './components/ResultPage';
import { questions, shuffleQuestions } from './data/questions';
import { calculateScores } from './utils/scoring';
import { generateReport } from './utils/api';

const STAGE = {
  WELCOME: 'welcome',
  QUIZ: 'quiz',
  RESUME: 'resume',
  LOADING: 'loading',
  RESULT: 'result',
};

export default function App() {
  const [stage, setStage] = useState(STAGE.WELCOME);
  const [shuffled, setShuffled] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState(null);
  const [report, setReport] = useState('');

  const handleStart = useCallback(() => {
    setShuffled(shuffleQuestions());
    setCurrentIndex(0);
    setAnswers({});
    setScores(null);
    setReport('');
    setStage(STAGE.QUIZ);
  }, []);

  const handleAnswer = useCallback((questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentIndex < shuffled.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Last question
      const calculatedScores = calculateScores(newAnswers, questions);
      setScores(calculatedScores);
      setStage(STAGE.RESUME);
    }
  }, [shuffled.length, currentIndex, answers]);

  const handleBack = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleResumeSubmit = useCallback(async (resumeText) => {
    setStage(STAGE.LOADING);
    try {
      await generateReport(scores, resumeText, (partial) => {
        setReport(partial);
      });
      setStage(STAGE.RESULT);
    } catch (err) {
      console.error('Report generation failed:', err);
      setStage(STAGE.RESULT);
    }
  }, [scores]);

  const handleSkip = useCallback(() => {
    setStage(STAGE.RESULT);
  }, []);

  const handleRestart = useCallback(() => {
    setStage(STAGE.WELCOME);
    setShuffled([]);
    setCurrentIndex(0);
    setAnswers({});
    setScores(null);
    setReport('');
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      {stage === STAGE.WELCOME && (
        <WelcomePage onStart={handleStart} />
      )}

      {stage === STAGE.QUIZ && shuffled.length > 0 && (
        <QuestionCard
          question={shuffled[currentIndex]}
          index={currentIndex}
          total={shuffled.length}
          onAnswer={handleAnswer}
          onBack={handleBack}
          currentAnswer={answers[shuffled[currentIndex]?.id]}
        />
      )}

      {stage === STAGE.RESUME && (
        <ResumePage
          onSubmit={handleResumeSubmit}
          onSkip={handleSkip}
        />
      )}

      {stage === STAGE.LOADING && (
        <LoadingPage />
      )}

      {stage === STAGE.RESULT && scores && (
        <ResultPage
          scores={scores}
          report={report}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
