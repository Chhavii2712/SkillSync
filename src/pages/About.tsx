import { useState, useEffect, useRef } from 'react'

// ── Scroll-reveal ─────────────────────────────────────────────────────────────
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

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      setValue(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return value
}

// ── Reveal wrapper ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, from = 'bottom' }: {
  children: React.ReactNode; delay?: number; from?: 'bottom' | 'left' | 'right'
}) {
  const { ref, inView } = useInView(0.08)
  const translate = from === 'left' ? 'translateX(-40px)' : from === 'right' ? 'translateX(40px)' : 'translateY(32px)'
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translate(0)' : translate,
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

// ── Stats strip ───────────────────────────────────────────────────────────────
function StatsStrip() {
  const { ref, inView } = useInView(0.2)
  const students  = useCountUp(12400, 1800, inView)
  const exchanges = useCountUp(3200,  1600, inView)
  const hubs      = useCountUp(48,    1400, inView)
  const campuses  = useCountUp(62,    1500, inView)

  return (
    <div ref={ref} className="w-full border-b-4 border-black bg-[#185FA5]">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x-4 divide-y-4 md:divide-y-0 divide-black border-t-0">
        {[
          { value: students,  suffix: '+', label: 'Students',         bg: 'bg-[#185FA5]' },
          { value: exchanges, suffix: '+', label: 'Exchanges Done',   bg: 'bg-orange-500' },
          { value: hubs,      suffix: '',  label: 'Campus Hubs',      bg: 'bg-yellow-400' },
          { value: campuses,  suffix: '+', label: 'Campuses',         bg: 'bg-emerald-400' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} p-8 md:p-10 flex flex-col items-center justify-center`}>
            <span className={`text-4xl md:text-5xl font-black leading-none ${i === 0 ? 'text-white' : 'text-black'}`}>
              {s.value.toLocaleString()}{s.suffix}
            </span>
            <span className={`text-xs font-black uppercase tracking-widest mt-2 ${i === 0 ? 'text-blue-200' : 'text-black/60'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── How it works step card ────────────────────────────────────────────────────
function StepCard({ step, emoji, bg, title, desc, delay }: {
  step: string; emoji: string; bg: string; title: string; desc: string; delay: number
}) {
  const [hovered, setHovered] = useState(false)
  const { ref, inView } = useInView(0.1)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s cubic-bezier(0.34,1.3,0.64,1) ${delay}ms`,
    }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`border-4 border-black p-8 h-full flex flex-col bg-white relative overflow-hidden
          ${hovered ? 'shadow-none translate-x-1 translate-y-1' : 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}
          transition-all duration-200 cursor-default`}
      >
        {/* fill on hover */}
        <div className={`absolute inset-0 ${bg} transition-transform duration-300`}
          style={{ transform: hovered ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'bottom', zIndex: 0 }} />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between mb-6">
            <div className={`text-4xl p-3 border-4 border-black ${bg}
              ${hovered ? 'bg-white' : ''} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
              transition-all duration-200`}
              style={{ transform: hovered ? 'rotate(-8deg) scale(1.1)' : 'rotate(0) scale(1)', transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
              {emoji}
            </div>
            <span className={`text-6xl font-black leading-none transition-colors duration-200 ${hovered ? 'text-white/20' : 'text-black/10'}`}>
              {step}
            </span>
          </div>
          <h3 className={`text-xl font-black uppercase tracking-tight mb-3 transition-colors duration-200 ${hovered ? 'text-white' : 'text-black'}`}>
            {title}
          </h3>
          <p className={`text-sm font-bold leading-relaxed transition-colors duration-200 ${hovered ? 'text-white/80' : 'text-gray-600'}`}>
            {desc}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Pillar card ───────────────────────────────────────────────────────────────
function PillarCard({ icon, title, desc, accent, delay }: {
  icon: string; title: string; desc: string; accent: string; delay: number
}) {
  const { ref, inView } = useInView(0.1)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'scale(1)' : 'scale(0.9)',
      transition: `opacity 0.45s ease ${delay}ms, transform 0.45s cubic-bezier(0.34,1.4,0.64,1) ${delay}ms`,
    }}>
      <div className={`border-4 border-black p-6 bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200`}>
        <div className={`${accent} border-4 border-black w-14 h-14 flex items-center justify-center text-2xl mb-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
          {icon}
        </div>
        <h4 className="font-black uppercase text-base mb-2">{title}</h4>
        <p className="text-sm font-bold text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function About() {
  useEffect(() => { document.title = 'About — SkillSync' }, [])

  return (
    <div className="w-full min-h-screen bg-[#FFFDF9] text-black font-sans selection:bg-yellow-300">

      {/* ── HERO ── */}
      <section className="w-full border-b-4 border-black bg-white">
        <div className="w-full flex flex-col lg:flex-row">

          {/* Colour sidebar */}
          <div className="hidden lg:grid grid-cols-2 w-32 shrink-0 border-r-4 border-black">
            {['bg-white','bg-yellow-400','bg-orange-500','bg-blue-600',
              'bg-emerald-400','bg-white','bg-blue-600','bg-orange-500'].map((c, i) => (
              <div key={i} className={`${c} border-r-4 border-b-4 border-black aspect-square`} />
            ))}
          </div>

          {/* Headline */}
          <div className="flex-1 p-8 md:p-16 lg:p-24 flex flex-col justify-center border-b-4 lg:border-b-0 lg:border-r-4 border-black">
            <Reveal>
              <span className="inline-block bg-yellow-400 text-black text-xs font-black uppercase px-3 py-1 mb-6 border-2 border-black w-fit">
                About SkillSync
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none mb-6">
                Peer Learning<br />Tailored To<br />Your Goals.
              </h1>
              <p className="text-xl font-bold text-gray-700 max-w-xl leading-relaxed">
                SkillSync is built on one idea: every student has something worth teaching.
                The best teachers aren't always in classrooms — sometimes they're sitting right next to you.
              </p>
            </Reveal>
          </div>

          {/* Right panel — skill exchange visual */}
          <div className="w-full lg:w-[460px] shrink-0 bg-black flex items-center justify-center p-10 lg:p-14">
            <Reveal from="right">
              <div className="w-full space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Live Exchange Example</p>

                {/* Student A */}
                <div className="bg-white border-4 border-white/20 p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]">
                  <div className="w-10 h-10 bg-orange-500 border-2 border-white flex items-center justify-center text-white font-black text-sm flex-shrink-0">A</div>
                  <div>
                    <p className="font-black text-sm text-black">Arjun M. — IIT Delhi</p>
                    <p className="text-xs text-gray-500 font-bold">Offers: <span className="text-[#185FA5] font-black">Python</span> · Wants: <span className="text-orange-500 font-black">Guitar</span></p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex-1 h-0.5 bg-gray-600" />
                  <span className="text-yellow-400 font-black text-xl">⇄</span>
                  <div className="flex-1 h-0.5 bg-gray-600" />
                </div>

                {/* Student B */}
                <div className="bg-white border-4 border-white/20 p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(24,95,165,1)]">
                  <div className="w-10 h-10 bg-[#185FA5] border-2 border-white flex items-center justify-center text-white font-black text-sm flex-shrink-0">S</div>
                  <div>
                    <p className="font-black text-sm text-black">Sara K. — NYU</p>
                    <p className="text-xs text-gray-500 font-bold">Offers: <span className="text-orange-500 font-black">Guitar</span> · Wants: <span className="text-[#185FA5] font-black">Python</span></p>
                  </div>
                </div>

                {/* Match badge */}
                <div className="bg-emerald-400 border-4 border-emerald-400 p-3 text-center">
                  <span className="font-black uppercase text-sm text-black tracking-wider">✓ Perfect Match — Exchange Active</span>
                </div>

                <p className="text-[10px] font-bold text-gray-500 text-center uppercase tracking-widest">This happens 3,200+ times a month on SkillSync</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <StatsStrip />

      {/* ── HOW IT WORKS ── */}
      <section className="w-full border-b-4 border-black bg-[#FFFDF9]">
        <div className="border-b-4 border-black bg-blue-50 p-8 text-center">
          <Reveal>
            <span className="inline-block bg-[#185FA5] text-white text-xs font-black uppercase px-3 py-1 mb-4 border-2 border-black">The Model</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              A Model Built To Accelerate<br />Peer Learning And Skill Mastery
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 md:p-12 max-w-6xl mx-auto">
          <StepCard step="01" emoji="🎯" bg="bg-yellow-400" title="List Your Skill" desc="Tell us what you can teach and what you want to learn. Takes 2 minutes. No CV needed." delay={0} />
          <StepCard step="02" emoji="🔄" bg="bg-orange-500" title="Reciprocal Match" desc="Our system finds someone who has what you need — and needs exactly what you offer." delay={120} />
          <StepCard step="03" emoji="🤝" bg="bg-[#185FA5]"  title="Exchange & Grow" desc="Meet at your local SkillSync hub, exchange skills over sessions, track progress together." delay={240} />
        </div>
      </section>

      {/* ── CORE PILLARS ── */}
      <section className="w-full border-b-4 border-black bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block bg-orange-500 text-white text-xs font-black uppercase px-3 py-1 mb-4 border-2 border-black">Why It Works</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                A Strong Foundation In<br />Reciprocal Skill-Sharing
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PillarCard icon="🧠" accent="bg-yellow-400"   title="Learn By Teaching"       desc="When you teach a skill, you master it. SkillSync makes every student both a teacher and a learner." delay={0} />
            <PillarCard icon="⚡" accent="bg-orange-500"   title="Zero Cost, Real Value"   desc="No money exchanges hands. You trade time and expertise — the only currency that compounds." delay={100} />
            <PillarCard icon="📍" accent="bg-[#185FA5]"    title="Local Hub Network"        desc="Every exchange happens at a physical SkillSync hub on your campus — not on Zoom, not alone." delay={200} />
            <PillarCard icon="🔁" accent="bg-emerald-400"  title="Truly Reciprocal"         desc="Both students gain. No lopsided tutoring. No favours. A real exchange — always two-directional." delay={300} />
            <PillarCard icon="📈" accent="bg-yellow-400"   title="Trackable Progress"       desc="Log sessions, track skills gained, and build a verifiable learning profile over time." delay={400} />
            <PillarCard icon="🌐" accent="bg-orange-500"   title="Scalable Across Campuses" desc="What works in Austin works in Delhi. SkillSync's model is designed to scale without losing quality." delay={500} />
          </div>
        </div>
      </section>

      {/* ── MANIFESTO BANNER ── */}
      <section className="w-full border-b-4 border-black bg-black py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Our Belief</p>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
              "Reciprocal Learning Networks, Reimagined For Today."
            </h2>
            <p className="text-gray-400 font-bold text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Reciprocal learning isn't new — it's how humans have always taught each other.
              SkillSync just makes it scalable, trackable, and available to every student on campus.
            </p>
            <a href="/find-hub"
              className="inline-block bg-yellow-400 text-black font-black uppercase tracking-wider text-sm border-4 border-yellow-400 px-8 py-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] transition-all">
              Find Your Hub →
            </a>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ STRIP ── */}
      <section className="w-full bg-[#FFFDF9] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-2xl font-black uppercase text-center mb-10">Quick Questions</h2>
          </Reveal>
          {[
            { q: 'Is SkillSync really free?', a: 'Yes — 100%. No subscription, no credits, no hidden fees. You exchange skills, not money.' },
            { q: 'What if I can\'t find a match?', a: 'Our team manually reviews unmatched requests weekly and suggests alternative exchange partners.' },
            { q: 'Do I need to be a student?', a: 'Currently yes — you need a .edu email or a verified campus ID to join.' },
            { q: 'What skills can I exchange?', a: 'Anything — coding, design, music, languages, fitness, cooking, photography, finance, and more.' },
          ].map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} delay={i * 80} />
          ))}
        </div>
      </section>

    </div>
  )
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function FAQItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false)
  const { ref, inView } = useInView(0.05)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-24px)',
      transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
    }}
      className="border-4 border-black mb-3 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center p-5 text-left"
      >
        <span className="font-black uppercase text-sm">{q}</span>
        <span className={`text-2xl font-black transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t-4 border-black pt-4">
          <p className="text-sm font-bold text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}
