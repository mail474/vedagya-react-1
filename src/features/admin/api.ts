import type { AxiosError } from 'axios'
import api from '../../lib/axios'
import type { ApiResponse } from '../../types'

// ─── Shared ───

export interface Paginated<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

/** Unwrap the backend `{ success, message, data }` envelope to just `data`. */
async function unwrap<T>(p: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await p
  return res.data.data
}

/** Pull a human-readable message out of an axios/backend error. */
export function errorMessage(e: unknown): string {
  const ax = e as AxiosError<{ message?: string }>
  return ax?.response?.data?.message || ax?.message || 'Something went wrong. Please try again.'
}

// ─── Dashboard ───

export interface DashboardStats {
  total_users: number
  active_users: number
  new_users_30d: number
  total_payments_paise: number
  total_payments: number // rupees
  currency: string
  paid_orders: number
}

export const getDashboard = () => unwrap<DashboardStats>(api.get('/api/v1/admin/dashboard'))

// ─── Users ───

export type UserRole = 'user' | 'astrologer' | 'admin'

export interface AdminUser {
  id: string
  phone: string | null
  email: string | null
  full_name: string | null
  role: UserRole
  is_active: boolean
  is_phone_verified: boolean
  has_birth_details: boolean
  chat_credits: number | null
  created_at: string
  last_login: string | null
}

export interface AdminUserDetail extends AdminUser {
  total_paid_paise: number
  total_paid: number
  paid_orders: number
  ticket_count: number
}

export interface ListUsersParams {
  search?: string
  role?: UserRole
  is_active?: boolean
  limit?: number
  offset?: number
}

export const listUsers = (params: ListUsersParams = {}) =>
  unwrap<Paginated<AdminUser>>(api.get('/api/v1/admin/users', { params }))

export const getUser = (id: string) => unwrap<AdminUserDetail>(api.get(`/api/v1/admin/users/${id}`))

export const updateUser = (id: string, body: { is_active?: boolean; role?: UserRole }) =>
  unwrap<AdminUser>(api.patch(`/api/v1/admin/users/${id}`, body))

// ─── Payments ───

export type PaymentStatus = 'created' | 'paid' | 'failed'

export interface AdminPayment {
  id: string
  user_id: string
  user_name: string | null
  user_phone: string | null
  razorpay_order_id: string
  amount_paise: number
  amount: number // rupees
  currency: string
  category: string | null
  receipt: string
  status: PaymentStatus
  created_at: string
}

export interface ListPaymentsParams {
  status?: PaymentStatus
  search?: string
  limit?: number
  offset?: number
}

export const listPayments = (params: ListPaymentsParams = {}) =>
  unwrap<Paginated<AdminPayment>>(api.get('/api/v1/admin/payments', { params }))

// ─── Support (tickets admin) ───

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketCategory = 'general' | 'billing' | 'technical' | 'astrology' | 'other'

export interface AdminTicket {
  id: string
  user_id: string
  title: string
  category: TicketCategory
  status: TicketStatus
  priority: TicketPriority
  created_at: string
  updated_at: string
  update_demanded_at: string | null
  reply_count: number
}

export interface TicketReply {
  id: string
  sender_id: string
  message: string
  is_internal: boolean
  created_at: string
}

export interface AdminTicketDetail {
  id: string
  user_id: string
  title: string
  description: string
  category: TicketCategory
  status: TicketStatus
  priority: TicketPriority
  admin_notes: string | null
  closed_at: string | null
  update_demanded_at: string | null
  created_at: string
  updated_at: string
  replies: TicketReply[]
}

export interface ListTicketsParams {
  status?: TicketStatus
  category?: TicketCategory
  priority?: TicketPriority
  search?: string
  limit?: number
  offset?: number
}

export const listTickets = (params: ListTicketsParams = {}) =>
  unwrap<Paginated<AdminTicket>>(api.get('/api/v1/tickets/admin/all', { params }))

export const getTicket = (id: string) =>
  unwrap<AdminTicketDetail>(api.get(`/api/v1/tickets/admin/${id}`))

export const updateTicket = (
  id: string,
  body: { status?: TicketStatus; priority?: TicketPriority; admin_notes?: string },
) => unwrap<unknown>(api.put(`/api/v1/tickets/admin/${id}`, body))

export const replyTicket = (id: string, body: { message: string; is_internal?: boolean }) =>
  unwrap<unknown>(api.post(`/api/v1/tickets/admin/${id}/reply`, body))

/** Count tickets in a given status (uses the list endpoint's `total`). */
export const countTickets = async (status?: TicketStatus): Promise<number> => {
  const page = await listTickets({ status, limit: 1 })
  return page.total
}
