import {useEffect, useState, useContext } from "react";
import {useNavigate} from "react-router";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import SpecificRestaurant from "./SpecificRestaurant";
import RestaurantsContext from "../RestaurantsContextProvider"
import ToggleLike from "./ToggleLike";
import RestaurantCard from "./RestaurantCards";

// ok so while searching for design related stuff, I found this:
// https://react-bootstrap.netlify.app/docs/utilities/ratio/
// I might use it. I'll see if I have time.

export default function Restaurants() {
    const { restaurants, refresh } = useContext(RestaurantsContext);
    // I am writing this after having reviewed a bunch of local storage stuff for HW11, so the
    // idea for likedRestaurants came from HW11 to some extent. Since I am only storing restaurants the
    // user liked, and not the message history for each persona, I don't actually need to care about the key
    // anymore, so I can just set it to something like "liked-restaurants"
    const existingLikedRestaurants = localStorage.getItem("liked-restaurants")
    const [likedRestaurants, setLikedRestaurants] = useState(() => {
        return JSON.parse(existingLikedRestaurants ? existingLikedRestaurants : "{}");
    });

    // PLANS: 
    // Of course styilize everything. Using basic react bootstrap stuff is kind of boring.
    // I need to do some sort of storage with the likes. I need to keep track of what restaurants
    // the user has liked so far to keep them from just spamming the like button to make sure their
    // favorite restaurant doesn't become the best. I'll probably use localstorage or sessionstorage for that.
    // In the end, I want to make it like a heart button instead of having 2 different buttons
    // ^ update to past me. I don't think this is possible. I googled it, and like people were making
    // their own like pngs and stuff, and I don't reaaallllyy wanna deal with that, so I'm not gonna do that. I'll
    // just stick to whatever bootstrap has given me so far
    // good website to make gradients: https://cssgradient.io/
    return <div style={{background: "linear-gradient(45deg,rgba(255, 255, 255, 1) 0%, rgba(249, 249, 249, 1) 35%, rgba(224, 247, 250, 1) 100%)"}}>
        <div style={{padding: "1rem"}}>
            <h1>Top 10 Restaurants: </h1>
            <p>Only showcasing the most popular restaurants!</p>
        </div>
        <br></br>
        <Container>
            <Row>
                {restaurants ? Object.values(restaurants)
                .sort((a, b) => b.likes - a.likes)
                .slice(0, 10)
                .map(rest => {
                    return(
                    <Col key={rest.restaurant} xs={12} md={4} lg={3} xl={3}>
                        <RestaurantCard refresh={refresh} rest={rest}/>
                    </Col>
                );
                })
                : <h3>Loading...</h3>}
            </Row>
        </Container>
    </div>
}