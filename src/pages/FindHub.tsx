import { useState, useEffect } from 'react'
import { getHubs } from '../firebase/firestore'
import ProtectedAction from '../components/ProtectedAction'

const HUB_GRADIENTS = [
  '#FDE68A', // yellow
  '#BFDBFE', // blue
  '#FED7AA', // orange
  '#D1FAE5', // green
  '#E9D5FF', // purple
  '#FCE7F3', // pink
]

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

// Accent colors cycling for state tags
const TAG_COLORS = ['bg-yellow-400', 'bg-blue-500', 'bg-orange-500', 'bg-black']

export default function FindHub() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeState, setActiveState] = useState('')

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

  const filteredHubs = hubs.filter(h => {
    const q = search.toLowerCase()
    return (
      h.city.toLowerCase().includes(q) ||
      h.campus.toLowerCase().includes(q) ||
      h.state.toLowerCase().includes(q)
    )
  })

  const handleStateClick = (state: string) => {
    setActiveState(state === activeState ? '' : state)
    setSearch(state === activeState ? '' : state)
  }

  const handleStartChapter = () => {
    alert("Chapter request submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="border-b-[2px] border-black">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row">

          {/* Left: heading */}
          <div className="flex-1 p-10 lg:p-20 border-b-[2px] md:border-b-0 md:border-r-[2px] border-black flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Network Directory</p>
            <h1 className="text-4xl md:text-6xl font-serif text-black leading-[1.1] mb-8">
              Find Your<br />SkillSync Hub.
            </h1>
            <p className="text-gray-600 max-w-sm mb-10">
              Every hub is a living community of students swapping skills, running workshops, and building together.
            </p>

            {/* Search */}
            <div className="flex border-[2px] border-black rounded-full overflow-hidden max-w-md">
              <input
                type="text"
                placeholder="City, campus, or state…"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveState('') }}
                className="flex-1 px-6 py-3 text-sm font-medium outline-none bg-white"
              />
              <button className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wide">
                Search
              </button>
            </div>
          </div>

          {/* Right: stat grid */}
          <div className="w-full md:w-[340px] lg:w-[420px] shrink-0 grid grid-cols-2">
            <div className="border-b-[2px] border-r-[2px] border-black p-8 flex flex-col justify-end">
              <p className="text-5xl font-extrabold text-black">{hubs.length || '6'}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">Active Hubs</p>
            </div>
            <div className="border-b-[2px] border-black p-8 bg-yellow-400 flex flex-col justify-end">
              <p className="text-5xl font-extrabold text-black">
                {hubs.reduce((a, h) => a + (h.members || 0), 0) || '1.2k'}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-black mt-2">Members</p>
            </div>
            <div className="border-r-[2px] border-black p-8 bg-orange-500 flex flex-col justify-end">
              <p className="text-5xl font-extrabold text-white">
                {hubs.reduce((a, h) => a + (h.exchanges || 0), 0) || '800+'}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-white mt-2">Exchanges</p>
            </div>
            <div className="p-8 bg-blue-500 flex flex-col justify-end">
              <p className="text-5xl font-extrabold text-white">50</p>
              <p className="text-xs font-bold uppercase tracking-widest text-white mt-2">States</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATE FILTER ── */}
      <section className="border-b-[2px] border-black bg-white">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 shrink-0">Filter by state</span>
            <div className="flex flex-wrap gap-2">
              {STATES.slice(0, 20).map((state) => {
                const count = hubs.filter(h => h.state === state).length
                const isActive = activeState === state
                return (
                  <button
                    key={state}
                    onClick={() => handleStateClick(state)}
                    className={`text-xs font-bold uppercase tracking-wide px-4 py-2 border-[2px] border-black rounded-full transition
                      ${isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                  >
                    {state} <span className={isActive ? 'text-gray-300' : 'text-gray-400'}>({count})</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── HUB CARDS ── */}
      <section className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="flex items-end justify-between mb-10 border-b-[2px] border-black pb-6">
          <h2 className="text-3xl md:text-4xl font-serif text-black">
            {search ? `Results for "${search}"` : 'All Active Hubs'}
          </h2>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {filteredHubs.length} hub{filteredHubs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t-[2px] border-l-[2px] border-black">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="border-r-[2px] border-b-[2px] border-black animate-pulse">
                <div className="h-56 bg-gray-100" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredHubs.length === 0 ? (
          <div className="border-[2px] border-black p-20 text-center">
            <p className="text-2xl font-serif text-black mb-2">No hubs found.</p>
            <p className="text-gray-500 text-sm">Try a different city, campus, or state.</p>
            <button onClick={() => { setSearch(''); setActiveState('') }}
              className="mt-6 border-[2px] border-black px-6 py-2 text-sm font-bold uppercase tracking-wide hover:bg-black hover:text-white transition">
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-[2px] border-l-[2px] border-black">
            {filteredHubs.map((hub, idx) => (
              <div key={hub.id} className="border-r-[2px] border-b-[2px] border-black group flex flex-col">
                {/* Visual Header Block */}
                <div className="relative h-52 overflow-hidden border-b-[2px] border-black flex items-center justify-center"
                  style={{ background: HUB_GRADIENTS[idx % HUB_GRADIENTS.length] }}>
                  
                  {/* Big faded campus initial */}
                  <span className="absolute text-[10rem] font-extrabold leading-none select-none pointer-events-none"
                    style={{ opacity: 0.08, color: '#000', top: '-10px', right: '16px' }}>
                    {hub.campus?.charAt(0) || hub.name?.charAt(0)}
                  </span>

                  {/* Center content */}
                  <div className="relative z-10 text-center px-6">
                    <p className="text-4xl font-extrabold text-black tracking-tight">{hub.city}</p>
                    <p className="text-sm font-bold uppercase tracking-widest text-black opacity-50 mt-1">{hub.state}</p>
                  </div>

                  {/* State tag */}
                  <span className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-widest px-3 py-1 border-[2px] border-black
                    ${TAG_COLORS[idx % TAG_COLORS.length]} ${idx % TAG_COLORS.length === 3 ? 'text-white' : 'text-black'}`}>
                    {hub.state}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-extrabold text-black mb-1">{hub.name}</h3>
                  <p className="text-sm text-gray-500 mb-6">{hub.campus}</p>

                  {/* Stats */}
                  <div className="flex gap-6 mb-6 mt-auto">
                    <div className="border-l-4 border-black pl-3">
                      <p className="text-xl font-extrabold text-black">{hub.members || '—'}</p>
                      <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Members</p>
                    </div>
                    <div className="border-l-4 border-yellow-400 pl-3">
                      <p className="text-xl font-extrabold text-black">{hub.exchanges || '—'}</p>
                      <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Exchanges</p>
                    </div>
                  </div>

                  <button className="w-full border-[2px] border-black text-black font-bold py-3 text-sm uppercase tracking-wide
                    hover:bg-black hover:text-white transition group-hover:bg-black group-hover:text-white">
                    View Hub →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── START A CHAPTER ── */}
      <section className="border-t-[2px] border-black">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row">

          {/* Left accent grid */}
          <div className="hidden lg:grid grid-cols-2 w-[160px] shrink-0 border-r-[2px] border-black">
            <div className="border-r border-b border-black aspect-square bg-yellow-400" />
            <div className="border-b border-black aspect-square" />
            <div className="border-r border-black aspect-square" />
            <div className="aspect-square bg-orange-500" />
          </div>

          {/* Content */}
          <div className="flex-1 p-12 lg:p-20 border-r-[2px] border-black flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Don't see your campus?</p>
            <h2 className="text-3xl md:text-5xl font-serif text-black mb-6 leading-tight">
              Start a New<br />SkillSync Chapter.
            </h2>
            <p className="text-gray-600 max-w-md mb-10">
              We'll provide the tools, the network, and the support. You bring the community.
            </p>
            <ProtectedAction onAction={handleStartChapter}>
              <button className="bg-black text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition w-fit">
                Apply to Start a Chapter →
              </button>
            </ProtectedAction>
          </div>

          {/* Right: blue block */}
          <div className="w-full md:w-[280px] shrink-0 bg-blue-500 flex flex-col justify-end p-10">
            <p className="text-5xl font-extrabold text-white mb-2">44</p>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-100">States still open</p>
          </div>
        </div>
      </section>

    </div>
  )
}