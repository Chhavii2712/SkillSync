import { useState, useEffect } from 'react'
import { getHubs } from '../firebase/firestore'
import ProtectedAction from '../components/ProtectedAction'

interface Hub {
  id: string
  name: string
  campus: string
  city: string
  state: string
  members: number
  exchanges: number
  image: string
}

const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", 
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
]

export default function FindHub() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.title = "Find a Hub — SkillSync"
    const fetchHubs = async () => {
      try {
        const data = await getHubs()
        setHubs(data as Hub[])
      } catch (e) {
        console.error("Firebase error, using fallback or empty data", e)
      } finally {
        setLoading(false)
      }
    }
    fetchHubs()
  }, [])

  const filteredHubs = hubs.filter(h => 
    h.city.toLowerCase().includes(search.toLowerCase()) || 
    h.campus.toLowerCase().includes(search.toLowerCase()) ||
    h.state.toLowerCase().includes(search.toLowerCase())
  )

  const handleStartChapter = () => {
    alert("Chapter request submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <section className="bg-white py-16 text-center border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">Find A SkillSync Hub Or Chapter Near You</h1>
          <div className="relative max-w-xl mx-auto shadow-sm rounded-xl">
            <input 
              type="text" 
              placeholder="Search by city or campus..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent text-lg outline-none"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-brand-blue text-white px-6 rounded-lg font-medium hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* State Directory */}
      <section className="py-12 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse By State</h2>
          <div className="flex flex-wrap gap-3">
            {STATES.slice(0, 20).map(state => {
              const count = hubs.filter(h => h.state === state).length
              return (
                <button key={state} onClick={() => setSearch(state)} className="bg-white border border-gray-200 text-sm text-gray-700 px-4 py-2 rounded-full hover:border-brand-blue hover:text-brand-blue transition">
                  {state} <span className="text-gray-400 ml-1">({count})</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hub Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Four Regional Networks, With More Coming Soon</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHubs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No hubs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHubs.map(hub => (
                <div key={hub.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={hub.image} alt={hub.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-4 left-4 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      {hub.state}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{hub.name}</h3>
                    <p className="text-gray-600 mb-4">{hub.campus}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-6 mt-auto">
                      <span className="flex items-center"><span className="mr-1">👥</span> {hub.members} members</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center"><span className="mr-1">🔄</span> {hub.exchanges} exchanges</span>
                    </div>
                    <button className="w-full bg-blue-50 text-brand-blue font-semibold py-2 rounded-md hover:bg-brand-blue hover:text-white transition">
                      View Hub &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Start Chapter CTA */}
      <section className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-brand-blue rounded-2xl p-10 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">Don't See Your Campus? Start A New SkillSync Chapter.</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto relative z-10">Bring peer learning to your community. We'll provide the tools, support, and network to get you started.</p>
          <ProtectedAction onAction={handleStartChapter}>
            <button className="bg-white text-brand-blue font-bold px-8 py-3 rounded-md inline-block hover:bg-gray-100 transition shadow-lg relative z-10">
              Start A Chapter
            </button>
          </ProtectedAction>
        </div>
      </section>
    </div>
  )
}
