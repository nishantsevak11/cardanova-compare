
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { PlusCircle, CheckCircle, X } from "lucide-react";

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

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden bg-white transition-all-300",
        isSelected ? "card-selected" : "card-shadow",
        isInComparisonView ? "w-full max-w-[280px] h-auto" : "w-full max-w-[350px] h-[420px]",
        isHovered && !isSelected && "transform scale-[1.02]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isInComparisonView && onRemove && (
        <button 
          onClick={handleRemove}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 backdrop-blur-sm opacity-70 hover:opacity-100 transition-opacity-300"
          aria-label="Remove from comparison"
        >
          <X size={18} className="text-gray-600" />
        </button>
      )}

      <div className="relative w-full h-[200px] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className={cn(
            "w-full h-full object-cover transition-transform-300",
            isHovered && "transform scale-[1.05]"
          )}
          loading="lazy"
        />
      </div>

      <div className={cn(
        "p-4",
        isInComparisonView ? "stagger-animation" : ""
      )}>
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{title}</h3>
        
        <div className="mb-3 flex justify-between items-center">
          <span className="text-brand-dark-blue font-semibold">{price}</span>
          <div className="flex items-center">
            <span className="mr-1 text-sm font-medium">{rating.toFixed(1)}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xs ${i < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
          </div>
        </div>

        {isInComparisonView ? (
          <ul className="space-y-2 mt-4 text-sm">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-brand-teal mt-1.5 mr-2"></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="line-clamp-1 flex items-start">
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
            <CheckCircle size={28} className="animate-scale-up" />
          ) : (
            <PlusCircle size={28} className={isHovered ? "scale-110 transition-transform-300" : ""} />
          )}
        </button>
      )}
    </div>
  );
};

export default Card;
