import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Products table
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  images: text('images', { mode: 'json' }).notNull(),
  material: text('material'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  isNew: integer('is_new', { mode: 'boolean' }).default(false),
  isBestseller: integer('is_bestseller', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Gallery works table
export const galleryWorks = sqliteTable('gallery_works', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  image: text('image').notNull(),
  title: text('title').notNull(),
  orderIndex: integer('order_index').default(0),
  createdAt: text('created_at').notNull(),
});

// Testimonials table
export const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  rating: integer('rating').notNull(),
  text: text('text').notNull(),
  image: text('image').notNull(),
  date: text('date').notNull(),
  isFeatured: integer('is_featured', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
});

// FAQs table
export const faqs = sqliteTable('faqs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  orderIndex: integer('order_index').default(0),
  isPublished: integer('is_published', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
});

// Contact submissions table
export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  message: text('message'),
  status: text('status').default('new'),
  createdAt: text('created_at').notNull(),
});

// Newsletter subscribers table
export const newsletterSubscribers = sqliteTable('newsletter_subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  subscribedAt: text('subscribed_at').notNull(),
  unsubscribedAt: text('unsubscribed_at'),
});

// Add new equipment table
export const equipment = sqliteTable('equipment', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  power: text('power').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  features: text('features', { mode: 'json' }).notNull(),
  specifications: text('specifications', { mode: 'json' }),
  price: integer('price').notNull(),
  imageUrl: text('image_url').notNull(),
  createdAt: text('created_at').notNull(),
});

// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});