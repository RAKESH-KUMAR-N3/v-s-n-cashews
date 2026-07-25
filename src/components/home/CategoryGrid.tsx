import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SquareCard } from '@/components/ui/SquareCard';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface CategoryItem {
  id: string;
  name: string;
  categoryFilter: string;
  grade: string;
  description: string;
  image: string;
  itemCount: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'w180',
    name: 'W-180 King Cashews',
    categoryFilter: 'King Grades',
    grade: 'The Emperor Grade',
    description: 'Largest, most luxurious whole cashew nuts in existence. Only 180 kernels per pound.',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=600',
    itemCount: '18 Products',
  },
  {
    id: 'w240',
    name: 'W-240 Jumbo Select',
    categoryFilter: 'King Grades',
    grade: 'The Royal Grade',
    description: 'Slightly smaller than W-180, boasting exquisite sweetness and golden roasting crunch.',
    image: 'https://images.unsplash.com/photo-1508061252966-f72b21706692?q=80&w=600',
    itemCount: '14 Products',
  },
  {
    id: 'roasted',
    name: 'Roasted & Salted',
    categoryFilter: 'Gourmet Flavors',
    grade: 'Gourmet Flavors',
    description: 'Slow-roasted in pure ghee with rock salt, peri-peri, and Tellicherry pepper infusions.',
    image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?q=80&w=600',
    itemCount: '12 Products',
  },
  {
    id: 'hampers',
    name: 'Royal Gift Hampers',
    categoryFilter: 'Gift Hampers',
    grade: 'Festive Box',
    description: 'Handcrafted luxury velvet boxes with gold foil cashews, almonds, pistachios, and dry fruits.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=600',
    itemCount: '8 Gift Collections',
  },
];

interface CategoryGridProps {
  onSelectCategory?: (category: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section id="categories" className="py-20 bg-[#0B132B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-[#D4AF37]/30 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Sovereign Classification
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F8F9FA] mt-1">
              Explore Mangalore Cashew Grades
            </h2>
          </div>
          <p className="text-xs text-gray-400 max-w-md">
            Each cashew nut is meticulously hand-sorted according to strict size, count, and color parameters before vacuum packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <SquareCard
              key={cat.id}
              glowOnHover
              onClick={() => onSelectCategory?.(cat.categoryFilter)}
              className="group cursor-pointer flex flex-col justify-between h-full bg-[#1C2541]/80"
            >
              <div>
                <div className="relative aspect-square mb-4 overflow-hidden border border-[#D4AF37]/30 bg-[#0B132B]">
                  <OptimizedImage
                    src={cat.image}
                    alt={cat.name}
                    className="group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 p-1.5 bg-[#0B132B] border border-[#D4AF37] text-[#D4AF37] z-10">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  {cat.grade}
                </span>
                <h3 className="text-lg font-serif font-bold text-[#F8F9FA] group-hover:text-[#F3E5AB] transition-colors mt-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-300 mt-2 line-clamp-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs font-medium text-gray-400">
                <span>{cat.itemCount}</span>
                <span className="text-[#D4AF37] group-hover:underline">Browse Category →</span>
              </div>
            </SquareCard>
          ))}
        </div>
      </div>
    </section>
  );
};
