document.addEventListener('DOMContentLoaded', () => {

    // --- 요소 선택 ---
    const mainNextButton = document.querySelector('.btn_container .next_btn');
    const genderButtons = document.querySelectorAll('.gender_btn button');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step2Title = document.querySelector('#step2 h1');
    const step3Title = document.querySelector('#step3 h1');
    
    // ▼▼▼ 챕터 숫자 요소를 새로 선택합니다 ▼▼▼
    const chapterCurrent = document.querySelector('.chapter .current');

    // --- 2단계 녹음 UI 요소 ---
    const answerSectionStep2 = document.getElementById('answer-step2');
    const recordBtnStep2 = document.getElementById('btn-record-start-step2');
    const stopBtnStep2 = document.getElementById('btn-stop-step2');
    const restartBtnStep2 = document.getElementById('btn-restart-step2');
    const nextBtnStep2 = document.getElementById('btn-next-step2');

    // --- 3단계 녹음 UI 요소 ---
    const answerSectionStep3 = document.getElementById('answer-step3');
    const recordBtnStep3 = document.getElementById('btn-record-start-step3');
    const stopBtnStep3 = document.getElementById('btn-stop-step3');
    const restartBtnStep3 = document.getElementById('btn-restart-step3');
    const nextBtnStep3 = document.getElementById('btn-next-step3');

    // --- 상태 변수 ---
    let selectedGender = '';

    // --- 이벤트 리스너 ---
    genderButtons.forEach(button => {
        button.addEventListener('click', () => {
            genderButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedGender = button.textContent.includes('남자') ? '할아버지' : '할머니';
            localStorage.setItem('selectedGender', selectedGender);
        });
    });

    // 1단계 -> 2단계 전환
    mainNextButton.addEventListener('click', () => {
        if (selectedGender === '') {
            alert('성별을 선택해 주세요.');
            return;
        }
        step2Title.textContent = `${selectedGender}의 출생년도를 말씀해 주세요.`;
        step1.style.display = 'none';
        step2.style.display = 'block';
        document.body.classList.add('step-2-bg');

        // ▼▼▼ 챕터 숫자를 '2'로 변경합니다 ▼▼▼
        chapterCurrent.textContent = '2';
    });

    // 2단계 -> 3단계 전환
    nextBtnStep2.addEventListener('click', () => {
        step3Title.innerHTML = `${selectedGender}가 만드실<br>자서전의 제목은 무엇으로 할까요?`;
        step2.style.display = 'none';
        step3.style.display = 'block';

        // ▼▼▼ 챕터 숫자를 '3'으로 변경합니다 ▼▼▼
        chapterCurrent.textContent = '3';
    });

    // 3단계 -> 다음 페이지 전환
    nextBtnStep3.addEventListener('click', () => {
        localStorage.setItem('autostartNarration', 'true');
        window.location.href = 'narration.html';
    });


    // --- 2단계 녹음 버튼 시각적 효과 ---
    recordBtnStep2.addEventListener('click', () => {
        answerSectionStep2.classList.add('is-recording');
        answerSectionStep2.classList.remove('post-record');
    });
    stopBtnStep2.addEventListener('click', () => {
        answerSectionStep2.classList.remove('is-recording');
        answerSectionStep2.classList.add('post-record');
    });
    restartBtnStep2.addEventListener('click', () => {
        answerSectionStep2.classList.remove('is-recording');
        answerSectionStep2.classList.remove('post-record');
    });

    // --- 3단계 녹음 버튼 시각적 효과 ---
    recordBtnStep3.addEventListener('click', () => {
        answerSectionStep3.classList.add('is-recording');
        answerSectionStep3.classList.remove('post-record');
    });
    stopBtnStep3.addEventListener('click', () => {
        answerSectionStep3.classList.remove('is-recording');
        answerSectionStep3.classList.add('post-record');
    });
    restartBtnStep3.addEventListener('click', () => {
        answerSectionStep3.classList.remove('is-recording');
        answerSectionStep3.classList.remove('post-record');
    });
});