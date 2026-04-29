import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import ReadMore from './components/ReadMore'
import Contact from './components/Contact'
import Stripe from './components/Stripe'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Hero />
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
