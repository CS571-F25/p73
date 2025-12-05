import {useEffect, useState, useContext } from "react";
import {useNavigate} from "react-router";
import { Card, Button, Row, Col, Container, Stack} from "react-bootstrap";
import Restaurants from "./Restaurants";
import RestaurantCard from "./RestaurantCards";
import RestaurantsContext from "../RestaurantsContextProvider"

export default function Landing(props) {
    const {restaurants, refresh} = useContext(RestaurantsContext);
    const navigate = useNavigate();

    const handleRandom = () => {
        if(restaurants.length === 0) {
            //console.log("???");
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * restaurants.length);
        const randomRestaurant = restaurants[randomIndex];

        navigate(`/restaurants/${randomRestaurant.restaurant}`);
    }

    return <Container fluid className="py-5 text-center" style={{minHeight: "100vh", background: "radial-gradient(circle,rgba(255, 255, 255, 1) 0%, rgba(219, 252, 255, 1) 100%)"}}>
        <h1>Welcome to Menu Ranker!</h1>

        <Stack className="justify-content-center mb-5" direction="horizontal" gap={4}>
            <Button aria-label="Top 10 Restaurants" variant="success" onClick={(e) => {
                e.stopPropagation()
                navigate(`/restaurants`)
            }}>Top 10 Restaurants</Button>
            {
                // most confusing thing the world. One <br> element widens the horizontal
                // space between the two components. Ok, makes sense, we're in a stack where
                // the direction is horizontal. But TWO <br> elements makes the second one
                // widen the space VERTICALLY. Why???? 
            }
            { restaurants ? 
                <Button aria-label="Surprise Me" variant="warning" onClick={handleRandom}>Surprise Me</Button>
            : <h2>Loading...</h2>}
        </Stack>

        <h2 className="mb-4 text-center">Featured Restaurants</h2>
        {restaurants.length > 0 ? (
            <Row>
                {restaurants.slice(0, 4).map((rest, index) => {
                    // hmm
                    return (
                        <Col key={index} xs={12} sm={12} md={6} lg={4} xl={3}>
                            <RestaurantCard refresh={refresh} rest={rest}></RestaurantCard>
                        </Col>
                    )
                })}
            </Row>
        ) : <p>Loading...</p>}
    </Container>
}