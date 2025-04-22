import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { useState } from 'react'
import { useUserData } from './context/UserContext'
import Loading from './components/Loading'
import Register from './pages/Register'
import Album from './pages/Album'
import PlayList from './pages/PlayList'
import Admin from './pages/Admin'
function App() {
  const {isAuth, loading}=useUserData()

  console.log("isAuth", isAuth);


  return <>

{loading?<Loading/>:(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path="/album/:id" element={<Album/>}></Route>
    <Route path="/login" element={isAuth?<Home/>:<Login/>}></Route>
    <Route path="/register" element={isAuth?<Home/>:<Register/>}></Route>
    <Route path="/playlist" element={isAuth ? <PlayList /> : <Login />} />
    <Route path="/admin/dashboard" element={isAuth ? <Admin /> : <Login />} />

    </Routes>
    </BrowserRouter>
)}

  </> 
}

export default App
