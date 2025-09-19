import { AnimatePresence, motion } from 'framer-motion';

interface ExperiencePulseProps {
  message: string | null;
}

export const ExperiencePulse = ({ message }: ExperiencePulseProps) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-10 right-10 z-50 rounded-3xl border border-aurora/40 bg-midnight/90 px-6 py-4 text-white shadow-glow"
        >
          <p className="font-semibold">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
