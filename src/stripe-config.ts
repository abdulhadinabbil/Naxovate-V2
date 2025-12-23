export const STRIPE_PRODUCTS = {
  BASIC_PLAN: {
    id: 'prod_basic',
    priceId: 'price_1SgXyg01OkybJwhpktSn9PNB',
    name: 'NaxoVate Basic Plan',
    description: 'Access to 10 AI image generations',
    price: 2.00,
    mode: 'subscription' as const,
  },
  MONTHLY_PREMIUM: {
    id: 'prod_Se1xcyLbPbB3ir',
    priceId: 'price_1SgY7e01OkybJwhpWUbPfJDa',
    name: 'NaxoVate Monthly Subscription',
    description: 'Access to 60 AI image generations per month',
    price: 10.00,
    mode: 'subscription' as const,
  },
  YEARLY_PREMIUM: {
    id: 'prod_Se1yblMsKUZqvE',
    priceId: 'price_1SgY9201OkybJwhpBkurr1K7',
    name: 'NaxoVate Yearly Subscription',
    description: 'Access to 650 AI image generations per year',
    price: 100.00,
    mode: 'subscription' as const,
  },
} as const;

export type StripePlan = keyof typeof STRIPE_PRODUCTS;
export type StripeProduct = typeof STRIPE_PRODUCTS[StripePlan];