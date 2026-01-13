import ShopPage from '@/components/pages/Shop/ShopPage'
import Hero from '@/components/shared/Hero2'

import React from 'react'

export default function page() {
  return (
    <div>
    <Hero
  title="Shop" 
  backgroundImage="/images/h2.png" 
/>
        <ShopPage/>
    </div>
  )
}
