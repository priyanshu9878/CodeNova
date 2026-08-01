import { useState,useEffect } from "react"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../authSlice.js";
import { useNavigate, NavLink } from "react-router-dom";


const signUpSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(5, "Password is to weak"),
});

function Login() {

   const dispatch = useDispatch();
  const navigate = useNavigate();

  const {isAuthenticated,loading,error} = useSelector((state)=> state.auth);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signUpSchema) });

  useEffect(()=>{
      if(isAuthenticated){
        navigate('/')
      }
    },[isAuthenticated])


  const onSubmit = (data) => {
     dispatch(loginUser(data));

    // Backend data ko send kar dena chaiye?
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);


  return (
    <div className="min-h-screen  animate-float flex items-center justify-center p-4 bg-linear-to-br from-gray-900 via-slate-800 to-gray-900 animate-gradient-xy"> {/* Centering container */}
      <div className="card w-96 bg-base-100 shadow-xl border ring-2 ring-primary/20 border-base-content/40"> {/* Existing card styling */}
        <div className="card-body ">
          <h2 className="card-title justify-center text-3xl ">CodeNova</h2> {/* Centered title */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Existing form fields */}

            <div className="form-control  mt-4">
              <label className="label mb-1">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered ${errors.emailId && 'input-error'}`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error">{errors.emailId.message}</span>
              )}
            </div>

            <div className="form-control mt-4 relative">
      <label className="label mb-1">
        <span className="label-text">Password</span>
      </label>
      <input
        type={showPassword ? "text" : "password"} // Toggle type
        placeholder="••••••••"
        className={`input input-bordered pr-10 ${errors.password && 'input-error'}`}
        {...register('password')}
      />
      {/* Toggle Button */}
      <button
        type="button"
        className="absolute right-8 top-9"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      {errors.password && <span className="text-error">{errors.password.message}</span>}
    </div>


            <div className="form-control mt-6 flex justify-center">
              <button
                type="submit"
                className="btn btn-soft btn-success"
              >
                Login
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
  <span className="text-sm">
    New to CodeNova?{' '}
    <NavLink
      to="/signup"
      className="link link-primary"
    >
      Sign Up
    </NavLink>
  </span>
</div>


        </div>
      </div>
    </div>
  );
}


export default Login