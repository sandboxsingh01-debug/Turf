import { CalendarClock } from 'lucide-react'

import { EmptyState } from '@/components/ui/state'
import { createClient } from '@/lib/supabase/server'
import { AdminBookingRow } from './booking-row'
import { AdminBookingsFilter } from './bookings-filter'
import type { BookingStatus } from './actions'

interface AdminBookingsPageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  const { status: statusFilter } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select(
      'id, booking_date, start_time, end_time, total_amount, status, customer_name, customer_phone, sports(name)',
    )
    .order('booking_date', { ascending: false })
    .order('start_time', { ascending: false })
    .limit(100)

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  const { data: bookings } = await query

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Admin</span>
        <h1 className="mt-2 font-heading text-3xl font-black uppercase tracking-tight text-foreground">Bookings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage and review every reservation across both turfs.
        </p>
      </div>

      <AdminBookingsFilter currentStatus={statusFilter ?? 'all'} />

      {!bookings || bookings.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No bookings found"
          description="Bookings will appear here as customers reserve slots, or adjust the filter above."
        />
      ) : (
        <div className="border-[2px] border-border bg-card">
          <div className="flex flex-col">
            {bookings.map((booking: any) => (
              <AdminBookingRow
                key={booking.id}
                booking={{
                  id: booking.id,
                  booking_date: booking.booking_date,
                  start_time: booking.start_time,
                  end_time: booking.end_time,
                  total_amount: booking.total_amount,
                  status: booking.status as BookingStatus,
                  customer_name: booking.customer_name,
                  customer_phone: booking.customer_phone,
                  sport_name: booking.sports?.name ?? 'Unknown sport',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
