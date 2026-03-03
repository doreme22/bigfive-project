import { useReducer, useCallback, useEffect } from 'react';
import HomePage from './components/HomePage';
import WelcomePage from './components/WelcomePage';
import QuestionCard from './components/QuestionCard';
import ManualInputPage from './components/ManualInputPage';
import ResumePage from './components/ResumePage';
import LoadingPage from './components/LoadingPage';
import ResultPage from './components/ResultPage';
import HistoryPage from './components/HistoryPage';
import HistoryDetailPage from './components/HistoryDetailPage';
import JobDetailPage from './components/JobDetailPage';
import { questions, shuffleQuestions } from './data/questions';
import { calculateScores } from './utils/scoring';
import { generateReport, generateJobTypeRecommendations, generateGrowthSuggestions } from './utils/api';
import { mergePersonalityData, generatePersonalityTag } from './utils/personality';
import { getMatchingJobs, pickRandomJobs } from './data/jobs';
import { saveQuizProgress, clearQuizProgress, addHistoryRecord } from './utils/storage';

const STAGE = {
  HOME: 'home',
  WELCOME: 'welcome',
  HISTORY: 'history',
  HISTORY_DETAIL: 'history_detail',
  QUIZ: 'quiz',
  MANUAL_INPUT: 'manual_input',
  RESUME: 'resume',
  LOADING: 'loading',
  RESULT: 'result',
  JOB_DETAIL: 'job_detail',
};

const initialState = {
  stage: STAGE.HOME,
  assessmentType: null, // 'bfi' | 'manual' | 'both'
  shuffled: [],
  currentIndex: 0,
  answers: {},
  bfiScores: null,
  mbtiType: null,
  jungScores: null,
  resumeText: '',
  report: '',
  jobTypeRecs: [],
  growthSuggestions: [],
  displayedJobs: [],
  excludedJobIds: [],
  selectedHistoryId: null,
  selectedJobId: null,
  previousStage: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, stage: action.payload };

    case 'START_QUIZ': {
      const shuffled = shuffleQuestions();
      return {
        ...state,
        stage: STAGE.QUIZ,
        assessmentType: 'bfi',
        shuffled,
        currentIndex: 0,
        answers: {},
        bfiScores: null,
        report: '',
        jobTypeRecs: [],
        growthSuggestions: [],
        displayedJobs: [],
        excludedJobIds: [],
      };
    }

    case 'RESTORE_PROGRESS':
      return {
        ...state,
        stage: STAGE.QUIZ,
        assessmentType: 'bfi',
        shuffled: action.payload.shuffled,
        currentIndex: action.payload.currentIndex,
        answers: action.payload.answers,
      };

    case 'RESTORE_TO_RESUME':
      return {
        ...state,
        stage: STAGE.RESUME,
        assessmentType: 'bfi',
        shuffled: action.payload.shuffled,
        answers: action.payload.answers,
        bfiScores: action.payload.bfiScores,
      };

    case 'ANSWER_QUESTION': {
      const newAnswers = { ...state.answers, [action.payload.questionId]: action.payload.value };
      if (state.currentIndex < state.shuffled.length - 1) {
        return { ...state, answers: newAnswers, currentIndex: state.currentIndex + 1 };
      }
      // Last question — calculate scores
      const bfiScores = calculateScores(newAnswers, questions);
      return {
        ...state,
        answers: newAnswers,
        bfiScores,
        stage: STAGE.RESUME,
      };
    }

    case 'GO_BACK':
      return { ...state, currentIndex: Math.max(0, state.currentIndex - 1) };

    case 'SET_MANUAL_INPUT':
      return {
        ...state,
        mbtiType: action.payload.mbtiType,
        jungScores: action.payload.jungScores,
        assessmentType: state.bfiScores ? 'both' : 'manual',
        stage: STAGE.RESUME,
      };

    case 'SET_RESUME':
      return { ...state, resumeText: action.payload };

    case 'START_LOADING':
      return { ...state, stage: STAGE.LOADING };

    case 'SET_REPORT':
      return { ...state, report: action.payload };

    case 'SET_JOB_TYPE_RECS':
      return { ...state, jobTypeRecs: action.payload };

    case 'SET_GROWTH_SUGGESTIONS':
      return { ...state, growthSuggestions: action.payload };

    case 'SET_DISPLAYED_JOBS':
      return {
        ...state,
        displayedJobs: action.payload.jobs,
        excludedJobIds: action.payload.excludedIds,
      };

    case 'SHOW_RESULT':
      return { ...state, stage: STAGE.RESULT };

    case 'GO_RESUME_FROM_RESULT':
      return { ...state, stage: STAGE.RESUME, report: '', jobTypeRecs: [], growthSuggestions: [] };

    case 'GO_RESUME_FROM_HISTORY':
      return {
        ...state,
        bfiScores: action.payload.bfiScores,
        mbtiType: action.payload.mbtiType,
        jungScores: action.payload.jungScores,
        assessmentType: action.payload.assessmentType,
        report: '',
        jobTypeRecs: [],
        growthSuggestions: [],
        stage: STAGE.RESUME,
      };

    case 'SELECT_HISTORY':
      return { ...state, selectedHistoryId: action.payload, stage: STAGE.HISTORY_DETAIL };

    case 'SELECT_JOB':
      return { ...state, selectedJobId: action.payload, previousStage: state.stage, stage: STAGE.JOB_DETAIL };

    case 'RESTART':
      return { ...initialState };

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Save quiz progress on every answer
  useEffect(() => {
    if ((state.stage === STAGE.QUIZ || state.stage === STAGE.RESUME) && state.shuffled.length > 0) {
      const shuffledIds = state.shuffled.map((q) => q.id);
      saveQuizProgress(shuffledIds, state.currentIndex, state.answers);
    }
  }, [state.stage, state.currentIndex, state.answers, state.shuffled]);

  const handleStart = useCallback(() => {
    dispatch({ type: 'START_QUIZ' });
  }, []);

  const handleAnswer = useCallback((questionId, value) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { questionId, value } });
  }, []);

  const handleBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  const handleManualSubmit = useCallback((mbtiType, jungScores) => {
    dispatch({ type: 'SET_MANUAL_INPUT', payload: { mbtiType, jungScores } });
  }, []);

  const handleResumeSubmit = useCallback(async (resumeText) => {
    dispatch({ type: 'SET_RESUME', payload: resumeText });
    dispatch({ type: 'START_LOADING' });

    const effectiveScores = mergePersonalityData(state.bfiScores, state.jungScores, state.mbtiType);

    try {
      // Run report generation and structured API calls
      const reportPromise = generateReport(
        effectiveScores,
        state.jungScores,
        state.mbtiType,
        resumeText,
        (partial) => dispatch({ type: 'SET_REPORT', payload: partial }),
      );

      const jobRecsPromise = generateJobTypeRecommendations(effectiveScores, state.jungScores, resumeText);
      const growthPromise = generateGrowthSuggestions(effectiveScores, state.jungScores, resumeText);

      const [finalReport, jobRecs, growthSugs] = await Promise.all([reportPromise, jobRecsPromise, growthPromise]);

      dispatch({ type: 'SET_JOB_TYPE_RECS', payload: jobRecs });
      dispatch({ type: 'SET_GROWTH_SUGGESTIONS', payload: growthSugs });

      // Generate initial displayed jobs
      const matched = getMatchingJobs(effectiveScores, state.jungScores, state.mbtiType);
      const picked = pickRandomJobs(matched, 3);
      dispatch({
        type: 'SET_DISPLAYED_JOBS',
        payload: { jobs: picked, excludedIds: picked.map((j) => j.id) },
      });

      // Save to history
      const personalityTag = generatePersonalityTag(effectiveScores, state.mbtiType);
      addHistoryRecord({
        assessmentType: state.assessmentType || 'bfi',
        bfiScores: state.bfiScores,
        mbtiType: state.mbtiType,
        jungScores: state.jungScores,
        personalityTag,
        resumeText,
        report: finalReport || '',
        jobTypeRecs: jobRecs,
        growthSuggestions: growthSugs,
      });

      clearQuizProgress();
      dispatch({ type: 'SHOW_RESULT' });
    } catch (err) {
      console.error('Report generation failed:', err);

      // Still save history with available data
      const personalityTag = generatePersonalityTag(effectiveScores, state.mbtiType);
      addHistoryRecord({
        assessmentType: state.assessmentType || 'bfi',
        bfiScores: state.bfiScores,
        mbtiType: state.mbtiType,
        jungScores: state.jungScores,
        personalityTag,
        resumeText,
        report: '',
        jobTypeRecs: [],
        growthSuggestions: [],
      });

      clearQuizProgress();
      dispatch({ type: 'SHOW_RESULT' });
    }
  }, [state.bfiScores, state.jungScores, state.mbtiType, state.assessmentType]);

  const handleSkip = useCallback(() => {
    clearQuizProgress();

    // Still generate displayed jobs if we have scores
    const effectiveScores = mergePersonalityData(state.bfiScores, state.jungScores, state.mbtiType);
    if (effectiveScores) {
      const matched = getMatchingJobs(effectiveScores, state.jungScores, state.mbtiType);
      const picked = pickRandomJobs(matched, 3);
      dispatch({
        type: 'SET_DISPLAYED_JOBS',
        payload: { jobs: picked, excludedIds: picked.map((j) => j.id) },
      });

      // Save to history (without resume/report)
      const personalityTag = generatePersonalityTag(effectiveScores, state.mbtiType);
      addHistoryRecord({
        assessmentType: state.assessmentType || 'bfi',
        bfiScores: state.bfiScores,
        mbtiType: state.mbtiType,
        jungScores: state.jungScores,
        personalityTag,
        resumeText: '',
        report: '',
        jobTypeRecs: [],
        growthSuggestions: [],
        resumeSkipped: true,
      });
    }

    dispatch({ type: 'SHOW_RESULT' });
  }, [state.bfiScores, state.jungScores, state.mbtiType, state.assessmentType]);

  const handleRefreshJobs = useCallback(() => {
    const effectiveScores = mergePersonalityData(state.bfiScores, state.jungScores, state.mbtiType);
    const matched = getMatchingJobs(effectiveScores, state.jungScores, state.mbtiType, state.excludedJobIds);
    let picked = pickRandomJobs(matched, 3);
    if (picked.length === 0) {
      // Reset excluded and try again
      const allMatched = getMatchingJobs(effectiveScores, state.jungScores, state.mbtiType);
      picked = pickRandomJobs(allMatched, 3);
      dispatch({
        type: 'SET_DISPLAYED_JOBS',
        payload: { jobs: picked, excludedIds: picked.map((j) => j.id) },
      });
    } else {
      dispatch({
        type: 'SET_DISPLAYED_JOBS',
        payload: {
          jobs: picked,
          excludedIds: [...state.excludedJobIds, ...picked.map((j) => j.id)],
        },
      });
    }
  }, [state.bfiScores, state.jungScores, state.mbtiType, state.excludedJobIds]);

  const handleRestoreProgress = useCallback((progress) => {
    // Reconstruct shuffled question objects from saved IDs
    const idMap = {};
    questions.forEach((q) => { idMap[q.id] = q; });
    const shuffled = progress.shuffledIds.map((id) => idMap[id]).filter(Boolean);

    // If all questions answered, go directly to resume stage
    const allAnswered = shuffled.length > 0 && Object.keys(progress.answers).length >= shuffled.length;
    if (allAnswered) {
      const bfiScores = calculateScores(progress.answers, questions);
      dispatch({
        type: 'RESTORE_TO_RESUME',
        payload: { shuffled, answers: progress.answers, bfiScores },
      });
    } else {
      dispatch({
        type: 'RESTORE_PROGRESS',
        payload: {
          shuffled,
          currentIndex: progress.currentIndex,
          answers: progress.answers,
        },
      });
    }
  }, []);

  const effectiveScores = mergePersonalityData(state.bfiScores, state.jungScores, state.mbtiType);

  return (
    <div className="max-w-lg mx-auto">
      {state.stage === STAGE.HOME && (
        <HomePage
          onGoTest={() => dispatch({ type: 'SET_STAGE', payload: STAGE.WELCOME })}
        />
      )}

      {state.stage === STAGE.WELCOME && (
        <WelcomePage
          onStart={handleStart}
          onGoManualInput={() => dispatch({ type: 'SET_STAGE', payload: STAGE.MANUAL_INPUT })}
          onGoHistory={() => dispatch({ type: 'SET_STAGE', payload: STAGE.HISTORY })}
          onRestoreProgress={handleRestoreProgress}
          onBack={() => dispatch({ type: 'SET_STAGE', payload: STAGE.HOME })}
        />
      )}

      {state.stage === STAGE.QUIZ && state.shuffled.length > 0 && (
        <QuestionCard
          question={state.shuffled[state.currentIndex]}
          index={state.currentIndex}
          total={state.shuffled.length}
          onAnswer={handleAnswer}
          onBack={handleBack}
          currentAnswer={state.answers[state.shuffled[state.currentIndex]?.id]}
        />
      )}

      {state.stage === STAGE.MANUAL_INPUT && (
        <ManualInputPage
          onSubmit={handleManualSubmit}
          onBack={() => dispatch({ type: 'SET_STAGE', payload: STAGE.WELCOME })}
        />
      )}

      {state.stage === STAGE.RESUME && (
        <ResumePage
          onSubmit={handleResumeSubmit}
          onSkip={handleSkip}
        />
      )}

      {state.stage === STAGE.LOADING && (
        <LoadingPage />
      )}

      {state.stage === STAGE.RESULT && effectiveScores && (
        <ResultPage
          scores={effectiveScores}
          mbtiType={state.mbtiType}
          report={state.report}
          assessmentType={state.assessmentType}
          growthSuggestions={state.growthSuggestions}
          displayedJobs={state.displayedJobs}
          onRefreshJobs={handleRefreshJobs}
          onSelectJob={(id) => dispatch({ type: 'SELECT_JOB', payload: id })}
          onGoResume={() => dispatch({ type: 'GO_RESUME_FROM_RESULT' })}
          onBack={() => dispatch({ type: 'SET_STAGE', payload: STAGE.WELCOME })}
        />
      )}

      {state.stage === STAGE.HISTORY && (
        <HistoryPage
          onBack={() => dispatch({ type: 'SET_STAGE', payload: STAGE.HOME })}
          onSelectRecord={(id) => dispatch({ type: 'SELECT_HISTORY', payload: id })}
        />
      )}

      {state.stage === STAGE.HISTORY_DETAIL && (
        <HistoryDetailPage
          recordId={state.selectedHistoryId}
          onBack={() => dispatch({ type: 'SET_STAGE', payload: STAGE.HISTORY })}
          onSelectJob={(id) => dispatch({ type: 'SELECT_JOB', payload: id })}
          onGoResume={(record) => dispatch({ type: 'GO_RESUME_FROM_HISTORY', payload: record })}
        />
      )}

      {state.stage === STAGE.JOB_DETAIL && (
        <JobDetailPage
          jobId={state.selectedJobId}
          onBack={() => dispatch({ type: 'SET_STAGE', payload: state.previousStage || STAGE.RESULT })}
        />
      )}
    </div>
  );
}
