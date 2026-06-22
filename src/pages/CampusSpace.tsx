import { useState, useEffect } from 'react'
import { submitInquiry } from '../firebase/firestore'
import { useAuth } from '../context/AuthContext'
import ProtectedAction from '../components/ProtectedAction'

export default function CampusSpace() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [sqft, setSqft] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = "List Your Space — SkillSync"
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
      setName('')
      setEmail('')
      setAddress('')
      setSqft('')
    } catch (err: any) {
      console.error(err)
      setError('Failed to submit inquiry. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#FFFDF9] text-black font-sans selection:bg-yellow-300">
      
      {/* ── HERO SECTION WITH BLUEPRINT SCHEMATIC ── */}
      <section className="w-full border-b-4 border-black">
        <div className="w-full flex flex-col lg:flex-row">
          
          {/* Brand Grid Sidebar Block */}
          <div className="hidden lg:grid grid-cols-2 w-32 shrink-0 border-r-4 border-black bg-white">
            <div className="border-r-4 border-b-4 border-black aspect-square bg-white" />
            <div className="border-b-4 border-black aspect-square bg-yellow-400" />
            <div className="border-r-4 border-b-4 border-black aspect-square bg-orange-500" />
            <div className="border-b-4 border-black aspect-square bg-blue-600" />
            <div className="border-r-4 border-b-4 border-black aspect-square bg-white" />
            <div className="border-b-4 border-black aspect-square bg-white" />
            <div className="border-r-4 border-black aspect-square bg-yellow-400" />
            <div className="aspect-square bg-blue-600" />
          </div>

          {/* Main Hero Content */}
          <div className="flex-1 p-8 md:p-16 lg:p-24 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-center bg-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black leading-none mb-6">
              Turn Your Venue Space Into Income And Impact Your Community
            </h1>
            <p className="text-xl font-medium text-gray-700 max-w-2xl mb-8 leading-relaxed">
              Partner with SkillSync to host campus hubs and earn competitive market rates.
            </p>
            <a 
              href="#inquiry" 
              className="bg-orange-500 text-white font-black uppercase tracking-wider text-sm border-4 border-black px-8 py-4 w-fit shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              List Your Space &rarr;
            </a>
          </div>

          {/* Alternative Layout Diagram Component */}
          <div className="w-full lg:w-[500px] shrink-0 bg-yellow-400 p-8 md:p-12 flex items-center justify-center border-t-4 lg:border-t-0 border-black">
            <div className="relative border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full aspect-[6/5] flex flex-col justify-between overflow-hidden select-none">
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, black 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className="border-2 border-black bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                  LAYOUT SCHEMATIC // v2.6
                </div>
                <div className="text-right font-mono text-[9px] text-gray-500 font-bold">
                  SYS_REF: #SK-2026
                </div>
              </div>

              <div className="relative z-10 my-4 flex-1 border-2 border-dashed border-black/30 p-3 grid grid-cols-3 gap-3 bg-gray-50/50">
                <div className="border-2 border-black bg-blue-500 p-2 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[8px] font-black uppercase tracking-tight text-white">ZONE 01</span>
                  <span className="text-xs font-black tracking-tight text-white leading-none">WORK DESKS</span>
                </div>
                <div className="col-span-2 border-2 border-black bg-orange-500 p-2 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[8px] font-black uppercase tracking-tight text-white">ZONE 02</span>
                  <span className="text-xs font-black tracking-tight text-white leading-none">PEER LOUNGE</span>
                </div>
                <div className="col-span-2 border-2 border-black bg-white p-2 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[8px] font-black uppercase tracking-tight text-gray-500">ZONE 03</span>
                  <span className="text-xs font-black tracking-tight text-black leading-none">STUDIO</span>
                </div>
                <div className="border-2 border-black bg-yellow-300 p-2 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-[8px] font-black uppercase tracking-tight text-black">UTIL</span>
                  <span className="text-xs font-black tracking-tight text-black leading-none">SERVER</span>
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-center border-t-2 border-black pt-3">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full border border-black animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-gray-700">SPATIAL OPTIMIZATION ACTIVE</span>
                </div>
                <span className="text-[10px] font-black tracking-tight">SKILLSYNC © 2026</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── WHAT IT MEANS BANNER ── */}
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
            <p className="text-gray-800 font-medium text-lg leading-relaxed w-full">
              Your venue becomes a dedicated learning environment — a place where hundreds of students come to exchange skills, build friendships, and grow. You earn revenue. Students earn knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="w-full border-b-4 border-black bg-white">
        <div className="w-full">
          <div className="p-8 border-b-4 border-black bg-blue-50 text-center">
            <h2 className="text-3xl font-black uppercase tracking-wide text-black">
              How It Works: Turning Space Into Opportunity
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
            <div className="p-8 flex flex-col bg-white hover:bg-yellow-50/50 transition-colors">
              <div className="text-4xl mb-4 p-3 bg-yellow-300 border-4 border-black w-fit shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black">📝</div>
              <h3 className="text-xl font-black uppercase tracking-wide text-black mb-2">Step 1: Apply online</h3>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">Submit your property details. We'll review and respond within 5 business days.</p>
            </div>

            <div className="p-8 flex flex-col bg-white hover:bg-orange-50/50 transition-colors">
              <div className="text-4xl mb-4 p-3 bg-orange-400 border-4 border-black w-fit shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black">⚙️</div>
              <h3 className="text-xl font-black uppercase tracking-wide text-black mb-2">Step 2: We handle setup</h3>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">SkillSync furnishes, brands, and manages the hub. You provide the space.</p>
            </div>

            <div className="p-8 flex flex-col bg-white hover:bg-blue-50/50 transition-colors">
              <div className="text-4xl mb-4 p-3 bg-blue-400 border-4 border-black w-fit shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black text-white">💰</div>
              <h3 className="text-xl font-black uppercase tracking-wide text-black mb-2">Step 3: Earn every month</h3>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">Receive consistent monthly payments at competitive market rates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEASE RATES CALLOUT ── */}
      <section className="w-full border-b-4 border-black bg-yellow-300">
        <div className="w-full p-8 md:p-16 lg:p-20 text-center max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-black mb-4">
            Lease Your Space To SkillSync For Competitive Market Rates
          </h2>
          <p className="text-black font-semibold mb-8 max-w-3xl mx-auto text-base md:text-lg">
            We pay market rate or above, with 12-month minimum lease agreements and automatic renewal options.
          </p>
          <a 
            href="#inquiry" 
            className="bg-black text-white font-black uppercase tracking-wider text-xs border-4 border-black px-8 py-4 inline-block shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            Get A Rate Quote &rarr;
          </a>
        </div>
      </section>

      {/* ── BENEFITS GRID SECTION ── */}
      <section className="w-full py-16 border-b-4 border-black bg-white">
        <div className="w-full px-6 lg:px-16">
          <h2 className="text-3xl font-black uppercase tracking-wide text-center text-black mb-12">
            The Benefits Of Partnering With SkillSync
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto">
            {[
              "Consistent monthly income", 
              "Zero management burden", 
              "Community impact", 
              "Long-term lease security", 
              "SkillSync handles insurance", 
              "Positive press & visibility"
            ].map((benefit, i) => (
              <div 
                key={i} 
                className="bg-white border-4 border-black p-6 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <span className="bg-emerald-400 border-2 border-black w-8 h-8 rounded-full flex items-center justify-center font-black text-black shrink-0 mr-4 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  ✓
                </span>
                <span className="font-bold uppercase tracking-wide text-xs md:text-sm text-gray-900">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CENTERED FORM SECTION WITH DECORATIVE INTERSECTING BOXES (FROM IMAGE_9AE1CC.PNG) ── */}
      <section id="inquiry" className="w-full relative bg-white border-b-4 border-black py-20 overflow-hidden">
        
        {/* Decorative Intersecting Frame Guidelines and Boxes matching image_9ae1cc.png */}
        <div className="absolute left-0 lg:left-16 top-0 bottom-0 w-[4px] bg-black hidden sm:block">
          {/* Yellow top corner grid block token */}
          <div className="absolute top-4 -left-4 w-12 h-12 bg-yellow-400 border-4 border-black" />
          {/* Orange mid-hanging block token exactly as shown in image_9ae1cc.png */}
          <div className="absolute top-1/3 -left-4 w-12 h-12 bg-orange-500 border-4 border-black" />
        </div>

        {/* Big Blue Right Side Panel accent matching image_9ae1cc.png */}
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-blue-600 border-l-4 border-black hidden md:flex flex-col justify-end p-4 select-none">
          <p className="text-white font-black text-3xl leading-none">2026</p>
          <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mt-1">HUBS OPEN</p>
        </div>

        {/* Centered Card Content Wrapper */}
        <div className="max-w-xl mx-auto px-4 relative z-10">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
            
            <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-8 text-center border-b-4 border-black pb-4">
              Bring A SkillSync Campus Hub To Your Property
            </h2>
            
            {success ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-black text-emerald-600 uppercase tracking-wide mb-2">Thank you!</h3>
                <p className="text-gray-700 font-medium text-sm mb-6">
                  We'll contact you within 5 business days to discuss your property layout details.
                </p>
                <button 
                  onClick={() => setSuccess(false)} 
                  className="border-b-4 border-black font-black uppercase tracking-wider text-xs text-black hover:text-orange-600 transition-colors"
                >
                  Submit another property
                </button>
              </div>
            ) : (
              <ProtectedAction>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border-4 border-black font-semibold text-sm outline-none bg-white focus:bg-yellow-50/30 transition-all focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Email</label>
                    <input 
                      type="email" 
                      required 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 border-4 border-black font-semibold text-sm outline-none bg-white focus:bg-yellow-50/30 transition-all focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Property Address</label>
                    <input 
                      type="text" 
                      required 
                      value={address} 
                      onChange={e => setAddress(e.target.value)} 
                      placeholder="Street address, City, State, ZIP"
                      className="w-full px-4 py-3 border-4 border-black font-semibold text-sm outline-none bg-white focus:bg-yellow-50/30 transition-all focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">Approximate sq ft</label>
                    <input 
                      type="number" 
                      required 
                      value={sqft} 
                      onChange={e => setSqft(e.target.value)} 
                      placeholder="e.g. 2500" 
                      className="w-full px-4 py-3 border-4 border-black font-semibold text-sm outline-none bg-white focus:bg-yellow-50/30 transition-all focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                    />
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border-4 border-red-600 text-red-600 text-xs font-black uppercase tracking-wide p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {error}
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-blue-600 text-white font-black uppercase tracking-widest text-xs py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 disabled:opacity-50 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all mt-4"
                  >
                    {loading ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                  </button>

                </form>
              </ProtectedAction>
            )}
            
          </div>
        </div>
      </section>

    </div>
  )
}