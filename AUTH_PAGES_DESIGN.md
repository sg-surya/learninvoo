# 🔐 Learnivo Login & Register Pages: Design Blueprint

This document defines the **exact design language** for the Login and Register pages of Learnivo. Both pages must feel like a natural extension of the **Landing Page** (`#010205` midnight theme, glassmorphism, neon lime accents).

---

## 🎨 1. Shared Design System (Same as Landing Page)

### **Color Palette**
| Token | Value | Usage |
|-------|-------|-------|
| `--midnight` | `#010205` | Page background |
| `--cerulean` | `#007BFF` | Secondary accent, links |
| `--neon-lime` | `#ccff00` | Primary CTA, active states, focus rings |
| `--glass-bg` | `rgba(255,255,255,0.03)` | Card surface |
| `--glass-border` | `rgba(255,255,255,0.08)` | Card borders |
| `--text-primary` | `#ffffff` | Headings |
| `--text-secondary` | `rgba(255,255,255,0.5)` | Body text, labels |
| `--input-bg` | `rgba(255,255,255,0.05)` | Input fields |
| `--input-focus` | `#ccff00` | Focus border color |

### **Typography**
- **Headings:** `Outfit`, Bold/ExtraBold, uppercase, tight tracking
- **Labels:** `JetBrains Mono`, uppercase, `10px`, letter-spacing `0.2em`
- **Body/Input:** `Inter`, medium weight, `14px`

### **Effects**
- **Glassmorphism:** `backdrop-filter: blur(20px)`, translucent borders
- **Neon Glow:** On hover/focus: `box-shadow: 0 0 20px rgba(204,255,0,0.3)`
- **Bioluminescent Orbs:** Same floating gradient blobs from landing page

---

## 🏗️ 2. Page Layout: Split-Screen Architecture

Both Login and Register follow a **60/40 split-screen** layout:

```
┌──────────────────────────────────────────────────┐
│  LEFT (60%)                │  RIGHT (40%)         │
│  ┌──────────────────────┐  │  ┌────────────────┐  │
│  │  Logo (top-left)     │  │  │                │  │
│  │                      │  │  │  BRAND PANEL   │  │
│  │  ┌────────────────┐  │  │  │                │  │
│  │  │  GLASS CARD    │  │  │  │  Big headline  │  │
│  │  │  with form     │  │  │  │  Lime accent   │  │
│  │  │  inputs        │  │  │  │  bar           │  │
│  │  │                │  │  │  │  Tagline       │  │
│  │  └────────────────┘  │  │  │                │  │
│  │                      │  │  │  Floating orb  │  │
│  │  © 2026 LEARNIVO     │  │  │  glows         │  │
│  └──────────────────────┘  │  └────────────────┘  │
└──────────────────────────────────────────────────┘
```

### **Left Panel (Form Area) — `60% width`**
- **Background:** `#010205` (same midnight)
- **Logo:** Top-left corner, LEARNIVO branding with lime dot
- **Form Container:** Centered vertically, max-width `400px`
- **Subtle Orbs:** Very dim lime/blue gradient blobs for depth
- **Footer:** Small copyright text at the bottom

### **Right Panel (Brand Panel) — `40% width`**
- **Background:** Solid dark with a massive gradient overlay
- **Content:** Large motivational headline, lime accent bar, tagline
- **Glow:** A huge `blur(120px)` lime orb in the center for ambiance
- **Hidden on mobile:** Only visible on `lg:` breakpoint and above

---

## 📝 3. Login Page Design

### **Form Elements:**

#### **Headline:**
```
WELCOME
BACK.           ← (Bold, Uppercase, "." in lime)
```

#### **Subheadline:**
`Empowering the next generation of Indian educators.`

#### **Input Fields:**
- **Email Input:**
  - Label: `WORK EMAIL` (mono, 10px, uppercase)
  - Icon: `Mail` (left side, turns lime on focus)
  - Placeholder: `arjun@school.com`
  - Style: Glassmorphic input, rounded-2xl, h-14

- **Password Input:**
  - Label: `PASSWORD` with `FORGOT?` link (lime color, right side)
  - Icon: `Lock` (left side, turns lime on focus)
  - Style: Same as email

#### **Remember Me:**
- Custom checkbox (lime fill when active)
- Label: `KEEP ME SIGNED IN`

#### **Submit Button:**
```css
background: white (foreground color);
color: black;
font: black, uppercase, tracking-widest;
height: 56px;
border-radius: 16px;
text: "SIGN IN NOW →"
hover: scale(1.01), opacity 0.9
```

#### **Footer Link:**
`New to Learnivo?` → `Create Account` (lime color)

### **Right Panel Content:**
- Icon: BookOpen in a dark rounded card
- Headline: `MASTERING THE ART OF TEACHING.`
- Lime accent bar: `h-1 w-24 bg-lime-500`
- Tagline: `Everything you need to run a modern AI-powered classroom in Bharat.`

### **Forgot Password Flow:**
- **Step 1:** Email verification input
- **Step 2:** New password input with "Update Credentials" button (lime bg)
- Animated transition between steps using `AnimatePresence`

---

## 📝 4. Register Page Design

### **Multi-Step Registration Flow:**

#### **Step 1: Role Selection**
```
YOUR
IDENTITY.       ← (Bold, Uppercase, "." in lime)
```
- Two large glass cards for role selection:
  - **Teacher Card:** `Presentation` icon, "I AM A TEACHER" title, sub-text about AI-powered teaching
  - **Student Card:** `GraduationCap` icon, "I AM A STUDENT" title, sub-text about AI-powered learning
- Each card has a lime border on hover/active state
- Selected card gets a lime glow: `shadow-[0_0_30px_rgba(204,255,0,0.15)]`

#### **Step 2: Account Details**
```
CREATE
YOUR ACCOUNT.   ← (Bold, Uppercase, "." in lime)
```
- **Fields:**
  - `FULL NAME` → Auto-generates username
  - `USERNAME` → Editable, shows validation status
  - `EMAIL` → Work email
  - `INSTITUTION` → School/College name
  - `PASSWORD` → With strength indicator
- **Back Button:** `← CHANGE ROLE` (top-left, above form)

#### **Submit Button:**
```css
background: foreground;
color: background;
text: "LAUNCH MY DASHBOARD →"
```

#### **Footer Link:**
`Already have an account?` → `Sign In` (lime color)

### **Right Panel Content (Register):**
- **Step 1 Panel:**
  - Icon: `LayoutGrid`
  - Headline: `BUILT FOR BHARAT'S EDUCATORS.`
  - Tagline: `Join 50,000+ teachers transforming education with AI.`
  
- **Step 2 Panel:**
  - Icon: `Activity`
  - Headline: `YOUR AI COPILOT AWAITS.`
  - Tagline: `One account. Unlimited intelligence.`
  - Shows a floating list of features:
    - `LESSON ARCHITECT`
    - `QUIZ GENERATOR`
    - `VISION GRADING`
    - `VASU AI ASSISTANT`

---

## ✨ 5. Interaction & Animation Details

### **Page Transitions:**
- Login ↔ Forgot Password: Slide left/right with `AnimatePresence`
- Register Step 1 → Step 2: Slide with opacity fade

### **Input Focus States:**
- Border transitions to `#ccff00` (neon lime)
- Left icon transitions to lime color
- Background subtly brightens

### **Button Animations:**
- `whileHover: scale(1.01)`
- `whileTap: scale(0.99)`
- Smooth shadow expansion on hover

### **Orb Backgrounds:**
- Very subtle (5% opacity) lime and blue gradient blobs
- Positioned at corners with `blur(120px)`
- No animation (static, for depth only)

---

## 🌗 6. Light Theme Adaptation

When the user switches to light mode:

| Element | Dark Mode | Light Mode |
|---------|-----------|------------|
| Page BG | `#010205` | `#f0f2f5` |
| Card BG | `rgba(255,255,255,0.03)` | `rgba(255,255,255,0.8)` |
| Text | `#ffffff` | `#0f172a` |
| Input BG | `rgba(255,255,255,0.05)` | `#f1f5f9` |
| Input Border | `rgba(255,255,255,0.08)` | `#e2e8f0` |
| Right Panel | Dark with lime glow | Same dark (keeps contrast) |
| Lime Accent | `#ccff00` | `#84cc16` (slightly darker for readability) |

---

## 🤖 7. Design Prompts

### **For Login Page Mockup:**
> *"Premium dark mode login page for AI education platform 'Learnivo'. Split-screen layout: left side has a glassmorphic form with email and password inputs on midnight black background. Right side has bold 'MASTERING THE ART OF TEACHING' headline with neon lime accent bar. Fonts: Outfit (bold headlines) and Inter (inputs). Clean, minimal, futuristic SaaS aesthetic. 8k."*

### **For Register Page Mockup:**
> *"Multi-step registration page for AI education platform 'Learnivo'. Dark mode, midnight background. Step 1 shows two large glassmorphic role selection cards (Teacher/Student) with icons. Neon lime (#ccff00) accent on selected card. Right panel shows bold motivational headline. Premium SaaS UI, 8k, modern."*
