import { lazy } from "react";

const Home = lazy(() => import("../pages/Home/Home"));
const Signin = lazy(() => import("../pages/Signin/Signin"));
const Services = lazy(() => import("../pages/Services/Services"));
const Recharges = lazy(() => import("../pages/Recharges/Recharges"));
const Accounts = lazy(() => import("../pages/Accounts/Accounts"));

const CreateCategory = lazy(() => import("../pages/CreateCategory/CreateCategory"));

const routes = [
    { path: '/home', component: Home },
    { path: '/', component: Signin },
    { path: '/services', component: Services },
    { path: '/recharges', component: Recharges },
    { path: '/accounts', component: Accounts },
    { path: '/create-category', component: CreateCategory }
];
  
export default routes;