import PropTypes from 'prop-types';
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { layoutTypes } from "./constants/layout";
// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes";

// Import all middleware
import Authmiddleware from "./routes/route";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import { isTokenExpired } from "../src/helpers/jwt-token-access/accessToken";

// Import scss
import "./assets/scss/theme.scss";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primereact/resources/primereact.min.css";
//toast message

import 'react-toastify/dist/ReactToastify.css';

        
const getLayout = (layoutType) => {
  let Layout = VerticalLayout;
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      Layout = VerticalLayout;
      break;
    // case layoutTypes.HORIZONTAL:
    //   Layout = HorizontalLayout;
    //   break;
    default:
      break;
  }
  return Layout;
};

const App = () => {

  const { layoutType } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
  }));

  const Layout = getLayout(layoutType);
  // var publicRouting = publicRoutes;

  // if(localStorage.getItem("access_token") &&!isTokenExpired())
  //   publicRouting = [];
  // else
  //   publicRouting = publicRoutes;

  return (
    <React.Fragment>
      <Routes>
        
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <NonAuthLayout>
                {route.component}
              </NonAuthLayout>
            }
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <Layout>{route.component}</Layout>
              </Authmiddleware>}
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any
};

export default App;