import { useNavigate } from "react-router-dom";
import PlayListCard from "./PlayListCard";
import { useUserData } from "../context/UserContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const {user}=useUserData()
  return (
    <div className="w-[25%] h-full p-4 flex flex-col gap-6 text-white hidden lg:flex bg-[#1e1e1e]">
      {/* Top Section */}
      <div className="bg-black h-auto rounded flex flex-col gap-4 p-4">
        <div
          className="flex items-center gap-4 pl-4 cursor-pointer hover:bg-[#333333] p-2 rounded"
          onClick={() => navigate("/")}
        >
          <img src="/home.png" alt="Home" className="w-8 h-8 bg-white rounded-full p-1" />
          <p className="font-bold text-lg">Home</p>
        </div>
        <div
          className="flex items-center gap-4 pl-4 cursor-pointer hover:bg-[#333333] p-2 rounded"
          onClick={() => navigate("/search")}
        >
          <img src="/seo.png" alt="Search" className="w-8 h-8 bg-white rounded-full p-1" />
          <p className="font-bold text-lg">Search</p>
        </div>
      </div>

      {/* Library Section */}
      <div className="bg-[#121212] flex-1 rounded p-4 py-2">
        <div className="flex items-center justify-between mb-3">
          {/* Library Text */}
          <div className="flex items-center gap-4">
            <img src="/stack-of-books.png" alt="Library" className="w-8 h-8 bg-white rounded-full p-1" />
            <p className="font-semibold text-lg">Your Library</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <img src="/next.png" className="w-8 h-8 bg-white rounded-full p-2" alt="Next" />
            <img src="/plus.png" className="w-8 h-8 bg-white rounded-full p-2" alt="Add" />
          </div>
        </div> 
        {user && user.role === "admin" && (
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-white text-black text-[15px] rounded-full cursor-pointer w-full"
              onClick={() => navigate("/admin/dashboard")}
            >
              Admin Dashboard
            </button>
          </div>
        )}
        <div onClick={()=>navigate("/playlist")}>
            <PlayListCard/>
        </div>
        <div className="p-1 m-1  bg-[#121212] rounded font-semibold flex flex-col items-start gap-1 pl-4 mt-2">
          <h1>Let's find some podcasts to follow</h1>
          <p className="font-light">We'll keep you updated on new episodes</p>
          <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4">
            Browse Podcasts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;