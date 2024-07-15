import React, { useEffect, useState } from "react";
import Card from "./Card";

const Vote = () => {
    const [sample, setSample] = useState([]);

    useEffect(() => {
        fetchData('none');  // Fetch initial data
    }, []);

    const fetchData = async (filterBy) => {
        try {
            const response = await fetch(`/api/get-data/${filterBy}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setSample(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleChange = (event) => {
        const val = event.target.value;
        fetchData(val);  // Fetch data based on selected filter
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
            <label htmlFor="filters" style={{ width: "100px" }}>Filter</label>
                <select name="filters" id="filters" onChange={handleChange} style={{ width: "100px", height: "40px", marginTop: "0"}}>
                    <option value="none">None</option>
                    <option value="votes">Votes</option>
                    <option value="date_created">Date Created</option>
                </select>

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

export default Vote;
