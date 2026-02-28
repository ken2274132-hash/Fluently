// English Course Content - Based on curriculum materials

export interface Lesson {
    id: string;
    title: string;
    category: string;
    content: string;
    examples: string[];
    tips?: string[];
}

export interface Quiz {
    id: string;
    lessonId: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface Flashcard {
    id: string;
    category: string;
    front: string;
    back: string;
}

// ==================== LESSONS ====================

export const lessons: Lesson[] = [
    // TENSES
    {
        id: "tenses-intro",
        title: "Introduction to Tenses",
        category: "Tenses",
        content: `A tense is a minimal or shortest period of time in which an action (verb) takes place. There are three main tenses: Past, Present, and Future. Each has four forms: Simple, Continuous, Perfect, and Perfect Continuous.

**Types of Sentences:**
1. Affirmatives/Positive: He eats apples.
2. Negatives: He does not eat apples.
3. Interrogatives: Does he eat apples?
4. Interrogative Negatives: Does he not eat apples?

**Simple Sentence Structure:** Subject + Verb + Object

**Subjects:**
- Singulars: he, she, it, singular noun (Ali, School, Car)
- Plurals: I, we, they, you`,
        examples: [
            "He goes to school. (Simple Present)",
            "He is going to school. (Present Continuous)",
            "He has gone to school. (Present Perfect)",
            "He has been going to school. (Present Perfect Continuous)"
        ],
        tips: [
            "Always identify the subject first",
            "Match the verb form with the subject (singular/plural)",
            "Look for time indicators to determine tense"
        ]
    },
    {
        id: "present-simple",
        title: "Present Simple Tense",
        category: "Tenses",
        content: `**Formula:** Do/don't, Does/doesn't + V1 (base verb)

**Structure:**
- Positive: Subject + V1/V1+s + Object
- Negative: Subject + do/does + not + V1 + Object
- Question: Do/Does + Subject + V1 + Object?

**Uses:**
1. Repeated actions: My friend often draws nice posters.
2. General truths: The sun rises in the East.
3. Fixed arrangements: The plane flies to London every Monday.
4. Sequential actions: First I get up, then I have breakfast.
5. Instructions: Open your book at page 34.
6. With special verbs: I understand English.`,
        examples: [
            "He goes to school every day.",
            "She does not eat meat.",
            "Do you speak English?",
            "The Earth revolves around the Sun."
        ],
        tips: [
            "Add 's' or 'es' to verb for he/she/it",
            "Use 'does' for he/she/it in questions and negatives",
            "Use 'do' for I/you/we/they"
        ]
    },
    {
        id: "present-continuous",
        title: "Present Continuous Tense",
        category: "Tenses",
        content: `**Formula:** is/am/are + V1+ing (Gerund)

**Structure:**
- Positive: Subject + is/am/are + V1+ing + Object
- Negative: Subject + is/am/are + not + V1+ing + Object
- Question: Is/Am/Are + Subject + V1+ing + Object?

**Uses:**
1. Actions happening now: Peter is reading a book now.
2. Fixed plans in near future: She is going to Basel on Saturday.
3. Temporary actions: His father is working in Rome this month.
4. Longer actions around now: My friend is preparing for his exams.
5. Trends: More people are using computers.
6. Irritating repeated actions: Andrew is always coming late.`,
        examples: [
            "I am studying English right now.",
            "She is cooking dinner.",
            "They are not watching TV.",
            "Is he playing football?"
        ],
        tips: [
            "Use 'am' with I, 'is' with he/she/it, 'are' with you/we/they",
            "Add '-ing' to the base verb",
            "For verbs ending in 'e', drop the 'e' before adding '-ing'"
        ]
    },
    {
        id: "present-perfect",
        title: "Present Perfect Tense",
        category: "Tenses",
        content: `**Formula:** has/have + V3 (past participle)

**Structure:**
- Positive: Subject + has/have + V3 + Object
- Negative: Subject + has/have + not + V3 + Object
- Question: Has/Have + Subject + V3 + Object?

**Uses:**
1. Result of past action important now: I have cleaned my room.
2. Recently completed action: He has just played handball.
3. Action continuing from past: We have lived in Canada since 1986.`,
        examples: [
            "I have finished my homework.",
            "She has visited Paris three times.",
            "They have not seen this movie.",
            "Have you eaten lunch?"
        ],
        tips: [
            "Use 'has' with he/she/it",
            "Use 'have' with I/you/we/they",
            "Learn common irregular past participles (V3)"
        ]
    },
    {
        id: "past-simple",
        title: "Past Simple Tense",
        category: "Tenses",
        content: `**Formula:** Did/didn't + V2 (past form)

**Structure:**
- Positive: Subject + V2 + Object
- Negative: Subject + did + not + V1 + Object
- Question: Did + Subject + V1 + Object?

**Uses:**
1. Completed actions: I visited Berlin last week.
2. Series of completed actions: First I got up, then I had breakfast.
3. With Past Continuous: They were playing cards when the telephone rang.`,
        examples: [
            "He went to school yesterday.",
            "She did not go to the party.",
            "Did you see the movie?",
            "They played football last Sunday."
        ],
        tips: [
            "Regular verbs: add '-ed' (walk → walked)",
            "Irregular verbs: memorize forms (go → went)",
            "Use 'did' for questions and negatives (verb returns to base form)"
        ]
    },
    {
        id: "past-continuous",
        title: "Past Continuous Tense",
        category: "Tenses",
        content: `**Formula:** was/were + V1+ing (Gerund)

**Structure:**
- Positive: Subject + was/were + V1+ing + Object
- Negative: Subject + was/were + not + V1+ing + Object
- Question: Was/Were + Subject + V1+ing + Object?

**Uses:**
1. Actions in progress at a specific past time: Mr. Prasad was reading a book yesterday evening.
2. Two simultaneous past actions: Geeta was writing while Seeta was reading.
3. With Simple Past (interrupted action): While we were sitting, the telephone rang.`,
        examples: [
            "I was sleeping when you called.",
            "They were watching TV at 8 PM.",
            "She was not working yesterday.",
            "Were you studying last night?"
        ],
        tips: [
            "Use 'was' with I/he/she/it",
            "Use 'were' with you/we/they",
            "Often used with 'while' or 'when'"
        ]
    },
    {
        id: "future-simple",
        title: "Future Simple Tense",
        category: "Tenses",
        content: `**Formula:** Will/shall + V1

**Structure:**
- Positive: Subject + will/shall + V1 + Object
- Negative: Subject + will/shall + not + V1 + Object
- Question: Will/Shall + Subject + V1 + Object?

**Uses:**
1. Future actions without intention: The sun will shine tomorrow.
2. Predictions/assumptions: I think Sam will arrive at 6 pm.
3. Spontaneous decisions: I'll have a word with you.`,
        examples: [
            "I will call you tomorrow.",
            "She will not attend the meeting.",
            "Will you help me?",
            "They will arrive at noon."
        ],
        tips: [
            "Use 'shall' with I/we (formal) or 'will' for all subjects",
            "'Won't' is the contraction of 'will not'",
            "Use for promises, offers, predictions"
        ]
    },
    {
        id: "since-for",
        title: "Using Since and For",
        category: "Tenses",
        content: `**Since** is used with a specific point in time (when something started).
**For** is used with a duration/period of time (how long).

**Use SINCE with:**
- Morning, evening, yesterday
- Last year, past month
- Specific years: 1985, 2020
- Points in time: Monday, January, my birthday

**Use FOR with numbers:**
- 2 hours, 5 months, 6 years
- 4 nights, 2 days, 6 weeks
- A long time, ages, forever`,
        examples: [
            "I have lived here since 2010.",
            "I have lived here for 14 years.",
            "She has been working since morning.",
            "He has been waiting for 2 hours."
        ],
        tips: [
            "SINCE = point in time (when it started)",
            "FOR = duration (how long)",
            "Both are used with Perfect tenses"
        ]
    },

    // ARTICLES
    {
        id: "articles-intro",
        title: "Articles (A, An, The)",
        category: "Grammar",
        content: `Articles are short words that modify nouns like adjectives. There are two types:

**1. Definite Article: "The"**
- Refers to particular/specific nouns
- Used when identity is known
- Example: The cat sat on the couch.

**2. Indefinite Articles: "A" and "An"**
- Means "one", used with singular countable nouns
- "A" before consonant sounds: a book, a university
- "An" before vowel sounds: an apple, an hour

**Key Rules:**
- Rule 1: Singular count nouns - use 'a' if indefinite, 'the' if definite
- Rule 2: Plural count nouns - use 'the' or nothing, never 'a'
- Rule 3: Non-count nouns - use 'the' or nothing
- Rule 4: If followed by [of + noun], 'the' is preferred`,
        examples: [
            "I need a pen. (any pen)",
            "Give me the pen. (specific pen)",
            "An apple a day keeps the doctor away.",
            "The people of India speak different languages."
        ],
        tips: [
            "Use 'the' for unique things: the sun, the moon, the Earth",
            "No article for general statements: Dogs are loyal.",
            "Use 'the' with ordinal numbers: the first, the second"
        ]
    },

    // PREPOSITIONS
    {
        id: "prepositions-time",
        title: "Prepositions of Time (In, On, At)",
        category: "Grammar",
        content: `**AT** - for specific times
- At 7 o'clock, at noon, at midnight
- At lunchtime, at the moment

**ON** - for days and dates
- On Monday, on 25th May
- On Independence Day, on my birthday

**IN** - for longer periods
- In 1960, in January, in summer
- In the morning, in the evening`,
        examples: [
            "I was born in 1960.",
            "They will go to Delhi on 25th of May.",
            "The show will begin at 7 o'clock.",
            "He gets up early in the morning."
        ],
        tips: [
            "AT = specific time points",
            "ON = days and dates",
            "IN = months, years, seasons, parts of day"
        ]
    },
    {
        id: "prepositions-place",
        title: "Prepositions of Place (In, On, At)",
        category: "Grammar",
        content: `**IN** - for places with boundaries
- In New York, in the library, in the hall
- Inside enclosed spaces

**ON** - for surfaces
- On the table, on the blackboard, on the roof
- On top of something

**AT** - for specific points/locations
- At the entrance, at the bus stop
- At a specific address`,
        examples: [
            "She lives in New York.",
            "There are books on the table.",
            "Her parents were waiting at the entrance.",
            "He was flying a kite on the roof."
        ],
        tips: [
            "IN = enclosed space with boundaries",
            "ON = surface contact",
            "AT = specific point or location"
        ]
    },

    // ADJECTIVES AND ADVERBS
    {
        id: "adjectives-adverbs",
        title: "Adjectives and Adverbs",
        category: "Grammar",
        content: `**Adjectives** modify nouns and pronouns.
**Adverbs** modify verbs, adjectives, or other adverbs.

**Adjective Positions:**
- Attributive: before a noun (a large stadium)
- Predicative: after linking verb (The stadium is large)

**Adverb Formation:**
- Most adverbs: adjective + ly (quick → quickly)
- Y to I: easy → easily
- Consonant + le: probable → probably
- Ending in ic: magic → magically

**Same Form (Adjective = Adverb):**
- fast, long, early, hard`,
        examples: [
            "The quick fox jumped. (quick = adjective)",
            "The fox jumped quickly. (quickly = adverb)",
            "She is a good singer. (good = adjective)",
            "She sings well. (well = adverb)"
        ],
        tips: [
            "Good (adjective) → Well (adverb)",
            "Adjectives describe WHAT kind",
            "Adverbs describe HOW, WHEN, WHERE"
        ]
    },

    // CONJUNCTIONS
    {
        id: "conjunctions",
        title: "Conjunctions",
        category: "Grammar",
        content: `Conjunctions join words, phrases, and clauses together.

**1. Coordinating Conjunctions (FANBOYS):**
For, And, Nor, But, Or, Yet, So
- Join equal elements
- Example: She shouted for help, but nobody helped.

**2. Subordinating Conjunctions:**
- Time: after, before, when, while, until, as soon as
- Cause: because, since, as
- Condition: if, unless, provided that
- Contrast: although, though, even though

**3. Correlative Conjunctions (pairs):**
- both...and, either...or, neither...nor
- not only...but also, whether...or`,
        examples: [
            "The president arrived and hoisted the flag.",
            "I will meet him after I complete my work.",
            "She is neither polite nor funny.",
            "Since I have no money, I can't go to the movie."
        ],
        tips: [
            "FANBOYS = coordinating conjunctions",
            "Subordinating conjunctions create dependent clauses",
            "Correlative conjunctions always come in pairs"
        ]
    },

    // ACTIVE AND PASSIVE VOICE
    {
        id: "active-passive-voice",
        title: "Active and Passive Voice",
        category: "Grammar",
        content: `**Active Voice:** Subject performs the action.
**Passive Voice:** Subject receives the action.

**Converting Active to Passive:**
1. Identify Subject, Verb, Object (SVO)
2. Object becomes the new subject
3. Add appropriate be-form (is/am/are/was/were/been)
4. Change main verb to past participle (V3)
5. Add "by" + original subject (agent)

**Structure:**
- Active: Subject + Verb + Object
- Passive: Object + be + V3 + by + Subject`,
        examples: [
            "Active: The lion killed the deer.",
            "Passive: The deer was killed by the lion.",
            "Active: They paint the walls.",
            "Passive: The walls are painted by them."
        ],
        tips: [
            "Use passive when doer is unknown or unimportant",
            "Some verbs use 'to' instead of 'by' (known to me)",
            "Some use 'with' (pleased with), 'at' (surprised at)"
        ]
    },

    // DIRECT AND INDIRECT SPEECH
    {
        id: "direct-indirect-speech",
        title: "Direct and Indirect Speech",
        category: "Grammar",
        content: `**Direct Speech:** Quote exact words with quotation marks.
**Indirect Speech:** Report what was said without exact words.

**Changes when converting:**
1. Remove quotation marks, add "that"
2. Change pronouns (I → he/she)
3. Change tense (present → past)
4. Change time/place words (now → then, here → there)

**Tense Changes:**
- Simple Present → Simple Past
- Present Continuous → Past Continuous
- Present Perfect → Past Perfect
- Simple Past → Past Perfect`,
        examples: [
            "Direct: He said, 'I am happy.'",
            "Indirect: He said that he was happy.",
            "Direct: She said, 'I will come tomorrow.'",
            "Indirect: She said that she would come the next day."
        ],
        tips: [
            "Universal truths don't change tense",
            "said to → told (with object)",
            "Learn time/place word changes"
        ]
    },

    // DEGREES OF COMPARISON
    {
        id: "degrees-comparison",
        title: "Degrees of Comparison",
        category: "Grammar",
        content: `Adjectives and adverbs have three degrees:

**1. Positive Degree:** Basic form, no comparison
- Ravi is tall.

**2. Comparative Degree:** Comparing two things
- Roshan is taller than Ravi.

**3. Superlative Degree:** Comparing three or more
- Raghu is the tallest of all.

**Formation:**
- One syllable: add -er/-est (tall, taller, tallest)
- Ending in -e: add -r/-st (brave, braver, bravest)
- Ending in -y: change to -ier/-iest (happy, happier, happiest)
- 2+ syllables: use more/most (beautiful, more beautiful, most beautiful)

**Irregular:**
- good → better → best
- bad → worse → worst
- little → less → least`,
        examples: [
            "She is as smart as him. (Positive)",
            "She is smarter than him. (Comparative)",
            "She is the smartest in the class. (Superlative)",
            "Iron is more useful than any other metal."
        ],
        tips: [
            "Use 'than' with comparative degree",
            "Use 'the' with superlative degree",
            "Use 'as...as' for equal comparison"
        ]
    },

    // SENTENCE TYPES
    {
        id: "sentence-types",
        title: "Simple, Compound, and Complex Sentences",
        category: "Sentence Structure",
        content: `**Simple Sentence:**
- One subject and one predicate
- Contains one independent clause
- Example: I saw a pretty girl.

**Compound Sentence:**
- Two or more independent clauses
- Joined by coordinating conjunctions (FANBOYS)
- Example: I saw a girl and she was pretty.

**Complex Sentence:**
- One main clause + one or more subordinate clauses
- Uses subordinating conjunctions
- Example: I saw a girl who was pretty.

**Compound-Complex Sentence:**
- Combines both compound and complex forms
- Multiple independent and dependent clauses`,
        examples: [
            "Simple: Johnny rode his bike to school.",
            "Compound: She wanted vacation, so she saved money.",
            "Complex: She went to class even though she was sick.",
            "Compound-Complex: Although she felt guilty, she took her out, and they had fun."
        ],
        tips: [
            "Simple = 1 independent clause",
            "Compound = 2+ independent clauses (FANBOYS)",
            "Complex = 1 independent + 1+ dependent clause"
        ]
    },

    // EMAIL WRITING
    {
        id: "email-writing",
        title: "Professional Email Writing",
        category: "Writing Skills",
        content: `**Email Structure:**
1. From/To/CC/BCC
2. Subject Line - Clear and specific
3. Salutation - Dear Mr./Ms. [Name]
4. Body - Introduction, main content, closing
5. Sign-off - Regards, Sincerely
6. Signature

**Salutations:**
- Known person: Dear Mr. Sharma / Dear Rahul
- Unknown person: Dear Sir/Madam, To whom it may concern
- Group: Dear Team, Dear Students

**Formal vs Semi-formal:**
- Formal: Professional language, emotional neutral
- Semi-formal: Polite but friendly, for colleagues

**Useful Phrases:**
- "I am writing with regards to..."
- "I would appreciate if you could..."
- "Please feel free to contact me."
- "Looking forward to your reply."`,
        examples: [
            "Subject: Job Application - Software Engineer Position",
            "Dear Ms. Sharma, Thank you for connecting yesterday...",
            "I would like to inform you about the results...",
            "Best Regards, [Your Name]"
        ],
        tips: [
            "Keep subject lines clear and specific",
            "Be concise - one point per paragraph",
            "Always proofread for grammar and spelling",
            "Match tone to recipient (formal for superiors)"
        ]
    },

    // QUESTION TAGS
    {
        id: "question-tags",
        title: "Question Tags",
        category: "Grammar",
        content: `Question tags are short questions at the end of statements used to confirm something.

**Rules:**
1. Positive statement → Negative tag
2. Negative statement → Positive tag
3. Use auxiliary/modal verb from statement
4. Subject is always a pronoun

**Formation:**
- Statement + auxiliary + n't + pronoun?
- She can swim, can't she?

**Special Cases:**
- I am → aren't I?
- Let's → shall we?
- Imperative → will you? / can you?
- There is/are → isn't there? / aren't there?
- Somebody/Everyone → haven't they?`,
        examples: [
            "He is a good singer, isn't he?",
            "You can help me, can't you?",
            "She doesn't work hard, does she?",
            "Let's go to the beach, shall we?"
        ],
        tips: [
            "Positive sentence = negative tag",
            "Negative sentence = positive tag",
            "Match the tense of the main sentence"
        ]
    }
];

// ==================== QUIZZES ====================

export const quizzes: Quiz[] = [
    // Introduction to Tenses
    {
        id: "q0a",
        lessonId: "tenses-intro",
        question: "How many main tenses are there in English?",
        options: ["Two", "Three", "Four", "Five"],
        correctAnswer: 1,
        explanation: "There are three main tenses: Past, Present, and Future."
    },
    {
        id: "q0b",
        lessonId: "tenses-intro",
        question: "What are the four forms of each tense?",
        options: [
            "Active, Passive, Direct, Indirect",
            "Simple, Compound, Complex, Mixed",
            "Simple, Continuous, Perfect, Perfect Continuous",
            "Past, Present, Future, Conditional"
        ],
        correctAnswer: 2,
        explanation: "Each tense has four forms: Simple, Continuous, Perfect, and Perfect Continuous."
    },
    {
        id: "q0c",
        lessonId: "tenses-intro",
        question: "Which is the correct simple sentence structure?",
        options: [
            "Object + Verb + Subject",
            "Subject + Verb + Object",
            "Verb + Subject + Object",
            "Subject + Object + Verb"
        ],
        correctAnswer: 1,
        explanation: "The basic sentence structure in English is Subject + Verb + Object (SVO)."
    },
    {
        id: "q0d",
        lessonId: "tenses-intro",
        question: "Which of these is a singular subject?",
        options: ["We", "They", "She", "You"],
        correctAnswer: 2,
        explanation: "She, he, and it are singular subjects. We, they, and you are plural."
    },
    {
        id: "q0e",
        lessonId: "tenses-intro",
        question: "'Does he not eat apples?' is an example of:",
        options: ["Affirmative", "Negative", "Interrogative", "Interrogative Negative"],
        correctAnswer: 3,
        explanation: "Interrogative Negative sentences are questions with negative form: Does he not...?"
    },
    // Tenses Quizzes
    {
        id: "q1",
        lessonId: "present-simple",
        question: "Choose the correct form: He ___ to school every day.",
        options: ["go", "goes", "going", "went"],
        correctAnswer: 1,
        explanation: "With he/she/it in present simple, we add 's' to the verb. 'He goes' is correct."
    },
    {
        id: "q2",
        lessonId: "present-simple",
        question: "Which sentence is in Present Simple tense?",
        options: [
            "She is cooking dinner.",
            "She cooked dinner.",
            "She cooks dinner every day.",
            "She has cooked dinner."
        ],
        correctAnswer: 2,
        explanation: "Present Simple describes habitual actions. 'She cooks dinner every day' shows a regular habit."
    },
    {
        id: "q3",
        lessonId: "present-continuous",
        question: "Complete: They ___ TV right now.",
        options: ["watch", "watches", "are watching", "watched"],
        correctAnswer: 2,
        explanation: "Present Continuous (are + verb-ing) is used for actions happening now. 'Right now' indicates present moment."
    },
    {
        id: "q4",
        lessonId: "present-perfect",
        question: "Choose correct: She ___ to Paris three times.",
        options: ["has been", "have been", "was", "is"],
        correctAnswer: 0,
        explanation: "Present Perfect with 'has' for she/he/it. We use it for experiences up to now."
    },
    {
        id: "q5",
        lessonId: "past-simple",
        question: "The correct past form of 'go' is:",
        options: ["goed", "went", "gone", "going"],
        correctAnswer: 1,
        explanation: "'Go' is an irregular verb. Its past simple form is 'went'."
    },
    {
        id: "q6",
        lessonId: "since-for",
        question: "I have lived here ___ 2010.",
        options: ["for", "since", "from", "in"],
        correctAnswer: 1,
        explanation: "Use 'since' with a specific point in time (2010). Use 'for' with duration."
    },
    {
        id: "q7",
        lessonId: "since-for",
        question: "She has been waiting ___ two hours.",
        options: ["since", "for", "from", "at"],
        correctAnswer: 1,
        explanation: "Use 'for' with a duration/period of time (two hours)."
    },
    {
        id: "q8",
        lessonId: "articles-intro",
        question: "Choose correct article: I saw ___ elephant at the zoo.",
        options: ["a", "an", "the", "no article"],
        correctAnswer: 1,
        explanation: "'Elephant' starts with a vowel sound, so we use 'an'."
    },
    {
        id: "q9",
        lessonId: "articles-intro",
        question: "___ sun rises in the east.",
        options: ["A", "An", "The", "No article"],
        correctAnswer: 2,
        explanation: "Use 'the' for unique things. There is only one sun."
    },
    {
        id: "q10",
        lessonId: "prepositions-time",
        question: "The meeting is ___ Monday.",
        options: ["in", "on", "at", "by"],
        correctAnswer: 1,
        explanation: "Use 'on' with days of the week (on Monday, on Friday)."
    },
    {
        id: "q11",
        lessonId: "prepositions-time",
        question: "I was born ___ 1995.",
        options: ["on", "at", "in", "during"],
        correctAnswer: 2,
        explanation: "Use 'in' with years (in 1995, in 2020)."
    },
    {
        id: "q12",
        lessonId: "prepositions-time",
        question: "The train arrives ___ 3 o'clock.",
        options: ["in", "on", "at", "by"],
        correctAnswer: 2,
        explanation: "Use 'at' with specific times (at 3 o'clock, at noon)."
    },
    // Prepositions of Place
    {
        id: "q12a",
        lessonId: "prepositions-place",
        question: "The books are ___ the table.",
        options: ["in", "on", "at", "by"],
        correctAnswer: 1,
        explanation: "Use 'on' for surfaces. The books are on the table (surface contact)."
    },
    {
        id: "q12b",
        lessonId: "prepositions-place",
        question: "She lives ___ New York.",
        options: ["on", "at", "in", "by"],
        correctAnswer: 2,
        explanation: "Use 'in' for cities, countries, and enclosed spaces."
    },
    {
        id: "q12c",
        lessonId: "prepositions-place",
        question: "Meet me ___ the bus stop.",
        options: ["in", "on", "at", "into"],
        correctAnswer: 2,
        explanation: "Use 'at' for specific points or locations like bus stop, door, entrance."
    },
    {
        id: "q12d",
        lessonId: "prepositions-place",
        question: "The cat is hiding ___ the box.",
        options: ["on", "at", "in", "over"],
        correctAnswer: 2,
        explanation: "Use 'in' for enclosed spaces with boundaries."
    },
    {
        id: "q13",
        lessonId: "active-passive-voice",
        question: "Change to passive: The cat killed the mouse.",
        options: [
            "The mouse killed the cat.",
            "The mouse was killed by the cat.",
            "The mouse is killed by the cat.",
            "The cat was killed by the mouse."
        ],
        correctAnswer: 1,
        explanation: "Object becomes subject, use 'was + V3', add 'by' + original subject."
    },
    {
        id: "q14",
        lessonId: "direct-indirect-speech",
        question: "He said, 'I am happy.' Change to indirect speech:",
        options: [
            "He said that I am happy.",
            "He said that he is happy.",
            "He said that he was happy.",
            "He said that I was happy."
        ],
        correctAnswer: 2,
        explanation: "Change 'I' to 'he' and 'am' to 'was' (present to past tense)."
    },
    {
        id: "q15",
        lessonId: "degrees-comparison",
        question: "Which is correct?",
        options: [
            "She is more tall than him.",
            "She is taller than him.",
            "She is tallest than him.",
            "She is most tall than him."
        ],
        correctAnswer: 1,
        explanation: "For one-syllable adjectives, add '-er' for comparative: tall → taller."
    },
    {
        id: "q16",
        lessonId: "degrees-comparison",
        question: "This is the ___ book I have ever read.",
        options: ["good", "better", "best", "most good"],
        correctAnswer: 2,
        explanation: "'Good' has irregular forms: good → better → best. Use superlative with 'the'."
    },
    {
        id: "q17",
        lessonId: "conjunctions",
        question: "Which is a coordinating conjunction?",
        options: ["because", "although", "but", "when"],
        correctAnswer: 2,
        explanation: "'But' is a coordinating conjunction (FANBOYS: For, And, Nor, But, Or, Yet, So)."
    },
    {
        id: "q18",
        lessonId: "sentence-types",
        question: "Identify: 'She went to class even though she was sick.'",
        options: ["Simple", "Compound", "Complex", "Compound-Complex"],
        correctAnswer: 2,
        explanation: "Complex sentence: one independent clause + one dependent clause (even though she was sick)."
    },
    {
        id: "q19",
        lessonId: "question-tags",
        question: "She can swim, ___?",
        options: ["can she", "can't she", "couldn't she", "could she"],
        correctAnswer: 1,
        explanation: "Positive statement needs negative tag. 'She can swim, can't she?'"
    },
    {
        id: "q20",
        lessonId: "question-tags",
        question: "They don't like pizza, ___?",
        options: ["don't they", "do they", "didn't they", "does they"],
        correctAnswer: 1,
        explanation: "Negative statement needs positive tag. 'They don't like pizza, do they?'"
    },
    // More tenses quizzes
    {
        id: "q21",
        lessonId: "future-simple",
        question: "Choose correct: I ___ you tomorrow.",
        options: ["call", "called", "will call", "am calling"],
        correctAnswer: 2,
        explanation: "'Will + base verb' is used for future simple. 'Tomorrow' indicates future time."
    },
    {
        id: "q22",
        lessonId: "past-continuous",
        question: "What were you doing when I called? I ___ TV.",
        options: ["watch", "watched", "was watching", "am watching"],
        correctAnswer: 2,
        explanation: "Past Continuous describes an action in progress at a specific past time."
    },
    {
        id: "q23",
        lessonId: "adjectives-adverbs",
        question: "She sings ___. (Choose adverb)",
        options: ["beautiful", "beautifully", "beauty", "beautify"],
        correctAnswer: 1,
        explanation: "Adverbs modify verbs. Add '-ly' to adjective 'beautiful' to form adverb 'beautifully'."
    },
    {
        id: "q24",
        lessonId: "adjectives-adverbs",
        question: "He is a ___ driver. (Choose adjective)",
        options: ["carefully", "careful", "care", "caring"],
        correctAnswer: 1,
        explanation: "Adjectives modify nouns. 'Careful' describes the noun 'driver'."
    },
    // Email Writing Quizzes
    {
        id: "q25",
        lessonId: "email-writing",
        question: "Which is the correct format for a formal email greeting?",
        options: ["Hey!", "Dear Sir/Madam,", "Yo!", "What's up?"],
        correctAnswer: 1,
        explanation: "Formal emails should start with 'Dear Sir/Madam,' or 'Dear Mr./Ms. [Name],'."
    },
    {
        id: "q26",
        lessonId: "email-writing",
        question: "What should you include in a professional email subject line?",
        options: ["Nothing, leave it empty", "Just 'Hi'", "A clear, specific topic", "Your full life story"],
        correctAnswer: 2,
        explanation: "Subject lines should be clear and specific so the recipient knows what the email is about."
    },
    {
        id: "q27",
        lessonId: "email-writing",
        question: "Which is an appropriate formal email closing?",
        options: ["Later!", "Sincerely,", "Bye-bye!", "XOXO"],
        correctAnswer: 1,
        explanation: "Formal email closings include: Sincerely, Best regards, Kind regards, Yours faithfully."
    },
    {
        id: "q28",
        lessonId: "email-writing",
        question: "In a formal email requesting information, you should use:",
        options: ["'Give me the info NOW!'", "'I would appreciate if you could provide...'", "'Send stuff'", "'?????'"],
        correctAnswer: 1,
        explanation: "Use polite expressions like 'I would appreciate' or 'Could you please' in formal requests."
    },
    {
        id: "q29",
        lessonId: "email-writing",
        question: "When writing a complaint email, you should:",
        options: ["Use all capital letters", "Be polite but firm", "Include insults", "Write in one long sentence"],
        correctAnswer: 1,
        explanation: "Even in complaints, maintain professionalism. Be polite but clearly state the issue and desired resolution."
    }
];

// ==================== FLASHCARDS ====================

export const flashcards: Flashcard[] = [
    // Tense Formulas
    { id: "f1", category: "Tenses", front: "Present Simple Formula", back: "Subject + V1/V1+s (He goes, They go)" },
    { id: "f2", category: "Tenses", front: "Present Continuous Formula", back: "Subject + is/am/are + V1+ing (He is going)" },
    { id: "f3", category: "Tenses", front: "Present Perfect Formula", back: "Subject + has/have + V3 (He has gone)" },
    { id: "f4", category: "Tenses", front: "Present Perfect Continuous Formula", back: "Subject + has/have + been + V1+ing (He has been going)" },
    { id: "f5", category: "Tenses", front: "Past Simple Formula", back: "Subject + V2 (He went)" },
    { id: "f6", category: "Tenses", front: "Past Continuous Formula", back: "Subject + was/were + V1+ing (He was going)" },
    { id: "f7", category: "Tenses", front: "Past Perfect Formula", back: "Subject + had + V3 (He had gone)" },
    { id: "f8", category: "Tenses", front: "Future Simple Formula", back: "Subject + will/shall + V1 (He will go)" },

    // Since vs For
    { id: "f9", category: "Tenses", front: "When to use SINCE?", back: "With a point in time: since Monday, since 2010, since morning" },
    { id: "f10", category: "Tenses", front: "When to use FOR?", back: "With a duration: for 2 hours, for 5 years, for a long time" },

    // Articles
    { id: "f11", category: "Grammar", front: "When to use 'A'?", back: "Before consonant sounds: a book, a cat, a university" },
    { id: "f12", category: "Grammar", front: "When to use 'AN'?", back: "Before vowel sounds: an apple, an hour, an umbrella" },
    { id: "f13", category: "Grammar", front: "When to use 'THE'?", back: "For specific/known nouns, unique things: the sun, the book on the table" },

    // Prepositions
    { id: "f14", category: "Grammar", front: "AT (time)", back: "Specific times: at 7 o'clock, at noon, at midnight" },
    { id: "f15", category: "Grammar", front: "ON (time)", back: "Days and dates: on Monday, on 25th May, on my birthday" },
    { id: "f16", category: "Grammar", front: "IN (time)", back: "Longer periods: in 1990, in January, in summer, in the morning" },
    { id: "f17", category: "Grammar", front: "IN (place)", back: "Enclosed spaces: in the room, in New York, in the box" },
    { id: "f18", category: "Grammar", front: "ON (place)", back: "Surfaces: on the table, on the wall, on the floor" },
    { id: "f19", category: "Grammar", front: "AT (place)", back: "Specific points: at the door, at the bus stop, at home" },

    // Conjunctions
    { id: "f20", category: "Grammar", front: "FANBOYS", back: "Coordinating Conjunctions: For, And, Nor, But, Or, Yet, So" },
    { id: "f21", category: "Grammar", front: "Subordinating Conjunctions", back: "because, although, if, when, while, after, before, unless, since" },
    { id: "f22", category: "Grammar", front: "Correlative Conjunctions", back: "both...and, either...or, neither...nor, not only...but also" },

    // Irregular Verbs
    { id: "f23", category: "Verbs", front: "go - went - ?", back: "go - went - gone" },
    { id: "f24", category: "Verbs", front: "eat - ate - ?", back: "eat - ate - eaten" },
    { id: "f25", category: "Verbs", front: "write - wrote - ?", back: "write - wrote - written" },
    { id: "f26", category: "Verbs", front: "buy - bought - ?", back: "buy - bought - bought" },
    { id: "f27", category: "Verbs", front: "drive - drove - ?", back: "drive - drove - driven" },
    { id: "f28", category: "Verbs", front: "speak - spoke - ?", back: "speak - spoke - spoken" },
    { id: "f29", category: "Verbs", front: "take - took - ?", back: "take - took - taken" },
    { id: "f30", category: "Verbs", front: "see - saw - ?", back: "see - saw - seen" },

    // Degrees of Comparison
    { id: "f31", category: "Grammar", front: "good - better - ?", back: "good - better - best" },
    { id: "f32", category: "Grammar", front: "bad - worse - ?", back: "bad - worse - worst" },
    { id: "f33", category: "Grammar", front: "little - less - ?", back: "little - less - least" },
    { id: "f34", category: "Grammar", front: "much/many - more - ?", back: "much/many - more - most" },

    // Sentence Types
    { id: "f35", category: "Sentence Structure", front: "Simple Sentence", back: "One subject + one predicate = one independent clause" },
    { id: "f36", category: "Sentence Structure", front: "Compound Sentence", back: "Two or more independent clauses joined by FANBOYS" },
    { id: "f37", category: "Sentence Structure", front: "Complex Sentence", back: "One independent clause + one or more dependent clauses" },

    // Voice
    { id: "f38", category: "Grammar", front: "Active Voice Structure", back: "Subject + Verb + Object (The cat killed the mouse)" },
    { id: "f39", category: "Grammar", front: "Passive Voice Structure", back: "Object + be + V3 + by + Subject (The mouse was killed by the cat)" },

    // Question Tags
    { id: "f40", category: "Grammar", front: "Question Tag Rule", back: "Positive statement → Negative tag | Negative statement → Positive tag" }
];

// ==================== CATEGORIES ====================

export const categories = [
    { id: "tenses", name: "Tenses", icon: "clock", color: "blue" },
    { id: "grammar", name: "Grammar", icon: "book", color: "green" },
    { id: "sentence-structure", name: "Sentence Structure", icon: "layout", color: "purple" },
    { id: "writing-skills", name: "Writing Skills", icon: "edit", color: "orange" },
    { id: "verbs", name: "Verbs", icon: "zap", color: "red" }
];

// Sara's curriculum knowledge for AI training
export const saraCurriculumPrompt = `
You are Sara, an English teacher. You have deep knowledge of English grammar based on this curriculum:

**TENSES (12 Types):**
- Present: Simple (V1), Continuous (am/is/are + ing), Perfect (has/have + V3), Perfect Continuous (has/have been + ing)
- Past: Simple (V2), Continuous (was/were + ing), Perfect (had + V3), Perfect Continuous (had been + ing)
- Future: Simple (will + V1), Continuous (will be + ing), Perfect (will have + V3), Perfect Continuous (will have been + ing)

**Key Rules:**
- Since = point in time (since 2010)
- For = duration (for 5 years)
- Prepositions: AT (specific time/point), ON (days/surfaces), IN (periods/enclosed spaces)
- Articles: A (consonant sounds), AN (vowel sounds), THE (specific/unique)
- FANBOYS = Coordinating Conjunctions (For, And, Nor, But, Or, Yet, So)

**Voice:**
- Active: Subject + Verb + Object
- Passive: Object + be + V3 + by + Subject

**Degrees of Comparison:**
- Positive: tall, good, beautiful
- Comparative: taller, better, more beautiful
- Superlative: tallest, best, most beautiful

**Question Tags:**
- Positive statement → Negative tag (She can swim, can't she?)
- Negative statement → Positive tag (He doesn't work, does he?)

When students make grammar mistakes, gently correct them using these rules. Give examples from this curriculum.
`;
