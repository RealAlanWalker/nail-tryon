/* 小红书热门趋势款式注入 — 在 app.js 之后加载 */
(function () {

  /* ---- 热门款式数据（与 data/images/ 文件名严格对应） ---- */
  var TRENDING = [
    { file: "01_67966_氛围感很强的美甲分享～已做1个月🪞💅.jpg",   name: "🔥 氛围感美甲",    tags: ["氛围感", "热门"], palette: ["#e8b4cc", "#fff5f8", "#c07090"] },
    { file: "02_48219_我做了金冬天美甲就这样……🪺.jpg",            name: "🔥 金冬天",        tags: ["金色", "热门"],   palette: ["#d4a43a", "#fff8e6", "#8b6520"] },
    { file: "03_44344_能转印的猫眼总算是被我玩到了！.jpg",         name: "🔥 转印猫眼",      tags: ["猫眼", "热门"],   palette: ["#4a2d7c", "#f0ebff", "#1e0d3c"] },
    { file: "04_40355_吹爆家楼下美甲店.jpg",                      name: "🔥 精选多款",      tags: ["热门", "多款"],   palette: ["#d4916a", "#fff3ed", "#8b4c2a"] },
    { file: "05_29612_粉色系猫眼法式美甲🍧敲甜嘟.jpg",            name: "🔥 粉猫眼法式",    tags: ["粉色", "猫眼"],   palette: ["#f0a4b8", "#fff5f8", "#c05070"] },
    { file: "06_27704_今天是🎨(中指教程).jpg",                    name: "🔥 彩绘教程",      tags: ["彩绘", "创意"],   palette: ["#78a8e0", "#edf7ff", "#2d5f9c"] },
    { file: "07_25681_Breath 🫧.jpg",                             name: "🔥 Breath",        tags: ["清新", "夏日"],   palette: ["#8bc8e8", "#f0fbff", "#3a8ab0"] },
    { file: "08_24448_这个颜色真的好温柔～法式美甲💅.jpg",         name: "🔥 温柔法式",      tags: ["温柔", "法式"],   palette: ["#f0c0d0", "#fff8f9", "#c08090"] },
    { file: "09_24095_美甲｜简单又闪亮💎.jpg",                    name: "🔥 简单闪亮",      tags: ["闪亮", "简约"],   palette: ["#e8d8c0", "#fffdf5", "#b8945a"] },
    { file: "10_20536_淡淡的.jpg",                                name: "🔥 淡淡的",        tags: ["淡系", "通勤"],   palette: ["#e8d0c0", "#fff8f3", "#c09070"] },
    { file: "11_19446_把红苹果做成美甲🍎.jpg",                    name: "🔥 红苹果",        tags: ["红色", "创意"],   palette: ["#e83830", "#ffe8e8", "#901818"] },
    { file: "12_19101_醋酸甲是什么仙品 ！美腻了～.jpg",           name: "🔥 醋酸仙品",      tags: ["醋酸", "高级"],   palette: ["#9cc0d8", "#f0f9ff", "#4888b0"] },
    { file: "13_18976_我为猫眼举大旗.jpg",                        name: "🔥 猫眼大旗",      tags: ["猫眼", "个性"],   palette: ["#382840", "#f0e8f8", "#1a0d20"] },
    { file: "14_16645_邪修克罗心美甲✨好好看呀.jpg",              name: "🔥 克罗心暗黑",    tags: ["暗黑", "个性"],   palette: ["#302030", "#f8f0f8", "#180c18"] },
    { file: "15_13928_裸茶燕麦白法式✨.jpg",                      name: "🔥 裸茶燕麦法式",  tags: ["裸色", "法式"],   palette: ["#d8c0a8", "#fff8f2", "#a08060"] },
    { file: "16_12031_敲美的玻璃珠😍.jpg",                        name: "🔥 玻璃珠",        tags: ["闪亮", "清透"],   palette: ["#a8d8f0", "#f0faff", "#5098c0"] },
    { file: "17_9584_Nail share 💅.jpg",                          name: "🔥 Nail Share",    tags: ["百搭", "清新"],   palette: ["#e0c8b8", "#fffaf7", "#b89070"] },
    { file: "18_8428_猫眼碎钻法式 太嗲啦～🫧.jpg",               name: "🔥 猫眼碎钻法式",  tags: ["猫眼", "法式"],   palette: ["#603880", "#f5eeff", "#280848"] },
    { file: "19_7629_轻法式就是显白啊！✨.jpg",                   name: "🔥 轻法式显白",    tags: ["法式", "显白"],   palette: ["#f0e8dc", "#fffdf8", "#c8a888"] },
  ];

  var BASE_ID = 101;
  var IMG_BASE = "/trending/";

  /* ---- 把热门款式注入全局 styles 数组 ---- */
  TRENDING.forEach(function (item, i) {
    var url = IMG_BASE + encodeURIComponent(item.file);
    styles.push({
      id: BASE_ID + i,
      name: item.name,
      image: url,
      original: url,
      palette: item.palette,
      pattern: "photo",
      tags: item.tags,
      _trending: true,
    });
  });

  /* ---- Patch renderStyles：在热门款前插入分隔符 ---- */
  var _orig = window.renderStyles;
  window.renderStyles = function () {
    _orig.apply(this, arguments);
    var grid = document.getElementById("styleGrid");
    if (!grid) return;
    var firstTile = grid.querySelector('[data-style-id="' + BASE_ID + '"]');
    if (!firstTile) return;
    if (grid.querySelector(".trending-divider")) return; // 已插过
    var div = document.createElement("div");
    div.className = "trending-divider";
    div.setAttribute("aria-hidden", "true");
    div.innerHTML =
      '<span class="trending-divider-text">🔥<br>小<br>红<br>书<br>热<br>门</span>';
    grid.insertBefore(div, firstTile);
  };

})();
