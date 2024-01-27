import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config';

const stripe  = new Stripe(STRIPE_SECRET_KEY || '');

export {
    stripe,
} 
