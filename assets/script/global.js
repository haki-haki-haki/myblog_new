/**
 * haki's Blog — 小黑怪诞手绘风格
 * 在原有 SPA 路由基础上增加了小黑插画注入
 */
const mask = document.getElementById('page-mask');
const mainContent = document.getElementById('main-content');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * 路径转换逻辑：规范化 URL 路径
 */
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
 * 小黑插画注入：根据页面路径在顶部/底部插入不同插画
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
        // 首页：Hero 小黑白板上写字
        topEl.innerHTML = `
        <div class="xiaohei-hero">
          <img src="${imgs.hero}" alt="haki 在写博客">
          <div class="cap">— 小黑在认真写代码</div>
        </div>`;
        // 底部留白
        bottomEl.innerHTML = `<div class="sketch-divider"><span class="l"></span><span class="d"></span><span class="l"></span></div>`;

    } else if (cleanPath === 'about') {
        // 关于页：右浮动小插画
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
        // 博客归档页：顶部大图
        topEl.innerHTML = `
        <div class="xiaohei-full">
          <img src="${imgs.blog}" alt="小黑在翻阅文章">
        </div>
        <div style="max-width:960px;margin:0 auto;padding:0 20px;">
          <p style="font-family:'Sketch',cursive;font-size:0.75rem;color:var(--ablue,#5B8EC4);text-align:right;margin-top:0.2rem;">— 小黑在翻文章归档</p>
        </div>`;

    } else {
        // 普通文章页：底部小分割线
        bottomEl.innerHTML = `<div class="sketch-divider"><span class="l"></span><span class="d"></span><span class="l"></span></div>`;
    }
}

/**
 * 页面加载核心函数
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
    injectXiaoheiIllustration(displayPath);

    const targetFile = getPhysicalPath(displayPath);
    try {
        const response = await fetch(SITE_CONFIG.PAGE_ROOT + targetFile);
        if (!response.ok) throw new Error('404');
        let mdContent = await response.text();
        let htmlResult = marked.parse(mdContent);
        mainContent.innerHTML = htmlResult;
        postProcess(mainContent, displayPath);
        if (window.MathJax) {
            MathJax.typesetClear([mainContent]);
            MathJax.typesetPromise([mainContent]).catch(console.error);
        }
    } catch (e) {
        console.error(e);
        mainContent.innerHTML = '<h1>404</h1><p>页面丢失了 😅</p>';
    }

    mask.classList.remove('active');
    mask.classList.add('exit');
}

function postProcess(container, currentPath) {
    if (currentPath.replace(/\/$/, '') === 'blog') {
        renderBlogList(container);
    }
}

/**
 * 渲染博客列表
 */
async function renderBlogList(container) {
    try {
        const res = await fetch('./articles.json');
        const articles = await res.json();
        articles.sort((a, b) => new Date(b.created) - new Date(a.created));
        const groups = articles.reduce((acc, a) => {
            const year = new Date(a.created).getFullYear();
            if (!acc[year]) acc[year] = [];
            acc[year].push(a);
            return acc;
        }, {});
        let html = '<div class="timeline-container">';
        Object.keys(groups).sort((a, b) => b - a).forEach(year => {
            html += `<h2 class="timeline-year">${year}</h2><ul class="timeline-list">`;
            groups[year].forEach(a => {
                const date = new Date(a.created);
                const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                html += `
                <li class="timeline-item">
                    <span class="timeline-date">${monthDay}</span>
                    <a href="#" data-path="blog/${a.id}">${a.title}</a>
                </li>`;
            });
            html += '</ul>';
        });
        container.innerHTML += html + '</div>';
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

/**
 * 主题管理
 */
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
        if (this.icon) {
            this.icon.textContent = isDark ? 'dark_mode' : 'light_mode';
        }
        localStorage.setItem('darkMode', isDark);
    }
};

/**
 * 事件监听与初始化
 */
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
