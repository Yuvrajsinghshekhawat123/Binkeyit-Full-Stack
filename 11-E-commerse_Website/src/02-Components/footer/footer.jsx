import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
export function Footer(){
    return (
        <>
           <footer className="border-t flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:p-4  font-normal ">
                <div>
                    © All Rights Reserved 2025.
                </div>

                {/* icons */}
                <div className="flex gap-3">
                    <a href="#"> <FaFacebook  className="text-2xl hover:text-slate-500"/> </a>
                    <a href="#"><FaInstagramSquare className="text-2xl hover:text-slate-500" /></a>
                    <a href="#"><FaLinkedin  className="text-2xl hover:text-slate-500"/></a>
                </div>
           </footer>
        </>
    )
}