# CAMPUS BRIDGE AI 🎓⚙️

**AI-Powered Academic & Skill Development Platform**  
*Specifically designed for Canara Engineering College (VTU) Students*

---

## 🌟 Overview

**CAMPUS BRIDGE AI** is a modern, student-centric academic web platform tailored for engineering undergraduates at **Canara Engineering College (CEC), Benjanapadavu, Mangaluru** (affiliated to Visvesvaraya Technological University, Belagavi).

Built with a rich **Purple & Lavender** design system, this frontend prototype combines academic resource management, VTU grading analytics, and intelligent career skill readiness into a cohesive, production-grade interface.

---

## 🎨 Design & Theme

- **Color Palette**:
  - Dark Midnight Purple Sidebar: `#140c24`, `#1e1236`
  - Lavender Backgrounds: `#faf8ff`, `#f5f2fe`
  - Royal Purple & Violet Primary Accents: `#7c3aed`, `#9333ea`, `#6b21a8`
  - Status Indicators: Emerald Green (High Attendance/Distinction), Amber Gold (CGPA), Rose (Alerts)
- **Typography**: Google Fonts — *Plus Jakarta Sans* & *Inter*
- **Illustrations**: Custom SVG brand logo with engineering graduation cap & mechanical gear symbol, alongside academic banner vector art.

---

## 🚀 Key Features

### 1. 📊 Student Dashboard
- **Welcome Banner**: "Hello, Student!" with customized profile snapshot for Canara Engineering College.
- **Quick Profile Metrics**: Student name, USN (`4CB22AI042`), current CGPA (`8.92`), and attendance tracker (`88.5%`).
- **Core Feature Cards**: Direct navigation to Notes & Resources, SGPA/CGPA Calculator, and AI Skill Analysis.
- **Academic Progress Overview**: Interactive semester SGPA progression bar chart (Sem 1 to Sem 5), degree credit progress gauge (112/160 Cr), and VTU Exam countdown timer.
- **Recent Activities & Quick-Access Links**: Downloads timeline, VTU Academic calendar, 6th Sem AIML timetable, and Canara digital library portal.

### 2. 📚 Notes & Academic Resources
- **4 Year-Wise Tabs for AIML**:
  - **1st Year AIML**: Mathematics-I (`22MATS11`), Principles of Programming Using C (`22POP12`), Applied Physics (`22PHYS12`), CAED, etc.
  - **2nd Year AIML**: Data Structures & Applications (`21CS32`), Object Oriented Programming with Java (`21CS35`), Design & Analysis of Algorithms (`21CS42`), Operating Systems (`21CS43`), etc.
  - **3rd Year AIML**: Artificial Intelligence (`21AI51`), Database Management Systems (`21CS52`), Machine Learning (`21AI54`), Deep Learning (`21AI62`), NLP (`21AI63`), etc.
  - **4th Year AIML**: Computer Vision & Robotics (`21AI71`), Big Data Analytics & Cloud MLOps (`21AI72`), Generative AI & Large Language Models (`21AI742`), etc.
- **Each Course Card Includes**:
  - Subject Name, VTU Subject Code, Credits, and Category.
  - **Notes**: Module 1 to Module 5 lecture handouts by Canara professors.
  - **VTU Syllabus**: Official hours and marks weightage breakdown.
  - **PYQs**: Solved Previous Year VTU examination papers (2022-2024).
  - **Lab Materials**: VTU lab manuals, Python/Jupyter notebooks, and 100+ viva questions.
- **Search & Filters**: Real-time multi-field search and category filtering (Core Theory, Math/Allied, Electives).
- **Interactive Resource Preview Modal**: Full module handouts preview and download simulation.

### 3. 🧮 SGPA / CGPA Calculator
- **VTU 2021 & 2022 Scheme Grading Rules**:
  - $O (10), A+ (9), A (8), B+ (7), B (6), C (5), P (4), F (0)$
- **Interactive Subject Editor**:
  - Dynamic add/remove subject rows.
  - **1-Click AIML Semester Presets**: Automatically populates 3rd, 4th, 5th, or 6th Sem AIML subjects and credits.
- **Instant SGPA Calculation**:
  $$\text{SGPA} = \frac{\sum (\text{Credits} \times \text{Grade Points})}{\sum \text{Credits}}$$
- **VTU Percentage Conversion**:
  $$\text{Percentage} = (\text{CGPA} - 0.75) \times 10$$
- **Academic Distinction Classification**: First Class with Distinction ($\ge 7.75$), First Class, Second Class.
- **Semester-Wise Cumulative CGPA Calculator**: Calculates cumulative degree score across completed semesters.
- **Save to Profile**: Results directly update the student's profile in `localStorage`.

### 4. 🧠 AI Skill Analysis
- **Demonstration Prototype**: Simulates an intelligent competency mapping engine for placement readiness.
- **Technical Skill Radar / Progress Bars**: Python (94%), Machine Learning (90%), Deep Learning (86%), SQL (85%), DAA (82%), NLP (76%), Cloud MLOps (62%).
- **Identified Core Strengths**: Algorithmic problem solving, PyTorch CNN architectures, academic consistency.
- **Identified Gaps**: Docker containerization, dynamic programming optimization, cloud MLOps.
- **Personalized 4-Week AI Growth Sprint**: Interactive checklist of micro-milestones (Week 1: Dockerizing models, Week 2: ONNX Quantization, Week 3: RAG with ChromaDB, Week 4: AWS MLOps).
- **Interactive 2-Minute Diagnostic**: Simulated 3-question diagnostic that dynamically updates the readiness score.
- **Recommended Resources**: VTU NPTEL courses, Coursera deep learning, Canara lab manuals.

### 5. 👤 Student Academic Profile
- **Full Student Details**: Rohit Shenoy, USN: `4CB22AI042`, Artificial Intelligence & Machine Learning, 3rd Year (6th Sem), Section A.
- **Editable Profile Modal**: Live editing of name, USN, department, semester, bio, contact information with `localStorage` persistence.
- **Academic History**: Sem 1 to Sem 5 SGPA cards with distinction badges.
- **Projects & Certifications**: Add custom engineering projects and certificates with instant UI update.

---

## 🛠️ Tech Stack

- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS + Custom Lavender & Dark Purple Design Tokens
- **Icons**: Lucide React
- **Storage**: Browser `localStorage` for state persistence
- **Architecture**: Modular component structure, Context API for state management

---

## 💻 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

*Developed for Canara Engineering College Project Expo & Academic Showcase.*
