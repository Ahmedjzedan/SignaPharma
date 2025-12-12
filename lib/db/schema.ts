import { sqliteTable, text, integer, primaryKey, unique } from 'drizzle-orm/sqlite-core';
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
  lastStudyDate: integer('last_study_date', { mode: 'timestamp' }),
  elo: integer('elo').default(1500),
  casesSolved: integer('cases_solved').default(0),
  rank: text('rank').default('Novice'),
  scientificBackground: text('scientific_background'), // 'Layperson', 'Student', 'Professional'
  bio: text('bio'),
  linkedin: text('linkedin'),
  github: text('github'),
  instagram: text('instagram'),
  telegram: text('telegram'),
  pinnedTrophies: text('pinned_trophies'), // JSON array of trophy IDs
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  isBanned: integer('is_banned', { mode: 'boolean' }).default(false),
});

export const reports = sqliteTable('reports', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  reporterId: text('reporter_id').references(() => users.id),
  targetId: text('target_id').notNull(), // ID of the reported item (blog, case, user)
  targetType: text('target_type').notNull(), // 'blog', 'case', 'user', 'comment'
  reason: text('reason').notNull(),
  status: text('status').default('pending'), // 'pending', 'resolved', 'dismissed'
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

// Manufacturers
export const manufacturers = sqliteTable('manufacturers', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
});

// Drug Classes
export const drugClasses = sqliteTable('drug_classes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
});

// Drugs (Library)
export const drugs = sqliteTable('drugs', {
  id: text('id').primaryKey(),
  brandName: text('brand_name').notNull(),
  genericName: text('generic_name').notNull(),
  manufacturerId: text('manufacturer_id').references(() => manufacturers.id),
  classId: text('class_id').references(() => drugClasses.id),
  description: text('description'), // Can be derived from indications if needed, or kept as general summary
  category: text('category'), // Keeping for backward compatibility or broader grouping
  imageUrl: text('image_url'),
  mechanismOfAction: text('mechanism_of_action'),
  sideEffects: text('side_effects'), // JSON string or simple text
  boxedWarning: text('boxed_warning'),
  formula: text('formula'), // Active Ingredient
  indicationsAndUsage: text('indications_and_usage'),
  dosageAndAdministration: text('dosage_and_administration'),
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
  views: integer('views').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

// Comments
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  authorId: text('author_id').references(() => users.id),
  parentId: text('parent_id'), // Self-reference not strictly enforced by SQLite FK in same table usually, but good to have field
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
  authorId: text('author_id').references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  difficulty: integer('difficulty').notNull(), // ELO rating
  category: text('category').notNull(),
  specialty: text('specialty'), // 'Cardio', 'ID', etc.
  scenarioType: text('scenario_type'), // 'Diagnosis', 'Management', etc.
  targetAudience: text('target_audience').default('General'), // 'Layperson', 'General', 'Professional'
  pattern: text('pattern'), // e.g., "Hypotension", "Toxidrome"
  medicines: text('medicines'), // JSON array of related drugs
  patientData: text('patient_data').notNull(), // JSON object: { name, dob, age, allergy, vitals: {}, history: {} }
  scenario: text('scenario').notNull(), // JSON object: { doctorName, doctorImage, prompt }
  quiz: text('quiz').notNull(), // JSON object: { options: [], feedback: {} }
  status: text('status').default('approved'), // 'pending', 'approved', 'rejected'
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

// Recent Cases (Temporary Solved)
export const recentCases = sqliteTable('recent_cases', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  caseId: text('case_id').references(() => cases.id, { onDelete: 'cascade' }),
  solvedAt: integer('solved_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Saved Posts
export const savedPosts = sqliteTable('saved_posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  savedAt: integer('saved_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (t) => ({
  unq: unique().on(t.userId, t.postId),
}));

// Post Likes
export const postLikes = sqliteTable('post_likes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  likedAt: integer('liked_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
}, (t) => ({
  unq: unique().on(t.userId, t.postId),
}));

// Drug Requests
export const drugRequests = sqliteTable('drug_requests', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id),
  drugName: text('drug_name').notNull(),
  status: text('status').default('pending'), // 'pending', 'approved', 'rejected'
  adminFeedback: text('admin_feedback'),
  createdDrugId: text('created_drug_id').references(() => drugs.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// Relations
import { relations } from 'drizzle-orm';

export const drugRequestsRelations = relations(drugRequests, ({ one }) => ({
  user: one(users, {
    fields: [drugRequests.userId],
    references: [users.id],
  }),
  createdDrug: one(drugs, {
    fields: [drugRequests.createdDrugId],
    references: [drugs.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(postLikes),
  savedPosts: many(savedPosts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(postLikes),
  savedPosts: many(savedPosts),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'child_comments',
  }),
  replies: many(comments, {
    relationName: 'child_comments',
  }),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const savedPostsRelations = relations(savedPosts, ({ one }) => ({
  post: one(posts, {
    fields: [savedPosts.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [savedPosts.userId],
    references: [users.id],
  }),
}));

export const manufacturersRelations = relations(manufacturers, ({ many }) => ({
  drugs: many(drugs),
}));

export const drugClassesRelations = relations(drugClasses, ({ many }) => ({
  drugs: many(drugs),
}));

export const drugsRelations = relations(drugs, ({ one, many }) => ({
  manufacturer: one(manufacturers, {
    fields: [drugs.manufacturerId],
    references: [manufacturers.id],
  }),
  class: one(drugClasses, {
    fields: [drugs.classId],
    references: [drugClasses.id],
  }),
  savedBy: many(savedDrugs),
}));

// Force rebuild
