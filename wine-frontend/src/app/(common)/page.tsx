import CategorYSection from '@/components/pages/cards/CategorySection'
import HeroSection from '@/components/pages/home/HeroSection/HeroSection'
import NewEventsSection from '@/components/pages/home/NewEventsSection'
import OurStorySection from '@/components/pages/home/OurStorySection'
import RecentBlogSlider from '@/components/pages/home/RecentBlogSlider'
import TestimonialsSection from '@/components/pages/home/TestimonialsSection'
import TopBrandSlider from '@/components/pages/home/TopBrandSlider'
import TrendingProductsSlider from '@/components/pages/home/TrendingProductsSlider'
import React from 'react'

export default function page() {
  return (
    <div>
      <HeroSection/>
      <OurStorySection/>
      <TrendingProductsSlider/>
      <CategorYSection/>
      <NewEventsSection/>
      <RecentBlogSlider/>
      <TestimonialsSection/>
      <TopBrandSlider/>
      
    </div>
  )
}
