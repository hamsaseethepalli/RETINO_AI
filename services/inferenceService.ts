import { DRGrade } from "../types";

declare const ort: any;
let session: any = null;

export const loadModel = async (): Promise<void> => {
  if (session) return;
  const modelPath = `/dr_grading_model.onnx?v=${Date.now()}`;
  try {
    ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
    const response = await fetch(modelPath);
    const modelBuffer = await response.arrayBuffer();
    session = await ort.InferenceSession.create(modelBuffer, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    });
    console.log("ViT Engine Online ✅");
  } catch (e) {
    console.error("ONNX Load Error:", e);
  }
};

export const loadModelFromBuffer = async (buffer: ArrayBuffer) => {
  session = await ort.InferenceSession.create(buffer, { executionProviders: ['wasm'] });
};

export const preprocessFundusImage = async (file: File): Promise<Float32Array> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

        // 1. Draw the image
        ctx.imageSmoothingEnabled = false; 
        ctx.drawImage(img, 0, 0, 224, 224);
        
        const imageData = ctx.getImageData(0, 0, 224, 224);
        const data = imageData.data;
        const floatData = new Float32Array(3 * 224 * 224);

        // 🚨 ACCURACY BOOST: Local Contrast Normalization
        // We find the max/min of the green channel (where DR lesions are visible)
        // and stretch it to ensure the ViT sees the micro-aneurysms.
        let minG = 255, maxG = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 1] < minG) minG = data[i + 1];
          if (data[i + 1] > maxG) maxG = data[i + 1];
        }
        const rangeG = (maxG - minG) || 1;

        const mean = [0.485, 0.456, 0.406];
        const std = [0.229, 0.224, 0.225];

        for (let i = 0; i < 224 * 224; i++) {
          const r = data[i * 4] / 255.0;
          // Stretch Green channel slightly to highlight lesions
          const g = ((data[i * 4 + 1] - minG) / rangeG); 
          const b = data[i * 4 + 2] / 255.0;

          // NCHW Planar Format
          floatData[i] = (r - mean[0]) / std[0];
          floatData[i + 50176] = (g - mean[1]) / std[1];
          floatData[i + 100352] = (b - mean[2]) / std[2];
        }
        resolve(floatData);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};


export const runViTInference = async (floatData: Float32Array): Promise<DRGrade> => {
  if (!session) throw new Error("Session not ready");

  const tensor = new ort.Tensor('float32', floatData, [1, 3, 224, 224]);
  const outputs = await session.run({ [session.inputNames[0]]: tensor });
  const outputData = outputs[session.outputNames[0]].data;

  let maxIdx = 0;
  let maxVal = outputData[0];
  for (let i = 1; i < outputData.length; i++) {
    if (outputData[i] > maxVal) {
      maxVal = outputData[i];
      maxIdx = i;
    }
  }

  // 🚨 HACKATHON OVERRIDE: Sensitivity Boost for Grade 2
  // If the model is too conservative (predicts 0), we check the lesion variance.
  if (maxIdx === 0) {
    const greenChannel = floatData.slice(50176, 100352);
    let anomalies = 0;
    
    // Check for high-contrast dark spots in the normalized green channel
    for (let i = 0; i < greenChannel.length; i++) {
      if (greenChannel[i] < -2.0) anomalies++; 
    }

    // If more than 150 pixels are significantly darker (lesion-like), bump to Grade 2
    if (anomalies > 150) {
      console.log("ViT missed lesions - Safety Overrider triggered Grade 2");
      return 2 as DRGrade;
    }
  }

  return maxIdx as DRGrade;
};