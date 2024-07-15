import React, { useEffect, useState } from "react";
import Card from "./Card";

const PersonalPosts = () => {
    const [sample, setSample] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('api/personal-posts');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setSample(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {sample.map((val) => (
                <Card 
                    key={val.id}
                    img_path={val.images} 
                    name={val.user_name} 
                    caption={val.caption} 
                    votes={val.votes} 
                    post_id={val.id} 
                    already_voted={val.already_voted}
                    activated={val.activated}
                />
            ))}
        </div>
    );
};

export default PersonalPosts;
