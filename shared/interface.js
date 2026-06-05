/**
 * shared/interface.js — 用户侧 ↔ 运营侧 数据接口
 *
 * 加载顺序：在 app.js 之前加载，确保 app.js 能读取 MERCHANT_API
 * 并在运营侧脚本（merchant.js / trending-styles.js）加载后被填充。
 *
 * 数据流向：
 *   运营侧 → 用户侧：MERCHANT_API（款式推荐、热门注入）
 *   用户侧 → 运营侧：USER_HOOKS（试戴埋点、款式选择）
 */

/* ============================================================
   运营侧 → 用户侧
   由 merchant/merchant-data.js + merchant/trending-styles.js 填充
   ============================================================ */
window.MERCHANT_API = {

  /** 运营端推荐主推款式 ID 列表（与 app.js styles[] 的 id 对应） */
  recommendedStyleIds: [],

  /** 运营端注入的热门款式（trending-styles.js 会往 app.js styles[] push 并同步到这里） */
  trendingStyles: [],

  /**
   * 由 trending-styles.js 调用，把热门款注入用户侧样式网格
   * @param {Array} styles - trending style 对象数组
   */
  registerTrendingStyles: function (styles) {
    this.trendingStyles = styles;
    /* 触发用户侧更新（如果 renderStyles 已就绪） */
    if (typeof window.renderStyles === 'function') {
      window.renderStyles();
    }
  },

  /**
   * 由 merchant.js 调用，标记运营端主推款式（在样式网格加星）
   * @param {number[]} ids
   */
  setRecommendedStyles: function (ids) {
    this.recommendedStyleIds = ids || [];
    if (typeof window.renderStyles === 'function') {
      window.renderStyles();
    }
  },

  /** 读取当前推荐主推款 */
  getRecommended: function () {
    return window.MERCHANT_DATA?.catalog?.recommend || [];
  },
};


/* ============================================================
   用户侧 → 运营侧
   由 app.js 在关键节点调用，merchant.js 监听并更新看板
   ============================================================ */
window.USER_HOOKS = {

  /** 内部事件队列（运营侧加载前的事件暂存） */
  _queue: [],

  /** 注册监听器（merchant.js 在 init 时调用） */
  _listeners: {},

  on: function (event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
    /* 回放队列中已有的同类事件 */
    (this._queue.filter(function (e) { return e.type === event; }))
      .forEach(function (e) { fn(e.data); });
  },

  _emit: function (event, data) {
    this._queue.push({ type: event, data: data, ts: Date.now() });
    (this._listeners[event] || []).forEach(function (fn) { fn(data); });
  },

  /**
   * 用户选择了某个款式
   * app.js 在 selectStyle() 里调用
   * @param {{ id: number, name: string, tags: string[] }} style
   */
  onStyleSelected: function (style) {
    this._emit('styleSelected', style);
  },

  /**
   * 用户触发了 AI 试戴生成
   * app.js 在发起生成请求时调用
   * @param {{ styleId: number, styleName: string }} info
   */
  onGenerationStarted: function (info) {
    this._emit('generationStarted', info);
  },

  /**
   * AI 试戴生成完成
   * app.js 在拿到结果后调用
   * @param {{ styleId: number, styleName: string, durationMs: number, provider: string }} result
   */
  onGenerationCompleted: function (result) {
    this._emit('generationCompleted', result);
  },

  /**
   * 高保真服务连接状态变化
   * app.js 在探测服务时调用
   * @param {{ available: boolean, provider: string }} status
   */
  onServiceStatus: function (status) {
    this._emit('serviceStatus', status);
  },
};


/* ============================================================
   工具：让 app.js 方便地上报，不必判断接口是否已加载
   ============================================================ */
window.reportStyleSelected = function (style) {
  window.USER_HOOKS.onStyleSelected(style);
};
window.reportGenerationStarted = function (info) {
  window.USER_HOOKS.onGenerationStarted(info);
};
window.reportGenerationCompleted = function (result) {
  window.USER_HOOKS.onGenerationCompleted(result);
};
window.reportServiceStatus = function (status) {
  window.USER_HOOKS.onServiceStatus(status);
};
