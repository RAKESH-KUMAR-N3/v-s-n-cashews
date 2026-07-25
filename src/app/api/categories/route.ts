import { NextResponse } from 'next/server';
import { INITIAL_CATEGORIES } from '@/data/categories';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: INITIAL_CATEGORIES.length,
    categories: INITIAL_CATEGORIES,
  });
}
