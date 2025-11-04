import { User, BookOpen, Heart, Star, Target, Award, Sparkles } from 'lucide-react'

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
        <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-16 h-16 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">About Me - Coming Soon!</h3>
          <p className="text-gray-500 text-lg">Check back soon to learn more about Izzy! 📖</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            {aboutData.profilePhoto ? (
              <img
                src={aboutData.profilePhoto}
                alt="Izzy"
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-md border-4 border-white shadow-2xl flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-3 flex items-center justify-center md:justify-start gap-3">
              <Sparkles className="w-8 h-8" />
              About Me
            </h2>
            <p className="text-lg text-white/95 leading-relaxed">
              {aboutData.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Currently Reading */}
        {aboutData.currentlyReading && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Currently Reading</h3>
            </div>
            <p className="text-gray-700 text-lg font-medium">{aboutData.currentlyReading}</p>
          </div>
        )}

        {/* Why I Read */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Why I Love Reading</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{aboutData.whyIRead}</p>
        </div>

        {/* Favorite Genres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Favorite Genres</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {aboutData.favoriteGenres.map((genre, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Favorite Authors */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Favorite Authors</h3>
          </div>
          <ul className="space-y-2">
            {aboutData.favoriteAuthors.map((author, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <span className="text-orange-500">✨</span>
                {author}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fun Facts */}
      {aboutData.funFacts.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">🎉</span>
            Fun Facts About Me
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {aboutData.funFacts.map((fact, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <span className="text-2xl flex-shrink-0">📌</span>
                <p className="text-gray-700">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reading Goals */}
      {aboutData.readingGoals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">My Reading Goals</h3>
          </div>
          <ul className="space-y-3">
            {aboutData.readingGoals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-green-500 mt-1">🎯</span>
                <span className="text-gray-700 text-lg">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Achievements */}
      {aboutData.achievements.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Reading Achievements</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aboutData.achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-200 hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-gray-700 font-medium">{achievement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutMe
