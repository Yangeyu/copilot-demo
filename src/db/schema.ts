import { boolean, integer, pgTable, text, timestamp, index } from "drizzle-orm/pg-core";


export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
  customerId: text('customer_id'),
}, (table) => ([
  index('user_email_idx').on(table.email),
  index('user_customer_id_idx').on(table.customerId),
  index('user_role_idx').on(table.role),
]));

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by')
}, (table) => ([
  index("session_token_idx").on(table.token),
  index("session_user_id_idx").on(table.userId),
]));

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
}, (table) => ([
  index("account_user_id_idx").on(table.userId),
  index("account_account_id_idx").on(table.accountId),
  index("account_provider_id_idx").on(table.providerId),
]));

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
});

export const payment = pgTable("payment", {
  id: text("id").primaryKey(),
  priceId: text('price_id').notNull(),
  type: text('type').notNull(),
  interval: text('interval'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  customerId: text('customer_id').notNull(),
  subscriptionId: text('subscription_id'),
  sessionId: text('session_id'),
  status: text('status').notNull(),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ([
  index("payment_type_idx").on(table.type),
  index("payment_price_id_idx").on(table.priceId),
  index("payment_user_id_idx").on(table.userId),
  index("payment_customer_id_idx").on(table.customerId),
  index("payment_status_idx").on(table.status),
  index("payment_subscription_id_idx").on(table.subscriptionId),
  index("payment_session_id_idx").on(table.sessionId),
]));

export const userCredit = pgTable("user_credit", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  currentCredits: integer("current_credits").notNull().default(0),
  lastRefreshAt: timestamp("last_refresh_at"), // deprecated
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ([
  index("user_credit_user_id_idx").on(table.userId),
]));

export const creditTransaction = pgTable("credit_transaction", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text("type").notNull(),
  description: text("description"),
  amount: integer("amount").notNull(),
  remainingAmount: integer("remaining_amount"),
  paymentId: text("payment_id"),
  expirationDate: timestamp("expiration_date"),
  expirationDateProcessedAt: timestamp("expiration_date_processed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ([
  index("credit_transaction_user_id_idx").on(table.userId),
  index("credit_transaction_type_idx").on(table.type),
]));

export const chatSessions = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  title: text("title").notNull().default("New Chat"),
  model: text("model"),
  systemPrompt: text("system_prompt"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  isArchived: boolean("is_archived").notNull().default(false),
  metadata: text("metadata"), // 存储JSON字符串
}, (table) => ([
  index("chat_sessions_user_id_idx").on(table.userId),
  index("chat_sessions_created_at_idx").on(table.createdAt),
  index("chat_sessions_updated_at_idx").on(table.updatedAt),
]));

export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => chatSessions.id, { onDelete: 'cascade' }),
  role: text("role").notNull(), // 'user', 'assistant', 'system'
  content: text("content").notNull(),
  tokens: integer("tokens"),
  model: text("model"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: text("metadata"), // 存储JSON字符串
}, (table) => ([
  index("chat_messages_session_id_idx").on(table.sessionId),
  index("chat_messages_created_at_idx").on(table.createdAt),
  index("chat_messages_role_idx").on(table.role),
]));

