import React from "react";
import { useLocation } from "react-router-dom";
import './css/voucher.css';

const Voucher = () => {
    var amount = "0";
    const location = useLocation();
    amount = location.state?.amt;

    return (
        <div className="container">
            <div>
                <div className="col-md-6">
                <div className="card voucher-card">
                    <div className="card-body text-center">
                    <i className="bi bi-gift-fill display-4 text-pink"></i>
                    <h2 className="card-title text-pink">Congratulations!</h2>
                    <p className="card-text">You've earned a ₹{amount} voucher!</p>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Voucher;