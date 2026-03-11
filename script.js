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

// 지장간(Jijanggan) 데이터
const JIJANGGAN = {
    "子": ["壬", "癸"], "丑": ["癸", "辛", "己"], "寅": ["戊", "丙", "甲"], "卯": ["甲", "乙"],
    "辰": ["乙", "癸", "戊"], "巳": ["戊", "庚", "丙"], "午": ["丙", "己", "丁"], "未": ["丁", "乙", "己"],
    "申": ["戊", "壬", "庚"], "酉": ["庚", "辛"], "戌": ["辛", "丁", "戊"], "亥": ["戊", "甲", "壬"]
};

// 진태양시 및 사주 원국 계산 공식 (Deterministic v4.1)
function calculateSaju(data) {
    let totalMinutes = (data.ampm === 'PM' && data.hour !== 12 ? data.hour + 12 : (data.ampm === 'AM' && data.hour === 12 ? 0 : data.hour)) * 60 + data.min;
    if (!data.isUnknown) totalMinutes -= 30;

    const correctedHour = Math.floor((totalMinutes < 0 ? totalMinutes + 1440 : totalMinutes) / 60);
    const baseDate = new Date(1900, 0, 1);
    const birthDate = new Date(data.year, data.month - 1, data.day);
    const diffDays = Math.floor((birthDate - baseDate) / (24 * 60 * 60 * 1000));

    const dayStemIdx = (diffDays + 0) % 10;
    const dayBranchIdx = (diffDays + 10) % 12;
    const yearStemIdx = (data.year - 4) % 10;
    const yearBranchIdx = (data.year - 4) % 12;

    let monthBranchIdx = (data.month + 1) % 12;
    let monthStemBase = (yearStemIdx % 5) * 2 + 2;
    let monthStemIdx = (monthStemBase + data.month - 1) % 10;

    let hourBranchIdx = Math.floor((correctedHour + 1) / 2) % 12;
    let hourStemBase = (dayStemIdx % 5) * 2;
    let hourStemIdx = (hourStemBase + hourBranchIdx) % 10;

    const pillars = {
        year: { top: STEMS[yearStemIdx], bottom: BRANCHES[yearBranchIdx] },
        month: { top: STEMS[monthStemIdx], bottom: BRANCHES[monthBranchIdx] },
        day: { top: STEMS[dayStemIdx], bottom: BRANCHES[dayBranchIdx] },
        hour: data.isUnknown ? null : { top: STEMS[hourStemIdx], bottom: BRANCHES[hourBranchIdx] },
        solarTime: correctedHour
    };

    // 대운 계산
    const daewun = calculateDaewun(data, pillars);
    return { ...pillars, daewun };
}

function calculateDaewun(data, pillars) {
    const isYangYear = pillars.year.top.polar === 'yang';
    const isForward = (data.gender === 'male' && isYangYear) || (data.gender === 'female' && !isYangYear);

    // 대운수 (간략화: 날짜 기반 근사치)
    const daewunNum = Math.max(1, Math.min(9, Math.floor((data.day % 30) / 3) || 5));

    const cycles = [];
    let curStemIdx = STEMS.findIndex(s => s.char === pillars.month.top.char);
    let curBranchIdx = BRANCHES.findIndex(b => b.char === pillars.month.bottom.char);

    for (let i = 1; i <= 10; i++) {
        if (isForward) {
            curStemIdx = (curStemIdx + 1) % 10;
            curBranchIdx = (curBranchIdx + 1) % 12;
        } else {
            curStemIdx = (curStemIdx + 9) % 10; // (curStemIdx - 1 + 10) % 10
            curBranchIdx = (curBranchIdx + 11) % 12; // (curBranchIdx - 1 + 12) % 12
        }
        cycles.push({
            age: daewunNum + (i - 1) * 10,
            top: STEMS[curStemIdx],
            bottom: BRANCHES[curBranchIdx]
        });
    }
    return { number: daewunNum, cycles };
}

function getSinsal(pillars) {
    const sinsal = [];
    const branches = [pillars.year.bottom.char, pillars.month.bottom.char, pillars.day.bottom.char];
    if (pillars.hour) branches.push(pillars.hour.bottom.char);

    const check = (list, name) => {
        if (branches.some(b => list.includes(b))) sinsal.push(name);
    };

    check(["寅", "申", "巳", "亥"], "역마살(驛馬殺)");
    check(["子", "午", "卯", "酉"], "도화살(桃花殺)");
    check(["辰", "戌", "丑", "未"], "화개살(華蓋殺)");

    return sinsal.length ? sinsal : ["특이 신살 없음"];
}

function generateSajuResultV4(data) {
    const result = calculateSaju(data);
    const dm = result.day.top;
    const sinsal = getSinsal(result);
    const resultDiv = document.getElementById('resultContent');

    // 십성 및 오행 분석
    const allPillars = [result.year, result.month, result.day, result.hour].filter(p => p !== null);
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
            <h2>🔮 ${data.name} 님의 사주 분석 보고서 (v4.2)</h2>
            <p>보정된 진태양시 기준: ${result.solarTime}시 (KST 대비 -30분 보정)</p>
        </div>

        <section class="analysis-section">
            <h3 class="section-title">1. 사주 원국 및 지장간 (四柱 & 地藏干)</h3>
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
                            ${renderPillarCell(result.hour, 'top', tenGodsTable[3])}
                            ${renderPillarCell(result.day, 'top', { top: '일간(DM)' })}
                            ${renderPillarCell(result.month, 'top', tenGodsTable[1])}
                            ${renderPillarCell(result.year, 'top', tenGodsTable[0])}
                        </tr>
                        <tr>
                            <td>지제(地支)</td>
                            ${renderPillarCell(result.hour, 'bottom', tenGodsTable[3])}
                            ${renderPillarCell(result.day, 'bottom', tenGodsTable[2])}
                            ${renderPillarCell(result.month, 'bottom', tenGodsTable[1])}
                            ${renderPillarCell(result.year, 'bottom', tenGodsTable[0])}
                        </tr>
                        <tr class="jijanggan-row">
                            <td>지장간</td>
                            ${renderJijanggan(result.hour)}
                            ${renderJijanggan(result.day)}
                            ${renderJijanggan(result.month)}
                            ${renderJijanggan(result.year)}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="analysis-box">
                <p><strong>신살 분석:</strong> ${sinsal.join(', ')}</p>
                <p><strong>형충회합:</strong> ${getInteractions(result)}</p>
            </div>
        </section>

        <section class="analysis-section">
            <h3 class="section-title">2. 대운 흐름 (10년 주기 운의 변화)</h3>
            <p class="small-desc">대운수: ${result.daewun.number} (태어난 후 ${result.daewun.number}년마다 운이 변합니다)</p>
            <div class="daewun-scroll-wrapper">
                <div class="daewun-container">
                    ${result.daewun.cycles.map(c => `
                        <div class="daewun-card">
                            <span class="daewun-age">${c.age}세</span>
                            <div class="daewun-pillar">
                                <span>${c.top.char}</span>
                                <span>${c.bottom.char}</span>
                            </div>
                            <span class="daewun-emo">${c.top.emoji}${c.bottom.emoji}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section class="analysis-section">
            <h3 class="section-title">3. 2026년(丙午年) 상세 세운</h3>
            <div class="summary-box">
                <p><strong>총평:</strong> 병오년의 불꽃 같은 열기가 ${data.name} 님의 <strong>${dm.elem}</strong> 기운과 ${dm.elem === '수' ? '충돌하며 긴장감' : '만나 에너지가 증폭'}되는 한 해가 될 것이오.</p>
                <p><strong>주의사항:</strong> 지지의 '오(午)'화가 기존 원국과 ${getInteractions(result, '午')}을 형성하니, 대인관계에서의 구설수나 감정 과잉을 경계하되 추진력은 잃지 말아야 하오.</p>
            </div>
        </section>

        <section class="analysis-section">
            <h3 class="section-title">4. 직업 적성 및 궁합</h3>
            <div class="seonbi-text">
                <p><strong>추천 직업군:</strong> ${getRecommendedJobs(dm, scores)}</p>
                <p><strong>최고의 궁합:</strong> ${getCompatibility(dm)} 타입의 사람과 함께할 때 가장 큰 시너지가 발생할 것이오.</p>
                <p><strong>직업 분석:</strong> 현재 종사하시는 <strong>'${data.job}'</strong> 분야는 본인의 ${getTenGods(dm, result.month.bottom)} 기운과 연결되어 있어, 시간이 흐를수록 뿌리가 깊어질 것이라 사료되오.</p>
            </div>
        </section>
    `;
}

function renderJijanggan(pillar) {
    if (!pillar) return `<td>-</td>`;
    const hidden = JIJANGGAN[pillar.bottom.char];
    return `<td class="jijanggan-cell">${hidden.join(' ')}</td>`;
}

function getInteractions(result, extra = null) {
    const b = [result.year.bottom.char, result.month.bottom.char, result.day.bottom.char];
    if (result.hour) b.push(result.hour.bottom.char);
    if (extra) b.push(extra);

    const interactions = [];
    if (b.includes("子") && b.includes("午")) interactions.push("자오충(子午冲)");
    if (b.includes("寅") && b.includes("申")) interactions.push("인신충(寅申冲)");
    if (b.includes("卯") && b.includes("酉")) interactions.push("묘유충(卯酉冲)");
    if (b.includes("子") && b.includes("丑")) interactions.push("자축합(子丑合)");

    return interactions.length ? interactions.join(', ') : "특이 기운 작용 없음";
}

function getRecommendedJobs(dm, scores) {
    const jobs = {
        "목": "교육, 문학, 설계, 디자인, 상담",
        "화": "IT, 미디어, 예술, 마케팅, 조명",
        "토": "부동산, 중개, 인사관리, 종교, 농업",
        "금": "금융, 법조, 엔지니어링, 금속조합",
        "수": "기획, 해양, 유통, 심리학, 연구원"
    };
    return jobs[dm.elem];
}

function getCompatibility(dm) {
    const map = { "목": "화(火)", "화": "토(土)", "토": "금(金)", "금": "수(水)", "수": "목(木)" };
    return map[dm.elem] || "상권(象權)";
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
