import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-portfolio-image.ts';
import '@/ai/flows/get-investment-recommendations.ts';
import '@/ai/flows/generate-portfolio-summary.ts';
import '@/ai/flows/identify-missing-sectors.ts';