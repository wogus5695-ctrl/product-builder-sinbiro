// 명리학 기초 데이터 (v4.1)
const STEMS = [
    { char: "甲", name: "갑", elem: "목", emoji: "🟢", polar: "yang" },
    { char: "乙", name: "을", elem: "목", emoji: "🟢", polar: "yin" },
    { char: "丙", name: "병", elem: "화", emoji: "🔴", polar: "yang" },
    { char: "丁", name: "정", elem: "화", emoji: "🔴", polar: "yin" },
    { char: "戊", name: "무", elem: "토", emoji: "🟡", polar: "yang" },
    { char: "己", name: "기", elem: "토", emoji: "🟡", polar: "yin" },
    { char: "庚", name: "경", elem: "금", emoji: "⚪", polar: "yang" },
    { char: "辛", name: "신", elem: "금", emoji: "⚪", polar: "yin" },
    { char: "壬", name: "임", elem: "수", emoji: "🔵", polar: "yang" },
    { char: "癸", name: "계", elem: "수", emoji: "🔵", polar: "yin" }
];

const BRANCHES = [
    { char: "子", name: "자", elem: "수", emoji: "🔵", polar: "yang" },
    { char: "丑", name: "축", elem: "토", emoji: "🟡", polar: "yin" },
    { char: "寅", name: "인", elem: "목", emoji: "🟢", polar: "yang" },
    { char: "卯", name: "묘", elem: "목", emoji: "🟢", polar: "yin" },
    { char: "辰", name: "진", elem: "토", emoji: "🟡", polar: "yang" },
    { char: "巳", name: "사", elem: "화", emoji: "🔴", polar: "yin" },
    { char: "午", name: "오", elem: "화", emoji: "🔴", polar: "yang" },
    { char: "未", name: "미", elem: "토", emoji: "🟡", polar: "yin" },
    { char: "申", name: "신", elem: "금", emoji: "⚪", polar: "yang" },
    { char: "酉", name: "유", elem: "금", emoji: "⚪", polar: "yin" },
    { char: "戌", name: "술", elem: "토", emoji: "🟡", polar: "yang" },
    { char: "亥", name: "해", elem: "수", emoji: "🔵", polar: "yin" }
];

const ELEMENT_IMAGES = {
    "목": "./images/element_wood.png",
    "화": "./images/element_fire.png",
    "토": "./images/element_earth.png",
    "금": "./images/element_metal.png",
    "수": "./images/element_water.png"
};

// 십성(Ten Gods) 관계 정의
function getTenGods(dayMaster, target) {
    const relations = {
        "비겁": { "same": "비견", "diff": "겁재" },
        "식상": { "same": "식신", "diff": "상관" },
        "재성": { "same": "편재", "diff": "정재" },
        "관성": { "same": "편관", "diff": "정관" },
        "인성": { "same": "편인", "diff": "정인" }
    };

    const elemOrder = ["목", "화", "토", "금", "수"];
    const dmIdx = elemOrder.indexOf(dayMaster.elem);
    const targetIdx = elemOrder.indexOf(target.elem);
    const diff = (targetIdx - dmIdx + 5) % 5;

    let group = "";
    if (diff === 0) group = "비겁";
    else if (diff === 1) group = "식상";
    else if (diff === 2) group = "재성";
    else if (diff === 3) group = "관성";
    else if (diff === 4) group = "인성";

    const polarMatch = dayMaster.polar === target.polar ? "same" : "diff";
    return relations[group][polarMatch];
}

// 초기화 로직
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.hash === '#result') window.location.hash = '';
    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
});

function handleNavigation() {
    const hash = window.location.hash;
    const funnel = document.getElementById('funnel');
    const result = document.getElementById('result');
    if (hash === '#result') {
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

document.getElementById('unknownTime').addEventListener('change', function (e) {
    const isChecked = e.target.checked;
    const targets = ['birthHour', 'birthMinute', 'birthAmPm'];
    targets.forEach(id => document.getElementById(id).disabled = isChecked);
    if (isChecked) {
        document.getElementById('birthHour').removeAttribute('required');
        document.getElementById('birthMinute').removeAttribute('required');
    } else {
        document.getElementById('birthHour').setAttribute('required', '');
        document.getElementById('birthMinute').setAttribute('required', '');
    }
});

document.getElementById('sajuForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = "🔮 진태양시를 보정하여 천기를 살피는 중이오...";
    submitBtn.disabled = true;

    setTimeout(() => {
        const data = {
            name: document.getElementById('userName').value,
            year: parseInt(document.getElementById('birthYear').value),
            month: parseInt(document.getElementById('birthMonth').value),
            day: parseInt(document.getElementById('birthDay').value),
            hour: parseInt(document.getElementById('birthHour').value || 0),
            min: parseInt(document.getElementById('birthMinute').value || 0),
            ampm: document.getElementById('birthAmPm').value,
            isUnknown: document.getElementById('unknownTime').checked,
            job: document.getElementById('userJob').value,
            gender: document.querySelector('input[name="gender"]:checked').value
        };

        generateSajuResultV4(data);
        window.location.hash = 'result';
        window.scrollTo(0, 0);
        submitBtn.innerText = "결과보기";
        submitBtn.disabled = false;
    }, 2000);
});

// 진태양시 및 사주 원국 계산 공식 (Deterministic v4.1)
function calculateSaju(data) {
    // 1. 진태양시 보정 (대한민국 기준 동경 127.5도, KST 135도 차이 30분 보정)
    let totalMinutes = (data.ampm === 'PM' && data.hour !== 12 ? data.hour + 12 : (data.ampm === 'AM' && data.hour === 12 ? 0 : data.hour)) * 60 + data.min;
    if (!data.isUnknown) totalMinutes -= 30; // 보정

    const correctedHour = Math.floor((totalMinutes < 0 ? totalMinutes + 1440 : totalMinutes) / 60);

    // 2. 일주 계산 (1900-01-01 갑술 기준일 경과일수 활용)
    const baseDate = new Date(1900, 0, 1);
    const birthDate = new Date(data.year, data.month - 1, data.day);
    const diffDays = Math.floor((birthDate - baseDate) / (24 * 60 * 60 * 1000));

    // 갑술(10번)에서 시작
    const dayStemIdx = (diffDays + 0) % 10;
    const dayBranchIdx = (diffDays + 10) % 12;

    // 3. 년주/월주 (간략화된 절기 계산 - 실제 상용 서비스에서는 Ephemeris API 권장)
    const yearStemIdx = (data.year - 4) % 10;
    const yearBranchIdx = (data.year - 4) % 12;

    // 월주 (년주에 따른 월간법 적용)
    let monthBranchIdx = (data.month + 1) % 12; // 인월(1월) 기준
    let monthStemBase = (yearStemIdx % 5) * 2 + 2;
    let monthStemIdx = (monthStemBase + data.month - 1) % 10;

    // 4. 시주 (일간에 따른 시간법 적용)
    let hourBranchIdx = Math.floor((correctedHour + 1) / 2) % 12;
    let hourStemBase = (dayStemIdx % 5) * 2;
    let hourStemIdx = (hourStemBase + hourBranchIdx) % 10;

    return {
        year: { top: STEMS[yearStemIdx], bottom: BRANCHES[yearBranchIdx] },
        month: { top: STEMS[monthStemIdx], bottom: BRANCHES[monthBranchIdx] },
        day: { top: STEMS[dayStemIdx], bottom: BRANCHES[dayBranchIdx] },
        hour: data.isUnknown ? null : { top: STEMS[hourStemIdx], bottom: BRANCHES[hourBranchIdx] },
        solarTime: correctedHour
    };
}

function generateSajuResultV4(data) {
    const pillars = calculateSaju(data);
    const dm = pillars.day.top;
    const resultDiv = document.getElementById('resultContent');

    // 십성 및 오행 분석
    const allPillars = [pillars.year, pillars.month, pillars.day, pillars.hour].filter(p => p !== null);
    const scores = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
    allPillars.forEach(p => {
        scores[p.top.elem]++;
        scores[p.bottom.elem]++;
    });

    const tenGodsTable = allPillars.map(p => ({
        top: getTenGods(dm, p.top),
        bottom: getTenGods(dm, p.bottom)
    }));

    resultDiv.innerHTML = `
        <div class="seonbi-intro card-header">
            <h2>🔮 ${data.name} 님의 사주 분석 보고서 (v4.1)</h2>
            <p>보정된 진태양시 기준: ${pillars.solarTime}시 (KST 대비 -30분 보정)</p>
        </div>

        <section class="analysis-section">
            <h3 class="section-title">1. 사주 원국 (四柱 原局)</h3>
            <div class="saju-table-wrapper">
                <table class="saju-table">
                    <thead>
                        <tr>
                            <th>구분</th>
                            <th>시주(時柱)</th>
                            <th class="pillar-title">일주(日主)</th>
                            <th>월주(月柱)</th>
                            <th>년주(年柱)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>천간(天干)</td>
                            ${renderPillarCell(pillars.hour, 'top', tenGodsTable[3])}
                            ${renderPillarCell(pillars.day, 'top', { top: '日干' })}
                            ${renderPillarCell(pillars.month, 'top', tenGodsTable[1])}
                            ${renderPillarCell(pillars.year, 'top', tenGodsTable[0])}
                        </tr>
                        <tr>
                            <td>지제(地支)</td>
                            ${renderPillarCell(pillars.hour, 'bottom', tenGodsTable[3])}
                            ${renderPillarCell(pillars.day, 'bottom', tenGodsTable[2])}
                            ${renderPillarCell(pillars.month, 'bottom', tenGodsTable[1])}
                            ${renderPillarCell(pillars.year, 'bottom', tenGodsTable[0])}
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="analysis-section">
            <h3 class="section-title">2. 오행 및 기운 분석</h3>
            <div class="element-chart">
                ${Object.entries(scores).map(([elem, score]) => `
                    <div class="element-bar-group">
                        <span class="element-label">${elem}</span>
                        <div class="progress-bg"><div class="progress-fill" style="width: ${(score / 8) * 100}%; background: ${getElemColor(elem)}"></div></div>
                        <span class="element-score">${score}자</span>
                    </div>
                `).join('')}
            </div>
        </section>

        <section class="analysis-section">
            <h3 class="section-title">3. 운명적 성격 및 직업 분석</h3>
            <div class="seonbi-text">
                <p><strong>천부적 성향:</strong> ${data.name} 님은 <strong>${dm.emoji} ${dm.name}(${dm.char})</strong> 일간을 타고나셨구려. 이는 사주에서 본인을 상징하는 가장 중요한 기운으로, ${dm.elem}의 성질을 강하게 띠고 있소. ${getDetailedDesc(dm, scores)}</p>
                <p><strong>현재 직업(${data.job})과의 조화:</strong> 본인의 사주 격국을 볼 때, ${data.job} 분야는 ${getJobAnalysis(dm, data.job, pillars)}한 흐름을 보이고 있구먼. 특히 월지의 기운이 강하게 작용하니 인내심을 갖고 전문성을 쌓는다면 충분히 대성할 격이라오.</p>
                <p><strong>앞으로의 조언:</strong> 올해는 ${dm.elem}의 기운을 보완해주는 ${getAdvice(scores)}이 필요한 시기라오. 과한 욕심보다는 본연의 자리를 지키며 덕을 쌓는다면, 머지않아 큰 기회가 문을 두드릴 것이오. 에헴!</p>
            </div>
        </section>
    `;
}

function renderPillarCell(pillar, pos, tg) {
    if (!pillar) return `<td>-</td>`;
    const item = pillar[pos];
    const gods = pos === 'top' ? (tg.top || tg) : tg.bottom;
    return `
        <td class="saju-char">
            <span class="ten-gods">${gods}</span>
            ${item.char}
            <span class="element-emo">${item.emoji}</span>
        </td>
    `;
}

function getElemColor(elem) {
    const colors = { "목": "#2ecc71", "화": "#e74c3c", "토": "#f1c40f", "금": "#ecf0f1", "수": "#3498db" };
    return colors[elem];
}

function getDetailedDesc(dm, scores) {
    if (dm.elem === "목") return "마치 봄날의 새싹처럼 강한 생명력과 추진력을 갖추고 있소. 위를 향해 뻗어 나가려는 향상심이 강하여 어떤 역경도 딛고 일어설 기개가 느껴지구먼.";
    if (dm.elem === "화") return "한여름의 태양처럼 열정적이고 화끈한 성품을 지녔구려. 예의가 바르고 밝은 에너지를 발산하여 주변 사람들을 이끄는 리더의 자질이 충분하오.";
    if (dm.elem === "토") return "만물을 품어주는 대지와 같은 포용력을 지녔구려. 신용을 중시하며 묵묵히 자신의 자리를 지키는 든든함이 그대의 가장 큰 자산이라 할 수 있겠소.";
    if (dm.elem === "금") return "날카로운 칼날처럼 결단력이 있고 의리가 깊은 성정이오. 옳고 그름이 명확하며, 한 번 맺은 인연을 소중히 여기는 단단한 자아를 지녔구먼.";
    return "쉼 없이 흐르는 물처럼 유연하고 지혜로운 사람이구려. 통찰력이 뛰어나고 임기응변에 능하며, 타인의 마음을 읽는 섬세함까지 겸비하고 있소.";
}

function getJobAnalysis(dm, job, pillars) {
    const keywords = ["성취", "도약", "안정", "변화", "인내"];
    return keywords[Math.floor(Math.random() * keywords.length)] + "적인";
}

function getAdvice(scores) {
    const lowElem = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
    return `${lowElem}의 기운을 보충해주는 식물이나 색상`;
}

document.getElementById('backToFunnelBtn').addEventListener('click', () => window.location.hash = '');
document.getElementById('shareBtn').addEventListener('click', function () {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: '신비로 - 사주 풀이', text: '에헴! 내 사주를 보러 오게나.', url }).then(unlockLotto).catch(unlockLotto);
    } else {
        navigator.clipboard.writeText(url).then(() => { alert("링크가 복사되었소! 널리 알려주시게나."); unlockLotto(); });
    }
});

function unlockLotto() {
    const container = document.querySelector('.lotto-blur');
    container.classList.add('unlocked');
    const slots = document.querySelectorAll('.slot');
    const luckyNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1).sort((a, b) => a - b);
    slots.forEach((slot, i) => {
        setTimeout(() => {
            slot.innerText = luckyNumbers[i];
            slot.style.background = "var(--white)";
            slot.style.color = "var(--gold)";
            slot.style.transform = "scale(1.1)";
            setTimeout(() => slot.style.transform = "scale(1)", 200);
        }, i * 200);
    });
    document.getElementById('shareBtn').innerText = "복(福)이 가득하시게나!";
    document.getElementById('shareBtn').disabled = true;
}
