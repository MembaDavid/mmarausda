"use client";

import { motion } from "framer-motion";
import { FaBookOpen, FaSearch, FaCalendar } from "react-icons/fa";

export default function BibleStudyPage() {
  const studies = [
    {
      id: 1,
      title: "Faith and Works",
      verse: "James 2:14-26",
      description:
        "Exploring the balance between genuine faith and practical works in our Christian journey.",
      date: "September 21, 2025",
    },
    {
      id: 2,
      title: "Love One Another",
      verse: "John 13:34-35",
      description:
        "Understanding the commandment of love as the core of discipleship.",
      date: "September 28, 2025",
    },
    {
      id: 3,
      title: "The Power of Prayer",
      verse: "Philippians 4:6-7",
      description:
        "Learning how to present our requests to God with thanksgiving.",
      date: "October 5, 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1a2f] via-[#102d52] to-[#0a1a2f] text-white py-16 px-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold text-center text-yellow-400 mb-10"
      >
        Bible Study
      </motion.h1>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-xl mx-auto flex items-center bg-white/10 border border-yellow-400/30 rounded-full p-2 mb-12"
      >
        <FaSearch className="text-yellow-400 ml-3" />
        <input
          type="text"
          placeholder="Search studies..."
          className="flex-1 bg-transparent outline-none px-3 text-white placeholder-gray-300"
        />
      </motion.div>

      {/* Studies List */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {studies.map((study, i) => (
          <motion.div
            key={study.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
                {study.title}
              </h2>
              <p className="italic text-sm text-gray-300 mb-3">{study.verse}</p>
              <p className="text-gray-200 mb-4">{study.description}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <FaCalendar /> {study.date}
              </span>
              <span className="flex items-center gap-2">
                <FaBookOpen /> Read More
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
