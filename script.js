// script.js

// IMPORTANT: Replace 'Pirozpersian' with your actual PythonAnywhere username!
const BACKEND_API_BASE_URL = 'https://Pirozpersian.pythonanywhere.com'; // Your SpentaID-Back-End URL

// Object containing translations for different languages
const translations = {
    en: {
        pageTitle: "SpentaID: Your Universal Digital Identity",
        mainHeading: "SpentaID: Your Universal Digital Identity",
        descriptionText: "Unify your online presence with a single, secure SpentaID. Connect all your email services and digital accounts in one place.",
        createYourId: "Create Your SpentaID:",
        enterUsernamePlaceholder: "Enter desired username",
        generateIdButton: "Generate SpentaID",
        learnMoreButton: "Learn More",
        selectLanguage: "Select Language:",
        linkAccountsHeading: "Link Your Accounts",
        linkAccountsDescription: "Connect your existing Gmail, Outlook, ProtonMail, and other accounts to seamlessly manage your digital life from SpentaID.",
        getStartedButton: "Get Started",
        footerText: "⚡ Powered by Spenta - Innovating Digital Identity ⚡",
        // Messages
        generatingId: "Generating SpentaID...",
        idGeneratedSuccess: "SpentaID created successfully!",
        idGenerationFailed: "Failed to create SpentaID: ",
        errorFetching: "Network error. Please try again later.",
        linkingAccount: "Linking with ",
        notImplemented: " is not yet implemented. Stay tuned!",
        usernameRequired: "Please enter a username.",
        invalidUsername: "Invalid username.", // This will be replaced by backend specific error
        genericError: "An unexpected error occurred."
    },
    fa: {
        pageTitle: "سپنتاآیدی: هویت دیجیتال جهانی شما",
        mainHeading: "سپنتاآیدی: هویت دیجیتال جهانی شما",
        descriptionText: "حضور آنلاین خود را با یک سپنتاآیدی امن و یکپارچه کنید. تمامی سرویس‌های ایمیل و حساب‌های دیجیتال خود را در یک مکان متصل نمایید.",
        createYourId: "سپنتاآیدی خود را بسازید:",
        enterUsernamePlaceholder: "نام کاربری دلخواه خود را وارد کنید",
        generateIdButton: "ساخت سپنتاآیدی",
        learnMoreButton: "بیشتر بدانید",
        selectLanguage: "انتخاب زبان:",
        linkAccountsHeading: "حساب‌های خود را متصل کنید",
        linkAccountsDescription: "حساب‌های جیمیل، اوت‌لوک، پروتون‌میل و سایر حساب‌های موجود خود را متصل کنید تا زندگی دیجیتال خود را به آسانی از طریق سپنتاآیدی مدیریت نمایید.",
        getStartedButton: "شروع کنید",
        footerText: "⚡ با افتخار از سپنتا - نوآور در هویت دیجیتال ⚡",
        // Messages
        generatingId: "در حال ساخت سپنتاآیدی...",
        idGeneratedSuccess: "سپنتاآیدی با موفقیت ایجاد شد!",
        idGenerationFailed: "خطا در ساخت سپنتاآیدی: ",
        errorFetching: "خطای شبکه. لطفاً بعداً دوباره امتحان کنید.",
        linkingAccount: "در حال اتصال به ",
        notImplemented: " هنوز پیاده‌سازی نشده است. با ما همراه باشید!",
        usernameRequired: "لطفاً نام کاربری را وارد کنید.",
        invalidUsername: "نام کاربری نامعتبر است.", // This will be replaced by backend specific error
        genericError: "خطای غیرمنتظره‌ای رخ داد."
    }
};

// Function to change the language of the page
function changeLanguage(lang) {
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.body.style.fontFamily = lang === 'fa' ? "'Vazirmatn', sans-serif" : "'Poppins', sans-serif";

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Handle placeholder translation
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    document.title = translations[lang].pageTitle;
    localStorage.setItem('selectedLanguage', lang);
}

// Function to set the initial language when the page loads
function setInitialLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    document.getElementById('language-select').value = savedLanguage;
    changeLanguage(savedLanguage);
}

// Function to send username to backend and get SpentaID
async function generateSpentaId() {
    const usernameInput = document.getElementById('usernameInput');
    const displaySpentaId = document.getElementById('displaySpentaId');
    const statusMessage = document.getElementById('statusMessage');
    const username = usernameInput.value.trim();
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    displaySpentaId.textContent = ''; // Clear previous ID
    statusMessage.textContent = ''; // Clear previous messages
    statusMessage.style.color = ''; // Reset color

    if (!username) {
        statusMessage.textContent = translations[currentLang].usernameRequired;
        statusMessage.style.color = 'orange'; // Warning color
        return;
    }

    statusMessage.textContent = translations[currentLang].generatingId;
    statusMessage.style.color = 'white'; // Info color

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
            displaySpentaId.textContent = data.spenta_id;
            statusMessage.textContent = translations[currentLang].idGeneratedSuccess;
            statusMessage.style.color = 'var(--color-green-light)'; // Success color
        } else {
            // Handle specific errors from backend
            const errorMessage = data.error || translations[currentLang].genericError;
            statusMessage.textContent = translations[currentLang].idGenerationFailed + errorMessage;
            statusMessage.style.color = 'red'; // Error color
        }
    } catch (error) {
        console.error('Error generating SpentaID:', error);
        statusMessage.textContent = translations[currentLang].errorFetching;
        statusMessage.style.color = 'red'; // Error color
    }
}

// Placeholder for future account linking logic
function linkAccount(provider) {
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    alert(translations[currentLang].linkingAccount + provider + translations[currentLang].notImplemented);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    setInitialLanguage(); // Set language on page load

    // Event listener for Generate SpentaID button
    document.getElementById('generateIdButton').addEventListener('click', generateSpentaId);

    // Event listener for account linking icons
    document.querySelector('.account-icons').addEventListener('click', (event) => {
        const img = event.target;
        if (img.tagName === 'IMG' && img.alt) {
            linkAccount(img.alt);
        }
    });
});
