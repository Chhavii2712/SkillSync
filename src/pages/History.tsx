import { useEffect, useRef, useState, useCallback } from 'react'
import { getMilestones } from '../firebase/firestore'

interface Milestone {
  id: string
  year: number
  title: string
  description: string
  image: string
}

// Curated high-quality images capturing digital, distributed peer-to-peer learning
const RELEVANT_IMAGES = {
  // 1. Founded: A student solo at their desk on a laptop, starting the initial spark
  founded: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=800&auto=format&fit=crop&q=80',
  
  // 2. First 1,000 Students: A student working remotely from a cafe, connected digitally to others
  thousandStudents: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  
  // 3. National Recognition: A clean representation of tech news, metrics, and digital traction
  recognition: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  
  // 4. 25 Hubs Launched: Different students in completely separate locations connected via their screens
  hubs: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
  
  // 5. 10,000 Students: A rich grid of diverse student faces collaborating together over a remote video network
  tenThousandStudents: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=80',
  
  // 6. Going Global: Deep global network connections spanning cities across the world
  global: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  
  // Resilient fallback asset
  generic: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80'
}

// Hardened text scanner using regex to catch numbers regardless of commas or formatting
function getContextualFallback(title?: string, description?: string): string {
  const safeTitle = title || ''
  const safeDesc = description || ''
  const text = `${safeTitle} ${safeDesc}`.toLowerCase()
  
  if (text.includes('global') || text.includes('india') || text.includes('uk') || text.includes('canada')) {
    return RELEVANT_IMAGES.global
  }
  // Matches "10,000", "10000", "10k active", etc.
  if (text.match(/10[,\s]?000/) || text.includes('10k')) {
    return RELEVANT_IMAGES.tenThousandStudents
  }
  if (text.includes('hub') || text.includes('campus') || text.includes('physical') || text.includes('spaces')) {
    return RELEVANT_IMAGES.hubs
  }
  if (text.includes('recognition') || text.includes('forbes') || text.includes('techcrunch') || text.includes('award')) {
    return RELEVANT_IMAGES.recognition
  }
  // Matches "1,000", "1000", "1k", etc.
  if (text.match(/1[,\s]?000/) || text.includes('1k')) {
    return RELEVANT_IMAGES.thousandStudents
  }
  if (text.includes('found') || text.includes('start') || text.includes('pilot') || text.includes('experimental')) {
    return RELEVANT_IMAGES.founded
  }
  return RELEVANT_IMAGES.generic
}

function MilestoneCard({ m }: { m: Milestone }) {
  const [imgError, setImgError] = useState(false)
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

  const fallbackSrc = getContextualFallback(m.title, m.description)
  const imageSrc = m.image && m.image.trim() !== '' && !imgError ? m.image : fallbackSrc

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={{ perspective: '1000px' }}
    >
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

        <div className="w-full h-48 rounded-lg mb-4 overflow-hidden bg-gray-50 border border-gray-100">
          <img
            src={imageSrc}
            alt={m.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
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
    const fetchMilestones = async () => {
      try {
        const data = await getMilestones() as Milestone[]
        
        // Deduplicate cards sharing the exact same text contents
        const uniqueData = data.reduce((acc: Milestone[], current) => {
          const isDuplicate = acc.some(
            (m) => m.title?.trim().toLowerCase() === current.title?.trim().toLowerCase()
          )
          if (!isDuplicate) {
            acc.push(current)
          }
          return acc
        }, [])

        const sortedData = uniqueData.sort((a, b) => a.year - b.year)

        // ── IMAGE PRELOAD ENGINE ──────────────────────────────────────────
        // Downloads and caches images in browser memory before showing timeline
        await Promise.all(
          sortedData.map((m) => {
            return new Promise((resolve) => {
              const img = new Image()
              img.src = m.image && m.image.trim() !== '' ? m.image : getContextualFallback(m.title, m.description)
              img.onload = resolve
              img.onerror = resolve // resolve anyway to keep timeline responsive
            })
          })
        )
        
        setMilestones(sortedData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchMilestones()
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

          if (entry.isIntersecting) {
            setActiveId(id)
          }

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

  const setRowRef = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      if (node) rowRefs.current.set(id, node)
      else rowRefs.current.delete(id)
    },
    []
  )

  const yearSpan =
    milestones.length > 0 ? milestones[milestones.length - 1].year - milestones[0].year : 0

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

          {!loading && milestones.length > 0 && (
            <div className="flex justify-center gap-10 sm:gap-16">
              <div>
                <div className="text-3xl font-extrabold text-brand-blue">{milestones[0].year}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mt-1">Founded</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-3xl font-extrabold text-brand-blue">{milestones.length}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mt-1">Milestones</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-3xl font-extrabold text-brand-blue">{yearSpan}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mt-1">Years Of Growth</div>
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
          style={{
            height: `${progress}%`,
            transition: 'height 150ms ease-out',
          }}
        />

        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-center animate-pulse">
                <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="w-16 h-8 bg-gray-200 rounded-full mb-4" />
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
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
                <div
                  key={m.id}
                  ref={setRowRef(m.id)}
                  data-id={m.id}
                  className="relative flex flex-col md:flex-row items-center gap-0 w-full"
                >
                  {isLeft ? (
                    <div
                      className={`w-full md:w-5/12 md:pr-8 transition-all duration-700 ease-out ${
                        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <MilestoneCard m={m} />
                    </div>
                  ) : (
                    <div className="hidden md:block md:w-5/12" />
                  )}

                  <div className="md:w-2/12 flex justify-center items-center py-4 md:py-0">
                    <div className="relative hidden md:flex items-center justify-center">
                      <span
                        className={`block rounded-full border-4 border-white shadow-md transition-all duration-300 ${
                          isActive ? 'w-5 h-5 bg-brand-orange' : 'w-4 h-4 bg-brand-blue'
                        }`}
                      />
                      {isActive && (
                        <span className="absolute inset-0 rounded-full bg-brand-orange/50 animate-ping" />
                      )}
                    </div>
                    <span className="md:hidden block w-3 h-3 rounded-full bg-brand-blue border-2 border-white shadow" />
                  </div>

                  {!isLeft ? (
                    <div
                      className={`w-full md:w-5/12 md:pl-8 transition-all duration-700 ease-out ${
                        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    >
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