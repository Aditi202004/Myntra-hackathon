import React from "react";
import { useNavigate } from "react-router-dom";
import './css/style.css'

const Login = () => {
    const navigate = useNavigate();
    
    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('pwd')
        };

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        };

        fetch('/api/login', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to login');
                }
                return response.json();
            })
            .then(response => {
                navigate('/profile', { state: { response } });
                
            })
            .catch(error => {
                console.error('Registration or login failed:', error);
            });
    }
    return (
        <div className="login-container">
            <h1>Myntra Login</h1>
            <form onSubmit={handleSubmit}>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required />

                <label for="pwd">Password:</label>
                <input type="password" id="pwd" name="pwd" required />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;