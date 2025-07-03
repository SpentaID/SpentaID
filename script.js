// script.js

// Object containing translations for different languages
const translations = {
    en: {
        pageTitle: "SpentaID: Your Universal Digital Identity",
        mainHeading: "SpentaID: Your Universal Digital Identity",
        descriptionText: "Unify your online presence with a single, secure SpentaID. Connect all your email services and digital accounts in one place.",
        yourIdIs: "Your SpentaID:",
        learnMoreButton: "Learn More",
        selectLanguage: "Select Language:",
        linkAccountsHeading: "Link Your Accounts",
        linkAccountsDescription: "Connect your existing Gmail, Outlook, ProtonMail, and other accounts to seamlessly manage your digital life from SpentaID.",
        getStartedButton: "Get Started",
        footerText: "⚡ Powered by Spenta - Innovating Digital Identity ⚡"
    },
    fa: {
        pageTitle: "سپنتاآیدی: هویت دیجیتال جهانی شما",
        mainHeading: "سپنتاآیدی: هویت دیجیتال جهانی شما",
        descriptionText: "حضور آنلاین خود را با یک سپنتاآیدی امن و یکپارچه کنید. تمامی سرویس‌های ایمیل و حساب‌های دیجیتال خود را در یک مکان متصل نمایید.",
        yourIdIs: "سپنتاآیدی شما:",
        learnMoreButton: "بیشتر بدانید",
        selectLanguage: "انتخاب زبان:",
        linkAccountsHeading: "حساب‌های خود را متصل کنید",
        linkAccountsDescription: "حساب‌های جیمیل، اوت‌لوک، پروتون‌میل و سایر حساب‌های موجود خود را متصل کنید تا زندگی دیجیتال خود را به آسانی از طریق سپنتاآیدی مدیریت نمایید.",
        getStartedButton: "شروع کنید",
        footerText: "⚡ با افتخار از سپنتا - نوآور در هویت دیجیتال ⚡"
    }
};

// Function to change the language of the page
function changeLanguage(lang) {
    // Set text direction based on language (RTL for Persian)
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.body.style.fontFamily = lang === 'fa' ? "'Vazirmatn', sans-serif" : "'Poppins', sans-serif";

    // Get all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update the title specifically
    document.title = translations[lang].pageTitle;

    // Save the selected language to local storage
    localStorage.setItem('selectedLanguage', lang);
}

// Function to set the initial language when the page loads
function setInitialLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en'; // Default to English if no language is saved
    document.getElementById('language-select').value = savedLanguage;
    changeLanguage(savedLanguage);
}

// Call setInitialLanguage when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setInitialLanguage);

// Placeholder for future account linking logic
function linkAccount(provider) {
    console.log(`Attempting to link with ${provider}... (Functionality to be implemented)`);
    // Here we will add logic for OAuth 2.0 or other authentication flows
    alert(`Linking with ${provider} is not yet implemented. Stay tuned!`);
}

// Add event listeners for account linking icons
document.querySelector('.account-icons').addEventListener('click', (event) => {
    const img = event.target;
    if (img.tagName === 'IMG' && img.alt) {
        linkAccount(img.alt);
    }
});
