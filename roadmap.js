// 페이지 전체가 로드되면 실행
document.addEventListener('DOMContentLoaded', () => {

    const stepsData = [
        { step: "1단계", title: "양식, 일대기 작성", imgSrc: "/img/first.svg", href: "intro.html" },
        // ▼▼▼ 아래 2~5단계 임시 데이터 추가 ▼▼▼
        { step: "2단계", title: "유아기, 청소년기", imgSrc: "/img/second.svg", href: "step2.html" },
        { step: "3단계", title: "성인기, 중년기", imgSrc: "/img/third.svg", href: "step3.html" },
        { step: "4단계", title: "가족 이야기", imgSrc: "/img/fourth.svg", href: "step4.html" },
        { step: "5단계", title: "마지막으로", imgSrc: "/img/fifth.svg", href: "step5.html" }
    ];

    const roadContainer = document.querySelector('.road');

    // 로컬스토리지에서 현재 진행 단계를 가져옵니다. (없으면 0)
    const currentProgress = parseInt(localStorage.getItem('roadmapProgress')) || 0;

    stepsData.forEach((data, index) => {
        const stepNumber = index + 1;
        const isEnabled = stepNumber <= (currentProgress + 1);

        const imageSrc = isEnabled ? data.imgSrc : "/img/lock.svg";

        let stepHTML = '';
        if (isEnabled) {
            // 활성화된 단계
            stepHTML = `
                <div class="step">
                    <h3>${data.step}</h3>
                    <p>${data.title}</p>
                    <img src="${imageSrc}" alt="${data.title}">
                    <a href="${data.href}" class="step_btn">시작하기</a>
                </div>
            `;
        } else {
            // 비활성화된 단계
            stepHTML = `
                <div class="step inactive">
                    <h3>${data.step}</h3>
                    <p>${data.title}</p>
                    <img src="${imageSrc}" alt="${data.title}">
                    <button class="step_btn" disabled>준비중</button>
                </div>
            `;
        }

        roadContainer.innerHTML += stepHTML;
    });
});
