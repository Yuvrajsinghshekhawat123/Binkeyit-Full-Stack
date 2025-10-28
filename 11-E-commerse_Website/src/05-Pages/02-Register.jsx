import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";   // Material Design icon
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { FaCircleExclamation } from "react-icons/fa6";
import { registerSchema } from "../06-ZodValidation/registerSchema";
import { useRegister } from "../03-features/auth/hook/useRegister";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { setUser } from "../03-features/auth/hook/01-useSlice";
import { ClipLoader } from "react-spinners";
import { IoIosCheckmarkCircle } from "react-icons/io";
export function Register(){

     const [formdata, setformData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error,setError]=useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutate}=useRegister();
    const [processing, setProcessing] = useState(false);


    
  // New password criteria
   const [passwordCriteria, setPasswordCriteria] = useState({
       hasUppercase: false,      
       hasLowercase: false,      
       hasNumber: false,         
       hasSpecialChar: false,   
       hasMinLength: false,      
    });

    const [fillWidth, setFillWidth] = useState(0); // use state for dynamic width







    function handleChange(e){
        const {name,value}=e.target;
        setformData((prev)=>{
            return {...prev,[name]:value}
        })



        if(name === "password"){
            setPasswordCriteria({
                hasMinLength:value.length>=8,
                hasLowercase:/[a-z]/.test(value),
                hasUppercase:/[A-Z]/.test(value),
                hasNumber: /\d/.test(value),
                hasSpecialChar: /[^A-Za-z0-9]/.test(value),

            })  
        }


        setError("");  // Clear error on input change

         
    }



    // Update fillWidth whenever passwordCriteria changes
          useEffect(()=>{
              const count = Object.values(passwordCriteria).filter(Boolean).length;
              setFillWidth((count/5)*100);
          },[passwordCriteria]);

    function handleSubmit(e){
        e.preventDefault();

        // zod validation
        const parsed=registerSchema.safeParse(formdata);
        if(!parsed.success){
             // Option 1: show first error only
            setError(parsed.error.issues[0].message);
            return;
        }



         if(formdata.password !== formdata.confirmPassword){
            setError("Password not Match")
            return;
        }

         
       setProcessing(true); // Start processing when mutation starts
       mutate(formdata,{     
        
            onSuccess:(data)=>{
                toast.success(data.message)
                setformData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                })

                setPasswordCriteria({
                    hasUppercase: false,      
                    hasLowercase: false,      
                    hasNumber: false,         
                    hasSpecialChar: false,   
                    hasMinLength: false,      
                    });

                     setFillWidth(0);

                setShowPassword(false);
                setShowConfirmPassword(false)



                dispatch(setUser({name:formdata.name, email: formdata.email }))
                 // If registration is successful, redirect to verification page
                 navigate('/verify-email',{replace:true}); // Using { replace: true } ensures that the current page is removed from the navigation history, so clicking “back” won’t return to the previous sensitive page.
            },

            onError: (error) => {
                 
            setError(error.response?.data?.message || "Something went wrong"); // asios error
        },
        onSettled: () => {
            setProcessing(false); // Stop processing after request completes
        }
        /*
    {
        "response": {
            "data": {
                "message": "Invalid email or password"
            },
            "status": 400,
            "headers": { ... }
        }
    }


        */

        });
    }


     
    return (
    <>
        
        <section className="flex justify-center mt-15 px-2 mb-10">
            <div className="flex flex-col gap-6  w-auto  sm:w-[50%]  lg:w-[45%] xl:w-[30%] min-h-[70vh] shadow-2xl rounded-2xl py-4">
                <div className="bg-blue-600 h-20 rounded-t-2xl flex justify-center items-center text-white text-xl font-bold">
                    Create Your Account
                </div>

                <form  className="flex flex-col gap-6 font-medium px-2 sm:px-6" onSubmit={handleSubmit}>
                    <div className="relative w-full">
                        <label htmlFor='name'>Name :</label>
                        <input
                            type='text'
                            id='name'
                
                            className='bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out'
                            name='name'
                            value={formdata.name}
                            onChange={handleChange}
                            placeholder='Enter your name'
                            
                            required
                        />
                        <FaUserAlt className="inline absolute right-3 top-1/2 transform translate-y-1/4 text-gray-400"/>
                        
                    </div>
                    <div className="relative w-full">
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='text'
                            id='email'
                
                            className='bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none  focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out'
                            name='email'
                            value={formdata.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            required
                        />
                        <MdEmail  className="inline absolute right-3 top-1/4 transform translate-y-1/4 text-gray-400 text-lg"/>
                        

                        <div className="border-l-3 border-blue-600 bg-slate-200 text-gray-400 font-light my-2 p-2 rounded-lg">
                            <FaCircleExclamation className="inline text-blue-600"/> You will need to verify your email address to activate your account.
                        </div>
                    </div>

                    <div className="relative w-full">
                        <label htmlFor='password'>Password :</label>
                        <input
                            type={`${showPassword ? "text" : "password"}`}
                            id='password'
                
                            className='bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out'
                            name='password'
                            value={formdata.password}
                            onChange={handleChange}
                            placeholder='Enter your password'
                            required
                        />

                        <button type="button" className="cursor-pointer" onClick={()=>setShowPassword(!showPassword)}>
                            {
                                showPassword ?(<FaRegEye className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg"/>):(<FaEyeSlash className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg"/>)
                            }
                        </button>                     
                        
                    </div>

                    <div className="w-full bg-gray-300 rounded-xl h-2 -mt-4">
                                   <div className="h-2 bg-green-600 rounded-xl transition-all duration-300" style={{ width: `${fillWidth}%` }}></div>
                    </div>
                    
                     <div className="-mt-2 mb-4 text-gray-400 font-light text-[10px] md:text-xl" >
                                 {passwordCriteria.hasMinLength ? <h1 className="text-green-600"><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>At least 8 characters</h1> :<h1><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>At least 8 characters</h1>}
                                 {passwordCriteria.hasUppercase? <h1 className="text-green-600"><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>Contains uppercase letter</h1>: <h1><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>Contains uppercase letter</h1>}
                                 {passwordCriteria.hasLowercase ? <h1 className="text-green-600"><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>Contains lowercase letter</h1>:<h1><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>Contains lowercase letter</h1>}
                                 {passwordCriteria.hasNumber?<h1 className="text-green-600"><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>Contains number</h1>:<h1><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>Contains number</h1>}
                                 {passwordCriteria.hasSpecialChar?<h1 className="text-green-600"><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>Contains special character</h1>:<h1><IoIosCheckmarkCircle className="inline text-xs md:text-2xl"/>Contains special character</h1>}
                    </div>



                    <div className="relative w-full">
                        <label htmlFor='confirmPassword'>ConfirmPassword :</label>
                        <input
                            type={`${showConfirmPassword?"text":"password"}`}
                            id='confirmPassword'
                
                            className='bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out'
                            name='confirmPassword'
                            value={formdata.confirmPassword}
                            onChange={handleChange}
                            placeholder='Enter your confirmPassword'
                            required
                        />

                        
                        <button type="button" className="cursor-pointer" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
                            {
                                showConfirmPassword ?(<FaRegEye className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg"/>):(<FaEyeSlash className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg"/>)
                            }
                        </button>
                        
                         
                         
                        
                    </div>


                     






                    


                    {/* show all errror in this box if is there */}
                    {
                        error.length !==0 && <div className="text-red-600 font-medium">{error}</div>
                    }










                    <div>
                        <button type="submit" className= "flex justify-center items-center gap-2 text-sm sm:text-sm md:text-md lg:text-lg bg-gray-600 hover:bg-gray-800  text-white w-full font-bold rounded-lg p-2 cursor-pointer disabled:opacity-50  disabled:cursor-not-allowed" disabled={formdata.name.length===0 ||  formdata.email.length===0 || formdata.password.length===0 || formdata.confirmPassword.length===0 || !passwordCriteria.hasLowercase || !passwordCriteria.hasUppercase || !passwordCriteria.hasMinLength  || !passwordCriteria.hasSpecialChar || !passwordCriteria.hasNumber}>
                            {processing ?  <><ClipLoader className="" color="white" loading size={22}/>  <span>Registering...</span> </> : "Register"} 
                              
                        </button>
                    </div>
                    <h1 className=" text-gray-500 text-xs sm:text-sm md:text-md lg:text-lg  text-center font-normal">Already have account? <Link to="/login"  ><span className="text-sm sm:text-sm md:text-md  lg:text-lg text-blue-700 font-bold hover:underline hover:decoration-2 decoration-blue-700">Login</span></Link></h1>

                     
                
                </form>

            </div>
        </section>
        
    </>
    )
}