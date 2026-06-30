// Utility functions
export const Utils = {
    // ฟังก์ชันสุ่มเรียงลำดับอาร์เรย์ (เช่น สุ่มสลับตัวเลือกคำตอบ)
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    },

    // ฟอร์แมตวันที่ปัจจุบันให้อ่านง่าย (DD/MM/YYYY HH:MM)
    formatDate(dateString) {
        const date = dateString ? new Date(dateString) : new Date();
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
        const hr = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${d}/${m}/${y} ${hr}:${min} น.`;
    }
};