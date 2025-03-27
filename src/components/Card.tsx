
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { PlusCircle, CheckCircle, X, CreditCard, Tag, Star, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export interface CardProps {
  id: string;
  title: string;
  image: string;
  price: string;
  rating: number;
  cardType?: 'credit' | 'debit';
  offers?: string[];
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
  cardType = 'credit',
  offers = [],
  features,
  isSelected,
  onSelect,
  onRemove,
  isInComparisonView = false,
  className
}: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
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

  const hasOffers = offers.length > 0;

  return (
    <>
      <motion.div 
        className={cn(
          "relative rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300",
          isSelected ? "ring-2 ring-brand-blue ring-offset-2" : "",
          isInComparisonView ? "w-full max-w-[280px] h-auto" : "w-full max-w-[350px] h-auto",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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

        <div className="relative w-full h-[170px] overflow-hidden group">
          <motion.img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Price tag */}
          <motion.div 
            className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full backdrop-blur-sm text-sm font-medium"
          >
            {price}
          </motion.div>
          
          {/* Card type badge */}
          <motion.div 
            className={cn(
              "absolute top-3 right-3 px-3 py-1 rounded-full backdrop-blur-sm text-xs font-medium flex items-center",
              cardType === 'credit' ? "bg-brand-blue/70 text-white" : "bg-brand-teal/70 text-white"
            )}
          >
            <CreditCard size={12} className="mr-1" />
            {cardType === 'credit' ? 'Credit' : 'Debit'}
          </motion.div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{title}</h3>
          
          <div className="mb-3 flex justify-between items-center">
            <div className="flex items-center">
              <span className="mr-1 text-sm font-medium">{rating.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-xs ${i < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-brand-blue"
              onClick={() => setShowDetails(true)}
            >
              <Info size={16} />
              <span className="sr-only">View Details</span>
            </Button>
          </div>

          {/* Special Offers Section */}
          {hasOffers && !isInComparisonView && (
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <Tag size={14} className="text-brand-teal mr-1" />
                <span className="text-xs font-semibold text-brand-teal">SPECIAL OFFERS</span>
              </div>
              <ul className="text-xs text-gray-600">
                {offers.slice(0, 1).map((offer, idx) => (
                  <li key={idx} className="flex items-center">
                    <Star size={12} className="text-yellow-500 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{offer}</span>
                  </li>
                ))}
                {offers.length > 1 && (
                  <li className="text-brand-blue text-xs mt-1 hover:underline cursor-pointer" onClick={() => setShowDetails(true)}>
                    +{offers.length - 1} more offers
                  </li>
                )}
              </ul>
            </div>
          )}

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
              {/* Display offers in comparison view */}
              {hasOffers && (
                <motion.div className="mb-4 p-2 bg-gradient-to-r from-brand-teal/10 to-brand-blue/10 rounded-lg">
                  <div className="font-medium text-sm mb-1 flex items-center">
                    <Tag size={14} className="text-brand-teal mr-1" />
                    <span>Special Offers</span>
                  </div>
                  <ul className="space-y-1">
                    {offers.map((offer, idx) => (
                      <motion.li 
                        key={idx} 
                        custom={idx}
                        variants={featureVariants}
                        className="text-xs flex items-start"
                      >
                        <Star size={10} className="text-yellow-500 mr-1 mt-1 flex-shrink-0" />
                        <span>{offer}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
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
                <li
                  key={index} 
                  className="line-clamp-1 flex items-start"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5 mr-2"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isInComparisonView && (
          <button
            aria-label={isSelected ? "Remove from comparison" : "Add to comparison"}
            onClick={handleToggleSelect}
            className={cn(
              "absolute bottom-4 right-4 transition-all-300 rounded-full",
              isSelected ? "bg-brand-teal text-white" : "bg-white text-brand-dark-blue border border-gray-200"
            )}
          >
            {isSelected ? (
              <CheckCircle size={28} />
            ) : (
              <PlusCircle size={28} />
            )}
          </button>
        )}
      </motion.div>

      {/* Card Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <span className="mr-2">{title}</span>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                cardType === 'credit' 
                  ? "bg-brand-blue/20 text-brand-blue" 
                  : "bg-brand-teal/20 text-brand-teal"
              )}>
                {cardType === 'credit' ? 'Credit Card' : 'Debit Card'}
              </span>
            </DialogTitle>
            <DialogDescription>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{price}</span>
                <div className="flex items-center">
                  <span className="mr-1">{rating.toFixed(1)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-xs ${i < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-2">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
              <img src={image} alt={title} className="object-cover w-full h-full" />
            </div>
            
            {/* Special Offers Section */}
            {hasOffers && (
              <div className="mb-6 border-b border-gray-100 pb-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Tag size={16} className="text-brand-teal mr-2" />
                  Special Offers
                </h4>
                <ul className="space-y-2">
                  {offers.map((offer, idx) => (
                    <li key={idx} className="flex items-start">
                      <Star size={14} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{offer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Features Section */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li 
                    key={index} 
                    className="flex items-start"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-brand-teal mt-1.5 mr-2"></span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
              <Button
                variant={isSelected ? "destructive" : "default"}
                onClick={(e) => {
                  handleToggleSelect(e);
                  if (!isSelected) setShowDetails(false);
                }}
              >
                {isSelected ? "Remove from comparison" : "Add to comparison"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Card;
