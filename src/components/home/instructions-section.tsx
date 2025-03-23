"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  "Upload network capture files or synthetic attack datasets",
  "Explore automatic attack classification results",
  "Interact with temporal traffic visualizations",
  "Investigate feature contributions using XAI tools",
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const InstructionsSection: React.FC = () => {
  return (
    <motion.div
      className="bg-gradient-to-t from-gray-100 to-gray-50 px-6 py-20 relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-start">
        <div>
          <h3 className="text-3xl font-bold text-stone-900 mb-6 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Getting Started with NetViser
          </h3>
          <p className="text-stone-700 mb-8 text-lg leading-relaxed">
            Follow these steps to detect and visualize your network traffic with the power of explainable AI.
          </p>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="mb-8 group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-baseline space-x-4 mb-3">
                <motion.span
                  className="text-xl font-bold text-orange-500 flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {index + 1}
                </motion.span>
                <p className="text-stone-700 text-lg group-hover:text-orange-600 transition-colors">
                  {step}
                </p>
              </div>
              <motion.hr
                className="border-orange-300/50"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="flex items-center justify-center mt-6 md:mt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src="network.svg"
            alt="NetViser dashboard preview"
            width={400}
            height={300}
            className="max-w-full h-auto rounded-xl border border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstructionsSection;
