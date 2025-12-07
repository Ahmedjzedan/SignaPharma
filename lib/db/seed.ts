import 'dotenv/config';
import { db } from './index';
import { users, drugs, posts, subjects, modules, quizzes, cases } from './schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Create a default user (Dr. House)
  const userId = uuidv4();
  await db.insert(users).values({
    id: userId,
    name: 'Dr. Gregory House',
    email: 'house@princeton-plainsboro.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=House',
    role: 'admin',
    bio: 'I solve puzzles. I don\'t talk to patients. It\'s not lupus.',
    xp: 2450,
    rank: 'Diagnostician',
    streak: 12,
  }).onConflictDoNothing();

  console.log('✅ User seeded');

  // 2. Seed Drugs
  const drugsData = [
    {
      id: uuidv4(),
      name: 'Lisinopril',
      description: 'An ACE inhibitor used to treat high blood pressure and heart failure.',
      category: 'Cardiovascular',
      imageUrl: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Lisinopril',
      mechanismOfAction: 'Inhibits angiotensin-converting enzyme (ACE), preventing conversion of angiotensin I to angiotensin II.',
      sideEffects: JSON.stringify(['Dry Cough', 'Hyperkalemia', 'Angioedema', 'Dizziness']),
    },
    {
      id: uuidv4(),
      name: 'Atorvastatin',
      description: 'A statin medication used to prevent cardiovascular disease and treat abnormal lipid levels.',
      category: 'Cardiovascular',
      imageUrl: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Atorvastatin',
      mechanismOfAction: 'Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol biosynthesis.',
      sideEffects: JSON.stringify(['Myopathy', 'Rhabdomyolysis', 'Hepatotoxicity', 'Digestive Upset']),
    },
    {
      id: uuidv4(),
      name: 'Metformin',
      description: 'First-line medication for the treatment of type 2 diabetes.',
      category: 'Endocrine',
      imageUrl: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Metformin',
      mechanismOfAction: 'Decreases hepatic glucose production, decreases intestinal absorption of glucose, and improves insulin sensitivity.',
      sideEffects: JSON.stringify(['Diarrhea', 'Nausea', 'Lactic Acidosis (Rare)', 'B12 Deficiency']),
    },
  ];

  for (const drug of drugsData) {
    await db.insert(drugs).values(drug).onConflictDoNothing();
  }
  console.log('✅ Drugs seeded');

  // 3. Seed Posts
  const postsData = [
    {
      id: uuidv4(),
      authorId: userId,
      title: 'Why "Clinical Judgement" is Just Fancy Guessing',
      content: 'We pretend it\'s evidence-based, but half the time we\'re just vibing. The guidelines say one thing, the patient says another, and the insurance company says "Prior Auth Required".',
      category: 'Opinion',
      imageUrl: 'https://placehold.co/600x400/f1f5f9/475569?text=Clinical+Judgement',
      likes: 142,
    },
    {
      id: uuidv4(),
      authorId: userId,
      title: 'Night Shift Survival Guide: Caffeine & Spite',
      content: 'How to maintain a circadian rhythm when your body thinks it\'s dying. Step 1: Coffee. Step 2: More Coffee. Step 3: Question your life choices.',
      category: 'Lifestyle',
      imageUrl: 'https://placehold.co/600x400/f1f5f9/475569?text=Night+Shift',
      likes: 89,
    },
    {
      id: uuidv4(),
      authorId: userId,
      title: '2025 Hypertension Guidelines: Salt is Back?',
      content: 'Just kidding. But the new beta-blocker positioning is actually interesting. Let\'s dive into the JNC 9 (or whatever number we are on now).',
      category: 'Clinical',
      imageUrl: 'https://placehold.co/600x400/f1f5f9/475569?text=HTN+Guidelines',
      likes: 204,
    },
  ];

  for (const post of postsData) {
    await db.insert(posts).values(post).onConflictDoNothing();
  }
  console.log('✅ Posts seeded');

  // 4. Seed Subjects & Modules
  const subjectId = uuidv4();
  await db.insert(subjects).values({
    id: subjectId,
    name: 'Renal Physiology',
    description: 'The study of kidney function, filtration, and reabsorption.',
    icon: 'Activity',
  }).onConflictDoNothing();

  const moduleId = uuidv4();
  await db.insert(modules).values({
    id: moduleId,
    subjectId: subjectId,
    title: 'Glomerular Filtration Rate (GFR)',
    description: 'Understanding the physics of filtration and Starling forces.',
    order: 1,
  }).onConflictDoNothing();

  await db.insert(quizzes).values({
    id: uuidv4(),
    moduleId: moduleId,
    title: 'GFR Mastery Check',
    questions: JSON.stringify([
      {
        question: 'If you constrict the Efferent Arteriole, what initially happens to GFR?',
        options: ['Decreases', 'Increases', 'Stays the same'],
        correctAnswer: 'Increases',
      },
      {
        question: 'Which force primarily opposes filtration?',
        options: ['Hydrostatic Pressure', 'Bowman\'s Space Pressure', 'Plasma Oncotic Pressure'],
        correctAnswer: 'Plasma Oncotic Pressure',
      }
    ]),
  }).onConflictDoNothing();

  console.log('✅ Study content seeded');

  // 5. Seed Cases
  const casesData = [
    {
      id: '1402',
      title: 'The Dizzy Grandma',
      description: 'Elderly patient with polypharmacy presenting with dizziness.',
      difficulty: 1200,
      category: 'Geriatrics',
      pattern: 'Hypotension',
      medicines: JSON.stringify(['Lisinopril', 'HCTZ', 'Metformin']),
      patientData: JSON.stringify({
        name: "Mrs. Edith Miller",
        dob: "12/04/1951",
        age: 73,
        allergy: "PCN",
        vitals: {
          hr: 112,
          bp: "88/52",
          temp: 37.2,
        },
        history: {
          hpi: "Patient presents to ED via ambulance c/o extreme dizziness and generalized weakness starting 2 hours ago. Found by daughter on bathroom floor.",
          pmh: [
            "Hypertension (HTN)",
            "Type 2 Diabetes (T2DM)",
            "Chronic Kidney Disease (Stage 3)",
          ],
          meds: [
            "Lisinopril 40mg daily",
            "Metformin 1000mg BID",
            "Amlodipine 10mg daily",
            "HCTZ 25mg daily (Refill picked up yesterday)",
          ],
        },
        progress: {
          current: 1,
          total: 3,
        },
      }),
      scenario: JSON.stringify({
        doctorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=House&eyebrows=angry&mouth=serious",
        doctorName: "Attending Physician (Dr. Grumpy)",
        prompt: "Look at those vitals. She's hypotensive, tachycardia, and dry as a bone. How would you treat her, or are you trying to lower the population today?",
      }),
      quiz: JSON.stringify({
        options: [
          {
            id: "option1",
            label: "Option A",
            text: "Administer Lisinopril 40mg PO to control rate.",
            isCorrect: false,
          },
          {
            id: "option2",
            label: "Option B",
            text: "Hold antihypertensives, start IV fluids (Normal Saline).",
            isCorrect: true,
          },
          {
            id: "option3",
            label: "Option C",
            text: "Start Metoprolol 5mg IV push.",
            isCorrect: false,
          },
          {
            id: "option4",
            label: "Option D",
            text: "Discharge home with instructions to drink water.",
            isCorrect: false,
          },
        ],
        feedback: {
          success: {
            title: "Saved her.",
            message: "Insurance hates you because staying in the hospital is expensive, but good job. She was dehydrated and over-medicated. Holding the ACE/Diuretic and giving fluids fixed the perfusion.",
          },
          fail: {
            title: "Congrats, she's dead.",
            message: "Stick to retail? You just gave a hypotensive patient (BP 88/52) more antihypertensives. You bottomed out her pressure and caused organ failure. Great work.",
          },
        },
      }),
    },
    {
      id: '1403',
      title: 'Tylenol Trouble',
      description: 'Teenager with intentional overdose.',
      difficulty: 1400,
      category: 'Toxicology',
      pattern: 'Hepatotoxicity',
      medicines: JSON.stringify(['Acetaminophen', 'NAC']),
      patientData: JSON.stringify({
        name: "Tyler Noll",
        dob: "05/12/2008",
        age: 16,
        allergy: "NKDA",
        vitals: {
          hr: 90,
          bp: "118/72",
          temp: 36.8,
        },
        history: {
          hpi: "16yo male brought in by parents after admitting to ingesting 'a handful' of pills 4 hours ago. Bottle found was Extra Strength Tylenol.",
          pmh: ["Depression", "Asthma"],
          meds: ["Albuterol PRN", "Sertraline 50mg daily"],
        },
        progress: {
          current: 1,
          total: 1,
        },
      }),
      scenario: JSON.stringify({
        doctorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cuddy",
        doctorName: "Dr. Cuddy",
        prompt: "4 hour level came back at 180 mcg/mL. Rumack-Matthew nomogram says treat. What is the antidote?",
      }),
      quiz: JSON.stringify({
        options: [
          {
            id: "opt1",
            label: "Option A",
            text: "Naloxone (Narcan)",
            isCorrect: false,
          },
          {
            id: "opt2",
            label: "Option B",
            text: "N-acetylcysteine (NAC)",
            isCorrect: true,
          },
          {
            id: "opt3",
            label: "Option C",
            text: "Flumazenil",
            isCorrect: false,
          },
          {
            id: "opt4",
            label: "Option D",
            text: "Activated Charcoal",
            isCorrect: false,
          },
        ],
        feedback: {
          success: {
            title: "Correct.",
            message: "NAC replenishes glutathione stores and prevents hepatic necrosis. Good catch on the timing.",
          },
          fail: {
            title: "Liver Failure Imminent.",
            message: "That is not the antidote. The patient's liver is now failing while you guess random drugs.",
          },
        },
      }),
    },
    {
      id: '1404',
      title: 'Septic Shock Surprise',
      description: 'ICU admission with hypotension and fever.',
      difficulty: 1600,
      category: 'Critical Care',
      pattern: 'Sepsis',
      medicines: JSON.stringify(['Norepinephrine', 'Vancomycin', 'Zosyn']),
      patientData: JSON.stringify({
        name: "John Doe",
        dob: "01/01/1960",
        age: 64,
        allergy: "Sulfa",
        vitals: {
          hr: 130,
          bp: "70/40",
          temp: 39.5,
        },
        history: {
          hpi: "Admitted from nursing home with fever and altered mental status. Lactate is 4.2.",
          pmh: ["Stroke", "Dementia", "BPH"],
          meds: ["Aspirin", "Donepezil", "Tamsulosin"],
        },
        progress: {
          current: 1,
          total: 2,
        },
      }),
      scenario: JSON.stringify({
        doctorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chase",
        doctorName: "Dr. Chase",
        prompt: "Fluids didn't touch the pressure. MAP is still 50. We need a pressor. What's first line for septic shock?",
      }),
      quiz: JSON.stringify({
        options: [
          {
            id: "opt1",
            label: "Option A",
            text: "Dopamine",
            isCorrect: false,
          },
          {
            id: "opt2",
            label: "Option B",
            text: "Epinephrine",
            isCorrect: false,
          },
          {
            id: "opt3",
            label: "Option C",
            text: "Norepinephrine (Levophed)",
            isCorrect: true,
          },
          {
            id: "opt4",
            label: "Option D",
            text: "Phenylephrine",
            isCorrect: false,
          },
        ],
        feedback: {
          success: {
            title: "Solid choice.",
            message: "Levophed leave 'em dead? Not today. It's the gold standard for septic shock.",
          },
          fail: {
            title: "Wrong pressor.",
            message: "Dopamine is arrhythmogenic and Epi is second line. You need Norepi.",
          },
        },
      }),
    }
  ];

  for (const c of casesData) {
    await db.insert(cases).values(c).onConflictDoNothing();
  }
  console.log('✅ Cases seeded');

  console.log('🌱 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
