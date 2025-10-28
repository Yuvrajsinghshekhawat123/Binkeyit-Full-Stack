import { useEffect, useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ChangePasswordSchema } from "../../../../06-ZodValidation/changePassword.Schema";
import { useChangepassword } from "../../hook/useChangepassword";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { IoIosCheckmarkCircle } from "react-icons/io";

export function ChangePassword() {
  const userDetail = useSelector((state) => state.userDetail);
  const [formdata, setformData] = useState({
    currentPassword: "",
    Newpassword: "",
    NewconfirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    Newpassword: false,
    NewconfirmPassword: false,
  });


  // New password criteria
   const [passwordCriteria, setPasswordCriteria] = useState({
       hasUppercase: false,      
       hasLowercase: false,      
       hasNumber: false,         
       hasSpecialChar: false,   
       hasMinLength: false,      
    });

    const [fillWidth, setFillWidth] = useState(0); // use state for dynamic width


  // change password
  const {mutate:changePassword}=useChangepassword();

  const [error,setError]=useState("");
  const [processing, setProcessing] = useState(false);


  function handleChange(e){
    const {name,value}=e.target;
    setformData((prev)=>{
        const newData={...prev,[name]:value};
        return newData;
    });


     if(name === "Newpassword"){
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

    const parsed=ChangePasswordSchema.safeParse(formdata);
    if(!parsed.success){
      setError(parsed.error.issues[0].message)
      return;
    }

    if(formdata.Newpassword !== formdata.NewconfirmPassword){
      setError("Password not Match");
      return
    }

    setProcessing(true);
    changePassword({currentPassword: formdata.currentPassword,NewPassword:formdata.Newpassword},{
      onSuccess:(data)=>{
        toast.success(data.message);
            setformData({
              currentPassword: "",
              Newpassword: "",
              NewconfirmPassword: "",
            })

            setPasswordCriteria({
              hasUppercase: false,      
              hasLowercase: false,      
              hasNumber: false,         
              hasSpecialChar: false,   
              hasMinLength: false,      
            });

            setShowPassword({
              currentPassword: false,
              Newpassword: false,
              NewconfirmPassword: false,
            });

            setFillWidth(0);



      },
      onError:(err)=>{
            setError(err.response?.data?.message || "Something went wrong");
      },
      onSettled: () => {
          setProcessing(false); // Stop processing after request completes
      }
    })



  }



  return (
    <>
      <form className="flex flex-col gap-6 font-medium px-2" onSubmit={handleSubmit}>
         

        <div className="relative w-full text-sm md:text-xl ">
          <label htmlFor="password">Current Password :</label>
          <input
            type={`${showPassword.currentPassword ? "text" : "password"}`}
            id="currentPassword"
            className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-xs sm:placeholder:text-sm "
            name="currentPassword"
            value={formdata.currentPassword}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setShowPassword((prev)=>({
                ...prev,
                currentPassword:!prev.currentPassword,
                }))}
          >
            {showPassword.currentPassword ? (
              <FaRegEye className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg hover:text-gray-600" />
            ) : (
              <FaEyeSlash className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg hover:text-gray-600" />
            )}
          </button>
        </div>
        <div className="relative w-full text-sm md:text-xl ">
          <label htmlFor="password">New Password :</label>
          <input
            type={`${showPassword.Newpassword ? "text" : "password"}`}
            id="Newpassword"
            className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-xs sm:placeholder:text-sm "
            name="Newpassword"
            value={formdata.Newpassword}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setShowPassword((prev)=>({
                ...prev,
                Newpassword:!prev.Newpassword,
                }))}
          >
            {showPassword.Newpassword ? (
              <FaRegEye className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg hover:text-gray-600" />
            ) : (
              <FaEyeSlash className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg hover:text-gray-600" />
            )}
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




        <div className="relative w-full text-sm md:text-xl ">
          <label htmlFor="password">Conf New Password :</label>
          <input
            type={`${showPassword.NewconfirmPassword ? "text" : "password"}`}
            id="NewconfirmPassword"
            className="bg-blue-50 w-full p-2 border-2 border-gray-300 rounded outline-none focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-blue-600 transform duration-200 ease-in-out placeholder:text-xs sm:placeholder:text-xl"
            name="NewconfirmPassword"
            value={formdata.NewconfirmPassword}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setShowPassword((prev)=>({
                ...prev,
                NewconfirmPassword:!prev.NewconfirmPassword,
                }))}
          >
            {showPassword.NewconfirmPassword ? (
              <FaRegEye className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg hover:text-gray-600" />
            ) : (
              <FaEyeSlash className="inline absolute right-3 top-1/2 transform translate-y-1/8 text-gray-400 text-lg hover:text-gray-600" />
            )}
          </button>
        </div>


        {/* show all errror in this box if is there */}
                    {
                        error.length !==0 && <div className="text-red-600 font-medium">{error}</div>
                    }



                     <div>
                        <button type="submit" className= "flex justify-center items-center gap-2 text-sm sm:text-sm md:text-md lg:text-lg bg-gray-600 hover:bg-gray-800  text-white w-full font-bold rounded-lg p-2 cursor-pointer disabled:opacity-50  disabled:cursor-not-allowed" disabled={formdata.currentPassword.length===0 || formdata.Newpassword.length===0 || formdata.NewconfirmPassword.length===0 || !passwordCriteria.hasLowercase || !passwordCriteria.hasUppercase || !passwordCriteria.hasMinLength  || !passwordCriteria.hasSpecialChar || !passwordCriteria.hasNumber}>
                            {processing ?  <><ClipLoader className="" color="white" loading size={22}/>  <span>Changing Password...</span> </> : "Reset Password"} 
                              
                        </button>
                    </div>
      </form>
    </>
  );
}
