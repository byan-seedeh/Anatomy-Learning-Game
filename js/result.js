/**
 * js/result.js
 * ระบบดึงคะแนนและประมวลผลลัพธ์การเล่นรอบล่าสุดจาก Storage มาอัปเดตบนหน้า UI ผลลัพธ์
 * จับคู่ ID ตรงตามโครงสร้างไฟล์ result.html จริงร้อยเปอร์เซ็นต์
 */

import { Storage } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. ดึงประวัติการเล่นทั้งหมดออกมาจากระบบ Storage ส่วนกลาง
    const gameHistory = Storage.getHistory();

    // 2. ตรวจสอบว่ามีประวัติการบันทึกข้อมูลหรือไม่
    if (gameHistory && gameHistory.length > 0) {
        // ข้อมูลรอบล่าสุด (Latest Turn) จะอยู่ตำแหน่งท้ายสุดของอาร์เรย์เสมอ
        const latestRecord = gameHistory[gameHistory.length - 1]; 
        
        // ดึงค่าคะแนนและจำนวนข้อสอบจริง (ดักจับเพื่อป้องกันค่า undefined และแคสต์เป็นตัวเลข)
        const finalScore = latestRecord.score !== undefined ? Number(latestRecord.score) : 0;
        const totalQuestions = latestRecord.totalQuestions ? Number(latestRecord.totalQuestions) : 3; 
        const wrongAnswers = totalQuestions - finalScore;
        const displayDate = latestRecord.date || "-";

        // 3. จับคู่ ID อัปเดตข้อมูลลงบนหน้า HTML ตัวจริง
        
        // อัปเดตตัวเลขคะแนนหลักในวงกลม
        const finalScoreEl = document.getElementById("final-score");
        if (finalScoreEl) {
            finalScoreEl.textContent = finalScore;
        }

        // ปรับแก้ตัวเลขจำนวนข้อสอบรวมส่วนฐาน (เช่น จาก /10 เป็น /3 ตามจำนวนข้อสอบจริงในระบบ)
        const scoreTotalEl = document.querySelector(".score-total");
        if (scoreTotalEl) {
            scoreTotalEl.textContent = `/${totalQuestions}`;
        }

        // อัปเดตตัวนับสรุปผลตอบถูก / ตอบผิด ด้านล่าง
        const correctCountEl = document.getElementById("correct-count");
        if (correctCountEl) {
            correctCountEl.textContent = `${finalScore} ข้อ`;
        }

        const incorrectCountEl = document.getElementById("incorrect-count");
        if (incorrectCountEl) {
            incorrectCountEl.textContent = `${wrongAnswers} ข้อ`;
        }

        // อัปเดตวันที่เสร็จสิ้นการทำแบบทดสอบ
        const completionDateEl = document.getElementById("completion-date");
        if (completionDateEl) {
            completionDateEl.textContent = `เสร็จสิ้นเมื่อ: ${displayDate}`;
        }

        // 4. ปรับเปลี่ยนข้อความประเมินผล (Performance Feedback) ให้สอดรับตามเกณฑ์คะแนนจริง
        const feedbackTextEl = document.getElementById("performance-feedback");
        if (feedbackTextEl) {
            const percent = (finalScore / totalQuestions) * 100;
            
            if (percent >= 80) {
                feedbackTextEl.textContent = "ยอดเยี่ยม! คุณเข้าใจโครงสร้างและการป้องกันโรค Office Syndrome เป็นอย่างดี";
            } else if (percent >= 50) {
                feedbackTextEl.textContent = "ทำได้ดี! คุณมีความเข้าใจพื้นฐานโครงสร้างสรีรวิทยา แนะนำให้ทบทวนเพิ่มเติมเพื่อความแม่นยำ";
            } else {
                feedbackTextEl.textContent = "พยายามอีกครั้ง! ลองกลับไปศึกษาพิกัดและอาการของโรคใหม่อีกรอบเพื่อสุขภาพที่ดีขึ้นนะ";
            }
        }

        console.log("เชื่อมต่อและอัปเดตหน้าแสดงผลลัพธ์สำเร็จ:", latestRecord);
    } else {
        console.warn("ไม่พบประวัติการทำแบบทดสอบในระบบความจำ LocalStorage");
    }
});