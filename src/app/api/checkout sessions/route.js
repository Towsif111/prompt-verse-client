import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { getStripe } from '../../../lib/stripe'

export async function POST() {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const session = await getStripe().checkout.sessions.create({
      line_items: [
        {
          price: 'price_1TmVvgFh6iLvTfirYlW5JyZq',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}