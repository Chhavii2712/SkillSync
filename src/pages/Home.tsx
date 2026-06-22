import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => { document.title = "SkillSync — Peer Learning, Reimagined" }, [])
  const photoStrip = Array.from({ length: 18 }, (_, i) => `https://picsum.photos/120/80?random=${40 + i}`)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-bl-full z-0"></div>
        <div className="absolute top-32 right-32 w-32 h-32 bg-brand-yellow/10 rounded-full z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-blue-50 text-brand-blue font-semibold px-4 py-1.5 rounded-full text-sm mb-6 border border-blue-100 shadow-sm">
                🎓 Student Skill Exchange Platform
              </span>
              <h1 className="text-5xl md:text-[56px] font-extrabold leading-[1.1] text-gray-900 mb-6 tracking-tight">
                Learn What<br/>Others Don't<br/>Teach.
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                SkillSync connects students across campuses to exchange skills peer-to-peer. You teach what you know. You learn what you don't. Free, forever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/find-hub" className="bg-brand-blue text-white font-medium px-6 py-3 rounded-md text-center hover:bg-blue-700 transition shadow-sm">
                  Start Exchanging &rarr;
                </Link>
                <Link to="/find-hub" className="border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-md text-center hover:bg-gray-50 transition">
                  Find a Hub Near You
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src="https://picsum.photos/600/500?random=1" alt="Students collaborating" className="rounded-xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-gray-50 border-y border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="py-4 md:py-0">
              <div className="text-4xl font-extrabold text-brand-blue mb-2">12,400+</div>
              <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">Students</div>
            </div>
            <div className="py-4 md:py-0">
              <div className="text-4xl font-extrabold text-brand-blue mb-2">3,200</div>
              <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">Active Exchanges</div>
            </div>
            <div className="py-4 md:py-0">
              <div className="text-4xl font-extrabold text-brand-blue mb-2">48</div>
              <div className="text-gray-500 font-medium uppercase tracking-wider text-sm">Campus Hubs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Every Student Deserves Room To Grow Together.</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">SkillSync is the platform where students level up by teaching and learning from each other.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Peer Mentoring</h3>
              <p className="text-gray-600">Get matched with students who've already mastered what you're trying to learn.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="text-4xl mb-4">🏛</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Collaborative Spaces</h3>
              <p className="text-gray-600">Meet at your local SkillSync hub — real spaces designed for focused skill exchange.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Free Exchange</h3>
              <p className="text-gray-600">No money changes hands. You trade time and knowledge, nothing else.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 italic mb-8 border-l-4 border-brand-blue pl-6 text-left relative">
            "SkillSync has completely changed how I learn. I traded my Python skills for guitar lessons and now I'm doing both professionally."
          </blockquote>
          <div className="text-left pl-6 font-semibold text-gray-700 mb-12">— Priya K., IIT Delhi</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Students Are Leveling Up Together On SkillSync</h2>
          <p className="text-gray-600">Join 12,400+ students already exchanging skills</p>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">The Core Pillars Of Skill-Sharing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
              <img src="https://picsum.photos/400/250?random=31" alt="Problem Solving" className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Problem Solving Together</h3>
                <p className="text-gray-600">Learn faster when you teach. SkillSync's exchange model forces both sides to think deeply.</p>
              </div>
            </div>
            <div className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
              <img src="https://picsum.photos/400/250?random=32" alt="Reciprocal Collaboration" className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reciprocal Collaboration</h3>
                <p className="text-gray-600">Every exchange is a two-way street. Both students walk away with something new.</p>
              </div>
            </div>
            <div className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
              <img src="https://picsum.photos/400/250?random=33" alt="Technology Help" className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Technology Help</h3>
                <p className="text-gray-600">From coding to design, tech skills are the most exchanged on SkillSync.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Strip */}
      <div className="flex overflow-x-hidden relative w-full h-[80px]">
        <div className="flex animate-marquee whitespace-nowrap">
          {photoStrip.map((src, i) => (
            <img key={i} src={src} alt="Student" className="w-[120px] h-[80px] object-cover grayscale hover:grayscale-0 transition inline-block" />
          ))}
          {photoStrip.map((src, i) => (
            <img key={`dup-${i}`} src={src} alt="Student" className="w-[120px] h-[80px] object-cover grayscale hover:grayscale-0 transition inline-block" />
          ))}
        </div>
      </div>

      {/* Mission Split */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">100% Student-Driven Collaborative Growth. This Is What Learning Should Feel Like.</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                SkillSync was built by students, for students. We believe the best teachers aren't always in classrooms — sometimes they're sitting right next to you.
              </p>
            </div>
            <div>
              <img src="https://picsum.photos/600/400?random=35" alt="Mission" className="rounded-xl shadow-lg w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Learn By Teaching Split */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src="https://picsum.photos/600/400?random=36" alt="Learn By Teaching" className="rounded-xl shadow-lg w-full" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">Learn By Teaching. Share To Grow.</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                When you teach a skill, you master it. SkillSync's exchange model makes sure every interaction is a learning moment for both parties.
              </p>
              <Link to="/find-hub" className="bg-brand-blue text-white font-medium px-6 py-3 rounded-md inline-block hover:bg-blue-700 transition">
                Browse Skills &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-brand-orange to-brand-blue py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ready To Sync? Start Your Skill Exchange Journey — Apply Here.</h2>
          <Link to="/find-hub" className="bg-white text-brand-blue font-bold px-8 py-3 rounded-md inline-block hover:bg-gray-100 transition shadow-lg">
            Apply Now
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  )
}
