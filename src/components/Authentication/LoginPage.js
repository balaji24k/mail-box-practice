import React, { useState } from "react";
import classes from "./Auth.module.css";
import { Button, Form, Nav } from "react-bootstrap";
import { useRef } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import {NavLink, useHistory} from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/AuthSlice";

const LoginPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();

	const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [showPassword, setShowPassword] = useState(false);

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (enteredEmail === "" || enteredPassword === "") {
      alert("Must fill both Email and Password");
    } 
		else {
      emailInputRef.current.value = "";
      passwordInputRef.current.value = "";
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAL0G6pWurs04AgANQC86y9RqLTit1CQP4",
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),

          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.ok) {
          // console.log("Login succesfullly");
          return res.json().then((data) => {
            console.log(data, "data ");
            dispatch(authActions.login({token: data.idToken, email: data.email}))
            history.replace("/inbox");
          });
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication filed!";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            alert(errorMessage);
          });
        }
      })
    }
  };

  return (
    <section className={classes.box}>
      <h1>Login</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label className={classes.label} >Email</Form.Label>
          <Form.Control type="text" placeholder="Email" ref={emailInputRef} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={classes.label} >Password</Form.Label>
          <div className="input-group">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              ref={passwordInputRef}
            />
            <Button
              className="input-group-append"
              onClick={showPasswordHandler}
            >
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </Button>
          </div>
        </Form.Group>

        <Button type="submit" variant="primary">Login</Button>

        <Nav>
          <NavLink to="signup" className={classes.navlink} >
            Don't have an Account?
          </NavLink>
        </Nav>
      </Form>
    </section>
  );
};

export default LoginPage;

