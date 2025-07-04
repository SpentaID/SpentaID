// script.js

// IMPORTANT: Replace 'Pirozpersian' with your actual PythonAnywhere username!
const BACKEND_API_BASE_URL = 'https://Pirozpersian.pythonanywhere.com'; // Your SpentaID-Back-End URL

// Global state for registration steps
let currentStep = 1;
const totalSteps = 4; // We have 4 steps in HTML, though only 2 are functional now

// Object containing translations for different languages
const translations = {
    en: {
        pageTitle: "SpentaID: Your Universal Digital Identity",
        mainHeading: "SpentaID",
        descriptionText: "Unify your online presence with a single, secure SpentaID. Connect all your email services and digital accounts in one place.",
        // Registration steps
        step1Heading: "Choose Your SpentaID",
        createYourIdPrompt: "Pick a unique username for your universal digital identity.",
        enterUsernamePlaceholder: "Enter desired username",
        nextButton: "Next",
        step2Heading: "Verify Your Email",
        enterEmailPrompt: "Please enter your email address to receive a verification code.",
        enterEmailPlaceholder: "Enter your email",
        sendCodeButton: "Send Code",
        backButton: "Back",
        step3Heading: "Enter Verification Code", // Future
        enterCodePrompt: "A 6-digit code has been sent to your email. Please enter it below.", // Future
        enterCodePlaceholder: "Enter 6-digit code", // Future
        verifyCodeButton: "Verify Code", // Future
        step4Heading: "Set Your Password", // Future
        setPasswordPrompt: "Choose a strong password for your SpentaID.", // Future
        enterPasswordPlaceholder: "Enter password", // Future
        confirmPasswordPlaceholder: "Confirm password", // Future
        finishButton: "Finish Registration", // Future
        // Account linking
        linkAccountsHeading: "Link Your Accounts",
        linkAccountsDescription: "Connect your existing Gmail, Outlook, ProtonMail, and other accounts to seamlessly manage your digital life from SpentaID.",
        getStartedButton: "Get Started",
        footerText: "⚡ Powered by Spenta - Innovating Digital Identity ⚡",
        // Settings Modal
        settingsHeading: "Settings",
        selectLanguageModal: "Language:",
        // Messages
        usernameRequired: "Please enter a username.",
        emailRequired: "Please enter your email.",
        generatingId: "Checking username...", // Updated message
        usernameAvailable: "Username is available. Please proceed.", // New message
        usernameTaken: "Username is already taken or invalid. Please choose another.", // New message
        invalidEmail: "Please enter a valid email address.", // New message
        sendingCode: "Sending verification code...", // New message
        codeSentSuccess: "Verification code sent! Check your inbox.", // New message
        codeSentFailed: "Failed to send code. Please try again.", // New message
        // Existing messages
        idGeneratedSuccess: "SpentaID created successfully!", // Will be used later for full registration success
        idGenerationFailed: "Failed to create SpentaID: ", 
        errorFetching: "Network error. Please try again later.",
        linkingAccount: "Linking with ",
        notImplemented: " is not yet implemented. Stay tuned!",
        genericError: "An unexpected error occurred."
    },
    fa: {
        pageTitle: "سپنتاآیدی: هویت دیجیتال جهانی شما",
        mainHeading: "سپنتاآیدی",
        descriptionText: "حضور آنلاین خود را با یک سپنتاآیدی امن و یکپارچه کنید. تمامی سرویس‌های ایمیل و حساب‌های دیجیتال خود را در یک مکان متصل نمایید.",
        // Registration steps
        step1Heading: "سپنتاآیدی خود را انتخاب کنید",
        createYourIdPrompt: "یک نام کاربری منحصر به فرد برای هویت دیجیتال جهانی خود برگزینید.",
        enterUsernamePlaceholder: "نام کاربری دلخواه خود را وارد کنید",
        nextButton: "بعدی",
        step2Heading: "ایمیل خود را تأیید کنید",
        enterEmailPrompt: "لطفاً آدرس ایمیل خود را برای دریافت کد تأیید وارد کنید.",
        enterEmailPlaceholder: "ایمیل خود را وارد کنید",
        sendCodeButton: "ارسال کد",
        backButton: "بازگشت",
        step3Heading: "کد تأیید را وارد کنید", // Future
        enterCodePrompt: "کد ۶ رقمی به ایمیل شما ارسال شد. لطفاً آن را در زیر وارد کنید.", // Future
        enterCodePlaceholder: "کد ۶ رقمی را وارد کنید", // Future
        verifyCodeButton: "تأیید کد", // Future
        step4Heading: "رمز عبور خود را تعیین کنید", // Future
        setPasswordPrompt: "یک رمز عبور قوی برای سپنتاآیدی خود انتخاب کنید.", // Future
        enterPasswordPlaceholder: "رمز عبور را وارد کنید", // Future
        confirmPasswordPlaceholder: "تأیید رمز عبور", // Future
        finishButton: "تکمیل ثبت‌نام", // Future
        // Account linking
        linkAccountsHeading: "حساب‌های خود را متصل کنید",
        linkAccountsDescription: "حساب‌های جیمیل، اوت‌لوک، پروتون‌میل و سایر حساب‌های موجود خود را متصل کنید تا زندگی دیجیتال خود را به آسانی از طریق سپنتاآیدی مدیریت نمایید.",
        getStartedButton: "شروع کنید",
        footerText: "⚡ با افتخار از سپنتا - نوآور در هویت دیجیتال ⚡",
        // Settings Modal
        settingsHeading: "تنظیمات",
        selectLanguageModal: "زبان:",
        // Messages
        usernameRequired: "لطفاً نام کاربری را وارد کنید.",
        emailRequired: "لطفاً ایمیل خود را وارد کنید.",
        generatingId: "در حال بررسی نام کاربری...", // Updated message
        usernameAvailable: "نام کاربری در دسترس است. لطفاً ادامه دهید.", // New message
        usernameTaken: "نام کاربری قبلاً استفاده شده یا نامعتبر است. لطفاً نام دیگری انتخاب کنید.", // New message
        invalidEmail: "لطفاً یک آدرس ایمیل معتبر وارد کنید.", // New message
        sendingCode: "در حال ارسال کد تأیید...", // New message
        codeSentSuccess: "کد تأیید ارسال شد! صندوق ورودی خود را بررسی کنید.", // New message
        codeSentFailed: "ارسال کد ناموفق بود. لطفاً دوباره تلاش کنید.", // New message
        // Existing messages
        idGeneratedSuccess: "سپنتاآیدی با موفقیت ایجاد شد!",
        idGenerationFailed: "خطا در ساخت سپنتاآیدی: ", 
        errorFetching: "خطای شبکه. لطفاً بعداً دوباره امتحان کنید.",
        linkingAccount: "در حال اتصال به ",
        notImplemented: " هنوز پیاده‌سازی نشده است. با ما همراه باشید!",
        genericError: "خطای غیرمنتظره‌ای رخ داد."
    }
};

// --- Core UI & Language Management ---

function changeLanguage(lang) {
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.body.style.fontFamily = lang === 'fa' ? "'Vazirmatn', sans-serif" : "'Poppins', sans-serif";

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    document.title = translations[lang].pageTitle;
    localStorage.setItem('selectedLanguage', lang);
    updateModalLanguageSelector(lang);
}

function updateModalLanguageSelector(lang) {
    const modalLangSelect = document.getElementById('modal-language-select');
    if (modalLangSelect) {
        modalLangSelect.value = lang;
    }
}

function setInitialLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    changeLanguage(savedLanguage); // This also updates modal selector
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.style.display = 'none'; // Ensure modal is hidden on load
    }
}

// --- Multi-Step Form Management ---

function showStep(stepNumber) {
    const steps = document.querySelectorAll('.registration-step');
    steps.forEach(step => {
        step.classList.remove('active-step');
        // Reset message for next step
        const messageElement = step.querySelector('.message-text');
        if (messageElement) {
            messageElement.textContent = '';
            messageElement.style.color = '';
        }
    });
    document.getElementById(`step${stepNumber}`).classList.add('active-step');
    currentStep = stepNumber;
}

function displayStatusMessage(message, type = 'info') {
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    const messageElement = document.getElementById(`usernameStatusMessage`); // Default to username for now
    
    // Dynamically select message element based on current step
    if (currentStep === 1) {
        messageElement.id = 'usernameStatusMessage';
    } else if (currentStep === 2) {
        messageElement.id = 'emailStatusMessage';
    }
    // Add more conditions for step 3, 4 later

    messageElement.textContent = message;
    if (type === 'error') {
        messageElement.style.color = 'red';
    } else if (type === 'success') {
        messageElement.style.color = 'var(--color-green-light)';
    } else if (type === 'warning') {
        messageElement.style.color = 'orange';
    } else {
        messageElement.style.color = 'white'; // Info
    }
}

// --- SpentaID Generation (Step 1 Logic) ---

async function handleStep1Next() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    displayStatusMessage('', 'info'); // Clear previous message

    if (!username) {
        displayStatusMessage(translations[currentLang].usernameRequired, 'warning');
        return;
    }

    displayStatusMessage(translations[currentLang].generatingId, 'info');

    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/generate-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username }),
        });

        const data = await response.json();

        if (response.ok) {
            // SpentaID is successfully generated/validated by backend
            // For now, we'll store it as a temporary variable
            window.tempSpentaId = data.spenta_id; // Store for later use
            displayStatusMessage(translations[currentLang].usernameAvailable, 'success');
            // Transition to Step 2
            setTimeout(() => { // Small delay for user to read message
                showStep(2);
            }, 1000); 
        } else {
            const errorMessage = data.error || translations[currentLang].genericError;
            displayStatusMessage(translations[currentLang].usernameTaken + errorMessage, 'error'); // More specific message
        }
    } catch (error) {
        console.error('Error generating SpentaID:', error);
        displayStatusMessage(translations[currentLang].errorFetching, 'error');
    }
}

// --- Email Verification (Step 2 Logic) ---
async function handleStep2SendCode() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    displayStatusMessage('', 'info'); // Clear previous message

    if (!email) {
        displayStatusMessage(translations[currentLang].emailRequired, 'warning');
        return;
    }

    // Basic email validation regex (can be more robust)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        displayStatusMessage(translations[currentLang].invalidEmail, 'warning');
        return;
    }

    displayStatusMessage(translations[currentLang].sendingCode, 'info');

    // --- FUTURE BACKEND INTEGRATION FOR SENDING EMAIL CODE ---
    // This is where you would send a request to your backend to send an email.
    // For now, we'll simulate success.
    try {
        // const response = await fetch(`${BACKEND_API_BASE_URL}/api/send-email-code`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email: email, spenta_id: window.tempSpentaId })
        // });
        // const data = await response.json();

        // if (response.ok) {
        //     displayStatusMessage(translations[currentLang].codeSentSuccess, 'success');
        //     setTimeout(() => { showStep(3); }, 1000); // Go to step 3 after successful code send
        // } else {
        //     displayStatusMessage(translations[currentLang].codeSentFailed + (data.error || ''), 'error');
        // }
        
        // --- SIMULATED SUCCESS FOR NOW ---
        setTimeout(() => {
            displayStatusMessage(translations[currentLang].codeSentSuccess, 'success');
            setTimeout(() => { showStep(3); }, 1500); // Move to step 3 after a short delay
        }, 1500); // Simulate network delay
        // --- END SIMULATION ---

    } catch (error) {
        console.error('Error sending email code:', error);
        displayStatusMessage(translations[currentLang].errorFetching, 'error');
    }
}


// --- Modal & General Event Listeners ---

const settingsModal = document.getElementById('settingsModal');
const settingsIcon = document.getElementById('settingsIcon');
const closeSettingsModalButton = document.getElementById('closeSettingsModal');

function openModal(modalElement) {
    modalElement.style.display = 'flex';
}

function closeModal(modalElement) {
    modalElement.style.display = 'none';
}

// Placeholder for future account linking logic
function linkAccount(provider) {
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    alert(translations[currentLang].linkingAccount + provider + translations[currentLang].notImplemented);
}

document.addEventListener('DOMContentLoaded', () => {
    setInitialLanguage(); // Set language on page load
    showStep(1); // Ensure Step 1 is shown initially

    // Event listeners for multi-step form navigation
    document.getElementById('nextToStep2Button').addEventListener('click', handleStep1Next);
    document.getElementById('backToStep1Button').addEventListener('click', () => showStep(1));
    document.getElementById('nextToStep3Button').addEventListener('click', handleStep2SendCode); // For sending email code
    document.getElementById('backToStep2Button').addEventListener('click', () => showStep(2)); // Back from future Step 3

    // Event listeners for settings modal
    if (settingsIcon) {
        settingsIcon.addEventListener('click', () => openModal(settingsModal));
    }
    if (closeSettingsModalButton) {
        closeSettingsModalButton.addEventListener('click', () => closeModal(settingsModal));
    }
    window.addEventListener('click', (event) => {
        if (event.target == settingsModal) {
            closeModal(settingsModal);
        }
    });

    // Handle language change from modal select
    const modalLangSelect = document.getElementById('modal-language-select');
    if (modalLangSelect) {
        modalLangSelect.addEventListener('change', (event) => {
            changeLanguage(event.target.value);
            // closeModal(settingsModal); // Removed: as per your request, the modal now closes automatically when language is changed via select's onchange in HTML
        });
    }

    // Event listener for account linking icons
    document.querySelector('.account-icons').addEventListener('click', (event) => {
        const img = event.target;
        if (img.tagName === 'IMG' && img.alt) {
            linkAccount(img.alt);
        }
    });
});
