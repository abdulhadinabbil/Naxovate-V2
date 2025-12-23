import { supabase } from '../lib/supabase';

export interface DreamStudioConfig {
  aspect_ratio: string;
  model?: string;
  output_format?: string;
  style_preset?: string;
  negative_prompt?: string;
  cfg_scale?: number;
  seed?: number;
  num_images?: number;
}

export interface DreamStudioResponse {
  image: string; // base64 encoded image
  seed: number;
  finish_reason: string;
}

// Supported aspect ratios for SD 3.5
export const AI_ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Square)', width: 1024, height: 1024 },
  { value: '16:9', label: '16:9 (Landscape)', width: 1344, height: 768 },
  { value: '9:16', label: '9:16 (Portrait)', width: 768, height: 1344 },
  { value: '21:9', label: '21:9 (Ultra Wide)', width: 1536, height: 640 },
  { value: '9:21', label: '9:21 (Ultra Tall)', width: 640, height: 1536 },
  { value: '2:3', label: '2:3 (Portrait)', width: 896, height: 1344 },
  { value: '3:2', label: '3:2 (Landscape)', width: 1344, height: 896 },
  { value: '4:5', label: '4:5 (Portrait)', width: 1024, height: 1280 },
  { value: '5:4', label: '5:4 (Landscape)', width: 1280, height: 1024 },
];

// SD 3.5 Models with credit costs
export const SD35_MODELS = [
  { value: 'sd3.5-large', label: 'SD 3.5 Large (Highest Quality)', credits: 6.5 },
  { value: 'sd3.5-large-turbo', label: 'SD 3.5 Large Turbo (Fast & High Quality)', credits: 4 },
  { value: 'sd3.5-medium', label: 'SD 3.5 Medium (Balanced)', credits: 3.5 },
  { value: 'sd3.5-flash', label: 'SD 3.5 Flash (Fastest)', credits: 2.5 },
];

// Style presets for SD 3.5
export const STYLE_PRESETS = [
  { value: '', label: 'None (Default)' },
  { value: '3d-model', label: '3D Model' },
  { value: 'analog-film', label: 'Analog Film' },
  { value: 'anime', label: 'Anime' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'comic-book', label: 'Comic Book' },
  { value: 'digital-art', label: 'Digital Art' },
  { value: 'enhance', label: 'Enhance' },
  { value: 'fantasy-art', label: 'Fantasy Art' },
  { value: 'isometric', label: 'Isometric' },
  { value: 'line-art', label: 'Line Art' },
  { value: 'low-poly', label: 'Low Poly' },
  { value: 'modeling-compound', label: 'Modeling Compound' },
  { value: 'neon-punk', label: 'Neon Punk' },
  { value: 'origami', label: 'Origami' },
  { value: 'photographic', label: 'Photographic' },
  { value: 'pixel-art', label: 'Pixel Art' },
  { value: 'tile-texture', label: 'Tile Texture' },
];

export class DreamStudioService {
  private apiKey: string;
  private apiHost: string = 'https://api.stability.ai';

  constructor() {
    this.apiKey = import.meta.env.VITE_STABILITY_API_KEY;
    if (!this.apiKey) {
      throw new Error('Stability AI API key is required');
    }
  }

  async generateImage(
    prompt: string,
    config: Partial<DreamStudioConfig> = {}
  ): Promise<string> {
    const defaultConfig = {
      aspect_ratio: config.aspect_ratio || '1:1',
      model: config.model || 'sd3.5-large-turbo',
      output_format: config.output_format || 'jpeg',
      cfg_scale: config.cfg_scale ?? 7.5,
      num_images: config.num_images || 1,
      style_preset: config.style_preset,
      negative_prompt: config.negative_prompt || 'blurry, low quality, distorted, ugly, bad anatomy',
      seed: config.seed,
    };

    try {
      console.log('Generating image with SD 3.5 Large Turbo:', { prompt, config: defaultConfig });

      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('aspect_ratio', defaultConfig.aspect_ratio);
      formData.append('output_format', defaultConfig.output_format);
      formData.append('cfg_scale', defaultConfig.cfg_scale.toString());
      formData.append('negative_prompt', defaultConfig.negative_prompt);

      if (defaultConfig.style_preset) {
        formData.append('style_preset', defaultConfig.style_preset);
      }

      const response = await fetch(`${this.apiHost}/v2beta/stable-image/generate/sd3`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'image/*',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Stability AI API Error:', response.status, errorText);
        throw new Error(`Failed to generate image. API returned ${response.status}: ${errorText}`);
      }

      const imageBlob = await response.blob();
      if (!imageBlob || imageBlob.size === 0) {
        throw new Error('No image data received from API');
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const styleLabel = defaultConfig.style_preset || 'default';
      const fileName = `naxovate-${styleLabel}-${timestamp}-${this.generateRandomId()}.${defaultConfig.output_format}`;

      console.log('Uploading to Supabase storage:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated_images')
        .upload(fileName, imageBlob, {
          contentType: `image/${defaultConfig.output_format}`,
          cacheControl: '31536000',
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('generated_images')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('Generated public URL:', publicUrl);

      return publicUrl;
    } catch (error: any) {
      console.error('SD 3.5 generation error:', error);
      throw new Error(error.message || 'Failed to generate image with SD 3.5 Large Turbo');
    }
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  getCreditsPerImage(model: string = 'sd3.5-large-turbo'): number {
    const modelConfig = SD35_MODELS.find(m => m.value === model);
    return modelConfig?.credits || 4;
  }

  isValidAspectRatio(aspectRatio: string): boolean {
    return AI_ASPECT_RATIOS.some(ratio => ratio.value === aspectRatio);
  }

  getDimensionsFromAspectRatio(aspectRatio: string): { width: number; height: number } {
    const ratio = AI_ASPECT_RATIOS.find(r => r.value === aspectRatio);
    return ratio ? { width: ratio.width, height: ratio.height } : { width: 1024, height: 1024 };
  }
}

export const dreamstudioService = new DreamStudioService();
