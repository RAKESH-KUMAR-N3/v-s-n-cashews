import { Router, Request, Response } from 'express';
import { PRODUCTS_CATALOG } from '../../data/products';
import { INITIAL_CATEGORIES } from '../../data/categories';
import { Product, Category } from '../../types';
import { z } from 'zod';

const router = Router();

// In-Memory store initialized from static data
let activeProducts: Product[] = [...PRODUCTS_CATALOG];
let activeCategories: Category[] = [...INITIAL_CATEGORIES];

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  inquiryType: z.enum(['RETAIL', 'WHOLESALE_BULK', 'EXPORTS', 'CUSTOM_GIFTING']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

/**
 * GET /api/products
 * Query Params: category, grade, search, sort, page, limit
 */
router.get('/products', (req: Request, res: Response) => {
  let results = [...activeProducts];
  const { category, grade, search, sort, page, limit } = req.query;

  if (category && typeof category === 'string' && category !== 'All') {
    results = results.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (grade && typeof grade === 'string' && grade !== 'All') {
    results = results.filter(
      (p) => p.grade.toLowerCase() === grade.toLowerCase()
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.grade.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low-high') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high-low') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'stock') {
    results.sort((a, b) => b.stockQuantity - a.stockQuantity);
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 50;
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / limitNum) || 1;
  const paginatedResults = results.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    success: true,
    totalCount,
    totalPages,
    currentPage: pageNum,
    products: paginatedResults,
  });
});

/**
 * GET /api/products/:slug
 */
router.get('/products/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = activeProducts.find(
    (p) => p.slug === slug || p.id === slug
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }

  res.json({
    success: true,
    product,
  });
});

/**
 * POST /api/products (Admin Add Product)
 */
router.post('/products', (req: Request, res: Response) => {
  const productData: Product = req.body;

  if (!productData.name || !productData.price) {
    return res.status(400).json({
      success: false,
      error: 'Product name and price are required',
    });
  }

  const newProduct: Product = {
    ...productData,
    id: productData.id || `prod-${Date.now()}`,
  };

  activeProducts.unshift(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product added successfully',
    product: newProduct,
  });
});

/**
 * PUT /api/products/:id (Admin Edit Product)
 */
router.put('/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData: Partial<Product> = req.body;

  const index = activeProducts.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }

  activeProducts[index] = {
    ...activeProducts[index],
    ...updatedData,
  };

  res.json({
    success: true,
    message: 'Product updated successfully',
    product: activeProducts[index],
  });
});

/**
 * DELETE /api/products/:id (Admin Delete Product)
 */
router.delete('/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = activeProducts.length;
  activeProducts = activeProducts.filter((p) => p.id !== id);

  if (activeProducts.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
    });
  }

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

/**
 * GET /api/categories
 */
router.get('/categories', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: activeCategories.length,
    categories: activeCategories,
  });
});

/**
 * POST /api/categories (Admin Add Category)
 */
router.post('/categories', (req: Request, res: Response) => {
  const newCat: Category = req.body;
  if (!newCat.name) {
    return res.status(400).json({
      success: false,
      error: 'Category name is required',
    });
  }

  activeCategories.push({
    ...newCat,
    id: newCat.id || `cat-${Date.now()}`,
  });

  res.status(201).json({
    success: true,
    category: newCat,
  });
});

/**
 * POST /api/contact
 */
router.post('/contact', (req: Request, res: Response) => {
  const parseResult = contactSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid inquiry form data',
      details: parseResult.error.flatten().fieldErrors,
    });
  }

  const { fullName, email, inquiryType } = parseResult.data;

  console.log(`[CONTACT INQUIRY RECEIVED] From ${fullName} <${email}> [Type: ${inquiryType}]`);

  res.json({
    success: true,
    message: 'Thank you for reaching out to V S N CASHEWS. Our Rajahmundry estate desk will respond within 2 business hours.',
    referenceId: `VSN-INQ-${Date.now().toString(36).toUpperCase()}`,
  });
});

export const publicApiRoutes = router;
