import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './css/profile.css'


const Profile = () => {
    const location = useLocation();
    const token = location.state?.jwt;
    console.log(token);
    const [state, setState] = useState({
        userID: 0,
        name: "John",
        email: "john@example.com",
        streak: 0,
        created_at: "2024-07-11",
        latest_post: "2024-07-11",
        points: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const getUserDetails = () => {
            fetch('/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    if (response.status === 403) {
                        navigate('/login'); // Redirect to login if forbidden
                        return;
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data) {
                        console.log("it's here");
                        setState({
                            userID: data.id,
                            name: data.name,
                            email: data.email,
                            streak: data.streak,
                            created_at: data.created_at,
                            latest_post: data.latest_post,
                            points: data.points
                        });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user details:", error);
                    navigate('/login'); // Redirect to login on error
                });
        };

        getUserDetails();
    }, [navigate]);


    const handlePost = () => {
        navigate('/upload');
    }

    const handleVote = () => {
        navigate('/vote');
    }

    const handleLogout = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({})
        };

        fetch('/api/logout', requestOptions)
        .then((response) => response.json())
        .then((response) => {
            if(response.message == "success"){
                navigate('/login');
                alert("Logged out!");
            }
        })
    }

    const handleRedeem = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({})
        };

        fetch('/api/update-points', requestOptions)
        .then((response) => response.json())
        .then((data) => navigate('/voucher', {state : { amt: data.amt }}));
    }

    const handleView = () => {
        navigate('/your-posts');
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Username</h2>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </div>
            <div className="user-info">
                <p><strong>Name:</strong> {state.name}</p>
                <p><strong>Account Created:</strong> {state.created_at.toString()}</p>
                <p><strong>Latest Post:</strong> {state.latest_post.toString()}</p>
                <p><strong>Streak:</strong> {state.streak.toString()}</p>
                <p><strong>Points:</strong> {state.points.toString()}</p>
            </div>
            <div className="profile-actions">
                <button className="upload-ootd" onClick={handlePost}>Post Outfit of the Day</button>
                <button className="vote" onClick={handleVote}>Vote for Friends</button>
                <button className="redeem-points" onClick={handleRedeem}>Redeem Points</button>
                <button className="view-past-posts" onClick={handleView}>View Past Posts</button>
            </div>
        </div>
    );
}

export default Profile;
