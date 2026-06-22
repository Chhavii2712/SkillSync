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
  
  if (text.includes('global') || text.includes('india') || text.includes('uk') || text.includes('canada')) return '🌎'
  if (text.match(/10[,\s]?000/) || text.includes('10k')) return '👥'
  if (text.includes('hub') || text.includes('campus') || text.includes('physical') || text.includes('spaces')) return '📍'
  if (text.includes('recognition') || text.includes('forbes') || text.includes('techcrunch') || text.includes('award')) return '📰'
  if (text.match(/1[,\s]?000/) || text.includes('1k')) return '🤝'
  if (text.includes('found') || text.includes('start') || text.includes('pilot') || text.includes('experimental')) return '💡'
  return '✨'
}

function MilestoneCard({ m }: { m: Milestone }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -6, y: px * 6 })
  }
  const resetTilt = () => setTilt({ x: 0, y: 0 })

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={resetTilt} style={{ perspective: '1000px' }}>
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300 text-left"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 150ms ease-out, box-shadow 300ms ease',
          willChange: 'transform',
        }}
      >
        <span className="inline-block px-4 py-1.5 bg-brand-blue text-white rounded-full font-bold text-sm mb-4">
          {m.year}
        </span>
        <div className="w-full h-32 rounded-lg mb-4 flex items-center justify-center bg-gray-50 border border-gray-100 text-5xl select-none">
          {getContextualEmoji(m.title, m.description)}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{m.title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">{m.description}</p>
      </div>
    </div>
  )
}

export default function History() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())

  const containerRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    document.title = 'History — SkillSync'
    
    // 1. Instantly pull from local storage cache if available
    const cachedData = localStorage.getItem('skillsync_history_cache')
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMilestones(parsed)
          setLoading(false) // Shut off loading indicator instantly
        }
      } catch (err) {
        console.error('Cache read error:', err)
      }
    }

    // 2. Emergency Backup Timeout: Force stop loading state after 2 seconds no matter what
    const fallbackTimeout = setTimeout(() => {
      setLoading(false)
    }, 2000)

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
        
        // 3. Save to local storage for instant next-time loads
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
    const onScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const scrolledPast = viewportCenter - rect.top
      const pct = Math.min(100, Math.max(0, (scrolledPast / rect.height) * 100))
      setProgress(pct)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [milestones])

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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <section className="bg-white py-16 text-center border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            SkillSync Is Building The Future Of Peer-To-Peer Learning
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Connecting students across campus borders through distributed peer exchange.
          </p>

          {milestones.length > 0 && (
            <div className="flex justify-center gap-10 sm:gap-16">
              <div>
                <div className="text-3xl font-extrabold text-brand-blue">{milestones[0].year}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mt-1">Founded</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-3xl font-extrabold text-brand-blue">{milestones.length}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mt-1 font-medium">Milestones</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-3xl font-extrabold text-brand-blue">{yearSpan}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 mt-1 font-medium">Years Of Growth</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={containerRef} className="max-w-5xl mx-auto px-4 py-20 relative">
        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gray-200 top-0 bottom-0 hidden md:block" />
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-brand-blue to-brand-orange top-0 hidden md:block"
          style={{ height: `${progress}%`, transition: 'height 150ms ease-out' }}
        />

        {loading && milestones.length === 0 ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-center animate-pulse">
                <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-16 h-8 bg-gray-200 rounded-full mb-4" />
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4" />
                  <div className="w-3/4 h-6 bg-gray-200 mb-2" />
                  <div className="w-full h-4 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {milestones.map((m, index) => {
              const isLeft = index % 2 === 0
              const isActive = activeId === m.id
              const isRevealed = revealedIds.has(m.id)

              return (
                <div key={m.id} ref={setRowRef(m.id)} data-id={m.id} className="relative flex flex-col md:flex-row items-center gap-0 w-full">
                  {isLeft ? (
                    <div className={`w-full md:w-5/12 md:pr-8 transition-all duration-700 ease-out ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                      <MilestoneCard m={m} />
                    </div>
                  ) : (
                    <div className="hidden md:block md:w-5/12" />
                  )}

                  <div className="md:w-2/12 flex justify-center items-center py-4 md:py-0">
                    <div className="relative hidden md:flex items-center justify-center">
                      <span className={`block rounded-full border-4 border-white shadow-md transition-all duration-300 ${isActive ? 'w-5 h-5 bg-brand-orange' : 'w-4 h-4 bg-brand-blue'}`} />
                      {isActive && <span className="absolute inset-0 rounded-full bg-brand-orange/50 animate-ping" />}
                    </div>
                    <span className="md:hidden block w-3 h-3 rounded-full bg-brand-blue border-2 border-white shadow" />
                  </div>

                  {!isLeft ? (
                    <div className={`w-full md:w-5/12 md:pl-8 transition-all duration-700 ease-out ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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