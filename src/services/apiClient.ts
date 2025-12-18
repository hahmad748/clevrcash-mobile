import {apiService} from './api';
import type {
  ApiResponse,
  User,
  Brand,
  Group,
  GroupInvite,
  Friendship,
  FriendInvitation,
  Expense,
  Payment,
  Transaction,
  Balance,
  FriendBalance,
  GroupBalance,
  Category,
  Currency,
  Notification,
  CategoryExpense,
  MonthlyExpense,
  DailyExpense,
  SpendingSummary,
  DashboardSummary,
  RecurringExpense,
  Import,
  Device,
  Timezone,
  Language,
  ExpenseFilters,
  PaymentFilters,
  TransactionFilters,
  PaginatedResponse,
  ExpenseSplit,
  ExpenseItem,
  Attachment,
} from '../types/api';

class ApiClient {
  // ==================== Authentication ====================
  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    default_currency?: string;
    language?: string;
  }): Promise<{user: User; token: string}> {
    const response = await apiService.post<ApiResponse<{user: User; token: string}>>(
      '/register',
      data,
    );
    return response.data;
  }

  async login(email: string, password: string): Promise<{user: User; token: string}> {
    const response = await apiService.post<ApiResponse<{user: User; token: string}>>(
      '/login',
      {email, password},
    );
    return response.data;
  }

  async socialLogin(data: {
    provider: string;
    provider_id: string;
    email: string;
    name: string;
    avatar?: string;
    provider_data?: any;
  }): Promise<{user: User; token: string}> {
    const response = await apiService.post<ApiResponse<{user: User; token: string}>>(
      '/social-login',
      data,
    );
    return response.data;
  }

  async verify2FALogin(data: {
    email: string;
    password: string;
    code: string;
  }): Promise<{user: User; token: string}> {
    const response = await apiService.post<ApiResponse<{user: User; token: string}>>(
      '/verify-2fa-login',
      data,
    );
    return response.data;
  }

  async forgotPassword(email: string): Promise<void> {
    await apiService.post('/forgot-password', {email});
  }

  async resetPassword(data: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await apiService.post('/reset-password', data);
  }

  async refreshToken(): Promise<{user: User; token: string}> {
    const response = await apiService.post<ApiResponse<{user: User; token: string}>>(
      '/refresh',
    );
    return response.data;
  }

  async logout(): Promise<void> {
    await apiService.post('/logout');
  }

  async logoutAll(): Promise<void> {
    await apiService.post('/logout-all');
  }

  // ==================== 2FA ====================
  async enable2FA(): Promise<{backup_code: string; message: string}> {
    const response = await apiService.post<ApiResponse<{backup_code: string; message: string}>>(
      '/2fa/enable',
    );
    return response.data;
  }

  async verify2FA(code: string): Promise<void> {
    await apiService.post('/2fa/verify', {code});
  }

  async disable2FA(password: string): Promise<void> {
    await apiService.post('/2fa/disable', {password});
  }

  // ==================== User ====================
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/user');
    return response.data;
  }

  async getBrand(): Promise<Brand> {
    const response = await apiService.get<ApiResponse<Brand>>('/user/brand');
    return response.data;
  }

  async updateUser(data: Partial<User>): Promise<User> {
    const response = await apiService.put<ApiResponse<User>>('/user', data);
    return response.data;
  }

  async updateAccount(data: {
    name?: string;
    email?: string;
    phone?: string;
    default_currency?: string;
    timezone?: string;
    language?: string;
  }): Promise<User> {
    const response = await apiService.put<ApiResponse<User>>('/user/account', data);
    return response.data;
  }

  async updatePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await apiService.put('/user/password', data);
  }

  async updateNotifications(data: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    notification_preferences?: any;
  }): Promise<User> {
    const response = await apiService.put<ApiResponse<User>>('/user/notifications', data);
    return response.data;
  }

  async updatePrivacy(data: {
    allow_friend_suggestions?: boolean;
    settings?: Record<string, any>;
  }): Promise<User> {
    const response = await apiService.put<ApiResponse<User>>('/user/privacy', data);
    return response.data;
  }

  async uploadAvatar(file: FormData): Promise<User> {
    const response = await apiService.post<ApiResponse<User>>('/user/avatar', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDevices(): Promise<Device[]> {
    const response = await apiService.get<ApiResponse<Device[]>>('/user/devices');
    return response.data;
  }

  async revokeDevice(tokenId: number): Promise<void> {
    await apiService.delete(`/user/devices/${tokenId}`);
  }

  async revokeAllDevices(): Promise<void> {
    await apiService.delete('/user/devices');
  }

  async registerDevice(data: {
    token: string;
    device_id: string;
    device_name: string;
    platform: string;
    os_version: string;
    app_version: string;
  }): Promise<Device> {
    // TODO: Add this endpoint to backend if not exists
    // For now, we'll use a workaround or the endpoint might already exist
    const response = await apiService.post<ApiResponse<Device>>('/user/devices', data);
    return response.data;
  }

  // ==================== Friends ====================
  async getFriends(filters?: {search?: string}): Promise<User[]> {
    const query = filters?.search ? `?search=${encodeURIComponent(filters.search)}` : '';
    const response = await apiService.get<ApiResponse<User[]>>(`/friends${query}`);
    return response.data;
  }

  async getPendingRequests(type: 'received' | 'sent' = 'received'): Promise<Friendship[]> {
    const response = await apiService.get<ApiResponse<Friendship[]>>(
      `/friends/pending?type=${type}`,
    );
    return response.data;
  }

  async searchFriends(query: string): Promise<User[]> {
    const response = await apiService.post<ApiResponse<User[]>>('/friends/search', {q: query});
    return response.data;
  }

  async sendFriendRequest(friendId: number): Promise<void> {
    await apiService.post('/friends/request', {friend_id: friendId});
  }

  async inviteFriendByEmail(email: string): Promise<{invitation: FriendInvitation; token: string}> {
    const response = await apiService.post<ApiResponse<{invitation: FriendInvitation; token: string}>>(
      '/friends/invite-email',
      {email},
    );
    return response.data;
  }

  async acceptFriendInvitationByToken(token: string): Promise<Friendship> {
    const response = await apiService.get<ApiResponse<Friendship>>(
      `/friends/accept-invitation/${token}`,
    );
    return response.data;
  }

  async acceptFriendRequest(friendId: number): Promise<void> {
    await apiService.post(`/friends/${friendId}/accept`);
  }

  async declineFriendRequest(friendId: number): Promise<void> {
    await apiService.post(`/friends/${friendId}/decline`);
  }

  async remindFriend(friendId: number, message?: string): Promise<void> {
    await apiService.post(`/friends/${friendId}/remind`, {message});
  }

  async getFriendBalance(friendId: number): Promise<FriendBalance> {
    const response = await apiService.get<ApiResponse<FriendBalance>>(
      `/friends/${friendId}/balance`,
    );
    return response.data;
  }

  async getFriendTransactions(
    friendId: number,
    filters?: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<PaginatedResponse<Transaction>>>(
      `/friends/${friendId}/transactions${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async settleUpWithFriend(
    friendId: number,
    data: {
      amount: number;
      currency: string;
      method: string;
      notes?: string;
    },
  ): Promise<Payment> {
    const response = await apiService.post<ApiResponse<Payment>>(
      `/friends/${friendId}/settle`,
      data,
    );
    return response.data;
  }

  async removeFriend(friendId: number): Promise<void> {
    await apiService.delete(`/friends/${friendId}`);
  }

  // ==================== Groups ====================
  async getGroups(filters?: {
    search?: string;
    currency?: string;
    role?: string;
    is_favorite?: boolean;
  }): Promise<Group[]> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<Group[]>>(
      `/groups${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async createGroup(data: {
    name: string;
    description?: string;
    currency?: string;
  }): Promise<Group> {
    const response = await apiService.post<ApiResponse<Group>>('/groups', data);
    return response.data;
  }

  async getGroup(groupId: string): Promise<Group> {
    const response = await apiService.get<ApiResponse<Group>>(`/groups/${groupId}`);
    return response.data;
  }

  async updateGroup(groupId: string, data: Partial<Group>): Promise<Group> {
    const response = await apiService.put<ApiResponse<Group>>(`/groups/${groupId}`, data);
    return response.data;
  }

  async deleteGroup(groupId: string): Promise<void> {
    await apiService.delete(`/groups/${groupId}`);
  }

  async joinGroupByCode(inviteCode: string): Promise<Group> {
    const response = await apiService.post<ApiResponse<Group>>('/groups/join', {
      invite_code: inviteCode,
    });
    return response.data;
  }

  async acceptGroupInvitationByToken(token: string): Promise<Group> {
    const response = await apiService.get<ApiResponse<Group>>(
      `/groups/accept-invitation/${token}`,
    );
    return response.data;
  }

  async addGroupMember(groupId: string, userId: number, role?: string): Promise<void> {
    await apiService.post(`/groups/${groupId}/members`, {user_id: userId, role});
  }

  async removeGroupMember(groupId: string, userId: number): Promise<void> {
    await apiService.delete(`/groups/${groupId}/members/${userId}`);
  }

  async inviteToGroup(groupId: string, email: string): Promise<{invite: GroupInvite; token: string}> {
    const response = await apiService.post<ApiResponse<{invite: GroupInvite; token: string}>>(
      `/groups/${groupId}/invite`,
      {email},
    );
    return response.data;
  }

  async acceptGroupInvite(groupId: string, inviteId: number): Promise<void> {
    await apiService.post(`/groups/${groupId}/invite/${inviteId}/accept`);
  }

  async declineGroupInvite(groupId: string, inviteId: number): Promise<void> {
    await apiService.post(`/groups/${groupId}/invite/${inviteId}/decline`);
  }

  async remindGroup(groupId: string, message?: string): Promise<{sent_to: number}> {
    const response = await apiService.post<ApiResponse<{sent_to: number}>>(
      `/groups/${groupId}/remind`,
      {message},
    );
    return response.data;
  }

  async getGroupBalances(groupId: string): Promise<GroupBalance> {
    const response = await apiService.get<ApiResponse<GroupBalance>>(
      `/groups/${groupId}/balances`,
    );
    return response.data;
  }

  async getGroupTransactions(
    groupId: string,
    filters?: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<PaginatedResponse<Transaction>>>(
      `/groups/${groupId}/transactions${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async settleUpInGroup(
    groupId: string,
    data: {
      amount: number;
      currency: string;
      method: string;
      notes?: string;
      from_user_id: number;
      to_user_id: number;
    },
  ): Promise<Payment> {
    const response = await apiService.post<ApiResponse<Payment>>(
      `/groups/${groupId}/settle`,
      data,
    );
    return response.data;
  }

  async simplifyDebts(groupId: string): Promise<any[]> {
    const response = await apiService.post<ApiResponse<any[]>>(
      `/groups/${groupId}/simplify-debts`,
    );
    return response.data;
  }

  // ==================== Expenses ====================
  async getExpenses(filters?: ExpenseFilters): Promise<PaginatedResponse<Expense>> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<PaginatedResponse<Expense>>>(
      `/expenses${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async createExpense(data: {
    group_id?: number;
    description: string;
    amount: number;
    currency: string;
    date: string;
    notes?: string;
    paid_by: number;
    participants: Array<{
      user_id: number;
      amount?: number;
      percentage?: number;
      shares?: number;
    }>;
    split_type: 'equal' | 'exact' | 'percentage' | 'shares' | 'adjustment' | 'reimbursement' | 'itemized';
    split_data?: Record<string, any>;
    category_id?: number;
    items?: Array<{
      name: string;
      amount: number;
      quantity?: number;
    }>;
    is_reimbursement?: boolean;
    is_iou?: boolean;
    fx_rate?: number;
    fx_from_currency?: string;
  }): Promise<Expense> {
    const response = await apiService.post<ApiResponse<Expense>>('/expenses', data);
    return response.data;
  }

  async getExpense(expenseId: string): Promise<Expense> {
    const response = await apiService.get<ApiResponse<Expense>>(`/expenses/${expenseId}`);
    return response.data;
  }

  async updateExpense(expenseId: string, data: Partial<Expense>): Promise<Expense> {
    const response = await apiService.put<ApiResponse<Expense>>(`/expenses/${expenseId}`, data);
    return response.data;
  }

  async deleteExpense(expenseId: string): Promise<void> {
    await apiService.delete(`/expenses/${expenseId}`);
  }

  async uploadExpenseAttachment(expenseId: string, file: FormData): Promise<Attachment> {
    const response = await apiService.post<ApiResponse<Attachment>>(
      `/expenses/${expenseId}/attachments`,
      file,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }

  // ==================== Payments ====================
  async getPayments(filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<PaginatedResponse<Payment>>>(
      `/payments${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async createPayment(data: {
    from_user_id: number;
    to_user_id: number;
    group_id?: number;
    amount: number;
    currency: string;
    method: string;
    notes?: string;
    paid_at?: string;
  }): Promise<Payment> {
    const response = await apiService.post<ApiResponse<Payment>>('/payments', data);
    return response.data;
  }

  async getPayment(paymentId: number): Promise<Payment> {
    const response = await apiService.get<ApiResponse<Payment>>(`/payments/${paymentId}`);
    return response.data;
  }

  async updatePayment(paymentId: number, data: Partial<Payment>): Promise<Payment> {
    const response = await apiService.put<ApiResponse<Payment>>(`/payments/${paymentId}`, data);
    return response.data;
  }

  async deletePayment(paymentId: number): Promise<void> {
    await apiService.delete(`/payments/${paymentId}`);
  }

  // ==================== Transactions ====================
  async getTransactions(
    filters?: TransactionFilters,
  ): Promise<PaginatedResponse<Transaction>> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<PaginatedResponse<Transaction>>>(
      `/transactions${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  // ==================== Balances ====================
  async getTotalBalance(): Promise<number> {
    const response = await apiService.get<ApiResponse<number>>('/balances/total');
    return response.data;
  }

  async getFriendsBalances(): Promise<FriendBalance[]> {
    const response = await apiService.get<ApiResponse<FriendBalance[]>>('/balances/friends');
    return response.data;
  }

  async getGroupsBalances(): Promise<GroupBalance[]> {
    const response = await apiService.get<ApiResponse<GroupBalance[]>>('/balances/groups');
    return response.data;
  }

  // ==================== Charts ====================
  async getExpensesByCategory(filters?: {
    date_from?: string;
    date_to?: string;
    group_id?: number;
    currency?: string;
  }): Promise<CategoryExpense[]> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<CategoryExpense[]>>(
      `/charts/expenses-by-category${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async getExpensesByMonth(filters?: {
    date_from?: string;
    date_to?: string;
    group_id?: number;
    currency?: string;
  }): Promise<MonthlyExpense[]> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<MonthlyExpense[]>>(
      `/charts/expenses-by-month${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async getExpensesByDay(filters?: {
    date_from?: string;
    date_to?: string;
    group_id?: number;
    currency?: string;
  }): Promise<DailyExpense[]> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<DailyExpense[]>>(
      `/charts/expenses-by-day${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async getTopExpenses(filters?: {
    date_from?: string;
    date_to?: string;
    group_id?: number;
    currency?: string;
    limit?: number;
  }): Promise<Expense[]> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<Expense[]>>(
      `/charts/top-expenses${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async getSpendingSummary(filters?: {
    date_from?: string;
    date_to?: string;
    group_id?: number;
    currency?: string;
  }): Promise<SpendingSummary> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<ApiResponse<SpendingSummary>>(
      `/charts/spending-summary${queryString ? `?${queryString}` : ''}`,
    );
    return response.data;
  }

  async getBalancesByCurrency(filters?: {
    group_id?: number;
    currency?: string;
  }): Promise<Array<{currency: string; balance: number}>> {
    const query = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, String(value));
        }
      });
    }
    const queryString = query.toString();
    const response = await apiService.get<
      ApiResponse<Array<{currency: string; balance: number}>>
    >(`/charts/balances-by-currency${queryString ? `?${queryString}` : ''}`);
    return response.data;
  }

  // ==================== Dashboard ====================
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await apiService.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
    return response.data;
  }

  // ==================== Utilities ====================
  async getCurrencies(): Promise<Currency[]> {
    const response = await apiService.get<ApiResponse<Currency[]>>('/utilities/currencies');
    return response.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiService.get<ApiResponse<Category[]>>('/utilities/categories');
    return response.data;
  }

  async getTimezones(): Promise<Timezone[]> {
    const response = await apiService.get<ApiResponse<Timezone[]>>('/utilities/timezones');
    return response.data;
  }

  async getLanguages(): Promise<Language[]> {
    const response = await apiService.get<ApiResponse<Language[]>>('/utilities/languages');
    return response.data;
  }

  // ==================== Currency Conversion ====================
  async convertCurrency(data: {
    amount: number;
    from: string;
    to: string;
  }): Promise<number> {
    const response = await apiService.post<ApiResponse<number>>('/currency/convert', data);
    return response.data;
  }

  async getExchangeRate(from: string, to: string): Promise<number> {
    const response = await apiService.get<ApiResponse<number>>(
      `/currency/rate?from=${from}&to=${to}`,
    );
    return response.data;
  }

  async getExchangeRates(data: {
    from_currency: string;
    to_currencies: string[];
  }): Promise<Record<string, number>> {
    const response = await apiService.post<ApiResponse<Record<string, number>>>(
      '/currency/rates',
      data,
    );
    return response.data;
  }

  // ==================== Reminders ====================
  async remindFriend(friendId: number, message?: string): Promise<void> {
    await apiService.post(`/reminders/friend/${friendId}`, {message});
  }

  async remindGroup(groupId: string, message?: string): Promise<{sent_to: number}> {
    const response = await apiService.post<ApiResponse<{sent_to: number}>>(
      `/reminders/group/${groupId}`,
      {message},
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();
