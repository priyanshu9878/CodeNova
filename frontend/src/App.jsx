import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/Signup.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import Admin from "./pages/Admin.jsx";
import {checkAuth} from "./authSlice.js"
import { useDispatch,useSelector } from 'react-redux'
import { useEffect } from "react";
import ProblemPage from "./pages/ProblemPage.jsx";
import AdminDelete from "./components/AdminDelete.jsx"
import AdminUpdate from "./components/AdminUpdate.jsx";
import AdminVideo from "./components/AdminVideo.jsx";
import AdminUpload from "./components/AdminUpload.jsx";

function App() {

  const {isAuthenticated,user,loading} = useSelector((state)=> state.auth);
  const dispatch  = useDispatch();

  
  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);
  
  if (loading) {
  return <div>Loading...</div>;
}
  console.log("isAuthenticated:", isAuthenticated);
console.log("user:", user);
console.log("role:", user?.role);

  return (
    <>
    <BrowserRouter>
     <Routes>
       <Route path = "/" element = {isAuthenticated ? <HomePage></HomePage> : <Navigate to="/signup"/>}></Route>
       <Route path = "/login" element = {isAuthenticated ? <Navigate to ="/"></Navigate> : <Login></Login>}></Route>
       <Route path = "/signup" element = {isAuthenticated ? <Navigate to ="/"></Navigate> :<SignUp></SignUp>}></Route>
       <Route path="/admin" element={<Admin/>}></Route>
       {/* <Route path= "/admin" element= { isAuthenticated && user.role=== 'admin' ? <AdminPanel/> : <Navigate to ="/" />}></Route> */}
       {/* <Route path="/admin/create" element={ isAuthenticated && user?.role === "admin" ? ( <AdminPanel /> ) : ( <Navigate to="/" />) }/> */}
       <Route path="/admin/create" element={ <AdminPanel /> }/>
       <Route path="/admin/delete" element={ <AdminDelete /> }/>
       <Route path="/admin/update" element={ <AdminUpdate /> }/>
       {/* <Route path="/admin/delete" element={ isAuthenticated && user?.role === "admin" ? ( <AdminDelete /> ) : ( <Navigate to="/" />) }/> */}
        <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
        {/* <Route  path="/admin/update" element={isAuthenticated && user?.role === "admin" ? <AdminUpdate /> : <Navigate to="/" /> }/> */}
        <Route path="/admin/video/" element={<AdminVideo/>}></Route>
        <Route path="/admin/upload/:problemId" element={<AdminUpload/>}></Route>

     </Routes>
    </BrowserRouter>
    </>
  )
}

export default App


/*

import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Homepage /> : <Navigate to="/signup" />}
      />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />

      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
      />

      <Route
        path="/admin"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <Admin />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/create"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminPanel />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/delete"
        element={
          isAuthenticated && user?.role === "admin" ? (
            <AdminDelete />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route path="/problem/:problemId" element={<ProblemPage />} />
    </Routes>
  );
}

export default App;

*/