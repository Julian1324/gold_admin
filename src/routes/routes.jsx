import { lazy } from "react";

const Home = lazy(() => import("../pages/Home/Home"));
const Signin = lazy(() => import("../pages/Signin/Signin"));

const routes = [
    { path: '/home', component: Home },
    { path: '/', component: Signin },
];
  
export default routes;