import { lazy } from "react";

const Home = lazy(() => import("../pages/Home/Home"));
const Signin = lazy(() => import("../pages/Signin/Signin"));
const Services = lazy(() => import("../pages/Services/Services"));
const Recharges = lazy(() => import("../pages/Recharges/Recharges"));

const routes = [
    { path: '/home', component: Home },
    { path: '/', component: Signin },
    { path: '/services', component: Services },
    { path: '/recharges', component: Recharges },
];
  
export default routes;