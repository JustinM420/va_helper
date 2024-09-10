import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  date,
} from "drizzle-orm/pg-core";

// Enum for user system roles
export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);

// User Profile Table
export const userProfiles = pgTable("user_profiles", {
  userId: varchar("user_id", { length: 256 }).primaryKey(),
  ssn: varchar("ssn", { length: 11 }).notNull(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }),  // Optional
  street: text("street"),  // Optional
  city: varchar("city", { length: 256 }),  // Optional
  state: varchar("state", { length: 2 }),  // Optional
  zipCode: varchar("zip_code", { length: 10 }),  // Optional
  disabilityRating: integer("disability_rating"),  // Optional
});

// Chat Table (linked with userProfiles)
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => userProfiles.userId, { onDelete: "cascade" }),  // Cascade delete on userProfile deletion
  fileKey: text("file_key").notNull(),
});

// Messages Table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id, { onDelete: "cascade" })  // Cascade delete on chat deletion
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});

// Claims Table (linked with userProfiles)
export const claims = pgTable("claims", {
  claimId: serial("claim_id").primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => userProfiles.userId, { onDelete: "cascade" }),  // Cascade delete on userProfile deletion
  claimType: varchar("claim_type", { length: 256 }).notNull(),
  claimStatus: varchar("claim_status", { length: 256 }).notNull(),
  dateSubmitted: timestamp("date_submitted").notNull(),
  claimDecision: varchar("claim_decision", { length: 256 }),  // Optional
  dateOfLastUpdate: timestamp("date_of_last_update").notNull(),
});

// Claim Documents Table (linked with Claims)
export const claimDocuments = pgTable("claim_documents", {
  documentId: serial("document_id").primaryKey(),
  claimId: integer("claim_id")
    .references(() => claims.claimId, { onDelete: "cascade" })  // Cascade delete on claim deletion
    .notNull(),
  documentType: varchar("document_type", { length: 256 }).notNull(),
  dateSubmitted: timestamp("date_submitted").notNull(),
  description: text("description"),  // Optional
});

// Appeals Table (linked with userProfiles)
export const appeals = pgTable("appeals", {
  appealId: serial("appeal_id").primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => userProfiles.userId, { onDelete: "cascade" }),  // Cascade delete on userProfile deletion
  appealType: varchar("appeal_type", { length: 256 }).notNull(),
  appealStatus: varchar("appeal_status", { length: 256 }).notNull(),
  dateFiled: timestamp("date_filed").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
  assignedVeteranLawJudge: varchar("assigned_veteran_law_judge", { length: 256 }),  // Optional
  appealStage: varchar("appeal_stage", { length: 256 }),  // Optional
});

// Appeal Issues Table (linked with Appeals)
export const appealIssues = pgTable("appeal_issues", {
  issueId: serial("issue_id").primaryKey(),
  appealId: integer("appeal_id")
    .references(() => appeals.appealId, { onDelete: "cascade" })  // Cascade delete on appeal deletion
    .notNull(),
  issueDescription: text("issue_description").notNull(),
  issueStatus: varchar("issue_status", { length: 256 }).notNull(),
});

// Appeal Events Table (linked with Appeals)
export const appealEvents = pgTable("appeal_events", {
  eventId: serial("event_id").primaryKey(),
  appealId: integer("appeal_id")
    .references(() => appeals.appealId, { onDelete: "cascade" })  // Cascade delete on appeal deletion
    .notNull(),
  eventType: varchar("event_type", { length: 256 }).notNull(),
  eventDate: timestamp("event_date").notNull(),
  eventDetails: text("event_details"),  // Optional
});

// Document Upload Table (linked with userProfiles)
export const documentUploads = pgTable("document_uploads", {
  requestId: serial("request_id").primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => userProfiles.userId, { onDelete: "cascade" }),  // Cascade delete on userProfile deletion
  participantId: integer("participant_id").notNull(),
  fileNumber: varchar("file_number", { length: 256 }).notNull(),
  claimId: integer("claim_id").references(() => claims.claimId),  // Optional relation with claims table
  docType: varchar("doc_type", { length: 256 }).notNull(),
  fileName: varchar("file_name", { length: 256 }).notNull(),
  trackedItemIds: text("tracked_item_ids[]"),  // Optional array of tracked items
  uploadStatus: varchar("upload_status", { length: 256 }).notNull(),
  uploadedDateTime: timestamp("uploaded_date_time").notNull(),
});
