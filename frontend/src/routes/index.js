import React from "react"
import { Navigate } from "react-router-dom"


// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"

// User
import UsersListTable from "pages/Users/ListUser"
import AddUser from "pages/Users/AddUser"
import ViewUser from "pages/Users/ViewUser"
import EditUser from "pages/Users/EditUser"
import UseridCard from "pages/Users/IdCard"

const authProtectedRoutes = [
  { path: "/home", component: <Dashboard/> },
  {path:"/users", component:<UsersListTable/>},
  {path:"/users/view/:id", component:<ViewUser/>},
  {path:"/users/edit/:id", component:<EditUser/>},
  {path:"/users/add", component:<AddUser/>},
   {path:"/users/idcard/:id", component:<UseridCard/>},

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
   {
    path: "/",
    exact: true,
    component: < Navigate to="/home" />,
  },

   /* 👇️ only match this when no other routes match */
   {
    path: "*", 
    exact: true,
    component: < Navigate to="/home" />
  } 
]

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
]

export { authProtectedRoutes, publicRoutes }

