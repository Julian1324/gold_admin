import { lazy } from "react";

const Home = lazy(() => import("../pages/Home/Home"));
const Signin = lazy(() => import("../pages/Signin/Signin"));
const Services = lazy(() => import("../pages/Services/Services"));

const routes = [
    { path: '/home', component: Home },
    { path: '/', component: Signin },
    { path: '/services', component: Services },
];
  
export default routes;