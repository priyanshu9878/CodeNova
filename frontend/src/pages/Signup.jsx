import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../authSlice.js";
import { useNavigate, NavLink } from "react-router-dom";

const signUpSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(5, "Password is to weak"),
  re_password: z.string().min(5)
}).refine((data) => {
  // Only check if passwords match if BOTH meet the minimum length
  if (data.password.length >= 5 && data.re_password.length >= 5) {
    return data.password === data.re_password;
  }
  // If they don't meet the length, let the individual .min() errors handle it
  return true; 
}, {
  message: "Entered passwords do not match",
  path: ["re_password"],
});

function SignUp() {
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
   dispatch(registerUser(data));

    // Backend data ko send kar dena chaiye?
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);


  return (
   <div className="min-h-screen animate-float flex items-center justify-center p-4 bg-linear-to-br from-gray-900 via-slate-800 to-gray-900 animate-gradient-xy"> {/* Centering container */}
      <div className="card w-96 bg-base-100 shadow-xl border  ring-2 ring-primary/20 border-base-content/40"> {/* Existing card styling */}
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl ">CodeNova</h2> {/* Centered title */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Existing form fields */}
            <div className="form-control">
              <label className="label mb-1">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={`input input-bordered ${errors.firstName && 'input-error'}`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-error">{errors.firstName.message}</span>
              )}
            </div>

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

            <div className="form-control mt-4">
              <label className="label mb-1">
                <span className="label-text">Re-enter passsword</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered ${errors.password && 'input-error'}`}
                {...register('re_password')}
              />
              {errors.re_password && (
                <span className="text-error">{errors.re_password.message}</span>
              )}
            </div>

            <div className="form-control mt-6 flex justify-center">
              <button
                type="submit"
                className="btn btn-soft btn-success"
              >
                Sign Up
              </button>
            </div>
          </form>

           <div className="text-center mt-6">
  <span className="text-sm">
    Already have an account?{' '}
    <NavLink
      to="/login"
      className="link link-primary"
    >
      Login
    </NavLink>
  </span>
</div>

        </div>
      </div>
    </div>
  );
}






export default SignUp




// function SignUp(){

//     const [name,setName] = useState('');
//     const [email,setEmail] = useState('');
//     const [password,setPassword] = useState('');
//     const [repass,setRepass] = useState('');

//     const handleSubmit = (e)=>{
//         e.preventDefault();

//         console.log(name,email,password);
//         if(password!=repass) alert("entered password do not matches, please try again");

//         // data validation

//         // now submit form to backend using axios   
//     }

//     return(
//       <form onSubmit={handleSubmit} className=" flex flex-col items-center min-h-screen justify-center gap-y-5 ">
//         <input type="text" value={name} placeholder="Enter your firstname" onChange={(e) => setName(e.target.value)}/>
//         <input type="email" value={email} placeholder="Enter your E-mail" onChange={(e) => setEmail(e.target.value)}/>
//         <input  type="password"  value={password} placeholder="Enter your password"  onChange={(e) => setPassword(e.target.value)}/>
//         <input  type="password"  value={repass} placeholder="Enter password again"  onChange={(e) => setRepass(e.target.value)}/>

//         <button type="submit">Submit</button>
//       </form>
//     )
// }