import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiCheckCircleFill, BiXCircleFill } from 'react-icons/bi';
import './css/card.css';

const Card = (props) => {
    const [voted, setVoted] = useState(props.already_voted);
    const [votes, setVotes] = useState(props.votes);
    const file_name = "../../static/images" + props.img_path;
    const navigate = useNavigate();

    const handleVote = () => {
        const requestOptions = {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        }

        fetch(`/api/update-votes/${props.post_id}/`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            setVotes(data.votes);
            setVoted(true);
        })
        .catch((error) => {
            console.error('Error updating votes:', error);
        });
    }

    const handleView = () => {
        let data = {
            post_id: props.post_id,
            file_name: file_name,
            name: props.name,
            caption: props.caption,
            votes: votes,
            activated: props.activated
        }
        navigate('/view', {state : {data}});
    }

    return (
        <div className="container">
          <div>
            <div className="col-md-6">
              <div className="card">
                <img src={file_name} className="card-img-top" alt="Post Image" />
                <div className="card-body">
                  <h5 className="card-title text-center">{props.name}</h5>
                  <p className="card-text">{props.caption}</p>
                  <div className="d-flex justify-content-between">
                    <p className="card-text">Votes: {votes}</p>
                  </div>
                <div>
                    <button className="btn btn-sm btn-outline-pink" onClick={handleVote} disabled={voted}>{voted ? "Liked" : "Like"}</button>
                    <button className="btn btn-sm btn-outline-pink" onClick={handleView}>View</button>
                </div>
                </div>
                <div className="activated-status">
                <div className={`glow-dot ${props.activated ? 'green' : 'red'}`}></div>
            </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default Card;
