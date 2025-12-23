// supabase/functions/cancel-subscription/index.ts

import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import Stripe from 'npm:stripe'

serve(async (req) => {
  try {
    const { subscriptionId } = await req.json()

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: '2022-11-15',
    })

    const canceled = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return new Response(JSON.stringify({ canceled }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
