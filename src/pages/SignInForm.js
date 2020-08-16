import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [pw, setPassword] = useState('');
    
    const submitValue = (e) => {
        const formDetails = {
            Email: email,
            Password: pw,
        };
    
        window.location.href = "/admin";

        // axios({
        //     // method: 'POST',
        //     // url: 'https://sc-backend-v0.herokuapp.com/api/future-sign-up',
        //     // data: formDetails,
        //     // headers: {
        //     //   'Content-Type': 'application/json',
        //     //   'Access-Control-Allow-Origin': '*',
        //     // },
        // })
        //   .then(function (response) {
        //     //handle success
        //     window.location.href = "/admin";
        //   })
        //   .catch(function (error) {
        //     //handle error
        //     alert(error.response.data.reason);
        //   });
    };    

    return (
    <div className="formGroup">
        <div className="formHeader">
            <h2>Sign into sproul.club</h2>
        </div>
        <p>Email</p>
        <input
            className="userInput"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
        />
        <p>Password</p>
        <input
            className="userInput"
            type="text"
            onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/recover">Forgot password?</Link>
        <div className="buttonWrapper">
            <button className="submitButton" onClick={submitValue}>
            Sign in
            </button>
        </div>
    </div>
    )
}

export default SignInForm;