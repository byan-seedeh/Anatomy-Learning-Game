export const Sound = {
    isMuted: false,
    
    // จำลองโครงสร้างไฟล์เสียง (ถ้ามีไฟล์เสียงในโฟลเดอร์ assets/sounds)
    effects: {
        correct: new Audio('assets/sounds/correct.mp3'),
        incorrect: new Audio('assets/sounds/incorrect.mp3'),
        click: new Audio('assets/sounds/click.mp3')
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    },

    play(effectName) {
        if (this.isMuted) return;
        const sound = this.effects[effectName];
        if (sound) {
            sound.currentTime = 0;
            // ใช้ catch เผื่อในกรณีที่เบราว์เซอร์บล็อกการเล่นเสียงอัตโนมัติก่อนคลิก
            sound.play().catch(() => {}); 
        }
    }
};