import 'dotenv/config';
import { db } from './index';
import { users, drugs, posts, subjects, modules, quizzes, cases } from './schema';
import { casesData } from './cases_data';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Create or Get default user (Dr. House)
  let userId = 'house-md-id';
  const existingUser = await db.select().from(users).where(eq(users.email, 'house@princeton-plainsboro.com')).get();

  if (existingUser) {
    userId = existingUser.id;
    console.log('ℹ️ User already exists, using ID:', userId);
  } else {
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
    });
    console.log('✅ User created with ID:', userId);
  }

  console.log('✅ User seeded');

  // 2. Seed Drugs
  const drugsData = [
    {
      id: uuidv4(),
      brandName: 'Prinivil',
      genericName: 'Lisinopril',
      description: 'An ACE inhibitor used to treat high blood pressure and heart failure.',
      category: 'Cardiovascular',
      imageUrl: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Lisinopril',
      mechanismOfAction: 'Inhibits angiotensin-converting enzyme (ACE), preventing conversion of angiotensin I to angiotensin II.',
      sideEffects: JSON.stringify(['Dry Cough', 'Hyperkalemia', 'Angioedema', 'Dizziness']),
    },
    {
      id: uuidv4(),
      brandName: 'Lipitor',
      genericName: 'Atorvastatin',
      description: 'A statin medication used to prevent cardiovascular disease and treat abnormal lipid levels.',
      category: 'Cardiovascular',
      imageUrl: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Atorvastatin',
      mechanismOfAction: 'Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol biosynthesis.',
      sideEffects: JSON.stringify(['Myopathy', 'Rhabdomyolysis', 'Hepatotoxicity', 'Digestive Upset']),
    },
    {
      id: uuidv4(),
      brandName: 'Glucophage',
      genericName: 'Metformin',
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
  console.log('🗑️  Clearing existing cases...');
  await db.delete(cases);

  console.log('🌱 Seeding new cases...');
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
