import {z} from 'zod'

export const registerSchema = z.object({
  username: z.string().nonempty('Username is required').min(4, 'This name is invalid').regex(/^[A-Z]/, "Must start with uppercase"),
  email: z.email("Please put @").min(1, 'min of 1'),
  password: z.string().nonempty('Password is required').min(8, 'Password must contain 8 characters'),
  confirm_password: z.string().nonempty('Confirm Password is required').min(8, 'Password must contain 8 characters'),
}).refine((data) => data.password === data.confirm_password, {
  message:'Password didn\'t match',
  path: ['confirm_password']
});

export const loginSchema = z.object({
  email: z.email("Please put @").min(1, 'min of 1'),
  password: z.string().min(8, 'Password must contain 8 characters'),
})

export type TRegisterUser = z.infer<typeof registerSchema>;
export type TLoginUser = z.infer<typeof loginSchema>

export type FormType = 'login' | 'register';

export type User = {
  _id: string,
  username: string,
  email: string,
}

export type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean
}

export type AuthProviderProps = {
  children: React.ReactNode
}