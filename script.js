const menuBtn = document.getElementById('menu-btn');
const navRight = document.querySelector('.nav-right');

document.addEventListener('click', function(event) {
    const isClickInsideNav = navRight.contains(event.target);
    const isClickOnMenuBtn = event.target.closest('.menu-label') || event.target.closest('#menu-btn');
    
    if (!isClickInsideNav && !isClickOnMenuBtn && menuBtn.checked) {
        menuBtn.checked = false;
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const openDemoBtn = document.getElementById('openDemoBtn');
    const closeDemoBtn = document.getElementById('closeDemo');
    const demoModal = document.getElementById('demoModal');
    const demoForm = document.getElementById('demoForm'); // النموذج نفسه

    // دالة لفتح الـ Modal
    function openModal() {
        demoModal.style.display = 'flex'; // اجعل الـ Modal مرئيًا (flex لتوسيطه)
        document.body.style.overflow = 'hidden'; // لمنع التمرير في الخلفية
        demoModal.setAttribute('aria-hidden', 'false'); // لتسهيل الوصول
    }

    // دالة لإغلاق الـ Modal
    function closeModal() {
        demoModal.style.display = 'none'; // إخفاء الـ Modal
        document.body.style.overflow = ''; // إعادة التمرير للخلفية
        demoModal.setAttribute('aria-hidden', 'true'); // لتسهيل الوصول
        demoForm.reset(); // إفراغ حقول النموذج عند الإغلاق
        // يمكنك إضافة أي منطق آخر هنا لإعادة تعيين حالة النموذج
    }

    // فتح الـ Modal عند النقر على الزر
    if (openDemoBtn) {
        openDemoBtn.addEventListener('click', openModal);
    }

    // إغلاق الـ Modal عند النقر على زر الإغلاق (X)
    if (closeDemoBtn) {
        closeDemoBtn.addEventListener('click', closeModal);
    }

    // إغلاق الـ Modal عند النقر خارج الـ Modal نفسه (على الخلفية الداكنة)
    if (demoModal) {
        demoModal.addEventListener('click', (event) => {
            // تأكد أن النقر كان على الخلفية وليس داخل مربع الـ modal
            if (event.target === demoModal) {
                closeModal();
            }
        });
    }

    // إغلاق الـ Modal عند الضغط على مفتاح Esc
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && demoModal.style.display === 'flex') {
            closeModal();
        }
    });

    // يمكنك إضافة منطق معالجة إرسال النموذج هنا
    if (demoForm) {
        demoForm.addEventListener('submit', (event) => {
            event.preventDefault(); // منع الإرسال الافتراضي للصفحة
            // هنا يمكنك جمع بيانات النموذج وإرسالها إلى الخادم باستخدام Fetch API أو XMLHttpRequest
            console.log('Form submitted!');
            // بعد الإرسال بنجاح، يمكنك إغلاق الـ Modal
            // closeModal(); 
            // أو إظهار رسالة نجاح
            document.getElementById('formMsg').textContent = 'Thank you for your request!';
        });
    }
});