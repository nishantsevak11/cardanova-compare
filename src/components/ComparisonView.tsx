
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import Card, { CardProps } from './Card';
import { X, Plus, ChevronLeft, ChevronRight, CreditCard, Tag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState<string>("overview");
  
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

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className={cn(
        "fixed inset-0 bg-white z-50 overflow-hidden",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex items-center text-sm font-medium"
        >
          <X size={18} className="mr-1" />
          <span>Back</span>
        </Button>
        <h2 className="font-semibold">Card Comparison</h2>
        <div className="w-[60px]"></div> {/* Spacer for alignment */}
      </div>

      {/* Comparison Content */}
      <div className="p-4 h-[calc(100vh-60px)] overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Cards Carousel */}
          <div className="mb-8">
            <Carousel 
              className="w-full" 
              opts={{
                align: "start",
                loop: items.length > 3
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
                          <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-teal-900 to-teal-800 text-teal-100 text-xs font-medium px-3 py-1.5 rounded-full border border-teal-700/50 shadow-lg">
                            <Sparkles className="h-3 w-3 text-teal-300" />
                            <span>Best Price</span>
                          </div>
                        )}
                        {index === highestRatingIndex && (
                          <div className="flex items-center justify-center gap-1 bg-gradient-to-r from-blue-900 to-blue-800 text-blue-100 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-700/50 shadow-lg">
                            <Sparkles className="h-3 w-3 text-blue-300" />
                            <span>Highest Rated</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
                
                {/* Add more card */}
                <CarouselItem className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 pl-4">
                  <div className="h-[420px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center">
                    <Button
                      variant="outline"
                      onClick={onAddMore}
                      className="flex flex-col items-center text-gray-500 h-auto py-6 px-8"
                    >
                      <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 mb-3">
                        <Plus size={30} />
                      </div>
                      <span className="text-sm font-medium">Add More</span>
                    </Button>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
          
          {/* Tabs for different comparison views */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-8 mb-16">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="offers">Special Offers</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Price Comparison */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Price Comparison</h3>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex justify-between items-center p-3 rounded-lg",
                          index === lowestPriceIndex ? "bg-teal-50 border border-teal-100" : "border border-gray-100"
                        )}
                      >
                        <span className="font-medium">{item.title}</span>
                        <span className={cn(
                          "font-semibold",
                          index === lowestPriceIndex ? "text-teal-600" : ""
                        )}>
                          {item.price}
                          {index === lowestPriceIndex && (
                            <span className="ml-2 text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                              Best Value
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Rating Comparison */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Rating Comparison</h3>
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex justify-between items-center p-3 rounded-lg",
                          index === highestRatingIndex ? "bg-blue-50 border border-blue-100" : "border border-gray-100"
                        )}
                      >
                        <span className="font-medium">{item.title}</span>
                        <div className={cn(
                          "flex items-center",
                          index === highestRatingIndex ? "text-blue-600" : ""
                        )}>
                          <span className="font-semibold mr-2">{item.rating.toFixed(1)}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-xs ${i < Math.round(item.rating) ? 
                                  (index === highestRatingIndex ? 'text-blue-500' : 'text-yellow-500') : 
                                  'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          {index === highestRatingIndex && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Highest
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Card Type Comparison */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Card Type</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex justify-between items-center p-3 border border-gray-100 rounded-lg"
                      >
                        <span className="font-medium">{item.title}</span>
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          item.cardType === 'credit' 
                            ? "bg-brand-blue/20 text-brand-blue" 
                            : "bg-brand-teal/20 text-brand-teal"
                        )}>
                          <CreditCard size={12} className="mr-1" />
                          {item.cardType === 'credit' ? 'Credit Card' : 'Debit Card'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Top Features Quick View */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Key Features Highlights</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="p-3 border border-gray-100 rounded-lg">
                        <h4 className="font-medium mb-2">{item.title}</h4>
                        <ul className="space-y-1">
                          {item.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-sm flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-teal mt-1.5 mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Special Offers Tab */}
            <TabsContent value="offers">
              {uniqueOffers.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <Tag size={18} className="mr-2 text-brand-teal" />
                    Special Offers Comparison
                  </h3>
                  <div className="space-y-6">
                    {uniqueOffers.map((offer, idx) => (
                      <div key={`offer-${idx}`} className="border-b border-gray-100 pb-4 last:border-0">
                        <h4 className="font-medium text-brand-teal mb-3">{offer}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {items.filter(item => (item.offers || []).includes(offer)).map(item => (
                            <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                              <div className="flex items-start">
                                <div className="w-10 h-10 rounded overflow-hidden mr-3">
                                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">{item.title}</h5>
                                  <p className="text-xs text-gray-500">{item.price}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No special offers available for these cards.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Features Tab */}
            <TabsContent value="features">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Features Comparison</h3>
                <div className="space-y-6">
                  {uniqueFeatures.map((feature, idx) => (
                    <div key={`feature-${idx}`} className="border-b border-gray-100 pb-4 last:border-0">
                      <h4 className="font-medium mb-3">{feature}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.filter(item => item.features.includes(feature)).map(item => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="flex items-start">
                              <div className="w-10 h-10 rounded overflow-hidden mr-3">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h5 className="font-medium text-sm">{item.title}</h5>
                                <p className="text-xs text-gray-500">{item.price}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Table View Tab */}
            <TabsContent value="table" className="overflow-x-auto">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <table className="w-full border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left font-medium text-gray-600 border-b">Feature</th>
                      {items.map(item => (
                        <th key={item.id} className="py-3 px-4 text-left font-medium text-gray-800 border-b">
                          {item.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Card Type row */}
                    <tr className="border-b">
                      <td className="py-3 px-4 text-left text-gray-600 flex items-center">
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
                    </tr>
                    
                    {/* Price row */}
                    <tr className="border-b">
                      <td className="py-3 px-4 text-left text-gray-600">Price</td>
                      {items.map((item, index) => (
                        <td 
                          key={item.id} 
                          className={cn(
                            "py-3 px-4",
                            index === lowestPriceIndex ? "font-semibold text-teal-600" : ""
                          )}
                        >
                          {item.price}
                          {index === lowestPriceIndex && (
                            <span className="ml-2 text-xs bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">Best</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    
                    {/* Rating row */}
                    <tr className="border-b">
                      <td className="py-3 px-4 text-left text-gray-600">Rating</td>
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
                                <span 
                                  key={i} 
                                  className={`text-xs ${i < Math.round(item.rating) ? 
                                    (index === highestRatingIndex ? 'text-blue-500' : 'text-yellow-500') : 
                                    'text-gray-300'}`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                    
                    {/* Special Offers Header */}
                    {uniqueOffers.length > 0 && (
                      <tr className="border-b bg-gray-50">
                        <td 
                          colSpan={items.length + 1} 
                          className="py-3 px-4 text-left font-semibold text-gray-800 flex items-center"
                        >
                          <Tag size={16} className="mr-2 text-brand-teal" />
                          Special Offers
                        </td>
                      </tr>
                    )}
                    
                    {/* Offers rows */}
                    {uniqueOffers.map((offer, idx) => (
                      <tr 
                        key={`offer-${idx}`} 
                        className="border-b"
                      >
                        <td className="py-3 px-4 text-left text-gray-600 pl-8">{offer}</td>
                        {items.map(item => (
                          <td key={item.id} className="py-3 px-4">
                            {(item.offers || []).includes(offer) ? (
                              <span className="text-green-500 inline-flex items-center justify-center">
                                ✓
                              </span>
                            ) : (
                              <span className="text-gray-400 inline-flex items-center justify-center">
                                —
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    
                    {/* Features Header */}
                    <tr className="border-b bg-gray-50">
                      <td 
                        colSpan={items.length + 1} 
                        className="py-3 px-4 text-left font-semibold text-gray-800"
                      >
                        Features
                      </td>
                    </tr>
                    
                    {/* Features rows */}
                    {uniqueFeatures.map((feature, idx) => (
                      <tr 
                        key={idx} 
                        className="border-b"
                      >
                        <td className="py-3 px-4 text-left text-gray-600 pl-8">{feature}</td>
                        {items.map(item => (
                          <td key={item.id} className="py-3 px-4">
                            {item.features.includes(feature) ? (
                              <span className="text-green-500 inline-flex items-center justify-center">
                                ✓
                              </span>
                            ) : (
                              <span className="text-gray-400 inline-flex items-center justify-center">
                                —
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default ComparisonView;
