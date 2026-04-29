import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import ReadMore from './components/ReadMore'
import Contact from './components/Contact'
import Stripe from './components/Stripe'
import JoinCommunity from './components/JoinCommunity'

export default function App() {
  const [page, setPage] = useState('home')

  if (page === 'join') {
    return <JoinCommunity onBack={() => setPage('home')} />
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <Hero onJoin={() => setPage('join')} />
        <Stripe />
        <About />
        <Stripe />
        <ReadMore />
        <Stripe />
        <Contact />
        <Stripe />
      </main>
    </>
  )
}
