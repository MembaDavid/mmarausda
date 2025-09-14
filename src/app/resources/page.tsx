"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUsers, FaHeart, FaVideo, FaGift, FaFileAlt } from "react-icons/fa";

const resources = [
  {
    category: "Sermons",
    icon: FaVideo,
    items: [
      { title: "Latest Sermons", url: "/sermons" },
      { title: "Sermon Archive", url: "/sermons/archive" },
      { title: "Audio Sermons", url: "/sermons/audio" },
      { title: "Video Sermons", url: "/sermons/video" },
    ],
  },
  {
    category: "Bible Study",
    icon: FaGift,
    items: [
      { title: "Weekly Bible Study", url: "/bible-study/weekly" },
      { title: "Study Guides", url: "/bible-study/guides" },
      { title: "Devotionals", url: "/bible-study/devotionals" },
      { title: "Children's Bible Lessons", url: "/bible-study/children" },
    ],
  },
  {
    category: "Community",
    icon: FaUsers,
    items: [
      { title: "Prayer Requests", url: "/community/prayer-requests" },
      { title: "Volunteer Opportunities", url: "/community/volunteer" },
      { title: "Events Calendar", url: "/community/events" },
      { title: "Support Groups", url: "/community/support-groups" },
    ],
  },
  {
    category: "Media",
    icon: FaVideo,
    items: [
      { title: "Photo Gallery", url: "/media/photos" },
      { title: "Church Newsletter", url: "/media/newsletter" },
      { title: "Podcast", url: "/media/podcast" },
      { title: "Livestream", url: "/media/livestream" },
    ],
  },
  {
    category: "Giving",
    icon: FaGift,
    items: [
      { title: "Online Giving", url: "/giving/online" },
      { title: "Tithes & Offerings", url: "/giving/tithes" },
      { title: "Missions Support", url: "/giving/missions" },
      { title: "Fundraising", url: "/giving/fundraising" },
    ],
  },
  {
    category: "Resources",
    icon: FaFileAlt,
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
    transition: { type: "spring", stiffness: 80 },
  },
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-500"
      >
        Church Resources
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {resources.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.category}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {section.category}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.url}
                      className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></span>
                      <span className="group-hover:underline">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>
    </main>
  );
}
