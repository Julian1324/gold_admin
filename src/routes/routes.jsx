import { lazy } from "react";

const Home = lazy(() => import("../pages/Home/Home"));
const Signin = lazy(() => import("../pages/Signin/Signin"));

const routes = [
    { path: '/', component: Home },
    { path: '/signin', component: Signin },
];
  
export default routes;