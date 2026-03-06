# 👁️ RETINO_AI: Professional Swin-Transformer for Diabetic Retinopathy

![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![AI: Swin-Transformer](https://img.shields.io/badge/Model-Swin--Transformer-orange)
![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB)
![Cloud: AWS Serverless](https://img.shields.io/badge/Cloud-AWS%20Serverless-232F3E)

> **Developed by [Hamsa Lakshmi Durga Seethepalli](https://github.com/hamsaseethepalli)**
> *A state-of-the-art, edge-inference screening tool for early detection of Diabetic Retinopathy.*

---

## 📜 Table of Contents
1. [Introduction](#-introduction)
2. [Medical Context: Diabetic Retinopathy](#-medical-context-diabetic-retinopathy)
3. [AI Architecture: Swin-Transformer](#-ai-architecture-swin-transformer)
4. [Key Features](#-key-features)
5. [Technical Stack](#-technical-stack)
6. [System Architecture](#-system-architecture)
7. [Project Structure](#-project-structure)
8. [Getting Started](#-getting-started)
9. [Deployment](#-deployment)
10. [Licensing](#-licensing)

---

## 📖 Introduction
**RETINO_AI** is a high-performance medical imaging platform designed to bring clinical-grade diagnostic capabilities to the edge. By utilizing **On-Device Inference**, RETINO_AI eliminates the need for expensive server-side GPU processing, ensuring that patients in rural or low-bandwidth areas can receive instant, life-saving screenings with total data privacy.

---

## 🩺 Medical Context: Diabetic Retinopathy

### **History & Clinical Significance**
Diabetic Retinopathy (DR) was first clinically documented in the mid-19th century. With the global rise of diabetes, it has become the **leading cause of preventable blindness** in the working-age population. In regions like Bharat, the patient-to-ophthalmologist ratio is critically low, making automated screening tools a public health necessity.

### **The Grading Scale (ETDRS)**
DR progresses through five distinct clinical stages:
* **Grade 0 (No DR):** Healthy retina with no visible lesions.
* **Grade 1 (Mild NPDR):** Appearance of microaneurysms (tiny red spots).
* **Grade 2 (Moderate NPDR):** Presence of hemorrhages and "cotton wool" spots. **This is the critical window for intervention.**
* **Grade 3 (Severe NPDR):** Extensive vessel damage; high risk of vision loss.
* **Grade 4 (Proliferative DR):** Neovascularization (new vessel growth) which can lead to retinal detachment.

**RETINO_AI** is specifically optimized to maximize sensitivity for **Grade 2 (Moderate)** detection, providing a digital safety net for asymptomatic patients.

---

## 🧠 AI Architecture: Swin-Transformer

RETINO_AI implements the **Swin Transformer (Shifted Window Transformer)**, moving beyond traditional Convolutional Neural Networks (CNNs).

### **Why Swin-Transformer?**
1. **Hierarchical Feature Extraction:** Processes images at multiple scales, catching both tiny microaneurysms (local) and large structural changes (global).
2. **Shifted Window Attention:** Standard Transformers have quadratic computational costs. Swin uses shifted windows to achieve **linear complexity**, making it efficient enough to run **100% on-device** via ONNX Runtime Web.
3. **Edge Optimization:** By performing inference on the user's local hardware (WASM/WebGL), we ensure zero server-side inference costs and maximum data security.

---

## ✨ Key Features
* **Zero-Latency Inference:** HIPAA-compliant; fundus images never leave the patient's device.
* **Clinician Verification Terminal:** A professional workflow where doctors review AI predictions and digitally sign reports.
* **Multilingual Voice Synthesis:** Integrated **AWS Polly** (Kajal Voice) for audio diagnostics in **English & Hindi**.
* **Generative AI Reports:** Uses **Google Gemini 1.5 Flash** to generate surgical, structured medical precautions.
* **Automated PDF Generation:** Structured clinical reports with image embeds, AI scaling, and clinician remarks.

---

## 🛠️ Technical Stack
* **Frontend:** React 18, Vite, TypeScript, Tailwind CSS.
* **Inference Engine:** ONNX Runtime Web (WASM/WGPU).
* **Backend:** AWS Lambda (Node.js 20.x), Amazon API Gateway.
* **Intelligence:** Google Gemini 1.5 Flash (Surgical JSON generation).
* **Voice:** Amazon Polly (Neural Engine).
* **Hosting:** AWS Amplify / AWS CloudFront + S3.

---

## 🏗️ System Architecture
1. **Edge Inference:** User uploads a fundus image. Swin-Transformer executes locally.
2. **Cloud Intelligence:** AI Grade triggers a Lambda function for Gemini (Medical Text) and Polly (Audio Synthesis).
3. **Clinical Review:** The Doctor reviews the scan, provides manual feedback, and signs the record.
4. **Final Output:** A permanent, downloadable PDF report is generated for the patient.

---

## 📂 Project Structure
```text
RETINO_AI/
├── public/                 
│   └── dr_grading_model.onnx # The Brain: Pre-trained Swin Transformer
├── src/
│   ├── components/         # Atomic UI: GradeMeter, Sidebar, Layouts
│   ├── services/           # Technical Logic Core
│   │   ├── inferenceService.ts # Preprocessing & ONNX Execution
│   │   └── geminiService.ts    # API Gateway & Lambda Communication
│   ├── types/              # Strict TypeScript Definitions
│   ├── constants/          # Multilingual Strings & Translations
│   └── App.tsx             # State Orchestration & Business Logic
├── .gitignore              # Security: Excludes node_modules and .env
├── package.json            # Dependency Management
└── vite.config.ts          # Build Optimization Settings



## 🚀 Getting Started

To set up a local copy of **RETINO_AI** and begin development, follow these structured steps.

### **1. Prerequisites**
Ensure your local environment meets the following requirements:
* **Node.js:** version 18.0 or higher.
* **npm:** (included with Node.js) or **yarn**.
* **AWS CLI:** Configured with an IAM user possessing `AmazonPollyFullAccess` and `AWSLambdaRole` permissions.
* **Git:** For version control and deployment.

---

### **2. Installation & Setup**

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/hamsaseethepalli/RETINO_AI.git](https://github.com/hamsaseethepalli/RETINO_AI.git)
    cd RETINO_AI
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory to connect your frontend with the AWS backend:
    ```env
    VITE_API_GATEWAY_URL=[https://your-api-id.execute-api.ap-south-1.amazonaws.com](https://your-api-id.execute-api.ap-south-1.amazonaws.com)
    ```

4.  **AI Model Verification**
    Ensure the `dr_grading_model.onnx` file is placed inside the `public/` folder. This ensures the ONNX Runtime can fetch the model locally during browser inference.

---

### **3. Development Workflow**

Start the local development server with Hot Module Replacement (HMR):
```bash
npm run dev

## 🚀 Building for Production

To generate the optimized production build (the `dist/` folder), execute:

```bash
npm run build
```

**Note:**
This process bundles assets, minifies code, and prepares the ONNX model for high-speed delivery via CDN.

---

# ☁️ Deployment

## AWS Amplify (Recommended)

1. Connect your **GitHub repository** to the **AWS Amplify Console**.
2. Amplify will automatically detect the **Vite configuration**.
3. Ensure the **Base Directory** is set to:

```
dist
```

4. Navigate to:

```
App Settings → Environment Variables
```

5. Add the following variable:

```
VITE_API_GATEWAY_URL
```

6. Click **Save and Deploy**.

Your site will now be live with:

* 🔒 Secure **HTTPS URL**
* ⚡ **Automatic CI/CD deployment**

---

## Manual S3 + CloudFront Deployment

1. Upload the **contents of the `dist/` folder** to the **root of an S3 bucket**.

2. Create a **CloudFront Distribution** with the **S3 bucket** (or S3 static endpoint) as the **Origin**.

### ⚠️ Important for React Router

To prevent **"Access Denied" errors when refreshing sub-routes**:

1. Go to **CloudFront → Error Responses**
2. Create custom error responses for:

* **403**
* **404**

Set the following values:

```
Response Page Path: /index.html
HTTP Response Code: 200
```

This ensures that refreshing pages like `/dashboard` or `/results` works correctly.

---

# 🌿 Branching Strategy

To maintain a **professional development workflow for the hackathon**, the project follows this branching model:

### `main`

The **Gold Standard branch**.

Contains:

* Stable code
* Judge-ready version
* Final presentation build

---

### `develop`

The **primary integration branch**.

Used for:

* Active development
* Integrating features before production

---

### `feature/clinical-ui`

Dedicated branch for:

* Refining the **Clinician Verification Terminal**
* UI/UX improvements for medical professionals

---

### `feature/inference-optimization`

Used for:

* Optimizing **Swin-Transformer**
* Improving **ONNX Runtime inference performance**

---

# ⚖️ Licensing

This project is licensed under the **Apache License 2.0**.

---

## Why Apache 2.0?

Apache 2.0 is widely used in **medical AI systems** (including **NVIDIA MONAI** and **Microsoft Healthcare**) because it provides strong legal protection.

### 🛡 Explicit Patent Grant

Provides an **express grant of patent rights** from contributors to users, protecting the project from potential legal litigation.

---

### 🏥 Clinical Safety

Includes a **clear disclaimer of liability and warranty**, stating that the software is provided **"AS IS"**, which is essential for experimental diagnostic tools.

---

### 💼 Commercial Freedom

Allows organizations to:

* Fork the project
* Modify the code
* Use it commercially

without restrictive **Copyleft requirements**, enabling real-world clinical adoption.


