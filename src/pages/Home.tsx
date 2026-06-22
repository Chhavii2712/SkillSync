import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import InfiniteMenu from '../components/InfiniteMenu'

const infiniteMenuItems = [
  { image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=900&fit=crop', link: '/find-hub', title: 'Peer Mentoring', description: 'Learn from students ahead of you.' },
  { image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&h=900&fit=crop', link: '/find-hub', title: 'Skill Exchange', description: "Teach what you know, learn what you don't." },
  { image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&h=900&fit=crop', link: '/find-hub', title: 'Cowork & Learn', description: 'Study together in shared spaces.' },
  { image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&h=900&fit=crop', link: '/find-hub', title: 'Workshops', description: 'Hands-on sessions led by peers.' },
  { image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=900&h=900&fit=crop', link: '/find-hub', title: 'Community', description: 'Build your learning network.' },
  { image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=900&fit=crop', link: '/find-hub', title: 'Team Projects', description: 'Ship real work with peers.' },
  { image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=900&fit=crop', link: '/find-hub', title: 'Tech Sessions', description: 'Code reviews & pair programming.' },
  { image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&h=900&fit=crop', link: '/find-hub', title: 'Mentorship', description: 'Get guidance from experienced peers.' }
]

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ── Feature row — hover effect only, images & text untouched ─────────────────
function FeatureRow({ title, desc, img, alt, accent, delay }: {
  title: string; desc: string; img: string; alt: string; accent: string; delay: number
}) {
  const [hovered, setHovered] = useState(false)
  const { ref, inView } = useInView(0.1)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(-32px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
      className={`flex flex-col md:flex-row justify-between items-start md:items-center p-8 lg:p-12 border-b-[2px] border-black relative overflow-hidden transition-colors duration-300 ${hovered ? accent : 'bg-white'}`}
    >
      {/* sliding left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1.5 bg-black transition-all duration-300"
        style={{ transform: hovered ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'top' }}
      />

      <div className="flex-1 pr-8 relative z-10">
        <h3 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${hovered ? 'text-black' : 'text-black'}`}>
          {title}
        </h3>
        <p className="text-gray-700 max-w-md">{desc}</p>
      </div>

      <div className="mt-6 md:mt-0 relative z-10">
        <img
          src={img}
          alt={alt}
          className={`w-[300px] h-[150px] object-cover border-[2px] border-black transition-all duration-300 ${hovered ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-x-1 -translate-y-1' : ''}`}
        />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  useEffect(() => { document.title = 'SkillSync — Peer Learning, Reimagined' }, [])

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── BRUTALIST HERO ── */}
      <section className="bg-white border-b-[2px] border-black overflow-hidden flex flex-col">

        {/* Top strip — hero image UNTOUCHED */}
        <div className="w-full border-b-[2px] border-black">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&h=400&q=80"
            alt="Students collaborating"
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
        </div>

        {/* Bottom split (3 cols) — UNTOUCHED layout */}
        <div className="flex flex-col md:flex-row w-full max-w-[1600px] mx-auto min-h-[500px]">

          {/* Left grid pattern — UNTOUCHED */}
          <div className="hidden lg:grid grid-cols-4 grid-rows-8 w-[240px] border-r-[2px] border-black shrink-0 relative overflow-hidden">
            {Array.from({ length: 32 }).map((_, i) => {
              let bg = ''
              if (i === 1)  bg = 'bg-blue-500'
              if (i === 14) bg = 'bg-yellow-400'
              if (i === 16) bg = 'bg-orange-500'
              return <div key={i} className={`border-r-[1px] border-b-[1px] border-black ${bg}`} />
            })}
          </div>

          {/* Center content — UNTOUCHED */}
          <div className="flex-1 flex flex-col justify-center items-center p-12 lg:p-24 border-r-[2px] border-black text-center">
            <h1 className="text-5xl md:text-6xl font-serif text-black mb-8 leading-[1.1]">
              Learn What Classes Don't<br />Teach.
            </h1>
            <p className="text-lg text-black font-medium mb-10 max-w-md">
              SkillSync connects university students to swap code, design, creative arts, and academic mentorship. Peer-to-peer, 100% free.
            </p>
            <Link
              to="/find-hub"
              className="border-[2px] border-black text-black font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition"
            >
              Explore active hubs
            </Link>
          </div>

          {/* Right — InfiniteMenu COMPLETELY UNTOUCHED */}
          <div className="w-full md:w-[400px] lg:w-[500px] h-[500px] md:h-auto shrink-0 bg-white relative">
            <InfiniteMenu items={infiniteMenuItems} scale={1.0} />
          </div>
        </div>

        {/* Blue bar — UNTOUCHED */}
        <div className="w-full h-16 md:h-24 bg-blue-500 border-t-[2px] border-b-[2px] border-black" />

        {/* Room to grow header — UNTOUCHED */}
        <div className="w-full max-w-[1600px] mx-auto p-12 lg:p-24 border-b-[2px] border-black bg-white">
          <h2 className="text-4xl md:text-6xl font-serif text-black leading-tight max-w-3xl">
            Every Student Deserves<br />Room To Grow Together.
          </h2>
        </div>

        {/* ── FEATURES LIST — hover effects added, images + text untouched ── */}
        <div className="w-full max-w-[1600px] mx-auto bg-white">
          <FeatureRow
            title="Peer Mentoring"
            desc="Learn from peers who have already mastered the tools and courses you want to learn. No rigid lectures, just collaborative growth."
            img="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&h=150&q=80"
            alt="Peer mentoring"
            accent="bg-yellow-50"
            delay={0}
          />
          <FeatureRow
            title="Collaborative Spaces"
            desc="Swap skills in specialized university chapters, group study rooms, and virtual hackathons designed for hands-on, micro-learning."
            img="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&h=150&q=80"
            alt="Collaborative spaces"
            accent="bg-orange-50"
            delay={80}
          />
          <FeatureRow
            title="100% Free Exchange"
            desc="No tuition, no subscription fees. You trade your knowledge: teach Python for 2 hours, get mentored in UI/UX Design for 2 hours."
            img="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&h=150&q=80"
            alt="Free exchange"
            accent="bg-blue-50"
            delay={160}
          />
        </div>
      </section>

      {/* ── LEARN BY TEACHING — images + text UNTOUCHED, subtle effects added ── */}
      <section className="w-full max-w-[1600px] mx-auto border-b-[2px] border-black flex flex-col md:flex-row bg-white">
        <div className="w-full md:w-1/2 p-12 lg:p-24 border-b-[2px] md:border-b-0 md:border-r-[2px] border-black flex flex-col justify-center items-start">
          <h2 className="text-4xl md:text-5xl font-serif text-black mb-6 leading-[1.2]">
            Learn By Teaching.<br />Share To Grow.
          </h2>
          <p className="text-gray-700 mb-10 max-w-md">
            Our exchange platform thrives on a simple idea: teaching others is the absolute best way to master a skill yourself. Tap into a vibrant community.
          </p>
          <button className="border-[2px] border-black text-black font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition">
            Our exchange model
          </button>
        </div>
        <div className="w-full md:w-1/2 p-6 lg:p-12 flex justify-center items-center group">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80"
            alt="Students studying"
            className="w-full h-auto object-cover border-[2px] border-black transition-all duration-300 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-1 group-hover:-translate-y-1"
          />
        </div>
      </section>

      {/* ── BOTTOM CTA GRID — UNTOUCHED ── */}
      <section className="w-full max-w-[1600px] mx-auto border-b-[2px] border-black flex flex-col bg-white">
        <div className="flex flex-col md:flex-row w-full min-h-[400px]">

          {/* Left visuals — UNTOUCHED */}
          <div className="flex w-full md:w-[240px] shrink-0 border-b-[2px] md:border-b-0 md:border-r-[2px] border-black">
            <div className="w-8 md:w-12 bg-yellow-400 border-r-[2px] border-black h-full" />
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[200%] h-[200%] border-t-[2px] border-black origin-top-left rotate-[65deg]" />
            </div>
          </div>

          {/* Center CTA */}
          <div className="flex-1 flex flex-col justify-center items-center p-12 lg:p-24 border-b-[2px] md:border-b-0 md:border-r-[2px] border-black text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-black mb-10 leading-[1.2]">
              Ready To Sync?<br />Your Skill Exchange Journey<br />Starts Here.
            </h2>
            <Link
              to="/find-hub"
              className="bg-black text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition"
            >
              Join the Exchange
            </Link>
          </div>

          {/* Right grid — UNTOUCHED */}
          <div className="hidden lg:grid grid-cols-4 grid-rows-6 w-[240px] shrink-0">
            {Array.from({ length: 24 }).map((_, i) => {
              let bg = ''
              if (i === 8)  bg = 'bg-yellow-400'
              if (i === 17) bg = 'bg-orange-500'
              if (i === 23) bg = 'bg-blue-500'
              return <div key={i} className={`border-r-[1px] border-b-[1px] border-black ${bg}`} />
            })}
          </div>
        </div>

        {/* Thick blue bottom bar — UNTOUCHED */}
        <div className="w-full h-16 bg-blue-500 border-t-[2px] border-black" />
      </section>

      {/* ── FOOTER — UNTOUCHED ── */}
      <footer className="w-full max-w-[1600px] mx-auto p-12 lg:p-16 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-extrabold text-black tracking-tight mb-8">SkillSync</h2>
            <div className="text-xs text-gray-500 mt-12 md:mt-24">©2026 SkillSync. All Rights Reserved.</div>
          </div>
          <div>
            <ul className="space-y-3 text-sm font-bold text-black">
              <li><Link to="/about" className="hover:underline">Company</Link></li>
              <li><Link to="/about" className="hover:underline">How It Works</Link></li>
              <li><Link to="/about" className="hover:underline">Tech & Coding</Link></li>
              <li><Link to="/about" className="hover:underline">Design & Creative</Link></li>
              <li><Link to="/about" className="hover:underline">Academic & Business</Link></li>
              <li><Link to="/find-hub" className="hover:underline">Find a Hub</Link></li>
              <li><Link to="/about" className="hover:underline">Token System</Link></li>
              <li><Link to="/about" className="hover:underline">Space Partnership</Link></li>
              <li><Link to="/careers" className="hover:underline">Ambassador Program</Link></li>
              <li><Link to="/about" className="hover:underline">Community Blog</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3 text-sm font-bold text-black mb-12">
              <li><Link to="/about" className="hover:underline">Join the Exchange</Link></li>
              <li><Link to="/about" className="hover:underline">Contact</Link></li>
              <li><Link to="/about" className="hover:underline">Login</Link></li>
            </ul>
            <div className="mt-auto">
              <a href="mailto:support@skillsync.org" className="text-xs font-bold hover:underline block mb-6">Support@skillsync.org</a>
              <ul className="space-y-1 text-xs text-gray-500">
                <li><Link to="/about" className="hover:underline">Privacy Policy</Link></li>
                <li><Link to="/about" className="hover:underline">Terms of Use</Link></li>
                <li><Link to="/about" className="hover:underline">Standards of Ethical Conduct</Link></li>
                <li><Link to="/about" className="hover:underline">Legal Center</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
