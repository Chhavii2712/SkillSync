
import { useState, useEffect, useRef } from 'react'
import { getJobs, submitJobApplication } from '../firebase/firestore'

interface Job { id: string; title: string; department: string; location: string; type: string }

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ── Perk card with pop-in animation ──────────────────────────────────────────
function PerkCard({ text, index }: { text: string; index: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(20px)',
        transition: `opacity 0.4s ease ${index * 80}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${index * 80}ms`,
      }}
      className="bg-white border-4 border-black p-4 flex items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-shadow duration-200"
    >
      <span className="bg-emerald-400 border-2 border-black w-8 h-8 rounded-full flex items-center justify-center mr-4 font-black text-sm flex-shrink-0">✓</span>
      <span className="font-bold uppercase text-xs">{text}</span>
    </div>
  )
}

const PERKS = [
  'Work directly with students',
  'Build tools that change how people learn',
  'Unlimited PTO',
  'Health + dental + vision coverage',
  '$2,000 annual learning stipend',
  'Direct mentorship from founders',
  'Equity for full-time roles',
  'Remote-first culture',
]

const TABS = ['All', 'Engineering', 'Operations', 'Marketing', 'Design']

// normalize for filter comparison — strips spaces, case, punctuation
const norm = (s: string) => (s || '').trim().toLowerCase().replace(/[^a-z]/g, '')

// ── Apply modal ───────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', why: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email) return
    setLoading(true)
    try {
      await submitJobApplication({ ...form, jobId: job.id, jobTitle: job.title })
      setSubmitted(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
        {submitted ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-black mb-2">Application Sent!</h3>
            <p className="font-bold text-gray-600 mb-6">We'll be in touch within 5 business days.</p>
            <button onClick={onClose} className="bg-black text-white px-8 py-3 font-black uppercase">Close</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-black uppercase text-gray-400 mb-1">Applying for</p>
                <h3 className="text-xl font-black">{job.title}</h3>
                <span className="text-xs font-bold text-orange-500 uppercase">{job.department} · {job.location}</span>
              </div>
              <button onClick={onClose} className="text-2xl font-black hover:text-red-500">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase mb-1 block">Full Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:bg-yellow-50"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-black uppercase mb-1 block">Email *</label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:bg-yellow-50"
                  placeholder="your@email.com" type="email" />
              </div>
              <div>
                <label className="text-xs font-black uppercase mb-1 block">Why SkillSync?</label>
                <textarea value={form.why} onChange={e => setForm(f => ({ ...f, why: e.target.value }))}
                  className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:bg-yellow-50 resize-none"
                  rows={3} placeholder="What excites you about this role?" />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.name || !form.email}
                className="w-full bg-black text-white py-4 font-black uppercase text-sm disabled:opacity-40 hover:bg-orange-500 transition-colors"
              >
                {loading ? 'Sending...' : 'Submit Application →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Why Join card ─────────────────────────────────────────────────────────────
const WHY_CARDS = [
  {
    label: 'Mission-Driven',
    desc: 'Every line of code directly impacts how students learn and grow.',
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    hoverBg: 'hover:bg-blue-600',
    emoji: '🎯',
    stat: '12,400+',
    statLabel: 'students impacted',
  },
  {
    label: 'Competitive Pay',
    desc: 'Market-rate salaries, equity for full-time roles, and a $2K annual learning budget.',
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    hoverBg: 'hover:bg-orange-500',
    emoji: '💰',
    stat: '$2K',
    statLabel: 'learning stipend',
  },
  {
    label: 'Remote-First',
    desc: 'Work from anywhere. Async-friendly culture with optional campus hub visits.',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    hoverBg: 'hover:bg-emerald-500',
    emoji: '🌍',
    stat: '100%',
    statLabel: 'remote options',
  },
]

function WhyJoinCard({ card, index }: { card: typeof WHY_CARDS[0]; index: number }) {
  const { ref, inView } = useInView(0.1)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) rotate(0deg)' : `translateY(48px) rotate(${index % 2 === 0 ? -2 : 2}deg)`,
        transition: `opacity 0.5s ease ${index * 120}ms, transform 0.5s cubic-bezier(0.34,1.3,0.64,1) ${index * 120}ms`,
      }}
      className={`relative bg-white border-4 border-black p-7 cursor-pointer overflow-hidden
        ${hovered ? 'shadow-none translate-x-1 translate-y-1' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}
        transition-all duration-200`}
    >
      {/* Animated fill background on hover */}
      <div
        className={`absolute inset-0 ${card.color} transition-all duration-300`}
        style={{ transform: hovered ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'bottom', zIndex: 0 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with bounce */}
        <div
          className={`w-14 h-14 border-4 border-black flex items-center justify-center text-2xl mb-5
            ${hovered ? 'bg-white' : card.color}
            transition-all duration-200`}
          style={{ transform: hovered ? 'scale(1.15) rotate(-6deg)' : 'scale(1) rotate(0deg)', transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
        >
          {card.emoji}
        </div>

        <h3 className={`font-black uppercase text-xl mb-2 transition-colors duration-200 ${hovered ? 'text-white' : 'text-black'}`}>
          {card.label}
        </h3>
        <p className={`text-sm font-bold mb-5 transition-colors duration-200 ${hovered ? 'text-white/80' : 'text-gray-600'}`}>
          {card.desc}
        </p>

        {/* Stat pill */}
        <div
          className={`inline-flex items-center gap-2 border-2 px-3 py-1.5 transition-all duration-200
            ${hovered ? 'border-white bg-white/20' : `border-black ${card.color} bg-opacity-10`}`}
        >
          <span className={`font-black text-lg ${hovered ? 'text-white' : card.textColor}`}>{card.stat}</span>
          <span className={`text-xs font-bold uppercase ${hovered ? 'text-white/70' : 'text-gray-500'}`}>{card.statLabel}</span>
        </div>
      </div>
    </div>
  )
}

function WhyJoinSection() {
  const { ref, inView } = useInView(0.05)
  return (
    <>
      <div
        ref={ref}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-black uppercase mb-2">Why Join SkillSync</h2>
        <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Hover to explore</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {WHY_CARDS.map((card, i) => (
          <WhyJoinCard key={i} card={card} index={i} />
        ))}
      </div>
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [activeTab, setActiveTab] = useState('All')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    document.title = 'Careers — SkillSync'
    getJobs()
      .then(data => setJobs(data as Job[]))
      .finally(() => setLoadingJobs(false))
  }, [])

  const filteredJobs = activeTab === 'All'
  ? jobs
  : jobs.filter(j => j.department === activeTab)

  const { ref: perksRef, inView: perksInView } = useInView(0.05)

  return (
    <div className="w-full min-h-screen bg-[#FFFDF9] text-black font-sans">

      {/* ── HERO ── */}
      <section className="py-20 px-6 border-b-4 border-black bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-orange-500 text-white text-xs font-black uppercase px-3 py-1 mb-4 border-2 border-black">
              We're Hiring
            </span>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-none">
              OUR WORK IS NOT FOR THE FAINT OF HEART.
            </h1>
            <p className="text-lg font-bold mb-8 text-gray-700">
              We're building the future of peer learning — hard, meaningful work that actually changes how students grow.
            </p>
            <a href="#jobs" className="inline-block bg-orange-500 text-white px-10 py-4 font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              See Open Roles →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { bg: 'bg-blue-600', label: 'Mission', emoji: '🎯' },
              { bg: 'bg-orange-500', label: 'Growth', emoji: '📈' },
              { bg: 'bg-emerald-400', label: 'Impact', emoji: '✨' },
              { bg: 'bg-yellow-400', label: 'Community', emoji: '🤝' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className={`${item.bg} border-4 border-black flex items-center justify-center text-white text-4xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] aspect-square`}>
                  {item.emoji}
                </div>
                <p className="mt-2 font-black uppercase text-xs">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY JOIN — animated cards ── */}
      <section className="py-14 px-6 bg-[#FFFDF9] border-b-4 border-black">
        <div className="max-w-5xl mx-auto">
          <WhyJoinSection />
        </div>
      </section>

      {/* ── TRULY REWARDING WORK — scroll-reveal pop-in ── */}
      <section ref={perksRef} className="w-full border-b-4 border-black bg-emerald-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            style={{
              opacity: perksInView ? 1 : 0,
              transform: perksInView ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            <h2 className="text-3xl font-black uppercase text-center mb-2">Truly Rewarding Work</h2>
            <p className="text-center text-sm font-bold text-gray-500 mb-10 uppercase tracking-wider">
              Real perks. No fluff.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PERKS.map((perk, i) => (
              <PerkCard key={i} text={perk} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB BOARD ── */}
      <section id="jobs" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black uppercase text-center mb-10">Open Positions</h2>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 border-4 border-black font-black uppercase text-sm transition-all
                ${activeTab === tab
                  ? 'bg-black text-white shadow-none translate-x-0.5 translate-y-0.5'
                  : 'bg-white hover:bg-yellow-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-2 text-xs opacity-60">
                  ({jobs.filter(j => norm(j.department) === norm(tab)).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-stone-100 border-b-4 border-black uppercase text-xs font-black">
                <th className="p-4 border-r-4 border-black">Role</th>
                <th className="p-4 border-r-4 border-black">Department</th>
                <th className="p-4 border-r-4 border-black">Location</th>
                <th className="p-4 border-r-4 border-black">Type</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingJobs ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b-4 border-black animate-pulse">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="p-4 border-r-4 border-black last:border-r-0">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job, i) => (
                  <tr
                    key={job.id}
                    className={`border-b-4 border-black hover:bg-yellow-50 font-bold uppercase text-xs transition-colors ${i === filteredJobs.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="p-4 border-r-4 border-black">{job.title}</td>
                    <td className="p-4 border-r-4 border-black">{job.department}</td>
                    <td className="p-4 border-r-4 border-black">{job.location}</td>
                    <td className="p-4 border-r-4 border-black">
                      <span className={`border-2 border-black px-2 py-1 text-xs font-black ${job.type?.toLowerCase() === 'part-time' ? 'bg-yellow-300' : 'bg-emerald-400'}`}>
                        {job.type}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="bg-black text-white px-6 py-2 font-black uppercase text-xs hover:bg-orange-500 transition-colors border-2 border-black"
                      >
                        Apply →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center font-black uppercase text-gray-400">
                    No {activeTab} positions open right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Count label */}
        {!loadingJobs && (
          <p className="text-center mt-4 text-xs font-black uppercase text-gray-400">
            Showing {filteredJobs.length} of {jobs.length} positions
          </p>
        )}
      </section>

      {/* ── CAMPUS CHAPTER CTA ── */}
      <section className="py-16 px-6 border-t-4 border-black bg-white">
        <div className="max-w-2xl mx-auto text-center border-4 border-dashed border-black p-10">
          <h3 className="text-2xl font-black uppercase mb-3">Interested In Starting A SkillSync Campus Team?</h3>
          <p className="font-bold text-gray-600 mb-6">Apply to run your campus chapter — get trained, supported, and connected to the network.</p>
          <a href="/find-hub" className="inline-block bg-black text-white px-10 py-4 font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            Apply To Start A Chapter →
          </a>
        </div>
      </section>

      {/* ── Apply modal ── */}
      {selectedJob && (
        <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}
