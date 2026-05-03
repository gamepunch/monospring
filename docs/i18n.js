const supportedLanguages = ['en', 'zh', 'ja', 'ko'];

function detectLanguage() {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && supportedLanguages.includes(urlLang)) {
        return urlLang;
    }
    const browserLang = navigator.language || navigator.userLanguage;
    const mainLang = browserLang.split('-')[0];
    return supportedLanguages.includes(mainLang) ? mainLang : 'en';
}

async function loadTranslations(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        if (lang !== 'en') {
            const fallbackResponse = await fetch('locales/en.json');
            return await fallbackResponse.json();
        }
        return {};
    }
}

function applyTranslations(translations, lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const lang = detectLanguage();
    const translations = await loadTranslations(lang);
    applyTranslations(translations, lang);
});
