/**
 * js/storage.js
 * ระบบจัดการและจัดเก็บข้อมูลประวัติการเล่นเกมอนาโตมี (Anatomy Learning Game)
 * รองรับการบันทึกคะแนน, จำนวนข้อสอบทั้งหมด, และการแปลงเวลาให้เข้ากับ Format หน้า Dashboard
 */

export const Storage = {
    /**
     * บันทึกผลการเล่นรอบล่าสุดลงใน localStorage
     * @param {number} score - คะแนนที่ผู้เล่นทำได้
     * @param {number} totalQuestions - จำนวนข้อสอบทั้งหมดในรอบนั้น
     */
    saveToHistory(score, totalQuestions) {
        try {
            // ดึงข้อมูลประวัติเดิมที่มีอยู่ หากไม่มีให้เริ่มด้วยอาร์เรย์ว่าง
            const history = JSON.parse(localStorage.getItem("anatomy_game_history")) || [];
            
            // รับเวลาปัจจุบันและแปลงรูปแบบให้แสดงผลบนแดชบอร์ดไทยได้อย่างสวยงาม
            const now = new Date();
            const formattedDate = now.toLocaleString('th-TH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // สร้างก้อนข้อมูลที่สมบูรณ์ ป้องกันปัญหาค่า undefined หลุดไปในระบบ
            const newRecord = {
                score: Number(score) || 0,
                totalQuestions: Number(totalQuestions) || 5, // กำหนดค่าเริ่มต้นสำรองไว้ที่ 5 ข้อหากไม่มีการส่งมา
                date: formattedDate
            };
            
            // เพิ่มข้อมูลใหม่ลงในประวัติ และบันทึกกลับลง localStorage
            history.push(newRecord);
            localStorage.setItem("anatomy_game_history", JSON.stringify(history));
            
            console.log("บันทึกสถิติสำเร็จ:", newRecord);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูลลง localStorage:", error);
        }
    },

    /**
     * ดึงประวัติการเล่นทั้งหมดออกมาใช้งาน
     * @returns {Array} อาร์เรย์ของประวัติการเล่นเกม
     */
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem("anatomy_game_history")) || [];
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอ่านข้อมูลจาก localStorage:", error);
            return [];
        }
    },

    /**
     * ล้างข้อมูลประวัติการเล่นทั้งหมด (ใช้สำหรับกรณีต้องการ Reset ระบบใหม่)
     */
    clearHistory() {
        try {
            localStorage.removeItem("anatomy_game_history");
            console.log("ล้างประวัติการเล่นทั้งหมดเรียบร้อยแล้ว");
        } catch (error) {
            console.error("ไม่สามารถล้างข้อมูลใน localStorage ได้:", error);
        }
    }
};