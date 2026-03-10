const ELEMENT_IMAGES = {
    "목": "./images/element_wood.png",
    "화": "./images/element_fire.png",
    "토": "./images/element_earth.png",
    "금": "./images/element_metal.png",
    "수": "./images/element_water.png"
};

// 십장생 및 영물 데이터 (이미지와 완벽 매칭)
const SPIRIT_DATA = {
    "목": {
        name: "소나무와 청룡",
        hanja: "松 / 龍",
        desc: "그대는 사계절 푸르른 소나무의 기개와 비상하는 청룡의 기운을 타고났구려. 하늘을 찌를 듯한 생명력과 진취적인 기상은 주변을 압도하는 든든한 버팀목이 될 것이오."
    },
    "화": {
        name: "불타는 태양",
        hanja: "日 / 陽",
        desc: "어둠을 밝히는 태양과 같은 열정이 그대의 중심에 자리 잡고 있소. 만물에 온기를 전하는 그대의 화끈하고 정의로운 성정은 세상의 주인공으로 빛나기에 부족함이 없구려."
    },
    "토": {
        name: "장엄한 영산",
        hanja: "山 / 岳",
        desc: "모든 것을 품어내는 거대한 산과 같은 포용력이 그대의 가장 큰 미덕이라오. 흔들리지 않는 신중함과 단단한 신뢰는 많은 사람을 그대 곁으로 불러 모으는 큰 그릇이 될 것이오."
    },
    "금": {
        name: "기암과 보검",
        hanja: "石 / 劍",
        desc: "천 년을 견디는 바위의 단단함과 날카로운 보검의 절개를 그대는 품고 있구려. 옳고 그름이 명확하고 흐트러짐 없는 그대의 고결한 고집은 결국 세상을 꿰뚫는 예리한 지혜가 될 것이오."
    },
    "수": {
        name: "거북과 파도",
        hanja: "龜 / 海",
        desc: "깊은 바다의 영험한 거북처럼 끝없는 지혜와 인내를 간직하고 있구려. 서두르지 않고 만물을 포용하며 흐르는 그대의 유연함은 결국 시간의 끝에서 가장 큰 승자가 되게 할 것이오."
    }
};

// 드롭다운 옵션 초기화 (오전/오후만 유지되므로 초기화 불필요)
document.addEventListener('DOMContentLoaded', function () {
    // URL 해시 상태에 따른 초기 화면 설정
    handleNavigation();

    // 해시 변경 감지
    window.addEventListener('hashchange', handleNavigation);
});

function handleNavigation() {
    const hash = window.location.hash;
    const funnel = document.getElementById('funnel');
    const result = document.getElementById('result');

    if (hash === '#result') {
        // 결과 데이터가 없는데 결과 페이지로 접근한 경우 입력 페이지로 리다이렉트
        if (!document.getElementById('resultContent').innerHTML.trim()) {
            window.location.hash = '';
            return;
        }
        funnel.classList.add('hidden');
        result.classList.remove('hidden');
    } else {
        funnel.classList.remove('hidden');
        result.classList.add('hidden');
    }
}

document.getElementById('sajuForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = "에헴, 천기를 살피는 중이니 잠시 기다리게나...";
    submitBtn.disabled = true;

    setTimeout(() => {
        const userName = document.getElementById('userName').value;
        const year = document.getElementById('birthYear').value;
        const month = document.getElementById('birthMonth').value;
        const day = document.getElementById('birthDay').value;
        const ampm = document.getElementById('birthAmPm').value;
        const hour = document.getElementById('birthHour').value;
        const minute = document.getElementById('birthMinute').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;

        const birthInfo = `${year}년 ${month}월 ${day}일 ${ampm} ${hour}시 ${minute}분`;
        generateSajuResult(userName, birthInfo, gender);

        // URL 해시 변경 (자동으로 화면 전환 트리거됨)
        window.location.hash = 'result';
        window.scrollTo(0, 0);

        submitBtn.innerText = "결과보기";
        submitBtn.disabled = false;
    }, 2000);
});

// 돌아가기 버튼 로직
document.getElementById('backToFunnelBtn').addEventListener('click', function () {
    window.location.hash = '';
});

// 텍스트 포맷팅 도우미 (하이라이트 + 가독성을 위한 줄바꿈)
function formatText(text) {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');
    formatted = formatted.replace(/([.,])\s*/g, '$1<br>');
    return formatted;
}

function generateSajuResult(name, birthInfo, gender) {
    const resultContent = document.getElementById('resultContent');
    const titleName = gender === "male" ? "공자" : "소저";

    // 명리학 기초 데이터
    const stems = [
        { char: "甲", name: "나무 갑", elem: "목", desc: "양의 나무" }, { char: "乙", name: "새 을", elem: "목", desc: "음의 나무" },
        { char: "丙", name: "밝을 병", elem: "화", desc: "양의 불" }, { char: "丁", name: "고무래 정", elem: "화", desc: "음의 불" },
        { char: "戊", name: "다섯째 천간 무", elem: "토", desc: "양의 흙" }, { char: "己", name: "몸 기", elem: "토", desc: "음의 흙" },
        { char: "庚", name: "별 경", elem: "금", desc: "양의 쇠" }, { char: "辛", name: "매울 신", elem: "금", desc: "음의 쇠" },
        { char: "壬", name: "아홉째 천간 임", elem: "수", desc: "양의 물" }, { char: "癸", name: "열째 천간 계", elem: "수", desc: "음의 물" }
    ];
    const branches = [
        { char: "子", name: "아들 자", elem: "수" }, { char: "丑", name: "소 축", elem: "토" }, { char: "寅", name: "범 인", elem: "목" }, { char: "卯", name: "토끼 묘", elem: "목" },
        { char: "辰", name: "용 진", elem: "토" }, { char: "巳", name: "뱀 사", elem: "화" }, { char: "午", name: "말 오", elem: "화" }, { char: "未", name: "양 미", elem: "토" },
        { char: "申", name: "원숭이 신", elem: "금" }, { char: "酉", name: "닭 유", elem: "금" }, { char: "戌", name: "개 술", elem: "토" }, { char: "亥", name: "돼지 해", elem: "수" }
    ];

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pillars = [
        { title: "시주(時柱)", top: getRandom(stems), bottom: getRandom(branches) },
        { title: "일주(日柱)", top: getRandom(stems), bottom: getRandom(branches) },
        { title: "월주(月柱)", top: getRandom(stems), bottom: getRandom(branches) },
        { title: "년주(年柱)", top: getRandom(stems), bottom: getRandom(branches) }
    ];

    const scores = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
    pillars.forEach(p => {
        scores[p.top.elem]++;
        scores[p.bottom.elem]++;
    });

    let mainElement = "목";
    let maxScore = 0;
    for (const [elem, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            mainElement = elem;
        }
    }

    const spirit = SPIRIT_DATA[mainElement];
    const wealthData = [
        { stage: "초년", value: 30 + Math.random() * 20 },
        { stage: "청년", value: 50 + Math.random() * 20 },
        { stage: "중년", value: 80 + Math.random() * 15 },
        { stage: "말년", value: 70 + Math.random() * 20 }
    ];

    // 결과 렌더링
    resultContent.innerHTML = `
        <div class="seonbi-intro card-header">
            <h2>에헴, ${name} ${titleName}의 운명이라오</h2>
            <p>음... 이 기운, 전상서에 적힌 대로 심상치 않구먼. 허허!</p>
        </div>

        <!-- 사용자의 사주를 상징하는 영물(십장생) -->
        <section class="animal-section card">
            <h3 class="section-title">0. ${name} ${titleName}를 상징하는 영물</h3>
            <div class="animal-visual">
                <div class="animal-image-container">
                    <img src="${ELEMENT_IMAGES[mainElement]}" alt="${spirit.name}" class="animal-image">
                </div>
                <div class="animal-info">
                    <h4>${spirit.name} (${spirit.hanja})</h4>
                    <p class="seonbi-text animal-desc">
                        ${formatText(spirit.desc)}
                    </p>
                </div>
            </div>
        </section>
        
        <p class="seonbi-text" style="margin-bottom: 2rem; margin-top: 2rem;">
            ${formatText(`그대가 태어난 때는 **${birthInfo}**이라. 하늘의 기운이 묘하게 얽혀있구려.`)}
        </p>

        <section class="analysis-section">
            <h3 class="section-title">1. 사주팔자 기본 구성</h3>
            <div class="saju-table-wrapper">
                <table class="saju-table">
                    <thead>
                        <tr>
                            <th>구분</th>
                            ${pillars.map(p => `<th>${p.title}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>천간</td>
                            ${pillars.map(p => `<td class="saju-char">${p.top.char}<br><span class="hanja-desc">(${p.top.name})</span></td>`).join('')}
                        </tr>
                        <tr>
                            <td>지지</td>
                            ${pillars.map(p => `<td class="saju-char">${p.bottom.char}<br><span class="hanja-desc">(${p.bottom.name})</span></td>`).join('')}
                        </tr>
                        <tr>
                            <td>오행</td>
                            ${pillars.map(p => `<td>${p.top.elem}/${p.bottom.elem}</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="analysis-section">
            <h3 class="section-title">2. 오행 분석 (기운의 균형)</h3>
            <div class="element-chart">
                ${Object.entries(scores).map(([elem, score]) => `
                    <div class="element-bar-group">
                        <span class="element-label">${elem}</span>
                        <div class="progress-bg"><div class="progress-fill" style="width: ${(score / 8) * 100}%"></div></div>
                        <span class="element-score">${score}자</span>
                    </div>
                `).join('')}
            </div>
            <p class="seonbi-text">
                ${formatText(`허허, 그대의 명식에는 **${mainElement}**의 기운이 가장 왕성하게 흐르고 있구려. 이는 삶의 중심을 잡아주는 든든한 뿌리가 될 수 있을 것이오.`)}
            </p>
        </section>

        <section class="analysis-section">
            <h3 class="section-title">3. 타고난 성향 및 잠재력</h3>
            <div class="mystical-image-container">
                <img src="${ELEMENT_IMAGES[mainElement]}" alt="${mainElement} 기운" class="element-image">
            </div>
            <p class="seonbi-text">
                ${formatText(`그대는 마치 **${getPertinentMetaphor(mainElement)}**와 같은 성정을 품고 있구려. ${pillars[1].top.desc}의 기운을 타고났으니, 남들에게 말 못 할 고고한 뜻이 가슴 깊이 자리 잡고 있을 가능성이 있어 보이오. 때로는 너무 강한 고집이 옥의 티가 될 수 있으나, 그 올곧음이 결국 그대를 빛내주는 보석이 될 수도 있을 것이라 생각하오.`)}
            </p>
        </section>

        <section class="analysis-section">
            <h3 class="section-title">4. ${name} ${titleName}의 2026년(丙午年) 총운</h3>
            <div class="summary-box">
                ${formatText(`**<span class="gradient-gold">성취</span>와 <span class="gradient-gold">열정</span>의 한 해가 될 것이오.** 병오년의 불꽃 같은 기운이 ${name} ${titleName}의 **${mainElement}** 기운과 조화를 이루며, **<span class="gradient-gold">새로운 도약</span>**을 재촉하고 있구려.`)}
                <br><br>
                <strong>요약하자면!</strong><br>
                <span class="gradient-gold">${formatText(`그동안 준비해온 일들이 빛을 발하고 대외적인 명성이 높아지는 시기가 될 것이오. 다만 불의 기운이 강하니 감정 조절에 유의하고, 주변의 조언을 귀담아듣는다면 큰 화를 피하고 복을 쟁취할 수 있을 것이오.`)}</span>
            </div>
        </section>

        <section class="analysis-section">
            <h3 class="section-title">5. 시기별 재산 흐름 (재물 지도)</h3>
            <div class="wealth-line-chart-container">
                <svg viewBox="0 0 400 200" class="wealth-line-chart">
                    <line x1="50" y1="50" x2="350" y2="50" stroke="rgba(212,175,55,0.1)" stroke-dasharray="2" />
                    <line x1="50" y1="100" x2="350" y2="100" stroke="rgba(212,175,55,0.1)" stroke-dasharray="2" />
                    <line x1="50" y1="150" x2="350" y2="150" stroke="rgba(212,175,55,0.1)" stroke-dasharray="2" />
                    <path d="M 50,${200 - wealthData[0].value * 1.5} L 150,${200 - wealthData[1].value * 1.5} L 250,${200 - wealthData[2].value * 1.5} L 350,${200 - wealthData[3].value * 1.5}" fill="none" stroke="var(--gold)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="chart-path" />
                    ${wealthData.map((d, i) => `
                        <circle cx="${50 + i * 100}" cy="${200 - d.value * 1.5}" r="4" fill="var(--gold)" />
                        <text x="${50 + i * 100}" y="190" text-anchor="middle" fill="var(--white)" font-size="10">${d.stage}</text>
                    `).join('')}
                </svg>
            </div>
            <p class="seonbi-text" style="margin-top: 1.5rem;">
                ${formatText(`에헴! 이 지도를 보시게나. ${name} ${titleName}의 재물운은 **중년기**에 가장 높게 솟아오르는 형국이니, 지금부터 기운을 잘 닦아 거둘 준비를 하시게나.`)}
            </p>
        </section>

        <section class="analysis-section summary-section">
            <h3 class="section-title">6. 에헴! 선비의 한마디</h3>
            <ul class="summary-list">
                <li>✨ ${formatText("**지금의 인연을 소중히 하되, 자신을 믿고 나아가시게나.**")}</li>
                <li>🌟 ${formatText("**서두르지 않아도 그대의 시간은 정해진 대로 흘러갈 것이외다.**")}</li>
                <li>📍 ${formatText("**말을 아끼고 귀를 열면 생각지도 못한 복(福)이 굴러들어올 수 있다오.**")}</li>
            </ul>
        </section>
    `;
}

function getPertinentMetaphor(elem) {
    const metaphors = {
        "목": "푸른 숲을 호령하는 거대한 소나무", "화": "어둠을 밝히는 한여름의 태양", "토": "모든 것을 품어내는 드넓은 대지", "금": "날카롭고 고결한 은빛 보검", "수": "깊이를 가늠할 수 없는 고요한 바다"
    };
    return metaphors[elem] || "신비로운 우주의 기운";
}

// 로또 및 공유 로직
const shareBtn = document.getElementById('shareBtn');
shareBtn.addEventListener('click', function () {
    if (navigator.share) {
        navigator.share({ title: '신비로 - 선비의 사주 풀이', text: '에헴! 내 사주를 보러 오시게나.', url: window.location.href })
            .then(() => { unlockLotto(); })
            .catch(err => { unlockLotto(); });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("에헴! 링크를 복사했으니 동네방네 소문을 내주시게나.");
            unlockLotto();
        });
    }
});

function unlockLotto() {
    const container = document.querySelector('.lotto-blur');
    container.classList.add('unlocked');
    const slots = document.querySelectorAll('.slot');
    const luckyNumbers = generateLottoNumbers();
    slots.forEach((slot, index) => { animateSlot(slot, luckyNumbers[index], index * 200); });
    shareBtn.innerText = "복(福)이 가득하시게나!";
    shareBtn.disabled = true;
}

function generateLottoNumbers() {
    const nums = [];
    while (nums.length < 6) {
        const r = Math.floor(Math.random() * 45) + 1;
        if (nums.indexOf(r) === -1) nums.push(r);
    }
    return nums.sort((a, b) => a - b);
}

function animateSlot(slot, target, delay) {
    setTimeout(() => {
        let count = 0;
        const interval = setInterval(() => {
            slot.innerText = Math.floor(Math.random() * 45) + 1;
            count++;
            if (count > 20) {
                clearInterval(interval);
                slot.innerText = target;
                slot.style.background = "var(--white)";
                slot.style.color = "var(--gold)";
                slot.style.transform = "scale(1.1)";
                setTimeout(() => { slot.style.transform = "scale(1)"; }, 200);
            }
        }, 50);
    }, delay);
}
