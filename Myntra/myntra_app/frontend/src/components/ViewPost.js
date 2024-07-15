import React from "react";
import { useLocation } from "react-router-dom";
import './css/viewpost.css'

const ViewPost = () => {
    const location = useLocation();
    const state = location.state.data;

    return (
        <div className="container">
          <div>
            <div className="col-md-6">
              <div className="card1">
                <img src={state.file_name} className="card1-img-top" alt="Post Image" />
                <div className="card1-body">
                  <h5 className="card1-title text-center">{state.name}</h5>
                  <p className="card1-text">{state.caption}</p>
                  <div className="d-flex justify-content-between">
                    <p className="card1-text">Votes: {state.votes}</p>
                  </div>
                </div>
                <div className="activated-status">
                <div className={`glow-dot ${state.activated ? 'green' : 'red'}`}></div>
            </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default ViewPost;