import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes/routes";
import { Suspense } from 'react';
import MyNavbar from "./shared/Navbar/MyNavbar.jsx";
import Footer from './shared/Footer/Footer.jsx';

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
                    route.path.includes('sign') ?
                      <route.component />
                      :
                      <> <MyNavbar /><route.component /><Footer /> </>
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
