import { useEffect, useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { useResetPassword } from "../03-features/auth/hook/useforgot-password";
import { clearUser } from "../03-features/auth/hook/01-useSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export function ResetPassword(){
    const [formdata, setformData] = useState({
            password:"",
            confirmPassword: ""
    });

   const [passwordCriteria, setPasswordCriteria] = useState({
       hasUppercase: false,      
       hasLowercase: false,      
       hasNumber: false,         
       hasSpecialChar: false,   
       hasMinLength: false,      
    });
      
     const [fillWidth, setFillWidth] = useState(0); // use state for dynamic width


    const {mutate}=useResetPassword();
     const {name,email}=useSelector((state)=>state.user);
      
     const dispatch = useDispatch(); 
    const navigate=useNavigate();
    


    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error,setError]=useState("");
    const [processing, setProcessing] = useState(false);

    function handleChange(e){
        const {name,value}=e.target;
        setformData((prev)=>{
           const newData={...prev,[name]:value};
            return newData;
        })
        setError("");  // Clear error on input change

        if(name === "password"){
            setPasswordCriteria({
                hasMinLength:value.length>=8,
                hasLowercase:/[a-z]/.test(value),
                hasUppercase:/[A-Z]/.test(value),
                hasNumber: /\d/.test(value),
                hasSpecialChar: /[^A-Za-z0-9]/.test(value),

            })
        }

        
        


    }


    // Update fillWidth whenever passwordCriteria changes
    useEffect(()=>{
        const count = Object.values(passwordCriteria).filter(Boolean).length;
        setFillWidth((count/5)*100);
    },[passwordCriteria]);



    function handleSubmit(e){
        e.preventDefault();

         if(formdata.password !== formdata.confirmPassword){
            setError("Password not Match")
            return;
        }

        setProcessing(true);
        mutate({email,password:formdata.password},{
            onSuccess:(data)=>{
                toast.success(data.message);
                setformData({
                    password:"",
                    confirmPassword:""
                });
                dispatch(clearUser());
                 
                
                navigate("/login",{replace:true});

            },
             onError:(err)=>{
                 setError(err.response?.data?.message || "Something went wrong")
            },
            onSettled: () => {
                setProcessing(false); // Stop processing after request completes
            }
        })
    }

    return (
        <>

        
        <section className="flex justify-center mt-15 px-2">
            <div className="flex flex-col gap-6  w-auto  sm:w-[50%]  lg:w-[45%] xl:w-[30%] min-h-[40vh] shadow-2xl rounded-2xl py-4">
                <div className="bg-blue-600 h-20 rounded-t-2xl flex justify-center items-center text-white text-xl font-bold">
                    Reset Your Password
                </div>
                <form  className="flex flex-col gap-6 font-medium px-2 sm:px-6" onSubmit={handleSubmit}>

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
                        <button type="submit" className= "flex justify-center items-center gap-2 text-sm sm:text-sm md:text-md lg:text-lg bg-gray-600 hover:bg-gray-800  text-white w-full font-bold rounded-lg p-2 cursor-pointer disabled:opacity-50  disabled:cursor-not-allowed" disabled={formdata.password.length===0 || formdata.confirmPassword.length===0 || !passwordCriteria.hasLowercase || !passwordCriteria.hasUppercase || !passwordCriteria.hasMinLength  || !passwordCriteria.hasSpecialChar || !passwordCriteria.hasNumber}>
                            {processing ?  <><ClipLoader className="" color="white" loading size={22}/>  <span>Changing Password...</span> </> : "Reset Password"} 
                              
                        </button>
                    </div>
 

                </form>
            </div>
        </section>

        </>
    )
}