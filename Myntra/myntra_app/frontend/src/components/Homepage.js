import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import './css/homepage.css';


const Homepage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login')
    }
    
    const handleRegister = () => {
        navigate('/register')
    }

    const reset = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        }

        fetch('/api/initialize', requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if(response.message != 'success'){
                alert("Initialization failed!");
            }
        })
        .catch((error) => console.log(error));  
    }

    useEffect(() => {
        reset();
    }, []);

    

    return (
        <div class="container">
            <button className="login-button" onClick={handleLogin}>Login</button>
            <button className="register-button" onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Homepage;