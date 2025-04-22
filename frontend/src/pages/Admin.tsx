

import { Link, useNavigate } from 'react-router-dom';
import { useUserData } from '../context/UserContext';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSongData } from '../context/SongContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';
const server="hopeful-respect-production.up.railway.app"
const Admin = () => {

    const navigate = useNavigate();
    const {user}=useUserData();
    const [title,setTitle]=useState<string>("")
    const [description,setDescription]=useState<string>("")
    const [album,setAlbum]=useState<string>("")

    const [file,setFile]=useState<File|null>(null)
    const [btnLoading, setbtnLoading] = useState<boolean>(false)
     
    const fileChangeHandler=(e:ChangeEvent<HTMLInputElement>)=>{
        const selectedFile=e.target.files?.[0]||null;
        setFile(selectedFile)
    }

    
    const {albums,songs,fetchAlbums,fetchSongs}=useSongData()

const addAlbumHandler=async(e:FormEvent)=>{
    e.preventDefault()
    if(!file)
        return;
    const formData=new FormData()
    formData.append("title",title)
    formData.append("description",description)
    formData.append("file",file)
    setbtnLoading(true)
    try {
        const token=localStorage.getItem("token")
        const {data}=await axios.post(`${server}/api/v1/album/new`,formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success(data.message)
        fetchAlbums()
        setbtnLoading(false)
        setTitle("")
        setDescription("")
        setFile(null)

        
    } catch (error:any) {
        toast.error(error.response?.data?.message||"An error occured")
        
    }

}

const addSongHandler=async(e:FormEvent)=>{
    e.preventDefault()
    if(!file)
        return;
    const formData=new FormData()
    formData.append("title",title)
    formData.append("description",description)
    formData.append("file",file)
    formData.append("album_id",album)
    setbtnLoading(true)
    try {
        const token=localStorage.getItem("token")
        const {data}=await axios.post(`${server}/api/v1/songs/new`,formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success(data.message)
        fetchSongs()
        setbtnLoading(false)
        setTitle("")
        setDescription("")
        setFile(null)
        setAlbum("")
    } catch (error:any) {
        toast.error(error.response?.data?.message||"An error occured")
        
    }

}




const addthumbnailHandler=async(id:string)=>{
   // e.preventDefault()
    if(!file)
        return;
    const formData=new FormData()
    formData.append("file",file)
    
    setbtnLoading(true)
    try {
        const token=localStorage.getItem("token")
        const {data}=await axios.post(`${server}/api/v1/songs/${id}`,formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        toast.success(data.message)
        fetchSongs()
        setbtnLoading(false)
        setFile(null)
       
    } catch (error:any) {
        toast.error(error.response?.data?.message||"An error occured")
        
    }

}


  const deleteAlbumHandler=async(id:string)=>{
    if(confirm("Are you sure you want to include this album"))
    {
        setbtnLoading(true)
        try {
            const token=localStorage.getItem("token")
            const {data}=await axios.delete(`${server}/api/v1/album/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            toast.success(data.message)
            fetchSongs()
            fetchAlbums()
            setbtnLoading(false)

            
        } catch (error:any){
            toast.error(error.response?.data?.message||"An error occured")


            
        }
    }

  }


  const deletSongHandler=async(id:string)=>{
    if(confirm("Are you sure you want to include this song"))
    {
        setbtnLoading(true)
        try {
            const token=localStorage.getItem("token")
            const {data}=await axios.delete(`${server}/api/v1/songs/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            toast.success(data.message)
            fetchSongs()
            setbtnLoading(false)

            
        } catch (error:any){
            toast.error(error.response?.data?.message||"An error occured")


            
        }
    }

  }

    useEffect(() => {
        if(user&&user.role!=="admin")
            navigate("/")
    }, [])
    
    return (
        <div className='min-h-screen bg-[#212121] text-white p-8'>
            <Link to={"/"} className="bg-green-500 text-white font-bold py-2 px-4 rounded-full">
            Home
            </Link>
            <h2 className="text-2xl font-bold mb-6 mt-6">Add Album</h2>
            <form className='bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4' onSubmit={addAlbumHandler}>
                <input type="text" 
                placeholder='title' 
                value={title}
                onChange={e=>setTitle(e.target.value)}
                className="auth-input" 
                required/>
                                <input type="text" 
                placeholder='description' 
                value={description}
                onChange={e=>setDescription(e.target.value)}
                className="auth-input" 
                required/>
                <input type='file'
                placeholder='choose thumbnail'
                onChange={fileChangeHandler}
                className='auth-input cursor-pointer'
                accept='image/*'
                required
                />
                <button className='auth-btn ' style={{width:"100px"}} disabled={btnLoading}>{btnLoading?"Please Wait":"Add"}

                </button>
                               
            </form>


            <h2 className="text-2xl font-bold mb-6 mt-6">Add Songs</h2>
            <form className='bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4' onSubmit={addSongHandler}>
                <input type="text" 
                placeholder='title' 
                value={title}
                onChange={e=>setTitle(e.target.value)}
                className="auth-input" 
                required/>
                                <input type="text" 
                placeholder='description' 
                value={description}
                onChange={e=>setDescription(e.target.value)}
                className="auth-input" 
                required/>

                <select className='auth-input' value={album} onChange={(e=>setAlbum(e.target.value))} required>
                    <option value="">Choose Album</option>
                   {
                    albums?.map((ele:any,idx:number)=>{
                        return <option value={ele.id}key={idx}>{ele.title}</option>
                    })
                   }
                </select>
                {/* <input type="text" 
                placeholder='description' 
                value={description}
                onChange={e=>setDescription(e.target.value)}
                className="auth-input" 
                required/> */}
                <input type='file'
                placeholder='choose audio'
                onChange={fileChangeHandler}
                className='auth-input cursor-pointer'
                accept='audio/*'
                required
                />
                <button className='auth-btn ' style={{width:"100px"}} disabled={btnLoading}>{btnLoading?"Please Wait":"Add"}
                </button>          
            </form>
            <div className='mt-8'>
                <h3 className='text-xl font-semibold mb-4'>Added Albums</h3>
                <div className='flex justify-center md:jsutify-start gap-2 items-center flex-wrap '>
                    {
                        albums?.map((e,i)=>{
                          return  <div className=' bg-[#181818] p-4 rounded-lg shadow-md' key={i}>
                            
                                <img src={e.thumbnail} className='mr-1 w-60 h-52 ' alt=''/>
                                <h4 className='text-lg font-bold'>{e.title.slice(0,20)}...</h4>
                                <h4 className='text-lg font-bold'>{e.description.slice(0,20)}...</h4>
                                <button className='px-3 py-1 bg-red-500 text-white rounded' disabled={btnLoading} onClick={()=>deleteAlbumHandler(e.id)}><MdDelete/></button>

                               
                            
                          </div>
                        })

                    }
                </div>
            </div>

            <div className='mt-8'>
                <h3 className='text-xl font-semibold mb-4'>Added Songs</h3>
                <div className='flex justify-center md:jsutify-start gap-2 items-center flex-wrap '>
                    {
                        songs?.map((e,i)=>{
                          return  <div className=' bg-[#181818] p-4 rounded-lg shadow-md' key={i}>
                                {
                                    e.thumbnail?<img src={e.thumbnail} className='mr-1 w-60 h-52 ' alt=''/>
                                    : <div className="flex flex-col justify-center items-center gap-2 ">
                                        <input type="file"  onChange={fileChangeHandler}/>
                                        <button onClick={()=>addthumbnailHandler(e.id)} className='auth-btn ' style={{width:"200px"}} disabled={btnLoading}>{btnLoading?"Please Wait...":"Add thumbnail"}</button>
                                    </div>
                                }
                                <h4 className='text-lg font-bold'>{e.title.slice(0,20)}...</h4>
                                <h4 className='text-lg font-bold'>{e.description.slice(0,20)}...</h4>
                                <button className='px-3 py-1 bg-red-500 text-white rounded' disabled={btnLoading} onClick={()=>deletSongHandler(e.id)}><MdDelete/></button>

                               
                            
                          </div>
                        })

                    }
                </div>
            </div>
        </div>
    );
}

export default Admin;