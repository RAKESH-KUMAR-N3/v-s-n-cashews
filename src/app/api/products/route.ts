import { NextResponse } from 'next/server';
import { PRODUCTS_CATALOG } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const grade = searchParams.get('grade');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');

  let results = [...PRODUCTS_CATALOG];

  if (category && category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (grade && grade !== 'All') {
    results = results.filter((p) => p.grade.toLowerCase() === grade.toLowerCase());
  }

  if (search) {
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
  }

  return NextResponse.json({
    success: true,
    totalCount: results.length,
    products: results,
  });
}
