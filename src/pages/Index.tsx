
import React, { useState, useEffect } from 'react';
import CardGrid from '@/components/CardGrid';
import ComparisonBar from '@/components/ComparisonBar';
import ComparisonView from '@/components/ComparisonView';
import { useToast } from "@/hooks/use-toast";

// Sample data for our cards
const CARD_DATA = [
  {
    id: '1',
    title: 'Premium Ultralight Card',
    image: 'https://images.unsplash.com/photo-1584277261846-c6a1672ed979?q=80&w=2070&auto=format&fit=crop',
    price: '$499',
    rating: 4.8,
    features: [
      'Metal Construction',
      'No Foreign Transaction Fees',
      'Premium Travel Insurance',
      'Airport Lounge Access',
      'Concierge Service 24/7',
      'Advanced Fraud Protection'
    ]
  },
  {
    id: '2',
    title: 'Rewards Plus Card',
    image: 'https://images.unsplash.com/photo-1559320955-9fbd7f62a775?q=80&w=2069&auto=format&fit=crop',
    price: '$199',
    rating: 4.5,
    features: [
      'Plastic Construction',
      '2% Cashback on all Purchases',
      'Basic Travel Insurance',
      'No Annual Fee First Year',
      'Mobile Wallet Compatible',
      'Purchase Protection'
    ]
  },
  {
    id: '3',
    title: 'Business Elite Card',
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070&auto=format&fit=crop',
    price: '$399',
    rating: 4.6,
    features: [
      'Metal Construction',
      'Business Expense Management',
      'Premium Travel Insurance',
      'Priority Boarding',
      'Executive Lounge Access',
      'Expense Report Integration'
    ]
  },
  {
    id: '4',
    title: 'Student Starter Card',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    price: '$0',
    rating: 4.0,
    features: [
      'Plastic Construction',
      'No Annual Fee',
      'Cash Back on Educational Expenses',
      'Late Fee Forgiveness',
      'Credit Building Reports',
      'Student Discounts'
    ]
  },
  {
    id: '5',
    title: 'Travel Explorer Card',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2070&auto=format&fit=crop',
    price: '$299',
    rating: 4.7,
    features: [
      'Metal-Plastic Hybrid',
      'No Foreign Transaction Fees',
      'Miles for Every Purchase',
      'Hotel Upgrades',
      'Global Entry Credit',
      'Trip Cancellation Insurance'
    ]
  },
  {
    id: '6',
    title: 'Cash Rewards Card',
    image: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=2071&auto=format&fit=crop',
    price: '$89',
    rating: 4.3,
    features: [
      'Plastic Construction',
      '3% on Dining and Entertainment',
      'Basic Purchase Protection',
      'Introductory 0% APR',
      'Fraud Alerts',
      'Monthly Credit Score Updates'
    ]
  },
  {
    id: '7',
    title: 'Secured Builder Card',
    image: 'https://images.unsplash.com/photo-1559589689-577aabd1db4f?q=80&w=2070&auto=format&fit=crop',
    price: '$49',
    rating: 3.9,
    features: [
      'Plastic Construction',
      'No Credit History Required',
      'Credit Building Focus',
      'Low Deposit Requirement',
      'Automatic Credit Line Reviews',
      'Financial Education Resources'
    ]
  },
  {
    id: '8',
    title: 'Platinum Privileges Card',
    image: 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?q=80&w=2071&auto=format&fit=crop',
    price: '$599',
    rating: 4.9,
    features: [
      'Metal Construction',
      'Luxury Hotel Collection',
      'Elite Status with Partners',
      'Global Airport Lounge Access',
      'Personal Travel Consultant',
      'Exclusive Event Access'
    ]
  }
];

const MAX_COMPARISON_ITEMS = 4;

const Index = () => {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  
  // Handle card selection/deselection
  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      // Remove from selection
      setSelectedIds(prev => prev.filter(itemId => itemId !== id));
    } else {
      // Check if maximum items are already selected
      if (selectedIds.length >= MAX_COMPARISON_ITEMS) {
        toast({
          title: "Maximum cards selected",
          description: `You can compare up to ${MAX_COMPARISON_ITEMS} cards at once.`,
          variant: "destructive"
        });
        return;
      }
      
      // Add to selection with animation
      setSelectedIds(prev => [...prev, id]);
      
      // Show toast for first selection
      if (selectedIds.length === 0) {
        toast({
          title: "Card selected",
          description: "Select more cards to compare them side by side."
        });
      }
    }
  };
  
  // Start comparison mode
  const handleStartCompare = () => {
    if (selectedIds.length < 2) {
      toast({
        title: "Select at least 2 cards",
        description: "You need to select at least 2 cards to compare.",
        variant: "destructive"
      });
      return;
    }
    
    setIsComparing(true);
    
    // Scroll to top for comparison view
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Remove item from comparison
  const handleRemoveItem = (id: string) => {
    setSelectedIds(prev => prev.filter(itemId => itemId !== id));
    
    // If in comparison mode and less than 2 items remain, exit comparison mode
    if (isComparing && selectedIds.length <= 2) {
      setIsComparing(false);
    }
  };
  
  // Exit comparison mode
  const handleCloseComparison = () => {
    setIsComparing(false);
  };
  
  // Get selected card items
  const selectedItems = CARD_DATA.filter(item => selectedIds.includes(item.id));
  
  // Add animation to body when component mounts
  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="bg-white sticky top-0 z-10 shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Card<span className="text-brand-blue">Nova</span></h1>
            <p className="text-sm text-gray-500">Compare premium cards seamlessly</p>
          </div>
          <div className="flex space-x-1">
            <span className="text-xs px-2 py-1 bg-brand-light-blue text-brand-blue rounded-md">
              {CARD_DATA.length} Cards Available
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 pb-32 min-h-[calc(100vh-160px)]">
        <div className="mb-8 animate-fly-in">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Find Your Perfect Card</h2>
          <p className="text-gray-600">Select multiple cards to compare features side by side.</p>
        </div>
        
        <CardGrid
          items={CARD_DATA}
          selectedIds={selectedIds}
          onSelectItem={handleToggleSelect}
        />
      </main>
      
      {/* Comparison Elements */}
      <ComparisonBar
        selectedItems={selectedItems.map(item => ({
          id: item.id,
          title: item.title,
          image: item.image
        }))}
        maxItems={MAX_COMPARISON_ITEMS}
        onCompare={handleStartCompare}
        onRemove={handleRemoveItem}
      />
      
      {isComparing && (
        <ComparisonView
          items={selectedItems}
          onClose={handleCloseComparison}
          onRemoveItem={handleRemoveItem}
          onAddMore={handleCloseComparison}
        />
      )}
    </div>
  );
};

export default Index;
