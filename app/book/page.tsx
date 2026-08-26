import Link from 'next/link'
import { LogIn } from 'lucide-react'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { EmptyState } from '@/components/ui/state'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { BookingForm } from './booking-form'

export default async function BookPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: sports } = await supabase
    .from('sports')
    .select('id, name, tagline')
    .eq('active', true)
    .order('sort_order')

  let defaultName = ''
  let defaultPhone = ''

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .single()
    defaultName = profile?.full_name ?? ''
    defaultPhone = profile?.phone ?? ''
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Book</span>
          <h1 className="font-heading text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
            Book your slot
          </h1>
          <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Pick a sport, date, and duration to see live availability and confirm your booking
            instantly.
          </p>
        </div>

        {!user ? (
          <div className="mt-10">
            <EmptyState
              icon={LogIn}
              title="Log in to book a slot"
              description="Create an account or log in to see live availability and confirm your booking."
              action={<Button render={<Link href="/login">Log in</Link>} />}
            />
          </div>
        ) : (
          <BookingForm sports={sports ?? []} defaultName={defaultName} defaultPhone={defaultPhone} />
        )}
      </main>
      <Footer />
    </>
  )
}
