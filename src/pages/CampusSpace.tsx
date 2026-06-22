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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <section className="bg-white py-16 md:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Turn Your Venue Space Into Income And Impact Your Community
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Partner with SkillSync to host campus hubs and earn competitive market rates.
              </p>
              <a href="#inquiry" className="bg-brand-orange text-white font-medium px-8 py-3 rounded-md inline-block hover:bg-orange-700 transition shadow-sm">
                List Your Space &rarr;
              </a>
            </div>
            <div>
              <img src="https://picsum.photos/600/500?random=20" alt="Modern coworking space" className="rounded-xl shadow-lg w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* What It Means */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="bg-green-50 border-l-4 border-brand-green p-8 rounded-r-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What It Means To Bring A SkillSync Campus Hub To Your Space</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Your venue becomes a dedicated learning environment — a place where hundreds of students come to exchange skills, build friendships, and grow. You earn revenue. Students earn knowledge.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works: Turning Space Into Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Step 1: Apply online</h3>
              <p className="text-gray-600">Submit your property details. We'll review and respond within 5 business days.</p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-2">Step 2: We handle setup</h3>
              <p className="text-gray-600">SkillSync furnishes, brands, and manages the hub. You provide the space.</p>
            </div>
            <div className="p-6">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Step 3: Earn every month</h3>
              <p className="text-gray-600">Receive consistent monthly payments at competitive market rates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rates */}
      <section className="py-16 max-w-4xl mx-auto px-4 text-center mt-8">
        <div className="bg-[#FEF3C7] rounded-2xl p-10 shadow-sm border border-yellow-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Lease Your Space To SkillSync For Competitive Market Rates</h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            We pay market rate or above, with 12-month minimum lease agreements and automatic renewal options.
          </p>
          <a href="#inquiry" className="bg-brand-orange text-white font-medium px-8 py-3 rounded-md inline-block hover:bg-orange-700 transition">
            Get A Rate Quote &rarr;
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">The Benefits Of Partnering With SkillSync</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              "Consistent monthly income", 
              "Zero management burden", 
              "Community impact", 
              "Long-term lease security", 
              "SkillSync handles insurance", 
              "Positive press & visibility"
            ].map((benefit, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 p-6 rounded-xl flex items-center shadow-sm">
                <span className="text-brand-green font-bold text-xl mr-4">✓</span>
                <span className="font-medium text-gray-800">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="inquiry" className="py-24 bg-gray-50 relative">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bring A SkillSync Campus Hub To Your Property</h2>
            
            {success ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Thank you!</h3>
                <p className="text-gray-600">We'll contact you within 5 business days to discuss your property.</p>
                <button onClick={() => setSuccess(false)} className="mt-6 text-brand-blue hover:underline font-medium">Submit another property</button>
              </div>
            ) : (
              <ProtectedAction>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                    <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approximate sq ft</label>
                    <input type="number" required value={sqft} onChange={e => setSqft(e.target.value)} placeholder="e.g. 2500" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
                  </div>
                  
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  
                  <button type="submit" disabled={loading} className="w-full bg-brand-blue text-white font-bold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 mt-2">
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
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
