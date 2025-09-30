// index.html의 '시작하기' 버튼이 클릭될 때 실행되는 함수
function saveStartData() {
    // 'isStarted'라는 이름(key)으로 'true'라는 값(value)을 로컬스토리지에 저장합니다.
    localStorage.setItem('isStarted', 'true');
    
    // 예시: 사용자 이름과 같은 다른 정보도 저장할 수 있습니다.
    localStorage.setItem('userName', '김모담');

    console.log('데이터가 로컬스토리지에 저장되었습니다!');
}


// roadmap.html 페이지가 로드되었을 때 실행되는 코드
document.addEventListener('DOMContentLoaded', () => {
    // 현재 페이지의 파일 이름이 'roadmap.html'일 때만 아래 코드를 실행
    if (window.location.pathname.includes('roadmap.html')) {
        const hasStarted = localStorage.getItem('isStarted');
        const userName = localStorage.getItem('userName');

        if (hasStarted === 'true') {
            console.log('시작하기를 통해 roadmap.html에 접속했습니다.');
            // 여기서 h1 태그 내용을 바꾸는 등의 작업을 할 수 있습니다.
        }
    }
});