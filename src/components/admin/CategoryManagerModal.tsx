import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Check, FolderPlus, Layers } from 'lucide-react';
import { Category } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { slugify } from '@/lib/slug';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = slugify(name);
    const fallbackImg = image.trim() || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=600';

    if (editingId) {
      const existing = categories.find((c) => c.id === editingId);
      if (existing) {
        onUpdateCategory({
          ...existing,
          name: name.trim(),
          slug,
          description: description.trim(),
          image: fallbackImg,
        });
      }
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        slug,
        description: description.trim(),
        image: fallbackImg,
        productCount: 0,
      };
      onAddCategory(newCat);
    }

    resetForm();
  };

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImage('');
  };

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0B132B] border border-[#D4AF37]/50 p-4 sm:p-6 text-[#F8F9FA] shadow-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-serif text-xl font-bold text-[#F3E5AB]">
              Manage Product Categories
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-[#D4AF37] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add/Edit Category Form */}
        <form onSubmit={handleSave} className="my-6 p-4 border border-[#D4AF37]/30 bg-[#1C2541]/50 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
            {editingId ? <Edit3 className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
            {editingId ? 'Edit Existing Category' : 'Add New Category'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                Category Name *
              </label>
              <SquareInput
                required
                placeholder="e.g. Organic Flavored Splits"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {name && (
                <span className="text-[10px] text-[#D4AF37] mt-1 block">
                  Slug: {slugify(name)}
                </span>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
                Header Image URL
              </label>
              <SquareInput
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">
              Description
            </label>
            <SquareInput
              placeholder="Brief description for category banner..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {editingId && (
              <SquareButton variant="outline" size="sm" type="button" onClick={resetForm}>
                Cancel
              </SquareButton>
            )}
            <SquareButton variant="gold" size="sm" type="submit">
              {editingId ? 'Update Category' : 'Create Category'}
            </SquareButton>
          </div>
        </form>

        {/* Categories List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            Active Catalog Categories ({categories.length})
          </h3>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-3 border border-[#D4AF37]/20 bg-[#1C2541]/30 hover:border-[#D4AF37]/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-10 h-10 object-cover border border-[#D4AF37]/40"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#F8F9FA]">{cat.name}</h4>
                    <p className="text-[10px] text-gray-400">
                      Slug: <code className="text-[#F3E5AB]">{cat.slug}</code> • {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="p-1.5 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-1.5 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#D4AF37]/30 flex justify-end">
          <SquareButton variant="outline" size="sm" onClick={onClose}>
            Close Category Manager
          </SquareButton>
        </div>
      </div>
    </div>
  );
};
