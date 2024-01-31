import { Request, Response, NextFunction } from "express";
import { FormateData, FormateError } from "../utils";

const validateEmailFormat = (email: string): boolean => {
  try {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  } catch (error) {
    console.error(error);
    return false;
  }
};

const validatePasswordFormat = (password: string): boolean => {
  try {
    const minLength = 8;
    const hasWhitespace = /\s/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password);

    return (
      password.length >= minLength &&
      !hasWhitespace &&
      hasLowerCase &&
      hasUpperCase &&
      hasDigit &&
      hasSpecialChar
    );
  } catch (error) {
    console.error(error);
    return false;
  }
};

const validateNumberFormat = (number: string): boolean => {
  try {
    const numberRegex = /^[0-9]+$/;
    return numberRegex.test(number);
  } catch (error) {
    console.error(error);
    return false;
  }
};

const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const isValidEmail = validateEmailFormat(req.body.email);

  if (isValidEmail) {
    return next();
  }

  return res.status(401).json({ error: "Invalid Email" });
};

const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const isValidPassword = validatePasswordFormat(req.body.password);

  if (isValidPassword) {
    return next();
  }
  return res.status(401).json({ error: "Invalid Password" });
};

const validateNumber = (req: Request, res: Response, next: NextFunction) => {
  const isValidNumber = validateNumberFormat(req.body.phoneNo);

  if (isValidNumber) {
    return next();
  }
  return res.status(401).json({ error: "Invalid Number" });
};

export { validateEmail, validatePassword, validateNumber };
