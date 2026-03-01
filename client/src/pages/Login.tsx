import { useForm } from "react-hook-form";
import { loginSchema, type TLoginUser } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { api } from "../api/url";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<TLoginUser>({
        resolver: zodResolver(loginSchema)
    })

    const navigate = useNavigate()
    const {setAccessToken} = useAuth()
    
    async function loginOnSubmit(data: TLoginUser) {
        try {
            const res = await api.post('/auth/login', data)
            setAccessToken(res.data.accessToken)
            navigate("/about")
        } catch (err) {
            if (axios.isAxiosError(err)) {
                console.log(err.response?.status)
                console.log(err.response?.data)
            } else {
                console.error(err)
            }
        }
    }
    return (
        <form onSubmit={handleSubmit(loginOnSubmit)}>
            <h1 className='text-center'>LOGIN</h1>
            <div>
                <h2 className='py-3'>Email</h2>
                <input
                    {...register('email')}
                    type="text"
                    placeholder='Place your email...'
                    className='border px-3 py-2 rounded-full w-96'
                />
                {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                )}
            </div>
            <div>
                <h2 className='py-3'>Password</h2>
                <input
                    {...register('password')}
                    type="text"
                    placeholder='Place your password...'
                    className='border px-3 py-2 rounded-full w-96'
                />
                {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className='flex justify-between items-center mt-5'>
                <button
                    className='text-blue-400 underline cursor-pointer'
                    onClick={() => navigate('/register')}
                >
                    No account? Register
                </button>
                <button
                    className='bg-amber-400 disabled:bg-gray-300 px-3 py-1 rounded-full cursor-pointer'
                    type='submit'
                    disabled={isSubmitting}
                >
                    SUBMIT
                </button>
            </div>
        </form>
    )
}