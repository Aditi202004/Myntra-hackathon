import React from "react";
import { Link, useNavigate } from "react-router-dom"
import './css/style.css'


const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            name: formData.get('fname'),
            email: formData.get('email'),
            password: formData.get('pwd')
        };

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        };
        
        console.log(requestOptions.body);

        fetch('/api/register', requestOptions)
            .then((response) => fetch('/api/login', requestOptions))
            .then(response => {
                if(!response.ok){
                    throw new Error('Failed to login');
                }
                return response.json();
            })
            .then(response => {
                navigate('/profile', {state : {response}});
            })
            .catch(error => {
                console.error('Registration or login failed:', error);
            });

        console.log(data);
    }

    return (
        <>
            <div className="signup-container">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="fname">Name:</label>
                    <input type="text" id="fname" name="fname" required />
    
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
    
                    <label htmlFor="pwd">Password:</label>
                    <input type="password" id="pwd" name="pwd" required />
    
                    <button type="submit">Create Account</button>
                </form>
            </div>
        </>
    );
        
}

export default Register;
