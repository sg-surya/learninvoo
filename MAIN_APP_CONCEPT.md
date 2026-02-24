# 🖥️ Learnivo "Institutional Operating System" (IOS) App Concept

This document outlines the design architecture, theme, and user flow for the **main application dashboard** (The Institutional Operating System). Unlike the landing page, this is built for **sustained productivity, speed, and intelligence**.

---

## 🎨 1. Application Design System: "Deep Work" Aesthetic

### **Visual Philosophy: "Calm & Powerful"**
While the landing page is about "Wow" factor, the app is about "Flow" factor.
*   **Background:** True Black (`#000000`) for OLED-friendly power saving and high contrast.
*   **Sidebar/Navigation:** Deep Navy Slate (`#080a0f`) with a translucent blur.
*   **Accent Color:** "Vasu Green" (`#ccff00`) - Used sparingly only for active states, primary actions, and AI notifications.
*   **Typography:**
    *   **Primary UI:** `Inter` (Medium weight for labels, Regular for data).
    *   **Command Bar/AI labels:** `JetBrains Mono` (gives it a "System" feel).

---

## 🏗️ 2. Core Layout: The "Command Center"

### **A. Global Sidebar (The Backbone)**
*   **Top:** Logo + Institutional Pulse (indicator of AI system health).
*   **Navigation Groups:**
    1.  **Preparation:** Lesson Architect, Library (RAG), Quiz Generator.
    2.  **Delivery:** Smart Presentation, Virtual Whiteboard.
    3.  **Governance:** Attendance Grid, Gradebook AI, Fee Dashboard.
    4.  **Intelligence:** Vasu AI (Global Chat/Command Bar).

### **B. Main Canvas (The Workspace)**
*   **Header:** Dynamic breadcrumbs + "Instant Search" (Cmd+K) bar.
*   **Content Area:** Modular "Widgets" that can be pinned, resized, or expanded.
*   **Glassmorphic Overlays:** When an AI tool is active, it appears as a floating glass layer over the current work, allowing the teacher to reference data while generating content.

---

## ⚡ 3. Key Main App Sections

### **Section 1: The "Daily Flow" Dashboard**
*   **The "Now" Widget:** Shows the current class, time remaining, and a one-click "Start Lesson" button.
*   **AI Insight Cards:** "3 students struggled with 'Photosynthesis' yesterday. Generate a 5-minute recap?"
*   **Administrative Quick-Actions:** "3 Pending Graded Sheets"—click to open the Vision AI scanner.

### **Section 2: The "Vasu" Command Center (Global AI)**
*   **Behavior:** A Persistent floating "Vasu" bubble in the bottom right or a top bar.
*   **Function:** "Vasu, move today's Biology quiz to Friday and notify the principal."
*   **Contextual Awareness:** If you are on the Lesson Planner, Vasu suggests multimedia links. If you are on the Gradebook, Vasu identifies trends in low-scoring students.

### **Section 3: The "Library" (Institutional Memory)**
*   **The Hub:** Where all school PDFs, textbooks, and past lesson plans live.
*   **RAG Interaction:** "Chat with your Curricula." Ask questions like, "What is the weightage of Chapter 4 in the CBSE 2024 syllabus?"

---

## ✨ 4. The "IOS" Magic Interactions

*   **Ghost Typing:** When AI generates a lesson plan, it shows a "Ghost Typing" effect (low opacity text appearing before it solidifies).
*   **Drag-and-Drop Intelligence:** Drag a PDF from the Library directly onto the "Quiz Generator" sidebar to start a RAG session.
*   **Voice Control:** "Teacher Mode" where the app responds to voice commands while the teacher is standing away from the screen.
*   **Dynamic Theming:** High-contrast mode for classroom projectors vs. OLED Dark Mode for home prep.

---

## 🤖 5. The Main App Prompts

### **For UI/UX Design (Main Dashboard):**
> *"Professional Dashboard UI for an AI-powered school management system named 'Learnivo'. Theme: Deep black background with charcoal gray cards. Secondary sidebar in muted navy. Accent: Neon lime green for active buttons and AI indicators. Clean, minimal, high-information density. Show a 3-column layout: Sidebar, Main Workspace with modular widgets, and a thin right-side AI Chat panel. Using fonts 'Inter' and 'JetBrains Mono'. High-end SaaS aesthetic, 8k, minimalistic."*

### **For Code Generation (Next.js Dashboard Shell):**
> *"Build a responsive React dashboard layout for a 'Learnivo IOS'. Features: A fixed left sidebar with blurred glass background, a top sticky header with a CMD+K search bar, and a main scrollable area with a bento-style grid. Primary color palette: #000000 background, #111111 for card backgrounds, and #ccff00 for active states. Use Tailwind CSS and Framer Motion for smooth tab transitions. Font-stack: Outfit for headers, Inter for UI text."*
