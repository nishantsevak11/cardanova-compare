
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { PlusCircle, CheckCircle, X } from "lucide-react";
import { motion } from "framer-motion";

export interface CardProps {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: number;
  features: string[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove?: (id: string) => void;
  isInComparisonView?: boolean;
  className?: string;
}

const Card = ({
  id,
  title,
  image,
  price,
  rating,
  features,
  isSelected,
  onSelect,
  onRemove,
  isInComparisonView = false,
  className
}: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleToggleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(id);
  };

  // Animation variants for Framer Motion
  const featureVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      className={cn(
        "relative rounded-xl overflow-hidden bg-white transition-all duration-300",
        isSelected ? "card-selected" : "card-shadow",
        isInComparisonView ? "w-full max-w-[280px] h-auto" : "w-full max-w-[350px] h-auto",
        isHovered && !isSelected && "transform scale-[1.02]",
        "glassmorphism",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] 
      }}
    >
      {isInComparisonView && onRemove && (
        <motion.button 
          onClick={handleRemove}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 backdrop-blur-sm opacity-70 hover:opacity-100 transition-opacity-300"
          aria-label="Remove from comparison"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={18} className="text-gray-600" />
        </motion.button>
      )}

      <div className="relative w-full h-[200px] overflow-hidden group">
        <motion.img 
          src={image} 
          alt={title} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-500 ease-out",
            isHovered && "transform scale-[1.08]"
          )}
          loading="lazy"
          initial={{ scale: 1.2, filter: "blur(10px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal/10 to-brand-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price tag */}
        <motion.div 
          className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full backdrop-blur-sm text-sm font-medium"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {price}
        </motion.div>
      </div>

      <div className={cn(
        "p-4",
        isInComparisonView ? "stagger-animation" : ""
      )}>
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{title}</h3>
        
        <div className="mb-3 flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="mr-1 text-sm font-medium">{rating.toFixed(1)}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <motion.span 
                  key={i} 
                  className={`text-xs ${i < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: 0.3 + (i * 0.06), duration: 0.4 }}
                >
                  ★
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {isInComparisonView ? (
          <motion.ul 
            className="space-y-2 mt-4 text-sm"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { 
                transition: { 
                  staggerChildren: 0.08,
                  delayChildren: 0.2
                } 
              }
            }}
          >
            {features.map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex items-start"
                custom={index}
                variants={featureVariants}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-brand-teal mt-1.5 mr-2"></span>
                <span>{feature}</span>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <motion.li 
                key={index} 
                className="line-clamp-1 flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5 mr-2"></span>
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {!isInComparisonView && (
        <motion.button
          aria-label={isSelected ? "Remove from comparison" : "Add to comparison"}
          onClick={handleToggleSelect}
          className={cn(
            "absolute bottom-4 right-4 transition-all-300 rounded-full",
            isSelected ? "bg-brand-teal text-white" : "bg-white text-brand-dark-blue border border-gray-200"
          )}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSelected ? (
            <CheckCircle size={28} className="animate-scale-up" />
          ) : (
            <PlusCircle size={28} className={isHovered ? "scale-110 transition-transform-300" : ""} />
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Card;
