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

    // ── 音乐页：顶部插画 ──
    if (cp === 'music') {
        topEl.innerHTML = '';
        bottomEl.innerHTML =
        `<div style="max-width:960px;margin:1rem auto 0;padding:0 20px;">
          <div class="sketch-divider"><span class="l"></span><span class="d"></span><span class="l"></span></div>
          <div class="xiaohei-hero"><img src="${imgs.reading}" alt="小黑听歌"><div class="cap">— 小黑也在单曲循环</div></div>
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

    // ── 文章页：按文章匹配专属插图，未匹配则随机 ──
    const articleImgMap = {
        'blog/cpp-polymorphism':  { src: imgs.cppcode,  cap: '— 小黑也在琢磨多态' },
        'blog/cpp-inheritance':   { src: imgs.inheritance, cap: '— 小黑画了个菱形继承' },
        'blog/cpp-array-pointer': { src: imgs.pointer,    cap: '— 小黑在画指针箭头' },
        'blog/dji-dt7-dma':       { src: imgs.drone,      cap: '— 小黑在玩无人机' },
        'blog/cpp-template-vector': { src: imgs.cppcode,  cap: '— 小黑在敲模板' },
        'blog/camera-baidu-api':  { src: imgs.coding,   cap: '— 小黑在调摄像头' }
    };
    const matched = articleImgMap[cp];
    if (matched && matched.src) {
        bottomEl.innerHTML =
        `<div style="max-width:960px;margin:2rem auto 0;padding:0 20px;">
          <div class="sketch-divider"><span class="l"></span><span class="d"></span><span class="l"></span></div>
          <div class="xiaohei-hero" style="padding-top:0.3rem;">
            <img src="${matched.src}" alt="小黑配图" style="max-width:420px;">
            <div class="cap" style="color:var(--aorange,#E8903A);">${matched.cap}</div>
          </div>
        </div>`;
    } else {
        const articlePicks = [imgs.badminton, imgs.running, imgs.walking, imgs.noodles, imgs.coding, imgs.cppcode, imgs.classroom, imgs.travel, imgs.train, imgs.inheritance];
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
    if (currentPath.replace(/\/$/, '') === 'music') renderMusicPage(container);
}

/* ═══════════ 首页：笔记分区 + 日常快照 + 签名卡 ═══════════ */
async function injectIndexExtras(container) {
    const imgs = I();
    const h2s = container.querySelectorAll('h2');
    h2s.forEach(h2 => {
        if (h2.textContent.includes('笔记分区') || h2.textContent.includes('分区')) {
            renderTagZone(h2);
        }
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

/* ═══════════ 笔记分区：标签配图卡片 ═══════════ */
async function renderTagZone(anchorH2) {
    const imgs = I();
    let articles = [];
    try {
        const res = await fetch('./articles.json');
        articles = await res.json();
    } catch (e) { return; }

    // 统计标签文章数
    const tagCounts = {};
    articles.forEach(a => { (a.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }); });

    // 主要分区定义（标签 -> 配图映射）
    const tagCards = [
        { tag: 'C++',       img: imgs.cppcode,    color: 'red'    },
        { tag: '嵌入式',     img: imgs.coding,     color: 'blue'   },
        { tag: '数学',       img: imgs.classroom,  color: 'orange' },
        { tag: '项目',       img: imgs.drone,      color: 'red'    },
        { tag: '前端',       img: imgs.blog,       color: 'blue'   },
        { tag: '学习笔记',   img: imgs.reading,    color: 'orange' }
    ];

    let html = '<div class="tag-zone-grid">';
    tagCards.forEach(c => {
        const count = tagCounts[c.tag] || 0;
        if (count === 0) return;
        html += `
          <a href="#" class="tag-zone-card" data-tag="${c.tag}" data-path="blog">
            <div class="tzc-img-wrap"><img src="${c.img}" alt="${c.tag}" loading="lazy"></div>
            <div class="tzc-body">
              <span class="tzc-tag sk-ann ${c.color}">${c.tag}</span>
              <span class="tzc-count">${count} 篇</span>
            </div>
          </a>`;
    });
    html += '</div>';
    anchorH2.insertAdjacentHTML('afterend', html);

    // 绑定点击：跳转到博客页并带 tag 参数
    anchorH2.parentElement.querySelectorAll('.tag-zone-card').forEach(card => {
        card.addEventListener('click', e => {
            e.preventDefault();
            const tag = card.getAttribute('data-tag');
            const url = new URL(window.location);
            url.searchParams.set('p', 'blog');
            url.searchParams.set('tag', tag);
            window.history.pushState({ path: 'blog', tag }, '', url);
            loadPage('blog');
        });
    });
}

/* ═══════════ 博客列表：标签云 + 时间线 ═══════════ */
async function renderBlogList(container) {
    try {
        const res = await fetch('./articles.json');
        let articles = await res.json();
        articles.sort((a, b) => new Date(b.created) - new Date(a.created));

        // 读取 URL tag 过滤参数
        const urlParams = new URLSearchParams(window.location.search);
        const filterTag = urlParams.get('tag');

        const tagCounts = {};
        articles.forEach(a => { (a.tags || []).forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }); });

        // 如果有标签过滤，先过滤文章
        let filtered = articles;
        if (filterTag) {
            filtered = articles.filter(a => (a.tags || []).includes(filterTag));
        }

        const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
        let tagHTML = '<div class="tag-cloud">';
        topTags.forEach(([tag, count]) => {
            const active = tag === filterTag ? ' active' : '';
            tagHTML += `<span class="tcloud-tag${active}" data-tag="${tag}">${tag} ×${count}</span>`;
        });
        tagHTML += '</div>';

        // 标签过滤提示栏
        let filterBar = '';
        if (filterTag) {
            filterBar = `<div class="tag-filter-bar">
                <span>当前筛选：<strong class="sk-ann red">${filterTag}</strong> · ${filtered.length} 篇</span>
                <a href="#" class="clear-filter" data-path="blog">清除筛选</a>
            </div>`;
        }

        const groups = filtered.reduce((acc, a) => {
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
        if (Object.keys(groups).length === 0) {
            listHTML += '<p style="text-align:center;color:var(--light-muted);margin:2rem 0;">这个主题下还没有文章 😅</p>';
        }
        container.innerHTML += filterBar + tagHTML + listHTML + '</div>';

        // 绑定标签云点击
        container.querySelectorAll('.tcloud-tag').forEach(tagEl => {
            tagEl.addEventListener('click', () => {
                const tag = tagEl.getAttribute('data-tag');
                const url = new URL(window.location);
                url.searchParams.set('p', 'blog');
                url.searchParams.set('tag', tag);
                window.history.pushState({ path: 'blog', tag }, '', url);
                loadPage('blog');
            });
        });

        // 绑定清除筛选
        const clearBtn = container.querySelector('.clear-filter');
        if (clearBtn) {
            clearBtn.addEventListener('click', e => {
                e.preventDefault();
                const url = new URL(window.location);
                url.searchParams.delete('tag');
                window.history.pushState({ path: 'blog' }, '', url);
                loadPage('blog');
            });
        }
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

/* ═══════════ 音乐页：网易云风格歌手展示 ═══════════ */
function renderMusicPage(container) {
    const imgs = I();

    // 歌手数据（avatar=圆形头像, banner=顶部横幅背景）
    const singers = [
        {
            name: '孙燕姿', en: 'Stefanie Sun', type: '华语女歌手',
            avatar: './assets/images/stefanie-real.webp',
            banner: './assets/images/stefanie-real.webp',
            tags: ['华语', '女歌手', '流行'],
            songs: ['天黑黑', '遇见', '绿光', '开始懂了', '逆光'],
            mood: '🎧 听燕姿的歌，像在经历一场温柔的暴雨',
            desc: '新加坡华语流行乐坛天后，独特的嗓音和充沛的情感表达让她成为一代人的青春记忆。'
        },
        {
            name: '林俊杰', en: 'JJ Lin', type: '华语男歌手',
            avatar: './assets/images/jj-real.webp',
            banner: './assets/images/jj-real.webp',
            tags: ['华语', '男歌手', '流行'],
            songs: ['江南', '修炼爱情', '她说', '可惜没如果', '不为谁而作的歌'],
            mood: '🎹 JJ的每一首歌都是一个小宇宙',
            desc: '新加坡华语流行音乐创作歌手，行走的CD，现场演唱实力天花板级别。'
        },
        {
            name: '赵雷', en: 'Zhao Lei', type: '民谣歌手',
            avatar: './assets/images/zhao-chengdu.jpg',
            banner: './assets/images/zhao-shuqian.jpg',
            tags: ['华语', '民谣', '创作'],
            songs: ['成都', '南方姑娘', '画', '理想', '鼓楼'],
            mood: '🎸 民谣就是生活本身的样子',
            desc: '中国民谣音乐人，用简单的吉他和真挚的歌词，唱出每个普通人心中关于远方和故乡的故事。'
        }
    ];

    // 查找注释占位符，替换为音乐内容
    const blockquote = container.querySelector('blockquote');
    if (blockquote && blockquote.nextElementSibling && blockquote.nextElementSibling.textContent.trim() === '') {
        const placeholder = blockquote.nextElementSibling;
        placeholder.remove();
    }

    // 生成音乐页 HTML
    let html = '';

    // 分类标签栏
    const categories = ['全部', '华语', '欧美', '民谣', '日本', '韩国'];
    html += '<div class="music-cat-bar">';
    categories.forEach((cat, i) => {
        const active = i === 0 ? ' active' : '';
        html += `<span class="mcat-tag${active}" data-mcat="${cat}">${cat}</span>`;
    });
    html += '</div>';

    // 歌手卡片网格
    html += '<div class="music-singer-grid">';
    singers.forEach((s, i) => {
        const songListHTML = s.songs.map(song =>
            `<div class="msong-item" data-song="${song}">
                <span class="material-icons msong-icon">play_circle_outline</span>
                <span class="msong-name">${song}</span>
            </div>`
        ).join('');

        const catStr = s.tags.join(' ');
        html += `
        <div class="music-singer-card" data-idx="${i}" data-cats="${catStr}">
            <div class="msc-banner">
                <img src="${s.banner}" alt="${s.name}" class="msc-banner-img" loading="lazy">
                <div class="msc-banner-overlay"></div>
                <div class="msc-banner-content">
                    <div class="msc-avatar-wrap">
                        <img src="${s.avatar}" alt="${s.name}" class="msc-avatar" loading="lazy">
                    </div>
                    <div class="msc-info">
                        <h3 class="msc-name">${s.name}</h3>
                        <p class="msc-en">${s.en}</p>
                        <div class="msc-tags">
                            ${s.tags.map(t => `<span class="msc-tag">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            <div class="msc-body">
                <div class="msc-mood">${s.mood}</div>
                <p class="msc-desc">${s.desc}</p>
                <div class="msc-songs">
                    <div class="msc-songs-title">
                        <span class="material-icons" style="font-size:14px;vertical-align:middle;margin-right:4px;">queue_music</span>
                        代表曲目
                    </div>
                    ${songListHTML}
                </div>
            </div>
        </div>`;
    });
    html += '</div>';

    // 底部小黑手绘风格装饰 + 音乐主题大背景
    html += `
    <div class="music-footer-note">
        <span class="sketch-note" style="color:var(--ared);">🎵 更多歌手，持续更新中...</span>
        <br><span style="font-size:0.72rem;color:var(--light-muted);">耳机一戴，世界与我无关。</span>
    </div>
    <div class="music-bg-footer">
        <img src="${imgs['music-bg'] || ''}" alt="音乐背景" loading="lazy">
    </div>`;

    container.innerHTML += html;

    // 空状态提示
    const grid = container.querySelector('.music-singer-grid');
    let emptyTip = null;

    // 绑定分类标签点击
    container.querySelectorAll('.mcat-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            container.querySelectorAll('.mcat-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const cat = tag.getAttribute('data-mcat');
            let visibleCount = 0;

            container.querySelectorAll('.music-singer-card').forEach(card => {
                const cats = card.getAttribute('data-cats') || '';
                const match = cat === '全部' || cats.includes(cat);

                if (match) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50 + visibleCount * 80);
                    visibleCount++;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => { card.style.display = 'none'; }, 200);
                }
            });

            // 空状态提示
            if (visibleCount === 0) {
                if (!emptyTip) {
                    emptyTip = document.createElement('p');
                    emptyTip.className = 'music-empty-tip';
                    emptyTip.innerHTML = '<span style="color:var(--light-muted);text-align:center;display:block;padding:3rem 0;font-family:Sketch,cursive;">这个分类下还没有歌手 😅<br><span style="font-size:0.75rem;">持续更新中...</span></span>';
                    grid.appendChild(emptyTip);
                }
                emptyTip.style.display = 'block';
            } else if (emptyTip) {
                emptyTip.style.display = 'none';
            }
        });
    });

    // 绑定歌曲点击效果
    container.querySelectorAll('.msong-item').forEach(item => {
        item.addEventListener('click', () => {
            const icon = item.querySelector('.msong-icon');
            const wasPlaying = icon.textContent === 'pause_circle_outline';
            // 重置所有
            container.querySelectorAll('.msong-icon').forEach(ic => {
                ic.textContent = 'play_circle_outline';
                ic.closest('.msong-item').classList.remove('playing');
            });
            if (!wasPlaying) {
                icon.textContent = 'pause_circle_outline';
                item.classList.add('playing');
            }
        });
    });
}

/* ═══════════ 主题管理 ═══════════ */
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
