# NaxoVate - AI-Powered Creative Platform

A comprehensive platform for innovation, creativity, and AI-powered content generation with social features, file management, and premium subscriptions.

## 🚀 Features

### 🔐 Authentication
- **Email/Password Authentication** with email verification
- **Google OAuth Integration** for seamless sign-in
- **Email Verification System** for account security
- **Admin Role Management** with special permissions

### 🤖 AI Image Generation
- **Premium Feature** - AI-powered image generation
- **Multiple Styles** - Realistic, 3D, Anime, Digital Art, etc.
- **Voice Prompts** - Generate images using voice commands
- **Usage Limits** - Monthly/yearly subscription limits

### 📁 File Management
- **Secure File Upload** - Documents, images, videos
- **File Organization** - Filter by type, search functionality
- **File Preview** - Built-in preview for images and videos
- **Storage Limits** - Based on subscription plan

### 🎨 Photo Editing
- **Built-in Editor** - Filters, adjustments, effects
- **Real-time Preview** - See changes instantly
- **Save & Share** - Export edited images

### 💳 Subscription Management
- **Stripe Integration** - Secure payment processing
- **Multiple Plans** - Monthly ($10) and Yearly ($100) options
- **Usage Tracking** - Monitor image generation and storage
- **Admin Controls** - Manual subscription management

### 👥 Social Features
- **User Profiles** - Customizable profiles with avatars
- **Friend System** - Send/accept friend requests
- **Stories** - Share temporary content
- **Posts & Comments** - Social interaction features
- **Messaging** - Direct messages between users

### 🛠 Admin Dashboard
- **User Management** - View and manage all users
- **Subscription Control** - Manually assign/modify plans
- **Support System** - Ticket management
- **Analytics** - Usage statistics and insights

### 🎫 Support System
- **Ticket Creation** - Users can create support tickets
- **Real-time Chat** - Live messaging within tickets
- **Priority Levels** - Low, Medium, High, Urgent
- **Admin Interface** - Manage and respond to tickets

## 🔧 Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Payments**: Stripe
- **AI**: ClipDrop API for image generation
- **Deployment**: Netlify
- **Icons**: Lucide React

## 📋 Setup Instructions

### 1. Supabase Configuration

#### CRITICAL: Enable Google OAuth Provider

**Step 1: Get Google OAuth Credentials**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Create a new project** or select existing one
3. **Enable Google+ API** (or Google Identity API):
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "Google Identity API"
   - Click "Enable"
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: **Web application**
   - Name: **NaxoVate**
5. **Add authorized redirect URIs** (VERY IMPORTANT):
   ```
   https://yylaucwhxyepxkvwgvds.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   https://naxovate.netlify.app/auth/callback
   ```
6. **Copy Client ID and Client Secret**

**Step 2: Configure in Supabase Dashboard**
1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. **Find Google provider** and click to configure
3. **Enable the Google provider** (toggle ON)
4. **Enter your credentials**:
   - **Client ID**: Paste from Google Console
   - **Client Secret**: Paste from Google Console
5. **Click "Save"**

**Step 3: Configure Authentication Settings**
1. Go to **Authentication** → **Settings**
2. **Site URL**: Set to your production domain
   - Production: `https://naxovate.netlify.app`
   - Development: `http://localhost:5173`
3. **Additional Redirect URLs** (add these):
   ```
   https://naxovate.netlify.app/**
   http://localhost:5173/**
   https://yylaucwhxyepxkvwgvds.supabase.co/auth/v1/callback
   ```

#### Enable Email Confirmation:
1. Go to **Supabase Dashboard → Authentication → Settings**
2. **Enable "Enable email confirmations"** ✅
3. **Disable "Enable phone confirmations"** (unless needed)
4. **Set URLs:**
   - **Site URL**: `https://naxovate.netlify.app` (or your domain)
   - **Redirect URLs**: Add these patterns:
     - `https://naxovate.netlify.app/**`
     - `http://localhost:5173/**`

#### Email Templates:
1. Go to **Authentication → Email Templates**
2. **Customize "Confirm signup" template**
3. **Set redirect URL**: `{{ .SiteURL }}/`

### 2. Environment Variables

Create a `.env` file with:

```env
# Supabase
VITE_SUPABASE_URL=https://yylaucwhxyepxkvwgvds.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bGF1Y3doeHllcHhrdndndmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjQwOTgsImV4cCI6MjA2Mzk0MDA5OH0.c0PLv3cN5ltON487nzjQwb339RUleqBlBL2Cd3KOpr4

# ClipDrop API
VITE_CLIPDROP_API_KEY=8b0c72727c796b8d5f863c9f5d6208bf33b9364f7a9763d5d74fdc83df5b1c32e2563f862d6cff763970af8d70106cf2

# Stripe
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 3. Troubleshooting Google OAuth

#### Common Issues and Solutions:

**1. "refused to connect" Error:**
- ✅ **Check Google OAuth is enabled** in Supabase Dashboard
- ✅ **Verify Client ID/Secret** are correctly entered
- ✅ **Confirm redirect URIs** match exactly (including https/http)
- ✅ **Enable Google+ API** in Google Cloud Console

**2. "Invalid redirect URI" Error:**
- ✅ **Add all redirect URIs** to Google Console:
  ```
  https://yylaucwhxyepxkvwgvds.supabase.co/auth/v1/callback
  http://localhost:5173/auth/callback
  https://naxovate.netlify.app/auth/callback
  ```

**3. "OAuth consent screen" Issues:**
- ✅ **Configure OAuth consent screen** in Google Console
- ✅ **Add test users** if in testing mode
- ✅ **Publish app** for production use

**4. Development vs Production:**
- **Development**: Use `http://localhost:5173` in redirect URIs
- **Production**: Use `https://naxovate.netlify.app` in redirect URIs
- **Always include**: `https://yylaucwhxyepxkvwgvds.supabase.co/auth/v1/callback`

### 4. Stripe Configuration

1. Create Stripe account and get API keys
2. Create products and prices in Stripe Dashboard:
   - **Monthly Premium**: $10/month
   - **Yearly Premium**: $100/year
3. Update `src/stripe-config.ts` with your price IDs
4. Set up webhooks for subscription events:
   - Endpoint: `https://yylaucwhxyepxkvwgvds.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, etc.

### 5. ClipDrop API

1. Sign up at [ClipDrop](https://clipdrop.co/apis)
2. Get your API key from the dashboard
3. Add to environment variables

## 🚀 Deployment

### Netlify Deployment:
1. **Connect your GitHub repository**
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Add environment variables** in Netlify dashboard
4. **Deploy!**

### Supabase Edge Functions:
The project includes several edge functions that are automatically deployed:
- `stripe-checkout` - Handle Stripe checkout sessions
- `stripe-webhook` - Process Stripe webhooks
- `social-share` - Social media sharing functionality
- `delete-user-account` - Handle account deletion

## 📱 User Experience

### Registration Flow:
1. **Email Registration**: User signs up → Receives verification email → Clicks link → Account activated
2. **Google OAuth**: User clicks Google button → Redirected to Google → Automatic account creation → Instant access

### Authentication Features:
- ✅ **Email verification required** for email signups
- ✅ **Google OAuth integration** for instant access
- ✅ **Resend verification emails** if needed
- ✅ **Beautiful success/error messages**
- ✅ **Responsive design** for all devices
- ✅ **Real-time authentication state** updates

### For Users:
- Create account with email verification or Google OAuth
- Generate AI images with various styles
- Upload and manage files securely
- Edit photos with built-in editor
- Subscribe to premium plans
- Create support tickets
- Social interactions (posts, comments, stories)

### For Admins:
- Full user management
- Subscription control
- Support ticket management
- Analytics and insights
- Feature flag management
- System administration

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **Email verification** required for new accounts
- **Secure file uploads** with type validation
- **Admin role protection** with special permissions
- **API key protection** for external services
- **Stripe webhook verification** for payment security

## 📊 Subscription Plans

### Free Plan:
- 20MB storage
- Basic file management
- Social features

### Premium Plan:
- **Monthly**: $10/month - 150 AI images, 100GB storage
- **Yearly**: $100/year - 1800 AI images, 100GB storage (Save 16.67%!)
- Priority support
- Advanced features

## 🛠 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Troubleshooting

### Google OAuth Issues:

**1. "refused to connect" Error:**
```bash
# Check these in order:
1. Supabase Dashboard → Authentication → Providers → Google (must be enabled)
2. Google Cloud Console → Credentials → OAuth 2.0 Client IDs (must exist)
3. Redirect URIs must include: https://yylaucwhxyepxkvwgvds.supabase.co/auth/v1/callback
4. Google+ API must be enabled in Google Cloud Console
```

**2. Development Setup:**
```bash
# For local development, ensure these redirect URIs:
http://localhost:5173/auth/callback
https://yylaucwhxyepxkvwgvds.supabase.co/auth/v1/callback
```

**3. Production Setup:**
```bash
# For production, ensure these redirect URIs:
https://naxovate.netlify.app/auth/callback
https://yylaucwhxyepxkvwgvds.supabase.co/auth/v1/callback
```

### Other Common Issues:

1. **Email verification not working:**
   - Check email confirmation is enabled in Supabase
   - Verify redirect URLs are set correctly
   - Check spam folder for verification emails

2. **Database errors:**
   - Ensure all migrations have been applied
   - Check RLS policies are correctly set
   - Verify admin user exists

3. **Stripe integration issues:**
   - Check webhook endpoints are correct
   - Verify price IDs match your Stripe products
   - Ensure webhook secret is set

## 📞 Support

Users can create support tickets through the application for:
- Technical issues
- Billing questions
- Feature requests
- General inquiries

Admins can manage tickets through the admin dashboard with real-time messaging.

## 🎯 Key Benefits

1. **Complete Solution** - All-in-one platform for creativity and productivity
2. **Scalable Architecture** - Built on modern, scalable technologies
3. **Secure & Reliable** - Enterprise-grade security and reliability
4. **User-Friendly** - Intuitive interface with responsive design
5. **Monetization Ready** - Built-in subscription and payment system
6. **Admin Control** - Comprehensive admin tools for management
7. **Social Integration** - Built-in social features for community building

## 🚀 Production Checklist

Before going live, ensure:

- [ ] **Supabase project is properly configured**
- [ ] **Google OAuth credentials are set up and enabled**
- [ ] **Google+ API is enabled in Google Cloud Console**
- [ ] **All redirect URIs are correctly configured**
- [ ] **Email confirmation is enabled**
- [ ] **Stripe products and webhooks are configured**
- [ ] **ClipDrop API key is valid**
- [ ] **Environment variables are set in production**
- [ ] **Domain is properly configured**
- [ ] **SSL certificates are active**
- [ ] **Admin user is created and has proper permissions**

## 🔍 Quick Verification Steps

To verify Google OAuth is working:

1. **Check Supabase Dashboard:**
   - Go to Authentication → Providers
   - Google should be **enabled** with green toggle
   - Client ID should be filled in

2. **Test the flow:**
   - Go to login page
   - Click "Continue with Google"
   - Should redirect to Google (not show "refused to connect")

3. **If still not working:**
   - Double-check Google Cloud Console settings
   - Verify all redirect URIs are exactly correct
   - Ensure Google+ API is enabled
   - Check browser console for specific error messages

This platform is production-ready and can be deployed immediately with proper configuration of the external services (Supabase, Stripe, ClipDrop, Google OAuth).

---

**Important Note:** The Google OAuth "refused to connect" error is typically caused by missing or incorrect configuration in either Google Cloud Console or Supabase Dashboard. Follow the setup instructions carefully, paying special attention to the redirect URIs which must match exactly.