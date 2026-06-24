/**
 * haki's Blog — 小黑怪诞手绘风格 v2
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
    if (!displayPath || displayPath.endsWith('/')) {
        return (displayPath || '') + 'index.md';
    }
    return displayPath + '.md';
}

/**
 * 小黑插画注入
 */
function injectXiaoheiIllustration(displayPath) {
    const topEl = document.getElementById('xiaohei-top');
    const bottomEl = document.getElementById('xiaohei-bottom');
    if (!topEl || !bottomEl) return;
    topEl.innerHTML = '';
    bottomEl.innerHTML = '';

    const imgs = SITE_CONFIG.XIAOHEI_IMAGES || {};
    const cleanPath = displayPath.replace(/\/$/, '');

    if (cleanPath === 'index') {
        // 首页：Hero
        topEl.innerHTML = `
        <div class="xiaohei-hero">
          <img src="${imgs.hero}" alt="haki 在写博客">
          <div class="cap">— 小黑在认真写代码</div>
        </div>`;
        bottomEl.innerHTML = `<div class="sketch-divider"><span class="l"></span><span class="d"></span><span class="l"></span></div>`;

    } else if (cleanPath === 'about') {
        topEl.innerHTML = `
        <div class="xiaohei-hero">
          <div class="sketch-divider" style="margin-bottom:0.5rem;"><span class="l"></span><span class="d"></span><span class="l"></span></div>
        </div>`;
        bottomEl.innerHTML = `
        <div style="max-width:960px;margin:1rem auto 0;padding:0 20px;">
          <div class="xiaohei-full">
            <img src="${imgs.about}" alt="小黑在搭建网站">
            <div class="cap">— 小黑在搭博客</div>
          </div>
        </div>`;

    } else if (cleanPath === 'blog') {
        topEl.innerHTML = `
        <div class="xiaohei-full">
          <img src="${imgs.blog}" alt="小黑在翻阅文章">
        </div>
        <div style="max-width:960px;margin:0 auto;padding:0 20px;">
          <p style="font-family:'Sketch',cursive;font-size:0.75rem;color:var(--ablue,#5B8EC4);text-align:right;margin-top:0.2rem;">— 小黑在翻文章归档</p>
        </div>`;

    } else {
        // 文章页：随机选择一幅日常插画贴在底部
        const articleImgs = [imgs.coding, imgs.reading, imgs.noodles, imgs.exercise];
        const pick = articleImgs[Math.floor(Math.random() * articleImgs.length)];
        if (pick) {
            bottomEl.innerHTML = `
            <div style="max-width:960px;margin:2rem auto 0;padding:0 20px;">
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
}

/**
 * 页面加载
 */
async function loadPage(rawPath) {
    const displayPath = resolvePath(rawPath);
    const url = new URL(window.location);
    if (url.searchParams.get('p') !== displayPath) {
        url.searchParams.set('p', displayPath);
        window.history.pushState({ path: displayPath }, '', url);
    }
    mask.classList.remove('exit');
    mask.classList.add('active');
    await sleep(300);

    renderPathNav(displayPath);

    const targetFile = getPhysicalPath(displayPath);
    try {
        const response = await fetch(SITE_CONFIG.PAGE_ROOT + targetFile);
        if (!response.ok) throw new Error('404');
        let mdContent = await response.text();
        let htmlResult = marked.parse(mdContent);
        mainContent.innerHTML = htmlResult;
        postProcess(mainContent, displayPath);
        injectXiaoheiIllustration(displayPath);  // 在内容渲染之后再注入插画
        if (window.MathJax) {
            MathJax.typesetClear([mainContent]);
            MathJax.typesetPromise([mainContent]).catch(console.error);
        }
    } catch (e) {
        console.error(e);
        injectXiaoheiIllustration('__404__');
        mainContent.innerHTML = `
        <div class="xiaohei-404">
          <img src="${(SITE_CONFIG.XIAOHEI_IMAGES || {}).lost || ''}" alt="404 小黑迷路了">
          <h2>404 · 小黑迷路了</h2>
          <p>这个页面不见了 😅<br>也许它从来没有存在过，也许它被 DDL 吃掉了。</p>
          <p style="margin-top:1rem;"><a href="#" data-path="index">← 回首页看看</a></p>
        </div>`;
    }

    mask.classList.remove('active');
    mask.classList.add('exit');
}

function postProcess(container, currentPath) {
    if (currentPath.replace(/\/$/, '') === 'blog') {
        renderBlogList(container);
    }
    if (currentPath.replace(/\/$/, '') === 'index') {
        injectIndexExtras(container);
    }
}

/**
 * 首页额外内容：个人卡片 + 日常快照
 */
function injectIndexExtras(container) {
    const imgs = SITE_CONFIG.XIAOHEI_IMAGES || {};
    // 在 Links 段落后插入日常快照
    const h2s = container.querySelectorAll('h2');
    h2s.forEach(h2 => {
        if (h2.textContent.includes('Links') || h2.textContent.includes('链接')) {
            const dailyHTML = `
            <h2 style="margin-top:2.5rem;">日常快照</h2>
            <div class="daily-grid">
              <div class="daily-card">
                <img src="${imgs.coding}" alt="写代码" loading="lazy">
                <div class="label">写代码 · Debug 中</div>
              </div>
              <div class="daily-card">
                <img src="${imgs.reading}" alt="看书" loading="lazy">
                <div class="label">啃书 · 数据结构</div>
              </div>
              <div class="daily-card">
                <img src="${imgs.noodles}" alt="吃泡面" loading="lazy">
                <div class="label">泡面 · 深夜续航</div>
              </div>
            </div>`;
            h2.insertAdjacentHTML('afterend', dailyHTML);
        }
    });

    // 在 blockquote 附近插入运动小图
    const hr = container.querySelector('hr');
    if (hr) {
        const footerHTML = `
        <div class="article-footer-card">
          <img src="${imgs.exercise}" alt="小黑运动" loading="lazy">
          <div class="aft-text">
            <span class="aft-name">haki</span> · 一名普通的大一学生<br>
            学代码、写博客、吃泡面、操场跑圈。<br>
            把每一天过成奇怪但成立的样子。
          </div>
        </div>`;
        hr.insertAdjacentHTML('afterend', footerHTML);
    }
}

/**
 * 渲染博客列表（增强版：含标签云）
 */
async function renderBlogList(container) {
    try {
        const res = await fetch('./articles.json');
        const articles = await res.json();
        articles.sort((a, b) => new Date(b.created) - new Date(a.created));

        // 收集标签
        const tagCounts = {};
        articles.forEach(a => {
            (a.tags || []).forEach(t => {
                tagCounts[t] = (tagCounts[t] || 0) + 1;
            });
        });
        const topTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1]).slice(0, 8);

        let tagHTML = '<div class="tag-cloud">';
        topTags.forEach(([tag, count]) => {
            tagHTML += `<span class="tcloud-tag">${tag} ×${count}</span>`;
        });
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
                const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const tagBadges = (a.tags || []).slice(0, 2).map(t => `<span style="font-family:'Sketch',cursive;font-size:0.65rem;color:var(--aorange,#E8903A);margin-left:6px;">#${t}</span>`).join('');
                listHTML += `
                <li class="timeline-item">
                    <span class="timeline-date">${monthDay}</span>
                    <a href="#" data-path="blog/${a.id}">${a.title}</a>${tagBadges}
                </li>`;
            });
            listHTML += '</ul>';
        });
        container.innerHTML += tagHTML + listHTML + '</div>';
    } catch (e) {
        container.innerHTML += '<p>无法加载文章列表</p>';
    }
}

function renderPathNav(displayPath) {
    const parts = displayPath.split('/').filter(p => p);
    let html = `<a data-path="index">首页</a><span>/</span>`;
    let current = "";
    parts.forEach((part, i) => {
        const isLast = i === parts.length - 1;
        const isDir = displayPath.endsWith('/') || !isLast;
        current += part + (isDir ? "/" : "");
        if (isLast && !displayPath.endsWith('/')) {
            html += `<span>${decodeURIComponent(part)}</span>`;
        } else {
            html += `<a data-path="${current}">${decodeURIComponent(part)}</a><span>/</span>`;
        }
    });
    const nav = document.getElementById('path-nav');
    if (nav) nav.innerHTML = html;
}

const ThemeManager = {
    btn: document.getElementById('theme-toggle'),
    icon: document.getElementById('theme-icon'),
    style: document.getElementById('markdown-style'),
    init() {
        const isDarkSaved = localStorage.getItem('darkMode') === 'true';
        this.set(isDarkSaved);
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
