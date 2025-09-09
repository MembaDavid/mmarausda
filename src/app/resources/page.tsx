"use client";

import React, { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const resources = [
  {
    category: "Sermons",
    items: [
      { title: "Latest Sermons", url: "/sermons" },
      { title: "Sermon Archive", url: "/sermons/archive" },
      { title: "Audio Sermons", url: "/sermons/audio" },
      { title: "Video Sermons", url: "/sermons/video" },
    ],
  },
  {
    category: "Bible Study",
    items: [
      { title: "Weekly Bible Study", url: "/bible-study/weekly" },
      { title: "Study Guides", url: "/bible-study/guides" },
      { title: "Devotionals", url: "/bible-study/devotionals" },
      { title: "Children's Bible Lessons", url: "/bible-study/children" },
    ],
  },
  {
    category: "Community",
    items: [
      { title: "Prayer Requests", url: "/community/prayer-requests" },
      { title: "Volunteer Opportunities", url: "/community/volunteer" },
      { title: "Events Calendar", url: "/community/events" },
      { title: "Support Groups", url: "/community/support-groups" },
    ],
  },
  {
    category: "Media",
    items: [
      { title: "Photo Gallery", url: "/media/photos" },
      { title: "Church Newsletter", url: "/media/newsletter" },
      { title: "Podcast", url: "/media/podcast" },
      { title: "Livestream", url: "/media/livestream" },
    ],
  },
  {
    category: "Giving",
    items: [
      { title: "Online Giving", url: "/giving/online" },
      { title: "Tithes & Offerings", url: "/giving/tithes" },
      { title: "Missions Support", url: "/giving/missions" },
      { title: "Fundraising", url: "/giving/fundraising" },
    ],
  },
  {
    category: "Resources",
    items: [
      { title: "Downloadable Materials", url: "/resources/downloads" },
      { title: "Recommended Books", url: "/resources/books" },
      { title: "Faith Articles", url: "/resources/articles" },
      { title: "FAQs", url: "/resources/faq" },
    ],
  },
];

import type { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80 },
  },
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-center mb-10 text-blue-900"
      >
        Church Resources
      </motion.h1>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {resources.map((section) => (
          <motion.div
            key={section.category}
            variants={cardVariants}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">
              {section.category}
            </h2>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    className="text-blue-600 hover:underline transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
