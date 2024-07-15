import React from "react";
import Login from "./Login";
import Homepage from "./Homepage";
import Register from "./Register";
import Profile from "./Profile";
import Upload from "./Upload";
import Vote from "./Vote";
import Voucher from "./Voucher";
import ViewPost from "./ViewPost";
import PersonalPosts from "./PersonalPosts";
import { BrowserRouter as Router, Routes, Route, Link, Redirect} from "react-router-dom"


const App =  () => {
    return <Router>
    <Routes>
        <Route exact path="/" element={<Homepage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/upload" element={<Upload/>}/>
        <Route path="/vote" element={<Vote/>}/>
        <Route path="/voucher" element={<Voucher/>}/>
        <Route path="/your-posts" element={<PersonalPosts/>}/>
        <Route path="/view" element={<ViewPost/>}/>
    </Routes>
</Router>
}

export default App; 

