
import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import Card, { CardProps } from './Card';
import { motion } from 'framer-motion';

type CardItem = Omit<CardProps, 'onSelect' | 'isSelected' | 'onRemove' | 'isInComparisonView'>;

interface CardGridProps {
  items: CardItem[];
  selectedIds: string[];
  onSelectItem: (id: string) => void;
  className?: string;
}

const CardGrid = ({
  items,
  selectedIds,
  onSelectItem,
  className
}: CardGridProps) => {
  // Ref for the grid container to handle 3D effects
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse movement for 3D hover effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      
      const cards = gridRef.current.querySelectorAll('.card-container');
      
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on mouse position
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        // Only apply effect when mouse is close to the card
        const distance = Math.sqrt(
          Math.pow(Math.abs(x - centerX), 2) + 
          Math.pow(Math.abs(y - centerY), 2)
        );
        
        const isNear = distance < rect.width / 2 + 100;
        
        if (isNear) {
          (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        } else {
          (card as HTMLElement).style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Card animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  return (
    <motion.div 
      ref={gridRef}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.div 
          key={item.id}
          className="card-container"
          variants={cardVariants}
          whileHover={{ scale: 1.03 }}
          style={{ 
            transition: "transform 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)",
          }}
        >
          <Card
            {...item}
            isSelected={selectedIds.includes(item.id)}
            onSelect={onSelectItem}
          />
          
          {/* Particle effect for selected cards */}
          {selectedIds.includes(item.id) && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
              <div className="particles-container">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-brand-teal animate-particle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${3 + Math.random() * 4}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CardGrid;
