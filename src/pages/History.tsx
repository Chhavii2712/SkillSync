import { useEffect, useRef, useState, useCallback } from 'react'
import { getMilestones } from '../firebase/firestore'

interface Milestone {
  id: string
  year: number
  title: string
  description: string
  image: string
}

function getContextualEmoji(title?: string, description?: string): string {
  const safeTitle = title || ''
  const safeDesc = description || ''
  const text = `${safeTitle} ${safeDesc}`.toLowerCase()
  
  if (text.includes('global') || text.includes('india') || text.includes('uk') || text.includes('canada')) {
    return '🌎'
  }
  if (text.match(/10[,\s]?000/) || text.includes('10k')) {
    return '👥'
  }
  if (text.match(/1[,\s]?000/) || text.includes('1k') || text.includes('1,000')) {
    return '🚀'
  }
  if (text.includes('found') || text.includes('start') || text.includes('pilot') || text.includes('experimental')) {
    return '💡'
  }
  if (text.includes('recognition') || text.includes('forbes') || text.includes('techcrunch') || text.includes('award')) {
    return '📰'
  }
  if (text.includes('hub') || text.includes('campus') || text.includes('physical') || text.includes('spaces')) {
    return '📍'
  }
  return '✨'
}

function getEmojiBgClass(emoji: string): string {
  switch (emoji) {
    case '🌎': return 'bg-blue-400'
    case '👥': return 'bg-orange-400'
    case '🚀': return 'bg-emerald-400'
    case '📍': return 'bg-rose-400'
    case '📰': return 'bg-stone-300'
    case '💡': return 'bg-yellow-300'
    default: return 'bg-purple-400'
  }
}

function MilestoneCard({ m }: { m: Milestone }) {
  const emoji = getContextualEmoji(m.title, m.description)
  const bgClass = getEmojiBgClass(emoji)

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all text-left relative overflow-hidden">
      
      {/* Neo-Brutalist Block Badge for Year */}
      <span className="inline-block px-4 py-1 bg-blue-600 text-white font-black text-sm uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
        {m.year}
      </span>

      {/* Flat Stark Asset Container */}
      <div className={`w-full h-32 border-4 border-black mb-4 flex items-center justify-center text-5xl select-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${bgClass}`}>
        {emoji}
      </div>

      <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2">{m.title}</h3>
      <p className="text-gray-800 font-medium text-sm leading-relaxed">{m.description}</p>
    </div>
  )
}

export default function History() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())

  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    document.title = 'History — SkillSync'
    
    const cachedData = localStorage.getItem('skillsync_history_cache')
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMilestones(parsed)
          setLoading(false)
        }
      } catch (err) {
        console.error('Cache read error:', err)
      }
    }

    const fallbackTimeout = setTimeout(() => {
      setLoading(false)
    } , 2000)

    const fetchMilestones = async () => {
      try {
        const data = await getMilestones() as Milestone[]
        
        const uniqueData = data.reduce((acc: Milestone[], current) => {
          const isDuplicate = acc.some(
            (m) => m.title?.trim().toLowerCase() === current.title?.trim().toLowerCase()
          )
          if (!isDuplicate) acc.push(current)
          return acc
        }, [])

        const sortedData = uniqueData.sort((a, b) => a.year - b.year)
        localStorage.setItem('skillsync_history_cache', JSON.stringify(sortedData))
        setMilestones(sortedData)
      } catch (e) {
        console.error('Firestore fetch failed:', e)
      } finally {
        clearTimeout(fallbackTimeout)
        setLoading(false)
      }
    }

    fetchMilestones()
    return () => clearTimeout(fallbackTimeout)
  }, [])

  useEffect(() => {
    if (milestones.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-id')
          if (!id) return
          if (entry.isIntersecting) setActiveId(id)
          if (entry.boundingClientRect.top < window.innerHeight - 80) {
            setRevealedIds((prev) => {
              if (prev.has(id)) return prev
              const next = new Set(prev)
              next.add(id)
              return next
            })
          }
        })
      },
      { rootMargin: '-10% 0px -10% 0px', threshold: [0, 0.1] }
    )

    rowRefs.current.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [milestones])

  const setRowRef = useCallback((id: string) => (node: HTMLDivElement | null) => {
    if (node) rowRefs.current.set(id, node)
    else rowRefs.current.delete(id)
  }, [])

  const yearSpan = milestones.length > 0 ? milestones[milestones.length - 1].year - milestones[0].year : 0

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-black font-sans selection:bg-yellow-300 pb-24 relative overflow-hidden">
      
      {/* Intersecting Accent Blocks Guidelines Frame on Left Margins */}
      <div className="absolute left-0 lg:left-16 top-0 bottom-0 w-[4px] bg-black hidden sm:block">
        <div className="absolute top-12 -left-4 w-12 h-12 bg-yellow-400 border-4 border-black" />
        <div className="absolute top-1/4 -left-4 w-12 h-12 bg-orange-500 border-4 border-black" />
        <div className="absolute top-2/3 -left-4 w-12 h-12 bg-blue-600 border-4 border-black" />
      </div>

      {/* Big Blue Right Sidebar Block matching image_9ae1cc.png */}
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-blue-600 border-l-4 border-black hidden md:flex flex-col justify-end p-4 select-none">
        <p className="text-white font-black text-2xl leading-none">2026</p>
        <p className="text-[8px] font-black text-blue-200 uppercase tracking-widest mt-1">HISTORY</p>
      </div>

      {/* Hero Header */}
      <section className="bg-white py-16 text-center border-b-4 border-black relative">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black mb-6 leading-none">
            SkillSync Is Building The Future Of Peer-To-Peer Learning
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-700 mb-10 max-w-2xl mx-auto">
            Connecting students across campus borders through distributed peer exchange.
          </p>

          {milestones.length > 0 && (
            <div className="inline-grid grid-cols-1 sm:grid-cols-3 border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] divide-y-4 sm:divide-y-0 sm:divide-x-4 divide-black">
              <div className="p-6 bg-yellow-300 min-w-[160px]">
                <div className="text-3xl font-black text-black">{milestones[0].year}</div>
                <div className="text-[10px] uppercase tracking-wider text-black font-black mt-1">Founded</div>
              </div>
              <div className="p-6 bg-white min-w-[160px]">
                <div className="text-3xl font-black text-black">{milestones.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-600 font-black mt-1">Milestones</div>
              </div>
              <div className="p-6 bg-orange-500 min-w-[160px]">
                <div className="text-3xl font-black text-white">{yearSpan}</div>
                <div className="text-[10px] uppercase tracking-wider text-orange-100 font-black mt-1">Years Of Growth</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stark Axis Timeline Array Container */}
      <section ref={containerRef} className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* Solid 4px Thick Neo-Brutalist Axis Line */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[4px] bg-black top-0 bottom-0 hidden md:block" />

        {loading && milestones.length === 0 ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-center">
                <div className="bg-white w-full max-w-md p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                  <div className="w-16 h-6 bg-gray-300 border-2 border-black mb-4" />
                  <div className="w-full h-32 bg-gray-200 border-2 border-black mb-4" />
                  <div className="w-3/4 h-6 bg-gray-300 mb-2" />
                  <div className="w-full h-4 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16 relative">
            {milestones.map((m, index) => {
              const isLeft = index % 2 === 0
              const isActive = activeId === m.id
              const isRevealed = revealedIds.has(m.id)

              return (
                <div 
                  key={m.id} 
                  ref={setRowRef(m.id)} 
                  data-id={m.id} 
                  className={`relative flex flex-col md:flex-row items-center gap-0 w-full transition-all duration-500 ${
                    isRevealed ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4'
                  }`}
                >
                  {isLeft ? (
                    <div className="w-full md:w-5/12 md:pr-8">
                      <MilestoneCard m={m} />
                    </div>
                  ) : (
                    <div className="hidden md:block md:w-5/12" />
                  )}

                  {/* Dynamic Middle Axis Intersection Hub Indicators */}
                  <div className="md:w-2/12 flex justify-center items-center py-6 md:py-0">
                    <div className="relative hidden md:flex items-center justify-center">
                      <span className={`block w-6 h-6 border-4 border-black transition-all duration-200 ${
                        isActive ? 'bg-orange-500 rotate-45 scale-110' : 'bg-yellow-300'
                      }`} />
                    </div>
                    <span className="md:hidden block w-4 h-4 bg-black border-2 border-white" />
                  </div>

                  {!isLeft ? (
                    <div className="w-full md:w-5/12 md:pl-8">
                      <MilestoneCard m={m} />
                    </div>
                  ) : (
                    <div className="hidden md:block md:w-5/12" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}