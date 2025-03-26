
import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import Card, { CardProps } from './Card';
import { motion, AnimatePresence } from 'framer-motion';

export type CardType = "credit" | "debit";

export type CardItem = Omit<CardProps, 'onSelect' | 'isSelected' | 'onRemove' | 'isInComparisonView'> & {
  cardType: CardType;
  productOffers?: Array<{
    product: string;
    cashback: string;
    installments: string;
    exclusive: boolean;
  }>;
};

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
  
  // Handle mouse movement for 3D hover effect with enhanced visuals
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
        
        // Enhanced rotation based on mouse position
        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;
        
        // Only apply effect when mouse is close to the card
        const distance = Math.sqrt(
          Math.pow(Math.abs(x - centerX), 2) + 
          Math.pow(Math.abs(y - centerY), 2)
        );
        
        const isNear = distance < rect.width / 2 + 150;
        
        if (isNear) {
          // Add more dramatic 3D effect with light reflection
          (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
          (card as HTMLElement).style.boxShadow = `
            0 10px 30px -5px rgba(0, 0, 0, 0.1),
            0 3px 10px -5px rgba(0, 0, 0, 0.05),
            ${-rotateY/3}px ${rotateX/3}px 20px rgba(0, 112, 243, 0.15)
          `;
          
          // Add subtle highlight effect
          const highlight = card.querySelector('.card-highlight') as HTMLElement;
          if (highlight) {
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;
            highlight.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%)`;
            highlight.style.opacity = '1';
          }
        } else {
          (card as HTMLElement).style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
          (card as HTMLElement).style.boxShadow = '';
          
          // Reset highlight
          const highlight = card.querySelector('.card-highlight') as HTMLElement;
          if (highlight) {
            highlight.style.opacity = '0';
          }
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Enhanced card animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 12 
      }
    }
  };

  return (
    <motion.div 
      ref={gridRef}
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={`card-grid-${items.length}`} // Re-trigger animation when items change
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            className="card-container relative"
            variants={cardVariants}
            layout
            whileHover={{ scale: 1.03, zIndex: 10 }}
            style={{ 
              transition: "all 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67)",
            }}
          >
            <div className="card-highlight absolute inset-0 pointer-events-none opacity-0 rounded-xl z-0 transition-opacity duration-300"></div>
            
            <Card
              {...item}
              isSelected={selectedIds.includes(item.id)}
              onSelect={onSelectItem}
            />
            
            {/* Enhanced particle effect for selected cards */}
            {selectedIds.includes(item.id) && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                <div className="particles-container">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue animate-particle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${3 + Math.random() * 5}s`,
                        opacity: 0.2 + Math.random() * 0.8
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default CardGrid;
