import { useEffect } from 'react'

export default function About() {
  useEffect(() => { document.title = "About — SkillSync" }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Peer Learning Tailored To Your Goals
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                SkillSync is built on one simple idea: every student has something worth teaching. We believe the best teachers aren't always in classrooms — sometimes they're sitting right next to you.
              </p>
            </div>
            <div>
              <img src="https://picsum.photos/600/500?random=5" alt="Students" className="rounded-xl shadow-lg w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">A Model Built To Accelerate Peer Learning And Skill Mastery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="relative">
              <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learn Your Skill</h3>
              <p className="text-gray-600">Tell us what you want to learn and what you can teach.</p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reciprocal Exchange</h3>
              <p className="text-gray-600">Get matched with someone who has what you need — and needs what you have.</p>
            </div>
            <div className="relative">
              <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Peer Mentorship</h3>
              <p className="text-gray-600">Meet at your local hub, exchange skills, and grow together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://picsum.photos/500/400?random=6" alt="Reciprocal Skill-Sharing" className="rounded-xl shadow-lg w-full" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">A Strong Foundation In Reciprocal Skill-Sharing</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Reciprocal learning isn't new — it's how humans have always taught each other. SkillSync just makes it scalable, trackable, and available to every student on campus.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                By formalizing the exchange, we remove the friction of finding the right partner, ensuring both sides are committed to mutual growth and success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="relative h-80 flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img src="https://picsum.photos/1200/400?random=7" alt="Networks" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight">
            Reciprocal Learning Networks, Reimagined For Today.
          </h2>
        </div>
      </section>
    </div>
  )
}
