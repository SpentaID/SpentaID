// script.js

// IMPORTANT: Replace 'Pirozpersian' with your actual PythonAnywhere username!
const BACKEND_API_BASE_URL = 'https://Pirozpersian.pythonanywhere.com'; // Your SpentaID-Back-End URL

// Global state for authentication flow
let currentAuthStep = 'authStep1'; // Now using string IDs for steps
// To store data (username/email, password etc.) temporarily during authentication flow
let currentAuthData = {
    identifier: '', // Can be username or email
    username: '',   // The actual SpentaID username (if different from identifier)
    email: '',
    spenta_id: '',
    isLogin: false, // True if user is logging in, false if registering
    isResettingPassword: false, // True if user is in password reset flow
    reset_token: '' // Store reset token temporarily
};

// Object containing translations for different languages
const translations = {
    en: {
        pageTitle: "SpentaID: Your Universal Digital Identity",
        mainHeading: "SpentaID",
        descriptionText: "Unify your online presence with a single, secure SpentaID. Connect all your email services and digital accounts in one place.",
        // Authentication Steps (Unified for Login/Register)
        authStep1Heading: "Login or Register",
        authStep1Prompt: "Enter your SpentaID username or email address.",
        identifierPlaceholder: "Username or Email",
        proceedButton: "Proceed",
        // Login Step 2
        loginStep2Heading: "Enter Password",
        loginStep2Prompt: "Please enter your password for {identifier}.",
        passwordPlaceholder: "Password",
        forgotPassword: "Forgot Password?",
        loginButton: "Login",
        // Registration Step 2 (Email)
        regStep2Heading: "Verify Your Email",
        regStep2Prompt: "Please enter your email address for {username} to receive a verification code.",
        enterEmailPlaceholder: "Enter your email",
        sendCodeButton: "Send Code",
        // Verification Code Step 3
        verifyCodeStep3Heading: "Enter Verification Code",
        verifyCodeStep3Prompt: "A 6-digit code has been sent to {email}. Please enter it below.",
        enterCodePlaceholder: "Enter 6-digit code",
        verifyCodeButton: "Verify Code",
        // Password Setup Step 4
        setPasswordStep4Heading: "Set Your Password",
        setPasswordStep4Prompt: "Choose a strong password for your SpentaID.",
        enterPasswordPlaceholder: "Enter password",
        confirmPasswordPlaceholder: "Confirm password",
        finishButton: "Complete",
        // Password Reset Request Step
        resetRequestHeading: "Reset Your Password",
        resetRequestPrompt: "Enter the email associated with your SpentaID to receive a reset code.",
        sendResetCodeButton: "Send Reset Code",
        // Success Screen
        successHeading: "Welcome to SpentaID!",
        successMessage: "Your digital identity is ready. Your SpentaID is {spenta_id}.",
        goToDashboard: "Go to Dashboard",
        // Common Buttons
        backButton: "Back",
        // Account linking
        linkAccountsHeading: "Link Your Accounts",
        linkAccountsDescription: "Connect your existing Gmail, Outlook, ProtonMail, and other accounts to seamlessly manage your digital life from SpentaID.",
        getStartedButton: "Get Started",
        footerText: "⚡ Powered by Spenta - Innovating Digital Identity ⚡",
        // Settings Modal
        settingsHeading: "Settings",
        selectLanguageModal: "Language:",
        // Messages
        usernameOrEmailRequired: "Please enter your username or email.",
        checkingUser: "Checking user...",
        invalidIdentifierOrPassword: "Invalid username/email or password.",
        emailRequired: "Please enter your email.",
        invalidEmail: "Please enter a valid email address.",
        sendingCode: "Sending verification code...",
        codeSentSuccess: "Verification code sent! Check your inbox.",
        codeSentFailed: "Failed to send code. Please try again. Error: ",
        invalidCode: "Invalid or expired verification code.",
        passwordTooShort: "Password must be at least 8 characters.",
        passwordTooLong: "Password cannot exceed 50 characters.",
        passwordsMismatch: "Passwords do not match.",
        settingPassword: "Setting password...",
        passwordSetSuccess: "Password set successfully! Logging you in...",
        registrationComplete: "Registration complete! Logging you in...",
        errorFetching: "Network error. Please try again later.",
        genericError: "An unexpected error occurred.",
        emailNotVerifiedYet: "Email not verified. Please verify your email first.",
        resetSuccess: "Password reset successful! Logging you in..."
    },
    fa: {
        pageTitle: "سپنتاآیدی: هویت دیجیتال جهانی شما",
        mainHeading: "سپنتاآیدی",
        descriptionText: "حضور آنلاین خود را با یک سپنتاآیدی امن و یکپارچه کنید. تمامی سرویس‌های ایمیل و حساب‌های دیجیتال خود را در یک مکان متصل نمایید.",
        // Authentication Steps (Unified for Login/Register)
        authStep1Heading: "ورود یا ثبت‌نام",
        authStep1Prompt: "نام کاربری سپنتاآیدی یا آدرس ایمیل خود را وارد کنید.",
        identifierPlaceholder: "نام کاربری یا ایمیل",
        proceedButton: "ادامه",
        // Login Step 2
        loginStep2Heading: "رمز عبور را وارد کنید",
        loginStep2Prompt: "لطفاً رمز عبور خود را برای {identifier} وارد کنید.",
        passwordPlaceholder: "رمز عبور",
        forgotPassword: "رمز عبور را فراموش کرده‌اید؟",
        loginButton: "ورود",
        // Registration Step 2 (Email)
        regStep2Heading: "ایمیل خود را تأیید کنید",
        regStep2Prompt: "لطفاً آدرس ایمیل خود را برای {username} وارد کنید تا کد تأیید دریافت کنید.",
        enterEmailPlaceholder: "ایمیل خود را وارد کنید",
        sendCodeButton: "ارسال کد",
        // Verification Code Step 3
        verifyCodeStep3Heading: "کد تأیید را وارد کنید",
        verifyCodeStep3Prompt: "کد ۶ رقمی به {email} ارسال شد. لطفاً آن را در زیر وارد کنید.",
        enterCodePlaceholder: "کد ۶ رقمی را وارد کنید",
        verifyCodeButton: "تأیید کد",
        // Password Setup Step 4
        setPasswordStep4Heading: "رمز عبور خود را تعیین کنید",
        setPasswordStep4Prompt: "یک رمز عبور قوی برای سپنتاآیدی خود انتخاب کنید.",
        enterPasswordPlaceholder: "رمز عبور را وارد کنید",
        confirmPasswordPlaceholder: "تأیید رمز عبور",
        finishButton: "تکمیل",
        // Password Reset Request Step
        resetRequestHeading: "بازنشانی رمز عبور",
        resetRequestPrompt: "ایمیلی که با سپنتاآیدی خود مرتبط کرده‌اید را وارد کنید تا کد بازنشانی را دریافت نمایید.",
        sendResetCodeButton: "ارسال کد بازنشانی",
        // Success Screen
        successHeading: "به سپنتاآیدی خوش آمدید!",
        successMessage: "هویت دیجیتال شما آماده است. سپنتاآیدی شما {spenta_id} می‌باشد.",
        goToDashboard: "ورود به پنل",
        // Common Buttons
        backButton: "بازگشت",
        // Account linking
        linkAccountsHeading: "حساب‌های خود را متصل کنید",
        linkAccountsDescription: "حساب‌های جیمیل، اوت‌لوک، پروتون‌میل و سایر حساب‌های موجود خود را متصل کنید تا زندگی دیجیتال خود را به آسانی از طریق سپنتاآیدی مدیریت نمایید.",
        getStartedButton: "شروع کنید",
        footerText: "⚡ با افتخار از سپنتا - نوآور در هویت دیجیتال ⚡",
        // Settings Modal
        settingsHeading: "تنظیمات",
        selectLanguageModal: "زبان:",
        // Messages
        usernameOrEmailRequired: "لطفاً نام کاربری یا ایمیل خود را وارد کنید.",
        checkingUser: "در حال بررسی کاربر...",
        invalidIdentifierOrPassword: "نام کاربری/ایمیل یا رمز عبور نامعتبر است.",
        emailRequired: "لطفاً ایمیل خود را وارد کنید.",
        invalidEmail: "لطفاً یک آدرس ایمیل معتبر وارد کنید.",
        sendingCode: "در حال ارسال کد تأیید...",
        codeSentSuccess: "کد تأیید ارسال شد! صندوق ورودی خود را بررسی کنید.",
        codeSentFailed: "ارسال کد ناموفق بود. لطفاً دوباره تلاش کنید. خطا: ",
        invalidCode: "کد تأیید نامعتبر یا منقضی شده است.",
        passwordTooShort: "رمز عبور باید حداقل ۸ کاراکتر باشد.",
        passwordTooLong: "رمز عبور نمی‌تواند بیش از ۵۰ کاراکتر باشد.",
        passwordsMismatch: "رمزهای عبور با هم مطابقت ندارند.",
        settingPassword: "در حال تنظیم رمز عبور...",
        passwordSetSuccess: "رمز عبور با موفقیت تنظیم شد! در حال ورود شما...",
        registrationComplete: "ثبت‌نام تکمیل شد! در حال ورود شما...",
        errorFetching: "خطای شبکه. لطفاً بعداً دوباره امتحان کنید.",
        genericError: "خطای غیرمنتظره‌ای رخ داد.",
        emailNotVerifiedYet: "ایمیل تأیید نشده است. لطفاً ابتدا ایمیل خود را تأیید کنید.",
        resetSuccess: "بازنشانی رمز عبور موفقیت‌آمیز بود! در حال ورود شما..."
    }
};

// --- Core UI & Language Management ---

function changeLanguage(lang) {
    document.documentElement.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    document.body.style.fontFamily = lang === 'fa' ? "'Vazirmatn', sans-serif" : "'Poppins', sans-serif";

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        let text = translations[lang][key];
        
        // Handle dynamic text replacement based on currentAuthData
        if (key === 'loginStep2Prompt' && currentAuthData.identifier) {
             text = text.replace('{identifier}', currentAuthData.identifier);
        } else if (key === 'regStep2Prompt' && currentAuthData.username) {
            text = text.replace('{username}', currentAuthData.username);
        } else if (key === 'verifyCodeStep3Prompt' && currentAuthData.email) {
            text = text.replace('{email}', currentAuthData.email);
        } else if (key === 'successMessage' && currentAuthData.spenta_id) {
             text = text.replace('{spenta_id}', currentAuthData.spenta_id);
        }
        element.textContent = text;
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
    // Check if user is already logged in (e.g., from localStorage)
    const storedToken = localStorage.getItem('spentaAuthToken');
    const storedSpentaId = localStorage.getItem('spentaUserId');
    const storedUsername = localStorage.getItem('spentaUsername');

    if (storedToken && storedSpentaId && storedUsername) {
        // If logged in, show success screen or dashboard
        currentAuthData.spenta_id = storedSpentaId;
        currentAuthData.username = storedUsername;
        showAuthStep('successScreen');
    } else {
        showAuthStep('authStep1'); // Otherwise, start with auth step 1
    }
}

// --- Multi-Step Auth Form Management ---

function showAuthStep(stepId) {
    const steps = document.querySelectorAll('.auth-step');
    steps.forEach(step => {
        step.classList.remove('active-step');
        // Clear input values when switching steps, except for identifier (login/reg)
        const inputs = step.querySelectorAll('input');
        inputs.forEach(input => {
            if (step.id !== 'authStep1' && step.id !== 'resetRequestStep') { // Keep identifier for first step, and email for reset
                input.value = ''; 
            } else if (step.id === 'authStep1' && stepId !== 'authStep1') { // Clear identifier if moving FROM step 1
                 // input.value = ''; // Don't clear identifier if we are navigating back and forth in same session
            }
        });

        // Clear message for each step
        const messageElement = step.querySelector('.message-text'); 
        if (messageElement) {
            messageElement.textContent = '';
            messageElement.style.color = '';
        }
    });
    document.getElementById(stepId).classList.add('active-step');
    currentAuthStep = stepId;
    
    // Update dynamic text based on currentAuthData
    changeLanguage(localStorage.getItem('selectedLanguage') || 'en');
}

function displayStatusMessage(message, type = 'info', stepId = currentAuthStep) {
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    let messageElement;
    
    if (stepId === 'authStep1') messageElement = document.getElementById('authStatusMessage');
    else if (stepId === 'loginStep2') messageElement = document.getElementById('loginStatusMessage');
    else if (stepId === 'regStep2') messageElement = document.getElementById('regEmailStatusMessage');
    else if (stepId === 'verifyCodeStep3') messageElement = document.getElementById('verifyCodeStatusMessage');
    else if (stepId === 'setPasswordStep4') messageElement = document.getElementById('setPasswordStatusMessage');
    else if (stepId === 'resetRequestStep') messageElement = document.getElementById('resetRequestStatusMessage');


    if (messageElement) {
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
}

// --- Main Auth Flow Logic ---

async function handleAuthStep1Proceed() {
    const identifierInput = document.getElementById('identifierInput');
    const identifier = identifierInput.value.trim(); // Can be username or email
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    displayStatusMessage('', 'info', 'authStep1');

    if (!identifier) {
        displayStatusMessage(translations[currentLang].usernameOrEmailRequired, 'warning', 'authStep1');
        return;
    }

    displayStatusMessage(translations[currentLang].checkingUser, 'info', 'authStep1');

    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/check-user-exists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: identifier }),
        });

        const data = await response.json();

        if (response.ok) {
            currentAuthData.identifier = identifier; // Store identifier
            currentAuthData.isResettingPassword = false; // Reset reset flow status
            if (data.status === 'registered') {
                currentAuthData.isLogin = true;
                currentAuthData.username = data.username; // Backend provides username
                currentAuthData.spenta_id = data.spenta_id; // Backend provides spenta_id
                showAuthStep('loginStep2'); // Go to login password step
            } else if (data.status === 'unverified') {
                currentAuthData.isLogin = false; // User needs to complete registration
                currentAuthData.username = data.username; // Backend provides username
                currentAuthData.email = identifier; // Identifier is email for unverified user
                currentAuthData.spenta_id = data.spenta_id;
                showAuthStep('regStep2'); // Go to registration email step (to resend code)
                displayStatusMessage(translations[currentLang].unverifiedUserPrompt || translations[currentLang].regStep2Prompt.replace('{username}', data.username), 'warning', 'regStep2'); // Prompt to resend code
            } else if (data.status === 'new_username_reg') {
                currentAuthData.isLogin = false;
                currentAuthData.username = identifier; // Username is identifier
                showAuthStep('regStep2'); // Go to registration email step
            } else if (data.status === 'new_email_reg') {
                currentAuthData.isLogin = false;
                currentAuthData.email = identifier; // Email is identifier
                // For new email reg, we need to prompt for username.
                // For simplicity, let's assume username is derived from email or we ask them.
                // For now, let's just make it clear that a direct email registration for a new user isn't fully supported without a username.
                // In a real app, this would lead to a "Choose Username" step.
                displayStatusMessage(translations[currentLang].invalidIdentifierOrPassword + " (Please choose a username or a known email to proceed)", 'error', 'authStep1');
            }
        } else {
            const errorMessage = data.error || translations[currentLang].genericError;
            displayStatusMessage(errorMessage, 'error', 'authStep1'); // Display backend error
        }
    } catch (error) {
        console.error('Error checking user:', error);
        displayStatusMessage(translations[currentLang].errorFetching, 'error', 'authStep1');
    }
}

async function handleLogin() {
    const passwordInput = document.getElementById('loginPasswordInput');
    const password = passwordInput.value.trim();
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    displayStatusMessage('', 'info', 'loginStep2');

    if (!password) {
        displayStatusMessage(translations[currentLang].passwordRequired || 'Password is required.', 'warning', 'loginStep2');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: currentAuthData.identifier, password: password }),
        });
        const data = await response.json();

        if (response.ok) {
            // Successfully logged in or registered/reset and auto-logged in
            localStorage.setItem('spentaAuthToken', data.token); // Store token
            localStorage.setItem('spentaUserId', data.spenta_id); // Store SpentaID for display
            localStorage.setItem('spentaUsername', data.username); // Store username
            
            currentAuthData.spenta_id = data.spenta_id;
            currentAuthData.username = data.username;

            displayStatusMessage(translations[currentLang].loginButton + " successful!", 'success', 'loginStep2'); // Generic success for login

            setTimeout(() => {
                showAuthStep('successScreen');
            }, 1000);
        } else {
            const errorMessage = data.error || translations[currentLang].invalidIdentifierOrPassword;
            displayStatusMessage(errorMessage, 'error', 'loginStep2');
        }
    } catch (error) {
        console.error('Error during login:', error);
        displayStatusMessage(translations[currentLang].errorFetching, 'error', 'loginStep2');
    }
}

async function handleRegEmailSendCode() {
    const emailInput = document.getElementById('regEmailInput');
    const email = emailInput.value.trim();
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    displayStatusMessage('', 'info', 'regStep2');

    if (!email) {
        displayStatusMessage(translations[currentLang].emailRequired, 'warning', 'regStep2');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        displayStatusMessage(translations[currentLang].invalidEmail, 'warning', 'regStep2');
        return;
    }

    displayStatusMessage(translations[currentLang].sendingCode, 'info', 'regStep2');

    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/register/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentAuthData.username, email: email }),
        });
        const data = await response.json();

        if (response.ok) {
            currentAuthData.email = email; // Store email
            // console.log("DEBUG: Sent code (for testing):", data.sent_code); // For debugging only! Remove in prod.
            displayStatusMessage(translations[currentLang].codeSentSuccess, 'success', 'regStep2');
            setTimeout(() => { showAuthStep('verifyCodeStep3'); }, 1500); // Go to step 3 (Code Verification)
        } else {
            const errorMessage = data.error || translations[currentLang].genericError;
            displayStatusMessage(translations[currentLang].codeSentFailed + errorMessage, 'error', 'regStep2');
        }
    } catch (error) {
        console.error('Error sending email code:', error);
        displayStatusMessage(translations[currentLang].errorFetching, 'error', 'regStep2');
    }
}

async function handleVerifyCode() {
    const codeInput = document.getElementById('verificationCodeInput');
    const otp_code = codeInput.value.trim();
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    displayStatusMessage('', 'info', 'verifyCodeStep3');

    if (!otp_code) {
        displayStatusMessage(translations[currentLang].codeRequired || 'Verification code is required.', 'warning', 'verifyCodeStep3');
        return;
    }

    try {
        const endpoint = currentAuthData.isResettingPassword ? '/api/password-reset/confirm-otp' : '/api/register/verify-email'; // Assuming a separate OTP confirm for reset
        const bodyData = {
            username: currentAuthData.username,
            otp_code: otp_code
        };
        if (currentAuthData.isResettingPassword) {
            bodyData.email = currentAuthData.email; // For reset flow, email is identifier
        }

        const response = await fetch(`${BACKEND_API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });
        const data = await response.json();

        if (response.ok) {
            displayStatusMessage(translations[currentLang].emailVerified || "Code verified!", 'success', 'verifyCodeStep3');
            // If it's a password reset, store the token for the next step
            if (currentAuthData.isResettingPassword) {
                currentAuthData.reset_token = otp_code; // Assuming OTP is used as reset token for now
            }
            setTimeout(() => {
                showAuthStep('setPasswordStep4'); // Go to password setup step
            }, 1000);
        } else {
            const errorMessage = data.error || translations[currentLang].invalidCode;
            displayStatusMessage(errorMessage, 'error', 'verifyCodeStep3');
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        displayStatusMessage(translations[currentLang].errorFetching, 'error', 'verifyCodeStep3');
    }
}

async function handleSetPassword() {
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmNewPasswordInput = document.getElementById('confirmNewPasswordInput');
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmNewPasswordInput.value.trim();
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    displayStatusMessage('', 'info', 'setPasswordStep4');

    // Password validation
    if (!newPassword || !confirmPassword) {
        displayStatusMessage(translations[currentLang].passwordRequired || "Password is required.", 'warning', 'setPasswordStep4');
        return;
    }
    if (newPassword.length < 8) {
        displayStatusMessage(translations[currentLang].passwordTooShort, 'warning', 'setPasswordStep4');
        return;
    }
    if (newPassword.length > 50) {
        displayStatusMessage(translations[currentLang].passwordTooLong, 'warning', 'setPasswordStep4');
        return;
    }
    if (newPassword !== confirmPassword) {
        displayStatusMessage(translations[currentLang].passwordsMismatch, 'warning', 'setPasswordStep4');
        return;
    }

    displayStatusMessage(translations[currentLang].settingPassword, 'info', 'setPasswordStep4');

    try {
        const endpoint = currentAuthData.isResettingPassword ? '/api/password-reset/confirm' : '/api/register/set-password';
        const bodyData = {
            username: currentAuthData.username, // For registration
            password: newPassword
        };
        if (currentAuthData.isResettingPassword) {
            bodyData.email = currentAuthData.email; // For reset
            bodyData.reset_token = currentAuthData.reset_token; // Include reset token for reset flow
        }

        const response = await fetch(`${BACKEND_API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });
        const data = await response.json();

        if (response.ok) {
            currentAuthData.spenta_id = data.spenta_id; // Get SpentaID after registration/reset
            currentAuthData.username = data.username; // Get final username after registration/reset
            
            displayStatusMessage(currentAuthData.isResettingPassword ? translations[currentLang].resetSuccess : translations[currentLang].registrationComplete, 'success', 'setPasswordStep4'); 
            
            // --- Auto Login after registration/reset ---
            await handleAutoLogin(currentAuthData.username, newPassword); // Use username for auto-login
        } else {
            const errorMessage = data.error || translations[currentLang].genericError;
            displayStatusMessage(errorMessage, 'error', 'setPasswordStep4');
        }
    } catch (error) {
        console.error('Error setting password:', error);
        displayStatusMessage(translations[currentLang].errorFetching, 'error', 'setPasswordStep4');
    }
}

async function handleAutoLogin(identifier, password) {
    // This is to simulate auto-login, fetching a token after successful registration/reset
    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: identifier, password: password }),
        });
        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem('spentaAuthToken', data.token); // Store token
            localStorage.setItem('spentaUserId', data.spenta_id); // Store SpentaID for display
            localStorage.setItem('spentaUsername', data.username); // Store username
            
            // Ensure currentAuthData is updated for success screen
            currentAuthData.spenta_id = data.spenta_id; 
            currentAuthData.username = data.username;

            setTimeout(() => { showAuthStep('successScreen'); }, 1000);
        } else {
            console.error('Auto-login failed:', data.error);
            displayStatusMessage(translations[localStorage.getItem('selectedLanguage') || 'en'].loginFailed || "Auto-login failed. Please try logging in manually.", 'error', 'setPasswordStep4');
            // Maybe redirect to login page directly or show a login button
        }
    } catch (error) {
        console.error('Network error during auto-login:', error);
        displayStatusMessage(translations[localStorage.getItem('selectedLanguage') || 'en'].errorFetching, 'error', 'setPasswordStep4');
    }
}


// --- Password Reset Flow ---
async function handleForgotPassword() {
    currentAuthData.isResettingPassword = true;
    // Clear previous identifier input for fresh start in reset flow
    document.getElementById('identifierInput').value = ''; 
    showAuthStep('resetRequestStep');
}

async function handleResetRequest() {
    const resetEmailInput = document.getElementById('resetEmailInput');
    const email = resetEmailInput.value.trim();
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';

    displayStatusMessage('', 'info', 'resetRequestStep');

    if (!email) {
        displayStatusMessage(translations[currentLang].emailRequired, 'warning', 'resetRequestStep');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        displayStatusMessage(translations[currentLang].invalidEmail, 'warning', 'resetRequestStep');
        return;
    }

    displayStatusMessage(translations[currentLang].sendingCode, 'info', 'resetRequestStep');

    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/password-reset/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email }),
        });
        const data = await response.json();

        if (response.ok) {
            currentAuthData.email = email; // Store email for reset confirmation
            currentAuthData.username = data.username; // Get username associated with email for subsequent steps
            currentAuthData.reset_token = data.reset_token; // TEMPORARY: for testing, normally not returned to frontend
            displayStatusMessage(data.message, 'success', 'resetRequestStep');
            setTimeout(() => { showAuthStep('verifyCodeStep3'); }, 1500); // Re-use verify code step
        } else {
            const errorMessage = data.error || translations[currentLang].genericError;
            displayStatusMessage(errorMessage, 'error', 'resetRequestStep');
        }
    } catch (error) {
        console.error('Error requesting password reset:', error);
        displayStatusMessage(translations[currentLang].errorFetching, 'error', 'resetRequestStep');
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
    setInitialLanguage();
    // No longer calling showAuthStep(1) here as setInitialLanguage might already go to successScreen

    // --- Authentication Flow Buttons ---
    document.getElementById('proceedAuthButton').addEventListener('click', handleAuthStep1Proceed);
    
    // Login Path
    document.getElementById('loginButton').addEventListener('click', handleLogin);
    document.getElementById('backFromLoginToAuth1Button').addEventListener('click', () => showAuthStep('authStep1'));
    document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        handleForgotPassword();
    });

    // Registration Path (Email)
    document.getElementById('sendRegCodeButton').addEventListener('click', handleRegEmailSendCode);
    document.getElementById('backFromReg2ToAuth1Button').addEventListener('click', () => {
        // currentAuthData.username = ''; // Only clear if starting a completely new flow
        showAuthStep('authStep1');
    });

    // Code Verification Path (Shared for Reg & Reset)
    document.getElementById('verifyCodeButton').addEventListener('click', handleVerifyCode);
    document.getElementById('backFromVerifyCodeToReg2Button').addEventListener('click', () => {
        if (currentAuthData.isResettingPassword) {
            showAuthStep('resetRequestStep');
        } else {
            showAuthStep('regStep2');
        }
    });

    // Password Setup Path (Shared for Reg & Reset)
    document.getElementById('completeAuthButton').addEventListener('click', handleSetPassword);
    document.getElementById('backFromSetPasswordToVerifyCode3Button').addEventListener('click', () => showAuthStep('verifyCodeStep3'));

    // Password Reset Path
    document.getElementById('sendResetCodeButton').addEventListener('click', handleResetRequest);
    document.getElementById('backFromResetRequestToLogin2Button').addEventListener('click', () => {
        currentAuthData.isResettingPassword = false;
        showAuthStep('loginStep2'); // Go back to login if they changed their mind
    });

    // Success Screen
    document.getElementById('goToDashboardButton').addEventListener('click', () => alert('Redirecting to dashboard... (Not implemented yet)'));


    // --- General UI ---
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
