import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  role: text('role').default('student'), // student, pharmacist, admin
  xp: integer('xp').default(0),
  streak: integer('streak').default(0),
  rank: text('rank').default('Novice'),
  bio: text('bio'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

// Drugs (Library)
export const drugs = sqliteTable('drugs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  mechanismOfAction: text('mechanism_of_action'),
  sideEffects: text('side_effects'), // JSON string or simple text
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// User Saved Drugs
export const savedDrugs = sqliteTable('saved_drugs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  drugId: text('drug_id').references(() => drugs.id),
  savedAt: integer('saved_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Posts (Blog/Rants)
export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').references(() => users.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category'),
  imageUrl: text('image_url'),
  likes: integer('likes').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Comments
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id),
  authorId: text('author_id').references(() => users.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Subjects (Study)
export const subjects = sqliteTable('subjects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
});

// Modules
export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(),
  subjectId: text('subject_id').references(() => subjects.id),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
});

// Quizzes
export const quizzes = sqliteTable('quizzes', {
  id: text('id').primaryKey(),
  moduleId: text('module_id').references(() => modules.id),
  title: text('title').notNull(),
  questions: text('questions').notNull(), // JSON string of questions
});

// Quiz Results
export const quizResults = sqliteTable('quiz_results', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  quizId: text('quiz_id').references(() => quizzes.id),
  score: integer('score').notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Cases
export const cases = sqliteTable('cases', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  difficulty: integer('difficulty').notNull(), // ELO rating
  category: text('category').notNull(),
  pattern: text('pattern'), // e.g., "Hypotension", "Toxidrome"
  medicines: text('medicines'), // JSON array of related drugs
  patientData: text('patient_data').notNull(), // JSON object: { name, dob, age, allergy, vitals: {}, history: {} }
  scenario: text('scenario').notNull(), // JSON object: { doctorName, doctorImage, prompt }
  quiz: text('quiz').notNull(), // JSON object: { options: [], feedback: {} }
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
