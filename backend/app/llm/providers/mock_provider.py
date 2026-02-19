from app.llm.providers.base import BaseLLMProvider
import asyncio
import re
import logging

logger = logging.getLogger(__name__)


class MockProvider(BaseLLMProvider):
    """
    Smart fallback provider that generates contextual responses 
    when all real LLM providers are unavailable.
    """

    # Knowledge base for common educational topics
    TOPIC_KNOWLEDGE = {
        "llm": {
            "title": "Large Language Models (LLMs)",
            "content": """## Large Language Models (LLMs)

Large Language Models are a type of artificial intelligence that can understand and generate human-like text. Here's what you should know:

### What are LLMs?
- **Definition:** LLMs are deep learning models trained on massive amounts of text data to understand, summarize, generate, and predict new content.
- **How they work:** They use a transformer architecture with billions of parameters. They predict the next word in a sequence based on context.
- **Examples:** GPT-4, Gemini, Claude, LLaMA, Mistral

### Key Concepts
- **Training:** LLMs are trained on trillions of tokens from books, websites, and other text sources
- **Fine-tuning:** Models can be specialized for specific tasks like code generation, medical advice, or education
- **Prompt Engineering:** The art of crafting inputs to get the best outputs from LLMs
- **Context Window:** The amount of text an LLM can process at once (e.g., 128K tokens for GPT-4)

### Applications in Education
- **Personalized tutoring** and adaptive learning
- **Content generation** for lesson plans, quizzes, and assessments  
- **Language translation** and accessibility
- **Research assistance** and summarization

### Limitations
- Can produce incorrect information (hallucinations)
- Limited to training data cutoff date
- May reflect biases present in training data"""
        },
        "ai": {
            "title": "Artificial Intelligence",
            "content": """## Artificial Intelligence (AI)

AI refers to the simulation of human intelligence by computer systems.

### Types of AI
- **Narrow AI (ANI):** Designed for specific tasks (e.g., voice assistants, recommendation systems)
- **General AI (AGI):** Hypothetical AI with human-level reasoning across all domains
- **Super AI (ASI):** Theoretical AI surpassing human intelligence

### Key Branches
- **Machine Learning:** Systems that learn from data without explicit programming
- **Deep Learning:** Neural networks with multiple layers for complex pattern recognition
- **Natural Language Processing:** Understanding and generating human language
- **Computer Vision:** Enabling machines to interpret visual information

### AI in Indian Education
- **NEP 2020** emphasizes integrating AI in curriculum
- AI-powered adaptive learning platforms
- Automated grading and assessment
- Personalized learning paths for diverse learners"""
        },
        "python": {
            "title": "Python Programming",
            "content": """## Python Programming

Python is one of the most popular programming languages, known for its simplicity and versatility.

### Why Python?
- **Easy to learn:** Clean, readable syntax perfect for beginners
- **Versatile:** Used in web development, data science, AI/ML, automation
- **Rich ecosystem:** Thousands of libraries (NumPy, Pandas, Django, Flask)
- **Community:** One of the largest programming communities worldwide

### Key Features
- Interpreted language (no compilation needed)
- Dynamic typing
- Object-oriented and functional programming support
- Extensive standard library

### Python in Education
- Recommended as a first programming language
- Used in CBSE and ICSE computer science curriculum
- Popular in competitive programming and data science education"""
        },
        "machine learning": {
            "title": "Machine Learning",
            "content": """## Machine Learning

Machine Learning is a subset of AI where systems learn from data to make predictions or decisions.

### Types of Machine Learning
1. **Supervised Learning:** Training with labeled data (e.g., image classification, spam detection)
2. **Unsupervised Learning:** Finding patterns in unlabeled data (e.g., clustering, anomaly detection)
3. **Reinforcement Learning:** Learning through trial and error with rewards (e.g., game AI, robotics)

### Common Algorithms
- Linear Regression, Decision Trees, Random Forests
- Neural Networks, SVMs, K-Means Clustering
- Gradient Boosting (XGBoost, LightGBM)

### Real-World Applications
- Recommendation systems (Netflix, YouTube)
- Medical diagnosis and drug discovery
- Autonomous vehicles and robotics
- Financial fraud detection"""
        },
        "nep": {
            "title": "National Education Policy 2020",
            "content": """## National Education Policy (NEP) 2020

NEP 2020 is India's comprehensive education reform framework.

### Key Highlights
- **5+3+3+4 Structure:** Replacing the 10+2 system
- **Multidisciplinary Education:** Breaking rigid stream boundaries
- **Mother Tongue:** Education in local language till Grade 5
- **Technology Integration:** AI, coding, and digital literacy from early grades
- **Flexibility:** Multiple entry/exit points in higher education

### Impact on Teaching
- Focus on conceptual understanding over rote learning
- Competency-based assessment
- Experiential and activity-based learning
- Integration of arts, sports, and vocational training"""
        },
        "math": {
            "title": "Mathematics Education",
            "content": """## Mathematics Education

### Teaching Strategies
- **Concrete-Abstract approach:** Use physical manipulatives before abstract concepts
- **Real-world connections:** Link math to daily life (shopping, cooking, sports)
- **Problem-based learning:** Present challenges that require mathematical thinking
- **Visual representations:** Graphs, diagrams, and geometric models

### Common Challenges
- Math anxiety among students
- Bridging procedural and conceptual understanding
- Differentiated instruction for varied learning levels"""
        },
        "science": {
            "title": "Science Education",
            "content": """## Science Education

### Effective Methods
- **Inquiry-based learning:** Let students ask questions and investigate
- **Hands-on experiments:** Practical demonstrations and lab work
- **Scientific method:** Hypothesis, experimentation, observation, conclusion
- **Cross-curricular connections:** Link science to math, social studies, and technology

### NCERT Alignment
- Activity-based learning as recommended by NCF
- Focus on process skills alongside content knowledge
- Environmental awareness and sustainability"""
        },
        "photosynthesis": {
            "title": "Photosynthesis",
            "content": """## Photosynthesis

### The Process
Photosynthesis is the process by which green plants convert sunlight, water, and carbon dioxide into glucose and oxygen.

**Chemical Equation:** 6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2

### Key Components
- **Chlorophyll:** The green pigment that captures light energy
- **Stomata:** Tiny pores on leaves for gas exchange
- **Light-dependent reactions:** Occur in thylakoids
- **Light-independent reactions (Calvin Cycle):** Occur in stroma

### Teaching Tips
- Use leaf experiments to demonstrate starch production
- Compare to respiration (reverse process)
- Connect to food chains and ecosystems"""
        }
    }

    GENERAL_RESPONSES = {
        "greeting": "Hello! I'm Vasu AI, your teaching assistant. I can help you with lesson planning, creating quizzes, explaining concepts, and much more. What would you like to work on today?",
        "help": """## How Can I Help You?

I'm Vasu AI, and I can assist you with:

- **Lesson Planning** - Create detailed, NEP 2020 aligned lesson plans
- **Quiz Generation** - Design assessments with varied question types  
- **Content Explanation** - Break down complex topics for any grade level
- **Teaching Strategies** - Suggest modern pedagogical approaches
- **Curriculum Advice** - NCERT/CBSE/ICSE alignment guidance

Just ask me anything! For example:
- "Explain photosynthesis for Grade 7"
- "Create a quiz on fractions"
- "Suggest activities for teaching history"
""",
        "thanks": "You're welcome! I'm always here to help. Feel free to ask me anything else about teaching, lesson planning, or educational strategies. Happy teaching! :)",
    }

    def _extract_keywords(self, text: str) -> list:
        """Extract meaningful keywords from text"""
        text_lower = text.lower()
        # Remove common words
        stop_words = {'a', 'an', 'the', 'is', 'are', 'was', 'were', 'what', 'how', 'why',
                      'when', 'where', 'who', 'which', 'can', 'could', 'would', 'should',
                      'do', 'does', 'did', 'will', 'shall', 'may', 'might', 'must',
                      'i', 'me', 'my', 'we', 'you', 'your', 'he', 'she', 'it', 'they',
                      'this', 'that', 'these', 'those', 'in', 'on', 'at', 'to', 'for',
                      'of', 'with', 'by', 'from', 'about', 'between', 'and', 'or', 'but',
                      'not', 'so', 'if', 'then', 'than', 'too', 'very', 'just', 'also',
                      'tell', 'me', 'please', 'something', 'some', 'any', 'more', 'know',
                      'want', 'need', 'like', 'think', 'say', 'said', 'get', 'got', 'make',
                      'give', 'go', 'come', 'see', 'look', 'find', 'take', 'put', 'use',
                      'google', 'search', 'explain', 'describe', 'define', 'teach'}
        words = re.findall(r'[a-z]+', text_lower)
        return [w for w in words if w not in stop_words and len(w) > 2]

    def _detect_intent(self, text: str) -> str:
        """Detect user intent from message"""
        text_lower = text.lower()
        
        greetings = ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening', 'good afternoon']
        if any(g in text_lower for g in greetings):
            return "greeting"
        
        thanks_words = ['thank', 'thanks', 'thankyou', 'appreciate', 'grateful']
        if any(t in text_lower for t in thanks_words):
            return "thanks"
        
        help_words = ['help', 'what can you do', 'what do you do', 'your capabilities', 'features']
        if any(h in text_lower for h in help_words):
            return "help"
        
        return "question"

    def _find_relevant_topic(self, text: str) -> str | None:
        """Find the most relevant topic from knowledge base"""
        text_lower = text.lower()
        
        # Direct keyword matching with topic keys
        best_match = None
        best_score = 0
        
        for topic_key, topic_data in self.TOPIC_KNOWLEDGE.items():
            score = 0
            # Check if topic key appears in text
            if topic_key in text_lower:
                score += 10
            # Check individual words of multi-word keys
            key_words = topic_key.split()
            for kw in key_words:
                if kw in text_lower:
                    score += 5
            # Check title words
            title_words = topic_data["title"].lower().split()
            for tw in title_words:
                if len(tw) > 3 and tw in text_lower:
                    score += 3
            
            if score > best_score:
                best_score = score
                best_match = topic_key
        
        return best_match if best_score >= 5 else None

    async def generate(self, prompt: str) -> str:
        # Simulate slight delay for realism
        await asyncio.sleep(0.5)
        
        # Extract the user's actual message from the prompt
        if "CURRENT MESSAGE FROM TEACHER:" in prompt:
            user_message = prompt.split("CURRENT MESSAGE FROM TEACHER:")[-1].strip()
            # Remove "Vasu AI Response:" if present
            if "Vasu AI Response:" in user_message:
                user_message = user_message.split("Vasu AI Response:")[0].strip()
        elif "INPUT DATA:" in prompt:
            user_message = prompt.split("INPUT DATA:")[-1].strip()
        else:
            user_message = prompt.strip()
        
        logger.info("[MOCK] Processing message: %s", user_message[:80])
        
        # 1. Check for structured content requests (lesson plan, quiz, story)
        user_lower = user_message.lower()
        
        if any(kw in user_lower for kw in ["lesson plan", "lesson"]) and "JSON SCHEMA" in prompt:
            return self._generate_lesson_plan_json(user_message)
        
        if any(kw in user_lower for kw in ["quiz", "test", "assessment"]) and "Quiz" in prompt:
            return self._generate_quiz_response(user_message)
        
        if any(kw in user_lower for kw in ["story", "narrative"]) and "Story" in prompt:
            return self._generate_story_response(user_message)
        
        # 2. Chat mode — detect intent
        intent = self._detect_intent(user_message)
        
        if intent in self.GENERAL_RESPONSES:
            return self.GENERAL_RESPONSES[intent]
        
        # 3. Find relevant topic
        relevant_topic = self._find_relevant_topic(user_message)
        
        if relevant_topic:
            topic_data = self.TOPIC_KNOWLEDGE[relevant_topic]
            response = f"Great question! Here's what I can share about **{topic_data['title']}**:\n\n"
            response += topic_data["content"]
            response += "\n\n---\n*I'm currently in offline mode, so this is from my built-in knowledge base. For more detailed and real-time information, please ensure an AI provider is configured.*"
            return response
        
        # 4. Generate a contextual response based on keywords
        keywords = self._extract_keywords(user_message)
        
        if keywords:
            topic_phrase = ", ".join(keywords[:3])
            return f"""## About {topic_phrase.title()}

Thank you for your question about **{topic_phrase}**. Here's what I can share:

While I'm currently operating in offline mode and don't have specific detailed knowledge on this exact topic in my built-in database, here are some general suggestions:

### For Teaching This Topic
1. **Start with context** - Begin by connecting the concept to students' daily experiences
2. **Use visual aids** - Diagrams, charts, and real-world images can make abstract concepts concrete
3. **Encourage discussion** - Let students share what they already know about {topic_phrase}
4. **Hands-on activities** - Design experiments or projects that let students explore the concept
5. **Assessment** - Use a mix of formative checks (quick questions) and summative tasks (projects)

### Recommended Approach
- Align your lesson with **NCERT guidelines** and **NEP 2020** framework
- Include **Bloom's Taxonomy** verbs in your learning objectives
- Plan for **differentiated instruction** to cater to varied learning levels

Would you like me to help create a **lesson plan**, **quiz**, or **activity** on this topic? Just let me know!

---
*I'm currently in offline mode. For more specific and detailed responses, please ensure an AI provider (Google Gemini or Fireworks) is configured.*"""
        
        # 5. Ultimate fallback
        return """I'd be happy to help you! Could you please provide more details about what you're looking for?

Here are some things I can assist with:
- **Explain a topic** (e.g., "Explain photosynthesis for Grade 7")
- **Create a lesson plan** (e.g., "Make a lesson plan on fractions")
- **Generate a quiz** (e.g., "Create a quiz on Indian history")
- **Teaching advice** (e.g., "How to teach poetry effectively?")
- **NEP 2020 guidance** (e.g., "How to align my teaching with NEP?")

Just type your question and I'll do my best to help!"""

    def _generate_lesson_plan_json(self, user_message: str) -> str:
        """Generate a basic lesson plan JSON structure"""
        import json
        keywords = self._extract_keywords(user_message)
        topic = " ".join(keywords[:2]).title() if keywords else "General Topic"
        
        return json.dumps({
            "title": f"Mastery in {topic}",
            "subtitle": f"A comprehensive guided lesson",
            "overview": f"This lesson explores {topic} through interactive activities and real-world connections relevant to Indian students.",
            "objectives": [
                f"Understand the fundamental principles of {topic}",
                f"Apply {topic} concepts to real-world scenarios",
                f"Analyze and evaluate the impact of {topic}"
            ],
            "duration": "45 Mins",
            "materials": [
                {"name": "Textbook/NCERT", "icon": "book", "color": "blue"},
                {"name": "Visual Aids", "icon": "image", "color": "lime"},
                {"name": "Activity Worksheet", "icon": "clipboard", "color": "purple"}
            ],
            "activities": [
                {"title": "Warm-Up Discussion", "duration": "10 Mins", "description": f"Ask: 'What do you already know about {topic}?' Create a mind-map on the board."},
                {"title": "Concept Explanation", "duration": "20 Mins", "description": f"Explain core concepts of {topic} with examples from Indian context."},
                {"title": "Group Activity", "duration": "15 Mins", "description": f"Students work in groups to create a poster/presentation on {topic}."}
            ],
            "assessment": [
                f"What is the main idea behind {topic}?",
                "How would you explain this to a younger student?"
            ],
            "homework": f"Research one real-world application of {topic} in your neighborhood.",
            "tips": ["Keep the session interactive.", "Use local examples to make concepts relatable."]
        })

    def _generate_quiz_response(self, user_message: str) -> str:
        keywords = self._extract_keywords(user_message)
        topic = " ".join(keywords[:2]).title() if keywords else "General Topic"
        return f"""## Quiz: {topic}

### Section A: Conceptual Questions (MCQ)
1. Which of the following best describes {topic}?
   - a) Option A
   - b) Option B  
   - c) Option C
   - d) Option D
   **Answer: b)**

2. What is the primary purpose of {topic}?
   - a) Option A
   - b) Option B
   - c) Option C  
   - d) Option D
   **Answer: c)**

### Section B: Short Answer
3. Explain how {topic} is relevant in everyday life with an Indian context example.
4. Compare and contrast two aspects of {topic}.

### Section C: Critical Thinking
5. If you were to teach {topic} to a younger student, how would you explain it in simple terms?"""

    def _generate_story_response(self, user_message: str) -> str:
        keywords = self._extract_keywords(user_message)
        topic = " ".join(keywords[:2]).title() if keywords else "Learning"
        return f"""## The Discovery of {topic}

In the bustling town of Varanasi, young Priya sat by the banks of the Ganges, her textbook open on her lap. Today's lesson was about {topic}, and she couldn't quite grasp why it mattered.

"Didi, why do we need to learn about {topic}?" she asked her elder sister Meera, who was studying engineering.

Meera smiled and pointed at the river. "See how the water flows? {topic} is everywhere around us..."

As they walked through the narrow galis of the old city, Meera showed Priya example after example of {topic} in real life - from the construction of ancient temples to the technology in their smartphones.

By evening, Priya understood. {topic} wasn't just a chapter to memorize; it was a lens through which she could understand her world.

**Moral:** True learning happens when we connect classroom knowledge to the world around us."""
