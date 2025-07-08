import { config } from 'dotenv';
config();

import '@/ai/flows/express-question-paper-generation.ts';
import '@/ai/flows/solution-generation.ts';
import '@/ai/flows/refine-paper-flow.ts';
