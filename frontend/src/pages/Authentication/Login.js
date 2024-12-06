import PropTypes from "prop-types";
import React, { useState } from "react";

import { Input, FormFeedback, Label } from "reactstrap";

//redux
import { Link, useNavigate } from "react-router-dom";
import withRouter from "components/Common/withRouter";


// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// import css
import "../../assets/scss/_login.scss"
// import images
import logo from "assets/images/temple-right-logo.png";
import bgbanner from "assets/images/login.jpg";
import { GET, POST } from "../../helpers/api_helper";
import { LOGIN_URL, USER } from "../../helpers/url_helper";
import { ToastContainer } from 'react-toastify';
import CustomToast from "components/Common/Toast";
// import { setUser } from "../../helpers/jwt-token-access/accessToken";

function Login() {
  const navigate = useNavigate();
  //meta title
  document.title = "Login | Temple";
  const [is_loading, setLoading] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter your username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      var res = await POST(LOGIN_URL, values);
      console.log(res);
      if (res.status == 200) {
        localStorage.setItem("access_token", res.data.access);
        setLoading(false);
        get_user(res.data.access);
      }
      else if(res.status == 401){
        CustomToast("Invalid Login Credentials!", "error");
        setLoading(false);
      }
      else {
        setLoading(false);
        CustomToast("Internal Server Error!", "error");
      }
    }
  });

  const get_user = async (token) => {
    var res = await GET(USER, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status == 200) {
      localStorage.setItem("auth_user", JSON.stringify(res.data));
      setLoading(false);
      navigate('/home');
      window.location.reload();
    }
    else {
      // toast msg
      setLoading(false);
      CustomToast("Internal Server Error!", "error");
    }
  }

  return (
    <>
    <div>
       {/* <div className="row">
        <div className="col-md-12">
    
          <div class="row  shadow-lg">
            <div class="col-md-8 d-none d-md-block">
              
              <img src={bgbanner} class="img-fluid" style={{ minHeight: "100%" }} />

            </div>
            <div class="col-md-4 bg-white p-5">
              <div className="text-center text-warning mb-3">
                <h5>
                  Welcome
                </h5>
                <h5>
                  To
                </h5>
                <h5>
                  Temple Management System
                </h5>
              </div>
              <div className="form-style mt-5">
                <form className="form-horizontal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}>

                  <div className="mb-4">
                    <Label className="form-label">Username</Label>
                    <Input
                      name="username"
                      className="form-control"
                      placeholder="Enter username"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.username || ""}
                      invalid={
                        validation.touched.username && validation.errors.username ? true : false
                      }
                    />
                    {validation.touched.username && validation.errors.username ? (
                      <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-4">
                    <Label className="form-label">Password</Label>
                    <Input
                      name="password"
                      value={validation.values.password || ""}
                      type="password"
                      placeholder="Enter Password"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.password && validation.errors.password ? true : false
                      }
                    />
                    {validation.touched.password && validation.errors.password ? (
                      <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                    ) : null}
                  </div>
                 
                  <div class="pb-2">
                    {!is_loading ? (<button type="submit" class="btn btn-dark  w-100 font-weight-bold mt-2">உள்நுழைய</button>)
                    :(
                    <button type="button" class="btn btn-light w-100 waves-effect" disabled>
                      <i class="bx bx-hourglass bx-spin font-size-16 align-middle me-2"></i> Loading
                    </button>
                    )}
                  </div>
                </form>
                <div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>  */}
      <div className="container-fluid">
        <div className="row  vh-100 m-0"> 
           <div className="col-md-8 d-none d-md-block">
           <img src={bgbanner} class="img-fluid" style={{ minHeight: "100%" }} />
           </div>
           <div class="col-md-4 shadow-lg bg-white  p-5">
              
              <div className="form-style row">
                <div className="col-md-12">
              <div className="text-center text-dark mb-3">
                <div>
                  <img src={logo} className="img-thumbnail bg-white rounded-circle" style={{width: "60%"}} ></img>
                </div>
                {/* <h3>
                  Welcome
                </h3>
                <h3>
                  To
                </h3>
                <h3>
                  Temple Management System
                </h3> */}
              </div>
                <form className="form-horizontal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}>
                    <div>
                  <div>
                  <h4 className="text-secondary text-center mb-3">Login In To Your Account<span className="mdi mdi-login "></span></h4>
                    <Label className="form-label fs-5">Username</Label>
                    <Input
                      name="username"
                      className="form-control"
                      placeholder="Enter username"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.username || ""}
                      invalid={
                        validation.touched.username && validation.errors.username ? true : false
                      }
                    />
                    {validation.touched.username && validation.errors.username ? (
                      <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-4">
                    <Label className="form-label fs-5">Password</Label>
                    <Input
                      name="password"
                      value={validation.values.password || ""}
                      type="password"
                      placeholder="Enter Password"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.password && validation.errors.password ? true : false
                      }
                    />
                    {validation.touched.password && validation.errors.password ? (
                      <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                    ) : null}
                  </div>
                 
                  <div class="pb-2">
                    {!is_loading ? (<button type="submit" class="btn btn-dark  w-100 font-weight-bold mt-2">உள்நுழைய</button>)
                    :(
                    <button type="button" class="btn btn-light w-100 waves-effect" disabled>
                      <i class="bx bx-hourglass bx-spin font-size-16 align-middle me-2"></i> Loading
                    </button>
                    )}
                  </div>
                  </div>
                </form>
                <div>
                </div>
              </div>
              <div>
              </div>
              </div>
              <div>

              </div>
            </div>
        </div>
      </div>
      
      </div>  
      <ToastContainer/>
    </>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
