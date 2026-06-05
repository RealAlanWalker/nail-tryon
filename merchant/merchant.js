(function () {
  'use strict';

  const COOKIE_KEY = 'merchant_xhs_cookie';

  /* -------------------- 工具 -------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('zh-CN'));
  const pct = (n) => (n == null ? '—' : (n > 0 ? '+' : '') + n + '%');

  /* -------------------- 状态 -------------------- */
  let currentSection = 'overview';

  /* -------------------- overlay 开关 -------------------- */
  function openOverlay() {
    $('#merchantOverlay').classList.add('is-open');
    document.body.style.overflow = 'hidden';
    showDash();
  }

  function closeOverlay() {
    $('#merchantOverlay').classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showLogin() {
    $('#mLoginScreen').classList.remove('m-hidden');
    $('#mDashScreen').classList.add('m-hidden');
    const saved = localStorage.getItem(COOKIE_KEY);
    if (saved) $('#mCookieInput').value = saved;
  }

  function showDash() {
    $('#mLoginScreen').classList.add('m-hidden');
    $('#mDashScreen').classList.remove('m-hidden');
    renderAll();
  }

  /* -------------------- Cookie 验证 -------------------- */
  function handleSubmit() {
    const val = $('#mCookieInput').value.trim();
    const btn = $('#mSubmitBtn');
    const err = $('#mErrorMsg');
    err.textContent = '';

    if (!val) {
      err.textContent = '请先粘贴你的小红书 Cookie';
      return;
    }
    if (!val.includes('=')) {
      err.textContent = 'Cookie 格式似乎有误，请完整复制浏览器中的 Cookie 字段';
      return;
    }

    btn.disabled = true;
    btn.textContent = '验证中…';

    // 模拟验证延迟（静态站点无后端，直接保存后进入）
    setTimeout(() => {
      localStorage.setItem(COOKIE_KEY, val);
      btn.disabled = false;
      btn.textContent = '保存并进入';
      showDash();
    }, 800);
  }

  /* -------------------- 导航切换 -------------------- */
  function initNav() {
    $$('.m-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const sec = item.dataset.section;
        currentSection = sec;
        $$('.m-nav-item').forEach(n => n.classList.toggle('active', n === item));
        $$('.m-view').forEach(v => v.classList.toggle('m-hidden', v.dataset.view !== sec));
      });
    });
  }

  /* -------------------- 数据 -------------------- */
  function getData() {
    return window.MERCHANT_DATA || {};
  }

  /* -------------------- KPI -------------------- */
  function renderKPI() {
    const k = getData().kpi || {};
    const cards = [
      { label: '笔记总数', val: k.total_notes, sub: '采集样本' },
      { label: '评论样本', val: k.total_comments, sub: '需求挖掘' },
      { label: '平均热度', val: k.avg_hotness, sub: '加权互动' },
      { label: '上升趋势', val: k.rising_count, sub: '环比增长项' },
      { label: '需求信号', val: k.demand_signals, sub: '用户呼声' },
    ];
    $('#mKpiRow').innerHTML = cards.map(c => `
      <div class="m-kpi-card">
        <div class="m-kpi-label">${esc(c.label)}</div>
        <div class="m-kpi-val">${fmt(c.val)}</div>
        <div class="m-kpi-sub">${esc(c.sub)}</div>
      </div>`).join('');
  }

  /* -------------------- 飙升榜 -------------------- */
  function riseRows(rows) {
    return rows.map(r => {
      const st = r.status === '新出现' ? 'new' : r.growth_pct >= 0 ? 'up' : 'down';
      const stLabel = r.status || (r.growth_pct >= 0 ? '上升' : '下降');
      return `<tr>
        <td><span class="m-tag">${esc(r.type)}</span></td>
        <td class="m-cell-name">${esc(r.name)}</td>
        <td class="m-num">${fmt(r.curr_hotness)}</td>
        <td class="m-num ${r.growth_pct != null && r.growth_pct >= 0 ? 'm-up' : 'm-down'}">${pct(r.growth_pct)}</td>
        <td><span class="m-pill ${st}">${esc(stLabel)}</span></td>
      </tr>`;
    }).join('');
  }

  function renderRising() {
    const rising = getData().rising || [];
    const head = `<thead><tr><th>类型</th><th>名称</th><th>当前热度</th><th>环比</th><th>状态</th></tr></thead>`;
    const preview = rising.length
      ? `<div class="m-table-wrap"><table class="m-data-table">${head}<tbody>${riseRows(rising.slice(0, 6))}</tbody></table></div>`
      : '<p class="m-muted">暂无飙升数据（需至少两次快照）</p>';
    const full = rising.length
      ? `<div class="m-table-wrap"><table class="m-data-table">${head}<tbody>${riseRows(rising)}</tbody></table></div>`
      : '<p class="m-muted">暂无飙升数据</p>';
    $('#mRisePreview').innerHTML = preview;
    $('#mRiseTable').innerHTML = full;
  }

  /* -------------------- VL 维度小图 -------------------- */
  function renderVL() {
    const vl = getData().vl || {};
    const defs = [['甲型','shape'],['工艺','craft'],['主题','theme'],['主色调','color']];
    $('#mVlMini').innerHTML = defs.map(([title, key]) => {
      const rows = (vl[key] || []).slice(0, 5);
      const max = Math.max(1, ...rows.map(r => r[1]));
      const bars = rows.length
        ? rows.map(r => `<div class="m-bar-row">
            <div class="m-bar-label">${esc(r[0])}</div>
            <div class="m-bar-track"><div class="m-bar-fill" style="width:${(r[1]/max*100).toFixed(1)}%"></div></div>
            <div class="m-bar-val">${r[1]}</div>
          </div>`).join('')
        : '<p class="m-muted">无 VL 数据</p>';
      return `<div class="m-panel"><div class="m-panel-head"><h3>${esc(title)}</h3></div><div class="m-panel-body">${bars}</div></div>`;
    }).join('');
  }

  /* -------------------- AI 策略 -------------------- */
  function renderStrategy() {
    const s = getData().strategy || {};
    const preview = [];
    if (s.trend_reading) preview.push(`<div class="m-strat-block"><h4>趋势解读</h4><p>${esc(s.trend_reading)}</p></div>`);
    if (s.push_list?.length) {
      preview.push(`<div class="m-strat-block"><h4>主推 TOP</h4>` +
        s.push_list.slice(0, 2).map(p => `<div class="m-push-item"><div class="m-push-name">${esc(p.name)}</div></div>`).join('') + `</div>`);
    }
    $('#mStratPreview').innerHTML = preview.join('') || '<p class="m-muted">暂无策略（带 AI 跑管线后生成）</p>';

    const full = [];
    if (s.trend_reading) full.push(`<div class="m-panel"><div class="m-panel-head"><h3>📈 趋势解读</h3></div><div class="m-panel-body"><p style="font-size:13px;line-height:1.65;color:var(--m-tx)">${esc(s.trend_reading)}</p></div></div>`);
    if (s.push_list?.length) {
      full.push(`<div class="m-panel"><div class="m-panel-head"><h3>⭐ 主推榜单</h3></div><div class="m-panel-body">` +
        s.push_list.map(p => `<div class="m-push-item"><div class="m-push-name">${esc(p.name)}</div><div class="m-push-reason">${esc(p.reason || '')}</div></div>`).join('') +
        `</div></div>`);
    }
    if (s.restock_warnings?.length) {
      full.push(`<div class="m-panel" style="margin-bottom:14px"><div class="m-panel-head"><h3>🛒 补货 / 选品预警</h3></div><div class="m-panel-body"><div class="m-warn-list">` +
        s.restock_warnings.map(w => `<div class="m-warn-item">${esc(w)}</div>`).join('') + `</div></div></div>`);
    }
    if (s.copywriting?.length) {
      full.push(`<div class="m-panel" style="margin-bottom:14px"><div class="m-panel-head"><h3>✍️ 营销文案</h3></div><div class="m-panel-body"><div class="m-copy-grid">` +
        s.copywriting.map(c => `<div class="m-copy-card"><div class="m-copy-style">${esc(c.style)}</div><p>${esc(c.text)}</p><button class="m-copy-btn" data-text="${esc(c.text)}">复制</button></div>`).join('') +
        `</div></div></div>`);
    }
    if (s.risk) full.push(`<div class="m-panel"><div class="m-panel-head"><h3>⚠️ 风险提示</h3></div><div class="m-panel-body"><div class="m-risk-item">${esc(s.risk)}</div></div></div>`);
    $('#mStrategyFull').innerHTML = full.join('') || '<p class="m-muted">暂无策略（带 AI 跑管线后生成）</p>';
  }

  /* -------------------- 款式库 -------------------- */
  function renderCatalog() {
    const cat = getData().catalog || {};
    const rec = cat.recommend || [];
    const gaps = cat.gaps || [];
    const slow = cat.slow_movers || [];

    const recHTML = `<div class="m-panel rec-panel">
      <div class="m-panel-head"><h3>⭐ 建议主推</h3><span class="m-count-badge">${rec.length}</span></div>
      <div class="m-panel-body">${rec.length ? rec.map(r => `<div class="m-cat-item">
        <div class="m-cat-name">${esc(r.name)}</div>
        <div class="m-cat-meta">转化 ${((r.conversion||0)*100).toFixed(1)}% · 试戴 ${fmt(r.try_on)}</div>
        <div class="m-cat-reason">${esc(r.reason)}</div>
      </div>`).join('') : '<p class="m-muted">暂无</p>'}</div></div>`;

    const gapHTML = `<div class="m-panel gap-panel">
      <div class="m-panel-head"><h3>🛒 选品缺口</h3><span class="m-count-badge">${gaps.length}</span></div>
      <div class="m-panel-body">${gaps.length ? gaps.map(g => `<div class="m-gap-item">
        <div class="m-cat-name">${esc(g.name)} <span class="m-tag">${esc(g.type)}</span></div>
        <div class="m-cat-reason">${esc(g.suggest)}</div>
      </div>`).join('') : '<p class="m-muted">暂无</p>'}</div></div>`;

    const slowHTML = `<div class="m-panel slow-panel">
      <div class="m-panel-head"><h3>⚠️ 滞销预警</h3><span class="m-count-badge">${slow.length}</span></div>
      <div class="m-panel-body">${slow.length ? slow.map(s => `<div class="m-cat-item">
        <div class="m-cat-name">${esc(s.name)}</div>
        <div class="m-cat-meta">转化 ${((s.conversion||0)*100).toFixed(1)}% · 试戴 ${fmt(s.try_on)}</div>
        <div class="m-cat-reason">${esc(s.reason)}</div>
      </div>`).join('') : '<p class="m-muted">暂无</p>'}</div></div>`;

    $('#mCatalogGrid').innerHTML = recHTML + gapHTML + slowHTML;
  }

  /* -------------------- 用户需求 -------------------- */
  function renderDemand() {
    const d = getData().demand || {};
    const signals = d.signals || {};
    const max = Math.max(...Object.values(signals), 1);
    $('#mDemandSignals').innerHTML = Object.keys(signals).length
      ? Object.entries(signals).map(([k, v]) => `<div class="m-bar-row">
          <div class="m-bar-label" style="width:90px">${esc(k)}</div>
          <div class="m-bar-track"><div class="m-bar-fill" style="width:${(v/max*100).toFixed(1)}%"></div></div>
          <div class="m-bar-val">${v}</div>
        </div>`).join('')
      : '<p class="m-muted">暂无需求信号</p>';

    $('#mVoiceList').innerHTML = (d.voices || []).length
      ? d.voices.map(v => `<div class="m-voice-item">
          <p class="m-voice-text">${esc(v.content)}</p>
          <div class="m-voice-meta">👍 ${fmt(v.like_count)} · ${(v.tags||[]).map(t => `<span class="m-mini-tag">${esc(t)}</span>`).join(' ')}</div>
        </div>`).join('')
      : '<p class="m-muted">暂无高赞评论</p>';

    $('#mWantedList').innerHTML = (d.wanted || []).length
      ? d.wanted.map(w => `<div class="m-wanted-chip ${w.in_catalog ? 'has' : 'miss'}">
          <span class="m-w-name">${esc(w.name)}</span>
          <span class="m-w-type">${esc(w.type)}</span>
          <span class="m-w-cnt">${w.mentions}次</span>
          <span class="m-w-flag">${w.in_catalog ? '库内有' : '缺'}</span>
        </div>`).join('')
      : '<p class="m-muted">未识别到明显属性诉求</p>';
  }

  /* -------------------- 笔记明细 -------------------- */
  function renderNotes() {
    const notes = getData().notes || [];
    const head = `<thead><tr><th>标题</th><th>作者</th><th>工艺</th><th>主题</th><th>点赞</th><th>评论</th><th>热度</th><th>来源词</th></tr></thead>`;
    const rowsHTML = (list) => list.map(n => `<tr>
      <td class="m-cell-title">${n.note_url ? `<a href="${esc(n.note_url)}" target="_blank" rel="noreferrer">${esc(n.title)}</a>` : esc(n.title)}</td>
      <td>${esc(n.author)}</td>
      <td>${esc(n.craft)}</td>
      <td>${esc(n.theme)}</td>
      <td class="m-num">${fmt(n.likes)}</td>
      <td class="m-num">${fmt(n.comments)}</td>
      <td class="m-num">${fmt(n.hotness)}</td>
      <td><span class="m-src-tag">${esc(n.keyword)}</span></td>
    </tr>`).join('');

    $('#mNotesTable').innerHTML = `${head}<tbody>${rowsHTML(notes)}</tbody>`;
    $('#mNoteSearch').addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      const filtered = notes.filter(n => [n.title, n.author, n.craft, n.theme].join(' ').toLowerCase().includes(q));
      $('#mNotesTable').querySelector('tbody').innerHTML = rowsHTML(filtered);
    });
  }

  /* -------------------- 全部渲染 -------------------- */
  function renderAll() {
    const D = getData();
    $('#mUpdDate').textContent = D.generated_at || '—';
    renderKPI();
    renderRising();
    renderVL();
    renderStrategy();
    renderCatalog();
    renderDemand();
    renderNotes();
    renderStyleAdjust();
  }

  /* -------------------- 运营日报 -------------------- */
  const REPORT_API = 'http://127.0.0.1:4174/api/daily-report';
  const FEISHU_API = 'http://127.0.0.1:4174/api/feishu-send';
  let lastReport = null;

  function renderReport(report) {
    lastReport = report;
    const el = $('#mReportBody');
    if (!el) return;
    $('#mReportDate').textContent = report.date || '—';
    $('#mSendFeishuBtn').classList.remove('m-hidden');

    const kpi = report.kpi || {};
    const cold = (report.cold_warning || []);

    el.innerHTML = `
      <div style="background:rgba(181,139,250,.07);border:1px solid rgba(181,139,250,.2);border-radius:10px;padding:14px 16px;margin-bottom:14px;font-size:13px;line-height:1.75;color:var(--m-tx);white-space:pre-wrap">${esc(report.ai_summary || '暂无 AI 摘要')}</div>
      <div class="m-kpi-row" style="margin-bottom:14px">
        <div class="m-kpi-card"><div class="m-kpi-label">笔记总数</div><div class="m-kpi-val">${fmt(kpi.total_notes)}</div></div>
        <div class="m-kpi-card"><div class="m-kpi-label">评论样本</div><div class="m-kpi-val">${fmt(kpi.total_comments)}</div></div>
        <div class="m-kpi-card"><div class="m-kpi-label">平均热度</div><div class="m-kpi-val">${fmt(kpi.avg_hotness)}</div></div>
        <div class="m-kpi-card"><div class="m-kpi-label">上升趋势</div><div class="m-kpi-val">${fmt(kpi.rising_count)}</div></div>
        <div class="m-kpi-card"><div class="m-kpi-label">需求信号</div><div class="m-kpi-val">${fmt(kpi.demand_signals)}</div></div>
      </div>
      <div class="m-grid-2">
        <div class="m-panel">
          <div class="m-panel-head"><h3>🔥 热门TOP榜</h3></div>
          <div class="m-panel-body">
            ${(report.top_rising||[]).map((r,i)=>`
              <div class="m-bar-row">
                <div class="m-bar-label" style="width:70px;font-size:11px">${esc(r.name)}</div>
                <div class="m-bar-track"><div class="m-bar-fill" style="width:${Math.max(10,(r.curr_hotness||0)/Math.max(1,...(report.top_rising||[]).map(x=>x.curr_hotness||0))*100).toFixed(0)}%"></div></div>
                <div class="m-bar-val">${fmt(r.curr_hotness)}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="m-panel">
          <div class="m-panel-head"><h3>💡 运营建议</h3></div>
          <div class="m-panel-body">
            ${(report.recommend||[]).map(r=>`<div class="m-push-item"><div class="m-push-name">${esc(r.name)}</div><div class="m-push-reason">${esc(r.reason||'')}</div></div>`).join('')||'<p class="m-muted">暂无</p>'}
            ${(report.gaps||[]).map(g=>`<div class="m-gap-item"><div class="m-cat-name">${esc(g.name)}<span class="m-tag" style="margin-left:6px">${esc(g.type)}</span></div><div class="m-cat-reason">${esc(g.suggest)}</div></div>`).join('')}
          </div>
        </div>
      </div>
      ${cold.length ? `<div class="m-panel" style="margin-top:12px;border-color:rgba(255,92,122,.2)"><div class="m-panel-head"><h3>🧊 冷门预警</h3><span class="m-panel-tag">热度低于均值50%</span></div><div class="m-panel-body">${cold.map(c=>`<div class="m-risk-item">${esc(c.name)} — 当前热度 ${fmt(c.curr_hotness)}，趋势 ${pct(c.growth_pct)}</div>`).join('')}</div></div>` : ''}`;
  }

  function initReportPanel() {
    $('#mGenReportBtn')?.addEventListener('click', async () => {
      const btn = $('#mGenReportBtn');
      btn.textContent = '生成中…';
      btn.disabled = true;
      try {
        const res = await fetch(REPORT_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const report = await res.json();
        renderReport(report);
      } catch (e) {
        $('#mReportBody').innerHTML = `<p class="m-muted" style="color:var(--m-down)">⚠️ 日报服务未启动，请先运行：<br><code>cd nail-tryon && python -m merchant_service.daily_report</code></p>`;
      } finally {
        btn.textContent = '✨ 生成今日日报';
        btn.disabled = false;
      }
    });

    $('#mSendFeishuBtn')?.addEventListener('click', async () => {
      if (!lastReport) return;
      const chatId = prompt('请输入飞书群 Chat ID（群→群设置→群 ID）：');
      if (!chatId) return;
      const text = `📋 美甲运营日报 ${lastReport.date}\n\n${lastReport.ai_summary}\n\n🔥 热门TOP3：${(lastReport.top_rising||[]).slice(0,3).map(r=>r.name).join('、')}\n✅ 主推：${(lastReport.recommend||[]).slice(0,2).map(r=>r.name).join('、')}`;
      try {
        const res = await fetch(FEISHU_API, {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ chat_id: chatId, text }),
        });
        const d = await res.json();
        alert(res.ok ? '✅ 已发送到飞书！' : `❌ 发送失败：${d.error}`);
      } catch (e) {
        alert('❌ 日报服务未响应，请检查是否已启动');
      }
    });
  }

  /* -------------------- 智能调整执行 -------------------- */
  function renderStyleAdjust() {
    const D = getData();
    const rec = D.catalog?.recommend || [];
    const slow = D.catalog?.slow_movers || [];

    const grid = $('#mStyleAdjustGrid');
    if (grid) {
      grid.innerHTML = rec.length
        ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:8px">` +
          rec.map(r => `
            <div style="background:var(--m-card);border:1px solid rgba(61,220,151,.25);border-radius:10px;padding:10px 12px">
              <div style="font-size:13px;font-weight:700;color:var(--m-tx);margin-bottom:4px">⭐ ${esc(r.name)}</div>
              <div style="font-size:11px;color:var(--m-tx-faint)">转化 ${((r.conversion||0)*100).toFixed(1)}% · 试戴 ${fmt(r.try_on)}</div>
            </div>`).join('') + `</div>`
        : '<p class="m-muted">暂无推荐款式数据</p>';
    }

    const coldEl = $('#mColdWarningList');
    if (coldEl) {
      coldEl.innerHTML = slow.length
        ? slow.map(s => `<div class="m-risk-item" style="margin-bottom:7px">
            <strong>${esc(s.name)}</strong> — 转化 ${((s.conversion||0)*100).toFixed(1)}%，试戴 ${fmt(s.try_on)}次<br>
            <span style="font-size:11.5px;opacity:.85">${esc(s.reason)}</span>
          </div>`).join('')
        : '<p class="m-muted">暂无冷门款式</p>';
    }
  }

  function initStyleAdjust() {
    $('#mPushRecommendBtn')?.addEventListener('click', () => {
      const D = getData();
      const recIds = (D.catalog?.recommend || []).map(r => r._styleId).filter(Boolean);
      if (window.MERCHANT_API) {
        window.MERCHANT_API.setRecommendedStyles(recIds);
      }
      const btn = $('#mPushRecommendBtn');
      btn.textContent = '✅ 已推送';
      setTimeout(() => { btn.textContent = '🚀 推送主推款到用户侧'; }, 2000);
    });
  }

  /* -------------------- 复制文案 -------------------- */
  function initCopyBtns() {
    document.addEventListener('click', e => {
      if (e.target.classList.contains('m-copy-btn')) {
        navigator.clipboard?.writeText(e.target.dataset.text || '');
        e.target.textContent = '已复制';
        setTimeout(() => e.target.textContent = '复制', 1500);
      }
    });
  }

  /* -------------------- 试戴埋点（接收用户侧事件） -------------------- */
  const tryonLog = [];

  function initUserHooks() {
    if (!window.USER_HOOKS) return;
    const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString('zh-CN'));
    const esc2 = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    function refresh() {
      const el = $('#mTryonStats');
      if (!el) return;
      if (!tryonLog.length) {
        el.innerHTML = '<p class="m-muted">等待用户侧数据…（用户选择款式或完成生成后自动更新）</p>';
        return;
      }
      const counts = {};
      tryonLog.forEach(e => {
        if (e.type === 'generationCompleted') {
          counts[e.name] = (counts[e.name] || 0) + 1;
        }
      });
      const selects = tryonLog.filter(e => e.type === 'styleSelected');
      const gens = tryonLog.filter(e => e.type === 'generationCompleted');
      el.innerHTML = `
        <div class="m-kpi-row" style="margin-bottom:14px">
          <div class="m-kpi-card"><div class="m-kpi-label">款式选择</div><div class="m-kpi-val">${selects.length}</div><div class="m-kpi-sub">本次会话</div></div>
          <div class="m-kpi-card"><div class="m-kpi-label">生成完成</div><div class="m-kpi-val">${gens.length}</div><div class="m-kpi-sub">高保真试戴</div></div>
        </div>
        <div class="m-panel"><div class="m-panel-head"><h3>🎯 款式生成次数</h3></div><div class="m-panel-body">
          ${Object.keys(counts).length
            ? Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`
                <div class="m-bar-row">
                  <div class="m-bar-label" style="width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc2(k)}</div>
                  <div class="m-bar-track"><div class="m-bar-fill" style="width:${(v/Math.max(...Object.values(counts))*100).toFixed(0)}%"></div></div>
                  <div class="m-bar-val">${v}</div>
                </div>`).join('')
            : '<p class="m-muted">暂无生成记录</p>'}
        </div></div>
        <div class="m-panel" style="margin-top:12px"><div class="m-panel-head"><h3>📋 最近事件</h3></div><div class="m-panel-body">
          <table class="m-data-table"><thead><tr><th>时间</th><th>事件</th><th>款式</th></tr></thead><tbody>
          ${tryonLog.slice(-20).reverse().map(e=>`<tr>
            <td>${new Date(e.ts).toLocaleTimeString('zh-CN')}</td>
            <td>${esc2(e.type === 'styleSelected' ? '选择款式' : e.type === 'generationStarted' ? '开始生成' : '生成完成')}</td>
            <td>${esc2(e.name || '—')}</td>
          </tr>`).join('')}
          </tbody></table>
        </div></div>`;
    }

    USER_HOOKS.on('styleSelected', d => {
      tryonLog.push({ type: 'styleSelected', name: d.name, ts: Date.now() });
      refresh();
    });
    USER_HOOKS.on('generationStarted', d => {
      tryonLog.push({ type: 'generationStarted', name: d.styleName, ts: Date.now() });
      refresh();
    });
    USER_HOOKS.on('generationCompleted', d => {
      tryonLog.push({ type: 'generationCompleted', name: d.styleName, ts: Date.now() });
      refresh();
    });
  }

  /* -------------------- 初始化 -------------------- */
  function init() {
    // 顶栏按钮
    $('#merchantBtn').addEventListener('click', openOverlay);

    // 关闭按钮
    $('#mCloseBtn').addEventListener('click', closeOverlay);

    // ESC 关闭
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && $('#merchantOverlay').classList.contains('is-open')) {
        closeOverlay();
      }
    });

    // Cookie 提交
    $('#mSubmitBtn').addEventListener('click', handleSubmit);
    $('#mCookieInput').addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'Enter') handleSubmit();
    });

    // 更新 Cookie 按钮
    $('#mCookieEditBtn').addEventListener('click', showLogin);

    // 导航
    initNav();

    // 复制按钮
    initCopyBtns();

    // 接收用户侧试戴埋点
    initUserHooks();

    // 运营日报
    initReportPanel();

    // 智能调整（数据就绪后渲染）
    initStyleAdjust();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
