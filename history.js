document.addEventListener('DOMContentLoaded', () => {
    // 각 단계별 데이터
    const stages = [
        { text: "BGM - 가거라 삼팔선 (1948) / 남인수", audioSrc: "../mp3/1940.mp3", backgroundClass: "history_infant_bg" },
        { text: "BGM - 굳세어라 금순아 (1953) / 현인", audioSrc: "../mp3/1950.mp4", backgroundClass: "history_teenaget_bg" },
        { text: "BGM - 노란 샤쓰의 사나이 (1961) / 한명숙", audioSrc: "../mp3/1960.mp4", backgroundClass: "history_Adult_bg" }
    ];

    let currentStageIndex = 0;

    // DOM 요소
    const nextBtn = document.querySelector('.nextbtn');
    const narrationText = document.getElementById('narrationText');
    const narrationAudio = document.getElementById('narrationAudio');
    const backgroundContainer = document.getElementById('backgroundContainer');
    const transitionOverlay = document.querySelector('.transition-overlay');

    // 화면 전환 효과 함수
    function performTransition(callback) {
        transitionOverlay.style.opacity = '1';
        setTimeout(() => {
            if (callback) callback();
            transitionOverlay.style.opacity = '0';
        }, 500);
    }

    // 단계별 화면 업데이트 및 오디오 재생 함수
    function updateStageAndPlayAudio() {
        if (currentStageIndex >= stages.length) {
            if(nextBtn) nextBtn.style.display = 'none';
            console.log("모든 스테이지가 종료되었습니다.");
            // 모든 스테이지 종료 후 다음 페이지로 이동 (예: 에피소드 페이지)
            window.location.href = 'episode.html';
            return;
        }

        const currentStage = stages[currentStageIndex];

        performTransition(() => {
            narrationText.textContent = currentStage.text;
            narrationAudio.src = currentStage.audioSrc;
            
            backgroundContainer.className = '';
            backgroundContainer.classList.add(currentStage.backgroundClass);

            narrationAudio.load();
            narrationAudio.play().catch(error => {
                // 자동 재생이 차단되었을 때를 대비한 로그
                console.error("오디오 재생 실패:", error);
                // 여기에 사용자에게 재생 버튼을 누르도록 유도하는 UI를 표시할 수 있습니다.
            });
        });
    }

    // ▼▼▼ 핵심 수정 부분 ▼▼▼
    // '자동 시작' 신호가 있는지 확인
    const shouldAutostart = localStorage.getItem('autostartHistory') === 'true';

    if (shouldAutostart) {
        // 신호가 있으면 바로 삭제하고 첫 단계를 시작
        localStorage.removeItem('autostartHistory');
        updateStageAndPlayAudio();
        currentStageIndex++;
    } else {
        // 신호가 없으면(직접 들어온 경우) 첫 화면만 설정하고 클릭 대기
        if (stages.length > 0) {
            narrationText.textContent = stages[0].text;
            backgroundContainer.className = '';
            backgroundContainer.classList.add(stages[0].backgroundClass);
        }
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 노래가 끝나면 자동으로 다음 단계로
    narrationAudio.addEventListener('ended', () => {
        updateStageAndPlayAudio();
        currentStageIndex++;
    });

    // 다음 버튼 클릭 이벤트 (건너뛰기 기능)
    nextBtn.addEventListener('click', () => {
        // 현재 인덱스가 유효한 경우에만 다음 단계로 넘어감
        if (currentStageIndex < stages.length) {
            updateStageAndPlayAudio();
            currentStageIndex++;
        }
    });
});