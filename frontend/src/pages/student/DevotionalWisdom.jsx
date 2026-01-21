// 📁 src/pages/DevotionalWisdom.jsx

import { useState, useEffect } from "react";
import StuNav from "../StudentNavbar";

const books = ["Bhagavad Gita", "Bible", "Quran"];

const wisdomData = {
  "Bhagavad Gita": [
    {
      title: "Chapter 2, Verse 47",
      verse: "Karmanye vadhikaraste Ma Phaleshu Kadachana",
      meaning: "You have the right to perform your duties, but not to expect results.",
      lifeLesson: "Do your work sincerely without attachment to outcomes."
    },
    {
      title: "Chapter 4, Verse 7",
      verse: "Yada yada hi dharmasya glanir bhavati bharata...",
      meaning: "Whenever there is decline of righteousness, I manifest myself.",
      lifeLesson: "Divine power always supports justice and truth."
    },
    {
      title: "Chapter 6, Verse 5",
      verse: "Uddhared atmanatmanam na atmanam avasadayet",
      meaning: "One should uplift oneself and not degrade oneself.",
      lifeLesson: "Self-discipline is the path to growth."
    }
  ],
  "Bible": [
    {
      title: "Matthew 5:44",
      verse: "Love your enemies, bless them that curse you.",
      meaning: "Show kindness even to those who hurt you.",
      lifeLesson: "Forgiveness and love conquer hatred."
    },
    {
      title: "Proverbs 3:5",
      verse: "Trust in the Lord with all your heart and lean not on your own understanding.",
      meaning: "Put faith in God rather than worrying about logic and control.",
      lifeLesson: "Surrender leads to peace."
    },
    {
      title: "Romans 12:21",
      verse: "Do not be overcome by evil, but overcome evil with good.",
      meaning: "Do not fall into negativity when wronged.",
      lifeLesson: "Respond to hate with goodness."
    }
  ],
  "Quran": [
    {
      title: "Surah Al-Baqarah 2:286",
      verse: "Allah does not burden a soul beyond that it can bear.",
      meaning: "Every challenge is something you can overcome.",
      lifeLesson: "Allah gives strength equal to the test."
    },
    {
      title: "Surah Al-Zalzalah 99:7-8",
      verse: "Whoever does an atom’s weight of good will see it.",
      meaning: "Every small action matters in the sight of God.",
      lifeLesson: "Do even the smallest good deed—it counts."
    },
    {
      title: "Surah Al-Furqan 25:63",
      verse: "The servants of the Merciful are those who walk humbly.",
      meaning: "Humility is a trait of the righteous.",
      lifeLesson: "Choose humility over pride."
    }
  ]
};

export default function DevotionalWisdom() {
  const [activeBook, setActiveBook] = useState("Bhagavad Gita");
  const [search, setSearch] = useState("");
  const [dailyWisdom, setDailyWisdom] = useState(null);

  useEffect(() => {
    const allWisdom = books.flatMap((book) => wisdomData[book] || []);
    const today = new Date().getDate();
    const index = today % allWisdom.length;
    setDailyWisdom(allWisdom[index]);
  }, []);

  const filteredWisdom = wisdomData[activeBook].filter((item) =>
    item.verse.toLowerCase().includes(search.toLowerCase()) ||
    item.meaning.toLowerCase().includes(search.toLowerCase()) ||
    item.lifeLesson.toLowerCase().includes(search.toLowerCase())
  );

  const downloadLinks = {
    "Bhagavad Gita": "/pdfs/bhagavad-gita.pdf",
    "Bible": "/pdfs/holy-bible.pdf",
    // "Quran": "/pdfs/quran.pdf"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      <StuNav />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center text-amber-700 mb-3">Devotional Wisdom</h1>
        <p className="text-center text-gray-600 mb-6">Discover moral values and life lessons from sacred scriptures.</p>

        {dailyWisdom && (
          <div className="bg-orange-100 p-4 rounded-xl shadow-md mb-6">
            <h2 className="text-lg font-semibold text-orange-700 mb-1">🌞 Wisdom of the Day</h2>
            <p className="italic text-gray-700">“{dailyWisdom.verse}”</p>
            <p className="text-sm text-gray-700 mt-2"><strong>Meaning:</strong> {dailyWisdom.meaning}</p>
            <p className="text-sm text-green-700 mt-1"><strong>Life Lesson:</strong> {dailyWisdom.lifeLesson}</p>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {books.map((book) => (
            <button
              key={book}
              onClick={() => {
                setActiveBook(book);
                setSearch("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                activeBook === book
                  ? "bg-amber-600 text-white"
                  : "bg-white text-amber-700 border-amber-700"
              }`}
            >
              {book}
            </button>
          ))}
        </div>

        <div className="max-w-xl mx-auto mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search wisdom..."
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />
        </div>

        <div className="space-y-6">
          {filteredWisdom.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-amber-800 mb-1">{item.title}</h3>
              <p className="italic text-gray-600">“{item.verse}”</p>
              <p className="text-sm text-gray-700 mt-2"><strong>Meaning:</strong> {item.meaning}</p>
              <p className="text-sm text-green-700 mt-1"><strong>Life Lesson:</strong> {item.lifeLesson}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={downloadLinks[activeBook]}
            download
            className="inline-block px-5 py-2 mt-6 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📥 Download {activeBook} (PDF)
          </a>
        </div>
      </div>
    </div>
  );
}
