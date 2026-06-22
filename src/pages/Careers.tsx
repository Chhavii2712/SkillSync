import { useState, useEffect } from 'react'
import { getJobs, submitJobApplication } from '../firebase/firestore'
import { useAuth } from '../context/AuthContext'
import ProtectedAction from '../components/ProtectedAction'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
}

export default function Careers() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  
  // Apply Modal state
  const [isApplyOpen, setIsApplyOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [resume, setResume] = useState('')
  const [applyLoading, setApplyLoading] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)

  useEffect(() => {
    document.title = "Careers — SkillSync"
    const fetchJobs = async () => {
      try {
        const data = await getJobs()
        setJobs(data as Job[])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  useEffect(() => {
    if (user) {
      setName(user.displayName || '')
      setEmail(user.email || '')
    }
  }, [user])

  const tabs = ['All', 'Engineering', 'Operations', 'Marketing', 'Design']
  const filteredJobs = activeTab === 'All' ? jobs : jobs.filter(j => j.department === activeTab)

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job)
    setIsApplyOpen(true)
    setApplySuccess(false)
  }

  const handleSubmitApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setApplyLoading(true)
    try {
      await submitJobApplication({
        jobId: selectedJob?.id,
        jobTitle: selectedJob?.title,
        name,
        email,
        resumeLink: resume
      })
      setApplySuccess(true)
      setTimeout(() => {
        setIsApplyOpen(false)
      }, 2000)
    } catch (err) {
      console.error(err)
      alert("Failed to submit application.")
    } finally {
      setApplyLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img src="https://picsum.photos/1200/500?random=8" alt="Team" className="w-full h-full object-cover opacity-50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Our Work Is Not For The Faint Of Heart.</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">We're building the future of peer learning. It's hard, meaningful work.</p>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Join SkillSync</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Mission-Driven Work</h3>
              <p className="text-gray-600">Impact how students learn globally.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Competitive Pay</h3>
              <p className="text-gray-600">Top of market salary and equity.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-2">Remote-Friendly</h3>
              <p className="text-gray-600">Work from anywhere in the US.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Truly Rewarding Work */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Truly Rewarding Work.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {['Work directly with students', 'Build tools that change how people learn', 'Unlimited PTO', 'Health + dental + vision', '$2,000 annual learning stipend'].map((perk, i) => (
              <div key={i} className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 flex items-center">
                <span className="text-brand-green font-bold mr-3">✓</span> {perk}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Come Build With Us</h2>
          <img src="https://picsum.photos/1200/400?random=9" alt="SkillSync Team" className="w-full h-[400px] object-cover rounded-2xl shadow-lg mb-8" />
          <a href="#jobs" className="bg-brand-blue text-white font-medium px-8 py-3 rounded-md inline-block hover:bg-blue-700 transition">
            See Open Roles
          </a>
        </div>
      </section>

      {/* Jobs Table */}
      <section id="jobs" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 animate-pulse">Loading jobs...</td></tr>
                  ) : filteredJobs.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No open positions in this department.</td></tr>
                  ) : (
                    filteredJobs.map((job, idx) => (
                      <tr key={job.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{job.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{job.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{job.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {job.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <ProtectedAction onAction={() => handleApplyClick(job)}>
                            <button className="text-brand-blue hover:text-blue-800 font-medium">Apply &rarr;</button>
                          </ProtectedAction>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Press & Investors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-20">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">SkillSync Is Gaining National Attention</h2>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale font-bold text-2xl text-gray-800">
              <span>Forbes</span>
              <span>TechCrunch</span>
              <span>FastCompany</span>
              <span>EdSurge</span>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">We're Backed By The Best</h2>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale font-bold text-2xl text-gray-800">
              <span>Y Combinator</span>
              <span>a16z</span>
              <span>Sequoia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Campus CTA */}
      <section className="max-w-3xl mx-auto px-4 mb-20">
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested In Starting A SkillSync Campus Team?</h2>
          <p className="text-gray-600 mb-8">Apply to run your campus chapter and get trained, supported, and connected.</p>
          <ProtectedAction>
            <button className="bg-brand-blue text-white font-medium px-8 py-3 rounded-md inline-block hover:bg-blue-700 transition">
              Apply To Start A Chapter
            </button>
          </ProtectedAction>
        </div>
      </section>

      {/* Application Modal */}
      {isApplyOpen && selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsApplyOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Apply for {selectedJob.title}</h2>
            <p className="text-gray-500 text-sm mb-6">{selectedJob.location} • {selectedJob.type}</p>
            
            {applySuccess ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-600">Application Submitted!</h3>
              </div>
            ) : (
              <form onSubmit={handleSubmitApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link (URL)</label>
                  <input type="url" required value={resume} onChange={e => setResume(e.target.value)} placeholder="https://linkedin.com/in/... or Google Drive" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue" />
                </div>
                <button type="submit" disabled={applyLoading} className="w-full bg-brand-blue text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 mt-4">
                  {applyLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
