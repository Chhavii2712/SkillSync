import { useState, useEffect } from 'react'
import { getMilestones } from '../firebase/firestore'

interface Milestone {
  id: string
  year: number
  title: string
  description: string
  image: string
}

export default function History() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "History — SkillSync"
    const fetchMilestones = async () => {
      try {
        const data = await getMilestones()
        setMilestones(data as Milestone[])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchMilestones()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <section className="bg-white py-16 text-center border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">SkillSync Is Building The Future Of Peer-To-Peer Learning</h1>
          <p className="text-xl text-gray-600">From a single campus experiment to a national network.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-20 relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200 top-0 bottom-0 hidden md:block"></div>
        
        {loading ? (
          <div className="space-y-12">
             {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-center animate-pulse">
                  <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-8 bg-gray-200 rounded-full mb-4"></div>
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="w-3/4 h-6 bg-gray-200 mb-2"></div>
                    <div className="w-full h-4 bg-gray-200"></div>
                  </div>
                </div>
             ))}
          </div>
        ) : (
          <div className="space-y-16">
            {milestones.map((m, index) => {
              const isEven = index % 2 === 0
              return (
                <div key={m.id} className={`flex flex-col md:flex-row items-center justify-between w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  <div className="md:w-5/12 mb-8 md:mb-0"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-brand-blue border-4 border-white shadow hidden md:block z-10 mt-6 md:mt-0"></div>
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition text-left">
                      <span className="inline-block px-4 py-1.5 bg-brand-blue text-white rounded-full font-bold text-sm mb-4">{m.year}</span>
                      <img src={m.image} alt={m.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{m.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
