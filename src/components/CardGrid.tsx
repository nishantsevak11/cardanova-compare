
import React from 'react';
import { cn } from "@/lib/utils";
import Card, { CardProps } from './Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, Award, Gift, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
  onViewItem?: (id: string) => void;
  className?: string;
}

const CardGrid = ({
  items,
  selectedIds,
  onSelectItem,
  onViewItem,
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

  // Function to highlight the best offer from a card
  const getBestOffer = (item: CardItem) => {
    if (!item.offers || item.offers.length === 0) return null;
    
    // For simplicity, we'll consider the first offer as the best one
    // In a real app, you might want to implement some ranking logic
    return item.offers[0];
  };

  // Function to get the best product offer (highest cashback %)
  const getBestProductOffer = (item: CardItem) => {
    if (!item.productOffers || item.productOffers.length === 0) return null;
    
    // Find the offer with highest cashback percentage
    return item.productOffers.reduce((best, current) => {
      const currentCashback = parseFloat(current.cashback.replace('%', '')) || 0;
      const bestCashback = parseFloat(best.cashback.replace('%', '')) || 0;
      
      return currentCashback > bestCashback ? current : best;
    });
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
        {items.map((item) => {
          const bestOffer = getBestOffer(item);
          const bestProductOffer = getBestProductOffer(item);
          const isExclusive = item.productOffers?.some(offer => offer.exclusive);
          
          return (
            <motion.div 
              key={item.id}
              className="card-container relative"
              variants={cardVariants}
              layout
              whileHover={{ scale: 1.02, zIndex: 5 }}
            >
              {/* Highlighting badges for special cards */}
              {item.rating >= 4.8 && (
                <div className="absolute -top-3 -left-3 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md flex items-center gap-1 px-3 py-1">
                    <Star size={12} className="fill-white" /> Top Rated
                  </Badge>
                </div>
              )}
              
              {isExclusive && (
                <div className="absolute -top-3 right-5 z-10">
                  <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md flex items-center gap-1 px-3 py-1">
                    <Sparkles size={12} /> Exclusive Offers
                  </Badge>
                </div>
              )}
              
              <Card
                {...item}
                isSelected={selectedIds.includes(item.id)}
                onSelect={onSelectItem}
              />
              
              {/* View button overlay */}
              {onViewItem && (
                <div className="absolute right-4 bottom-4 z-10">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white hover:bg-gray-100 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewItem(item.id);
                    }}
                  >
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                </div>
              )}
              
              {/* Special offers highlight */}
              {bestOffer && (
                <div className="absolute left-0 right-0 bottom-16 flex justify-center">
                  <div className="bg-gradient-to-r from-brand-blue/90 to-brand-teal/90 text-white text-xs font-medium py-1 px-3 rounded-full backdrop-blur-sm shadow-md flex items-center">
                    <Gift size={12} className="mr-1" /> {bestOffer}
                  </div>
                </div>
              )}
              
              {/* Product offer highlight */}
              {bestProductOffer && (
                <div className="absolute left-0 right-0 bottom-24 flex justify-center">
                  <div className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white text-xs font-medium py-1 px-3 rounded-full backdrop-blur-sm shadow-md flex items-center">
                    <Award size={12} className="mr-1" /> {bestProductOffer.product}: {bestProductOffer.cashback} cashback
                  </div>
                </div>
              )}
              
              {/* Simple highlight for selected cards */}
              {selectedIds.includes(item.id) && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                  <div className="border-2 border-brand-teal rounded-xl absolute inset-0"></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default CardGrid;
