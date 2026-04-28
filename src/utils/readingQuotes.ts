// Weekly Reading Quotes - Child Appropriate
// Rotates every week based on the week number of the year

export interface ReadingQuote {
  text: string
  author: string
  emoji: string
}

const childAppropriateQuotes: ReadingQuote[] = [
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss",
    emoji: "📚"
  },
  {
    text: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
    emoji: "🤝"
  },
  {
    text: "A reader lives a thousand lives before he dies. The person who never reads lives only one.",
    author: "George R.R. Martin",
    emoji: "🌟"
  },
  {
    text: "Reading is dreaming with open eyes.",
    author: "Unknown",
    emoji: "✨"
  },
  {
    text: "Books are a uniquely portable magic.",
    author: "Stephen King",
    emoji: "🎩"
  },
  {
    text: "Once you learn to read, you will be forever free.",
    author: "Frederick Douglass",
    emoji: "🦅"
  },
  {
    text: "I have always imagined that paradise will be a kind of library.",
    author: "Jorge Luis Borges",
    emoji: "🏛️"
  },
  {
    text: "Reading gives us someplace to go when we have to stay where we are.",
    author: "Mason Cooley",
    emoji: "🗺️"
  },
  {
    text: "A book is a dream that you hold in your hand.",
    author: "Neil Gaiman",
    emoji: "💭"
  },
  {
    text: "You can find magic wherever you look. Sit back and relax, all you need is a book.",
    author: "Dr. Seuss",
    emoji: "🎪"
  },
  {
    text: "Reading is important, because if you can read, you can learn anything about everything and everything about anything.",
    author: "Tomie dePaola",
    emoji: "🌈"
  },
  {
    text: "The best books... are those that tell you what you know already.",
    author: "George Orwell",
    emoji: "💡"
  },
  {
    text: "Never trust anyone who has not brought a book with them.",
    author: "Lemony Snicket",
    emoji: "📖"
  },
  {
    text: "Reading is to the mind what exercise is to the body.",
    author: "Joseph Addison",
    emoji: "💪"
  },
  {
    text: "Books are mirrors: you only see in them what you already have inside you.",
    author: "Carlos Ruiz Zafón",
    emoji: "🪞"
  },
  {
    text: "Think before you speak. Read before you think.",
    author: "Fran Lebowitz",
    emoji: "🤔"
  },
  {
    text: "A room without books is like a body without a soul.",
    author: "Cicero",
    emoji: "🏠"
  },
  {
    text: "Today a reader, tomorrow a leader.",
    author: "Margaret Fuller",
    emoji: "👑"
  },
  {
    text: "Reading is a passport to countless adventures.",
    author: "Mary Pope Osborne",
    emoji: "🛫"
  },
  {
    text: "The man who does not read has no advantage over the man who cannot read.",
    author: "Mark Twain",
    emoji: "📜"
  },
  {
    text: "Reading should not be presented to children as a chore or duty. It should be offered to them as a precious gift.",
    author: "Kate DiCamillo",
    emoji: "🎁"
  },
  {
    text: "I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.",
    author: "Groucho Marx",
    emoji: "📺"
  },
  {
    text: "There are many little ways to enlarge your child's world. Love of books is the best of all.",
    author: "Jacqueline Kennedy",
    emoji: "🌍"
  },
  {
    text: "You don't have to burn books to destroy a culture. Just get people to stop reading them.",
    author: "Ray Bradbury",
    emoji: "🔥"
  },
  {
    text: "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.",
    author: "J.K. Rowling",
    emoji: "⚡"
  },
  {
    text: "If you don't like to read, you haven't found the right book.",
    author: "J.K. Rowling",
    emoji: "🔍"
  },
  {
    text: "Fairy tales are more than true: not because they tell us that dragons exist, but because they tell us that dragons can be beaten.",
    author: "Neil Gaiman",
    emoji: "🐉"
  },
  {
    text: "The person who deserves most pity is a lonesome one on a rainy day who doesn't know how to read.",
    author: "Benjamin Franklin",
    emoji: "🌧️"
  },
  {
    text: "No two persons ever read the same book.",
    author: "Edmund Wilson",
    emoji: "👥"
  },
  {
    text: "A children's story that can only be enjoyed by children is not a good children's story in the slightest.",
    author: "C.S. Lewis",
    emoji: "🦁"
  },
  {
    text: "Good friends, good books, and a sleepy conscience: this is the ideal life.",
    author: "Mark Twain",
    emoji: "☀️"
  },
  {
    text: "A book is a garden, an orchard, a storehouse, a party, a company by the way, a counselor, a multitude of counselors.",
    author: "Charles Baudelaire",
    emoji: "🌳"
  },
  {
    text: "Show me a family of readers, and I will show you the people who move the world.",
    author: "Napoléon Bonaparte",
    emoji: "👨‍👩‍👧‍👦"
  },
  {
    text: "You can never get a cup of tea large enough or a book long enough to suit me.",
    author: "C.S. Lewis",
    emoji: "☕"
  },
  {
    text: "I kept always two books in my pocket, one to read, one to write in.",
    author: "Robert Louis Stevenson",
    emoji: "✍️"
  },
  {
    text: "Let us read, and let us dance; these two amusements will never do any harm to the world.",
    author: "Voltaire",
    emoji: "💃"
  },
  {
    text: "Books are the quietest and most constant of friends; they are the most accessible and wisest of counselors.",
    author: "Charles William Eliot",
    emoji: "🤗"
  },
  {
    text: "It is not true that we have only one life to live; if we can read, we can live as many more lives and as many kinds of lives as we wish.",
    author: "S.I. Hayakawa",
    emoji: "♾️"
  },
  {
    text: "We read to know we're not alone.",
    author: "William Nicholson",
    emoji: "💕"
  },
  {
    text: "Wear the old coat and buy the new book.",
    author: "Austin Phelps",
    emoji: "🧥"
  },
  {
    text: "One glance at a book and you hear the voice of another person, perhaps someone dead for 1,000 years. To read is to voyage through time.",
    author: "Carl Sagan",
    emoji: "⏳"
  },
  {
    text: "Reading is an exercise in empathy; an exercise in walking in someone else's shoes for a while.",
    author: "Malorie Blackman",
    emoji: "👟"
  },
  {
    text: "A book is the only place in which you can examine a fragile thought without breaking it.",
    author: "Edward P. Morgan",
    emoji: "🦋"
  },
  {
    text: "In the case of good books, the point is not to see how many of them you can get through, but rather how many can get through to you.",
    author: "Mortimer J. Adler",
    emoji: "🎯"
  },
  {
    text: "To learn to read is to light a fire; every syllable that is spelled out is a spark.",
    author: "Victor Hugo",
    emoji: "🔥"
  },
  {
    text: "Reading makes immigrants of us all. It takes us away from home, but more important, it finds homes for us everywhere.",
    author: "Jean Rhys",
    emoji: "🏡"
  },
  {
    text: "Literature is the most agreeable way of ignoring life.",
    author: "Fernando Pessoa",
    emoji: "🎭"
  },
  {
    text: "Fill your house with stacks of books, in all the crannies and all the nooks.",
    author: "Dr. Seuss",
    emoji: "📚"
  },
  {
    text: "A house without books is like a room without windows.",
    author: "Heinrich Mann",
    emoji: "🪟"
  },
  {
    text: "Books are the plane, and the train, and the road. They are the destination, and the journey. They are home.",
    author: "Anna Quindlen",
    emoji: "🚂"
  },
  {
    text: "Reading is a conversation. All books talk. But a good book listens as well.",
    author: "Mark Haddon",
    emoji: "💬"
  },
  {
    text: "Children are made readers on the laps of their parents.",
    author: "Emilie Buchwald",
    emoji: "👶"
  }
]

/**
 * Get the current week number of the year
 * Weeks start on Monday (ISO 8601 standard)
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * Get the quote for the current week
 * Quote rotates every Sunday night at midnight
 */
export function getWeeklyQuote(): ReadingQuote {
  const now = new Date()
  const weekNumber = getWeekNumber(now)
  
  // Use week number to pick a quote (cycles through all quotes over the year)
  const quoteIndex = weekNumber % childAppropriateQuotes.length
  
  return childAppropriateQuotes[quoteIndex]
}
