
import React, { useState, useEffect } from 'react';
import CardGrid from '@/components/CardGrid';
import ComparisonBar from '@/components/ComparisonBar';
import ComparisonView from '@/components/ComparisonView';
import { useToast } from "@/hooks/use-toast";
import { Search, CreditCard, Filter, ShoppingBag, X, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

// Define the card type as a union type to match CardItem expectations
type CardType = "credit" | "debit";

// Enhanced sample data for our cards with product offers
const CARD_DATA = [
  {
    id: '1',
    title: 'Premium Ultralight Card',
    image: 'https://images.unsplash.com/photo-1584277261846-c6a1672ed979?q=80&w=2070&auto=format&fit=crop',
    price: '$499',
    rating: 4.8,
    cardType: 'credit' as CardType,
    offers: ['5% Cashback on Travel', 'Free Airport Lounge Access', 'Premium Insurance Coverage'],
    features: [
      'Metal Construction',
      'No Foreign Transaction Fees',
      'Premium Travel Insurance',
      'Airport Lounge Access',
      'Concierge Service 24/7',
      'Advanced Fraud Protection'
    ],
    productOffers: [
      { product: 'iPhone', cashback: '3%', installments: '12 months 0% interest', exclusive: true },
      { product: 'MacBook', cashback: '5%', installments: '18 months 0% interest', exclusive: true },
      { product: 'Samsung TV', cashback: '2%', installments: '6 months 0% interest', exclusive: false }
    ]
  },
  {
    id: '2',
    title: 'Rewards Plus Card',
    image: 'https://images.unsplash.com/photo-1559320955-9fbd7f62a775?q=80&w=2069&auto=format&fit=crop',
    price: '$199',
    rating: 4.5,
    cardType: 'credit' as CardType,
    offers: ['2% Cashback on all Purchases', 'No Annual Fee First Year'],
    features: [
      'Plastic Construction',
      '2% Cashback on all Purchases',
      'Basic Travel Insurance',
      'No Annual Fee First Year',
      'Mobile Wallet Compatible',
      'Purchase Protection'
    ],
    productOffers: [
      { product: 'iPhone', cashback: '2%', installments: '6 months 0% interest', exclusive: false },
      { product: 'Samsung Galaxy', cashback: '4%', installments: '12 months 0% interest', exclusive: true },
      { product: 'iPad', cashback: '1%', installments: '3 months 0% interest', exclusive: false }
    ]
  },
  {
    id: '3',
    title: 'Business Elite Card',
    image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070&auto=format&fit=crop',
    price: '$399',
    rating: 4.6,
    cardType: 'credit' as CardType,
    offers: ['Business Expense Management', '3% back on Office Supplies'],
    features: [
      'Metal Construction',
      'Business Expense Management',
      'Premium Travel Insurance',
      'Priority Boarding',
      'Executive Lounge Access',
      'Expense Report Integration'
    ],
    productOffers: [
      { product: 'iPhone', cashback: '4%', installments: '24 months 0% interest', exclusive: true },
      { product: 'Office Supplies', cashback: '5%', installments: 'N/A', exclusive: false },
      { product: 'Business Software', cashback: '10%', installments: '12 months 0% interest', exclusive: true }
    ]
  },
  {
    id: '4',
    title: 'Student Starter Card',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
    price: '$0',
    rating: 4.0,
    cardType: 'debit' as CardType,
    offers: ['No Annual Fee', 'Student Discounts'],
    features: [
      'Plastic Construction',
      'No Annual Fee',
      'Cash Back on Educational Expenses',
      'Late Fee Forgiveness',
      'Credit Building Reports',
      'Student Discounts'
    ],
    productOffers: [
      { product: 'Laptops', cashback: '5%', installments: '6 months 0% interest', exclusive: true },
      { product: 'Textbooks', cashback: '10%', installments: 'N/A', exclusive: false },
      { product: 'iPad', cashback: '3%', installments: '3 months 0% interest', exclusive: false }
    ]
  },
  {
    id: '5',
    title: 'Travel Explorer Card',
    image: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2070&auto=format&fit=crop',
    price: '$299',
    rating: 4.7,
    cardType: 'credit' as CardType,
    offers: ['Miles for Every Purchase', 'Free Global Entry'],
    features: [
      'Metal-Plastic Hybrid',
      'No Foreign Transaction Fees',
      'Miles for Every Purchase',
      'Hotel Upgrades',
      'Global Entry Credit',
      'Trip Cancellation Insurance'
    ],
    productOffers: [
      { product: 'Travel Gear', cashback: '8%', installments: 'N/A', exclusive: true },
      { product: 'iPhone', cashback: '1%', installments: '12 months 0% interest', exclusive: false },
      { product: 'Luggage', cashback: '5%', installments: 'N/A', exclusive: false }
    ]
  },
  {
    id: '6',
    title: 'Cash Rewards Card',
    image: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=2071&auto=format&fit=crop',
    price: '$89',
    rating: 4.3,
    cardType: 'credit' as CardType,
    offers: ['3% on Dining and Entertainment', 'Introductory 0% APR'],
    features: [
      'Plastic Construction',
      '3% on Dining and Entertainment',
      'Basic Purchase Protection',
      'Introductory 0% APR',
      'Fraud Alerts',
      'Monthly Credit Score Updates'
    ],
    productOffers: [
      { product: 'Dining', cashback: '5%', installments: 'N/A', exclusive: false },
      { product: 'Entertainment', cashback: '3%', installments: 'N/A', exclusive: false },
      { product: 'iPhone', cashback: '1%', installments: '9 months 0% interest', exclusive: false }
    ]
  },
  {
    id: '7',
    title: 'Secured Builder Card',
    image: 'https://images.unsplash.com/photo-1559589689-577aabd1db4f?q=80&w=2070&auto=format&fit=crop',
    price: '$49',
    rating: 3.9,
    cardType: 'debit' as CardType,
    offers: ['No Credit History Required', 'Credit Building Focus'],
    features: [
      'Plastic Construction',
      'No Credit History Required',
      'Credit Building Focus',
      'Low Deposit Requirement',
      'Automatic Credit Line Reviews',
      'Financial Education Resources'
    ],
    productOffers: [
      { product: 'Household Essentials', cashback: '2%', installments: '3 months 0% interest', exclusive: false },
      { product: 'Groceries', cashback: '1.5%', installments: 'N/A', exclusive: false },
      { product: 'Smartphones', cashback: '1%', installments: '6 months 0% interest', exclusive: false }
    ]
  },
  {
    id: '8',
    title: 'Platinum Privileges Card',
    image: 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?q=80&w=2071&auto=format&fit=crop',
    price: '$599',
    rating: 4.9,
    cardType: 'credit' as CardType,
    offers: ['Exclusive Event Access', 'Personal Travel Consultant'],
    features: [
      'Metal Construction',
      'Luxury Hotel Collection',
      'Elite Status with Partners',
      'Global Airport Lounge Access',
      'Personal Travel Consultant',
      'Exclusive Event Access'
    ],
    productOffers: [
      { product: 'Luxury Goods', cashback: '10%', installments: '24 months 0% interest', exclusive: true },
      { product: 'iPhone', cashback: '5%', installments: '18 months 0% interest', exclusive: true },
      { product: 'Designer Fashion', cashback: '8%', installments: '12 months 0% interest', exclusive: true }
    ]
  }
];

const MAX_COMPARISON_ITEMS = 4;

const Index = () => {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cardTypeFilter, setCardTypeFilter] = useState<{credit: boolean, debit: boolean}>({
    credit: true,
    debit: true
  });
  const [showOffersOnly, setShowOffersOnly] = useState(false);
  const [isProductSearch, setIsProductSearch] = useState(false);
  
  // Search result states
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [viewingCardId, setViewingCardId] = useState<string | null>(null);
  
  // Filtered cards based on search and filters
  const filteredCards = CARD_DATA.filter(card => {
    // If search is not active, return all cards
    if (!isSearchActive && !searchTerm) return true;
    
    // If search is active, filter based on search term
    // Product search - check if any product in productOffers matches the search term
    const matchesProductSearch = isProductSearch && 
      card.productOffers?.some(offer => 
        offer.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Regular search in card title and features
    const matchesCardSearch = !isProductSearch && (
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // If product search is active, only use that filter
    const matchesSearch = isProductSearch ? matchesProductSearch : (matchesCardSearch || matchesProductSearch);
    
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
  
  // Toggle between product search and regular card search
  const handleSearchTypeToggle = (isProduct: boolean) => {
    setIsProductSearch(isProduct);
    if (searchTerm) {
      // Re-run search with new type
      setSearchTerm(searchTerm);
      setIsSearchActive(true);
    }
  };
  
  // Handle search submission
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearchActive(true);
      
      if (filteredCards.length === 0) {
        toast({
          title: "No results found",
          description: "Try a different search term or adjust your filters.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Search results",
          description: `Found ${filteredCards.length} cards matching "${searchTerm}".`
        });
      }
    } else {
      setIsSearchActive(false);
    }
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearchActive(false);
  };
  
  // View card details
  const handleViewCard = (id: string) => {
    setViewingCardId(id);
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
  
  // Get viewed card
  const viewedCard = CARD_DATA.find(card => card.id === viewingCardId);
  
  // Add animation to body when component mounts
  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  // Display product offers for a specific product if searched
  const getProductSearchResults = () => {
    if (!searchTerm || !isProductSearch || !isSearchActive) return null;
    
    const matchingCards = CARD_DATA.filter(card => 
      card.productOffers?.some(offer => 
        offer.product.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    if (matchingCards.length === 0) return null;
    
    return (
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ShoppingBag size={18} className="text-brand-blue" />
          Product Offers for "{searchTerm}"
        </h3>
        <div className="space-y-4">
          {matchingCards.map(card => {
            const matchingOffers = card.productOffers?.filter(offer => 
              offer.product.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            return (
              <div key={card.id} className="flex flex-col sm:flex-row gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{card.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">{card.cardType === 'credit' ? 'Credit Card' : 'Debit Card'}</p>
                  <div className="space-y-1">
                    {matchingOffers?.map((offer, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium text-brand-blue">{offer.product}: </span>
                        {offer.cashback && <span className="mr-2">{offer.cashback} cashback</span>}
                        {offer.installments !== 'N/A' && <span className="mr-2">{offer.installments}</span>}
                        {offer.exclusive && <span className="text-xs bg-brand-light-blue text-brand-blue px-1 py-0.5 rounded">Exclusive</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewCard(card.id)}
                    className="text-xs"
                  >
                    <Eye size={14} className="mr-1" /> View
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleToggleSelect(card.id)}
                    className={`text-xs ${
                      selectedIds.includes(card.id) 
                        ? 'bg-brand-blue text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedIds.includes(card.id) ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={isProductSearch ? "Search for products (e.g., iPhone, MacBook)..." : "Search for cards, features, or benefits..."}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Show real-time results if user has already activated search
                    if (isSearchActive && e.target.value === '') {
                      setIsSearchActive(false);
                    } else if (isSearchActive) {
                      // Maintain search active state for real-time results
                      setIsSearchActive(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="pl-10 pr-10 py-2 w-full rounded-lg border border-gray-200 focus:border-brand-blue transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                {searchTerm && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <Button 
                onClick={handleSearch}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white"
              >
                <Search size={16} className="mr-1" /> Search
              </Button>
              
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="h-10 w-10 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Filter size={18} />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSearchTypeToggle(false)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    !isProductSearch ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Search Cards
                </button>
                <button
                  onClick={() => handleSearchTypeToggle(true)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    isProductSearch ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Search Products
                </button>
              </div>
              <div className="text-xs text-gray-500">
                {isSearchActive 
                  ? `Showing ${filteredCards.length} of ${CARD_DATA.length} cards`
                  : searchTerm ? "Enter search to see results" : `Showing all ${CARD_DATA.length} cards`}
              </div>
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
                      {isSearchActive 
                        ? `Showing ${filteredCards.length} of ${CARD_DATA.length} cards`
                        : `Showing all ${CARD_DATA.length} cards`}
                    </div>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setCardTypeFilter({credit: true, debit: true});
                        setShowOffersOnly(false);
                        setIsProductSearch(false);
                        setIsSearchActive(false);
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
        {isSearchActive ? (
          <div className="mb-8 animate-fly-in">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold tracking-tight mb-3">
                Search Results for "{searchTerm}"
              </h2>
              <Button variant="outline" onClick={handleClearSearch}>
                <X size={14} className="mr-1" /> Clear Search
              </Button>
            </div>
            <p className="text-gray-600">
              Found {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'} matching your search.
            </p>
          </div>
        ) : (
          <div className="mb-8 animate-fly-in">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Find Your Perfect Card</h2>
            <p className="text-gray-600">Select multiple cards to compare features side by side.</p>
          </div>
        )}
        
        {/* Product search results */}
        {getProductSearchResults()}
        
        {filteredCards.length > 0 ? (
          <CardGrid
            items={filteredCards}
            selectedIds={selectedIds}
            onSelectItem={handleToggleSelect}
            onViewItem={handleViewCard}
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
      
      {/* Card Details Dialog */}
      <Dialog open={!!viewingCardId} onOpenChange={(open) => !open && setViewingCardId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewedCard && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center">
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                    <img 
                      src={viewedCard.image} 
                      alt={viewedCard.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {viewedCard.title}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center mt-2 space-x-3">
                    <span className="bg-brand-light-blue text-brand-blue text-xs px-2 py-1 rounded-full">
                      {viewedCard.cardType === 'credit' ? 'Credit Card' : 'Debit Card'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Annual fee: {viewedCard.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Rating: {viewedCard.rating}/5
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={viewedCard.image} 
                    alt={viewedCard.title} 
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      onClick={() => {
                        handleToggleSelect(viewedCard.id);
                        // If this is the first card selected, show a helpful toast
                        if (!selectedIds.includes(viewedCard.id) && selectedIds.length === 0) {
                          toast({
                            title: "Card selected for comparison",
                            description: "Select more cards to compare them side by side."
                          });
                        }
                      }}
                      className={selectedIds.includes(viewedCard.id) ? "bg-brand-blue" : ""}
                    >
                      {selectedIds.includes(viewedCard.id) ? 'Selected for Comparison' : 'Add to Comparison'}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <ul className="space-y-2">
                      {viewedCard.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-brand-light-blue flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-brand-blue text-xs font-bold">✓</span>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Special Offers</h3>
                    {viewedCard.offers && viewedCard.offers.length > 0 ? (
                      <ul className="space-y-2">
                        {viewedCard.offers.map((offer, idx) => (
                          <li key={idx} className="bg-gray-50 px-3 py-2 rounded-md text-gray-700">
                            {offer}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No special offers available for this card.</p>
                    )}
                  </div>
                  
                  {viewedCard.productOffers && viewedCard.productOffers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Product Offers</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Cashback</TableHead>
                            <TableHead>Installments</TableHead>
                            <TableHead>Exclusive</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewedCard.productOffers.map((offer, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="font-medium">{offer.product}</TableCell>
                              <TableCell>{offer.cashback}</TableCell>
                              <TableCell>{offer.installments}</TableCell>
                              <TableCell>
                                {offer.exclusive ? (
                                  <span className="text-xs bg-brand-light-blue text-brand-blue px-1 py-0.5 rounded">
                                    Exclusive
                                  </span>
                                ) : 'No'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
