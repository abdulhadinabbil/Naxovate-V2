import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { platform, imageUrl, caption, accessToken } = await req.json();

    if (!platform || !imageUrl || !accessToken) {
      throw new Error('Missing required parameters');
    }

    let response;

    if (platform === 'instagram') {
      // Share to Instagram
      response = await shareToInstagram(imageUrl, caption, accessToken);
    } else if (platform === 'facebook') {
      // Share to Facebook
      response = await shareToFacebook(imageUrl, caption, accessToken);
    } else {
      throw new Error('Invalid platform');
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

async function shareToInstagram(imageUrl: string, caption: string, accessToken: string) {
  // Create Instagram container
  const containerResponse = await fetch(
    `https://graph.facebook.com/v16.0/me/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`,
    { method: 'POST' }
  );

  const containerData = await containerResponse.json();

  // Publish the container
  const publishResponse = await fetch(
    `https://graph.facebook.com/v16.0/me/media_publish?creation_id=${containerData.id}&access_token=${accessToken}`,
    { method: 'POST' }
  );

  return await publishResponse.json();
}

async function shareToFacebook(imageUrl: string, caption: string, accessToken: string) {
  const response = await fetch(
    `https://graph.facebook.com/v16.0/me/photos?url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${accessToken}`,
    { method: 'POST' }
  );

  return await response.json();
}