
import React, { useState, useEffect } from 'react';
import CardGrid from '@/components/CardGrid';
import ComparisonBar from '@/components/ComparisonBar';
import ComparisonView from '@/components/ComparisonView';
import { useToast } from "@/hooks/use-toast";
import { Search, CreditCard, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";

// Enhanced sample data for our cards
const CARD_DATA = [
  {
    id: '1',
    title: 'Premium Ultralight Card',
    image: 'https://images.unsplash.com/photo-1584277261846-c6a1672ed979?q=80&w=2070&auto=format&fit=crop',
    price: '$499',
    rating: 4.8,
    cardType: 'credit',
    offers: ['5% Cashback on Travel', 'Free Airport Lounge Access', 'Premium Insurance Coverage'],
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
    cardType: 'credit',
    offers: ['2% Cashback on all Purchases', 'No Annual Fee First Year'],
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
    cardType: 'credit',
    offers: ['Business Expense Management', '3% back on Office Supplies'],
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
    cardType: 'debit',
    offers: ['No Annual Fee', 'Student Discounts'],
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
    cardType: 'credit',
    offers: ['Miles for Every Purchase', 'Free Global Entry'],
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
    cardType: 'credit',
    offers: ['3% on Dining and Entertainment', 'Introductory 0% APR'],
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
    cardType: 'debit',
    offers: ['No Credit History Required', 'Credit Building Focus'],
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
    cardType: 'credit',
    offers: ['Exclusive Event Access', 'Personal Travel Consultant'],
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
  
  // New search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cardTypeFilter, setCardTypeFilter] = useState<{credit: boolean, debit: boolean}>({
    credit: true,
    debit: true
  });
  const [showOffersOnly, setShowOffersOnly] = useState(false);
  
  // Filtered cards based on search and filters
  const filteredCards = CARD_DATA.filter(card => {
    // Search term filter
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Card type filter
    const matchesCardType = 
      (card.cardType === 'credit' && cardTypeFilter.credit) ||
      (card.cardType === 'debit' && cardTypeFilter.debit);
    
    // Offers filter
    const matchesOffers = !showOffersOnly || (card.offers && card.offers.length > 0);
    
    return matchesSearch && matchesCardType && matchesOffers;
  });
  
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
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
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
          
          {/* Search and Filter Section */}
          <div className="w-full">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for cards, features, or benefits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-200 focus:border-brand-blue transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors"
              >
                <Filter size={18} />
              </button>
            </div>
            
            <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <CollapsibleContent>
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-white rounded-b-lg border-x border-b border-gray-200 mt-1 space-y-3"
                >
                  <div>
                    <h3 className="font-medium text-sm mb-2 flex items-center">
                      <CreditCard size={16} className="mr-2 text-brand-blue" />
                      Card Type
                    </h3>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-credit" 
                          checked={cardTypeFilter.credit}
                          onCheckedChange={(checked) => 
                            setCardTypeFilter(prev => ({...prev, credit: !!checked}))
                          }
                        />
                        <label htmlFor="filter-credit" className="text-sm cursor-pointer">Credit Cards</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-debit" 
                          checked={cardTypeFilter.debit}
                          onCheckedChange={(checked) => 
                            setCardTypeFilter(prev => ({...prev, debit: !!checked}))
                          }
                        />
                        <label htmlFor="filter-debit" className="text-sm cursor-pointer">Debit Cards</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="filter-offers" 
                      checked={showOffersOnly}
                      onCheckedChange={(checked) => setShowOffersOnly(!!checked)}
                    />
                    <label htmlFor="filter-offers" className="text-sm cursor-pointer">Show cards with special offers only</label>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-xs text-gray-500">
                      Showing {filteredCards.length} of {CARD_DATA.length} cards
                    </div>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setCardTypeFilter({credit: true, debit: true});
                        setShowOffersOnly(false);
                      }}
                      className="text-xs text-brand-blue hover:underline"
                    >
                      Reset Filters
                    </button>
                  </div>
                </motion.div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 pb-32 min-h-[calc(100vh-160px)]">
        <div className="mb-8 animate-fly-in">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Find Your Perfect Card</h2>
          <p className="text-gray-600">Select multiple cards to compare features side by side.</p>
        </div>
        
        {filteredCards.length > 0 ? (
          <CardGrid
            items={filteredCards}
            selectedIds={selectedIds}
            onSelectItem={handleToggleSelect}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No cards found</h3>
            <p className="text-gray-500 max-w-md">
              We couldn't find any cards matching your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        )}
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
