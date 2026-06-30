import { questionBank } from './questions.js';
import { Storage } from './storage.js';
import { Utils } from './utils.js';
import { Sound } from './sound.js';
import { Animation } from './animation.js';
import { CONFIG } from './config.js';

class GameController {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;

        this.initElements();
        this.initEvents();
        this.startGame();
    }

    initElements() {
        this.questionText = document.getElementById('question-text');
        this.optionsGroup = document.getElementById('options-group');
        this.progressText = document.getElementById('progress-text');
        this.progressFill = document.getElementById('progress-fill');
        this.currentScoreEl = document.getElementById('current-score');
        this.btnNext = document.getElementById('btn-next');
        this.explanationBox = document.getElementById('explanation-box');
        this.explanationTextContent = document.getElementById('explanation-text-content');
        this.btnSound = document.getElementById('btn-toggle-sound');
    }

    initEvents() {
        if (this.btnNext) {
            this.btnNext.addEventListener('click', () => this.handleNext());
        }
        if (this.btnSound) {
            this.btnSound.addEventListener('click', () => this.handleToggleSound());
        }
        
        // 🌟 ปลดล็อกระบบเสียงทันทีเมื่อมีการแตะหน้าจอครั้งแรก (ป้องกันเงื่อนไขเว็บเบราว์เซอร์บล็อกเสียง)
        document.body.addEventListener('click', () => {
            if (typeof Sound.initAudioContext === 'function') {
                Sound.initAudioContext();
            }
        }, { once: true });
    }

    startGame() {
        // ทำการสุ่มข้อสอบเพื่อเพิ่มประสิทธิภาพ Formative Assessment
        const shuffled = Utils.shuffleArray(questionBank);
        // กำหนดจำนวนข้อรวมตาม CONFIG หรือล็อกไว้ที่ 3 ข้อ
        const totalQsConfig = (CONFIG && CONFIG.TOTAL_QUESTIONS) ? CONFIG.TOTAL_QUESTIONS : 3;
        this.questions = shuffled.slice(0, totalQsConfig);
        this.currentIndex = 0;
        this.score = 0;
        
        this.renderQuestion();
    }

    renderQuestion() {
        this.selectedAnswer = null;
        if (this.btnNext) this.btnNext.disabled = true;
        if (this.explanationBox) this.explanationBox.classList.add('d-none');
        
        const currentQuestion = this.questions[this.currentIndex];
        if (!currentQuestion) return;

        if (this.questionText) this.questionText.textContent = currentQuestion.question;
        if (this.progressText) this.progressText.textContent = `คำถามที่ ${this.currentIndex + 1}/${this.questions.length}`;
        if (this.progressFill) this.progressFill.style.width = `${((this.currentIndex + 1) / this.questions.length) * 100}%`;
        if (this.currentScoreEl) this.currentScoreEl.textContent = this.score;

        Animation.renderAnatomyVisual('anatomy-visual-container', currentQuestion.anatomyType);

        if (this.optionsGroup) {
            this.optionsGroup.innerHTML = '';
            currentQuestion.options.forEach((option, index) => {
                const prefixes = ['A', 'B', 'C', 'D'];
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.innerHTML = `
                    <span class="option-prefix">${prefixes[index]}</span>
                    <span class="option-content">${option}</span>
                `;
                button.addEventListener('click', () => this.selectOption(index, button));
                this.optionsGroup.appendChild(button);
            });
        }
    }

    selectOption(index, buttonElement) {
        if (this.selectedAnswer !== null) return; 
        this.selectedAnswer = index;
        const currentQuestion = this.questions[this.currentIndex];

        const allButtons = this.optionsGroup.querySelectorAll('.option-btn');
        allButtons.forEach(btn => btn.disabled = true);

        // ตรวจทานผลการตอบคำถาม
        if (index === currentQuestion.correctAnswer) {
            buttonElement.classList.add('correct');
            this.score += 1; 
            if (this.currentScoreEl) this.currentScoreEl.textContent = this.score;
            Sound.play('correct'); // ส่งเสียงเฉลยเมื่อตอบถูก
        } else {
            buttonElement.classList.add('incorrect');
            if (allButtons[currentQuestion.correctAnswer]) {
                allButtons[currentQuestion.correctAnswer].classList.add('correct');
            }
            Sound.play('incorrect'); // ส่งเสียงเอฟเฟกต์เตือนเมื่อตอบผิด
        }

        // เปิดแสดงกล่องข้อมูลคำอธิบายทางสรีรวิทยา
        if (this.explanationBox && this.explanationTextContent) {
            this.explanationTextContent.textContent = currentQuestion.explanation;
            this.explanationBox.classList.remove('d-none');
        }

        if (this.btnNext) this.btnNext.disabled = false;
    }

    handleNext() {
        Sound.play('click');
        this.currentIndex++;

        if (this.currentIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            // 🌟 จุดสำคัญ: ยิงส่งค่าตัวเลขคะแนนสะสม และจำนวนข้อรวมสอบจริง เข้าสู่ฐานความจำกลาง
            Storage.saveToHistory(this.score, this.questions.length);
            window.location.href = 'result.html';
        }
    }

    handleToggleSound() {
        const isMuted = Sound.toggleMute();
        if (this.btnSound) {
            this.btnSound.innerHTML = isMuted ? 
                `<i class="fa-solid fa-volume-xmark"></i>` : 
                `<i class="fa-solid fa-volume-high"></i>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameController();
});