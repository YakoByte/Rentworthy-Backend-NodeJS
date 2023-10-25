import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().error(new Error('Username is required and must be between 3 and 30 characters')),
  email: Joi.string().email().required().error(new Error('Email is required and must be a valid email address')),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/).min(6).required()
    .error(new Error('Password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 numeric and 1 special character')),

});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email().error(new Error('Email must be a valid email address')),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/).min(6)
    .error(new Error('Password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 numeric and 1 special character')),
});

export const loginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})


export function validateCreateAdmin(req: Request, res: Response, next: NextFunction) {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

export function validateUpdateUser(req: Request, res: Response, next: NextFunction) {
  const { error } = updateUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}
export function validateLoginUser(req: Request, res: Response, next: NextFunction) {
  const { error } = loginUser.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}
