// import React from "react";
// import "./App.css";
// import Landing from "./landing/Landing";
// import Home from "./home/Home";
// import Comment from "./comment/Comment";
// import Create from "./createPost/Create";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   BrowserRouter,
//   Route,
// } from "react-router-dom";
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <div>
//         <Landing />
//       </div>
//     ),
//   },
//   {
//     path: "/home",
//     element: (
//       <div>
//         <Home />
//       </div>
//     ),
//   },
//   {
//     path: "/comment",
//     element: <Comment />
//   },
//   {
//     path: "/create",
//     element: <Create />
//   },

// ]);
// function App() {
//   return (
//     <>
//       <RouterProvider router={router} />

//     </>
//   );
// }

// export default App;


import React from "react";
import "./App.css";
import Landing from "./landing/Landing";
import Home from "./home/Home";
import Comment from "./comment/Comment";
import Create from "./createPost/Create";
import { AuthProvider } from "./AuthContext";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import RequireAuth from "./RequireAuth";

// Create the router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/home",
    element: <RequireAuth><Home /></RequireAuth>,
  },
  { 
    path: "/comment", 
    element: <RequireAuth><Comment /></RequireAuth>,
  },
  { 
    path: "/create", 
    element: <RequireAuth><Create /></RequireAuth>,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;