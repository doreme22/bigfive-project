// localStorage keys
const KEYS = {
  QUIZ_PROGRESS: 'bfi_quiz_progress',
  HISTORY: 'bfi_history',
  RESUME_CACHE: 'bfi_resume_cache',
};

const HISTORY_LIMIT = 20;

// --- Quiz Progress ---

export function saveQuizProgress(shuffledIds, currentIndex, answers) {
  const data = {
    shuffledIds,
    currentIndex,
    answers,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(KEYS.QUIZ_PROGRESS, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

export function loadQuizProgress() {
  try {
    const raw = localStorage.getItem(KEYS.QUIZ_PROGRESS);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.shuffledIds || !Array.isArray(data.shuffledIds)) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearQuizProgress() {
  try {
    localStorage.removeItem(KEYS.QUIZ_PROGRESS);
  } catch {
    // ignore
  }
}

// --- History ---

export function getHistory() {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistoryRecord(record) {
  try {
    const history = getHistory();
    history.unshift({
      id: `rec_${Date.now()}`,
      timestamp: Date.now(),
      ...record,
    });
    // Keep only latest HISTORY_LIMIT records
    if (history.length > HISTORY_LIMIT) {
      history.length = HISTORY_LIMIT;
    }
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    return history[0].id;
  } catch {
    return null;
  }
}

export function getHistoryRecord(id) {
  const history = getHistory();
  return history.find((r) => r.id === id) || null;
}

export function updateHistoryRecord(id, fields) {
  try {
    const history = getHistory();
    const idx = history.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    history[idx] = { ...history[idx], ...fields };
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}

export function deleteHistoryRecord(id) {
  try {
    const history = getHistory().filter((r) => r.id !== id);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

// --- Resume Cache ---

export function getCachedResume() {
  try {
    const raw = localStorage.getItem(KEYS.RESUME_CACHE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCachedResume(text, source) {
  try {
    localStorage.setItem(
      KEYS.RESUME_CACHE,
      JSON.stringify({ text, source, timestamp: Date.now() }),
    );
  } catch {
    // ignore
  }
}

export function clearCachedResume() {
  try {
    localStorage.removeItem(KEYS.RESUME_CACHE);
  } catch {
    // ignore
  }
}
