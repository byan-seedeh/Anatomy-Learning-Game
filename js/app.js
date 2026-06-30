import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log(`${CONFIG.GAME_TITLE} Initialized.`);
    // สามารถใส่ Logic อื่นๆ เช่น การเช็กสถานะการล็อกอิน หรือล้างข้อมูล Session เก่าตรงนี้ได้
});