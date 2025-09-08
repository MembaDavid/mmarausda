"use client";
import React from "react";
import { motion } from "framer-motion";

const events = [
  {
    title: "Sunday Worship Service",
    date: "Every Sunday, 10:00 AM",
    location: "Main Sanctuary",
    description:
      "Join us for uplifting worship, inspiring messages, and fellowship.",
    image: "/images/sunday-service.jpg",
    organizer: "Pastor John Doe",
    contact: "info@church.org",
    tags: ["Worship", "Community", "Family"],
  },
  {
    title: "Youth Fellowship",
    date: "Fridays, 6:00 PM",
    location: "Youth Hall",
    description:
      "A vibrant gathering for young people to connect, learn, and grow in faith.",
    image: "/images/youth-fellowship.jpg",
    organizer: "Sister Mary Ann",
    contact: "youth@church.org",
    tags: ["Youth", "Fun", "Learning"],
  },
  {
    title: "Bible Study",
    date: "Wednesdays, 7:00 PM",
    location: "Room 3",
    description:
      "Deepen your understanding of the Word in a friendly, interactive setting.",
    image: "/images/bible-study.jpg",
    organizer: "Brother Samuel",
    contact: "biblestudy@church.org",
    tags: ["Bible", "Study", "Discussion"],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80 },
  },
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-5xl font-extrabold text-center text-indigo-900 mb-4 drop-shadow-lg">
            Upcoming Events
          </h1>
          <p className="text-center text-lg text-indigo-700 mb-12 max-w-2xl mx-auto">
            Discover our vibrant community events. Join us to worship, learn,
            and grow together in faith and fellowship.
          </p>
        </motion.div>
        <motion.div
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 32px rgba(80, 80, 200, 0.18)",
              }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col transition-all border border-indigo-100"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/80 rounded-full px-4 py-1 text-xs font-semibold text-indigo-700 shadow">
                  {event.tags.map((tag) => (
                    <span key={tag} className="mr-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-7 flex flex-col flex-1">
                <h2 className="text-2xl font-bold text-indigo-800 mb-2">
                  {event.title}
                </h2>
                <div className="flex items-center text-sm text-indigo-600 mb-2 gap-3">
                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 7V3M16 7V3M4 11h16M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                  </span>
                  <span className="inline-flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" />
                      <path d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {event.location}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 flex-1">{event.description}</p>
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-500 mr-2">Organizer:</span>
                  <span className="text-sm font-medium text-indigo-700">
                    {event.organizer}
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-500 mr-2">Contact:</span>
                  <a
                    href={`mailto:${event.contact}`}
                    className="text-sm text-indigo-600 underline"
                  >
                    {event.contact}
                  </a>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
