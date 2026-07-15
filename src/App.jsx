import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import ReadMore from './components/ReadMore'
import Contact from './components/Contact'
import Stripe from './components/Stripe'
import JoinCommunity from './components/JoinCommunity'
import SupportHub from './components/SupportHub'
import SaathiChat from './components/SaathiChat'

export default function App() {
  const [page, setPage] = useState('home')

  if (page === 'join') {
    return (
      <>
        <JoinCommunity onBack={() => setPage('home')} />
        <SaathiChat />
      </>
    )
  }

  if (page === 'support') {
    return (
      <>
        <SupportHub onBack={() => setPage('home')} />
        <SaathiChat />
      </>
    )
  }

  return (
    <>
      <Navbar onSupport={() => setPage('support')} />
      <main className="page">
        <Hero onJoin={() => setPage('join')} onSupport={() => setPage('support')} />
        <Stripe />
        <About />
        <Stripe />
        <ReadMore />
        <Stripe />
        <Contact />
        <Stripe />
      </main>
      <SaathiChat />
    </>
  )
}
