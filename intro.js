const genderButtons = document.querySelectorAll('.gender_btn button');

// 각 버튼에 대해 클릭 이벤트를 추가합니다.
genderButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. 먼저 모든 버튼에서 'selected' 클래스를 제거합니다.
        genderButtons.forEach(btn => {
            btn.classList.remove('selected');
        });

        // 2. 방금 클릭한 버튼에만 'selected' 클래스를 추가합니다.
        button.classList.add('selected');
    });
});


/* -------------------- 넘어가는 효과 -------------------- */
document.addEventListener('DOMContentLoaded', () => {

    // --- 요소 선택 ---
    const nextButton = document.querySelector('.next_btn');
    const genderButtons = document.querySelectorAll('.gender_btn button');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const step2Title = document.querySelector('#step2 h1');
    const step3Title = document.querySelector('#step3 h1');

    // --- 상태 변수 ---
    let currentStep = 1;
    let selectedGender = '';

    // --- 이벤트 리스너 ---

    // 성별 버튼 클릭 이벤트
    genderButtons.forEach(button => {
        button.addEventListener('click', () => {
            genderButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            if (button.textContent.includes('남자')) {
                selectedGender = '할아버지';
            } else {
                selectedGender = '할머니';
            }
            localStorage.setItem('selectedGender', selectedGender);
        });
    });

    // '다음' 버튼 클릭 이벤트
    nextButton.addEventListener('click', () => {
        if (currentStep === 1) {
            if (selectedGender === '') {
                alert('성별을 선택해 주세요.');
                return;
            }

            step2Title.textContent = `${selectedGender}의 출생년도를 말씀해 주세요.`;
            step1.style.display = 'none';
            step2.style.display = 'block';
            currentStep++;

        } else if (currentStep === 2) {
            step3Title.innerHTML = `${selectedGender}가 만드실<br>자서전의 제목은 무엇으로 할까요?`;
            step2.style.display = 'none';
            step3.style.display = 'block';
            nextButton.innerHTML = '완료 <img src="/img/left.svg" alt="">';
            currentStep++;
        
        } else if (currentStep === 3) {
            // ▼▼▼ 바로 이 위치입니다! ▼▼▼
            // narration.html 페이지로 이동하기 직전에 '자동 시작' 신호를 저장합니다.
            localStorage.setItem('autostartNarration', 'true');
            
            // narration.html로 이동
            window.location.href = 'narration.html';
        }
    });
});