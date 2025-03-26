
import React from 'react';
import { cn } from "@/lib/utils";
import { X, ArrowUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ComparisonBarProps {
  selectedItems: Array<{
    id: string;
    title: string;
    image: string;
  }>;
  maxItems: number;
  onCompare: () => void;
  onRemove: (id: string) => void;
  className?: string;
}

const ComparisonBar = ({
  selectedItems,
  maxItems,
  onCompare,
  onRemove,
  className
}: ComparisonBarProps) => {
  if (selectedItems.length === 0) return null;

  return (
    <motion.div 
      className={cn(
        "fixed bottom-0 left-0 right-0 p-4 neo-blur z-50 border-t border-white/10",
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <motion.span 
            className="text-sm font-medium mr-3 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {selectedItems.length}/{maxItems} selected
          </motion.span>
          <div className="flex space-x-2">
            <AnimatePresence>
              {selectedItems.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  className="relative"
                  initial={{ scale: 0, opacity: 0, x: -20 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    x: 0,
                    transition: { 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: index * 0.08 
                    }
                  }}
                  exit={{ 
                    scale: 0, 
                    opacity: 0,
                    transition: { duration: 0.2 } 
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [-1, 1, -1, 0],
                    transition: { rotate: { repeat: 0, duration: 0.3 } }
                  }}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden border border-white/20 glass-container">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Holographic effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-teal/20 mix-blend-overlay" />
                  </div>
                  <motion.button
                    onClick={() => onRemove(item.id)}
                    className="absolute -top-2 -right-2 bg-white/10 backdrop-blur-md rounded-full p-0.5 border border-white/20"
                    aria-label={`Remove ${item.title} from comparison`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <X size={12} className="text-white" />
                  </motion.button>
                  
                  {/* Particle effects */}
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-brand-teal animate-pulse-orbit"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${i * 120}deg) translateX(14px)`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <motion.button
          onClick={onCompare}
          disabled={selectedItems.length < 2}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all-300 flex items-center",
            selectedItems.length >= 2 
              ? "neo-button text-white" 
              : "bg-gray-800/50 text-gray-400 cursor-not-allowed backdrop-blur-sm"
          )}
          whileHover={selectedItems.length >= 2 ? { scale: 1.05, y: -2 } : {}}
          whileTap={selectedItems.length >= 2 ? { scale: 0.95 } : {}}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Compare Now</span>
          <ArrowUp size={18} className="ml-2 transform rotate-45" />
          
          {/* Glow effect for enabled button */}
          {selectedItems.length >= 2 && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-blue to-brand-teal opacity-40 blur-sm -z-10" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ComparisonBar;
