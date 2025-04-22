import { useNavigate } from "react-router-dom"
import { useUserData } from "../context/UserContext";


const Navbar = () => {
  const {isAuth,logoutUser}=useUserData()
  const navigate=useNavigate();
  const logoutHandler=()=>{
    logoutUser();
    // Do not redirect to login, stay on the home page
  }

  return (
    <div>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <img src="/la.svg" className="w-8 bg-white p-2 rounded-2xl cursor-pointer "onClick={()=>navigate(-1)} alt="">
          </img>
          <img src="ra.svg" className="w-8 bg-white p-2 rounded-2xl cursor-pointer "onClick={()=>navigate(+1)} alt="">
          </img>

        </div>
        <div className="flex items-center gap-4">
          <p className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full md:block hidden">
           Explore Premium
          </p>
          <p className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full md:block hidden">
           Install App
          </p>
{isAuth || localStorage.getItem("token") ? (
  <p
    onClick={logoutHandler} // Fixed the onClick handler
    className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full"
  >
    Logout
  </p>
) : (
  <p
    onClick={() => {
      navigate("/login");
    }}
    className="px-4 py-1 cursor-pointer bg-white text-black text-[15px] rounded-full"
  >
    Login
  </p>
)}
        </div>
      </div>
      <div className="flex items-centr gap-2 mt-4">
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">
          All
        </p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block">
          Music
        </p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hidden md:block">
          Podcasts
        </p>
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer md;hidden " onClick={()=>navigate("/playist")}>
          PlayList
        </p>
      </div>

    </div>
  )
}

export default Navbar