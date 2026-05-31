let session = null;
let inputName = "images";
let inputSize = 640;
let confThreshold = 0.35;
let iouThreshold = 0.45;
let maskThreshold = 0.48;
let maxDetections = 12;

self.onmessage = async (event) => {
  const message = event.data || {};
  if (message.type === "init") {
    await initWorker(message);
    return;
  }
  if (message.type === "segmentFrame") {
    await segmentFrame(message);
  }
};

async function initWorker(message) {
  try {
    importScripts(message.ortScriptUrl || "./vendor/onnxruntime-web/ort.min.js");
    const metadata = message.metadata || {};
    inputName = metadata.inputName || inputName;
    inputSize = Number(metadata.inputSize || inputSize);
    confThreshold = Number(metadata.confThreshold || confThreshold);
    iouThreshold = Number(metadata.iouThreshold || iouThreshold);
    maskThreshold = Number(metadata.maskThreshold || maskThreshold);
    maxDetections = Number(metadata.maxDetections || maxDetections);
    self.ort.env.wasm.wasmPaths = message.ortWasmRoot;
    self.ort.env.wasm.numThreads = 1;
    session = await self.ort.InferenceSession.create(message.modelUrl, {
      executionProviders: ["wasm"],
      graphOptimizationLevel: "all",
    });
    inputName = session.inputNames?.[0] || inputName;
    self.postMessage({ type: "ready" });
  } catch (error) {
    self.postMessage({ type: "failed", error: String(error?.message || error) });
  }
}

async function segmentFrame(message) {
  const startedAt = performance.now();
  try {
    if (!session) {
      throw new Error("worker session is not ready");
    }
    const roi = buildHandRoi(message.rawLandmarks || [], message.mediaWidth, message.mediaHeight);
    const prepared = prepareSegmentationInput(message.bitmap, roi);
    message.bitmap.close?.();
    const tensor = new self.ort.Tensor("float32", prepared.data, [1, 3, inputSize, inputSize]);
    const outputs = await session.run({ [inputName]: tensor });
    const detections = parseYoloSegmentationOutputs(outputs, prepared, roi);
    const transfers = [];
    detections.forEach((detection) => {
      transfers.push(detection.mask.data);
    });
    self.postMessage(
      {
        type: "result",
        frameId: message.frameId,
        detections,
        latencyMs: Math.round(performance.now() - startedAt),
      },
      transfers,
    );
  } catch (error) {
    message.bitmap?.close?.();
    self.postMessage({
      type: "failed",
      frameId: message.frameId,
      error: String(error?.message || error),
    });
  }
}

function buildHandRoi(rawLandmarks, mediaW, mediaH) {
  if (!rawLandmarks.length) {
    return { x: 0, y: 0, width: mediaW, height: mediaH };
  }
  const xs = rawLandmarks.map((point) => point.x * mediaW);
  const ys = rawLandmarks.map((point) => point.y * mediaH);
  let x0 = Math.min(...xs);
  let y0 = Math.min(...ys);
  let x1 = Math.max(...xs);
  let y1 = Math.max(...ys);
  const pad = Math.max(x1 - x0, y1 - y0) * 0.32;
  x0 = clamp(x0 - pad, 0, mediaW - 1);
  y0 = clamp(y0 - pad, 0, mediaH - 1);
  x1 = clamp(x1 + pad, x0 + 1, mediaW);
  y1 = clamp(y1 + pad, y0 + 1, mediaH);
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

function prepareSegmentationInput(bitmap, roi) {
  const canvas = prepareSegmentationInput.canvas || (prepareSegmentationInput.canvas = new OffscreenCanvas(inputSize, inputSize));
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
  ctx.drawImage(bitmap, roi.x, roi.y, roi.width, roi.height, padX, padY, drawW, drawH);
  const imageData = ctx.getImageData(0, 0, inputSize, inputSize).data;
  const data = new Float32Array(3 * inputSize * inputSize);
  const plane = inputSize * inputSize;
  for (let i = 0; i < plane; i += 1) {
    data[i] = imageData[i * 4] / 255;
    data[i + plane] = imageData[i * 4 + 1] / 255;
    data[i + plane * 2] = imageData[i * 4 + 2] / 255;
  }
  return { data, inputSize, scale, padX, padY };
}

function parseYoloSegmentationOutputs(outputs, prepared, roi) {
  const tensors = Object.values(outputs);
  const pred = tensors.find((tensor) => tensor.dims?.length === 3);
  const proto = tensors.find((tensor) => tensor.dims?.length === 4);
  if (!pred || !proto) {
    return [];
  }
  const protoC = proto.dims[1];
  const protoH = proto.dims[2];
  const protoW = proto.dims[3];
  const candidates = decodeYoloCandidates(pred, protoC);
  const kept = nonMaxSuppression(
    candidates.filter((candidate) => candidate.score >= confThreshold),
    iouThreshold,
    maxDetections,
  );
  return kept.map((candidate) => {
    const inputBox = {
      x0: clamp(candidate.x0, 0, prepared.inputSize),
      y0: clamp(candidate.y0, 0, prepared.inputSize),
      x1: clamp(candidate.x1, 0, prepared.inputSize),
      y1: clamp(candidate.y1, 0, prepared.inputSize),
    };
    const bbox = inputBoxToMediaBox(inputBox, prepared, roi);
    const mask = buildInstanceMask(candidate.coefficients, proto.data, protoC, protoW, protoH, inputBox);
    return {
      bbox,
      mask,
      areaRatio: mask.areaRatio,
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
    if (score < confThreshold) continue;
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

function buildInstanceMask(coefficients, protoData, channels, protoW, protoH, inputBox) {
  const x0 = Math.max(0, Math.floor((inputBox.x0 / inputSize) * protoW));
  const y0 = Math.max(0, Math.floor((inputBox.y0 / inputSize) * protoH));
  const x1 = Math.min(protoW, Math.ceil((inputBox.x1 / inputSize) * protoW));
  const y1 = Math.min(protoH, Math.ceil((inputBox.y1 / inputSize) * protoH));
  const width = Math.max(1, x1 - x0);
  const height = Math.max(1, y1 - y0);
  const data = new Uint8ClampedArray(width * height * 4);
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
      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      const alpha = softMaskAlpha(probability, maskThreshold);
      alphaSum += alpha / 255;
      data[offset + 3] = alpha;
    }
  }
  return { width, height, areaRatio: alphaSum / Math.max(1, width * height), data: data.buffer };
}

function softMaskAlpha(probability, threshold) {
  const low = Math.max(0.06, threshold - 0.18);
  const high = Math.min(0.94, threshold + 0.18);
  const t = clamp((probability - low) / Math.max(0.01, high - low), 0, 1);
  const eased = t * t * (3 - 2 * t);
  const alpha = Math.round(eased * 255);
  return alpha < 6 ? 0 : alpha;
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

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}
