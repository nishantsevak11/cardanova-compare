
import React from 'react';
import { cn } from "@/lib/utils";
import { X, ArrowUp } from "lucide-react";

interface ComparisonBarProps {
  selectedItems: Array<{
    id: string;
    title: string;
    image: string;
  }>;
  maxItems: number;
  onCompare: () => void;
  onRemove: (id: string) => void;
  className?: string;
}

const ComparisonBar = ({
  selectedItems,
  maxItems,
  onCompare,
  onRemove,
  className
}: ComparisonBarProps) => {
  if (selectedItems.length === 0) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 p-4 glass-morphism z-50 animate-slide-up border-t",
        className
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium mr-3">
            {selectedItems.length}/{maxItems} selected
          </span>
          <div className="flex space-x-2">
            {selectedItems.map((item) => (
              <div key={item.id} className="relative animate-bounce-in">
                <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="absolute -top-2 -right-2 bg-white rounded-full shadow-sm p-0.5 border border-gray-200"
                  aria-label={`Remove ${item.title} from comparison`}
                >
                  <X size={12} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <button
          onClick={onCompare}
          disabled={selectedItems.length < 2}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all-300 flex items-center",
            selectedItems.length >= 2 
              ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:shadow-brand-blue/30 hover:bg-brand-dark-blue" 
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          )}
        >
          <span>Compare Now</span>
          <ArrowUp size={18} className="ml-2 transform rotate-45" />
        </button>
      </div>
    </div>
  );
};

export default ComparisonBar;
