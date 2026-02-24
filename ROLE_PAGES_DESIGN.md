    # 🎯 Learnivo — Role-Based Landing Pages Design Document

    > **Pages:** `/for-teachers` · `/for-students` · `/for-admins`  
    > **Design System:** Shared layout skeleton, unique accent colors per role  
    > **Framework:** Next.js + Framer Motion + Lucide Icons  
    > **Theme:** Supports Light & Dark via ThemeProvider  

    ---

    ## 🏗️ Shared Layout Structure (All 3 Pages)

    Every page follows the **exact same skeleton** — only content, accent color, and visuals change.

    ```
    ┌──────────────────────────────────────────────────┐
    │  HEADER / NAV BAR (sticky, blur backdrop)         │
    │  Logo  ·  For Teachers  ·  For Students  ·  For Admins  ·  [CTA] │
    ├──────────────────────────────────────────────────┤
    │                                                  │
    │  ① HERO SECTION (2-col grid)                     │
    │  ┌─────────────────────┬─────────────────────┐   │
    │  │  Badge Pill          │                     │   │
    │  │  Giant Headline      │   Interactive       │   │
    │  │  Subtitle / Desc     │   Dashboard         │   │
    │  │  2x CTA Buttons      │   Visual /          │   │
    │  │  3x Stats Row        │   Bento Preview     │   │
    │  └─────────────────────┴─────────────────────┘   │
    │                                                  │
    │  ② CORE BENEFITS (4-col feature cards)           │
    │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                    │
    │  │Icon│ │Icon│ │Icon│ │Icon│                    │
    │  │Title│ │Title│ │Title│ │Title│                   │
    │  │Desc│ │Desc│ │Desc│ │Desc│                    │
    │  └────┘ └────┘ └────┘ └────┘                    │
    │                                                  │
    │  ③ BENTO FEATURE HIGHLIGHTS (asymmetric grid)    │
    │  ┌───────────────────────┬──────────────┐        │
    │  │  Large Feature Card   │  Dark Card   │        │
    │  │  (icon + h3 + desc    │  (icon + h3  │        │
    │  │   + CTA arrow)        │   + desc)    │        │
    │  └───────────────────────┴──────────────┘        │
    │  ┌──────────────┬───────────────────────┐        │
    │  │  Color Card   │  Large Feature Card   │        │
    │  └──────────────┴───────────────────────┘        │
    │                                                  │
    │  ④ COMPARISON TABLE (Before vs Learnivo)         │
    │  ┌──────────────────────────────────────┐        │
    │  │  Task  │  Old Way  │  Learnivo Way ✅ │        │
    │  │  ...   │  ...      │  ...             │        │
    │  └──────────────────────────────────────┘        │
    │                                                  │
    │  ⑤ DETAILED FEATURE GRID (6-card, 3-col)        │
    │  ┌────┐ ┌────┐ ┌────┐                           │
    │  ┌────┐ ┌────┐ ┌────┐                           │
    │                                                  │
    │  ⑥ TESTIMONIAL / QUOTE (full-width dark bg)      │
    │  ┌──────────────────────────────────────┐        │
    │  │  "Quote text with highlighted word"   │        │
    │  │  Avatar · Name · Role                 │        │
    │  └──────────────────────────────────────┘        │
    │                                                  │
    │  ⑦ TRUST / SECURITY (optional, admins page)      │
    │                                                  │
    │  ⑧ FINAL CTA BANNER (accent color bg)           │
    │  ┌──────────────────────────────────────┐        │
    │  │  Big Headline                         │        │
    │  │  Sub-text                             │        │
    │  │  [Primary CTA]  [Secondary CTA]      │        │
    │  └──────────────────────────────────────┘        │
    │                                                  │
    │  FOOTER                                          │
    │  Logo · Links · Copyright                        │
    └──────────────────────────────────────────────────┘
    ```

    ---

    ## 🎨 Theme & Color System

    ### Shared Tokens (CSS Variables)
    ```
    --background       → page outer shell bg
    --card-bg          → card/section bg  
    --foreground       → primary text color
    --muted-foreground → secondary text
    --border           → subtle borders
    --muted            → muted backgrounds
    --header-bg        → nav backdrop
    ```

    ### Per-Role Accent Colors

    | Token              | For Teachers      | For Students       | For Admins          |
    |--------------------|--------------------|--------------------|--------------------|
    | **Primary Accent** | `lime-500` (#84cc16) | `purple-600` (#9333ea) | `emerald-600` (#059669) |
    | **Accent Light**   | `lime-400` (#a3e635) | `purple-400` (#c084fc) | `emerald-400` (#34d399) |
    | **Accent/10 bg**   | `lime-500/10`      | `purple-500/10`    | `emerald-500/10`   |
    | **Accent/20 border** | `lime-500/20`    | `purple-500/20`    | `emerald-500/20`   |
    | **CTA BG**         | `lime-500`         | `purple-600`       | `emerald-600`      |
    | **CTA Text**       | `slate-950` (dark) | `white`            | `white`            |
    | **Logo Icon BG**   | `foreground`       | `foreground`       | `foreground`       |
    | **Logo Icon Color** | `lime-400`        | `purple-400`       | `emerald-400`      |
    | **Selection**      | `lime-600 / white` | `purple-600 / white` | `emerald-600 / white` |

    ### Typography
    ```
    Font Family:   font-sans (Inter) + font-display (Outfit)
    Headings:      font-black, uppercase, italic, tracking-tighter
    Body:          font-medium, text-muted-foreground
    Labels:        text-[10px], font-black, uppercase, tracking-[0.2em]
    Stats:         text-3xl, font-black, italic, tracking-tighter
    ```

    ---

    ## 📄 PAGE 1: FOR TEACHERS (`/for-teachers`)

    ### ① Hero Section
    ```
    Badge:       "⚡ AI-Powered Teacher Suite"
                bg: lime-500/10, text: lime-600, border: lime-500/20

    Headline:    "Teach
                Better."
                "Better" → text-lime-500, underline

    Subtitle:    "Learnivo empowers Bharat's educators with localized AI tools
                to automate planning, evaluation, and engagement. 
                Built for NEP 2020."

    CTA 1:       [Create Free Account →]  (bg-foreground, text-background)
    CTA 2:       [▶ View Demo]            (bg-card-bg, border)

    Stats Row:
    • 10k+   → Active Gurus
    • 22+    → Local Languages  
    • 15h    → Saved Weekly
    ```

    ### Hero Visual (Right Column)
    ```
    2×2 Bento Grid inside a rounded card:
    ┌──────────────┬──────────────┐
    │  📄 Lesson   │  ⚡ Active   │
    │     Plan     │     AI       │
    │  (skeleton)  │  (lime dot)  │
    ├──────────────┴──────────────┤
    │  Evaluated 45 Papers  [A+]  │
    │  ████████████████░░░░        │
    └─────────────────────────────┘
    ```

    ### ② Core Benefits (4 Cards)
    | Icon | Title | Description | Color |
    |------|-------|-------------|-------|
    | 🏫 School | NEP 2020 Aligned | Automatically map your curriculum exactly to the latest Indian education framework guidelines. | `bg-blue-50 text-blue-600` |
    | 🏆 Award | Dynamic Grading | AI-assisted feedback that goes beyond marks—providing qualitative insights for every student. | `bg-amber-50 text-amber-600` |
    | 🔬 Microscope | Research Engine | Access a worldwide database of teaching resources curated specifically for your subject expertise. | `bg-emerald-50 text-emerald-600` |
    | ⏰ Clock | Time Recovery | Reduce administrative overhead by 70%. Focus more on teaching, less on paperwork. | `bg-rose-50 text-rose-600` |

    ### ③ Bento Feature Highlights
    **Card A (Large, left):**
    ```
    Icon:     🌐 Globe (text-blue-600)
    Title:    "Vernacular Intelligence"
    Desc:     "Supports 22+ Indian languages. Talk to the tool in Hindi, Bangla, or Tamil."
    CTA:      "View Language Matrix →"
    Accent:   Right gradient lime-400/10
    ```

    **Card B (Dark, right):**
    ```
    BG:       bg-foreground (dark)
    Icon:     👥 Users (text-lime-400)
    Title:    "Classroom Sync"
    Desc:     "Connect with students in real-time. Share assignments & track progress live."
    Accent:   Bottom-right lime-400/10 blur
    ```

    ### ④ Comparison Table — "The Guru Factor"
    ```
    Subtitle: "Why the best teachers are switching to AI workflows"
    ```

    | Teacher Task | Traditional Way | Learnivo Evolution ✅ |
    |---|---|---|
    | Lesson Planning | 2-3 Hours / Week | 30 Seconds / Instant |
    | Question Creation | Manual selection | AI-Generated Board Aligned |
    | Answer Evaluation | Take-home piles | Automated AI Rubrics |
    | Language Support | English/Hindi only | 22+ Indian Languages |
    | Student Tracking | Subjective / Manual | Deep Analytics Dashboard |

    ### ⑥ Testimonial
    ```
    BG: bg-foreground (dark), radial gradient lime
    Quote: "Learnivo is no longer just a tool—it's my Teaching Co-pilot. 
            It understands the Indian classroom context better than any generic AI."
            "Teaching Co-pilot" → text-lime-400, underline

    Name:     Dr. Ramesh Verma
    Role:     Senior Mathematics Educator, Delhi
    Avatar:   DiceBear avataaars (seed: TeacherProfile)
    ```

    ### ⑧ Final CTA Banner
    ```
    BG:        bg-lime-500
    Text:      text-slate-950
    Headline:  "Start Your Guru Journey."
    Subtitle:  "Join 10,000+ teachers upgrading Bharat's education system."
    CTA:       [Claim Your Free Trial] (bg-white → hover: bg-slate-950, text-white)
    ```

    ---

    ## 📄 PAGE 2: FOR STUDENTS (`/for-students`)

    ### ① Hero Section
    ```
    Badge:       "⚡ Study 2x Faster with Vasu AI"
                bg: purple-500/10, text: purple-600, border: purple-500/20

    Headline:    "Learn
                Faster."
                "Faster" → text-purple-600, bg-purple-500/10, px-4

    Subtitle:    "Don't just study—conquer. Learnivo works with your curriculum,
                speaks your language, and clears every doubt in seconds."

    CTA 1:       [Start Free Learning →]  (bg-foreground, text-background)
    CTA 2:       3 stacked avatars + "500k+ Students Joined"

    Stats Row:   None (replaced by social proof avatars)
    ```

    ### Hero Visual (Right Column)
    ```
    Phone-style conversational UI:
    ┌─────────────────────────────────────┐
    │  🧠 Current Quest: Organic Chem    │
    │  ████████████████ 85% XP            │
    ├─────────────────────────────────────┤
    │                                     │
    │  [AI]  "A covalent bond is formed   │
    │         by the sharing of..."       │
    │                                     │
    │         "Can you explain that   [SM]│
    │          with a daily life          │
    │          example?"                  │
    │                                     │
    └─────────────────────────────────────┘
    Purple glow behind the card (animate-pulse)
    ```

    ### ② Core Benefits (4 Cards)
    | Icon | Title | Description | Color |
    |------|-------|-------------|-------|
    | 🎯 Target | Board Exam Mastery | Specific practice materials for CBSE, ICSE, and State Boards with previous year analysis. | `bg-orange-50 text-orange-600` |
    | 💡 Lightbulb | AI Study Buddy | A personal tutor that explains complex concepts like a friend, simplified for your level. | `bg-blue-50 text-blue-600` |
    | 🧠 BrainCircuit | Smart Summaries | Turn 20-page chapters into 5-minute key points with one click using our Chapter Reader. | `bg-purple-50 text-purple-600` |
    | 🎮 Gamepad2 | Quest Mode | Gamified learning experience where every solved problem earns you rewards and rankings. | `bg-emerald-50 text-emerald-600` |

    ### ③ Vernacular Highlight (Special Section)
    ```
    BG:       bg-slate-950 (always dark)
    Icon:     🌐 Languages (purple-600, size 32)
    Headline: "English, Hindi, Anything."
            "Anything" → text-purple-400, underline
    Desc:     "Don't let language be a barrier. Ask questions in your native tongue 
            and get explained in a way that feels natural."

    Language pills: [Hinglish] [Marathi] [Tamil] [Telugu] [Bengali] [Gujarati]
                    bg-white/5, border-white/10, rounded-full

    Right Visual: Large purple brain icon (BrainCircuit) with glow
                "Bharat's Smartest Tutor"
    ```

    ### ④ Comparison Table — "Join the Evolution"
    ```
    Subtitle: "Why smart students never use traditional coaching again"
    ```

    | Feature | Traditional Coaching | Learnivo AI Advantage ✅ |
    |---|---|---|
    | Doubt Clearing | Asking teacher next day | Instant AI Response 24/7 |
    | Personalization | Same for everyone | Your Pace, Your Style |
    | Practice Tests | Limited resources | Infinite Mock Papers |
    | Language Support | English only | Native Tongue Support |
    | Memorization | Rote learning | Visual Interactive Graphs |

    ### ⑤ QR / Mobile Download Section
    ```
    Badge:    "✨ Beta Mobile Access"
    Headline: "Your Campus in your Pocket."
    Desc:     "Download the mobile hub to study on the go, scan textbook problems 
            with your camera, and get instant voice solutions."

    Download Buttons:
    [🍎 App Store — Coming Soon]
    [▶ Play Store — Get Hub App]

    Right: QR Code (QrCode icon, 120px) in white card
        "Scan for Pro Pass"
        "Limited to first 5,000 students"
    ```

    ### ⑧ Final CTA
    ```
    (No separate banner — the QR section serves as the CTA)
    ```

    ---

    ## 📄 PAGE 3: FOR ADMINS (`/for-admins`)

    ### ① Hero Section
    ```
    Badge:       "🏢 School Management OS"
                bg: emerald-500/10, text: emerald-600, border: emerald-500/20

    Headline:    "Run
                Smarter."
                "Smarter" → text-lime-500, underline

    Subtitle:    "Learnivo transforms school administration with AI-powered fee 
                management, automated attendance, and real-time parent 
                communication. Built for Indian schools."

    CTA 1:       [Schedule Demo →]  (bg-foreground, text-background)
    CTA 2:       [▶ Watch Demo]     (bg-card-bg, border)

    Stats Row:
    • 500+   → Schools Onboard
    • 98%    → Fee Recovery
    • 60%    → Admin Time Saved
    ```

    ### Hero Visual (Right Column)
    ```
    2×2 Bento Grid inside a rounded card:
    ┌──────────────┬──────────────┐
    │  💰 Fee      │  📈 Live     │
    │  ₹12.4L      │  Analytics   │
    │  ████████░░   │  (lime dot)  │
    ├──────────────┴──────────────┤
    │  94.2% Attendance Today     │
    │  ██████████████████░░░ [📅]  │
    └─────────────────────────────┘
    Emerald glow behind the card
    ```

    ### ② Core Benefits (4 Cards)
    | Icon | Title | Description | Color |
    |------|-------|-------------|-------|
    | 💳 CreditCard | Fee Automation | End-to-end fee lifecycle — from generation to collection to reconciliation. UPI, bank transfer, and installment support. | `bg-emerald-50 text-emerald-600` |
    | 📅 CalendarCheck | Smart Attendance | Multi-modal attendance (QR scan, biometric, geo-fence). Real-time dashboards with absence pattern detection. | `bg-blue-50 text-blue-600` |
    | 💬 MessageSquare | Parent Connect | Automated parent communication via WhatsApp, SMS, and in-app notifications. Custom broadcast groups. | `bg-amber-50 text-amber-600` |
    | 📊 PieChart | Deep Analytics | Institutional dashboards with 360° visibility. Track teacher performance, student outcomes, and resource utilization. | `bg-rose-50 text-rose-600` |

    ### ③ Bento Feature Highlights

    **Row 1:**
    - **Card A (Large, left):**
    ```
    Icon:     🔒 Lock (text-emerald-600)
    Title:    "Data Residency"
    Desc:     "100% India-hosted data. DPDPA compliant. No data ever leaves Indian soil. 
                SOC2 + ISO27001 certified."
    CTA:      "View Compliance →"
    Accent:   Right gradient emerald-400/10
    ```

    - **Card B (Dark, right):**
    ```
    BG:       bg-foreground (dark)
    Icon:     🔔 Bell (text-lime-400)
    Title:    "Parent Alerts"
    Desc:     "Automated attendance, fee reminders & exam updates via WhatsApp, 
                SMS, and push notifications."
    Accent:   Bottom-right lime-400/10 blur
    ```

    **Row 2:**
    - **Card C (Accent Color, left):**
    ```
    BG:       bg-emerald-600
    Text:     text-white
    Icon:     📋 FileSpreadsheet (text-emerald-100)
    Title:    "Auto Reports"
    Desc:     "One-click generation of UDISE+, NEP compliance, and custom 
                institutional reports."
    ```

    - **Card D (Large, right):**
    ```
    Icon:     🏫 School (text-amber-600)
    Title:    "Multi-Branch Control"
    Desc:     "Manage multiple campuses from a single dashboard. Unified analytics, 
                separate permissions, and branch-level autonomy."
    CTA:      "See Architecture →"
    Accent:   Right gradient amber-400/10
    ```

    ### ④ Comparison Table — "The Admin Upgrade"
    ```
    Subtitle: "Why leading schools are switching to AI-powered administration"
    ```

    | Admin Task | Old Way | Learnivo Way ✅ |
    |---|---|---|
    | Fee Collection | Manual registers, bank visits | Auto UPI/Bank Integration |
    | Attendance | Paper roll-call, proxies | QR + Biometric + AI Geo-fence |
    | Parent Updates | Written circulars | Auto WhatsApp & App Alerts |
    | Report Generation | Manual Excel entry | One-Click AI Analytics |
    | Compliance | Manual documentation | Auto NEP 2020 Compliance Audit |

    ### ⑤ Detailed Feature Grid — "Complete Admin OS"
    ```
    Subtitle: "Everything you need to run a modern Indian school — from fees 
            to compliance, all in one platform."
    ```

    | Icon | Title | Description |
    |------|-------|-------------|
    | 💳 CreditCard | Fee Management | Auto fee generation, UPI/NEFT collection, installment plans, late-fee calculation, and receipt generation. |
    | 📅 CalendarCheck | Attendance System | Multi-modal attendance with QR codes, facial recognition, and geo-fencing. Absence alerts to parents in real-time. |
    | 💬 MessageSquare | Parent Communication | WhatsApp integration, broadcast groups, exam alerts, PTM scheduling, and automated progress reports. |
    | 📊 BarChart3 | Analytics Dashboard | 360° institutional analytics — student performance trends, teacher effectiveness, revenue insights, and predictive analytics. |
    | 📋 ClipboardList | UDISE+ Compliance | Auto-generated compliance reports, NEP 2020 tracking, audit-ready documentation, and government portal integration. |
    | 🌐 Globe | Multi-Campus | Manage multiple branches from one dashboard. Unified data with branch-level permissions and custom configurations. |

    ### ⑥ Testimonial
    ```
    BG: bg-foreground (dark), radial gradient emerald
    Quote: "Learnivo cut our administrative overhead by 60%. Fee recovery 
            went from 72% to 98%. Our teachers can finally focus on teaching, 
            not paperwork."
            "60%" → text-lime-400, underline

    Name:     Mrs. Sunita Sharma
    Role:     Principal, Delhi Public School Network
    Avatar:   DiceBear avataaars (seed: AdminPrincipal)
    ```

    ### ⑦ Security / Trust Section
    ```
    Layout: 2-col inside a large rounded muted card
    Left:
    Icon:     🛡️ ShieldCheck (text-emerald-500, size 48)
    Title:    "Enterprise-Grade Security"
    Desc:     "Your school's data is protected by military-grade encryption, 
                Indian data residency, and continuous compliance monitoring."

    Right: 2×2 grid of trust badges
    ┌────────────┬────────────┐
    │ DPDPA      │ SOC2       │
    │ Compliant  │ Type II    │
    ├────────────┼────────────┤
    │ ISO        │ India      │
    │ 27001      │ Data Only  │
    └────────────┴────────────┘
    ```

    ### ⑧ Final CTA Banner
    ```
    BG:        bg-emerald-600
    Text:      text-white
    Headline:  "Modernize Your School Today."
    Subtitle:  "Join 500+ schools running on Learnivo's intelligent admin platform."
    CTA 1:     [Schedule Free Demo] (bg-white, text-emerald-700)
    CTA 2:     [Contact Sales]      (border-white/30, text-white, hover: bg-white/10)
    ```

    ---

    ## 🧩 Component Architecture

    ```
    src/app/
    ├── for-teachers/
    │   └── page.tsx          ← ForTeachersPage component
    ├── for-students/
    │   └── page.tsx          ← ForStudentsPage component
    ├── for-admins/
    │   └── page.tsx          ← ForAdminsPage component
    ```

    ### Shared Component Pattern (each page):
    ```tsx
    const ForXxxPage = () => {
        // State
        const [scrolled, setScrolled] = useState(false);
        const [user, setUser] = useState(null);
        const scrollContainerRef = useRef(null);

        // Effects: localStorage user check, scroll listener

        // Data: comparison[], features[]

        return (
            <div className="h-screen bg-background px-[10px] pb-[10px]">
                <div ref={scrollContainerRef} className="h-full bg-card-bg rounded-b-[10px] overflow-y-auto">
                    <header>...</header>
                    <main>
                        {/* ① Hero */}
                        {/* ② Core Benefits */}
                        {/* ③ Bento Features */}
                        {/* ④ Comparison Table */}
                        {/* ⑤ Detailed Grid (optional) */}
                        {/* ⑥ Testimonial */}
                        {/* ⑦ Security (admins only) */}
                        {/* ⑧ Final CTA */}
                    </main>
                    <footer>...</footer>
                </div>
            </div>
        );
    };
    ```

    ---

    ## 📱 Responsive Breakpoints

    | Breakpoint | Behavior |
    |-----------|----------|
    | `< 768px` (mobile) | Single column, stacked sections, hero text centered, visual below text |
    | `768-1024px` (tablet) | 2-col hero, 2-col benefit cards, table scrollable |
    | `> 1024px` (desktop) | Full layout, 4-col benefits, side-by-side bento, full table |

    ### Nav Responsiveness
    ```
    Desktop (lg+): Logo · [For Teachers] · [For Students] · [For Admins] · Sign In · [CTA]
    Mobile (<lg):  Logo · Sign In · [CTA]   (no nav links, no hamburger on sub-pages)
    ```

    ---

    ## 🔗 Cross-Linking Matrix

    | From Page | Links To |
    |-----------|---------|
    | Landing (`/`) | → `/for-teachers`, `/for-students`, `/for-admins` (ecosystem cards) |
    | For Teachers | → `/for-students`, `/for-admins` (nav) · → `/register`, `/login`, `/dashboard` |
    | For Students | → `/for-teachers`, `/for-admins` (nav) · → `/register`, `/login`, `/dashboard` |
    | For Admins | → `/for-teachers`, `/for-students` (nav) · → `/register`, `/login`, `/dashboard` |

    ---

    ## ✨ Animation Guide

    ```
    Hero Badge:         initial={{ opacity: 0, y: 20 }} → animate={{ opacity: 1, y: 0 }}
    Benefit Cards:      whileHover={{ y: -10 }}
    Bento Cards:        whileHover={{ scale: 0.99 }}
    CTA Buttons:        whileHover={{ scale: 1.02-1.05 }} whileTap={{ scale: 0.95 }}
    Header:             scrolled ? 'h-16 shadow-md' : 'h-20' (transition-all 300ms)
    Glow Backgrounds:   animate-pulse (slow, subtle)
    Logo Icon:          group-hover → accent color bg, icon becomes background color
    ```

    ---

    ## 📝 Footer Pattern (All Pages)

    ```
    ┌─────────────────────────────────────────────────────┐
    │  📖 Logo  Learnivo [Variant Name]                    │
    │                                                     │
    │  Privacy  ·  Terms/Safety  ·  LinkedIn/Instagram     │
    │                                                     │
    │  © 2026 LEARNIVO TECH. [Tagline]                    │
    └─────────────────────────────────────────────────────┘

    Variant Names:
    Teachers → "Learnivo Hub"
    Students → "Learnivo Scholar Hub"  
    Admins   → "Learnivo Hub"

    Taglines:
    Teachers → "Made with ♥ for Indian Gurus."
    Students → "Bharat's AI Study Buddy."
    Admins   → "Made with ♥ for Indian Schools."
    ```

    ---

    **Status:** All 3 pages are fully implemented and live.  
    **Last Updated:** 24 Feb 2026
