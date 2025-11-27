interface AboutMeProps {
  aboutData: {
    isPublished: boolean
    profilePhoto?: string
    bio: string
    favoriteGenres: string[]
    favoriteAuthors: string[]
    whyIRead: string
    funFacts: string[]
    currentlyReading?: string
    readingGoals: string[]
    achievements: string[]
  }
}

const AboutMe = ({ aboutData }: AboutMeProps) => {
  if (!aboutData.isPublished) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border-4 border-purple-200">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <span className="text-6xl">💜</span>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 font-fun">About Me - Coming Soon!</h3>
          <p className="text-gray-600 text-lg">Check back soon to learn more about Izzy! ✨💜📖</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center flex items-center justify-center gap-4 font-fun">
        <span className="text-5xl animate-wiggle">💜</span>
        <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
          About Me
        </span>
        <span className="text-5xl animate-wiggle" style={{ animationDelay: '0.3s' }}>✨</span>
      </h2>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-[2rem] blur-lg opacity-50"></div>
        <div className="relative bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden">
          <div className="absolute top-4 right-4 text-4xl animate-star-spin opacity-30">✨</div>
          <div className="absolute bottom-4 left-4 text-4xl animate-bounce opacity-30">💫</div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-white rounded-full blur-md opacity-30 animate-pulse"></div>
              {aboutData.profilePhoto ? (
                <img
                  src={aboutData.profilePhoto}
                  alt="Izzy"
                  className="relative w-36 h-36 rounded-full border-4 border-white shadow-2xl object-cover"
                />
              ) : (
                <div className="relative w-36 h-36 rounded-full bg-white/30 backdrop-blur-md border-4 border-white shadow-2xl flex items-center justify-center">
                  <span className="text-7xl animate-bounce">📚</span>
                </div>
              )}
              <div className="absolute -top-2 -right-2 text-3xl animate-wiggle">✨</div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-4 flex items-center justify-center md:justify-start gap-3 font-fun">
                <span className="animate-wiggle">🌟</span>
                Hi, I'm Izzy!
                <span className="animate-wiggle" style={{ animationDelay: '0.3s' }}>🌟</span>
              </h3>
              <p className="text-lg text-white/95 leading-relaxed font-medium">
                {aboutData.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {aboutData.currentlyReading && (
          <div className="group relative" style={{ animation: 'slide-up 0.5s ease-out 0.1s both' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl opacity-0 group-hover:opacity-70 blur transition-opacity"></div>
            <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 border-4 border-blue-100 hover:border-blue-300 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">📖</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 font-fun">Currently Reading</h3>
              </div>
              <p className="text-gray-700 text-lg font-medium bg-blue-50 p-4 rounded-xl">{aboutData.currentlyReading}</p>
            </div>
          </div>
        )}

        <div className="group relative" style={{ animation: 'slide-up 0.5s ease-out 0.2s both' }}>
          <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-400 to-rose-400 rounded-3xl opacity-0 group-hover:opacity-70 blur transition-opacity"></div>
          <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 border-4 border-pink-100 hover:border-pink-300 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">💖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 font-fun">Why I Love Reading</h3>
            </div>
            <p className="text-gray-700 leading-relaxed bg-pink-50 p-4 rounded-xl">{aboutData.whyIRead}</p>
          </div>
        </div>

        <div className="group relative" style={{ animation: 'slide-up 0.5s ease-out 0.3s both' }}>
          <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-400 to-violet-400 rounded-3xl opacity-0 group-hover:opacity-70 blur transition-opacity"></div>
          <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 border-4 border-purple-100 hover:border-purple-300 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 font-fun">Favorite Genres</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {aboutData.favoriteGenres.map((genre, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-full text-sm font-bold hover:from-purple-200 hover:to-violet-200 transition-all hover:scale-105 cursor-default"
                  style={{ animation: `slide-up 0.3s ease-out ${0.3 + idx * 0.05}s both` }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="group relative" style={{ animation: 'slide-up 0.5s ease-out 0.4s both' }}>
          <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl opacity-0 group-hover:opacity-70 blur transition-opacity"></div>
          <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-xl p-6 border-4 border-amber-100 hover:border-amber-300 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">✍️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 font-fun">Favorite Authors</h3>
            </div>
            <ul className="space-y-2">
              {aboutData.favoriteAuthors.map((author, idx) => (
                <li 
                  key={idx} 
                  className="flex items-center gap-3 text-gray-700 bg-amber-50 p-3 rounded-xl hover:bg-amber-100 transition-colors"
                  style={{ animation: `slide-up 0.3s ease-out ${0.4 + idx * 0.05}s both` }}
                >
                  <span className="text-xl">✨</span>
                  <span className="font-medium">{author}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {aboutData.funFacts.length > 0 && (
        <div className="relative" style={{ animation: 'slide-up 0.5s ease-out 0.5s both' }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 rounded-[2rem] blur-lg opacity-30"></div>
          <div className="relative bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-[2rem] shadow-xl p-8 border-4 border-amber-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 font-fun">
              <span className="text-4xl animate-bounce">🎉</span>
              Fun Facts About Me
              <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🌈</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {aboutData.funFacts.map((fact, idx) => (
                <div 
                  key={idx} 
                  className="group flex items-start gap-4 bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all hover:scale-[1.02] border-2 border-transparent hover:border-amber-200"
                  style={{ animation: `slide-up 0.3s ease-out ${0.5 + idx * 0.05}s both` }}
                >
                  <span className="text-3xl flex-shrink-0 group-hover:animate-wiggle">📌</span>
                  <p className="text-gray-700 font-medium">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {aboutData.readingGoals.length > 0 && (
        <div className="relative" style={{ animation: 'slide-up 0.5s ease-out 0.6s both' }}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl opacity-0 hover:opacity-50 blur transition-opacity"></div>
          <div className="relative bg-white/95 backdrop-blur rounded-3xl shadow-xl p-8 border-4 border-emerald-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 font-fun">My Reading Goals</h3>
            </div>
            <ul className="space-y-3">
              {aboutData.readingGoals.map((goal, idx) => (
                <li 
                  key={idx} 
                  className="flex items-start gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl hover:from-emerald-100 hover:to-teal-100 transition-all"
                  style={{ animation: `slide-up 0.3s ease-out ${0.6 + idx * 0.05}s both` }}
                >
                  <span className="text-2xl flex-shrink-0">🌟</span>
                  <span className="text-gray-700 text-lg font-medium">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {aboutData.achievements.length > 0 && (
        <div className="relative" style={{ animation: 'slide-up 0.5s ease-out 0.7s both' }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 rounded-[2rem] blur-lg opacity-30"></div>
          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-[2rem] shadow-xl p-8 border-4 border-indigo-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-4xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 font-fun">Reading Achievements</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aboutData.achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl p-5 shadow-md border-3 border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-xl hover:scale-105"
                  style={{ animation: `slide-up 0.3s ease-out ${0.7 + idx * 0.05}s both` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl group-hover:animate-bounce">🏆</span>
                    <span className="text-gray-700 font-bold">{achievement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutMe
