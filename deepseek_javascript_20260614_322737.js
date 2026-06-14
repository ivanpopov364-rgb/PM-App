// --- Константы (мобильные и технические) ---
const MOBILE_REQUIREMENTS = `МОБИЛЬНАЯ ВЕРСИЯ
Меню: бургер
Порядок блоков: как на десктопе
Шрифты: адаптировать для идеального отображения`;

const TECH_REQUIREMENTS = `ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ
Платформа/стек: React + TypeScript + Tailwind CSS + Framer Motion + мобильная адаптация`;

const STORAGE_KEY = 'lovablePromptBuilder';
const CHAT_STORAGE_KEY = 'chatHistory';

// --- DOM элементы чата ---
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendChatBtn');
const startVoiceBtn = document.getElementById('startVoiceBtn');
const stopVoiceBtn = document.getElementById('stopVoiceBtn');

// --- Глобальные переменные для распознавания речи ---
let recognition = null;
let isRecognizing = false;

// --- Функции чата ---
function addMessageToChat(text, isUser = true) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';
    const time = new Date().toLocaleTimeString();
    msgDiv.innerHTML = `<div class="time">${time} ${isUser ? '👤 Вы' : '🤖 Система'}</div><div class="text">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(msgDiv);
    msgDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    saveChatHistory();
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

function saveChatHistory() {
    const messages = Array.from(chatMessages.querySelectorAll('.message')).map(msg => ({
        time: msg.querySelector('.time')?.textContent || '',
        text: msg.querySelector('.text')?.textContent || ''
    }));
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
}

function loadChatHistory() {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
        try {
            const messages = JSON.parse(saved);
            chatMessages.innerHTML = '';
            messages.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'message';
                div.innerHTML = `<div class="time">${escapeHtml(msg.time)}</div><div class="text">${escapeHtml(msg.text)}</div>`;
                chatMessages.appendChild(div);
            });
            if (messages.length) chatMessages.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
        } catch(e) { console.error(e); }
    }
}

// Отправка текста из поля ввода
sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
        addMessageToChat(text, true);
        chatInput.value = '';
    }
});

// Распознавание речи
function initSpeech() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Ваш браузер не поддерживает распознавание речи");
        return null;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'ru-RU';
    recog.onresult = (event) => {
        let finalText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalText += event.results[i][0].transcript + ' ';
            }
        }
        if (finalText.trim()) {
            addMessageToChat(finalText.trim(), true);
        }
    };
    recog.onerror = (event) => {
        console.error('Ошибка распознавания', event.error);
        stopRecognition();
    };
    recog.onend = () => {
        stopRecognition();
    };
    return recog;
}

function startRecognition() {
    if (!recognition) recognition = initSpeech();
    if (recognition) {
        try {
            recognition.start();
            isRecognizing = true;
            startVoiceBtn.disabled = true;
            stopVoiceBtn.disabled = false;
            addMessageToChat('🎤 Распознавание запущено...', false);
        } catch(e) {
            console.error(e);
        }
    }
}

function stopRecognition() {
    if (recognition && isRecognizing) {
        recognition.stop();
        isRecognizing = false;
        startVoiceBtn.disabled = false;
        stopVoiceBtn.disabled = true;
        addMessageToChat('⏹️ Распознавание остановлено', false);
    }
}

startVoiceBtn.addEventListener('click', startRecognition);
stopVoiceBtn.addEventListener('click', stopRecognition);

// --- Остальной код (настройки проекта, генерация промпта) ---
// Для краткости я приведу только ключевые функции, но в финальном файле они будут полными.
// Однако, чтобы файл был полностью рабочим, я включу весь необходимый код (сокращённо, но функционально).

// Элементы правой панели (все id как в index.html)
const projectName = document.getElementById('projectName');
const targetAudience = document.getElementById('targetAudience');
const siteGoals = document.querySelectorAll('input[name="siteGoals"]');
const toneSelect = document.getElementById('tone');
const toneOther = document.getElementById('toneOther');
const styleInput = document.getElementById('style');
const stylePreset = document.getElementById('stylePreset');
const references = document.getElementById('references');
const colorPrimary = document.getElementById('colorPrimary');
const colorPrimaryHex = document.getElementById('colorPrimaryHex');
const colorPrimaryIgnore = document.getElementById('colorPrimaryIgnore');
const colorSecondary = document.getElementById('colorSecondary');
const colorSecondaryHex = document.getElementById('colorSecondaryHex');
const colorSecondaryIgnore = document.getElementById('colorSecondaryIgnore');
const colorAccent = document.getElementById('colorAccent');
const colorAccentHex = document.getElementById('colorAccentHex');
const colorAccentIgnore = document.getElementById('colorAccentIgnore');
const headerFont = document.getElementById('headerFont');
const bodyFont = document.getElementById('bodyFont');
const generateFontBtn = document.getElementById('generateFontPair');
const previewHeader = document.querySelector('.preview-header');
const previewBody = document.querySelector('.preview-body');
const blocksCheckboxes = document.querySelectorAll('input[name="blocks"]');
const blocksSortable = document.getElementById('blocks-sortable');
const customBlockInput = document.getElementById('customBlockName');
const addCustomBlockBtn = document.getElementById('addCustomBlock');
const hoverButtons = document.querySelectorAll('input[name="hoverButtons"]');
const hoverCards = document.querySelectorAll('input[name="hoverCards"]');
const hoverImages = document.querySelectorAll('input[name="hoverImages"]');
const scrollTypeRadios = document.querySelectorAll('input[name="scrollType"]');
const servicesTextarea = document.getElementById('services');
const companyDescTextarea = document.getElementById('companyDesc');
const hasLogoCheckbox = document.getElementById('hasLogo');
const extraWishes = document.getElementById('extraWishes');

let selectedBlocks = [];
let sortableInstance = null;

// --- Функция генерации шрифтов ---
const fontDatabase = [
    { name: 'Roboto', style: 'text' }, { name: 'Playfair Display', style: 'display' },
    { name: 'Montserrat', style: 'display' }, { name: 'Open Sans', style: 'text' },
    { name: 'Lato', style: 'text' }, { name: 'Merriweather', style: 'text' }
];
function generateRandomFontPair() {
    const header = fontDatabase.filter(f => f.style === 'display')[Math.floor(Math.random() * 3)].name;
    const body = fontDatabase.filter(f => f.style === 'text')[Math.floor(Math.random() * 4)].name;
    return { header, body };
}
generateFontBtn.addEventListener('click', () => {
    const pair = generateRandomFontPair();
    headerFont.value = pair.header;
    bodyFont.value = pair.body;
    updateFontPreview();
    saveFormState();
});
function loadGoogleFont(fontName) {
    if (!fontName) return;
    const family = fontName.replace(/ /g, '+');
    if (!document.querySelector(`link[href*="${family}"]`)) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
}
function updateFontPreview() {
    const header = headerFont.value.trim();
    const body = bodyFont.value.trim();
    if (header) { loadGoogleFont(header); previewHeader.style.fontFamily = `'${header}', serif`; previewHeader.textContent = `Заголовок (${header})`; }
    if (body) { loadGoogleFont(body); previewBody.style.fontFamily = `'${body}', sans-serif`; previewBody.textContent = `Текст (${body})`; }
}

// --- Сортировка блоков ---
function updateBlocksList() {
    const checked = Array.from(blocksCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    selectedBlocks = selectedBlocks.filter(block => checked.includes(block) || !Array.from(blocksCheckboxes).some(cb => cb.value === block));
    checked.forEach(block => { if (!selectedBlocks.includes(block)) selectedBlocks.push(block); });
    renderSortableList();
}
function renderSortableList() {
    blocksSortable.innerHTML = '';
    const headerLi = document.createElement('li'); headerLi.textContent = 'Header/Навигация'; headerLi.classList.add('fixed-item'); blocksSortable.appendChild(headerLi);
    selectedBlocks.forEach(block => { const li = document.createElement('li'); li.textContent = block; const removeSpan = document.createElement('span'); removeSpan.textContent = ' ×'; removeSpan.style.cssText = 'color:red;cursor:pointer;float:right'; removeSpan.onclick = () => { selectedBlocks = selectedBlocks.filter(b => b !== block); renderSortableList(); saveFormState(); }; li.appendChild(removeSpan); blocksSortable.appendChild(li); });
    const footerLi = document.createElement('li'); footerLi.textContent = 'Футер (подвал)'; footerLi.classList.add('fixed-item'); blocksSortable.appendChild(footerLi);
}
function initSortable() {
    if (sortableInstance) sortableInstance.destroy();
    sortableInstance = new Sortable(blocksSortable, { animation: 150, filter: '.fixed-item', onEnd: () => { const items = Array.from(blocksSortable.children).filter(li => !li.classList.contains('fixed-item')).map(li => li.textContent.replace(' ×', '')); selectedBlocks = items; saveFormState(); } });
}
addCustomBlockBtn.addEventListener('click', () => {
    const name = customBlockInput.value.trim();
    if (name) { selectedBlocks.push(name); renderSortableList(); customBlockInput.value = ''; saveFormState(); }
});
blocksCheckboxes.forEach(cb => cb.addEventListener('change', () => { updateBlocksList(); saveFormState(); }));

// --- Сохранение и загрузка состояния правой панели ---
function saveFormState() {
    const goals = Array.from(siteGoals).filter(cb => cb.checked).map(cb => cb.value);
    const hb = Array.from(hoverButtons).filter(cb => cb.checked).map(cb => cb.value);
    const hc = Array.from(hoverCards).filter(cb => cb.checked).map(cb => cb.value);
    const hi = Array.from(hoverImages).filter(cb => cb.checked).map(cb => cb.value);
    const scrollType = document.querySelector('input[name="scrollType"]:checked')?.value || 'normal';
    const data = {
        siteType: document.querySelector('input[name="siteType"]:checked')?.value,
        projectName: projectName.value, targetAudience: targetAudience.value, siteGoals: goals,
        tone: toneSelect.value, toneOther: toneOther.value, style: styleInput.value, stylePreset: stylePreset.value,
        references: references.value,
        colorPrimary: colorPrimary.value, colorPrimaryIgnore: colorPrimaryIgnore.checked,
        colorSecondary: colorSecondary.value, colorSecondaryIgnore: colorSecondaryIgnore.checked,
        colorAccent: colorAccent.value, colorAccentIgnore: colorAccentIgnore.checked,
        headerFont: headerFont.value, bodyFont: bodyFont.value, selectedBlocks: selectedBlocks,
        hoverButtons: hb, hoverCards: hc, hoverImages: hi, scrollType: scrollType,
        services: servicesTextarea.value, companyDesc: companyDescTextarea.value,
        hasLogo: hasLogoCheckbox.checked, extraWishes: extraWishes.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadFormState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
        const data = JSON.parse(saved);
        if (data.siteType) document.querySelector(`input[name="siteType"][value="${data.siteType}"]`).checked = true;
        projectName.value = data.projectName || ''; targetAudience.value = data.targetAudience || '';
        siteGoals.forEach(cb => cb.checked = data.siteGoals?.includes(cb.value) || false);
        toneSelect.value = data.tone || ''; toneOther.value = data.toneOther || ''; toneOther.style.display = toneSelect.value === 'other' ? 'block' : 'none';
        styleInput.value = data.style || ''; stylePreset.value = data.stylePreset || ''; references.value = data.references || '';
        colorPrimary.value = data.colorPrimary || '#3498db'; colorPrimaryHex.value = colorPrimary.value; colorPrimaryIgnore.checked = data.colorPrimaryIgnore || false;
        colorSecondary.value = data.colorSecondary || '#2ecc71'; colorSecondaryHex.value = colorSecondary.value; colorSecondaryIgnore.checked = data.colorSecondaryIgnore || false;
        colorAccent.value = data.colorAccent || '#e74c3c'; colorAccentHex.value = colorAccent.value; colorAccentIgnore.checked = data.colorAccentIgnore || false;
        headerFont.value = data.headerFont || ''; bodyFont.value = data.bodyFont || '';
        selectedBlocks = data.selectedBlocks || []; renderSortableList();
        hoverButtons.forEach(cb => cb.checked = data.hoverButtons?.includes(cb.value) || false);
        hoverCards.forEach(cb => cb.checked = data.hoverCards?.includes(cb.value) || false);
        hoverImages.forEach(cb => cb.checked = data.hoverImages?.includes(cb.value) || false);
        const scrollRadio = document.querySelector(`input[name="scrollType"][value="${data.scrollType || 'normal'}"]`); if (scrollRadio) scrollRadio.checked = true;
        servicesTextarea.value = data.services || ''; companyDescTextarea.value = data.companyDesc || '';
        hasLogoCheckbox.checked = data.hasLogo || false; extraWishes.value = data.extraWishes || '';
        updateFontPreview();
    } catch(e) { console.error(e); }
}

// --- Генерация промпта (включает историю чата) ---
function generatePrompt() {
    if (!projectName.value.trim()) { alert('Введите название проекта'); return; }
    let prompt = `# ПРОЕКТ: ${projectName.value.trim()}\n\n`;
    prompt += `## 1. КОНТЕКСТ И ЦЕЛИ\nТип сайта: ${document.querySelector('input[name="siteType"]:checked')?.value}\n`;
    if (targetAudience.value.trim()) prompt += `Целевая аудитория: ${targetAudience.value.trim()}\n`;
    const goals = Array.from(siteGoals).filter(cb => cb.checked).map(cb => cb.value);
    if (goals.length) prompt += `Главная цель: ${goals.join(', ')}\n`;
    let tone = toneSelect.value === 'other' ? toneOther.value.trim() : toneSelect.value;
    if (tone) prompt += `Тон коммуникации: ${tone}\n`;
    prompt += `\n## 2. ВИЗУАЛЬНАЯ ЭСТЕТИКА\nСтиль: ${styleInput.value.trim() || 'не задан'}\nРеференсы: ${references.value.trim() || 'нет'}\n`;
    prompt += `\n## 3. ЦВЕТОВАЯ ПАЛИТРА\n`;
    if (!colorPrimaryIgnore.checked) prompt += `Основной: ${colorPrimary.value}\n`;
    if (!colorSecondaryIgnore.checked) prompt += `Второстепенный: ${colorSecondary.value}\n`;
    if (!colorAccentIgnore.checked) prompt += `Акцентный: ${colorAccent.value}\n`;
    prompt += `\n## 4. ТИПОГРАФИКА\nЗаголовки: ${headerFont.value.trim() || 'не указан'}\nТекст: ${bodyFont.value.trim() || 'не указан'}\n`;
    prompt += `\n## 5. СТРУКТУРА И СЕКЦИИ\n1. Header/Навигация\n`;
    selectedBlocks.forEach((b,i) => prompt += `${i+2}. ${b}\n`);
    prompt += `${selectedBlocks.length+2}. Футер (подвал)\n`;
    prompt += `\n## 6. АНИМАЦИИ И СКРОЛЛ\n`;
    const hb = Array.from(hoverButtons).filter(cb => cb.checked).map(cb => cb.value);
    if (hb.length) prompt += `Ховер кнопок: ${hb.join(', ')}\n`;
    const hc = Array.from(hoverCards).filter(cb => cb.checked).map(cb => cb.value);
    if (hc.length) prompt += `Ховер карточек: ${hc.join(', ')}\n`;
    const hi = Array.from(hoverImages).filter(cb => cb.checked).map(cb => cb.value);
    if (hi.length) prompt += `Ховер изображений: ${hi.join(', ')}\n`;
    const scroll = document.querySelector('input[name="scrollType"]:checked')?.value;
    prompt += `Тип скролла: ${scroll === 'snap' ? 'snap' : (scroll === 'slider' ? 'слайдерный' : 'обычный')}\n\n`;
    prompt += `## 7. МОБИЛЬНАЯ ВЕРСИЯ\n${MOBILE_REQUIREMENTS}\n\n`;
    prompt += `## 8. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ\n${TECH_REQUIREMENTS}\n\n`;
    prompt += `## 9. ДОПОЛНИТЕЛЬНЫЕ МАТЕРИАЛЫ\n`;
    if (servicesTextarea.value.trim()) prompt += `Услуги:\n${servicesTextarea.value.trim()}\n`;
    if (companyDescTextarea.value.trim()) prompt += `О компании:\n${companyDescTextarea.value.trim()}\n`;
    if (hasLogoCheckbox.checked) prompt += `Логотип предоставлен (анализировать)\n`;
    if (extraWishes.value.trim()) prompt += `Пожелания: ${extraWishes.value.trim()}\n`;

    // Добавляем историю чата
    const chatHistory = Array.from(chatMessages.querySelectorAll('.message')).map(msg => msg.querySelector('.text')?.textContent || '').filter(t => t.trim());
    if (chatHistory.length) {
        prompt += `\n## 10. ИСТОРИЯ ЧАТА (заметки и описания)\n`;
        chatHistory.forEach((text, idx) => prompt += `${idx+1}. ${text}\n`);
    }
    prompt += `\nСоздай сайт на React+TypeScript+Tailwind с учётом всех требований.`;
    document.getElementById('promptOutput').value = prompt;
    document.getElementById('result').style.display = 'block';
}

// --- Копирование и сброс ---
document.getElementById('copyBtn')?.addEventListener('click', () => {
    const output = document.getElementById('promptOutput');
    output.select(); document.execCommand('copy');
    const btn = document.getElementById('copyBtn');
    btn.textContent = 'Скопировано!';
    setTimeout(() => btn.textContent = 'Копировать', 2000);
});
function addResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Сбросить всё';
    resetBtn.style.backgroundColor = '#e74c3c';
    resetBtn.style.marginLeft = '10px';
    resetBtn.onclick = () => { if(confirm('Сбросить все данные проекта?')) { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(CHAT_STORAGE_KEY); location.reload(); } };
    document.getElementById('generateBtn').insertAdjacentElement('afterend', resetBtn);
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
    loadFormState();
    initSortable();
    updateFontPreview();
    // Сохранение при изменениях в правой панели
    const formElements = document.querySelectorAll('#promptForm input, #promptForm select, #promptForm textarea');
    formElements.forEach(el => el.addEventListener('input', saveFormState));
    formElements.forEach(el => el.addEventListener('change', saveFormState));
    document.getElementById('generateBtn').addEventListener('click', generatePrompt);
    addResetButton();
    // Синхронизация тона
    toneSelect.addEventListener('change', () => { toneOther.style.display = toneSelect.value === 'other' ? 'block' : 'none'; saveFormState(); });
});