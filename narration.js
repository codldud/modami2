document.addEventListener('DOMContentLoaded', () => {

    let currentAudio = null;
    let currentTextIndex = 0;
    let typingInterval = null;
    let nextTextTimeout = null;
    
    const gender = localStorage.getItem('selectedGender') || '할머니';

    const textTemplates = [
        { 
            id: "text1", 
            displayText: `${gender} 저는 ai 손자 '담이'이에요! 만나서 반가워요.`,
            ttsScript: `${gender} 저는 에이아이 손자 담이예요! 만나서 반가워요` 
        },
        { 
            id: "text2", 
            displayText: `오늘부터 저와 총 5번의 단계를 통해 ${gender}의 <br> 이야기를 담은 자서전을 만들어 볼 거예요.`,
            ttsScript: `오늘부터 저와 총 다섯번의 단계를 통해 ${gender}의 이야기를 담은 자서전을 만들어볼 거예요.`
        },
        { 
            id: "text3", 
            displayText: `기억들을 회고 하기 전에 담이가 ${gender}의 유아기, <br> 청소년기, 성인기 시절의 사진과 노래를 들려드릴게요.`,
            ttsScript: `기억들을 회고 하기 전에 담이가 ${gender}의 유아기와 청소년기 그리고 성인기 시절의 사진과 노래를 들려드릴게요.`
        }
    ];

    textTemplates.forEach(template => {
        const element = document.getElementById(template.id);
        if (element) {
            element.innerHTML = template.displayText;
        }
    });

    const textElements = textTemplates.map(item => ({
        id: item.id,
        tts: item.ttsScript 
    }));

    const nextBtn = document.querySelector('.nextbtn');
    const skipBtn = document.querySelector('.skip_btn');
    const startBtn = document.querySelector('.start-btn');
    const texts = textElements.map(item => document.getElementById(item.id));

    texts.forEach(el => {
        if(el) {
            el.dataset.original = el.innerHTML;
            el.style.display = 'none';
            el.innerHTML = '';
        }
    });
    
    const shouldAutostart = localStorage.getItem('autostartNarration') === 'true';
    if (shouldAutostart) {
        localStorage.removeItem('autostartNarration');
        if(startBtn) startBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'block';
        if(skipBtn) skipBtn.style.display = 'block';
        showNextText();
    } else {
        if(startBtn) startBtn.style.display = 'block';
        if(nextBtn) nextBtn.style.display = 'none';
        if(skipBtn) skipBtn.style.display = 'none';
    }
    
    async function getTtsAudio(textScript) {
        const apiKey = "AIzaSyBKLaoIvgJ-ch0wZSPIxm5HhqJLvGRIbNM";
        const apiUrl = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;
        const payload = {
            input: { text: textScript },
            voice: { languageCode: "ko-KR", name: "ko-KR-Chirp3-HD-Zephyr" },
            audioConfig: { audioEncoding: "MP3", speakingRate: 1.02 }
        };
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { console.error(`API Error: ${response.status}`); return null; }
            const result = await response.json();
            const audioContent = result?.audioContent;
            if (audioContent) {
                const audioUrl = `data:audio/mp3;base64,${audioContent}`;
                const audio = new Audio(audioUrl);
                return new Promise((resolve) => {
                    audio.addEventListener('loadedmetadata', () => resolve({ audio, duration: audio.duration }));
                });
            }
            return null;
        } catch (error) { console.error("TTS API 호출 오류:", error); return null; }
    }

    function showNextText() {
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        clearTimeout(nextTextTimeout);
        if (typingInterval) { clearInterval(typingInterval); }

        if (currentTextIndex >= texts.length) {
            // ▼▼▼ 이 부분이 수정되었습니다 ▼▼▼
            setTimeout(() => {
                // history.html로 이동하기 전에 '자동 시작' 신호를 저장합니다.
                localStorage.setItem('autostartHistory', 'true');
                window.location.href = 'history.html';
            }, 3000);
            return;
        }

        if (currentTextIndex > 0) {
            const prevEl = texts[currentTextIndex - 1];
            if(prevEl) prevEl.style.display = 'none';
        }
        const currentElement = texts[currentTextIndex];
        const { tts } = textElements[currentTextIndex];
        typeWriter(currentElement, currentElement.dataset.original, tts);
        currentTextIndex++;
    }

    async function typeWriter(element, text, ttsScript) {
        if(!element || !text) return;
        
        element.style.display = 'block';
        element.innerHTML = '';
        element.classList.add('fade-in');

        const audioData = await getTtsAudio(ttsScript);

        if (audioData) {
            const { audio, duration } = audioData;
            currentAudio = audio;
            const pureText = text.replace(/<br>/g, ' ').replace(/<[^>]*>/g, '');
            const totalChars = pureText.length;
            audio.play().catch(e => console.error("Audio playback failed:", e));
            let i = 0;
            let typedChars = 0;
            typingInterval = setInterval(() => {
                if (audio.paused || audio.ended) {
                    clearInterval(typingInterval);
                    element.innerHTML = text;
                    element.classList.remove('fade-in');
                    if (audio.ended) {
                        nextTextTimeout = setTimeout(showNextText, 2000);
                    }
                    return;
                }
                const elapsedTime = audio.currentTime;
                const charsToType = Math.floor(elapsedTime * (totalChars / duration));
                while (typedChars < charsToType && i < text.length) {
                    if (text.charAt(i) === '<') {
                        const tagEnd = text.indexOf('>', i);
                        element.innerHTML += text.substring(i, tagEnd + 1);
                        i = tagEnd + 1;
                    } else {
                        element.innerHTML += `<span>${text.charAt(i)}</span>`; i++; typedChars++;
                    }
                }
            }, 10);
        } else {
            console.error("오디오 로드 실패! 텍스트만 출력합니다.");
            let i = 0;
            typingInterval = setInterval(() => {
                if (i < text.length) {
                    if (text.charAt(i) === '<') {
                        const tagEnd = text.indexOf('>', i);
                        element.innerHTML += text.substring(i, tagEnd + 1);
                        i = tagEnd + 1;
                    } else {
                        element.innerHTML += `<span>${text.charAt(i)}</span>`;
                        i++;
                    }
                } else {
                    clearInterval(typingInterval);
                    nextTextTimeout = setTimeout(showNextText, 2000);
                }
            }, 50);
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'block';
            if (skipBtn) skipBtn.style.display = 'block';
            showNextText();
        });
    }

    if (nextBtn) { nextBtn.addEventListener('click', showNextText); }
    if (skipBtn) { skipBtn.addEventListener('click', () => { window.location.href = 'history.html'; }); }
});