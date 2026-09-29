import { z } from 'zod';

/**
 * Email — RFC 5322 simplifié, lowercase, trim.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('errors.emailInvalid');

/**
 * Password — règles strictes :
 *  - min 12 caractères
 *  - au moins une majuscule, une minuscule, un chiffre, un caractère spécial
 *
 * Les messages sont des clés i18n résolues côté composant via t(...).
 */
export const passwordSchema = z
  .string()
  .min(12, 'errors.passwordTooShort')
  .regex(/[A-Z]/, 'errors.passwordNeedsUppercase')
  .regex(/[a-z]/, 'errors.passwordNeedsLowercase')
  .regex(/[0-9]/, 'errors.passwordNeedsDigit')
  .regex(/[^A-Za-z0-9]/, 'errors.passwordNeedsSpecial');

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'errors.passwordRequired'),
});

export const signUpSchema = z
  .object({
    email: emailSchema,
    prenom: z
      .string()
      .trim()
      .min(2, 'errors.firstNameTooShort')
      .max(50, 'errors.firstNameTooLong'),
    password: passwordSchema,
    password_confirm: z.string(),
  })
  .refine((d) => d.password === d.password_confirm, {
    path: ['password_confirm'],
    message: 'errors.passwordMismatch',
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'errors.passwordRequired'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'errors.passwordMismatch',
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
