const menuBtn = document.getElementById('menu-btn');
const navRight = document.querySelector('.nav-right');

document.addEventListener('click', function (event) {
    const isClickInsideNav = navRight.contains(event.target);
    const isClickOnMenuBtn = event.target.closest('.menu-label') || event.target.closest('#menu-btn');

    if (!isClickInsideNav && !isClickOnMenuBtn && menuBtn.checked) {
        menuBtn.checked = false;
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const closeDemoBtn = document.getElementById('closeDemo');
    const demoModal = document.getElementById('demoModal');
    const demoForm = document.getElementById('demoForm'); // النموذج نفسه

    // دالة لفتح الـ Modal
   // دالة لفتح الـ Modal (مُلغمة بالكلاس)
function openModal() {
    // 1. اجعل الـ Modal مرئيًا (نستخدم flex لتوسيطه)
    demoModal.style.display = 'flex'; 

    // 2. أضف الكلاس بعد فترة قصيرة لتفعيل الـ transition
    setTimeout(() => {
        demoModal.classList.add('is-visible'); 
    }, 10); // تأخير بسيط جداً (10 ميلي ثانية) لإعطاء المتصفح وقتًا لتطبيق display: flex قبل الانتقال

    document.body.style.overflow = 'hidden'; 
    demoModal.setAttribute('aria-hidden', 'false'); 
}

// دالة لإغلاق الـ Modal (مُلغمة بالكلاس)
function closeModal() {
    // 1. أزل كلاس الرؤية لبدء حركة الإخفاء (الشفافية والتحجيم)
    demoModal.classList.remove('is-visible'); 
    
    // 2. انتظر حتى تكتمل حركة الـ transition (0.3 ثانية) قبل إخفاء العنصر تماماً
    demoModal.addEventListener('transitionend', function handler() {
        if (!demoModal.classList.contains('is-visible')) {
             demoModal.style.display = 'none'; // إخفاء الـ Modal بعد انتهاء الحركة
        }
        demoModal.removeEventListener('transitionend', handler); // إزالة الـ listener بعد التنفيذ
    });

    document.body.style.overflow = ''; 
    demoModal.setAttribute('aria-hidden', 'true'); 
    demoForm.reset(); 
}
    // فتح الـ Modal عند النقر على أي زر من الأزرار
    const openDemoButtons = document.querySelectorAll('.open-demo-btn');
    openDemoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            openModal();
        });
    });

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

    // Form submission handler
    if (demoForm) {
        demoForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            // Collect form data into the specified object format
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                company: document.getElementById('company').value.trim(),
                country: document.getElementById('country').value.trim(),
                stores: document.getElementById('stores').value,
                pos: document.getElementById('pos').value.trim(),
                message: document.getElementById('message').value.trim(),
                hp: document.getElementById('hp').value.trim() // honeypot field
            };

            // Disable submit button and show loading state
            const submitBtn = demoForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            document.getElementById('formMsg').textContent = '';

            try {
                // Submit to API endpoint
                const response = await fetch('https://tenzobi.com/api/demo.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                // Try to parse response as JSON
                let responseData = {};
                try {
                    const text = await response.text();
                    responseData = text ? JSON.parse(text) : {};
                } catch (parseError) {
                    // If response is not JSON, that's okay
                    console.log('Response is not JSON');
                }

                if (response.ok || response.status === 200) {
                    // Success: close modal and show success toast
                    closeModal();
                    showToast('Success! Your demo request has been submitted.', 'success');
                } else {
                    // Error: show error toast
                    const errorMessage = responseData.message || responseData.error || `Error ${response.status}: ${response.statusText}` || 'An error occurred. Please try again.';
                    showToast(errorMessage, 'error');
                }
            } catch (error) {
                // Network or other error
                console.error('Form submission error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Toast notification function
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.className = `toast toast-${type} toast-show`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('toast-show');
        }, 5000);
    }
});