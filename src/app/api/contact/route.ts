import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  inquiryType: z.enum(['RETAIL', 'WHOLESALE_BULK', 'EXPORTS', 'CUSTOM_GIFTING']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid inquiry form data',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, inquiryType } = parseResult.data;
    console.log(`[CONTACT INQUIRY] Received from ${fullName} <${email}> [${inquiryType}]`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out to V S N CASHEWS. Our Rajahmundry estate desk will respond within 2 business hours.',
      referenceId: `VSN-INQ-${Date.now().toString(36).toUpperCase()}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
