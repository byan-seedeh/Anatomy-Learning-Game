/**
 * js/animation.js
 * ระบบควบคุมแอนิเมชันและการเรนเดอร์รูปภาพโครงสร้างสรีรวิทยา (Anatomy Visuals)
 * ผ่านการตรวจสอบความถูกต้องของพาธไฟล์รูปภาพ (.jpg) สำหรับกลุ่มอาการ Office Syndrome ทั้ง 3 จุดหลัก
 */

export const Animation = {
    /**
     * ฟังก์ชันสำหรับเรนเดอร์และจัดการแสดงผลรูปภาพอนาโตมีในกล่องคอนเทนเนอร์
     * @param {string} containerId - ID ของ Element ที่จะนำรูปภาพไปใส่ (เช่น 'anatomy-visual-container')
     * @param {string} anatomyType - คีย์ระบุจุดอนาโตมี ('lumbar', 'median_nerve', 'trapezius')
     */
    renderAnatomyVisual(containerId, anatomyType) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`ไม่พบ Container ID: ${containerId} สำหรับแสดงรูปภาพอนาโตมี`);
            return;
        }

        // ล้างรูปภาพเก่าที่ค้างอยู่ในกล่องออกก่อนเพื่อเตรียมเรนเดอร์รูปใหม่แบบ Dynamic
        container.innerHTML = '';

        // สร้าง Element รูปภาพขึ้นมาใหม่ใน DOM
        const imgElement = document.createElement('img');
        
        // ใส่ Class สำหรับเรียกใช้งาน CSS Animation เอฟเฟกต์ค่อยๆ โผล่ (Fade In)
        imgElement.className = 'anatomy-img fade-in'; 
        
        // ตรวจสอบและสลับพาธไฟล์รูปภาพให้ตรงตามชื่อไฟล์และนามสกุลจริง (.jpg) ในโฟลเดอร์ assests/images/
        switch (anatomyType) {
            case 'lumbar':
                imgElement.src = 'assests/images/Lumbar.jpg'; 
                imgElement.alt = 'หมอนรองกระดูกสันหลังส่วนเอว (Lumbar Disc)';
                break;
                
            case 'median_nerve':
                imgElement.src = 'assests/images/Nerve.jpg';
                imgElement.alt = 'โพรงข้อมือและเส้นประสาท (Median Nerve)';
                break;
                
            case 'trapezius':
                imgElement.src = 'assests/images/Trapezius.jpg';
                imgElement.alt = 'กล้ามเนื้อคอ บ่า สะบัก (Trapezius)';
                break;
                
            default:
                // Fallback ป้องกันกรณีฉุกเฉินหาคีย์ไม่เจอ ให้แสดงผลรูปแรกสุดเพื่อความปลอดภัยของ UI
                imgElement.src = 'assests/images/Lumbar.jpg';
                imgElement.alt = 'Anatomy Visual';
        }

        // จัดสไตล์โครงสร้างแบบ Modern Clean บังคับขนาดให้พอดีกับกรอบการ์ดฝั่งซ้าย ไม่หลุดขอบและไม่บิดเบี้ยว
        imgElement.style.width = '100%';
        imgElement.style.height = '100%';
        imgElement.style.objectFit = 'contain'; // รักษาอัตราส่วนดั้งเดิมของภาพ ไม่ให้สัดส่วนเพี้ยน
        imgElement.style.borderRadius = '12px';

        // แทรก Element รูปภาพเข้าสู่กล่องแสดงผลบนหน้าจอเกม
        container.appendChild(imgElement);
    },

    /**
     * แอนิเมชันจำลองเอฟเฟกต์การสั่นเตือนเบาๆ (Shake Effect) เมื่อผู้เรียนกดตอบคำถามผิด
     * @param {HTMLElement} element - ตัว Element ช้อยส์ที่ต้องการสั่งให้เล่นแอนิเมชันสั่น
     */
    playShakeAnimation(element) {
        if (!element) return;
        element.classList.add('shake-effect');
        setTimeout(() => {
            element.classList.remove('shake-effect');
        }, 500); // เคลียร์ Class ออกหลังจากแอนิเมชันสั่นทำงานเสร็จสิ้นภายใน 0.5 วินาที
    }
};