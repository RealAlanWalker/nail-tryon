const styles = [
  {
    id: 1,
    name: "01 玫瑰晶透",
    image: "http://p0.meituan.net/pilotimages/87797733466cfd525625a5947767e2ff1794125.png",
    original: "http://p0.meituan.net/pilotimages/8491d190aeb8f44e32f6b278535bf2b41075477.png",
    palette: ["#f5aac0", "#fff2f8", "#b84b6b"],
    pattern: "glitter",
    tags: ["显白", "甜酷"],
  },
  {
    id: 2,
    name: "02 奶油贝母",
    image: "http://p0.meituan.net/pilotimages/162afb52255bd908ba3ec418fd61824a2254875.png",
    original: "http://p1.meituan.net/pilotimages/493fc5818746fe45d9be82763034edbe1246574.png",
    palette: ["#f4d9cb", "#fffaf4", "#c78f70"],
    pattern: "marble",
    tags: ["温柔", "通勤"],
  },
  {
    id: 3,
    name: "03 紫雾星河",
    image: "http://p1.meituan.net/pilotimages/7bb5bc0c2c741f9f0aa63787a601d7ad2604877.png",
    original: "http://p0.meituan.net/pilotimages/667658abb96c7547791d48360a8e95b61155924.png",
    palette: ["#8d77dc", "#f8f5ff", "#423571"],
    pattern: "cat",
    tags: ["猫眼", "约会"],
  },
  {
    id: 4,
    name: "04 蜜桃法式",
    image: "http://p0.meituan.net/pilotimages/fc8fe60e78341d77a5070fc2f8e520072098070.png",
    original: "http://p1.meituan.net/pilotimages/f8539918c55c5c1e4a45ee3996df65f7167977.jpg",
    palette: ["#f0a58f", "#fff8ee", "#d64d42"],
    pattern: "french",
    tags: ["法式", "显气色"],
  },
  {
    id: 5,
    name: "05 果冻红茶",
    image: "http://p1.meituan.net/pilotimages/3c0d090e20f0cb56f70fcb56c54dd6582416974.png",
    original: "http://p1.meituan.net/pilotimages/1d448b059cddcc2f0705a4a4fe554e06261514.jpg",
    palette: ["#b94b42", "#ffe4d4", "#5e1b1f"],
    pattern: "chrome",
    tags: ["复古", "显白"],
  },
  {
    id: 6,
    name: "06 珍珠裸粉",
    image: "http://p0.meituan.net/pilotimages/6c857edd85a5fa4bcec59698fe9416cb1913981.png",
    original: "http://p0.meituan.net/pilotimages/a99d2de6bf0ade20211c0ae46af8e44b1057335.png",
    palette: ["#e9bdad", "#fff9f6", "#c68d7c"],
    pattern: "pearl",
    tags: ["裸粉", "高级"],
  },
  {
    id: 7,
    name: "07 海盐蓝调",
    image: "http://p0.meituan.net/pilotimages/2ac2d01a9bc78320edbe2b545b485b4a2132292.png",
    original: "http://p0.meituan.net/pilotimages/6dedbe1cfe7de834cd8faa4e19179fee1123627.png",
    palette: ["#5aa8c9", "#eaf9ff", "#225a73"],
    pattern: "cat",
    tags: ["清爽", "夏日"],
  },
  {
    id: 8,
    name: "08 樱花闪钻",
    image: "http://p1.meituan.net/pilotimages/d15c06e8c2137d4f39f3b60476a90cf92026957.png",
    original: "http://p0.meituan.net/pilotimages/7b22fa4e6e1ee4e59a1115a27b125fe0996286.png",
    palette: ["#f39ab6", "#fff4fa", "#eecc69"],
    pattern: "glitter",
    tags: ["闪钻", "拍照"],
  },
  {
    id: 9,
    name: "09 冰葡萄",
    image: "http://p1.meituan.net/pilotimages/69614397f0ecb559b98cb46a5a46f3b32642714.png",
    original: "http://p0.meituan.net/pilotimages/6b20ca923ac4461aeaab7bf136bfda3c1063942.png",
    palette: ["#7252a2", "#f5efff", "#271c3f"],
    pattern: "aurora",
    tags: ["冷感", "个性"],
  },
  {
    id: 10,
    name: "10 焦糖金箔",
    image: "http://p1.meituan.net/pilotimages/2277d6f9d82264fa6a3c986373e5e44c2292083.png",
    original: "http://p0.meituan.net/pilotimages/a5894d122ca3bd7e1f12401a8c72351e1460094.png",
    palette: ["#b96d35", "#fff1d8", "#d7a03e"],
    pattern: "foil",
    tags: ["金箔", "秋冬"],
  },
  {
    id: 11,
    name: "11 黑糖猫眼",
    image: "http://p0.meituan.net/pilotimages/bc153edf655dd6961dc9f8e95ad8cd1e2561531.png",
    original: "http://p0.meituan.net/pilotimages/b6491d47c001ca175fa04e5243f84aa5896438.png",
    palette: ["#332326", "#d9a76f", "#0f0b0c"],
    pattern: "cat",
    tags: ["酷感", "夜色"],
  },
  {
    id: 12,
    name: "12 山茶白",
    image: "http://p0.meituan.net/pilotimages/43cc4ced977a3dd271f60ee2f05607772681747.png",
    original: "http://p1.meituan.net/pilotimages/d571f8a5702261542c115c247d210bfd1180529.png",
    palette: ["#f7eee2", "#ffffff", "#cba75b"],
    pattern: "floral",
    tags: ["新娘", "干净"],
  },
  {
    id: 13,
    name: "13 甜莓渐变",
    image: "http://p0.meituan.net/pilotimages/682c173ae3a95d0b838655e8337b30d72213857.png",
    original: "http://p0.meituan.net/pilotimages/5fa531643ac8f829d8ab574b4c11e0081087649.png",
    palette: ["#e5567d", "#ffdbe7", "#8c1f44"],
    pattern: "ombre",
    tags: ["渐变", "甜美"],
  },
  {
    id: 14,
    name: "14 松石银线",
    image: "http://p1.meituan.net/pilotimages/eecfba4ab276e895b579a79491b2d0211982788.png",
    original: "http://p0.meituan.net/pilotimages/b99490b3f4a5e088ffe36c6ae60211941005960.png",
    palette: ["#2f9b93", "#e8fffb", "#a9c9c5"],
    pattern: "chrome",
    tags: ["清冷", "银线"],
  },
  {
    id: 15,
    name: "15 石榴红",
    image: "http://p0.meituan.net/pilotimages/1248ad42d355b98257e5fbcdf90efc552138079.png",
    original: "http://p0.meituan.net/pilotimages/5c66d21b6fc2b78c59f3f2e36fc788451052442.png",
    palette: ["#c92534", "#ffd2d5", "#5c0d14"],
    pattern: "gloss",
    tags: ["正红", "气场"],
  },
  {
    id: 16,
    name: "16 雾蓝贝壳",
    image: "http://p0.meituan.net/pilotimages/137aad1f6a36655ae395cf7dc57604642782680.png",
    original: "http://p0.meituan.net/pilotimages/81a8b3a96d3dd6ba1c849cc666bf85f51089012.png",
    palette: ["#789fc1", "#f0fbff", "#385a7c"],
    pattern: "pearl",
    tags: ["贝壳", "清透"],
  },
  {
    id: 17,
    name: "17 烟粉金属",
    image: "http://p0.meituan.net/pilotimages/ec437f6291295904c2f894edb8c01cb82131722.png",
    original: "http://p0.meituan.net/pilotimages/ff68ba22d655fd1e0a812f197e406d951137747.png",
    palette: ["#c88691", "#ffeef0", "#7d4e61"],
    pattern: "chrome",
    tags: ["金属", "质感"],
  },
  {
    id: 18,
    name: "18 橄榄花园",
    image: "http://p0.meituan.net/pilotimages/5591229138c4e7e1d183b59be442d9dc2267735.png",
    original: "http://p1.meituan.net/pilotimages/29c85d420f45062d29890f4ae014b82f960529.png",
    palette: ["#718257", "#fbffe7", "#384426"],
    pattern: "floral",
    tags: ["自然", "复古"],
  },
  {
    id: 19,
    name: "19 香槟闪片",
    image: "http://p0.meituan.net/pilotimages/5fad21e6d38656170bf726ff3973a4501918338.png",
    original: "http://p0.meituan.net/pilotimages/b6a8da8cb0d46f30ec2c65b79c3710e91040053.png",
    palette: ["#d9b46c", "#fff5db", "#8b6228"],
    pattern: "glitter",
    tags: ["闪片", "聚会"],
  },
  {
    id: 20,
    name: "20 奶茶棋盘",
    image: "http://p1.meituan.net/pilotimages/d5eedc75b0021f79381962fc145b0bc62301165.png",
    original: "http://p0.meituan.net/pilotimages/7f3d1832f40e03685a0e413e6196efcd1139460.png",
    palette: ["#b68b6c", "#fff1e4", "#5f4435"],
    pattern: "check",
    tags: ["奶茶", "俏皮"],
  },
  {
    id: 21,
    name: "21 湖水玻璃",
    image: "http://p0.meituan.net/pilotimages/f4b69d45af5d3b496adbd9d21e768a8e2195181.png",
    original: "http://p0.meituan.net/pilotimages/fe1824a01b10a0fee24a8aaa5b1ef1991009918.png",
    palette: ["#39a9a0", "#e8fffb", "#115d61"],
    pattern: "aurora",
    tags: ["玻璃", "清凉"],
  },
  {
    id: 22,
    name: "22 摩卡法式",
    image: "http://p0.meituan.net/pilotimages/5b985a1c661ae2e964286178e6c0b0f92258113.png",
    original: "http://p0.meituan.net/pilotimages/1e86c987caf89d5b15a226ad097e270b963164.png",
    palette: ["#8b5941", "#fbe4d1", "#4b2b22"],
    pattern: "french",
    tags: ["法式", "显手长"],
  },
  {
    id: 23,
    name: "23 银灰星尘",
    image: "http://p1.meituan.net/pilotimages/bf8657d94693fb0fe1da3f7729d5667d2020119.png",
    original: "http://p0.meituan.net/pilotimages/ec8057452f9520a0ca5cdba3f78f6f80982638.png",
    palette: ["#8e949f", "#f4f6f8", "#353a42"],
    pattern: "foil",
    tags: ["星尘", "冷淡"],
  },
  {
    id: 24,
    name: "24 甜橘珊瑚",
    image: "http://p0.meituan.net/pilotimages/e80e1d25e48d7ef5c505b29ee8e331822641412.png",
    original: "http://p1.meituan.net/pilotimages/1fb5e1b20aea0b0881a4eb5d41bff80b1076304.png",
    palette: ["#ee7b54", "#fff0dc", "#bf3e32"],
    pattern: "ombre",
    tags: ["元气", "显嫩"],
  },
  {
    id: 25,
    name: "25 极光粉紫",
    image: "http://p1.meituan.net/pilotimages/73ee568aa09547d8bfc0168113ac9ebc2712329.png",
    original: "http://p0.meituan.net/pilotimages/0d9545bd4583f87e8cc3882d15ff84101211916.png",
    palette: ["#d088d8", "#f7f0ff", "#6d4bb1"],
    pattern: "aurora",
    tags: ["极光", "梦幻"],
  },
];

const MEDIAPIPE_MODULE_URL = "./vendor/mediapipe/vision_bundle.mjs";
const MEDIAPIPE_WASM_ROOT = "./vendor/mediapipe";
const HAND_MODEL_URL = "./models/hand_landmarker.task";
const NAIL_ASSET_MANIFEST_URL = "./assets/nail-assets/styles.json";
const NAIL_SEG_METADATA_URL = "./models/nail-seg/metadata.json";
const DEFAULT_NAIL_SEG_MODEL_URL = "./models/nail-seg/yolo11n-seg-nails343.onnx";
const NAIL_SEG_WORKER_URL = "./nail-seg-worker.js";
const ORT_WASM_ROOT = new URL("./vendor/onnxruntime-web/", window.location.href).href;
const PHOTO_TRYON_SERVICE_URL = "http://127.0.0.1:8765";
const VIDEO_SEGMENTATION_INTERVAL_MS = 260;
const VIDEO_SEGMENTATION_STALE_MS = 1600;
const STABLE_MASK_STALE_MS = 1300;
const STABLE_MASK_HOLD_MS = 520;
const PROFILE_GEOMETRY_MODES = new Set(["natural_style", "press_on_style", "hybrid_root"]);
const PROFILE_ASSET_POLICIES = new Set(["seg_only", "best_available", "manual_patch"]);

function withCacheVersion(url, version) {
  if (!version || url.includes("?")) {
    return url;
  }
  return `${url}?v=${encodeURIComponent(version)}`;
}

const fingers = [
  { key: "thumb", label: "拇指", joints: [2, 3, 4], centerT: 0.56, widthFactor: 0.66, lengthFactor: 1.04 },
  { key: "index", label: "食指", joints: [6, 7, 8], centerT: 0.6, widthFactor: 0.48, lengthFactor: 1.12 },
  { key: "middle", label: "中指", joints: [10, 11, 12], centerT: 0.6, widthFactor: 0.5, lengthFactor: 1.14 },
  { key: "ring", label: "无名指", joints: [14, 15, 16], centerT: 0.6, widthFactor: 0.47, lengthFactor: 1.1 },
  { key: "pinky", label: "小指", joints: [18, 19, 20], centerT: 0.58, widthFactor: 0.44, lengthFactor: 1.03 },
];

const state = {
  mode: "photo",
  selectedStyle: styles[0],
  photoReady: false,
  photoPreviewReady: false,
  videoReady: false,
  stream: null,
  tracker: null,
  trackerMode: null,
  modelState: "loading",
  trackingState: "loading",
  anchors: [],
  smoothedAnchors: null,
  handProfile: null,
  styleAssets: new Map(),
  textureCache: new Map(),
  maskCache: new Map(),
  assetsReady: false,
  segmentation: {
    state: "loading",
    session: null,
    metadata: null,
    masks: [],
    stableMasks: new Map(),
    stableDimensions: new Map(),
    stableNailBeds: new Map(),
    running: false,
    lastRunAt: 0,
    inputName: "images",
    inputSize: 640,
    confThreshold: 0.35,
    iouThreshold: 0.45,
    maskThreshold: 0.48,
    maxDetections: 12,
    staleAfterMs: 350,
    videoIntervalMs: VIDEO_SEGMENTATION_INTERVAL_MS,
    videoStaleAfterMs: VIDEO_SEGMENTATION_STALE_MS,
    worker: null,
    workerReady: false,
    workerFailed: false,
    workerPending: false,
    frameId: 0,
    lastAcceptedFrameId: 0,
    pendingFrames: new Map(),
    lastLatencyMs: 0,
  },
  animationFrame: null,
  lastVideoTime: -1,
  isDetectingFrame: false,
  lastImageSrc: "",
  currentPhotoFile: null,
  photoJobState: "idle",
  photoJobAbort: null,
  photoTryonResult: null,
  comparisonReady: false,
  vision: {
    FilesetResolver: null,
    HandLandmarker: null,
  },
};

const els = {
  stage: document.getElementById("stage"),
  canvas: document.getElementById("tryonCanvas"),
  ctx: document.getElementById("tryonCanvas").getContext("2d"),
  photo: document.getElementById("photoPreview"),
  video: document.getElementById("videoPreview"),
  empty: document.getElementById("emptyState"),
  status: document.getElementById("stageStatus"),
  hint: document.getElementById("trackingHint"),
  dot: document.getElementById("statusDot"),
  modelBadge: document.getElementById("modelBadge"),
  profileSummary: document.getElementById("profileSummary"),
  selectedStyle: document.getElementById("selectedStyle"),
  styleGrid: document.getElementById("styleGrid"),
  photoInput: document.getElementById("photoInput"),
  uploadTrigger: document.getElementById("uploadTrigger"),
  generatePhoto: document.getElementById("generatePhoto"),
  cancelPhotoJob: document.getElementById("cancelPhotoJob"),
  photoJobPanel: document.getElementById("photoJobPanel"),
  photoServiceBadge: document.getElementById("photoServiceBadge"),
  photoJobStatus: document.getElementById("photoJobStatus"),
  photoJobMessage: document.getElementById("photoJobMessage"),
  photoJobProgressBar: document.getElementById("photoJobProgressBar"),
  photoResultSection: document.getElementById("photoResultSection"),
  photoOriginalImage: document.getElementById("photoOriginalImage"),
  photoResultImage: document.getElementById("photoResultImage"),
  photoResultCaption: document.getElementById("photoResultCaption"),
  photoResultMeta: document.getElementById("photoResultMeta"),
  photoDownload: document.getElementById("photoDownload"),
  photoRetry: document.getElementById("photoRetry"),
  comparisonLayer: document.getElementById("comparisonLayer"),
  comparisonAfterClip: document.getElementById("comparisonAfterClip"),
  generationWait: document.getElementById("generationWait"),
  generationWaitText: document.getElementById("generationWaitText"),
  continueChatgptLogin: document.getElementById("continueChatgptLogin"),
  startCamera: document.getElementById("startCamera"),
  stopCamera: document.getElementById("stopCamera"),
  mirrorVideo: document.getElementById("mirrorVideo"),
  captureFrame: document.getElementById("captureFrame"),
};

function setStatus(text, hint = "") {
  els.status.textContent = text;
  if (hint) {
    els.hint.textContent = hint;
  }
}

function setTrackingState(nextState, text, hint) {
  state.trackingState = nextState;
  els.dot.className = `status-dot is-${nextState}`;
  setStatus(text, hint);
}

function setModelState(nextState, label) {
  state.modelState = nextState;
  els.modelBadge.textContent = label;
  updateModelBadge();
}

function setPhotoJobState(nextState, status, message = "", progress = 0) {
  state.photoJobState = nextState;
  const busyStates = new Set(["queued", "uploading", "generating", "downloading"]);
  const isBusy = busyStates.has(nextState);
  els.photoJobPanel.classList.toggle("is-running", isBusy);
  els.photoJobPanel.classList.toggle("is-done", nextState === "done");
  els.photoJobPanel.classList.toggle("is-failed", nextState === "failed");
  els.stage.classList.toggle("is-generating", isBusy);
  els.generationWait.classList.toggle("is-hidden", !isBusy);
  els.generationWaitText.textContent = message || "请稍等，正在保持手部和背景不变，只生成指甲区域。";
  els.photoJobStatus.textContent = status;
  els.photoJobMessage.textContent = message;
  els.photoJobProgressBar.style.width = `${Math.round(clamp(progress, 0, 1) * 100)}%`;
  const badgeMap = {
    idle: "高保真服务待连接",
    detecting: "正在识别手部",
    preview: "手图与款式已就绪",
    queued: "正在准备 AI 生成",
    uploading: "正在上传参考图",
    generating: "ChatGPT 正在生成",
    downloading: "正在保存结果",
    login_required: "需要登录授权",
    done: "生成完成",
    failed: "生成服务未就绪",
  };
  els.photoServiceBadge.textContent = badgeMap[nextState] || badgeMap.idle;
  updateGenerateButtonState();
  els.cancelPhotoJob.disabled = !(busyStates.has(nextState) && nextState !== "login_required");
  els.continueChatgptLogin.classList.toggle("is-hidden", nextState !== "login_required");
}

function updateGenerateButtonState() {
  const busyStates = new Set(["queued", "uploading", "generating", "downloading", "login_required"]);
  const canGenerate = state.photoReady && !busyStates.has(state.photoJobState);
  els.generatePhoto.disabled = !canGenerate;
  els.generatePhoto.textContent = busyStates.has(state.photoJobState)
    ? "生成中"
    : state.photoTryonResult
      ? "重新生成 AI 试戴"
      : "生成 AI 试戴";
}

function setComparisonReveal(value) {
  const numericValue = Number(value ?? 100);
  const split = clamp(Number.isFinite(numericValue) ? numericValue : 100, 0, 100);
  els.comparisonLayer.style.setProperty("--split", `${split}%`);
  els.comparisonLayer.classList.toggle("is-revealed", split <= 2);
}

function showGeneratedComparison(resultUrl) {
  const revealToken = `${Date.now()}-${Math.random()}`;
  state.comparisonReady = false;
  els.comparisonLayer.dataset.revealToken = revealToken;
  els.comparisonLayer.classList.add("is-hidden");
  els.comparisonLayer.classList.remove("is-revealed");
  setComparisonReveal(100);
  els.photoOriginalImage.src = state.lastImageSrc;
  els.photoResultImage.onload = () => {
    if (els.comparisonLayer.dataset.revealToken !== revealToken) {
      return;
    }
    state.comparisonReady = true;
    els.comparisonLayer.classList.remove("is-hidden");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setComparisonReveal(0));
    });
  };
  els.photoResultImage.onerror = () => {
    if (els.comparisonLayer.dataset.revealToken !== revealToken) {
      return;
    }
    setPhotoJobState("failed", "结果图加载失败", "ChatGPT 已返回结果地址，但图片未能正确加载，请重新生成。", 0.92);
  };
  els.photoResultImage.removeAttribute("src");
  els.photoResultImage.src = resultUrl;
  if (els.photoResultImage.complete && els.photoResultImage.naturalWidth > 0) {
    els.photoResultImage.onload();
  }
}

function resetPhotoResult({ keepMessage = false } = {}) {
  if (state.photoJobAbort) {
    state.photoJobAbort.abort();
    state.photoJobAbort = null;
  }
  state.photoTryonResult = null;
  state.comparisonReady = false;
  els.photoResultSection.classList.add("is-hidden");
  els.comparisonLayer.classList.add("is-hidden");
  els.comparisonLayer.classList.remove("is-revealed");
  setComparisonReveal(100);
  els.continueChatgptLogin.classList.add("is-hidden");
  els.photoDownload.removeAttribute("href");
  els.photoOriginalImage.removeAttribute("src");
  els.photoResultImage.removeAttribute("src");
  if (!keepMessage) {
    setPhotoJobState("idle", "上传照片后开始生成", "上传手图并选择款式后，点击生成 AI 试戴。", 0);
  } else {
    updateGenerateButtonState();
  }
}

function resetPhotoPreviewReadiness() {
  state.photoPreviewReady = false;
  updateGenerateButtonState();
}

function currentMediaReady() {
  return state.mode === "camera" ? state.videoReady : state.photoReady;
}

function syncMediaState() {
  const isReady = currentMediaReady();
  els.empty.classList.toggle("is-hidden", isReady);
  renderOverlay();
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.panel !== mode);
  });
  els.photo.classList.toggle("is-active", mode === "photo");
  els.video.classList.toggle("is-active", mode === "camera");
  syncMediaState();
  if (mode === "camera") {
    setTrackingState(state.videoReady ? "detecting" : "ready", state.videoReady ? "正在识别手型" : "待开启", "把手掌完整放入画面中央");
    if (state.videoReady && state.tracker) {
      startVideoLoop();
    }
    return;
  }
  stopVideoLoop();
  if (state.photoReady) {
    setTrackingState("detecting", "正在识别手型", "图片会自动定位 5 个指甲");
    setTrackingState("ready", "手图已就绪", "可直接生成 AI 试戴，本地识别不再阻塞流程");
  } else {
    setTrackingState("ready", "等待手图", "上传图片开始试穿");
  }
  updateGenerateButtonState();
}

function markMediaReady(isReady) {
  if (state.mode === "camera") {
    state.videoReady = isReady;
  } else {
    state.photoReady = isReady;
  }
  syncMediaState();
  updateGenerateButtonState();
}

async function initHandModel() {
  setModelState("loading", "加载中");
  setTrackingState("loading", "正在加载识别模型", "读取本地 MediaPipe 资源");
  try {
    const vision = await import(MEDIAPIPE_MODULE_URL);
    state.vision.FilesetResolver = vision.FilesetResolver;
    state.vision.HandLandmarker = vision.HandLandmarker;
    const fileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_ROOT);
    state.tracker = await createHandLandmarker(fileset, "GPU");
    state.trackerMode = "IMAGE";
    setModelState("ready", "本地模型就绪");
    setTrackingState("ready", "识别模型就绪", "上传手图或开启摄像头");
    if (state.photoReady) {
      updateGenerateButtonState();
    }
  } catch (gpuError) {
    try {
      const vision = state.vision.FilesetResolver ? state.vision : await import(MEDIAPIPE_MODULE_URL);
      state.vision.FilesetResolver = vision.FilesetResolver;
      state.vision.HandLandmarker = vision.HandLandmarker;
      const fileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_ROOT);
      state.tracker = await createHandLandmarker(fileset, "CPU");
      state.trackerMode = "IMAGE";
      setModelState("ready", "CPU 模型就绪");
      setTrackingState("ready", "识别模型就绪", "上传手图或开启摄像头");
      if (state.photoReady) {
        updateGenerateButtonState();
      }
    } catch (error) {
      state.tracker = null;
      setModelState("unsupported", "模型未就绪");
      setTrackingState("unsupported", "识别模型未就绪", "请检查本地 MediaPipe 与 hand_landmarker.task 资源");
      console.warn("Hand landmarker failed to load", error);
    }
  }
}

function createHandLandmarker(fileset, delegate) {
  return state.vision.HandLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: HAND_MODEL_URL,
      delegate,
    },
    runningMode: "IMAGE",
    numHands: 2,
    minHandDetectionConfidence: 0.55,
    minHandPresenceConfidence: 0.55,
    minTrackingConfidence: 0.5,
  });
}

async function ensureTrackerMode(mode) {
  if (!state.tracker || state.trackerMode === mode) {
    return Boolean(state.tracker);
  }
  await state.tracker.setOptions({ runningMode: mode });
  state.trackerMode = mode;
  state.smoothedAnchors = mode === "VIDEO" ? state.smoothedAnchors : null;
  return true;
}

async function initNailSegmentationModel() {
  if (!window.ort) {
    state.segmentation.state = "missing";
    updateModelBadge();
    return;
  }
  try {
    window.ort.env.wasm.wasmPaths = ORT_WASM_ROOT;
    window.ort.env.wasm.numThreads = 1;
    const metadataResponse = await fetch(NAIL_SEG_METADATA_URL, { cache: "no-store" });
    if (!metadataResponse.ok) {
      throw new Error(`metadata HTTP ${metadataResponse.status}`);
    }
    const metadata = await metadataResponse.json();
    const modelUrl = withCacheVersion(metadata.model || DEFAULT_NAIL_SEG_MODEL_URL, metadata.version);
    const modelResponse = await fetch(modelUrl, { method: "HEAD", cache: "no-store" });
    if (!modelResponse.ok) {
      state.segmentation.state = "missing";
      state.segmentation.metadata = metadata;
      updateModelBadge();
      return;
    }
    state.segmentation.metadata = metadata;
    state.segmentation.inputName = metadata.inputName || "images";
    state.segmentation.inputSize = Number(metadata.inputSize || 640);
    state.segmentation.confThreshold = Number(metadata.confThreshold || 0.35);
    state.segmentation.iouThreshold = Number(metadata.iouThreshold || 0.45);
    state.segmentation.maskThreshold = Number(metadata.maskThreshold || 0.48);
    state.segmentation.maxDetections = Number(metadata.maxDetections || 12);
    state.segmentation.staleAfterMs = Number(metadata.staleAfterMs || 350);
    state.segmentation.videoIntervalMs = Number(metadata.videoIntervalMs || VIDEO_SEGMENTATION_INTERVAL_MS);
    state.segmentation.videoStaleAfterMs = Number(metadata.videoStaleAfterMs || VIDEO_SEGMENTATION_STALE_MS);
    state.segmentation.session = await window.ort.InferenceSession.create(modelUrl, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
    state.segmentation.inputName = state.segmentation.session.inputNames?.[0] || state.segmentation.inputName;
    initSegmentationWorker(modelUrl, metadata);
    state.segmentation.state = "ready";
    updateModelBadge();
    if (state.mode === "photo" && state.photoReady && state.tracker) {
      updateGenerateButtonState();
    }
  } catch (error) {
    state.segmentation.state = "failed";
    updateModelBadge();
    console.warn("Nail segmentation model failed to load", error);
  }
}

function updateModelBadge() {
  const handReady = state.modelState === "ready";
  const segState = state.segmentation.state;
  const segLabel =
    segState === "ready"
      ? "精准分割"
      : segState === "running"
        ? "分割中"
        : segState === "missing"
          ? "基础贴合"
          : segState === "failed"
            ? "分割失败"
            : "加载分割";
  if (handReady) {
    const engineLabel = segState === "ready" || segState === "running" ? "MediaPipe + ONNX" : "MediaPipe";
    els.modelBadge.textContent = `${engineLabel} / ${segLabel}`;
  } else if (state.modelState === "unsupported") {
    els.modelBadge.textContent = "模型未就绪";
  } else {
    els.modelBadge.textContent = `加载中 / ${segLabel}`;
  }
}

function initSegmentationWorker(modelUrl, metadata) {
  if (!window.Worker || state.segmentation.worker) {
    return;
  }
  try {
    const worker = new Worker(NAIL_SEG_WORKER_URL);
    state.segmentation.worker = worker;
    worker.onmessage = (event) => handleSegmentationWorkerMessage(event.data);
    worker.onerror = (error) => {
      state.segmentation.workerFailed = true;
      state.segmentation.workerReady = false;
      console.warn("Nail segmentation worker failed", error);
    };
    worker.postMessage({
      type: "init",
      modelUrl,
      ortScriptUrl: "./vendor/onnxruntime-web/ort.min.js",
      ortWasmRoot: ORT_WASM_ROOT,
      metadata: {
        ...metadata,
        inputName: state.segmentation.inputName,
        inputSize: state.segmentation.inputSize,
        confThreshold: state.segmentation.confThreshold,
        iouThreshold: state.segmentation.iouThreshold,
        maskThreshold: state.segmentation.maskThreshold,
        maxDetections: state.segmentation.maxDetections,
      },
    });
  } catch (error) {
    state.segmentation.workerFailed = true;
    console.warn("Unable to start nail segmentation worker", error);
  }
}

function handleSegmentationWorkerMessage(message) {
  if (!message || !message.type) return;
  if (message.type === "ready") {
    state.segmentation.workerReady = true;
    state.segmentation.workerFailed = false;
    return;
  }
  if (message.type === "failed") {
    state.segmentation.workerFailed = true;
    state.segmentation.workerReady = false;
    state.segmentation.workerPending = false;
    state.segmentation.pendingFrames.delete(message.frameId);
    console.warn("Nail segmentation worker reported failure", message.error);
    return;
  }
  if (message.type !== "result") return;
  const frame = state.segmentation.pendingFrames.get(message.frameId);
  state.segmentation.pendingFrames.delete(message.frameId);
  state.segmentation.workerPending = false;
  if (!frame || message.frameId <= state.segmentation.lastAcceptedFrameId) {
    return;
  }
  const metrics = getMediaMetrics();
  if (!metrics || state.mode !== "camera") {
    return;
  }
  const detections = (message.detections || []).map((detection) => {
    const mask = detection.mask;
    const canvas = document.createElement("canvas");
    canvas.width = mask.width;
    canvas.height = mask.height;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(new ImageData(new Uint8ClampedArray(mask.data), mask.width, mask.height), 0, 0);
    return {
      bbox: detection.bbox,
      areaRatio: Number(detection.areaRatio || mask.areaRatio || 0),
      confidence: detection.confidence,
      centroid: detection.centroid,
      canvas,
    };
  });
  const masks = assignMasksToFingers(detections, frame.anchors, frame.metrics);
  if (!masks.length) {
    state.segmentation.state = "ready";
    updateModelBadge();
    return;
  }
  state.segmentation.lastAcceptedFrameId = message.frameId;
  state.segmentation.lastLatencyMs = Number(message.latencyMs || 0);
  acceptSegmentationMasks(masks, `${masks.length} 个指甲已精准分割`);
}

async function loadNailAssets() {
  try {
    const response = await fetch(NAIL_ASSET_MANIFEST_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const records = await response.json();
    records.forEach((record) => {
      const normalized = normalizeStyleAsset(record);
      state.styleAssets.set(Number(record.id), normalized);
      const target = styles.find((style) => style.id === Number(record.id));
      if (target) {
        target.assetPreview = normalized.preview;
        target.meanColor = normalized.meanColor;
        target.assetName = normalized.name;
        target.finish = normalized.finish;
        target.assetQuality = normalized.assetQuality;
        target.tryOnProfile = normalized.tryOnProfile;
        target.allowExtension = normalized.allowExtension;
        target.shapeMetrics = normalized.shapeMetrics;
        target.shapeConfidence = normalized.shapeConfidence;
        target.rootProfile = normalized.rootProfile;
      }
    });
    state.assetsReady = true;
    renderSelectedStyle();
    renderStyles();
    preloadStyleTextures(state.selectedStyle);
    renderOverlay();
  } catch (error) {
    state.assetsReady = false;
    console.warn("Nail assets not available; falling back to generated polish.", error);
  }
}

function normalizeStyleAsset(record) {
  const profileRecord = {
    ...(record.tryOnProfile || {}),
    allowExtension: Boolean(record.allowExtension ?? record.tryOnProfile?.allowExtension),
    shapeConfidence: record.tryOnProfile?.shapeConfidence ?? record.shapeConfidence,
  };
  const textures = {};
  Object.entries(record.textures || {}).forEach(([finger, value]) => {
    if (typeof value === "string") {
      textures[finger] = {
        image: value,
        mask: value,
        bbox: null,
        confidence: 0.55,
        finish: record.finish || inferFinish(record),
        source: "legacy",
      };
      return;
    }
    textures[finger] = {
      image: value.image || value.path || record.preview,
      mask: value.mask || value.image || value.path || record.preview,
      bbox: value.bbox || null,
      confidence: Number(value.confidence || 0.68),
      finish: value.finish || record.finish || inferFinish(record),
      source: value.source || "seg",
    };
  });
  return {
    ...record,
    finish: record.finish || inferFinish(record),
    assetQuality: normalizeAssetQuality(record.assetQuality),
    allowExtension: Boolean(record.allowExtension),
    shapeMetrics: normalizeShapeMetrics(record.shapeMetrics),
    shapeConfidence: clamp(Number(record.shapeConfidence || record.tryOnProfile?.shapeConfidence || 0.45), 0, 1),
    rootProfile: normalizeRootProfile(record.rootProfile),
    textures,
    tryOnProfile: normalizeTryOnProfile(profileRecord),
  };
}

function normalizeAssetQuality(quality = {}) {
  return {
    sourceCounts: quality.sourceCounts || {},
    confidence: clamp(Number(quality.confidence || 0.55), 0, 1),
    coverage: clamp(Number(quality.coverage || 0), 0, 1),
    aspectMedian: Number(quality.aspectMedian || 0),
    aspectStd: Math.max(0, Number(quality.aspectStd || 0)),
    heuristicRatio: clamp(Number(quality.heuristicRatio || 0), 0, 1),
    complexStyle: Boolean(quality.complexStyle),
    needsReview: Boolean(quality.needsReview),
    reasons: Array.isArray(quality.reasons) ? quality.reasons : [],
  };
}

function normalizeTryOnProfile(profile = {}) {
  const allowExtension = Boolean(profile.allowExtension);
  const fitMode = allowExtension && profile.fitMode === "press_on" ? "press_on" : "natural";
  const inferredGeometryMode = fitMode === "press_on" ? "press_on_style" : "natural_style";
  const geometryMode = allowExtension
    ? PROFILE_GEOMETRY_MODES.has(profile.geometryMode)
      ? profile.geometryMode
      : inferredGeometryMode
    : profile.geometryMode === "hybrid_root"
      ? "hybrid_root"
      : "natural_style";
  const assetPolicy = PROFILE_ASSET_POLICIES.has(profile.assetPolicy) ? profile.assetPolicy : "best_available";
  const shape = ["round", "oval", "squoval", "almond"].includes(profile.shape) ? profile.shape : "squoval";
  const lengthScale = allowExtension
    ? clamp(Number(profile.lengthScale || 1.12), 1.04, 1.34)
    : clamp(Number(profile.lengthScale || 1), 0.92, 1.03);
  return {
    fitMode,
    geometryMode,
    assetPolicy,
    needsReview: Boolean(profile.needsReview),
    allowExtension,
    shape,
    shapeConfidence: clamp(Number(profile.shapeConfidence || 0.5), 0, 1),
    lengthScale,
    widthScale: clamp(Number(profile.widthScale || 1), 0.86, 1.14),
    tipExtension: allowExtension ? clamp(Number(profile.tipExtension || 0), 0, 0.24) : 0,
    rootFade: clamp(Number(profile.rootFade || 0.22), 0.08, 0.42),
    confidence: clamp(Number(profile.confidence || 0.68), 0.1, 1),
  };
}

function normalizeShapeMetrics(metrics = {}) {
  return {
    aspectRatio: Number(metrics.aspectRatio || 1.5),
    tipSharpness: clamp(Number(metrics.tipSharpness || 0.2), 0, 1),
    rootWidthRatio: clamp(Number(metrics.rootWidthRatio || 0.78), 0, 1.4),
    maxWidthPosition: clamp(Number(metrics.maxWidthPosition || 0.62), 0, 1),
    sideTaper: clamp(Number(metrics.sideTaper || 0.12), -0.4, 1),
    coverage: clamp(Number(metrics.coverage || 0), 0, 1),
  };
}

function normalizeRootProfile(root = {}) {
  return {
    rootY: clamp(Number(root.rootY || 0.9), 0, 1),
    rootWidthRatio: clamp(Number(root.rootWidthRatio || 0.78), 0, 1.4),
    rootCenterX: clamp(Number(root.rootCenterX || 0.5), 0, 1),
    tipY: clamp(Number(root.tipY || 0.08), 0, 1),
    bedLengthRatio: clamp(Number(root.bedLengthRatio || 0.84), 0.2, 1),
  };
}

function inferFinish(record) {
  const text = `${record.name || ""} ${record.pattern || ""}`.toLowerCase();
  if (text.includes("chrome") || text.includes("metal") || text.includes("金属")) return "metallic";
  if (text.includes("glitter") || text.includes("shimmer") || text.includes("闪")) return "shimmer";
  if (text.includes("matte") || text.includes("雾")) return "matte";
  if (text.includes("jelly") || text.includes("玻璃") || text.includes("透")) return "jelly";
  return "gloss";
}

function styleBackground(style) {
  const [base, light, accent] = style.palette;
  const effects = {
    glitter:
      `radial-gradient(circle at 32% 24%, rgba(255,255,255,.95) 0 4%, transparent 5%),` +
      `radial-gradient(circle at 68% 58%, rgba(255,255,255,.8) 0 3%, transparent 4%),` +
      `linear-gradient(145deg, ${light}, ${base} 46%, ${accent})`,
    marble:
      `linear-gradient(120deg, transparent 0 31%, rgba(255,255,255,.55) 32% 36%, transparent 37%),` +
      `linear-gradient(145deg, ${light}, ${base} 52%, ${accent})`,
    cat:
      `linear-gradient(112deg, transparent 0 36%, rgba(255,255,255,.8) 45%, transparent 54%),` +
      `linear-gradient(145deg, ${accent}, ${base} 46%, ${light})`,
    french:
      `radial-gradient(ellipse at 50% 92%, ${light} 0 30%, transparent 31%),` +
      `linear-gradient(180deg, ${base}, ${accent})`,
    chrome:
      `linear-gradient(105deg, rgba(255,255,255,.75), transparent 20% 34%, rgba(255,255,255,.5) 45%, transparent 60%),` +
      `linear-gradient(145deg, ${accent}, ${base}, ${light})`,
    pearl:
      `radial-gradient(circle at 36% 34%, rgba(255,255,255,.85), transparent 28%),` +
      `linear-gradient(160deg, ${light}, ${base} 54%, ${accent})`,
    floral:
      `radial-gradient(circle at 36% 34%, ${light} 0 8%, transparent 9%),` +
      `radial-gradient(circle at 62% 62%, rgba(255,255,255,.8) 0 7%, transparent 8%),` +
      `linear-gradient(145deg, ${base}, ${accent})`,
    aurora:
      `linear-gradient(120deg, rgba(255,255,255,.78), transparent 24% 45%, rgba(120,255,235,.46) 58%, transparent 75%),` +
      `linear-gradient(145deg, ${accent}, ${base}, ${light})`,
    foil:
      `radial-gradient(circle at 30% 68%, #ffe7a1 0 8%, transparent 9%),` +
      `radial-gradient(circle at 68% 24%, #fff6bd 0 7%, transparent 8%),` +
      `linear-gradient(145deg, ${base}, ${accent})`,
    ombre: `linear-gradient(180deg, ${light}, ${base} 58%, ${accent})`,
    check:
      `linear-gradient(45deg, rgba(255,255,255,.55) 25%, transparent 25% 50%, rgba(255,255,255,.55) 50% 75%, transparent 75%),` +
      `linear-gradient(145deg, ${base}, ${accent})`,
    gloss: `linear-gradient(145deg, ${light}, ${base} 45%, ${accent})`,
  };
  return effects[style.pattern] || effects.gloss;
}

function styleEffect(style) {
  const effects = {
    glitter:
      "radial-gradient(circle at 45% 72%, rgba(255,255,255,.88) 0 3%, transparent 4%), radial-gradient(circle at 60% 34%, rgba(255,255,255,.62) 0 2%, transparent 3%)",
    cat: "linear-gradient(104deg, transparent 0 42%, rgba(255,255,255,.76) 49%, transparent 56%)",
    chrome: "linear-gradient(96deg, rgba(255,255,255,.62), transparent 25% 40%, rgba(255,255,255,.52) 55%, transparent 78%)",
    pearl: "radial-gradient(circle at 44% 38%, rgba(255,255,255,.76), transparent 32%)",
    aurora: "linear-gradient(126deg, transparent, rgba(117,255,231,.44), rgba(255,255,255,.6), transparent)",
    foil: "radial-gradient(circle at 68% 24%, rgba(255,232,136,.9) 0 8%, transparent 9%)",
  };
  return effects[style.pattern] || "linear-gradient(90deg, rgba(255,255,255,.3), transparent)";
}

function renderOverlay() {
  const ctx = els.ctx;
  const size = resizeTryonCanvas();
  ctx.clearRect(0, 0, size.width, size.height);
  if (!currentMediaReady() || !state.anchors.length) {
    return;
  }

  state.anchors.forEach((anchor, index) => {
    const environment = sampleAnchorEnvironment(anchor);
    drawNailComposite(ctx, anchor, index, environment, size);
  });
}

function resizeTryonCanvas() {
  const rect = els.stage.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  if (els.canvas.width !== Math.round(width * dpr) || els.canvas.height !== Math.round(height * dpr)) {
    els.canvas.width = Math.round(width * dpr);
    els.canvas.height = Math.round(height * dpr);
  }
  els.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height, dpr };
}

function drawNailComposite(ctx, anchor, index, environment, stageSize) {
  const nailMask = getNailMaskForAnchor(anchor);
  if (nailMask) {
    drawSegmentedNailComposite(ctx, anchor, index, nailMask, environment, stageSize);
    return;
  }
  const x = (anchor.x / 100) * stageSize.width;
  const y = (anchor.y / 100) * stageSize.height;
  const profile = getSelectedTryOnProfile();
  const width = Math.max(10, (anchor.width / 100) * stageSize.width * profile.widthScale);
  const height = Math.max(18, (anchor.height / 100) * stageSize.height * profile.lengthScale);
  const texture = getTextureForAnchor(anchor, index);
  const fallback = getStyleFallbackColor();
  const brightness = clamp(0.72 + environment.luminance * 0.62, 0.68, 1.22);
  const contrast = clamp(0.94 + Math.abs(environment.luminance - 0.52) * 0.24, 0.94, 1.1);
  const alpha = clamp(anchor.confidence, 0.62, 0.96);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((anchor.rotation * Math.PI) / 180);
  ctx.translate(0, -((anchor.height / 100) * stageSize.height * profile.tipExtension));
  ctx.globalAlpha = alpha;
  createProfileNailPath(ctx, width, height, profile.shape);
  ctx.save();
  ctx.clip();

  const baseGradient = ctx.createLinearGradient(0, -height * 0.55, 0, height * 0.55);
  baseGradient.addColorStop(0, rgba(lightenRgb(fallback, 30), 0.94));
  baseGradient.addColorStop(0.56, rgba(fallback, 0.96));
  baseGradient.addColorStop(1, rgba(darkenRgb(fallback, 42), 0.98));
  ctx.fillStyle = baseGradient;
  ctx.fillRect(-width, -height, width * 2, height * 2);

  if (texture?.image) {
    ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(1.08)`;
    ctx.globalAlpha = alpha * (texture.weight || 1);
    const drawW = width * 1.45;
    const drawH = height * 1.12;
    ctx.drawImage(texture.image, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.globalAlpha = alpha;
    ctx.filter = "none";
  }

  ctx.globalCompositeOperation = "multiply";
  const rootShadow = ctx.createLinearGradient(0, height * 0.08, 0, height * 0.56);
  rootShadow.addColorStop(0, "rgba(0,0,0,0)");
  rootShadow.addColorStop(1, `rgba(0,0,0,${clamp(0.18 + (1 - environment.luminance) * 0.22, 0.16, 0.34)})`);
  ctx.fillStyle = rootShadow;
  ctx.fillRect(-width, -height, width * 2, height * 2);

  ctx.globalCompositeOperation = "soft-light";
  ctx.fillStyle = environment.warmth >= 0 ? `rgba(255,190,135,${environment.warmth * 0.18})` : `rgba(145,205,255,${Math.abs(environment.warmth) * 0.16})`;
  ctx.fillRect(-width, -height, width * 2, height * 2);

  ctx.globalCompositeOperation = "screen";
  const highlight = ctx.createLinearGradient(-width * 0.34, -height * 0.48, width * 0.32, height * 0.08);
  highlight.addColorStop(0, `rgba(255,255,255,${clamp(0.36 + environment.luminance * 0.18, 0.34, 0.54)})`);
  highlight.addColorStop(0.42, "rgba(255,255,255,0.12)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(-width, -height, width * 2, height * 2);

  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
  ctx.lineWidth = Math.max(1, width * 0.035);
  ctx.strokeStyle = `rgba(${environment.rgb[0]},${environment.rgb[1]},${environment.rgb[2]},0.30)`;
  createProfileNailPath(ctx, width, height, profile.shape);
  ctx.stroke();
  ctx.restore();
}

function drawSegmentedNailComposite(ctx, anchor, index, nailMask, environment, stageSize) {
  const profile = getSelectedTryOnProfile();
  const texture = getTextureForAnchor(anchor, index);
  const fallback = getStyleFallbackColor();
  const anchorW = Math.max(10, (anchor.width / 100) * stageSize.width);
  const anchorH = Math.max(18, (anchor.height / 100) * stageSize.height);
  const nailBedScale = getStableNailBedScale(anchor, nailMask, profile);
  const drawW = Math.max(12, anchorW * nailBedScale.width * profile.widthScale);
  const extensionBoost = profile.allowExtension ? 1 + profile.tipExtension : 1;
  const drawH = Math.max(18, anchorH * nailBedScale.height * profile.lengthScale * extensionBoost);
  const temp = getScratchCanvas(Math.ceil(drawW * 1.28), Math.ceil(drawH * 1.3));
  const tctx = temp.getContext("2d");
  const cx = temp.width / 2;
  const cy = temp.height / 2;
  const brightness = clamp(0.76 + environment.luminance * 0.58, 0.68, 1.24);
  const contrast = clamp(0.96 + Math.abs(environment.luminance - 0.5) * 0.24, 0.94, 1.12);
  const finish = texture?.finish || "gloss";

  tctx.clearRect(0, 0, temp.width, temp.height);
  const baseGradient = tctx.createLinearGradient(0, cy - drawH * 0.58, 0, cy + drawH * 0.58);
  baseGradient.addColorStop(0, rgba(lightenRgb(fallback, finish === "jelly" ? 46 : 28), finish === "jelly" ? 0.72 : 0.92));
  baseGradient.addColorStop(0.56, rgba(fallback, finish === "jelly" ? 0.78 : 0.96));
  baseGradient.addColorStop(1, rgba(darkenRgb(fallback, finish === "matte" ? 24 : 44), finish === "jelly" ? 0.84 : 0.98));
  tctx.fillStyle = baseGradient;
  tctx.fillRect(0, 0, temp.width, temp.height);

  if (texture?.image) {
    tctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${finish === "matte" ? 0.95 : 1.1})`;
    tctx.globalAlpha = (finish === "jelly" ? 0.76 : 0.94) * (texture.weight || 1);
    tctx.drawImage(texture.image, cx - drawW * 0.7, cy - drawH * 0.58, drawW * 1.4, drawH * 1.16);
    tctx.globalAlpha = 1;
    tctx.filter = "none";
  }

  tctx.globalCompositeOperation = finish === "matte" ? "source-over" : "screen";
  const highlight = tctx.createLinearGradient(cx - drawW * 0.35, cy - drawH * 0.48, cx + drawW * 0.22, cy + drawH * 0.02);
  const highlightAlpha = finish === "matte" ? 0.08 : finish === "metallic" ? 0.62 : 0.42;
  highlight.addColorStop(0, `rgba(255,255,255,${highlightAlpha})`);
  highlight.addColorStop(0.38, "rgba(255,255,255,0.12)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  tctx.fillStyle = highlight;
  tctx.fillRect(0, 0, temp.width, temp.height);

  if (finish === "metallic" || finish === "shimmer") {
    tctx.globalCompositeOperation = "screen";
    tctx.fillStyle = finish === "metallic" ? "rgba(255,235,185,0.24)" : "rgba(255,255,255,0.20)";
    for (let i = 0; i < 9; i += 1) {
      const px = cx - drawW * 0.42 + ((i * 37) % 100) * drawW * 0.0084;
      const py = cy - drawH * 0.36 + ((i * 53) % 100) * drawH * 0.0072;
      tctx.beginPath();
      tctx.arc(px, py, Math.max(1.1, drawW * 0.025), 0, Math.PI * 2);
      tctx.fill();
    }
  }

  tctx.globalCompositeOperation = "multiply";
  const rootShadow = tctx.createLinearGradient(0, cy - drawH * 0.02, 0, cy + drawH * 0.56);
  rootShadow.addColorStop(0, "rgba(0,0,0,0)");
  rootShadow.addColorStop(1, `rgba(0,0,0,${clamp((environment.shadow || 0.16) + (1 - environment.luminance) * 0.14, 0.12, 0.34)})`);
  tctx.fillStyle = rootShadow;
  tctx.fillRect(0, 0, temp.width, temp.height);

  tctx.globalCompositeOperation = "destination-in";
  drawProfileNailMask(tctx, cx, cy, drawW, drawH, profile);
  featherAlpha(temp, 1);

  ctx.save();
  ctx.translate((anchor.x / 100) * stageSize.width, (anchor.y / 100) * stageSize.height);
  ctx.rotate((anchor.rotation * Math.PI) / 180);
  ctx.globalAlpha = clamp(Math.min(anchor.confidence, nailMask.confidence || 0.9), 0.64, 0.96);
  const rootLocalX = anchorW * nailBedScale.rootX;
  const rootLocalY = anchorH * nailBedScale.rootY;
  ctx.drawImage(temp, rootLocalX - cx, rootLocalY - (cy + drawH / 2));
  ctx.restore();
}

function getSelectedTryOnProfile() {
  const asset = state.styleAssets.get(Number(state.selectedStyle.id));
  return normalizeTryOnProfile(asset?.tryOnProfile || state.selectedStyle.tryOnProfile || {});
}

function getSelectedAssetQuality() {
  const asset = state.styleAssets.get(Number(state.selectedStyle.id));
  return normalizeAssetQuality(asset?.assetQuality || state.selectedStyle.assetQuality || {});
}

function getSelectedRootProfile() {
  const asset = state.styleAssets.get(Number(state.selectedStyle.id));
  return normalizeRootProfile(asset?.rootProfile || state.selectedStyle.rootProfile || {});
}

function getStyleFallbackColor() {
  const quality = getSelectedAssetQuality();
  const profile = getSelectedTryOnProfile();
  const paletteColor = state.selectedStyle.palette.map(hexToRgb).find(Boolean) || [220, 126, 136];
  if (profile.assetPolicy === "manual_patch" || quality.needsReview || quality.heuristicRatio >= 0.4) {
    return paletteColor;
  }
  return state.selectedStyle.meanColor || paletteColor;
}

function getStableNailBedScale(anchor, nailMask, profile) {
  const rel = nailMask.rel || { x: 0, y: 0, width: 1.08, height: 1.02 };
  const rawBed = normalizeRuntimeNailBed(nailMask.nailBed || state.segmentation.stableNailBeds.get(anchor.finger), rel, anchor);
  const rootProfile = getSelectedRootProfile();
  const geometryMode = profile.geometryMode || "natural_style";
  const widthLimits =
    geometryMode === "press_on_style" ? [0.7, 1.16] : geometryMode === "hybrid_root" ? [0.72, 1.22] : [0.72, 1.18];
  const heightLimits =
    geometryMode === "press_on_style" ? [0.76, 1.08] : geometryMode === "hybrid_root" ? [0.78, 1.16] : [0.76, 1.08];
  const sourceRootRatio = clamp(rootProfile.rootWidthRatio || 0.78, 0.52, 1.08);
  const rootWidthDriven = rawBed.rootWidth / sourceRootRatio;
  const bedLengthDriven = rawBed.bedLength / clamp(rootProfile.bedLengthRatio || 0.84, 0.54, 1);
  const target = {
    finger: anchor.finger,
    x: clamp(Number(rawBed.center.x || rel.x || 0), -0.42, 0.42),
    y: clamp(Number(rawBed.center.y || rel.y || 0), -0.48, 0.48),
    rootX: clamp(Number(rawBed.rootX || rawBed.center.x || rel.x || 0), -0.46, 0.46),
    rootY: clamp(Number(rawBed.rootY || rel.y + rel.height * 0.46), -0.22, 0.76),
    rootWidth: clamp(Math.abs(Number(rawBed.rootWidth || rel.width * 0.82)), widthLimits[0] * 0.52, widthLimits[1]),
    bedLength: clamp(Math.abs(Number(rawBed.bedLength || rel.height * 0.92)), heightLimits[0] * 0.62, heightLimits[1]),
    width: clamp(Math.abs(Number(rootWidthDriven || rel.width)), widthLimits[0], widthLimits[1]),
    height: clamp(Math.abs(Number(bedLengthDriven || rel.height)), heightLimits[0], heightLimits[1]),
    confidence: clamp(Math.min(nailMask.confidence || 0.55, rawBed.confidence || 0.55), 0, 1),
    source: nailMask.source || "seg",
  };
  const previous = state.segmentation.stableDimensions.get(anchor.finger);
  if (!previous || state.mode !== "camera") {
    state.segmentation.stableDimensions.set(anchor.finger, target);
    return target;
  }
  const qualityAlpha = clamp(0.18 + target.confidence * 0.24, 0.18, 0.42);
  const limited = {
    finger: anchor.finger,
    x: lerp(previous.x, target.x, qualityAlpha),
    y: lerp(previous.y, target.y, qualityAlpha),
    rootX: lerp(previous.rootX ?? previous.x, target.rootX, qualityAlpha),
    rootY: lerp(previous.rootY ?? previous.y, clamp(target.rootY, (previous.rootY ?? previous.y) - 0.12, (previous.rootY ?? previous.y) + 0.12), qualityAlpha),
    rootWidth: lerp(previous.rootWidth || target.rootWidth, clamp(target.rootWidth, (previous.rootWidth || target.rootWidth) * 0.9, (previous.rootWidth || target.rootWidth) * 1.1), qualityAlpha),
    bedLength: lerp(previous.bedLength || target.bedLength, clamp(target.bedLength, (previous.bedLength || target.bedLength) * 0.88, (previous.bedLength || target.bedLength) * 1.12), qualityAlpha),
    width: lerp(previous.width, clamp(target.width, previous.width * 0.9, previous.width * 1.1), qualityAlpha),
    height: lerp(previous.height, clamp(target.height, previous.height * 0.88, previous.height * 1.12), qualityAlpha),
    confidence: lerp(previous.confidence || 0.5, target.confidence, qualityAlpha),
    source: target.source,
  };
  state.segmentation.stableDimensions.set(anchor.finger, limited);
  return limited;
}

function normalizeRuntimeNailBed(nailBed, rel, anchor) {
  const fallback = fallbackNailBed(rel, anchor);
  if (!nailBed?.rootLine || !nailBed?.center) {
    return {
      rootX: (fallback.rootLine.x1 + fallback.rootLine.x2) / 2,
      rootY: (fallback.rootLine.y1 + fallback.rootLine.y2) / 2,
      rootWidth: fallback.rootWidth,
      bedLength: fallback.bedLength,
      center: fallback.center,
      confidence: fallback.confidence,
    };
  }
  const rootX = (Number(nailBed.rootLine.x1) + Number(nailBed.rootLine.x2)) / 2;
  const rootY = (Number(nailBed.rootLine.y1) + Number(nailBed.rootLine.y2)) / 2;
  return {
    rootX: Number.isFinite(rootX) ? rootX : (fallback.rootLine.x1 + fallback.rootLine.x2) / 2,
    rootY: Number.isFinite(rootY) ? rootY : (fallback.rootLine.y1 + fallback.rootLine.y2) / 2,
    rootWidth: Number.isFinite(nailBed.rootWidth) ? Math.abs(nailBed.rootWidth) : fallback.rootWidth,
    bedLength: Number.isFinite(nailBed.bedLength) ? Math.abs(nailBed.bedLength) : fallback.bedLength,
    center: {
      x: Number.isFinite(nailBed.center.x) ? nailBed.center.x : fallback.center.x,
      y: Number.isFinite(nailBed.center.y) ? nailBed.center.y : fallback.center.y,
    },
    confidence: clamp(Number(nailBed.confidence || fallback.confidence), 0, 1),
  };
}

function drawProfileNailMask(ctx, cx, cy, width, height, profile) {
  ctx.save();
  ctx.translate(cx, cy);
  createProfileNailPath(ctx, width, height, profile.shape);
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fill();
  ctx.globalCompositeOperation = "destination-in";
  const fade = ctx.createLinearGradient(0, height * 0.5, 0, -height * 0.5);
  fade.addColorStop(0, `rgba(255,255,255,${1 - profile.rootFade})`);
  fade.addColorStop(0.16, "rgba(255,255,255,1)");
  fade.addColorStop(1, "rgba(255,255,255,1)");
  ctx.fillStyle = fade;
  ctx.fillRect(-width, -height, width * 2, height * 2);
  ctx.restore();
}

function createProfileNailPath(ctx, width, height, shape) {
  if (shape === "almond") {
    const w = width / 2;
    const h = height / 2;
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.bezierCurveTo(w * 0.88, -h * 0.68, w * 0.86, h * 0.42, w * 0.42, h * 0.78);
    ctx.bezierCurveTo(w * 0.16, h, -w * 0.16, h, -w * 0.42, h * 0.78);
    ctx.bezierCurveTo(-w * 0.86, h * 0.42, -w * 0.88, -h * 0.68, 0, -h);
    ctx.closePath();
    return;
  }
  if (shape === "round") {
    const w = width / 2;
    const h = height / 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.86, h * 0.95, 0, 0, Math.PI * 2);
    return;
  }
  createNailPath(ctx, width, height);
}

function drawStageAlignedSegmentedNailComposite(ctx, anchor, index, nailMask, environment) {
  const texture = getTextureForAnchor(anchor, index);
  const fallback = getStyleFallbackColor();
  const finish = texture?.finish || "gloss";
  const rect = nailMask.stageRect;
  const pad = Math.max(2, Math.min(rect.width, rect.height) * 0.08);
  const drawX = rect.x - pad;
  const drawY = rect.y - pad;
  const drawW = Math.max(8, rect.width + pad * 2);
  const drawH = Math.max(10, rect.height + pad * 2);
  const temp = getScratchCanvas(Math.ceil(drawW), Math.ceil(drawH));
  const tctx = temp.getContext("2d");
  const brightness = clamp(0.78 + environment.luminance * 0.5, 0.72, 1.18);
  const contrast = clamp(0.95 + Math.abs(environment.luminance - 0.5) * 0.18, 0.94, 1.08);

  tctx.clearRect(0, 0, temp.width, temp.height);

  const baseGradient = tctx.createLinearGradient(0, pad, 0, rect.height + pad);
  baseGradient.addColorStop(0, rgba(lightenRgb(fallback, finish === "jelly" ? 44 : 24), finish === "jelly" ? 0.68 : 0.9));
  baseGradient.addColorStop(0.5, rgba(fallback, finish === "jelly" ? 0.76 : 0.95));
  baseGradient.addColorStop(1, rgba(darkenRgb(fallback, finish === "matte" ? 18 : 36), finish === "jelly" ? 0.82 : 0.98));
  tctx.fillStyle = baseGradient;
  tctx.fillRect(0, 0, temp.width, temp.height);

  if (texture?.image) {
    tctx.save();
    tctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${finish === "matte" ? 0.94 : 1.06})`;
    tctx.globalAlpha = (finish === "jelly" ? 0.68 : 0.88) * (texture.weight || 1);
    tctx.drawImage(texture.image, pad - rect.width * 0.16, pad - rect.height * 0.1, rect.width * 1.32, rect.height * 1.2);
    tctx.restore();
  }

  tctx.globalCompositeOperation = "soft-light";
  tctx.fillStyle =
    environment.warmth >= 0
      ? `rgba(255,190,135,${environment.warmth * 0.12})`
      : `rgba(145,205,255,${Math.abs(environment.warmth) * 0.12})`;
  tctx.fillRect(0, 0, temp.width, temp.height);

  tctx.globalCompositeOperation = finish === "matte" ? "source-over" : "screen";
  const angle = ((anchor.rotation - 90) * Math.PI) / 180;
  const hx0 = pad + rect.width * (0.44 - Math.cos(angle) * 0.22);
  const hy0 = pad + rect.height * (0.28 - Math.sin(angle) * 0.22);
  const hx1 = pad + rect.width * (0.58 + Math.cos(angle) * 0.2);
  const hy1 = pad + rect.height * (0.58 + Math.sin(angle) * 0.2);
  const highlight = tctx.createLinearGradient(hx0, hy0, hx1, hy1);
  highlight.addColorStop(0, `rgba(255,255,255,${finish === "matte" ? 0.08 : 0.34})`);
  highlight.addColorStop(0.38, "rgba(255,255,255,0.1)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  tctx.fillStyle = highlight;
  tctx.fillRect(0, 0, temp.width, temp.height);

  tctx.globalCompositeOperation = "multiply";
  const rootShadow = tctx.createLinearGradient(0, pad + rect.height * 0.12, 0, pad + rect.height);
  rootShadow.addColorStop(0, "rgba(0,0,0,0)");
  rootShadow.addColorStop(1, `rgba(0,0,0,${clamp(0.1 + (1 - environment.luminance) * 0.14, 0.1, 0.24)})`);
  tctx.fillStyle = rootShadow;
  tctx.fillRect(0, 0, temp.width, temp.height);

  tctx.globalCompositeOperation = "destination-in";
  tctx.drawImage(nailMask.canvas, pad, pad, rect.width, rect.height);
  tctx.globalCompositeOperation = "source-over";
  featherAlpha(temp, Math.max(1, Math.round(Math.min(rect.width, rect.height) * 0.025)));

  const alpha = clamp(Math.min(anchor.confidence, nailMask.confidence || 0.9), 0.7, 0.96);
  ctx.save();
  ctx.globalAlpha = alpha * 0.24;
  ctx.shadowColor = `rgba(34,20,18,${clamp((environment.shadow || 0.16) + (1 - environment.luminance) * 0.08, 0.1, 0.28)})`;
  ctx.shadowBlur = Math.max(1.5, Math.min(rect.width, rect.height) * 0.04);
  ctx.shadowOffsetY = Math.max(0.6, rect.height * 0.012);
  ctx.drawImage(temp, drawX, drawY);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(temp, drawX, drawY);
  ctx.restore();
}

function getNailMaskForAnchor(anchor) {
  const now = performance.now();
  refreshStableMasks(now);
  const mask = state.segmentation.stableMasks.get(anchor.finger);
  if (!mask) {
    return null;
  }
  const maxAge = state.mode === "camera" ? STABLE_MASK_STALE_MS : state.segmentation.staleAfterMs;
  if (now - (mask.lastSeenAt || mask.timestamp || 0) > maxAge) {
    return null;
  }
  return mask;
}

function getScratchCanvas(width, height) {
  const canvas = getScratchCanvas.canvas || (getScratchCanvas.canvas = document.createElement("canvas"));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return canvas;
}

function featherAlpha(canvas, radius) {
  if (!radius) return;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const copy = new Uint8ClampedArray(image.data);
  const width = canvas.width;
  const height = canvas.height;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4 + 3;
      const alpha = copy[offset];
      if (!alpha) continue;
      const edgeDistance = Math.min(x, y, width - 1 - x, height - 1 - y);
      if (edgeDistance < radius) {
        image.data[offset] = Math.round(alpha * clamp(edgeDistance / radius, 0, 1));
      }
    }
  }
  ctx.putImageData(image, 0, 0);
}

function createNailPath(ctx, width, height) {
  const w = width / 2;
  const h = height / 2;
  ctx.beginPath();
  ctx.moveTo(0, -h);
  ctx.bezierCurveTo(w * 0.8, -h * 0.9, w * 0.92, -h * 0.22, w * 0.72, h * 0.54);
  ctx.bezierCurveTo(w * 0.58, h * 0.92, -w * 0.58, h * 0.92, -w * 0.72, h * 0.54);
  ctx.bezierCurveTo(-w * 0.92, -h * 0.22, -w * 0.8, -h * 0.9, 0, -h);
  ctx.closePath();
}

function getTextureForAnchor(anchor, index) {
  const asset = state.styleAssets.get(Number(state.selectedStyle.id));
  const texture = asset?.textures?.[anchor.finger] || asset?.textures?.[fingers[index]?.key];
  const imagePath = texture?.image || asset?.preview;
  if (!imagePath) {
    return null;
  }
  const source = texture?.source || "fallback";
  const profile = getSelectedTryOnProfile();
  const quality = getSelectedAssetQuality();
  const isLowQuality = ["heuristic", "fallback"].includes(source);
  let weight = isLowQuality ? 0.62 : 1;
  if (profile.assetPolicy === "manual_patch" && isLowQuality) {
    weight = 0.08;
  } else if (profile.assetPolicy === "seg_only" && isLowQuality) {
    weight = 0.18;
  } else if (quality.heuristicRatio >= 0.4 && isLowQuality) {
    weight = 0.18;
  }
  return {
    image: getCachedImage(imagePath),
    mask: texture?.mask ? getCachedMask(texture.mask) : null,
    finish: texture?.finish || asset?.finish || state.selectedStyle.finish || "gloss",
    confidence: Number(texture?.confidence || 0.62),
    source,
    weight,
  };
}

function getCachedImage(src) {
  const entry = state.textureCache.get(src);
  if (entry?.image) {
    return entry.image;
  }
  if (entry?.promise) {
    return null;
  }
  const image = new Image();
  image.crossOrigin = "anonymous";
  const promise = new Promise((resolve, reject) => {
    image.onload = () => {
      state.textureCache.set(src, { image });
      renderOverlay();
      resolve(image);
    };
    image.onerror = reject;
  });
  state.textureCache.set(src, { promise });
  image.src = src;
  return null;
}

function preloadStyleTextures(style) {
  const asset = state.styleAssets.get(Number(style.id));
  if (!asset?.textures) {
    return;
  }
  Object.values(asset.textures).forEach((texture) => {
    const descriptor = typeof texture === "string" ? { image: texture, mask: texture } : texture;
    if (descriptor.image) getCachedImage(descriptor.image);
    if (descriptor.mask) getCachedMask(descriptor.mask);
  });
}

function getCachedMask(src) {
  const entry = state.maskCache.get(src);
  if (entry?.image) {
    return entry.image;
  }
  if (entry?.promise) {
    return null;
  }
  const image = new Image();
  image.crossOrigin = "anonymous";
  const promise = new Promise((resolve, reject) => {
    image.onload = () => {
      state.maskCache.set(src, { image });
      renderOverlay();
      resolve(image);
    };
    image.onerror = reject;
  });
  state.maskCache.set(src, { promise });
  image.src = src;
  return null;
}

function sampleEnvironment(anchors) {
  const fallback = { rgb: [218, 178, 155], luminance: 0.68, warmth: 0.12 };
  const metrics = getMediaMetrics();
  if (!metrics) {
    return fallback;
  }
  const source = state.mode === "camera" ? els.video : els.photo;
  const canvas = sampleEnvironment.canvas || (sampleEnvironment.canvas = document.createElement("canvas"));
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const samples = [];
  try {
    anchors.slice(0, 5).forEach((anchor) => {
      const point = stagePercentToMedia(anchor.x, anchor.y, metrics);
      const radius = Math.max(10, (anchor.width / 100) * metrics.stageW * 1.25);
      const sx = clamp(point.x - radius, 0, metrics.mediaW - 1);
      const sy = clamp(point.y - radius, 0, metrics.mediaH - 1);
      const sw = clamp(radius * 2, 1, metrics.mediaW - sx);
      const sh = clamp(radius * 2, 1, metrics.mediaH - sy);
      ctx.clearRect(0, 0, 16, 16);
      ctx.drawImage(source, sx, sy, sw, sh, 0, 0, 16, 16);
      const data = ctx.getImageData(0, 0, 16, 16).data;
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count += 1;
      }
      samples.push([r / count, g / count, b / count]);
    });
  } catch (error) {
    return fallback;
  }

  if (!samples.length) {
    return fallback;
  }
  const rgb = [0, 1, 2].map((channel) => Math.round(samples.reduce((sum, sample) => sum + sample[channel], 0) / samples.length));
  const luminance = clamp((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255, 0, 1);
  const warmth = clamp(((rgb[0] - rgb[2]) / 255) * 1.6, -1, 1);
  return { rgb, luminance, warmth };
}

function sampleAnchorEnvironment(anchor) {
  const fallback = { rgb: [218, 178, 155], luminance: 0.68, warmth: 0.12, shadow: 0.16 };
  const metrics = getMediaMetrics();
  if (!metrics) {
    return fallback;
  }
  const source = state.mode === "camera" ? els.video : els.photo;
  const canvas = sampleAnchorEnvironment.canvas || (sampleAnchorEnvironment.canvas = document.createElement("canvas"));
  canvas.width = 18;
  canvas.height = 18;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  try {
    const point = stagePercentToMedia(anchor.x, anchor.y, metrics);
    const radius = Math.max(10, (anchor.width / 100) * metrics.stageW * 1.5);
    const sx = clamp(point.x - radius, 0, metrics.mediaW - 1);
    const sy = clamp(point.y - radius, 0, metrics.mediaH - 1);
    const sw = clamp(radius * 2, 1, metrics.mediaW - sx);
    const sh = clamp(radius * 2.2, 1, metrics.mediaH - sy);
    ctx.clearRect(0, 0, 18, 18);
    ctx.drawImage(source, sx, sy, sw, sh, 0, 0, 18, 18);
    const data = ctx.getImageData(0, 0, 18, 18).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let topLum = 0;
    let bottomLum = 0;
    let count = 0;
    for (let y = 0; y < 18; y += 1) {
      for (let x = 0; x < 18; x += 1) {
        const offset = (y * 18 + x) * 4;
        const lum = 0.2126 * data[offset] + 0.7152 * data[offset + 1] + 0.0722 * data[offset + 2];
        r += data[offset];
        g += data[offset + 1];
        b += data[offset + 2];
        if (y < 9) topLum += lum;
        else bottomLum += lum;
        count += 1;
      }
    }
    const rgb = [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
    const luminance = clamp((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255, 0, 1);
    const warmth = clamp(((rgb[0] - rgb[2]) / 255) * 1.6, -1, 1);
    const shadow = clamp((topLum / 162 - bottomLum / 162) / 255 + 0.16, 0.08, 0.34);
    return { rgb, luminance, warmth, shadow };
  } catch (error) {
    return fallback;
  }
}

function stagePercentToMedia(xPct, yPct, metrics) {
  const stageX = (xPct / 100) * metrics.stageW;
  const stageY = (yPct / 100) * metrics.stageH;
  let x = ((stageX - metrics.offsetX) / metrics.displayW) * metrics.mediaW;
  const y = ((stageY - metrics.offsetY) / metrics.displayH) * metrics.mediaH;
  if (state.mode === "camera" && els.mirrorVideo.checked) {
    x = metrics.mediaW - x;
  }
  return { x: clamp(x, 0, metrics.mediaW - 1), y: clamp(y, 0, metrics.mediaH - 1) };
}

function hexToRgb(hex) {
  if (!hex || typeof hex !== "string") {
    return null;
  }
  const value = hex.replace("#", "");
  if (value.length !== 6) {
    return null;
  }
  return [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16));
}

function rgba(rgb, alpha) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

function lightenRgb(rgb, amount) {
  return rgb.map((value) => clamp(Math.round(value + amount), 0, 255));
}

function darkenRgb(rgb, amount) {
  return rgb.map((value) => clamp(Math.round(value - amount), 0, 255));
}

function renderSelectedStyle() {
  const style = state.selectedStyle;
  const preview = getStylePreview(style);
  els.selectedStyle.innerHTML = `
    <img src="${preview}" alt="${style.name}" data-fallback-src="${style.image}" onerror="this.onerror=null;this.src=this.dataset.fallbackSrc" />
    <div class="selected-copy">
      <strong>${style.name}</strong>
      <span>${state.assetsReady ? "原图预览 / 试穿素材已就绪" : "等待素材加载"} / ${style.tags.join(" / ")}</span>
    </div>
  `;
}

function renderStyles() {
  els.styleGrid.innerHTML = styles
    .map((style) => {
      const fallback = `linear-gradient(145deg, ${style.palette[1]}, ${style.palette[0]}, ${style.palette[2]})`;
      const active = style.id === state.selectedStyle.id ? " is-active" : "";
      const preview = getStylePreview(style);
      return `
        <button class="style-tile${active}" type="button" data-style-id="${style.id}" style="--swatch:${style.palette[0]};--tile-fallback:${fallback}">
          <span class="style-tile-image">
            <img src="${preview}" alt="${style.name}" loading="lazy" data-fallback-src="${style.image}" onerror="this.onerror=null;this.src=this.dataset.fallbackSrc" />
          </span>
          <span class="style-meta">
            <span class="style-title">${style.name}</span>
            <span class="tag-row">${style.tags.map((tag) => `<span>${tag}</span>`).join("")}</span>
          </span>
        </button>
      `;
    })
    .join("");
  window.requestAnimationFrame(updateStyleFocus);
}

function getStylePreview(style) {
  const id = String(style.id).padStart(2, "0");
  return `./assets/source-cache/style_${id}.png`;
}

function updateStyleFocus() {
  const tiles = Array.from(els.styleGrid.querySelectorAll(".style-tile"));
  if (!tiles.length) return;
  const railRect = els.styleGrid.getBoundingClientRect();
  const center = railRect.left + railRect.width / 2;
  let focused = tiles[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  tiles.forEach((tile) => {
    const rect = tile.getBoundingClientRect();
    const tileCenter = rect.left + rect.width / 2;
    const distance = Math.abs(tileCenter - center);
    if (distance < bestDistance) {
      focused = tile;
      bestDistance = distance;
    }
  });
  tiles.forEach((tile) => {
    tile.classList.toggle("is-focus", tile === focused);
  });
}

function bindStyleRailMotion() {
  let focusFrame = null;
  const scheduleFocus = () => {
    if (focusFrame) return;
    focusFrame = window.requestAnimationFrame(() => {
      focusFrame = null;
      updateStyleFocus();
    });
  };
  els.styleGrid.addEventListener("scroll", scheduleFocus, { passive: true });
  els.styleGrid.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }
      event.preventDefault();
      els.styleGrid.scrollBy({ left: event.deltaY * 1.2, behavior: "smooth" });
      scheduleFocus();
    },
    { passive: false },
  );
}

function selectStyle(styleId) {
  const next = styles.find((style) => style.id === Number(styleId));
  if (!next) return;
  state.selectedStyle = next;
  window.reportStyleSelected && window.reportStyleSelected({ id: next.id, name: next.name, tags: next.tags });
  preloadStyleTextures(next);
  renderSelectedStyle();
  renderStyles();
  renderOverlay();
  if (state.mode === "photo" && state.photoReady) {
    resetPhotoResult({ keepMessage: true });
    setPhotoJobState("preview", "款式已切换", "已选择新的美甲款式，点击生成 AI 试戴。", 0.22);
  }
  if (state.anchors.length) {
    setTrackingState("tracked", "试穿已贴合", `${next.name} 已应用到 5 个指甲`);
  } else {
    setTrackingState(state.trackingState, state.mode === "camera" ? "等待手部" : "已选款式", "识别到手部后会自动试穿");
  }
  updateGenerateButtonState();
}

function loadPhoto(src, statusText = "图片试戴", options = {}) {
  stopVideoLoop();
  state.lastImageSrc = src;
  state.currentPhotoFile = options.file || null;
  state.photoReady = false;
  state.anchors = [];
  resetPhotoPreviewReadiness();
  clearSegmentationMasks();
  state.smoothedAnchors = null;
  resetPhotoResult();
  syncMediaState();
  els.photo.src = src;
  els.photo.onload = () => {
    setMode("photo");
    markMediaReady(true);
    state.photoPreviewReady = true;
    setPhotoJobState("preview", "手图已就绪", "可以直接生成 AI 试戴；照片模式不再等待本地识别。", 0.16);
    setTrackingState("detecting", statusText, "正在识别手型并定位指甲");
    updateGenerateButtonState();
    setTrackingState("ready", "手图已就绪", "可直接生成 AI 试戴，本地识别不再阻塞流程");
  };
  els.photo.onerror = () => {
    setMode("photo");
    markMediaReady(false);
    state.anchors = [];
    renderOverlay();
    setPhotoJobState("failed", "图片加载失败", "请换一张清晰的手部图片。", 0);
    setTrackingState("lost", "图片加载失败", "请换一张清晰手部图片");
  };
}

async function detectCurrentPhoto() {
  if (!state.photoReady || state.mode !== "photo") {
    return;
  }
  if (!state.tracker) {
    state.anchors = [];
    renderOverlay();
    if (state.modelState === "unsupported") {
      setTrackingState("unsupported", "识别模型未就绪", "请检查本地模型资源");
    } else {
      setTrackingState("loading", "识别模型准备中", "AI 生成已可用，本地识别稍后自动补充");
    }
    return;
  }

  try {
    await ensureTrackerMode("IMAGE");
    setTrackingState("detecting", "正在识别手型", "图片会自动定位 5 个指甲");
    const result = state.tracker.detect(els.photo);
    consumeDetectionResult(result, "IMAGE");
  } catch (error) {
    state.anchors = [];
    renderOverlay();
    setTrackingState("lost", "本地识别失败", "仍可直接生成 AI 试戴，或换一张更清晰的手图");
    console.warn("Image detection failed", error);
  }
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setTrackingState("unsupported", "摄像头不可用", "当前浏览器不支持 getUserMedia");
    return;
  }

  try {
    setMode("camera");
    setTrackingState("detecting", "正在请求摄像头", "请允许浏览器访问摄像头");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { ideal: 960 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 30 },
      },
    });
    state.stream = stream;
    els.video.srcObject = stream;
    await els.video.play();
    setMode("camera");
    markMediaReady(true);
    state.anchors = [];
    state.smoothedAnchors = null;
    renderOverlay();
    if (state.tracker) {
      await ensureTrackerMode("VIDEO");
      startVideoLoop();
    } else {
      setTrackingState(state.modelState === "unsupported" ? "unsupported" : "loading", "识别模型未就绪", "摄像头已开启，等待模型资源");
    }
  } catch (error) {
    setTrackingState("lost", "摄像头授权失败", "请在浏览器中允许摄像头权限");
    console.warn("Camera start failed", error);
  }
}

function stopCamera() {
  stopVideoLoop();
  if (state.stream) {
    state.stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
  }
  els.video.srcObject = null;
  if (state.mode === "camera") {
    markMediaReady(false);
  } else {
    state.videoReady = false;
  }
  state.anchors = [];
  clearSegmentationMasks();
  state.smoothedAnchors = null;
  renderOverlay();
  setTrackingState(state.mode === "camera" ? "ready" : state.trackingState, state.mode === "camera" ? "视频已关闭" : "已关闭", "可以重新打开摄像头或切换到图片试穿");
}

function captureFrame() {
  if (state.mode !== "camera" || !els.video.videoWidth) {
    setStatus(state.photoReady ? "图片已就绪" : "暂无画面");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = els.video.videoWidth;
  canvas.height = els.video.videoHeight;
  const context = canvas.getContext("2d");
  if (els.mirrorVideo.checked) {
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
  }
  context.drawImage(els.video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob((blob) => {
    loadPhoto(canvas.toDataURL("image/png"), "已定格", { file: blob });
  }, "image/png");
}

function startVideoLoop() {
  stopVideoLoop();
  const loop = async () => {
    if (state.mode !== "camera" || !state.videoReady || !state.tracker) {
      return;
    }
    if (!state.isDetectingFrame && els.video.readyState >= 2 && els.video.currentTime !== state.lastVideoTime) {
      state.isDetectingFrame = true;
      state.lastVideoTime = els.video.currentTime;
      try {
        await ensureTrackerMode("VIDEO");
        const result = state.tracker.detectForVideo(els.video, performance.now());
        consumeDetectionResult(result, "VIDEO");
      } catch (error) {
        setTrackingState("lost", "实时识别失败", "请保持手部完整入镜");
        console.warn("Video detection failed", error);
      } finally {
        state.isDetectingFrame = false;
      }
    }
    state.animationFrame = requestAnimationFrame(loop);
  };
  state.animationFrame = requestAnimationFrame(loop);
}

function stopVideoLoop() {
  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
    state.animationFrame = null;
  }
  state.isDetectingFrame = false;
  state.segmentation.workerPending = false;
  state.segmentation.pendingFrames.clear();
}

function consumeDetectionResult(result, mode) {
  const primaryHand = pickPrimaryHand(result);
  if (!primaryHand) {
    state.anchors = [];
    clearSegmentationMasks();
    renderOverlay();
    updateProfile(null);
    setTrackingState("lost", "请把手掌完整放入画面中央", "未识别到清晰手部");
    return;
  }

  if (primaryHand.area < 0.025 || primaryHand.confidence < 0.42) {
    state.anchors = [];
    clearSegmentationMasks();
    renderOverlay();
    updateProfile(null);
    setTrackingState("lost", "光线不足或手部不完整", "请靠近镜头并露出完整指尖");
    return;
  }

  const profile = buildHandProfile(primaryHand);
  const anchors = buildNailAnchors(primaryHand.landmarks, profile);
  if (anchors.length !== 5) {
    state.anchors = [];
    clearSegmentationMasks();
    renderOverlay();
    updateProfile(null);
    setTrackingState("lost", "指尖定位不完整", "请展开手指再试一次");
    return;
  }

  state.handProfile = profile;
  state.anchors = mode === "VIDEO" ? smoothAnchors(anchors) : anchors;
  scheduleNailSegmentation(primaryHand.landmarks, state.anchors, mode);
  renderOverlay();
  updateProfile(profile);
  const segReady = state.segmentation.state === "ready" || state.segmentation.state === "running";
  setTrackingState("tracked", segReady ? "精准分割中" : "试穿已贴合", `${profile.handedness} / ${profile.shapeLabel} / ${segReady ? "像素级指甲 mask" : "分割模型未就绪，使用基础贴合"}`);
  if (mode === "IMAGE") {
    state.photoPreviewReady = true;
    setPhotoJobState("preview", "本地预览已完成", "可以继续点击生成 AI 试戴。", 0.22);
    updateGenerateButtonState();
  }
}

function scheduleNailSegmentation(rawLandmarks, anchors, mode) {
  if (!state.segmentation.session || state.segmentation.state === "missing" || state.segmentation.state === "failed") {
    return;
  }
  const now = performance.now();
  const minInterval = mode === "VIDEO" ? state.segmentation.videoIntervalMs : 0;
  if (state.segmentation.running || now - state.segmentation.lastRunAt < minInterval) {
    return;
  }
  if (mode === "VIDEO" && state.segmentation.workerReady && !state.segmentation.workerFailed) {
    scheduleWorkerNailSegmentation(rawLandmarks, anchors, now);
    return;
  }
  state.segmentation.running = true;
  state.segmentation.state = "running";
  state.segmentation.lastRunAt = now;
  updateModelBadge();
  runNailSegmentation(rawLandmarks, anchors, mode)
    .then((masks) => {
      if (masks.length) {
        acceptSegmentationMasks(masks, `${masks.length} 个指甲已精准分割`);
      } else {
        state.segmentation.state = "ready";
        updateModelBadge();
      }
    })
    .catch((error) => {
      state.segmentation.state = "failed";
      clearSegmentationMasks();
      updateModelBadge();
      console.warn("Nail segmentation inference failed", error);
    })
    .finally(() => {
      state.segmentation.running = false;
    });
}

async function scheduleWorkerNailSegmentation(rawLandmarks, anchors, now) {
  if (state.segmentation.workerPending || !window.createImageBitmap) {
    return;
  }
  const metrics = getMediaMetrics();
  if (!metrics || !els.video.videoWidth || !els.video.videoHeight) {
    return;
  }
  const frameId = state.segmentation.frameId + 1;
  state.segmentation.frameId = frameId;
  state.segmentation.workerPending = true;
  state.segmentation.lastRunAt = now;
  state.segmentation.state = "running";
  updateModelBadge();
  state.segmentation.pendingFrames.set(frameId, {
    anchors: anchors.map((anchor) => ({ ...anchor })),
    metrics: { ...metrics },
  });
  try {
    const bitmap = await createImageBitmap(els.video);
    state.segmentation.worker.postMessage(
      {
        type: "segmentFrame",
        frameId,
        bitmap,
        rawLandmarks: rawLandmarks.map((point) => ({ x: point.x, y: point.y, z: point.z || 0 })),
        mediaWidth: metrics.mediaW,
        mediaHeight: metrics.mediaH,
      },
      [bitmap],
    );
  } catch (error) {
    state.segmentation.workerPending = false;
    state.segmentation.pendingFrames.delete(frameId);
    console.warn("Unable to submit frame to nail segmentation worker", error);
  }
}

function acceptSegmentationMasks(masks, hint) {
  const now = performance.now();
  let accepted = 0;
  masks.forEach((mask) => {
    const anchor = state.anchors.find((candidate) => candidate.finger === mask.finger);
    const previous = state.segmentation.stableMasks.get(mask.finger);
    const quality = scoreNailMaskQuality(mask, previous, anchor);
    if (!quality.accept) {
      return;
    }
    const blended = blendStableMask(previous, mask, quality, now);
    state.segmentation.stableMasks.set(mask.finger, blended);
    if (blended.nailBed) {
      state.segmentation.stableNailBeds.set(mask.finger, blended.nailBed);
    }
    accepted += 1;
  });
  refreshStableMasks(now);
  state.segmentation.state = "ready";
  updateModelBadge();
  renderOverlay();
  setTrackingState("tracked", "试穿已贴合", accepted ? hint : "分割稳定中，保留上一帧贴合");
  updateGenerateButtonState();
}

async function submitPhotoTryonJob() {
  if (!state.photoReady || state.mode !== "photo") {
    setPhotoJobState("failed", "请先上传手图", "上传一张清晰的手部照片后再生成 AI 试戴。", 0);
    return;
  }
  if (state.photoJobAbort) {
    state.photoJobAbort.abort();
  }
  const controller = new AbortController();
  state.photoJobAbort = controller;
  try {
    setPhotoJobState("queued", "正在准备 AI 生成", "正在连接本机浏览器执行器，并准备原图与款式参考。", 0.14);
    const form = await buildPhotoTryonFormData();
    const response = await fetch(`${PHOTO_TRYON_SERVICE_URL}/api/photo-tryon/jobs`, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`生成服务返回 ${response.status}`);
    }
    const job = await response.json();
    await pollPhotoTryonJob(job.jobId, controller);
  } catch (error) {
    if (error.name === "AbortError") {
      setPhotoJobState("idle", "已取消生成", "当前仍保留快速试戴预览。", 0);
      return;
    }
    console.warn("Photo try-on service unavailable", error);
    setPhotoJobState("failed", "AI 生成服务未连接", `请先启动本机服务：python -m uvicorn photo_tryon_service.server:app --host 127.0.0.1 --port 8765。当前仍可查看快速预览。`, 0);
  } finally {
    if (state.photoJobAbort === controller) {
      state.photoJobAbort = null;
    }
  }
}

async function pollPhotoTryonJob(jobId, controller) {
  let lastProgress = 0.18;
  while (!controller.signal.aborted) {
    const response = await fetch(`${PHOTO_TRYON_SERVICE_URL}/api/photo-tryon/jobs/${jobId}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`任务查询失败 ${response.status}`);
    }
    const job = await response.json();
    const progress = clamp(Number(job.progress || lastProgress), lastProgress, 1);
    lastProgress = progress;
    if (job.state === "done") {
      showPhotoTryonResult(job);
      return;
    }
    if (job.state === "login_required") {
      state.photoTryonResult = {
        ...(state.photoTryonResult || {}),
        jobId: job.jobId,
        resultUrl: absoluteServiceUrl(job.resultUrl || job.previewUrl),
        previewUrl: absoluteServiceUrl(job.previewUrl || job.resultUrl),
        styleId: state.selectedStyle.id,
      };
      setPhotoJobState("login_required", "需要完成一次 ChatGPT 登录授权", "已打开浏览器窗口；登录完成后回到本页点击“我已登录，继续”。", progress || 0.52);
      return;
    }
    if (job.state === "failed") {
      // 若有 Canvas 快速预览，展示它而不是直接报错
      if (job.previewUrl) {
        showPhotoTryonResult({
          ...job,
          resultUrl: absoluteServiceUrl(job.previewUrl),
          previewUrl: absoluteServiceUrl(job.previewUrl),
          resultTier: "quick_preview",
          message: "ChatGPT 生成超时，已显示 Canvas 快速预览",
          fallbackReason: job.error || job.message,
        });
      } else {
        setPhotoJobState("failed", "AI 生成失败", job.error || job.message || "请检查本机服务、ChatGPT 登录状态或输入图片。", progress);
      }
      return;
    }
    setPhotoJobState(job.state || "generating", job.message || "AI 生成中", "请保持页面打开；首次使用可能需要完成一次 ChatGPT 登录。", progress || 0.28);
    await delay(1200);
  }
}

function showPhotoTryonResult(job) {
  const cacheKey = `${job.jobId || "job"}-${job.elapsedMs || Date.now()}`;
  const resultUrl = cacheBustUrl(absoluteServiceUrl(job.resultUrl || job.previewUrl), cacheKey);
  const previewUrl = cacheBustUrl(absoluteServiceUrl(job.previewUrl || job.resultUrl), cacheKey);
  const isChatGptResult = job.resultTier === "chatgpt_image2";
  const isLocalAi = job.resultTier === "local_ai";
  state.photoTryonResult = {
    jobId: job.jobId,
    originalUrl: state.lastImageSrc,
    previewUrl,
    resultUrl,
    styleId: state.selectedStyle.id,
    elapsedMs: job.elapsedMs || 0,
    message: job.message || "AI 试戴结果已完成",
    provider: job.provider || "deterministic_preview",
    resultTier: job.resultTier || "quick_preview",
  };
  window.reportGenerationCompleted && window.reportGenerationCompleted({
    styleId: state.selectedStyle.id,
    styleName: state.selectedStyle.name,
    durationMs: job.elapsedMs || 0,
    provider: job.provider || "unknown",
    resultTier: job.resultTier || "quick_preview",
  });
  els.photoDownload.href = resultUrl;
  els.photoResultCaption.textContent = isChatGptResult ? "ChatGPT 生成结果" : isLocalAi ? "本地 AI 结果" : "快速预览";
  showGeneratedComparison(resultUrl);
  const tierText = isChatGptResult ? "ChatGPT Image 2" : isLocalAi ? "本地 SDXL" : `快速预览兜底${job.fallbackReason ? ` / ${job.fallbackReason}` : ""}`;
  els.photoResultMeta.textContent = `${state.selectedStyle.name} / ${Math.round((job.elapsedMs || 0) / 1000)} 秒 / ${tierText}`;
  els.photoResultSection.classList.remove("is-hidden");
  setPhotoJobState("done", isChatGptResult ? "生成完成" : "快速预览兜底", job.message || "可以查看前后对比并下载 PNG。", 1);
}

async function resumeChatgptAutomation() {
  const jobId = state.photoTryonResult?.jobId;
  if (!jobId) {
    setPhotoJobState("failed", "无法继续", "当前没有可继续的生成任务，请重新生成。", 0);
    return;
  }
  const controller = new AbortController();
  state.photoJobAbort = controller;
  try {
    setPhotoJobState("queued", "正在继续生成", "正在复用已登录的 ChatGPT 浏览器会话。", 0.56);
    const response = await fetch(`${PHOTO_TRYON_SERVICE_URL}/api/photo-tryon/jobs/${jobId}/run-browser`, {
      method: "POST",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`继续生成失败 ${response.status}`);
    }
    await pollPhotoTryonJob(jobId, controller);
  } catch (error) {
    if (error.name === "AbortError") {
      setPhotoJobState("idle", "已取消生成", "当前仍保留快速试戴预览。", 0);
      return;
    }
    console.warn("Unable to resume ChatGPT automation", error);
    setPhotoJobState("failed", "继续生成失败", "请确认 ChatGPT 登录已完成，或重新生成。", 0.52);
  } finally {
    if (state.photoJobAbort === controller) {
      state.photoJobAbort = null;
    }
  }
}

async function buildPhotoTryonFormData() {
  const blob = await getCurrentPhotoBlob();
  const metadata = buildPhotoTryonMetadata();
  const form = new FormData();
  form.append("handImage", blob, "hand.png");
  form.append("styleId", String(state.selectedStyle.id));
  form.append("anchorsJson", JSON.stringify(metadata.anchors));
  form.append("masksJson", JSON.stringify(metadata.masks));
  form.append("qualityPreset", "browser_chatgpt_image2");
  return form;
}

function buildPhotoTryonMetadata() {
  const metrics = getMediaMetrics();
  if (!metrics) {
    return { anchors: [], masks: [] };
  }
  const scale = metrics.displayW / Math.max(1, metrics.mediaW);
  const anchors = state.anchors.map((anchor) => {
    const center = stagePercentToMedia(anchor.x, anchor.y, metrics);
    return {
      finger: anchor.finger,
      x: center.x,
      y: center.y,
      width: ((anchor.width / 100) * metrics.stageW) / Math.max(0.001, scale),
      height: ((anchor.height / 100) * metrics.stageH) / Math.max(0.001, scale),
      rotation: anchor.rotation,
      confidence: anchor.confidence,
    };
  });
  const masks = refreshStableMasks().map((mask) => ({
    finger: mask.finger,
    rel: mask.rel || null,
    nailBed: mask.nailBed || null,
    confidence: mask.confidence || 0,
    areaRatio: mask.areaRatio || 0,
    source: mask.source || "seg",
  }));
  return {
    mediaWidth: metrics.mediaW,
    mediaHeight: metrics.mediaH,
    anchors,
    masks,
  };
}

async function getCurrentPhotoBlob() {
  if (state.currentPhotoFile) {
    return state.currentPhotoFile;
  }
  const canvas = document.createElement("canvas");
  canvas.width = els.photo.naturalWidth;
  canvas.height = els.photo.naturalHeight;
  const context = canvas.getContext("2d");
  context.drawImage(els.photo, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("无法读取当前手图"));
    }, "image/png");
  });
}

function absoluteServiceUrl(path) {
  if (!path) return "";
  return path.startsWith("http") ? path : `${PHOTO_TRYON_SERVICE_URL}${path}`;
}

function cacheBustUrl(url, key = Date.now()) {
  if (!url) return "";
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}t=${encodeURIComponent(key)}`;
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function checkPhotoServiceHealth() {
  try {
    const response = await fetch(`${PHOTO_TRYON_SERVICE_URL}/api/photo-tryon/health`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const health = await response.json();
    if (state.photoJobState === "idle") {
      const deepseekText = health.deepseekConfigured ? "DeepSeek 辅助已启用" : "使用固定生成策略";
      let browserText = "浏览器执行器已就绪";
      if (!health.playwrightDriverReady) {
        browserText =
          health.recommendedAction === "install_playwright"
            ? "缺少 Playwright，请安装生成服务依赖"
            : "需要通过启动脚本提升权限重启生成服务";
      }
      setPhotoJobState("idle", "AI 生成服务已连接", `${browserText}；${deepseekText}。`, 0);
      return;
    }
    if (state.photoJobState === "idle") {
      const deepseekText = health.deepseekConfigured ? "DeepSeek 辅助已启用" : "使用固定生成策略";
      const browserText = health.browserAutomationReady ? "浏览器执行器已就绪" : "缺少 Playwright，生成会降级为快速预览";
      setPhotoJobState("idle", "AI 生成服务已连接", `${browserText}；${deepseekText}。`, 0);
    }
  } catch (_) {
    if (state.photoJobState === "idle") {
      setPhotoJobState("idle", "AI 生成服务未连接", "启动本机服务后可自动生成高保真结果；当前仍可使用快速预览。", 0);
    }
  }
}

function scoreNailMaskQuality(mask, previous, anchor) {
  if (!anchor || !mask?.rel) {
    return { accept: false, score: 0 };
  }
  const rel = mask.rel;
  const confidence = clamp(Number(mask.confidence || 0), 0, 1);
  const area = Math.max(0.01, Math.abs(rel.width * rel.height));
  const aspect = Math.abs(rel.height / Math.max(0.01, rel.width));
  const finger = mask.finger || anchor.finger;
  const isEdgeFinger = finger === "thumb" || finger === "pinky";
  const assetQuality = getSelectedAssetQuality();
  const profile = getSelectedTryOnProfile();
  let score = confidence;
  if ((assetQuality.complexStyle || profile.assetPolicy === "seg_only") && confidence < 0.36) {
    return { accept: false, score: confidence };
  }
  if (assetQuality.needsReview && confidence < 0.44) {
    return { accept: false, score: confidence };
  }

  if (area < (isEdgeFinger ? 0.22 : 0.26) || area > (isEdgeFinger ? 2.8 : 2.35)) {
    score -= 0.34;
  }
  if (aspect < 0.58 || aspect > (isEdgeFinger ? 4.3 : 3.65)) {
    score -= 0.3;
  }
  if (Math.abs(rel.x) > (isEdgeFinger ? 0.56 : 0.46) || Math.abs(rel.y) > 0.68) {
    score -= 0.28;
  }
  if (Number.isFinite(mask.areaRatio) && (mask.areaRatio < 0.14 || mask.areaRatio > 0.92)) {
    score -= 0.18;
  }
  if (mask.nailBed) {
    const bedWidth = Math.abs(Number(mask.nailBed.rootWidth || 0));
    const bedLength = Math.abs(Number(mask.nailBed.bedLength || 0));
    const bedAspect = bedLength / Math.max(0.01, bedWidth);
    if (bedWidth < 0.28 || bedWidth > 1.38 || bedLength < 0.36 || bedLength > 1.34) {
      score -= 0.2;
    }
    if (bedAspect < 0.62 || bedAspect > (isEdgeFinger ? 3.8 : 3.25)) {
      score -= 0.16;
    }
    if (Number(mask.nailBed.confidence || 0) < 0.28) {
      score -= 0.12;
    }
  }

  if (previous?.rel) {
    const move = Math.hypot(rel.x - previous.rel.x, rel.y - previous.rel.y);
    const sizeJump =
      Math.abs(Math.log(Math.max(0.08, rel.width) / Math.max(0.08, previous.rel.width))) +
      Math.abs(Math.log(Math.max(0.08, rel.height) / Math.max(0.08, previous.rel.height)));
    score -= move * 0.32 + sizeJump * 0.18;
    const maxMove = isEdgeFinger ? 0.52 : 0.42;
    if (move > maxMove && confidence < Math.max(0.62, previous.confidence + 0.12)) {
      return { accept: false, score };
    }
    if (sizeJump > 0.72 && confidence < Math.max(0.68, previous.confidence + 0.1)) {
      return { accept: false, score };
    }
  }

  const minScore = state.mode === "camera" ? 0.18 : 0.12;
  const minConfidence = state.mode === "camera" ? 0.28 : 0.2;
  return { accept: confidence >= minConfidence && score >= minScore, score: clamp(score, 0, 1) };
}

function blendStableMask(previous, mask, quality, now) {
  if (!previous || state.mode !== "camera") {
    return {
      ...mask,
      quality: quality.score,
      timestamp: now,
      lastSeenAt: now,
      source: "seg",
    };
  }
  const age = now - (previous.lastSeenAt || previous.timestamp || 0);
  const alpha = age < STABLE_MASK_HOLD_MS ? 0.22 : clamp(0.24 + quality.score * 0.32, 0.24, 0.48);
  return {
    ...mask,
    rel: lerpRel(previous.rel, mask.rel, alpha),
    stageRect: lerpRect(previous.stageRect, mask.stageRect, alpha),
    bbox: lerpRect(previous.bbox, mask.bbox, alpha),
    nailBed: lerpNailBed(previous.nailBed, mask.nailBed, alpha),
    confidence: lerp(previous.confidence || 0.5, mask.confidence || 0.5, alpha),
    quality: quality.score,
    timestamp: now,
    lastSeenAt: now,
    source: "seg",
  };
}

function refreshStableMasks(now = performance.now()) {
  const maxAge = state.mode === "camera" ? STABLE_MASK_STALE_MS : state.segmentation.staleAfterMs;
  state.segmentation.stableMasks.forEach((mask, finger) => {
    if (now - (mask.lastSeenAt || mask.timestamp || 0) > maxAge) {
      state.segmentation.stableMasks.delete(finger);
      state.segmentation.stableDimensions.delete(finger);
      state.segmentation.stableNailBeds.delete(finger);
    } else if (mask.nailBed) {
      state.segmentation.stableNailBeds.set(finger, mask.nailBed);
    }
  });
  state.segmentation.masks = state.anchors
    .map((anchor) => state.segmentation.stableMasks.get(anchor.finger))
    .filter(Boolean);
  return state.segmentation.masks;
}

function clearSegmentationMasks() {
  state.segmentation.masks = [];
  state.segmentation.stableMasks.clear();
  state.segmentation.stableDimensions.clear();
  state.segmentation.stableNailBeds.clear();
}

function lerpRel(previous, next, alpha) {
  if (!previous || !next) return next || previous || null;
  return {
    x: lerp(previous.x, next.x, alpha),
    y: lerp(previous.y, next.y, alpha),
    width: lerp(previous.width, next.width, alpha),
    height: lerp(previous.height, next.height, alpha),
  };
}

function lerpNailBed(previous, next, alpha) {
  if (!previous || !next) return next || previous || null;
  return {
    ...next,
    rootLine: {
      x1: lerp(previous.rootLine?.x1 ?? next.rootLine.x1, next.rootLine.x1, alpha),
      y1: lerp(previous.rootLine?.y1 ?? next.rootLine.y1, next.rootLine.y1, alpha),
      x2: lerp(previous.rootLine?.x2 ?? next.rootLine.x2, next.rootLine.x2, alpha),
      y2: lerp(previous.rootLine?.y2 ?? next.rootLine.y2, next.rootLine.y2, alpha),
    },
    rootWidth: lerp(previous.rootWidth || next.rootWidth, next.rootWidth, alpha),
    bedLength: lerp(previous.bedLength || next.bedLength, next.bedLength, alpha),
    center: {
      x: lerp(previous.center?.x ?? next.center.x, next.center.x, alpha),
      y: lerp(previous.center?.y ?? next.center.y, next.center.y, alpha),
    },
    confidence: lerp(previous.confidence || 0.5, next.confidence || 0.5, alpha),
  };
}

function lerpRect(previous, next, alpha) {
  if (!previous || !next) return next || previous || null;
  return {
    x: lerp(previous.x, next.x, alpha),
    y: lerp(previous.y, next.y, alpha),
    width: lerp(previous.width, next.width, alpha),
    height: lerp(previous.height, next.height, alpha),
  };
}

async function runNailSegmentation(rawLandmarks, anchors, mode) {
  const metrics = getMediaMetrics();
  if (!metrics || !state.segmentation.session) {
    return [];
  }
  const source = mode === "VIDEO" ? els.video : els.photo;
  const roi = buildHandRoi(rawLandmarks, metrics);
  const prepared = prepareSegmentationInput(source, roi, state.segmentation.inputSize);
  const tensor = new window.ort.Tensor("float32", prepared.data, [
    1,
    3,
    state.segmentation.inputSize,
    state.segmentation.inputSize,
  ]);
  const outputs = await state.segmentation.session.run({ [state.segmentation.inputName]: tensor });
  const detections = parseYoloSegmentationOutputs(outputs, prepared, roi);
  return assignMasksToFingers(detections, anchors, metrics);
}

function buildHandRoi(rawLandmarks, metrics) {
  const xs = rawLandmarks.map((point) => point.x * metrics.mediaW);
  const ys = rawLandmarks.map((point) => point.y * metrics.mediaH);
  let x0 = Math.min(...xs);
  let y0 = Math.min(...ys);
  let x1 = Math.max(...xs);
  let y1 = Math.max(...ys);
  const pad = Math.max(x1 - x0, y1 - y0) * 0.32;
  x0 = clamp(x0 - pad, 0, metrics.mediaW - 1);
  y0 = clamp(y0 - pad, 0, metrics.mediaH - 1);
  x1 = clamp(x1 + pad, x0 + 1, metrics.mediaW);
  y1 = clamp(y1 + pad, y0 + 1, metrics.mediaH);
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

function prepareSegmentationInput(source, roi, inputSize) {
  const canvas = prepareSegmentationInput.canvas || (prepareSegmentationInput.canvas = document.createElement("canvas"));
  canvas.width = inputSize;
  canvas.height = inputSize;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, inputSize, inputSize);
  ctx.fillStyle = "rgb(114,114,114)";
  ctx.fillRect(0, 0, inputSize, inputSize);
  const scale = Math.min(inputSize / roi.width, inputSize / roi.height);
  const drawW = roi.width * scale;
  const drawH = roi.height * scale;
  const padX = (inputSize - drawW) / 2;
  const padY = (inputSize - drawH) / 2;
  ctx.drawImage(source, roi.x, roi.y, roi.width, roi.height, padX, padY, drawW, drawH);
  const imageData = ctx.getImageData(0, 0, inputSize, inputSize).data;
  const data = new Float32Array(3 * inputSize * inputSize);
  const plane = inputSize * inputSize;
  for (let i = 0; i < plane; i += 1) {
    data[i] = imageData[i * 4] / 255;
    data[i + plane] = imageData[i * 4 + 1] / 255;
    data[i + plane * 2] = imageData[i * 4 + 2] / 255;
  }
  return { data, canvas, inputSize, scale, padX, padY };
}

function parseYoloSegmentationOutputs(outputs, prepared, roi) {
  const tensors = Object.values(outputs);
  const pred = tensors.find((tensor) => tensor.dims?.length === 3);
  const proto = tensors.find((tensor) => tensor.dims?.length === 4);
  if (!pred || !proto) {
    return [];
  }
  const protoDims = proto.dims;
  const protoC = protoDims[1];
  const protoH = protoDims[2];
  const protoW = protoDims[3];
  const candidates = decodeYoloCandidates(pred, protoC);
  const kept = nonMaxSuppression(
    candidates.filter((candidate) => candidate.score >= state.segmentation.confThreshold),
    state.segmentation.iouThreshold,
    state.segmentation.maxDetections,
  );
  return kept.map((candidate) => {
    const inputBox = {
      x0: clamp(candidate.x0, 0, prepared.inputSize),
      y0: clamp(candidate.y0, 0, prepared.inputSize),
      x1: clamp(candidate.x1, 0, prepared.inputSize),
      y1: clamp(candidate.y1, 0, prepared.inputSize),
    };
    const bbox = inputBoxToMediaBox(inputBox, prepared, roi);
    const maskCanvas = buildInstanceMaskCanvas(candidate.coefficients, proto.data, protoC, protoW, protoH, inputBox);
    return {
      bbox,
      canvas: maskCanvas,
      areaRatio: Number(maskCanvas.dataset?.areaRatio || 0),
      confidence: candidate.score,
      centroid: { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 },
    };
  });
}

function decodeYoloCandidates(pred, maskChannels) {
  const dims = pred.dims;
  const raw = pred.data;
  const transposed = dims[1] < dims[2];
  const attributes = transposed ? dims[1] : dims[2];
  const proposals = transposed ? dims[2] : dims[1];
  const classCount = Math.max(1, attributes - 4 - maskChannels);
  const candidates = [];
  const valueAt = (proposal, attr) => (transposed ? raw[attr * proposals + proposal] : raw[proposal * attributes + attr]);

  for (let i = 0; i < proposals; i += 1) {
    const cx = valueAt(i, 0);
    const cy = valueAt(i, 1);
    const w = valueAt(i, 2);
    const h = valueAt(i, 3);
    let score = 0;
    for (let c = 0; c < classCount; c += 1) {
      score = Math.max(score, valueAt(i, 4 + c));
    }
    if (score < state.segmentation.confThreshold) continue;
    const coefficients = new Float32Array(maskChannels);
    for (let m = 0; m < maskChannels; m += 1) {
      coefficients[m] = valueAt(i, 4 + classCount + m);
    }
    candidates.push({
      x0: cx - w / 2,
      y0: cy - h / 2,
      x1: cx + w / 2,
      y1: cy + h / 2,
      score,
      coefficients,
    });
  }
  return candidates;
}

function inputBoxToMediaBox(box, prepared, roi) {
  const x0 = (box.x0 - prepared.padX) / prepared.scale + roi.x;
  const y0 = (box.y0 - prepared.padY) / prepared.scale + roi.y;
  const x1 = (box.x1 - prepared.padX) / prepared.scale + roi.x;
  const y1 = (box.y1 - prepared.padY) / prepared.scale + roi.y;
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

function buildInstanceMaskCanvas(coefficients, protoData, channels, protoW, protoH, inputBox) {
  const x0 = Math.max(0, Math.floor((inputBox.x0 / state.segmentation.inputSize) * protoW));
  const y0 = Math.max(0, Math.floor((inputBox.y0 / state.segmentation.inputSize) * protoH));
  const x1 = Math.min(protoW, Math.ceil((inputBox.x1 / state.segmentation.inputSize) * protoW));
  const y1 = Math.min(protoH, Math.ceil((inputBox.y1 / state.segmentation.inputSize) * protoH));
  const width = Math.max(1, x1 - x0);
  const height = Math.max(1, y1 - y0);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(width, height);
  const plane = protoW * protoH;
  let alphaSum = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const protoIndex = (y0 + y) * protoW + (x0 + x);
      let value = 0;
      for (let c = 0; c < channels; c += 1) {
        value += coefficients[c] * protoData[c * plane + protoIndex];
      }
      const probability = 1 / (1 + Math.exp(-value));
      const offset = (y * width + x) * 4;
      image.data[offset] = 255;
      image.data[offset + 1] = 255;
      image.data[offset + 2] = 255;
      const alpha = softMaskAlpha(probability, state.segmentation.maskThreshold);
      alphaSum += alpha / 255;
      image.data[offset + 3] = alpha;
    }
  }
  ctx.putImageData(image, 0, 0);
  canvas.dataset.areaRatio = String(alphaSum / Math.max(1, width * height));
  return canvas;
}

function softMaskAlpha(probability, threshold) {
  const low = Math.max(0.06, threshold - 0.18);
  const high = Math.min(0.94, threshold + 0.18);
  const t = clamp((probability - low) / Math.max(0.01, high - low), 0, 1);
  const eased = t * t * (3 - 2 * t);
  const alpha = Math.round(eased * 255);
  return alpha < 6 ? 0 : alpha;
}

function assignMasksToFingers(detections, anchors, metrics) {
  const assigned = [];
  const used = new Set();
  anchors.forEach((anchor) => {
    const anchorPoint = { x: (anchor.x / 100) * metrics.stageW, y: (anchor.y / 100) * metrics.stageH };
    const anchorW = Math.max(1, (anchor.width / 100) * metrics.stageW);
    const anchorH = Math.max(1, (anchor.height / 100) * metrics.stageH);
    let best = null;
    detections.forEach((detection, index) => {
      if (used.has(index)) return;
      const stagePoint = mediaToStagePoint(detection.centroid, metrics);
      const distancePx = Math.hypot(stagePoint.x - anchorPoint.x, stagePoint.y - anchorPoint.y);
      const maxDistance = Math.max(anchorW * 1.65, 26);
      if (distancePx > maxDistance) return;
      const rect = mediaRectToStageRect(detection.bbox, metrics);
      if (!isPlausibleNailRect(rect, anchorW, anchorH)) return;
      if (!best || distancePx < best.distancePx) {
        best = { detection, index, stagePoint, distancePx, rect };
      }
    });
    if (!best) return;
    used.add(best.index);
    const rect = best.rect;
    const rel = stageRectToAnchorRel(rect, anchor, metrics);
    const nailBed = estimateNailBedFromMask(best.detection.canvas, rel, anchor);
    assigned.push({
      finger: anchor.finger,
      canvas: best.detection.canvas,
      bbox: best.detection.bbox,
      stageRect: rect,
      rel,
      nailBed,
      areaRatio: Number(best.detection.areaRatio || 0),
      confidence: best.detection.confidence,
      source: "seg",
      timestamp: performance.now(),
    });
  });
  return assigned;
}

function estimateNailBedFromMask(canvas, rel, anchor) {
  const width = canvas.width || 1;
  const height = canvas.height || 1;
  let rows = [];
  try {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const data = ctx.getImageData(0, 0, width, height).data;
    rows = Array.from({ length: height }, (_, y) => {
      let minX = width;
      let maxX = -1;
      for (let x = 0; x < width; x += 1) {
        if (data[(y * width + x) * 4 + 3] > 32) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
        }
      }
      const rowWidth = maxX >= minX ? maxX - minX + 1 : 0;
      return {
        width: rowWidth / width,
        center: rowWidth ? (minX + maxX) / 2 / Math.max(1, width - 1) : 0.5,
      };
    });
  } catch (_) {
    rows = [];
  }
  if (!rows.length) {
    return fallbackNailBed(rel, anchor);
  }
  const maxWidth = rows.reduce((max, row) => Math.max(max, row.width), 0);
  if (maxWidth <= 0.02) {
    return fallbackNailBed(rel, anchor);
  }
  const valid = rows.map((row, index) => ({ ...row, index })).filter((row) => row.width >= maxWidth * 0.35);
  if (!valid.length) {
    return fallbackNailBed(rel, anchor);
  }
  const tipRow = valid[0];
  const rootRow = valid[valid.length - 1];
  const rootBandStart = Math.max(0, rootRow.index - Math.max(2, Math.round(height * 0.08)));
  const rootBand = rows.slice(rootBandStart, rootRow.index + 1).filter((row) => row.width > 0);
  const rootWidthNorm = median(rootBand.map((row) => row.width)) || rootRow.width;
  const rootCenterNorm = median(rootBand.map((row) => row.center)) || rootRow.center;
  const rootY = rel.y + (rootRow.index / Math.max(1, height - 1) - 0.5) * rel.height;
  const tipY = rel.y + (tipRow.index / Math.max(1, height - 1) - 0.5) * rel.height;
  const rootCenterX = rel.x + (rootCenterNorm - 0.5) * rel.width;
  return {
    finger: anchor.finger,
    rootLine: {
      x1: rootCenterX - (rootWidthNorm * rel.width) / 2,
      y1: rootY,
      x2: rootCenterX + (rootWidthNorm * rel.width) / 2,
      y2: rootY,
    },
    rootWidth: clamp(rootWidthNorm * rel.width, rel.width * 0.52, rel.width * 1.08),
    bedLength: clamp(Math.abs(rootY - tipY), rel.height * 0.58, rel.height * 1.08),
    center: {
      x: rootCenterX,
      y: rootY - Math.abs(rootY - tipY) / 2,
    },
    rotation: anchor.rotation,
    confidence: anchor.confidence,
  };
}

function fallbackNailBed(rel, anchor) {
  const rootY = rel.y + rel.height * 0.46;
  const rootWidth = rel.width * 0.82;
  return {
    finger: anchor.finger,
    rootLine: {
      x1: rel.x - rootWidth / 2,
      y1: rootY,
      x2: rel.x + rootWidth / 2,
      y2: rootY,
    },
    rootWidth,
    bedLength: rel.height * 0.92,
    center: { x: rel.x, y: rootY - rel.height * 0.46 },
    rotation: anchor.rotation,
    confidence: anchor.confidence * 0.72,
  };
}

function isPlausibleNailRect(rect, anchorW, anchorH) {
  if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height)) return false;
  const width = Math.abs(rect.width);
  const height = Math.abs(rect.height);
  if (width < anchorW * 0.35 || height < anchorH * 0.32) return false;
  if (width > anchorW * 2.35 || height > anchorH * 2.3) return false;
  if (width * height > anchorW * anchorH * 4.2) return false;
  const aspect = height / Math.max(1, width);
  return aspect >= 0.72 && aspect <= 3.9;
}

function nonMaxSuppression(candidates, threshold, limit) {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const kept = [];
  sorted.forEach((candidate) => {
    if (kept.length >= limit) return;
    if (kept.every((other) => boxIou(candidate, other) < threshold)) {
      kept.push(candidate);
    }
  });
  return kept;
}

function boxIou(a, b) {
  const x0 = Math.max(a.x0, b.x0);
  const y0 = Math.max(a.y0, b.y0);
  const x1 = Math.min(a.x1, b.x1);
  const y1 = Math.min(a.y1, b.y1);
  const intersection = Math.max(0, x1 - x0) * Math.max(0, y1 - y0);
  const areaA = Math.max(0, a.x1 - a.x0) * Math.max(0, a.y1 - a.y0);
  const areaB = Math.max(0, b.x1 - b.x0) * Math.max(0, b.y1 - b.y0);
  return intersection / Math.max(1, areaA + areaB - intersection);
}

function pickPrimaryHand(result) {
  const landmarkSets = result?.landmarks || [];
  if (!landmarkSets.length) {
    return null;
  }

  let best = null;
  landmarkSets.forEach((landmarks, index) => {
    const xs = landmarks.map((point) => point.x);
    const ys = landmarks.map((point) => point.y);
    const area = (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
    const category = result.handednesses?.[index]?.[0] || result.handedness?.[index]?.[0] || {};
    const confidence = Number(category.score || category.confidence || 0.72);
    const handedness = category.categoryName || category.displayName || "Unknown";
    const candidate = { landmarks, area, confidence, handedness };
    if (!best || candidate.area > best.area) {
      best = candidate;
    }
  });
  return best;
}

function buildHandProfile(hand) {
  const lm = hand.landmarks;
  const palmWidth = distance(lm[5], lm[17]);
  const palmLength = distance(lm[0], lm[9]);
  const palmRatio = palmLength / Math.max(0.001, palmWidth);
  const fingerRatios = {
    thumb: distance(lm[2], lm[4]) / Math.max(0.001, palmWidth),
    index: distance(lm[5], lm[8]) / Math.max(0.001, palmWidth),
    middle: distance(lm[9], lm[12]) / Math.max(0.001, palmWidth),
    ring: distance(lm[13], lm[16]) / Math.max(0.001, palmWidth),
    pinky: distance(lm[17], lm[20]) / Math.max(0.001, palmWidth),
  };
  const avgFingerRatio =
    (fingerRatios.index + fingerRatios.middle + fingerRatios.ring + fingerRatios.pinky) / 4;
  let shapeLabel = "匀称手型";
  if (palmRatio > 1.18 || avgFingerRatio > 1.05) {
    shapeLabel = "纤长手型";
  } else if (palmRatio < 0.95 || avgFingerRatio < 0.82) {
    shapeLabel = "小巧手型";
  }
  return {
    handedness: hand.handedness === "Left" ? "左手" : hand.handedness === "Right" ? "右手" : "手部",
    shapeLabel,
    confidence: hand.confidence,
    palmRatio,
    fingerRatios,
  };
}

function buildNailAnchors(landmarks, profile) {
  const metrics = getMediaMetrics();
  if (!metrics) {
    return [];
  }

  const shapeScale = profile.shapeLabel === "纤长手型" ? 0.92 : profile.shapeLabel === "小巧手型" ? 1.08 : 1;
  return fingers.map((finger) => {
    const [baseIndex, dipIndex, tipIndex] = finger.joints;
    const base = normalizedPoint(landmarks[baseIndex]);
    const dip = normalizedPoint(landmarks[dipIndex]);
    const tip = normalizedPoint(landmarks[tipIndex]);
    const centerNorm = lerpPoint(dip, tip, finger.centerT);
    const center = mediaPointToStage(centerNorm, metrics);
    const dipStage = mediaPointToStage(dip, metrics);
    const tipStage = mediaPointToStage(tip, metrics);
    const baseStage = mediaPointToStage(base, metrics);
    const distalPx = pixelDistance(dipStage, tipStage);
    const basePx = pixelDistance(baseStage, dipStage);
    const heightPx = clamp(distalPx * finger.lengthFactor, 20, metrics.stageH * 0.18);
    const widthPx = clamp(
      Math.max(distalPx * finger.widthFactor, basePx * 0.34) * shapeScale,
      10,
      metrics.stageW * 0.11,
    );
    const vectorAngle = Math.atan2(tipStage.yPx - dipStage.yPx, tipStage.xPx - dipStage.xPx);
    return {
      finger: finger.key,
      x: clamp(center.xPct, -8, 108),
      y: clamp(center.yPct, -8, 108),
      width: clamp((widthPx / metrics.stageW) * 100, 1.6, 12),
      height: clamp((heightPx / metrics.stageH) * 100, 4.2, 18),
      rotation: radiansToDegrees(vectorAngle) + 90,
      depth: Number(tip.z || 0),
      confidence: profile.confidence,
    };
  });
}

function smoothAnchors(nextAnchors) {
  if (!state.smoothedAnchors || state.smoothedAnchors.length !== nextAnchors.length) {
    state.smoothedAnchors = nextAnchors;
    return nextAnchors;
  }

  state.smoothedAnchors = nextAnchors.map((next, index) => {
    const previous = state.smoothedAnchors[index];
    const speed = Math.hypot(next.x - previous.x, next.y - previous.y);
    const alpha = clamp(0.32 + speed * 0.08, 0.34, 0.78);
    return {
      ...next,
      x: lerp(previous.x, next.x, alpha),
      y: lerp(previous.y, next.y, alpha),
      width: lerp(previous.width, next.width, alpha),
      height: lerp(previous.height, next.height, alpha),
      rotation: lerpAngle(previous.rotation, next.rotation, alpha),
      confidence: lerp(previous.confidence, next.confidence, alpha),
    };
  });
  return state.smoothedAnchors;
}

function updateProfile(profile) {
  if (!profile) {
    state.handProfile = null;
    els.profileSummary.textContent = "等待手部进入画面";
    return;
  }
  const confidence = Math.round(profile.confidence * 100);
  els.profileSummary.textContent = `${profile.handedness} / ${profile.shapeLabel} / ${confidence}%`;
}

function getMediaMetrics() {
  const rect = els.stage.getBoundingClientRect();
  const mediaW = state.mode === "camera" ? els.video.videoWidth : els.photo.naturalWidth;
  const mediaH = state.mode === "camera" ? els.video.videoHeight : els.photo.naturalHeight;
  if (!rect.width || !rect.height || !mediaW || !mediaH) {
    return null;
  }
  const scale = Math.max(rect.width / mediaW, rect.height / mediaH);
  const displayW = mediaW * scale;
  const displayH = mediaH * scale;
  return {
    stageW: rect.width,
    stageH: rect.height,
    mediaW,
    mediaH,
    displayW,
    displayH,
    offsetX: (rect.width - displayW) / 2,
    offsetY: (rect.height - displayH) / 2,
  };
}

function normalizedPoint(point) {
  if (state.mode === "camera" && els.mirrorVideo.checked) {
    return { ...point, x: 1 - point.x };
  }
  return point;
}

function mediaPointToStage(point, metrics) {
  const xPx = metrics.offsetX + point.x * metrics.displayW;
  const yPx = metrics.offsetY + point.y * metrics.displayH;
  return {
    xPx,
    yPx,
    xPct: (xPx / metrics.stageW) * 100,
    yPct: (yPx / metrics.stageH) * 100,
  };
}

function mediaToStagePoint(point, metrics) {
  let xNorm = point.x / metrics.mediaW;
  if (state.mode === "camera" && els.mirrorVideo.checked) {
    xNorm = 1 - xNorm;
  }
  return {
    x: metrics.offsetX + xNorm * metrics.displayW,
    y: metrics.offsetY + (point.y / metrics.mediaH) * metrics.displayH,
  };
}

function mediaRectToStageRect(rect, metrics) {
  const p0 = mediaToStagePoint({ x: rect.x, y: rect.y }, metrics);
  const p1 = mediaToStagePoint({ x: rect.x + rect.width, y: rect.y + rect.height }, metrics);
  return {
    x: Math.min(p0.x, p1.x),
    y: Math.min(p0.y, p1.y),
    width: Math.abs(p1.x - p0.x),
    height: Math.abs(p1.y - p0.y),
  };
}

function stageRectToAnchorRel(rect, anchor, metrics) {
  const anchorX = (anchor.x / 100) * metrics.stageW;
  const anchorY = (anchor.y / 100) * metrics.stageH;
  const anchorW = Math.max(10, (anchor.width / 100) * metrics.stageW);
  const anchorH = Math.max(18, (anchor.height / 100) * metrics.stageH);
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;
  const angle = (-anchor.rotation * Math.PI) / 180;
  const dx = centerX - anchorX;
  const dy = centerY - anchorY;
  const localX = dx * Math.cos(angle) - dy * Math.sin(angle);
  const localY = dx * Math.sin(angle) + dy * Math.cos(angle);
  return {
    x: clamp(localX / anchorW, -1.2, 1.2),
    y: clamp(localY / anchorH, -1.2, 1.2),
    width: clamp(rect.width / anchorW, 0.72, 1.75),
    height: clamp(rect.height / anchorH, 0.72, 1.75),
  };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pixelDistance(a, b) {
  return Math.hypot(a.xPx - b.xPx, a.yPx - b.yPx);
}

function lerpPoint(a, b, t) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z || 0, b.z || 0, t),
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpAngle(a, b, t) {
  let delta = ((b - a + 540) % 360) - 180;
  return a + delta * t;
}

function median(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function radiansToDegrees(value) {
  return (value * 180) / Math.PI;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function bindEvents() {
  document.querySelectorAll(".mode-tab").forEach((button) => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
      if (button.dataset.mode === "camera" && !state.stream) {
        setTrackingState("ready", "待开启", "点击打开摄像头进行实时试穿");
      }
    });
  });

  els.uploadTrigger.addEventListener("click", () => els.photoInput.click());
  els.photoInput.addEventListener("change", (event) => {
    const [file] = event.target.files || [];
    if (!file) return;
    const src = URL.createObjectURL(file);
    loadPhoto(src, "已上传", { file });
  });

  els.generatePhoto.addEventListener("click", () => {
    submitPhotoTryonJob();
  });

  els.cancelPhotoJob.addEventListener("click", () => {
    if (state.photoJobAbort) {
      state.photoJobAbort.abort();
    }
    setPhotoJobState("idle", "已取消生成", "当前仍保留快速试戴预览。", 0);
  });

  els.photoRetry.addEventListener("click", () => {
    submitPhotoTryonJob();
  });

  els.continueChatgptLogin.addEventListener("click", () => {
    resumeChatgptAutomation();
  });

  els.styleGrid.addEventListener("click", (event) => {
    const tile = event.target.closest("[data-style-id]");
    if (!tile) return;
    selectStyle(tile.dataset.styleId);
  });
  bindStyleRailMotion();

  els.startCamera.addEventListener("click", startCamera);
  els.stopCamera.addEventListener("click", stopCamera);
  els.captureFrame.addEventListener("click", captureFrame);
  els.mirrorVideo.addEventListener("change", () => {
    els.video.classList.toggle("is-mirrored", els.mirrorVideo.checked);
    state.smoothedAnchors = null;
    clearSegmentationMasks();
  });

}

function init() {
  renderSelectedStyle();
  renderStyles();
  bindEvents();
  resetPhotoResult();
  checkPhotoServiceHealth();
  els.video.classList.toggle("is-mirrored", els.mirrorVideo.checked);
  loadNailAssets();
  initNailSegmentationModel();
  initHandModel();
  markMediaReady(false);
  updateGenerateButtonState();
  window.addEventListener("resize", renderOverlay);
}

init();
