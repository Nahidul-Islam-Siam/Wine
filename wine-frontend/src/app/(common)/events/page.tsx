
import Hero from '@/components/shared/Hero2'
import React from 'react'
import EventPage from '@/components/pages/Events/EventPage'

export default function page() {
  return (
    <div>
        <Hero title="Events" backgroundImage="/images/h2.png" />
        <EventPage/>
    </div>
  )
}
