import { Fragment } from 'react'

import { ScrollToTop } from './components';

import {  
  Advertise,
  Contact,
  Dmca,
  Eula,
  Privacy,
  Raffle,
  Terms,
  Login,
  Register,
  Music,
  Audio,
  Home,
  Video,
  Posts 
} from './UI';

import { Routes, Route } from "react-router-dom";


const App = () => {
  return (
    // <div className="h-full bg-gray-50 dark:bg-black dark:h-full text-black dark:text-white transition-colors">
    //   <Register />
    // </div>
    <>
      <ScrollToTop />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/music" element={<Music />} />
        <Route path="/posts/:id" element={<Posts />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/audio/:id" element={<Audio />} />
        <Route path="/video/:id" element={<Video />} />
      </Routes>
    </>
  )
}

export default App;