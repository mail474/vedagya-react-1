import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { MuhuratHistoryItem } from './api'

// ── Mock the shared axios instance before any import of api.ts ────────────────
vi.mock('../../lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import api from '../../lib/axios'
import { listUserMuhuratHistory } from './api'

const mockGet = vi.mocked(api.get)

// ── Fixtures ───────────────────────────────────────────────────────────────────

const FUTURE_DATE = '2099-12-31'
const PAST_DATE = '2020-01-01'

const UPCOMING_ITEM: MuhuratHistoryItem = {
  hash: 'a'.repeat(64),
  event: 'marriage',
  event_label: 'Marriage',
  persons: '1990-05-15',
  start_date: '2026-07-01',
  end_date: '2026-12-31',
  paid_at: '2026-06-26T10:30:00+00:00',
  top_dates: [FUTURE_DATE],
  is_upcoming: true,
  status: 'ready',
}

const PAST_ITEM: MuhuratHistoryItem = {
  ...UPCOMING_ITEM,
  top_dates: [PAST_DATE],
  is_upcoming: false,
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('listUserMuhuratHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls the correct admin endpoint for the given user id', async () => {
    const userId = 'user-123'
    mockGet.mockResolvedValueOnce({ data: { success: true, message: '', data: [] } })

    await listUserMuhuratHistory(userId)

    expect(mockGet).toHaveBeenCalledWith(`/api/v1/admin/users/${userId}/muhurat-history`)
  })

  it('unwraps and returns items from the response envelope', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: true, message: 'Muhurat history', data: [UPCOMING_ITEM] },
    })

    const result = await listUserMuhuratHistory('user-abc')

    expect(result).toHaveLength(1)
    expect(result[0].event).toBe('marriage')
    expect(result[0].is_upcoming).toBe(true)
    expect(result[0].top_dates).toEqual([FUTURE_DATE])
  })

  it('returns an empty array when the user has no paid muhurats', async () => {
    mockGet.mockResolvedValueOnce({ data: { success: true, message: '', data: [] } })

    const result = await listUserMuhuratHistory('user-new')

    expect(result).toEqual([])
  })

  it('propagates axios errors to the caller', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'))

    await expect(listUserMuhuratHistory('user-err')).rejects.toThrow('Network error')
  })

  it('distinguishes upcoming vs past muhurats via is_upcoming flag', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: true, message: '', data: [UPCOMING_ITEM, PAST_ITEM] },
    })

    const result = await listUserMuhuratHistory('user-mix')

    expect(result[0].is_upcoming).toBe(true)
    expect(result[1].is_upcoming).toBe(false)
  })

  it('handles pending status items (no result yet)', async () => {
    const pendingItem: MuhuratHistoryItem = {
      ...UPCOMING_ITEM,
      status: 'pending',
      top_dates: [],
      is_upcoming: false,
    }
    mockGet.mockResolvedValueOnce({ data: { success: true, message: '', data: [pendingItem] } })

    const result = await listUserMuhuratHistory('user-pending')

    expect(result[0].status).toBe('pending')
    expect(result[0].top_dates).toEqual([])
  })
})
