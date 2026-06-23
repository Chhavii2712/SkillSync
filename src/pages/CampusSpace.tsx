import { useState, useEffect, useRef } from 'react'
import { submitInquiry } from '../firebase/firestore'
import { useAuth } from '../context/AuthContext'
import ProtectedAction from '../components/ProtectedAction'

function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return value
}

function useInView(threshold = 0.15) {
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

function PropertyStatsCard() {
  const { ref, inView } = useInView(0.2)
  const hubs     = useCountUp(48,    1600, inView)
  const students = useCountUp(12400, 2000, inView)
  const sqft     = useCountUp(84000, 1800, inView)
  const payout   = useCountUp(2800,  1600, inView)

  return (
    <div ref={ref} className="w-full lg:w-[500px] shrink-0 bg-[#185FA5] border-t-4 lg:border-t-0 lg:border-l-4 border-black flex items-center justify-center p-8 md:p-12">
      <div className="w-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="bg-black text-white px-5 py-3 flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-widest">Hub Performance</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x-4 divide-y-4 divide-black border-b-4 border-black">
          {[
            { value: hubs,     suffix: '',    label: 'Active Hubs',      bg: 'bg-white',       icon: '🏛' },
            { value: students, suffix: '+',   label: 'Students Served',  bg: 'bg-yellow-300',  icon: '🎓' },
            { value: sqft,     suffix: '',    label: 'Sq Ft Managed',    bg: 'bg-orange-400',  icon: '📐', format: true },
            { value: payout,   suffix: '/mo', label: 'Avg Host Payout',  bg: 'bg-emerald-400', icon: '💵', dollar: true },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} p-5 flex flex-col gap-1`}>
              <span className="text-2xl">{s.icon}</span>
              <span className="text-2xl font-black leading-none text-black">
                {s.dollar && '$'}{s.value.toLocaleString()}{s.suffix}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-black/60">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-white">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Monthly Earning Estimate</p>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-3 bg-[#185FA5] border-2 border-black flex-1 rounded-sm" style={{ maxWidth: '70%' }} />
            <span className="text-xs font-black">$1,800–$4,200</span>
          </div>
          <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
            <span>500 sq ft</span><span>2,000+ sq ft</span>
          </div>
        </div>
        <div className="border-t-4 border-black bg-[#185FA5] px-5 py-3 flex justify-between items-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/70">SkillSync Host Network</span>
          <span className="text-[10px] font-black text-white">© 2026</span>
        </div>
      </div>
    </div>
  )
}

function BenefitCard({ text, index }: { text: string; index: number }) {
  const { ref, inView } = useInView(0.05)
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.4s ease ${index * 70}ms, transform 0.4s cubic-bezier(0.34,1.4,0.64,1) ${index * 70}ms`,
      }}
      className="bg-white border-4 border-black p-6 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
    >
      <span className="bg-emerald-400 border-2 border-black w-8 h-8 rounded-full flex items-center justify-center font-black text-black shrink-0 mr-4">✓</span>
      <span className="font-bold uppercase tracking-wide text-xs md:text-sm text-gray-900">{text}</span>
    </div>
  )
}

const BENEFITS = [
  'Consistent monthly income',
  'Zero management burden',
  'Community impact in your building',
  'Long-term lease security',
  'SkillSync handles insurance',
  'Positive press & local visibility',
]

export default function CampusSpace() {
  const { user } = useAuth()
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [address, setAddress] = useState('')
  const [sqft, setSqft]       = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    document.title = 'List Your Space — SkillSync'
    if (user) {
      setName(user.displayName || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await submitInquiry({ name, email, address, sqft })
      setSuccess(true)
      setName(''); setEmail(''); setAddress(''); setSqft('')
    } catch (err: any) {
      console.error(err)
      setError('Failed to submit inquiry. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFDF9] text-black font-sans selection:bg-yellow-300">

      {/* ── HERO ── */}
      <section className="w-full border-b-4 border-black">
        <div className="w-full flex flex-col lg:flex-row">
          <div className="hidden lg:grid grid-cols-2 w-32 shrink-0 border-r-4 border-black bg-white">
            {['bg-white','bg-yellow-400','bg-orange-500','bg-blue-600','bg-white','bg-white','bg-yellow-400','bg-blue-600'].map((c,i) => (
              <div key={i} className={`${c} border-r-4 border-b-4 border-black aspect-square last:border-b-0`} />
            ))}
          </div>
          <div className="flex-1 p-8 md:p-16 lg:p-24 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-center bg-white">
            <span className="inline-block bg-emerald-400 text-black text-xs font-black uppercase px-3 py-1 mb-6 border-2 border-black w-fit">
              For Landlords & Campus Partners
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-none mb-6">
              Turn Your Venue Space Into Income And Impact Your Community
            </h1>
            <p className="text-xl font-medium text-gray-700 max-w-2xl mb-8 leading-relaxed">
              Partner with SkillSync to host campus hubs. We handle everything — you collect a cheque every month.
            </p>
            <a
              href="#inquiry"
              className="bg-orange-500 text-white font-black uppercase tracking-wider text-sm border-4 border-black px-8 py-4 w-fit shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              List Your Space →
            </a>
          </div>
          <PropertyStatsCard />
        </div>
      </section>

      {/* ── WHAT IT MEANS ── */}
      <section className="w-full border-b-4 border-black bg-emerald-50">
        <div className="w-full flex flex-col md:flex-row divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
          <div className="bg-emerald-400 text-black p-8 md:w-64 shrink-0 flex flex-col justify-center items-center md:items-start">
            <span className="text-5xl mb-2">🌿</span>
            <h2 className="text-xl font-black uppercase tracking-wider">The Mission</h2>
          </div>
          <div className="p-8 md:p-16 flex-1 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black mb-4">
              What It Means To Bring A SkillSync Campus Hub To Your Space
            </h3>
            <p className="text-gray-800 font-medium text-lg leading-relaxed">
              Your venue becomes a dedicated learning environment — where hundreds of students exchange skills, build friendships, and grow. You earn revenue. Students earn knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="w-full border-b-4 border-black bg-white">
        <div className="p-8 border-b-4 border-black bg-blue-50 text-center">
          <h2 className="text-3xl font-black uppercase tracking-wide text-black">
            How It Works: Turning Space Into Opportunity
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
          {[
            { step: '01', emoji: '📝', bg: 'bg-yellow-300', hover: 'hover:bg-yellow-50/50', title: 'Apply Online',     desc: 'Submit your property details. We review and respond within 5 business days.' },
            { step: '02', emoji: '⚙️', bg: 'bg-orange-400', hover: 'hover:bg-orange-50/50', title: 'We Handle Setup',  desc: 'SkillSync furnishes, brands, and manages the hub. You just provide the space.' },
            { step: '03', emoji: '💰', bg: 'bg-blue-500',   hover: 'hover:bg-blue-50/50',   title: 'Earn Every Month', desc: 'Consistent monthly payments at competitive market rates, auto-renewed annually.' },
          ].map(s => (
            <div key={s.step} className={`p-8 flex flex-col bg-white ${s.hover} transition-colors group`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`text-3xl p-3 ${s.bg} border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all`}>
                  {s.emoji}
                </div>
                <span className="text-5xl font-black text-black/10 leading-none mt-1">{s.step}</span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-wide text-black mb-2">Step {s.step}: {s.title}</h3>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RATES CALLOUT ── */}
      <section className="w-full border-b-4 border-black bg-yellow-300">
        <div className="w-full p-8 md:p-16 lg:p-20 text-center max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black mb-4">
            Lease Your Space To SkillSync For Competitive Market Rates
          </h2>
          <p className="text-black font-semibold mb-8 max-w-3xl mx-auto text-base md:text-lg">
            We pay market rate or above, with 12-month minimum leases and automatic renewal options.
          </p>
          <a
            href="#inquiry"
            className="bg-black text-white font-black uppercase tracking-wider text-xs border-4 border-black px-8 py-4 inline-block shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all"
          >
            Get A Rate Quote →
          </a>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="w-full py-16 border-b-4 border-black bg-white">
        <div className="w-full px-6 lg:px-16">
          <h2 className="text-3xl font-black uppercase tracking-wide text-center text-black mb-12">
            The Benefits Of Partnering With SkillSync
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
            {BENEFITS.map((b, i) => <BenefitCard key={i} text={b} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── INQUIRY FORM ── */}
      <section id="inquiry" className="w-full border-b-4 border-black">
        <div className="w-full flex flex-col lg:flex-row min-h-[600px]">

          {/* Left accent column — blue */}
          <div className="hidden lg:flex flex-col w-[220px] shrink-0 border-r-4 border-black bg-[#185FA5]">
            <div className="flex-1 flex flex-col justify-between p-6">
              <div>
                <p className="text-white font-black uppercase tracking-widest text-xs mb-8">Submit Your Space</p>
                <div className="space-y-3">
                  {['Name', 'Email', 'Address', 'Sq Ft'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 border-2 border-white flex items-center justify-center text-[10px] font-black text-white ${i === 0 ? 'bg-white !text-[#185FA5]' : ''}`}>
                        {i + 1}
                      </div>
                      <span className="text-white/70 text-xs font-bold uppercase tracking-wider">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative blocks */}
              <div className="grid grid-cols-2 gap-2 mt-8">
                <div className="aspect-square bg-yellow-400 border-2 border-black" />
                <div className="aspect-square bg-orange-500 border-2 border-black" />
                <div className="aspect-square border-2 border-white/30" />
                <div className="aspect-square bg-white/10 border-2 border-white/30" />
              </div>
            </div>
          </div>

          {/* Form center */}
          <div className="flex-1 bg-white p-8 md:p-16 flex flex-col justify-center border-r-4 border-black">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black mb-2">
              Bring A SkillSync Hub To Your Property
            </h2>
            <p className="text-gray-500 text-sm font-medium mb-10 border-b-4 border-black pb-6">
              Fill in your details and we'll get back to you within 5 business days.
            </p>

            {success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-black text-emerald-600 uppercase tracking-wide mb-2">Thank you!</h3>
                <p className="text-gray-700 font-medium text-sm mb-6">
                  We'll contact you within 5 business days to discuss your property.
                </p>
                <button onClick={() => setSuccess(false)} className="border-b-4 border-black font-black uppercase tracking-wider text-xs hover:text-orange-600 transition-colors">
                  Submit another property
                </button>
              </div>
            ) : (
              <ProtectedAction>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {[
                    { label: 'Name',                value: name,    onChange: setName,    placeholder: 'Your full name',            type: 'text'   },
                    { label: 'Email',               value: email,   onChange: setEmail,   placeholder: 'name@example.com',          type: 'email'  },
                    { label: 'Property Address',    value: address, onChange: setAddress, placeholder: 'Street, City, State, ZIP',  type: 'text'   },
                    { label: 'Approximate Sq Ft',   value: sqft,    onChange: setSqft,    placeholder: 'e.g. 2500',                 type: 'number' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">{f.label}</label>
                      <input
                        type={f.type}
                        required
                        value={f.value}
                        onChange={e => f.onChange(e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 border-4 border-black font-semibold text-sm outline-none bg-white focus:bg-yellow-50 transition-all"
                      />
                    </div>
                  ))}

                  {error && (
                    <div className="bg-red-50 border-4 border-red-600 text-red-600 text-xs font-black uppercase p-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-black uppercase tracking-widest text-xs py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#185FA5] disabled:opacity-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all mt-2"
                  >
                    {loading ? 'Submitting…' : 'Submit Inquiry →'}
                  </button>
                </form>
              </ProtectedAction>
            )}
          </div>

          {/* Right accent column — orange + yellow */}
          <div className="hidden lg:flex flex-col w-[220px] shrink-0 border-l-0">
            <div className="flex-1 bg-orange-500 border-b-4 border-black flex flex-col justify-end p-6">
              <p className="text-4xl font-black text-white leading-none">$1.8k</p>
              <p className="text-xs font-black uppercase tracking-widest text-white/70 mt-1">Min monthly</p>
            </div>
            <div className="flex-1 bg-yellow-400 border-b-4 border-black flex flex-col justify-end p-6">
              <p className="text-4xl font-black text-black leading-none">$4.2k</p>
              <p className="text-xs font-black uppercase tracking-widest text-black/60 mt-1">Max monthly</p>
            </div>
            <div className="flex-1 bg-black flex flex-col justify-end p-6">
              <p className="text-4xl font-black text-white leading-none">12mo</p>
              <p className="text-xs font-black uppercase tracking-widest text-white/50 mt-1">Min lease</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
