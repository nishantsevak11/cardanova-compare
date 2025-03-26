
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import Card, { CardProps } from './Card';
import { X, Plus, ChevronLeft, ChevronRight, Maximize2, Sparkles, CreditCard, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type ComparisonItem = Omit<CardProps, 'onSelect' | 'isSelected' | 'onRemove' | 'isInComparisonView'>;

interface ComparisonViewProps {
  items: ComparisonItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onAddMore: () => void;
  className?: string;
}

const ComparisonView = ({
  items,
  onClose,
  onRemoveItem,
  onAddMore,
  className
}: ComparisonViewProps) => {
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  
  // Get all feature categories from all cards
  const allFeatures = items.flatMap(item => item.features);
  const uniqueFeatures = [...new Set(allFeatures)];

  // Get all offer categories from all cards
  const allOffers = items.flatMap(item => item.offers || []);
  const uniqueOffers = [...new Set(allOffers)];

  // Find the best price (lowest)
  const prices = items.map(item => parseFloat(item.price.replace(/[^0-9.]/g, '')));
  const lowestPriceIndex = prices.indexOf(Math.min(...prices));
  
  // Find the best rating (highest)
  const ratings = items.map(item => item.rating);
  const highestRatingIndex = ratings.indexOf(Math.max(...ratings));

  // Toggle focus mode for a card
  const toggleFocusMode = (id: string) => {
    setFocusedCardId(focusedCardId === id ? null : id);
  };

  // Portal animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  return (
    <motion.div 
      className={cn(
        "fixed inset-0 bg-black/90 z-50 overflow-hidden",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <motion.div 
        className="sticky top-0 z-10 bg-black/50 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          onClick={onClose}
          className="flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={18} className="mr-1" />
          <span>Back</span>
        </motion.button>
        <motion.h2 
          className="font-semibold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Comparison
        </motion.h2>
        <div className="w-[60px]"></div> {/* Spacer for alignment */}
      </motion.div>

      {/* Focus Mode Overlay */}
      <AnimatePresence>
        {focusedCardId && (
          <motion.div 
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFocusedCardId(null)}
          >
            <motion.div 
              className="relative max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card
                {...items.find(item => item.id === focusedCardId)!}
                isSelected={true}
                onSelect={() => {}}
                isInComparisonView={true}
              />
              
              <motion.button
                className="absolute -top-4 -right-4 p-2 rounded-full bg-black/70 text-white border border-white/20"
                onClick={() => setFocusedCardId(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Content */}
      <div className="p-4 h-[calc(100vh-60px)] overflow-auto perspective">
        <div className="max-w-6xl mx-auto">
          {/* Cards grid - Now using Carousel */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Carousel 
              className="w-full" 
              opts={{
                align: "start",
                loop: true
              }}
            >
              <CarouselContent className="px-2">
                {items.map((item, index) => (
                  <CarouselItem key={item.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 pl-4">
                    <div className="relative">
                      <Card
                        {...item}
                        isSelected={true}
                        onSelect={() => {}}
                        onRemove={onRemoveItem}
                        isInComparisonView={true}
                      />
                      
                      {/* Indicators for best values */}
                      <div className="mt-2 space-y-2">
                        {index === lowestPriceIndex && (
                          <motion.div 
                            className="flex items-center justify-center gap-1 bg-gradient-to-r from-teal-900 to-teal-800 text-teal-100 text-xs font-medium px-3 py-1.5 rounded-full border border-teal-700/50 shadow-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <Sparkles className="h-3 w-3 text-teal-300" />
                            <span>Best Price</span>
                          </motion.div>
                        )}
                        {index === highestRatingIndex && (
                          <motion.div 
                            className="flex items-center justify-center gap-1 bg-gradient-to-r from-blue-900 to-blue-800 text-blue-100 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-700/50 shadow-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <Sparkles className="h-3 w-3 text-blue-300" />
                            <span>Highest Rated</span>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Focus button */}
                      <motion.button
                        onClick={() => toggleFocusMode(item.id)}
                        className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 text-white/70 hover:text-white backdrop-blur-sm border border-white/10"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Maximize2 size={14} />
                      </motion.button>
                    </div>
                  </CarouselItem>
                ))}
                
                {/* Add more card */}
                <CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 pl-4">
                  <div className="h-[420px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center">
                    <motion.button
                      onClick={onAddMore}
                      className="flex flex-col items-center text-gray-400 hover:text-brand-teal transition-colors p-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-16 h-16 flex items-center justify-center rounded-full border border-white/10 bg-white/5 mb-3">
                        <Plus size={30} />
                      </div>
                      <span className="text-sm font-medium">Add More</span>
                    </motion.button>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-black/50 border-white/10 text-white hover:bg-white/10 hover:text-white" />
              <CarouselNext className="right-2 bg-black/50 border-white/10 text-white hover:bg-white/10 hover:text-white" />
            </Carousel>
          </motion.div>
          
          {/* Comparison Table */}
          <motion.div 
            className="mt-8 mb-16 overflow-x-auto stagger-animation pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-left font-medium text-gray-400">Feature</th>
                  {items.map(item => (
                    <th key={item.id} className="py-3 px-4 text-left font-medium text-white">{item.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Card Type row */}
                <motion.tr 
                  className="border-b border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <td className="py-3 px-4 text-left font-medium text-gray-400 flex items-center">
                    <CreditCard size={16} className="mr-2 text-gray-500" />
                    Card Type
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="py-3 px-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        item.cardType === 'credit' 
                          ? "bg-brand-blue/20 text-brand-blue" 
                          : "bg-brand-teal/20 text-brand-teal"
                      )}>
                        {item.cardType === 'credit' ? 'Credit Card' : 'Debit Card'}
                      </span>
                    </td>
                  ))}
                </motion.tr>
                
                {/* Price row */}
                <motion.tr 
                  className="border-b border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <td className="py-3 px-4 text-left font-medium text-gray-400">Price</td>
                  {items.map((item, index) => (
                    <td 
                      key={item.id} 
                      className={cn(
                        "py-3 px-4",
                        index === lowestPriceIndex ? "font-semibold text-teal-300" : "text-white"
                      )}
                    >
                      {index === lowestPriceIndex && (
                        <div className="relative">
                          <span>{item.price}</span>
                          <div className="absolute -inset-1 bg-teal-500/10 rounded-md -z-10 blur-sm"></div>
                        </div>
                      )}
                      {index !== lowestPriceIndex && item.price}
                    </td>
                  ))}
                </motion.tr>
                
                {/* Rating row */}
                <motion.tr 
                  className="border-b border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <td className="py-3 px-4 text-left font-medium text-gray-400">Rating</td>
                  {items.map((item, index) => (
                    <td 
                      key={item.id} 
                      className={cn(
                        "py-3 px-4",
                        index === highestRatingIndex ? "font-semibold text-blue-300" : "text-white"
                      )}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">{item.rating.toFixed(1)}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`text-xs ${i < Math.round(item.rating) ? 
                                (index === highestRatingIndex ? 'text-blue-300' : 'text-yellow-500') : 
                                'text-gray-700'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        
                        {index === highestRatingIndex && (
                          <div className="absolute inset-0 bg-blue-500/10 rounded-md -z-10 blur-sm"></div>
                        )}
                      </div>
                    </td>
                  ))}
                </motion.tr>
                
                {/* Special Offers Header */}
                {uniqueOffers.length > 0 && (
                  <motion.tr 
                    className="border-b border-white/10 bg-gradient-to-r from-brand-teal/5 to-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                  >
                    <td 
                      colSpan={items.length + 1} 
                      className="py-3 px-4 text-left font-semibold text-white flex items-center"
                    >
                      <Tag size={16} className="mr-2 text-brand-teal" />
                      Special Offers
                    </td>
                  </motion.tr>
                )}
                
                {/* Offers rows */}
                {uniqueOffers.map((offer, idx) => (
                  <motion.tr 
                    key={`offer-${idx}`} 
                    className="border-b border-white/10 bg-gradient-to-r from-brand-teal/5 to-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + (idx * 0.05) }}
                  >
                    <td className="py-3 px-4 text-left font-medium text-gray-400 pl-8">{offer}</td>
                    {items.map(item => (
                      <td key={item.id} className="py-3 px-4 text-white">
                        {(item.offers || []).includes(offer) ? (
                          <motion.span 
                            className="text-brand-teal inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-teal/10"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.9 + (idx * 0.03), type: "spring" }}
                          >
                            ✓
                          </motion.span>
                        ) : (
                          <motion.span 
                            className="text-gray-600 inline-flex items-center justify-center w-6 h-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.9 + (idx * 0.03) }}
                          >
                            —
                          </motion.span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
                
                {/* Features Header */}
                <motion.tr 
                  className="border-b border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <td 
                    colSpan={items.length + 1} 
                    className="py-3 px-4 text-left font-semibold text-white"
                  >
                    Features
                  </td>
                </motion.tr>
                
                {/* Features rows */}
                {uniqueFeatures.map((feature, idx) => (
                  <motion.tr 
                    key={idx} 
                    className="border-b border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + (idx * 0.05) }}
                  >
                    <td className="py-3 px-4 text-left font-medium text-gray-400 pl-8">{feature}</td>
                    {items.map(item => (
                      <td key={item.id} className="py-3 px-4 text-white">
                        {item.features.includes(feature) ? (
                          <motion.span 
                            className="text-brand-teal inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-teal/10"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.1 + (idx * 0.03), type: "spring" }}
                          >
                            ✓
                          </motion.span>
                        ) : (
                          <motion.span 
                            className="text-gray-600 inline-flex items-center justify-center w-6 h-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.1 + (idx * 0.03) }}
                          >
                            —
                          </motion.span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonView;
