'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import {
  calculateTotal,
  generateCandidateSlots,
  minutesToTime,
  resolvePricingWindow,
  timeToMinutes,
  type PricingWindowRow,
} from '@/lib/slots'

export interface SlotOption {
  startTime: string
  endTime: string
  available: boolean
  hourlyRate: number
  total: number
  pricingWindowId: string | null
  pricingWindowLabel: string | null
}

export async function getAvailableSlots(input: {
  sportId: string
  date: string
  durationMinutes: number
}): Promise<{ slots: SlotOption[] } | { error: string }> {
  const supabase = await createClient()

  const { data: pricingWindows, error: pricingError } = await supabase
    .from('pricing')
    .select('id, start_time, end_time, price_per_hour')
    .eq('active', true)
    .order('start_time')

  if (pricingError) {
    return { error: 'Could not load pricing. Please try again.' }
  }

  const { data: existingBookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('sport_id', input.sportId)
    .eq('booking_date', input.date)
    .in('booking_status', ['pending', 'confirmed'])

  if (bookingsError) {
    return { error: 'Could not check availability. Please try again.' }
  }

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`
  const isToday = input.date === todayStr
  const nowMinutes = today.getHours() * 60 + today.getMinutes()

  const candidates = generateCandidateSlots(
    input.durationMinutes,
    existingBookings ?? [],
    isToday,
    nowMinutes,
  )

  const windows: PricingWindowRow[] = (pricingWindows ?? []).map((row) => ({
    id: row.id,
    start_time: row.start_time,
    end_time: row.end_time,
    hourly_rate: Number(row.price_per_hour),
  }))

  const slots: SlotOption[] = candidates.map((slot) => {
    const window = resolvePricingWindow(slot.startMinutes, windows)
    const hourlyRate = window?.hourly_rate ?? 0
    return {
      startTime: minutesToTime(slot.startMinutes),
      endTime: minutesToTime(slot.endMinutes),
      available: slot.available,
      hourlyRate,
      total: calculateTotal(hourlyRate, input.durationMinutes),
      pricingWindowId: window?.id ?? null,
      pricingWindowLabel: window?.label ?? null,
    }
  })

  return { slots }
}

export interface CreateBookingInput {
  sportId: string
  date: string
  startTime: string
  endTime: string
  durationMinutes: number
  pricingWindowId: string | null
  hourlyRate: number
  total: number
  customerName: string
  customerPhone: string
  notes?: string
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient()

  if (!input.sportId || !/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.startTime) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.endTime) || !Number.isInteger(input.durationMinutes) || input.durationMinutes <= 0 || input.durationMinutes > 24 * 60) {
    return { error: 'Please provide valid booking details.' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to book a slot.' }
  }

  // Re-check for overlaps right before insert to close the race window between
  // the client fetching slots and submitting the booking.
  const { data: existingBookings, error: conflictError } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('sport_id', input.sportId)
    .eq('booking_date', input.date)
    .in('booking_status', ['pending', 'confirmed'])

  if (conflictError) {
    return { error: 'Could not verify slot availability. Please try again.' }
  }

  const newStart = timeToMinutes(input.startTime)
  let newEnd = timeToMinutes(input.endTime)
  if (newEnd <= newStart) newEnd += 1440

  const hasOverlap = (existingBookings ?? []).some((booking) => {
    const bookedStart = timeToMinutes(booking.start_time)
    let bookedEnd = timeToMinutes(booking.end_time)
    if (bookedEnd <= bookedStart) bookedEnd += 1440
    return newStart < bookedEnd && newEnd > bookedStart
  })

  if (hasOverlap) {
    return { error: 'This slot was just booked by someone else. Please choose another.' }
  }

  const { error: insertError } = await supabase.from('bookings').insert({
    user_id: user.id,
    sport_id: input.sportId,
    booking_date: input.date,
    start_time: input.startTime,
    end_time: input.endTime,
    duration: Math.ceil(input.durationMinutes / 60),
    amount: input.total,
    booking_status: 'confirmed',
    payment_status: 'pending',
  })

  if (insertError) {
    if (insertError.code === '23505') {
      return { error: 'This exact slot was just booked. Please choose another.' }
    }
    return { error: 'Could not create your booking. Please try again.' }
  }

  revalidatePath('/bookings')
  revalidatePath('/dashboard')
  revalidatePath('/admin')

  return { success: true }
}
