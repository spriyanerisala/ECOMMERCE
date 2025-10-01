/* eslint-disable no-unused-vars */
// AnimatedWrapper.jsx
import React from "react";
import { motion } from "framer-motion";

const PageWrapper = ({ children, yOffset = 50 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }} // triggers when 20% of element is in view
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
