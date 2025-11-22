 import { IoSearch } from "react-icons/io5";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useRef, useState } from "react";
import {  useLocation, useNavigate,Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

export function Search() {
  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
   

   const location=useLocation();  
    const isSearchPage = location.pathname === "/search";
    
    
  const searchText = location.search.slice(3);


  const navigate = useNavigate();
  function redirectToSearchPage() {
    navigate("/search");
  }

 const handleOnChange = (e) => {
  const value = e.target.value;

  // Remove leading/trailing spaces
  const trimmedValue = value.trim();

  if (trimmedValue.length > 2) {
    // Navigate to the search page with the query
    navigate(`/search?q=${encodeURIComponent(trimmedValue)}`);
  } else if (trimmedValue.length === 0) {
    // Optional: if input is cleared, navigate back to main page or reset search
    navigate('/search');
  }
};




  // Focus the input if we are on the search page
  useEffect(() => {
    if (isSearchPage && inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, [isSearchPage]);




  return (
    <div className="flex items-center justify-center font-light ">

        {/* show back button on search page instead of seach icon  on mobile,sm,md */}
       {/* Show search icon normally on all page except*/}
        { !location.pathname.startsWith("/account") && !isSearchPage && (
                    <div className="p-2 border-2 border-black rounded-lg rounded-r-none backdrop-blur-md bg-white/50 sticky top-0 ">
                        <IoSearch className="w-5" />
                    </div>
          )}

          {
            //  /* On small screen → show back button */
            location.pathname.startsWith("/account") && !isSearchPage && (<>
                    <div className="p-1 border-2 border-black rounded-lg rounded-r-none block lg:hidden backdrop-blur-md bg-white/50 sticky top-0">
                        <button onClick={()=>navigate(-1)}>
                        <IoMdArrowRoundBack className="w-5" />
                        </button>
                    </div>
             {/* On medium+ screens → keep search */ }
              <div className="p-2 border-2 border-black rounded-lg rounded-r-none hidden lg:flex backdrop-blur-md bg-white/50 sticky top-0">
                        <IoSearch className="w-5" />
                </div>
                </>
            )


          }
        
        

        {/* Show back button only on mobile/sm/md */}
        {isSearchPage && (
        <div className="p-2 border-2 border-black rounded-lg rounded-r-none block lg:hidden backdrop-blur-md bg-white/50 sticky top-0">
            <Link to="/">
            <IoMdArrowRoundBack className="w-5" />
            </Link>
        </div>
        )}
         


        {/* Show search icon only on lg on sreach page */ }
         {isSearchPage && (
        <div className="p-2 border-2 border-black rounded-lg rounded-r-none hidden lg:flex backdrop-blur-md bg-white/50 sticky top-0">
            <IoSearch className="w-5" />
        </div>
        )}



      <div className="relative">
        <input
        ref={inputRef}
          type="text"
          defaultValue={searchText}
          onChange={handleOnChange}
          placeholder={isFocused ? "Search the items" : ""}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={redirectToSearchPage}

          className=" w-[80vw] sm:w-[40vw] md:w-[90vw] lg:w-[30vw] h-6 p-4 rounded-lg rounded-l-none border-2 border-black border-l-0 backdrop-blur-md bg-white/50 sticky top-0 outline-none placeholder:text-gray-700 "

        />

        {/* Show typing animation only if not focused AND no text */}
        {!isFocused && searchText === "" && (
          <div className="px-4 absolute top-1.5 text-gray-600 pointer-events-none">
            <TypeAnimation
              sequence={[
                'Search "milk"', 1000,
                'Search "bread"', 1000,
                'Search "sugar"', 1000,
                'Search "paneer"', 1000,
                'Search "chocolate"', 1000,
                'Search "curd"', 1000,
                'Search "rice"', 1000,
                'Search "egg"', 1000,
                'Search "chips"', 1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        )}
      </div>
    </div>
  );
}
