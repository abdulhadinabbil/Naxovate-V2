import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const priceId = url.searchParams.get('priceId');
    const userId = url.searchParams.get('userId');

    if (!priceId || !userId) {
      throw new Error('Missing required parameters');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get product details based on priceId
    const amount = priceId.includes('yearly') ? 100 : 10;
    const imageLimit = priceId.includes('yearly') ? 1800 : 150;

    // Create bKash payment session
    const bkashResponse = await fetch('https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('BKASH_TOKEN')}`,
        'X-APP-Key': Deno.env.get('BKASH_APP_KEY') ?? '',
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: userId,
        callbackURL: `${req.headers.get('origin')}/subscription/success`,
        amount: amount.toString(),
        currency: 'USD',
        intent: 'sale',
        merchantInvoiceNumber: `INV-${Date.now()}`,
      }),
    });

    const bkashData = await bkashResponse.json();

    if (bkashData.paymentID) {
      // Update subscription in database
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan: 'premium',
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: priceId.includes('yearly')
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          image_limit: imageLimit,
        });

      if (subError) throw subError;

      return new Response(
        JSON.stringify({ 
          bkashURL: bkashData.bkashURL,
          paymentID: bkashData.paymentID 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      throw new Error('Failed to create bKash payment session');
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});