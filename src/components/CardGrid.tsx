
import React from 'react';
import { cn } from "@/lib/utils";
import Card, { CardProps } from './Card';

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
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {items.map((item, index) => (
        <div 
          key={item.id}
          className="animate-fly-in"
          style={{ 
            animationDelay: `${index * 0.05}s`,
            opacity: 0  // Start opacity at 0 for animation
          }}
        >
          <Card
            {...item}
            isSelected={selectedIds.includes(item.id)}
            onSelect={onSelectItem}
          />
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
