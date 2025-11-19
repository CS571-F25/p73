import {useEffect, useState } from "react";
import {useNavigate} from "react-router";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import Restaurants from "./Restaurants";

export default function Landing(props) {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants", {
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            }
        })
        .then(response => response.json())
        .then(data => {
            let values = data.results;
            setRestaurants(Object.values(values).map(rest => {
                return rest;
            }));
        })
    }, []);

    const handleRandom = () => {
        if(restaurants.length === 0) {
            console.log("???");
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * restaurants.length);
        const randomRestaurant = restaurants[randomIndex];

        navigate(`/restaurants/${randomRestaurant.restaurant}`);
    }

    return <div>
        <h1>Home!</h1>
        <p>Currently the website might look very familiar. I will be adding extra styling later
            on to make it more unique. For now I am only focusing on functionality. 
        </p>
        <Button variant="success" onClick={(e) => {
            e.stopPropagation()
            navigate(`/restaurants`)
        }}>Look at the top 10 restaurants!</Button>
        <br></br>
        <br></br>
        { restaurants ? 
            <Button variant="success" onClick={handleRandom}>Look at a random restaurant!</Button>
        : <h3>Loading...</h3>}
    </div>
}