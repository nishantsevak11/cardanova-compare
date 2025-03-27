
import React from 'react';
import { cn } from "@/lib/utils";
import Card, { CardProps } from './Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, Award, Gift, Star, CreditCard, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Enhanced card animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06 // Slightly faster staggering for smoother appearance
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 }, 
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 12
      }
    }
  };

  // Function to highlight the best offer from a card
  const getBestOffer = (item: CardItem) => {
    if (!item.offers || item.offers.length === 0) return null;
    return item.offers[0];
  };

  // Function to get the best product offer (highest cashback %)
  const getBestProductOffer = (item: CardItem) => {
    if (!item.productOffers || item.productOffers.length === 0) return null;
    
    return item.productOffers.reduce((best, current) => {
      const currentCashback = parseFloat(current.cashback.replace('%', '')) || 0;
      const bestCashback = parseFloat(best.cashback.replace('%', '')) || 0;
      
      return currentCashback > bestCashback ? current : best;
    });
  };

  return (
    <motion.div 
      className={cn(
        "grid gap-4 sm:gap-5",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
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
              whileHover={{ 
                scale: isMobile ? 1 : 1.01,
                zIndex: 5 
              }}
            >
              {/* Price and type badges - consistent positioning */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <Badge className="bg-slate-900/90 text-white shadow-md flex items-center gap-1 px-3 py-2 rounded-md text-sm font-bold">
                  ${item.annualFee}
                </Badge>
                
                <Badge 
                  className={cn(
                    "shadow-md flex items-center gap-1 px-3 py-2 rounded-md text-sm font-bold",
                    item.cardType === "credit" 
                      ? "bg-blue-600 text-white" 
                      : "bg-green-600 text-white"
                  )}
                >
                  {item.cardType === "credit" ? (
                    <CreditCard size={14} className="flex-shrink-0" />
                  ) : (
                    <Tag size={14} className="flex-shrink-0" />
                  )}
                  {item.cardType === "credit" ? "Credit" : "Debit"}
                </Badge>
              </div>
              
              {/* Top badges - consistent positioning */}
              <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
                {item.rating >= 4.8 && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md flex items-center gap-1 px-3 py-1">
                    <Star size={12} className="fill-white" /> Top Rated
                  </Badge>
                )}
                
                {isExclusive && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md flex items-center gap-1 px-3 py-1">
                    <Sparkles size={12} /> Exclusive
                  </Badge>
                )}
              </div>
              
              <Card
                {...item}
                isSelected={selectedIds.includes(item.id)}
                onSelect={onSelectItem}
              />
              
              {/* Offer badges - consistently positioned */}
              <div className="absolute left-0 right-0 bottom-20 flex flex-col items-center gap-2 px-4">
                {bestProductOffer && (
                  <div className="bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white text-xs font-medium py-1.5 px-3 rounded-full backdrop-blur-sm shadow-md flex items-center w-full max-w-[90%] mx-auto">
                    <Award size={12} className="mr-1.5 flex-shrink-0" /> 
                    <span className="truncate text-center w-full">{bestProductOffer.product}: {bestProductOffer.cashback} cashback</span>
                  </div>
                )}
                
                {bestOffer && (
                  <div className="bg-gradient-to-r from-brand-blue/90 to-brand-teal/90 text-white text-xs font-medium py-1.5 px-3 rounded-full backdrop-blur-sm shadow-md flex items-center w-full max-w-[90%] mx-auto">
                    <Gift size={12} className="mr-1.5 flex-shrink-0" /> 
                    <span className="truncate text-center w-full">{bestOffer}</span>
                  </div>
                )}
              </div>
              
              {/* View button - consistently positioned */}
              {onViewItem && (
                <div className="absolute right-3 bottom-3 z-10">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-white/90 hover:bg-white shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewItem(item.id);
                    }}
                  >
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                </div>
              )}
              
              {/* Selection highlight with improved animation */}
              {selectedIds.includes(item.id) && (
                <motion.div 
                  className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="border-2 border-brand-teal rounded-xl absolute inset-0"></div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default CardGrid;
