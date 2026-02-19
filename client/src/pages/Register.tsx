import { useForm } from "react-hook-form"
import { type TRegisterUser, registerSchema } from "../lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { api }from '../api/url'

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TRegisterUser>({
    resolver: zodResolver(registerSchema)
  })
  
  const navigate = useNavigate();

  async function registerOnSubmit(data: TRegisterUser) {
    // TODO: server
    //....
    // fetch('https://localhost:3000/api/register-user', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type':'application/json'
    //   },
    //   body: JSON.stringify(data)
    // })
    // .then(res => res.json())
    // .then(data => {
    //   localStorage.setItem('token', data.token)
    // })
    // .catch(err => {
    //   console.error(err)
    // })
    try {
      const res = await api.post('/register-user', data);
      localStorage.setItem('accessToken', res.data.accessToken)
      navigate('/about')

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
    <form onSubmit={handleSubmit(registerOnSubmit)}>
      <h1 className='text-center'>REGISTER</h1>
      <div>
        <h2 className='py-3'>Username</h2>
        <input
          {...register('username')}
          type="text"
          placeholder='Place your username...'
          className='border px-3 py-2 rounded-full w-96'
        />
        {errors.username && (
          <p className='text-red-500'>{errors.username.message}</p>
        )}
      </div>
      <div>
        <h2 className='py-3'>Email</h2>
        <input
          {...register('email')}
          type="text"
          placeholder='Place your email...'
          className='border px-3 py-2 rounded-full w-96'
        />
        {errors.email && (
          <p className='text-red-500'>{errors.email.message}</p>
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
          <p className='text-red-500'>{errors.password.message}</p>
        )}
      </div>
      <div>
        <h2 className='py-3'>Confirm Password</h2>
        <input
          {...register('confirm_password')}
          type="text"
          placeholder='Confirm Password...'
          className='border px-3 py-2 rounded-full w-96'
        />
        {errors.confirm_password && (
          <p className='text-red-500'>{errors.confirm_password.message}</p>
        )}
      </div>


      <div className='flex justify-between items-center mt-5'>
        <button
          type="button"
          className='text-blue-400 underline cursor-pointer'
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
        <button
          className='bg-amber-400 disabled:bg-gray-300 px-3 py-1 rounded-full'
          type='submit'
          disabled={isSubmitting || !watch('username') || !watch('email') || !watch('password') || !watch('confirm_password')}
        >
          SUBMIT
        </button>
      </div>
    </form>
  )
}