import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast,{ Toaster } from "react-hot-toast";
// const server="http://localhost:5000"
const server="https://spotifyclone-production-ea6a.up.railway.app"

export interface User{
    _id:string;
    name:string;
    email:string;
    role:string;
    playlist:string[];
}

interface UserContextType{
    user:User|null;
    isAuth:boolean;
    loading:boolean;
    btnLoading:boolean;
    loginUser:(
        email:string,
        password:string,
        navigate:(path:string)=>void
    )=>Promise<void>
    RegisterUser:(
        name:string,
        email:string,
        password:string,
        navigate:(path:string)=>void
    )=>Promise<void>

    AddToPlaylist:(id:string)=>void
    logoutUser:()=>Promise<void>
    
}

const UserContext=createContext<UserContextType|undefined>(undefined)

interface UserProviderProps{
    children:React.ReactNode;
}
export const UserProvider:React.FC<UserProviderProps>=({children})=>{
    const [user,setUser]=useState<User|null>(null)
    const [loading,setLoading]=useState<boolean>(true)
    const [isAuth,setIsAuth]=useState(false)
    const [btnLoading,setBtnLoading]=useState(false)
    async function loginUser(email:string,password:string,navigate:(path:string)=>void)
    {
        setBtnLoading(true)
        try{
            const {data}=await axios.post(`${server}/api/v1/user/login`,{

                email,password
            })
            toast.success(data.message)
            
            localStorage.setItem("token",data.token)
            setUser(data.user)
            setIsAuth(true)
            setBtnLoading(false)
            navigate("/")

            
           
        }catch(err:any){
            toast.error(err.response?.data?.message|| "An Error occurred")
            setBtnLoading(false)
        }


    }
    async function RegisterUser(name:string,email:string,password:string,navigate:(path:string)=>void)
    {
        setBtnLoading(true)
        try{
            const token = localStorage.getItem("token"); // Retrieve token from local storage

            const {data}=await axios.post(`${server}/api/v1/user/register`,{

                name,email,password
            },          {
                headers: {
                    Authorization: `Bearer ${token}`, // Include Bearer token in headers
                },
            })
            toast.success(data.message)
            localStorage.setItem("token",data.token)
            setUser(data.user)
            setIsAuth(true)
            setBtnLoading(false)
            navigate("/")

            
           
        }catch(err:any){
            toast.error(err.response?.data?.message|| "An Error occurred")
            setBtnLoading(false)
        }


    }
    const fetchUser = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${server}/api/v1/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (data) {
                setUser(data.user);
                setIsAuth(true);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
        } finally {
            setLoading(false);
        }
    };

   
    async function logoutUser() {
        localStorage.clear();
        setUser(null);
        setIsAuth(false);
    
        toast.success("User Logged Out");
      }
    async function AddToPlaylist(id:string){

        try {
            const token = localStorage.getItem("token");

            const {data}=await axios.post(`${server}/api/v1/song/${id}`,{},{
             
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            })
            toast.success(data.message)
            fetchUser()
        } catch (error:any) {
            toast.error(error.response?.data?.message||"An error occured")
            
        }
    }
     
    useEffect(()=>{
        fetchUser()


    },[])
    return <UserContext.Provider value={{user,loading,isAuth,btnLoading,loginUser,RegisterUser,logoutUser,AddToPlaylist}}>
        {children}<Toaster/>
    </UserContext.Provider>
}
export const useUserData=():UserContextType=>{
const context=useContext(UserContext)
if(!context)
    throw new Error("useUserData must be used within a UserProvider")
return context
}

