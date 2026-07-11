import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  OPENAI_API_KEY: Joi.string().optional(),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
  CORS_ORIGINS: Joi.string().default('http://localhost:3000'),
});