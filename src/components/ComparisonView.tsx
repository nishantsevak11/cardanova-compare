
import React from 'react';
import { cn } from "@/lib/utils";
import Card, { CardProps } from './Card';
import { X, Plus } from "lucide-react";

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
  // Get all feature categories from all cards
  const allFeatures = items.flatMap(item => item.features);
  const uniqueFeatures = [...new Set(allFeatures)];

  // Find the best price (lowest)
  const prices = items.map(item => parseFloat(item.price.replace(/[^0-9.]/g, '')));
  const lowestPriceIndex = prices.indexOf(Math.min(...prices));
  
  // Find the best rating (highest)
  const ratings = items.map(item => item.rating);
  const highestRatingIndex = ratings.indexOf(Math.max(...ratings));

  return (
    <div className={cn(
      "fixed inset-0 bg-white z-50 overflow-hidden animate-fade-in",
      className
    )}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex justify-between items-center">
        <button
          onClick={onClose}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X size={18} className="mr-1" />
          <span>Back</span>
        </button>
        <h2 className="font-semibold">Comparison</h2>
        <div className="w-[60px]"></div> {/* Spacer for alignment */}
      </div>

      {/* Comparison Content */}
      <div className="p-4 h-[calc(100vh-60px)] overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Cards grid */}
          <div className="flex space-x-4 overflow-x-auto pb-4 snap-x">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={cn(
                  "snap-center shrink-0 transition-all duration-500",
                  "animate-fly-in",
                  index === 1 && "animation-delay-100",
                  index === 2 && "animation-delay-200",
                  index === 3 && "animation-delay-300",
                )}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
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
                    <div className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded flex items-center justify-center">
                      Best Price
                    </div>
                  )}
                  {index === highestRatingIndex && (
                    <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded flex items-center justify-center">
                      Highest Rated
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add more card */}
            <div className="snap-center shrink-0 w-[200px] h-[420px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center animate-fly-in" style={{ animationDelay: `${items.length * 0.1}s` }}>
              <button
                onClick={onAddMore}
                className="flex flex-col items-center text-gray-400 hover:text-brand-blue transition-colors p-4"
              >
                <Plus size={40} className="mb-2" />
                <span className="text-sm font-medium">Add More</span>
              </button>
            </div>
          </div>
          
          {/* Comparison Table */}
          <div className="mt-8 mb-16 overflow-x-auto stagger-animation">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Feature</th>
                  {items.map(item => (
                    <th key={item.id} className="py-3 px-4 text-left font-medium">{item.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price row */}
                <tr className="border-b">
                  <td className="py-3 px-4 text-left font-medium text-gray-500">Price</td>
                  {items.map((item, index) => (
                    <td 
                      key={item.id} 
                      className={cn(
                        "py-3 px-4",
                        index === lowestPriceIndex ? "font-semibold text-green-600" : ""
                      )}
                    >
                      {item.price}
                    </td>
                  ))}
                </tr>
                
                {/* Rating row */}
                <tr className="border-b">
                  <td className="py-3 px-4 text-left font-medium text-gray-500">Rating</td>
                  {items.map((item, index) => (
                    <td 
                      key={item.id} 
                      className={cn(
                        "py-3 px-4",
                        index === highestRatingIndex ? "font-semibold text-blue-600" : ""
                      )}
                    >
                      <div className="flex items-center">
                        <span className="mr-1">{item.rating.toFixed(1)}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.round(item.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Features rows */}
                {uniqueFeatures.map((feature, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 px-4 text-left font-medium text-gray-500">{feature}</td>
                    {items.map(item => (
                      <td key={item.id} className="py-3 px-4">
                        {item.features.includes(feature) ? (
                          <span className="text-brand-teal">✓</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
