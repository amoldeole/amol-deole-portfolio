import { motion } from 'framer-motion';

export const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 360],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
    />
  </div>
);

export default Loading;