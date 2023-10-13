import React, { useState } from "react";
import classes from "./Auth.module.css";
import { useHistory } from "react-router-dom";
import LoginForm from "./LoginForm";
import useHttp from "../../hooks/useHttp";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/AuthSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const sendRequest = useHttp();

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async(email,password) => {
    try {
      setIsLoading(true);   
      const data = await sendRequest({
        url : "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAZmAyELegQIUlAxdcsCJ-P-HtMA5EvRis",
        method : "POST",
        body :  { email,  password, returnSecureToken: true}
      });
      console.log(data,"login");
      // authCtx.login(data.idToken,data.email);
      history.replace('/store');
      dispatch(authActions.login({token:data.idToken,email:data.email}))
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      alert(error);
    }
  };
  return (
    <section className={classes.box}>
      <h1>Login</h1>
      <LoginForm isLoading={isLoading} submitHandler={submitHandler} />
    </section>
  );
};

export default LoginPage;
