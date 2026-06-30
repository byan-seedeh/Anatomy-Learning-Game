// Configuration constants for Anatomy Learning Game
export const CONFIG = {
    GAME_TITLE: "Anatomy Learning Game",
    STORAGE_KEYS: {
        HISTORY: "anatomy_game_history",
        CURRENT_SESSION: "anatomy_current_session"
    },
    SCORE_PER_QUESTION: 1,
    TOTAL_QUESTIONS: 5, // จำนวนข้อสุ่มต่อรอบการเล่น
    PASS_THRESHOLD: 0.8  // เกณฑ์การประเมินระดับ High (80% ขึ้นไป)
};