# Learnivo Waitlist Page Strategy & Design System

## 1. Brand Identity & Design System

### **Color Palette (Premium Dark Mode)**
The design uses a deep, rich dark mode with vibrant neon accents to signal "Future" and "Energy".

*   **Backgrounds:**
    *   `Main Background`: `#02040a` (Deepest Navy/Black)
    *   `Card Surface`: `#ffffff` @ 5% opacity + `backdrop-filter: blur(20px)` (Glassmorphism)
    *   `Border`: `#ffffff` @ 10% opacity
*   **Primary Accent (The "Vasu" Green):**
    *   `Neon Lime`: `#ccff00` (Use for CTAs, Highlights, Icons)
    *   `Glow`: `box-shadow: 0 0 20px rgba(204, 255, 0, 0.4)`
*   **Typography:**
    *   `Headings`: **Outfit** (Bold, Uppercase, Tracking-tighter)
    *   `Body`: **Inter** (Clean, Readable)
    *   `Accents`: **JetBrains Mono** (For small technical labels like "AI GENERATING...")

---

## 2. Waitlist Page Layout Suggestion

**Concept:** A single-page, high-conversion landing page. The goal is 100% focus on capturing the email.

### **Section 1: The "Hero" (Fold 1)**
*   **Visual:** A massive, glowing orb or futuristic abstract shape in the center/background (representing Vasu AI).
*   **Headline (Center):** "The Future of Teaching is Here."
*   **Subheadline:** "Meet Vasu. Your AI Co-Pilot for the Indian Classroom."
*   **CTA Action:** 
    *   Large Email Input Field (Rounded pill shape).
    *   "Get Early Access" Button (Neon Lime, pulsing animation).
*   **Social Proof (Below CTA):** "Join 2,400+ Educators on the waitlist."

### **Section 2: The "Problem vs. Solution" (Split View)**
*   **Left Side (Old Way):** Grayscale, chaotic text (keywords: "Late nights", "Endless grading", "Paperwork").
*   **Right Side (Learnivo Way):** Vibrant, organized UI cards floating (keywords: "Instant Lesson Plans", "Auto-Quizzes", "Generative Magic").

### **Section 3: Feature Teasers (3-Card Grid)**
1.  **Lesson Planner:** "Design NEP 2020 aligned plans in 60 seconds."
2.  **Quiz Generator:** "Turn any textbook chapter into a rigorous exam instantly."
3.  **Paper Digitizer:** "Grade handwritten sheets with a single photo."

### **Section 4: The "Vasu" Persona**
*   **Content:** A chat interface snippet showing Vasu answering a complex query.
*   **Caption:** "Built specifically for Indian curricula (CBSE, ICSE, State Boards)."

---

## 3. Content Copy (Copy-Paste Ready)

### **Page Title:** 
`Learnivo: The AI Superpower for Teachers`

### **Hero Section:**
> **Headline:** STOP TEACHING LIKE IT'S 1990.
> **Subheadline:** Meet **Learnivo**. The advanced AI workspace that reclaims 20 hours of your week. Plan lessons, grade papers, and generate localized content—instantly.
> **CTA Button:** JOIN THE REVOLUTION ->

### **Feature Highlights:**
*   **For the Lesson Planner:** *"Don't just plan. Innovate. Create immersive, multi-media lesson flows that captivate students."*
*   **For the Library:** *"Your textbooks, evolved. Upload any PDF and chat with it to generate resources instantly."*
*   **For Hyper-Local:** *"Global concepts, Local context. Teach 'Gravity' using Mumbai's local trains as an example."*

### **Success Message (After Signup):**
> **Title:** YOU'RE ON THE LIST.
> **Body:** Welcome to the future. You've secured your spot. Watch your inbox—Vasu will be in touch soon.
> **Share:** [Twitter] [LinkedIn] "I just joined the Learnivo Waitlist."

---

## 4. AI Prompts (For Image Generation)

Use these prompts in `Midjourney` or `Pollinations` to generate assets for the page.

**Prompt For Hero Background (Futuristic Abstract):**
> `abstract 3d technological form, glowing neon lime green core, dark navy blue background, glassmorphism, intricate data lines, premium ui ux design background, 8k, minimalistic --ar 16:9`

**Prompt For "Indian Classroom Future":**
> `futuristic indian classroom, holographic blackboard, happy diverse indian students, modern desks, warm lighting, cyberpunk accents but clean, educational atmosphere, photorealistic, 8k --ar 16:9`

**Prompt For "Teacher Persona":**
> `professional indian female teacher using a futuristic tablet, glowing interface projecting from screen, confident smile, modern classroom background, depth of field, studio lighting, high resolution`

---

## 5. Technical Implementation Steps (Next.js)

1.  **Create Page:** `src/app/waitlist/page.tsx`
2.  **State Management:** Use `useState` for email input and submission status.
3.  **Database:** Create a `Waitlist` table in PostgreSQL (`id`, `email`, `created_at`).
4.  **API:** `POST /api/waitlist` endpoint to save emails.
5.  **Animations:** Use `Framer Motion` for:
    *   Fade-in `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
    *   Button hover `whileHover={{ scale: 1.05 }}`
