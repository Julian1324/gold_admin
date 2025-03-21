import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes/routes";
import { Suspense } from 'react';
import MyNavbar from "./shared/Navbar/MyNavbar.jsx";
import Sidebar from './shared/Sidebar/Sidebar.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, indexRoute) => {
          return (
            <Route
              path={route.path}
              element={
                <Suspense fallback={<span>Loading...</span>}>
                  {
                    route.path !== '/' ?
                      <> <MyNavbar /> <Sidebar/> <route.component /> </>
                      :
                      <route.component />
                  }
                </Suspense>
              }
              key={indexRoute}>
            </Route>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
