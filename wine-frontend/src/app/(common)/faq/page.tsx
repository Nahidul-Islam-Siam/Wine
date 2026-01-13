import Hero from '@/components/shared/Hero2'
import React from 'react'
import FAQSection from '@/components/pages/faq/FAQSection'

export default function page() {
  return (
    <div>
            <Hero title="FAQ" backgroundImage="/images/h2.png" />
            <FAQSection/>
    </div>
  )
}
