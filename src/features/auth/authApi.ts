import type { AxiosError } from 'axios'
import api from '../../lib/axios'
import type { ApiResponse } from '../../types'

async function unwrap<T>(p: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await p
  return res.data.data
}

/** Human-readable message from an axios/backend error. */
export function errorMessage(e: unknown): string {
  const ax = e as AxiosError<{ message?: string }>
  return ax?.response?.data?.message || ax?.message || 'Something went wrong. Please try again.'
}

export type UserRole = 'user' | 'astrologer' | 'admin'

export interface Me {
  id: string
  phone: string | null
  email: string | null
  full_name: string | null
  role: UserRole
  is_active: boolean
  is_phone_verified: boolean
}

export interface Tokens {
  access_token: string
  refresh_token: string
  token_type: string
  is_new_user: boolean
}

/** Request an OTP. Backend returns it as `dev_otp` until SMS is wired up. */
export const sendOtp = (phone: string) =>
  unwrap<{ dev_otp?: string }>(api.post('/api/v1/auth/otp/send', { phone }))

export const verifyOtp = (phone: string, otp: string) =>
  unwrap<Tokens>(api.post('/api/v1/auth/otp/verify', { phone, otp }))

export const getMe = () => unwrap<Me>(api.get('/api/v1/auth/me'))

export const logout = () => unwrap<null>(api.post('/api/v1/auth/logout'))
