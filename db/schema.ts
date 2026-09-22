// Database Schema for MYTHRA Studio
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(),
  persona: text('persona', { enum: ['YOU', 'FILMMAKER', 'STUDIOS'] }).notNull(),
  branch: text('branch'),
  status: text('status').default('new').notNull(),
  score: integer('score').default(0).notNull(),
  qualification: text('qualification', { enum: ['nurture', 'qualified', 'priority'] }).default('nurture').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  whatsapp: text('whatsapp'),
  country: text('country'),
  organization: text('organization'),
  role: text('role'),
  website: text('website'),
  answersJson: text('answers_json').notNull(),
  recommendedOffer: text('recommended_offer').notNull(),
  source: text('source'),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  consentMarketingAt: text('consent_marketing_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  leadId: text('lead_id').references(() => leads.id),
  offerCode: text('offer_code').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').default('USD').notNull(),
  paymentStatus: text('payment_status', { enum: ['pending', 'paid', 'deposit_paid', 'refunded', 'canceled'] }).default('pending').notNull(),
  productionStatus: text('production_status', { enum: ['queued', 'onboarding_pending', 'script_development', 'in_production', 'review_ready', 'completed'] }).default('onboarding_pending').notNull(),
  dueDate: text('due_date'),
  stripeSessionId: text('stripe_session_id'),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: text('created_at').notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  orderId: text('order_id').references(() => orders.id),
  projectType: text('project_type').notNull(),
  title: text('title').notNull(),
  briefJson: text('brief_json'),
  status: text('status').default('onboarding').notNull(),
  assignedOwner: text('assigned_owner'),
  revisionRound: integer('revision_round').default(0).notNull(),
  deliveryUrl: text('delivery_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const mediaAssets = sqliteTable('media_assets', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id),
  ownerUserId: text('owner_user_id'),
  storagePath: text('storage_path').notNull(), // Strictly private path, never public URL
  mediaType: text('media_type').notNull(),
  purpose: text('purpose', { enum: ['likeness_photo', 'voice_sample', 'script_doc', 'master_delivery'] }).notNull(),
  consentRecordId: text('consent_record_id'),
  retentionUntil: text('retention_until'),
  deletedAt: text('deleted_at'),
  createdAt: text('created_at').notNull(),
});

export const consentRecords = sqliteTable('consent_records', {
  id: text('id').primaryKey(),
  projectId: text('project_id').references(() => projects.id),
  subjectName: text('subject_name').notNull(),
  subjectAgeBand: text('subject_age_band', { enum: ['adult_18_plus', 'minor_parent_consent'] }).default('adult_18_plus').notNull(),
  relationshipToCustomer: text('relationship_to_customer').notNull(), // 'self' | 'authorized_adult' | 'child_guardian'
  likenessAuthorized: integer('likeness_authorized', { mode: 'boolean' }).notNull(),
  voiceAuthorized: integer('voice_authorized', { mode: 'boolean' }).notNull(),
  commercialUseAuthorized: integer('commercial_use_authorized', { mode: 'boolean' }).notNull(),
  modelTrainingOptIn: integer('model_training_opt_in', { mode: 'boolean' }).default(false).notNull(),
  disclosureAcknowledged: integer('disclosure_acknowledged', { mode: 'boolean' }).notNull(),
  termsVersion: text('terms_version').default('v1.0-2026').notNull(),
  ipAddressHash: text('ip_address_hash'),
  signedAt: text('signed_at').notNull(),
  withdrawnAt: text('withdrawn_at'),
});

export const proofMetrics = sqliteTable('proof_metrics', {
  key: text('key').primaryKey(),
  displayValue: text('display_value').notNull(),
  metricType: text('metric_type').notNull(),
  ownershipCategory: text('ownership_category').notNull(),
  verified: integer('verified', { mode: 'boolean' }).default(false).notNull(),
  evidenceReference: text('evidence_reference'),
  measuredAt: text('measured_at'),
  methodologyNote: text('methodology_note'),
});

export const crmSyncEvents = sqliteTable('crm_sync_events', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').references(() => leads.id),
  provider: text('provider').default('GHL').notNull(),
  status: text('status', { enum: ['success', 'failed', 'retrying'] }).notNull(),
  contactId: text('contact_id'),
  opportunityId: text('opportunity_id'),
  payloadJson: text('payload_json'),
  errorMessage: text('error_message'),
  createdAt: text('created_at').notNull(),
});

export const paymentEvents = sqliteTable('payment_events', {
  id: text('id').primaryKey(),
  idempotencyKey: text('idempotency_key').notNull().unique(),
  eventType: text('event_type').notNull(),
  orderId: text('order_id'),
  amount: integer('amount'),
  status: text('status').notNull(),
  rawPayload: text('raw_payload'),
  createdAt: text('created_at').notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id').notNull(),
  details: text('details'),
  createdAt: text('created_at').notNull(),
});
