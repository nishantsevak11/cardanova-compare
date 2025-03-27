
import React from 'react';
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
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={`card-grid-${items.length}`}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            className="card-container relative"
            variants={cardVariants}
            layout
            whileHover={{ scale: 1.02, zIndex: 5 }}
          >
            <Card
              {...item}
              isSelected={selectedIds.includes(item.id)}
              onSelect={onSelectItem}
            />
            
            {/* Simple highlight for selected cards */}
            {selectedIds.includes(item.id) && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                <div className="border-2 border-brand-teal rounded-xl absolute inset-0"></div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default CardGrid;
