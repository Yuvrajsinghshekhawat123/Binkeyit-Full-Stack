import {  useState } from "react";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import { useForgotPassword } from "../03-features/auth/hook/useforgot-password";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../03-features/auth/hook/01-useSlice";


export function Forgotpassword(){
    const [processing, setProcessing] = useState(false);
     
    
    const [error,setError]=useState("");

    const [email,setEmail]=useState("");
    const {mutate}=useForgotPassword();
    const navigate=useNavigate();
    const dispatch = useDispatch();

    function handleSubmit(e){
        e.preventDefault();

        setProcessing(true);
        mutate({email},{
            onSuccess:(data)=>{
                toast.success(data.message);
                 dispatch(setUser({name:"",email }))
                navigate( "/verify-otp",{replace:true});
            },
            onError:(err)=>{
                  

                 setError(err.response?.data?.message || "Something went wrong")
            },
            onSettled: () => {
            setProcessing(false); // Stop processing after request completes
        }
        })




    }
    return(
        <>
        <section className="flex justify-center mt-15 px-2">
            <div className="flex flex-col gap-6 w-auto  sm:w-[50%]  lg:w-[45%] xl:w-[30%]  min-h-[40vh] shadow-2xl rounded-2xl py-4 font-normal">
                <div className="bg-blue-600 h-20 rounded-t-2xl flex justify-center items-center text-white text-xl font-bold">
                    Reset Your Password
                </div>


            <form className="flex flex-col gap-6 font-medium px-2 sm:px-6" onSubmit={handleSubmit}>
                        <div className="text-gray-700 text-center px-6 text-sm sm:text-sm md:text-md lg:text-lg">
                            Enter your email address and we'll send you an OTP to reset your password.
                        </div>

                            <div className="relative w-full text-sm sm:text-md lg:text-lg">
                                <label htmlFor='email'>Email Address :</label>
                                    <input
                                        type='email'
                                        id='email'
                                        className='bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none  focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out'
                                        name='email'
                                        value={email}
                                        onChange={(e)=>setEmail(e.target.value)}
                                        placeholder='Enter your email address'
                                        required
                                    />
                                    <MdEmail  className="inline absolute right-3 top-1/2  text-gray-400 text-2xl"/>
                            </div>




                        {
                            error.length !==0 && <div className="text-red-600 font-medium">{error}</div>
                        }

                            <div>
                                <button type="submit" className= "flex justify-center items-center gap-2 text-sm sm:text-sm md:text-md lg:text-lg bg-gray-600 hover:bg-gray-800  text-white w-full font-bold rounded-lg p-2 cursor-pointer disabled:opacity-50  disabled:cursor-not-allowed" disabled={email.length===0}>
                                    {processing ?<><ClipLoader className="" color="white" loading size={22}/>   <span>Sending OTP...</span>  </> : "Send OTP"} 
                                    
                                </button>
                            </div>

                            <h1 className=" text-gray-500 text-center font-normal text-xs sm:text-sm md:text-md lg:text-lg">Remember your password?  <Link to="/login"  ><span className="text-blue-700 font-bold  text-sm sm:text-sm md:text-md  lg:text-lg hover:underline hover:decoration-2 decoration-blue-700">Back to Login</span></Link></h1>       
                    </form>
                        {/* <div className="border-l-3 border-blue-600 bg-slate-200 text-gray-700 font-normal mx-6 p-4 rounded-lg space-y-4">
                                <h1 className="text-blue-800 font-bold text-center  text-xs sm:text-sm md:text-md lg:text-lg"><IoIosCheckmarkCircle className="inline text-2xl" /> Email Sent Successfully</h1>
                                <p className=" text-xs sm:text-sm md:text-md lg:text-lg">An OTP has been sent to <span className="font-bold text-black ">{email}</span>. Please check your inbox and follow the instructions to reset your password.</p>
                            </div> */}
                

            
            </div>

        </section>
        </>
    )
}