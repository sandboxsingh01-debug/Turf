import { CalendarClock, IndianRupee, Percent, Users } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/state'
import { createClient } from '@/lib/supabase/server'
import { SPORTS } from '@/lib/config'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default async function AdminOverviewPage() {
  const supabase = await createClient()
  const today = todayISO()

  const [todayBookingsRes, allActiveBookingsRes, customersRes] = await Promise.all([
    supabase
      .from('bookings')
      .select('id, total_amount, status, duration_minutes, sport_id, start_time, sports(name)')
      .eq('booking_date', today)
      .order('start_time', { ascending: true }),
    supabase
      .from('bookings')
      .select('duration_minutes, status')
      .eq('booking_date', today)
      .in('status', ['pending', 'confirmed']),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ])

  const todayBookings = todayBookingsRes.data ?? []
  const activeToday = allActiveBookingsRes.data ?? []
  const customerCount = customersRes.count ?? 0

  const confirmedOrPendingToday = todayBookings.filter((b) => b.status !== 'cancelled')
  const revenueToday = confirmedOrPendingToday.reduce((sum, b) => sum + (b.total_amount ?? 0), 0)

  const bookedMinutes = activeToday.reduce((sum, b) => sum + (b.duration_minutes ?? 0), 0)
  const dayMinutes = 18 * 60
  const occupancyDenominator = dayMinutes * SPORTS.length
  const occupancyRate = occupancyDenominator > 0 ? Math.round((bookedMinutes / occupancyDenominator) * 100) : 0

  const metrics = [
    { icon: CalendarClock, label: 'Bookings today', value: String(confirmedOrPendingToday.length) },
    { icon: IndianRupee, label: 'Revenue today', value: `₹${revenueToday.toLocaleString('en-IN')}` },
    { icon: Percent, label: 'Occupancy rate', value: `${occupancyRate}%` },
    { icon: Users, label: 'Total customers', value: String(customerCount) },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Admin</span>
        <h1 className="mt-2 font-heading text-3xl font-black uppercase tracking-tight text-foreground">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">Live operational snapshot for today, {today}.</p>
      </div>

      <div className="grid gap-[2px] bg-border sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col bg-card p-6">
            <metric.icon className="size-4 text-primary" />
            <p className="mt-4 font-heading text-3xl font-black text-foreground">{metric.value}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wide text-foreground">Today&apos;s schedule</h2>
          <Link href="/admin/bookings" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">
            View all
          </Link>
        </div>

        {todayBookings.length === 0 ? (
          <EmptyState
            title="No bookings today"
            description="Once customers book slots for today, they'll show up here in order."
          />
        ) : (
          <div className="border-[2px] border-border bg-card">
            <div className="flex flex-col">
              {todayBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between border-b-[2px] border-border px-6 py-4 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-sm font-black text-foreground">
                      {booking.start_time?.slice(0, 5)}
                    </span>
                    <span className="text-sm text-muted-foreground">{booking.sports?.name ?? booking.sport_id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-foreground">₹{booking.total_amount?.toLocaleString('en-IN')}</span>
                    <Badge
                      variant={
                        booking.status === 'confirmed'
                          ? 'success'
                          : booking.status === 'cancelled'
                            ? 'destructive'
                            : 'default'
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
