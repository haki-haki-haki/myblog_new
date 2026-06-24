/**
 * haki's Blog v3 — 小黑漫画家布局
 */
const mask = document.getElementById('page-mask');
const mainContent = document.getElementById('main-content');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function resolvePath(rawPath) {
    if (!rawPath) return SITE_CONFIG.DEFAULT_PAGE;
    let path = rawPath.replace(/\.md$/, '');
    if (path.endsWith('/index')) path = path.slice(0, -6);
    if (path.startsWith('/')) path = path.substring(1);
    return path;
}
function getPhysicalPath(displayPath) {
    if (!displayPath || displayPath.endsWith('/')) return (displayPath || '') + 'index.md';
    return displayPath + '.md';
}

const I = () => SITE_CONFIG.XIAOHEI_IMAGES || {};

/* ═══════════ 插画注入 ═══════════ */
function injectXiaohei(topEl, bottomEl, displayPath) {
    if (!topEl || !bottomEl) return;
    topEl.innerHTML = '';
    bottomEl.innerHTML = '';
    const imgs = I();
    const cp = displayPath.replace(/\/$/, '');

    // ── 首页 ──
    if (cp === 'index') {
        topEl.innerHTML =
        `<div class="xiaohei-hero"><img src="${imgs.hero}" alt="haki"><div class="cap">— 小黑在认真写代码</div></div>`;
        bottomEl.innerHTML = `<div class="sketch-divider"><span class="l"></span><span class="d"></span><span class="l"></span></div>`;
        return;
    }

    // ── 关于页：漫画画廊 + 图文交错场景 ──
    if (cp === 'about') {
        topEl.innerHTML =
        `<div class="comic-gallery" style="max-width:960px;margin:1.5rem auto 0;padding:0 20px;">
          <div class="comic-item"><img src="${imgs.walking}" alt="散步"><div class="cm-label">傍晚散步</div></div>
          <div class="comic-item"><img src="${imgs.badminton}" alt="羽毛球"><div class="cm-label">周末羽毛球</div></div>
          <div class="comic-item"><img src="${imgs.travel}" alt="旅游"><div class="cm-label">假期旅行</div></div>
          <div class="comic-item"><img src="${imgs.train}" alt="高铁"><div class="cm-label">坐高铁回家</div></div>
        </div>`;
        bottomEl.innerHTML =
        `<div style="max-width:960px;margin:1rem auto 0;padding:0 20px;">
          <div class="sketch-divider"><span class="l"></span><span class="d"></span><span class="l"></span></div>
          <div class="xiaohei-hero"><img src="${imgs.about}" alt="小黑搭博客"><div class="cap">— 小黑在搭这个博客</div></div>
        </div>`;
        return;
    }

    // ── 博客归档页：顶部漫画式插图 + 底部场景 ──
    if (cp === 'blog') {
        topEl.innerHTML =
        `<div style="max-width:960px;margin:0 auto;padding:0 20px;">
          <div class="comic-gallery" style="margin:0.5rem 0 1.5rem;">
            <div class="comic-item"><img src="${imgs.blog}" alt="翻文章"><div class="cm-label">翻归档</div></div>
            <div class="comic-item"><img src="${imgs.classroom}" alt="上课"><div class="cm-label">学新东西</div></div>
            <div class="comic-item"><img src="${imgs.running}" alt="跑步"><div class="cm-label">跑步清空</div></div>
            <div class="comic-item"><img src="${imgs.noodles}" alt="泡面"><div class="cm-label">深夜泡面</div></div>
          </div>
        </div>`;
        bottomEl.innerHTML =
        `<div style="max-width:960px;margin:0 auto;padding:0 20px;">
          <div class="xiaohei-full"><img src="${imgs.reading}" alt="看书"><div class="cap">— 小黑也在啃大部头</div></div>
        </div>`;
        return;
    }

    // ── 文章页：随机日常小图 ──
    const articlePicks = [imgs.badminton, imgs.running, imgs.walking, imgs.noodles, imgs.coding, imgs.classroom, imgs.travel, imgs.train];
    const pick = articlePicks.filter(Boolean)[Math.floor(Math.random() * articlePicks.length)];
    if (pick) {
        bottomEl.innerHTML =
        `<div style="max-width:960px;margin:2rem auto 0;padding:0 20px;">
          <div class="sketch-divider"><span class="l"></span><span class="d"></span><span class="l"></span></div>
          <div class="xiaohei-hero" style="padding-top:0.3rem;">
            <img src="${pick}" alt="小黑日常" style="max-width:420px;">
            <div class="cap" style="color:var(--aorange,#E8903A);">— 小黑也在认真过日子</div>
          </div>
        </div>`;
    } else {
        bottomEl.innerHTML = `<div class="sketch-divider"><span class="l"></span><span class="d"></span><span class="l"></span></div>`;
    }
}

/* ═══════════ 页面加载 ═══════════ */
async function loadPage(rawPath) {
    const dp = resolvePath(rawPath);
    const url = new URL(window.location);
    if (url.searchParams.get('p') !== dp) {
        url.searchParams.set('p', dp);
        window.history.pushState({ path: dp }, '', url);
    }
    mask.classList.remove('exit');
    mask.classList.add('active');
    await sleep(300);
    renderPathNav(dp);

    const targetFile = getPhysicalPath(dp);
    try {
        const resp = await fetch(SITE_CONFIG.PAGE_ROOT + targetFile);
        if (!resp.ok) throw new Error('404');
        let md = await resp.text();
        let html = marked.parse(md);
        mainContent.innerHTML = html;
        postProcess(mainContent, dp);
        injectXiaohei(document.getElementById('xiaohei-top'), document.getElementById('xiaohei-bottom'), dp);
        if (window.MathJax) { MathJax.typesetClear([mainContent]); MathJax.typesetPromise([mainContent]).catch(console.error); }
    } catch (e) {
        console.error(e);
        injectXiaohei(document.getElementById('xiaohei-top'), document.getElementById('xiaohei-bottom'), '__404__');
        const lostImg = I().lost || '';
        mainContent.innerHTML =
        `<div class="xiaohei-404">
          <img src="${lostImg}" alt="404 小黑迷路了">
          <h2>404 · 小黑迷路了</h2>
          <p>这个页面不见了 😅<br>也许它从来没有存在过，也许它被 DDL 吃掉了。</p>
          <p style="margin-top:1rem;"><a href="#" data-path="index">← 回首页看看</a></p>
        </div>`;
    }
    mask.classList.remove('active');
    mask.classList.add('exit');
}

function postProcess(container, currentPath) {
    if (currentPath.replace(/\/$/, '') === 'blog') renderBlogList(container);
    if (currentPath.replace(/\/$/, '') === 'index') injectIndexExtras(container);
}

/* ═══════════ 首页：日常快照 + 签名卡 ═══════════ */
function injectIndexExtras(container) {
    const imgs = I();
    const h2s = container.querySelectorAll('h2');
    h2s.forEach(h2 => {
        if (h2.textContent.includes('Links') || h2.textContent.includes('链接')) {
            const dailyHTML =
            `<h2 style="margin-top:2.5rem;">日常快照</h2>
            <div class="daily-grid">
              <div class="daily-card"><img src="${imgs.badminton}" alt="羽毛球" loading="lazy"><div class="label">周末羽毛球</div></div>
              <div class="daily-card"><img src="${imgs.running}" alt="跑步" loading="lazy"><div class="label">操场跑圈</div></div>
              <div class="daily-card"><img src="${imgs.train}" alt="高铁" loading="lazy"><div class="label">坐高铁回家</div></div>
              <div class="daily-card"><img src="${imgs.noodles}" alt="泡面" loading="lazy"><div class="label">深夜泡面</div></div>
              <div class="daily-card"><img src="${imgs.travel}" alt="旅行" loading="lazy"><div class="label">假期旅行</div></div>
              <div class="daily-card"><img src="${imgs.walking}" alt="散步" loading="lazy"><div class="label">傍晚散步</div></div>
            </div>`;
            h2.insertAdjacentHTML('afterend', dailyHTML);
        }
    });
    const hr = container.querySelector('hr');
    if (hr) {
        const footerHTML =
        `<div class="article-footer-card">
          <img src="${imgs.classroom}" alt="上课" loading="lazy">
          <div class="aft-text">
            <span class="aft-name">haki</span> · 一名普通的大一学生<br>
            上课 / 写代码 / 吃泡面 / 操场跑圈 / 坐高铁回家 / 打羽毛球。<br>
            把每一天过成奇怪但成立的样子。
          </div>
        </div>`;
        hr.insertAdjacentHTML('afterend', footerHTML);
    }
}

/* ═══════════ 博客列表：标签云 + 时间线 ═══════════ */
async function renderBlogList(container) {
    try {
        const res = await fetch('./articles.json');
        const articles = await res.json();
        articles.sort((a, b) => new Date(b.created) - new Date(a.created));

        const tagCounts = {};
        articles.forEach(a => { (a.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }); });
        const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
        let tagHTML = '<div class="tag-cloud">';
        topTags.forEach(([tag, count]) => { tagHTML += `<span class="tcloud-tag">${tag} ×${count}</span>`; });
        tagHTML += '</div>';

        const groups = articles.reduce((acc, a) => {
            const year = new Date(a.created).getFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(a);
            return acc;
        }, {});
        let listHTML = '<div class="timeline-container">';
        Object.keys(groups).sort((a, b) => b - a).forEach(year => {
            const count = groups[year].length;
            listHTML += `<h2 class="timeline-year">${year} <span class="timeline-meta">· ${count} 篇</span></h2><ul class="timeline-list">`;
            groups[year].forEach(a => {
                const date = new Date(a.created);
                const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const tagBadges = (a.tags || []).slice(0, 2).map(t => `<span style="font-family:'Sketch',cursive;font-size:0.62rem;color:var(--aorange,#E8903A);margin-left:5px;">#${t}</span>`).join('');
                listHTML += `<li class="timeline-item"><span class="timeline-date">${mmdd}</span><a href="#" data-path="blog/${a.id}">${a.title}</a>${tagBadges}</li>`;
            });
            listHTML += '</ul>';
        });
        container.innerHTML += tagHTML + listHTML + '</div>';
    } catch (e) { container.innerHTML += '<p>无法加载文章列表</p>'; }
}

function renderPathNav(displayPath) {
    const parts = displayPath.split('/').filter(p => p);
    let html = `<a data-path="index">首页</a><span>/</span>`;
    let current = "";
    parts.forEach((part, i) => {
        const isLast = i === parts.length - 1;
        const isDir = displayPath.endsWith('/') || !isLast;
        current += part + (isDir ? "/" : "");
        if (isLast && !displayPath.endsWith('/')) html += `<span>${decodeURIComponent(part)}</span>`;
        else html += `<a data-path="${current}">${decodeURIComponent(part)}</a><span>/</span>`;
    });
    const nav = document.getElementById('path-nav');
    if (nav) nav.innerHTML = html;
}

const ThemeManager = {
    btn: document.getElementById('theme-toggle'),
    icon: document.getElementById('theme-icon'),
    style: document.getElementById('markdown-style'),
    init() {
        const s = localStorage.getItem('darkMode') === 'true';
        this.set(s);
        if (this.btn) this.btn.onclick = () => this.set(!document.body.classList.contains('dark-mode'));
    },
    set(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        if (this.style) this.style.href = isDark ? SITE_CONFIG.DARK_STYLE : SITE_CONFIG.LIGHT_STYLE;
        if (this.icon) this.icon.textContent = isDark ? 'dark_mode' : 'light_mode';
        localStorage.setItem('darkMode', isDark);
    }
};

document.addEventListener('click', e => {
    const link = e.target.closest('[data-path]');
    if (!link) return;
    e.preventDefault();
    loadPage(link.getAttribute('data-path'));
});
window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    loadPage(params.get('p') || SITE_CONFIG.DEFAULT_PAGE);
});
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    const params = new URLSearchParams(window.location.search);
    loadPage(params.get('p') || SITE_CONFIG.DEFAULT_PAGE);
});
window.onfocus = () => document.title = SITE_CONFIG.IN_TITLE;
window.onblur = () => document.title = SITE_CONFIG.OUT_TITLE;
