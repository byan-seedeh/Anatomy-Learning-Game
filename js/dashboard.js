/**
 * js/dashboard.js
 * ระบบดึงข้อมูลสถิติประวัติการเล่นเกมอนาโตมีมาประมวลผลและแสดงผลบนหน้า Dashboard
 * เรียงลำดับรายการจาก อดีต ไปหา ปัจจุบัน (ครั้งที่ 1 -> 2 -> 3 -> 4) ตามลำดับเวลาจริง
 */

import { Storage } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
    // ดึงข้อมูลประวัติการทำแบบทดสอบทั้งหมดจากระบบ Storage ส่วนกลาง
    const gameHistory = Storage.getHistory();

    const totalPlaysElem = document.getElementById("total-plays");
    const avgScoreElem = document.getElementById("avg-score");
    const maxScoreElem = document.getElementById("max-score");
    const tableBody = document.getElementById("history-table-body");

    // กรณีที่ยังไม่เคยมีประวัติการเข้าเล่นเลยในระบบ LocalStorage
    if (!gameHistory || gameHistory.length === 0) {
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #64748b; padding: 24px;">
                        ไม่พบประวัติการเข้าทดสอบ เริ่มเล่นเกมเพื่อบันทึกผลสถิติใหม่
                    </td>
                </tr>`;
        }
        if (totalPlaysElem) totalPlaysElem.textContent = "0";
        if (avgScoreElem) avgScoreElem.textContent = "0.0";
        if (maxScoreElem) maxScoreElem.textContent = "0";
        return;
    }

    // กำหนดตัวแปรเริ่มต้นสำหรับคำนวณ Metrics ภาพรวม
    const totalPlays = gameHistory.length;
    let sumScore = 0;
    let maxScore = 0;

    // วนลูปเพื่อคำนวณหาคะแนนรวม และคะแนนที่สูงที่สุด
    gameHistory.forEach(record => {
        const currentRecordScore = Number(record.score) || 0;
        sumScore += currentRecordScore;
        if (currentRecordScore > maxScore) {
            maxScore = currentRecordScore;
        }
    });

    // คำนวณคะแนนเฉลี่ยเป็นทศนิยม 1 ตำแหน่ง
    const avgScore = (sumScore / totalPlays).toFixed(1);

    // นำตัวเลขที่คำนวณได้ไปแสดงผลบนการ์ดสรุปผลด้านบน
    if (totalPlaysElem) totalPlaysElem.textContent = totalPlays;
    if (avgScoreElem) avgScoreElem.textContent = avgScore;
    if (maxScoreElem) maxScoreElem.textContent = maxScore;

    // ล้างข้อมูลเก่าและเริ่มสร้างแถวในตารางใหม่ เรียงลำดับจากเก่าไปใหม่
    if (tableBody) {
        tableBody.innerHTML = "";

        // วนลูปอาร์เรย์ตามลำดับดั้งเดิม (Index 0 คือเกมรอบแรกสุดที่เล่น)
        gameHistory.forEach((record, index) => {
            // ครั้งที่เล่นจะนับเพิ่มขึ้นเรื่อยๆ ตามลำดับจริง: ครั้งที่ 1, ครั้งที่ 2, ครั้งที่ 3...
            const currentTurn = index + 1; 
            
            // ดักจับและป้องกันค่าว่าง (undefined): ถ้าข้อมูลเดิมไม่มีจำนวนข้อสอบ ให้ดึงเลข 3 ขึ้นมาแสดงแทนอัตโนมัติ
            const totalQs = record.totalQuestions || 3; 
            const currentScore = record.score !== undefined ? record.score : 0;
            
            // ลอจิกการคิดคำนวณแถบสถานะ (Low = สีเหลือง, Medium = สีน้ำเงิน, High = สีแดง)
            let badgeClass = "need-improvement";
            let badgeText = "ต้องพัฒนา";
            
            const percent = (currentScore / totalQs) * 100;
            if (percent >= 80) {
                badgeClass = "excellent"; // กลุ่มคะแนนสูง (สีแดงตามธีมระบบแจ้งเตือนหลัก)
                badgeText = "ดีเยี่ยม";
            } else if (percent >= 50) {
                badgeClass = "good";      // กลุ่มคะแนนกลาง (สีน้ำเงิน)
                badgeText = "ดี";
            }

            // คลีนรูปแบบสตริงของวันที่ กรณีมีสัญลักษณ์เวลาแบบ ISO (T หรือ Z) ติดมากับแคชระบบเก่า
            let displayDate = record.date || "-";
            if (displayDate.includes('T')) {
                displayDate = displayDate.replace('T', ' ').substring(0, 16);
            }

            // สร้าง Element แถวตารางทีละแถว
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${currentTurn}</td>
                <td>${displayDate}</td>
                <td style="font-weight: 600;">${currentScore} / ${totalQs}</td>
                <td><span class="status-badge ${badgeClass}">${badgeText}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }
});