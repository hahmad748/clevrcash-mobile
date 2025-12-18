// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  default_currency: string;
  language: string;
  timezone?: string;
  email_notifications: boolean;
  push_notifications: boolean;
  notification_preferences?: NotificationPreferences;
  allow_friend_suggestions?: boolean;
  settings?: Record<string, any>;
  brand_id?: number;
  brand?: Brand;
  two_factor_enabled?: boolean;
  subscription_status?: 'active' | 'canceled' | 'past_due' | null;
}

export interface NotificationPreferences {
  groups_and_friends?: {
    remind?: {email?: boolean; mobile?: boolean};
    [key: string]: any;
  };
  expenses?: {
    added?: {email?: boolean; mobile?: boolean};
    edited?: {email?: boolean; mobile?: boolean};
    deleted?: {email?: boolean; mobile?: boolean};
    expense_due?: {email?: boolean; mobile?: boolean};
    [key: string]: any;
  };
  news_and_updates?: {
    weekly_summary?: {email?: boolean; mobile?: boolean};
    monthly_summary?: {email?: boolean; mobile?: boolean};
    major_updates?: {email?: boolean; mobile?: boolean};
    [key: string]: any;
  };
}

// Brand Types
export interface Brand {
  id: number;
  name: string;
  slug: string;
  display_name: string;
  logo_url?: string;
  splash_url?: string;
  favicon_url?: string;
  primary_color: string;
  secondary_color?: string;
  font_family: string;
  theme_tokens?: {
    light: {
      background: string;
      surface: string;
      text: string;
    };
    dark: {
      background: string;
      surface: string;
      text: string;
    };
  };
  feature_flags?: {
    receipt_scanning?: boolean;
    currency_conversion?: boolean;
    itemization?: boolean;
    charts?: boolean;
    search?: boolean;
  };
  supported_languages?: string[];
  supported_currencies?: string[];
  is_assigned?: boolean;
}

// Group Types
export interface Group {
  id: number;
  hash: string;
  name: string;
  description?: string;
  currency: string;
  invite_code: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator?: User;
  members?: GroupMember[];
  expenses?: Expense[];
}

export interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  role: 'owner' | 'admin' | 'member';
  user?: User;
}

export interface GroupInvite {
  id: number;
  group_id: number;
  invited_by: number;
  email: string;
  token: string;
  status: 'pending' | 'accepted' | 'declined';
  expires_at?: string;
  responded_at?: string;
  inviter?: User;
}

// Friend Types
export interface Friendship {
  id: number;
  user_id: number;
  friend_id: number;
  status: 'pending' | 'accepted' | 'declined';
  accepted_at?: string;
  user?: User;
  friend?: User;
}

export interface FriendInvitation {
  id: number;
  inviter_id: number;
  email: string;
  token: string;
  accepted_at?: string;
  inviter?: User;
}

// Expense Types
export interface Expense {
  id: number;
  blockchain_hash?: string;
  group_id?: number;
  description: string;
  amount: number;
  currency: string;
  date: string;
  notes?: string;
  paid_by: number;
  created_by: number;
  category_id?: number;
  split_type: 'equal' | 'exact' | 'percentage' | 'shares';
  split_data?: Record<string, any>;
  is_reimbursement?: boolean;
  is_iou?: boolean;
  fx_rate?: number;
  fx_from_currency?: string;
  created_at: string;
  updated_at: string;
  payer?: User;
  creator?: User;
  category?: Category;
  splits?: ExpenseSplit[];
  items?: ExpenseItem[];
  attachments?: Attachment[];
  group?: Group;
}

export interface ExpenseSplit {
  id: number;
  expense_id: number;
  user_id: number;
  amount: number;
  percentage?: number;
  shares?: number;
  user?: User;
}

export interface ExpenseItem {
  id: number;
  expense_id: number;
  name: string;
  amount: number;
  quantity?: number;
}

export interface Attachment {
  id: number;
  attachable_type: string;
  attachable_id: number;
  name: string;
  path: string;
  url: string;
  thumbnail_url?: string;
  mime_type: string;
  size: number;
  checksum?: string;
  uploaded_by: number;
  created_at: string;
}

// Payment Types
export interface Payment {
  id: number;
  blockchain_hash?: string;
  from_user_id: number;
  to_user_id: number;
  group_id?: number;
  amount: number;
  currency: string;
  method: string;
  notes?: string;
  status: string;
  transaction_id?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  fromUser?: User;
  toUser?: User;
  group?: Group;
  metadata?: Record<string, any>;
}

// Transaction Types (Combined Expenses + Payments)
export interface Transaction {
  type: 'expense' | 'payment';
  id: number;
  date: string;
  timestamp: string;
  data: Expense | Payment;
}

// Balance Types
export interface Balance {
  user_id: number;
  balance: number;
  currency?: string;
  user?: User;
}

export interface FriendBalance {
  balance: number;
  converted_balance?: number;
  converted_currency?: string;
  friend: User;
  balances_by_currency?: Array<{currency: string; balance: number}>;
}

export interface GroupBalance {
  group_id?: number;
  user_balance: number;
  balances: Balance[];
  group?: Group;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  sort_order?: number;
}

// Currency Types
export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationData;
  read_at?: string;
  created_at: string;
}

export interface NotificationData {
  type:
    | 'expense_added'
    | 'expense_edited'
    | 'expense_deleted'
    | 'payment_received'
    | 'added_as_friend'
    | 'added_to_group'
    | 'group_invitation_accepted'
    | 'remind'
    | 'weekly_summary'
    | 'monthly_summary'
    | 'expense_due'
    | 'welcome'
    | 'subscription_success'
    | 'expense_commented'
    | 'major_update';
  [key: string]: any;
}

// Chart Types
export interface CategoryExpense {
  category_id: number;
  category_name: string;
  total: number;
}

export interface MonthlyExpense {
  year: number;
  month: number;
  month_name: string;
  total: number;
  count: number;
}

export interface DailyExpense {
  date: string;
  total: number;
  count: number;
}

export interface SpendingSummary {
  total_expenses: number;
  total_paid: number;
  total_owed: number;
  expense_count: number;
  net_balance: number;
  date_from: string;
  date_to: string;
}

// Dashboard Types
export interface DashboardSummary {
  total_balance: number;
  groups_count: number;
  friends_count: number;
  expenses_count_this_month: number;
  total_expenses_this_month: number;
  recent_expenses: Expense[];
  you_are_owed: number;
  you_owe: number;
  highest_owed_group?: {
    group: Group;
    balance: number;
    currency: string;
  } | null;
  highest_owed_friend?: {
    friend: User;
    balance: number;
    currency: string;
  } | null;
  balances_by_currency: Array<{
    currency: string;
    balance: number;
  }>;
}

// Recurring Expense Types
export interface RecurringExpense {
  id: number;
  user_id: number;
  group_id?: number;
  description: string;
  amount: number;
  currency: string;
  category_id?: number;
  recurrence_pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrence_interval: number;
  next_occurrence: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Import Types
export interface Import {
  id: number;
  user_id: number;
  source: 'splitwise' | 'other';
  file_path: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  total_records?: number;
  processed_records?: number;
  errors?: string[];
  created_at: string;
  updated_at: string;
}

// Device Types
export interface Device {
  id: number;
  name: string;
  created_at: string;
  last_used_at: string;
}

// Utility Types
export interface Timezone {
  value: string;
  label: string;
}

export interface Language {
  code: string;
  name: string;
}

// Filter Types
export interface ExpenseFilters {
  group_id?: number;
  friend_id?: number;
  currency?: string;
  category_id?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
  paid_by?: number;
  split_type?: string;
  amount_min?: number;
  amount_max?: number;
  sort_by?: 'date' | 'amount' | 'created_at' | 'description';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface PaymentFilters {
  group_id?: number;
  friend_id?: number;
  currency?: string;
  method?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  sort_by?: 'paid_at' | 'created_at' | 'amount';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface TransactionFilters {
  group_id?: number;
  friend_id?: number;
  currency?: string;
  date_from?: string;
  date_to?: string;
  category_id?: number;
  search?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
