import {useEffect, useState, useContext } from "react";
import {useNavigate} from "react-router";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import SpecificRestaurant from "./SpecificRestaurant";
import RestaurantsContext from "../RestaurantsContextProvider"

export default function Restaurants() {
    const { restaurants, refresh } = useContext(RestaurantsContext);
    //const [restaurants, setRestaurants] = useState({});
    //const [liked, setLiked] = useState(true);
    const navigate = useNavigate();

    /*
    const refresh = () => {
        fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants", {
            method: "GET",
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            }
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data.results);
            setRestaurants(data.results);
        })
    };
    */

    /*
    // i had something in my head with the like state 
    function toggleLike() {
        setLiked(prev => !prev);
        refresh();
    }
    */

    function increaseLike(rest) {
        //console.log(rest);
        fetch(`https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants?id=${rest.id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            },
            body: JSON.stringify({
                "restaurant": rest.restaurant,
                "likes": rest.likes + 1,
                "img": rest.img,
                "id": rest.id
            })
        })
        .then(res => {
            if(res.status === 200) {
                //console.log("Worked :)");
                refresh();
            }
            else {
                console.log("Uh oh");
            }
        })
    }

    function decreaseLike(rest) {
        fetch(`https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants?id=${rest.id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            },
            body: JSON.stringify({
                "restaurant": rest.restaurant,
                "likes": rest.likes - 1,
                "img": rest.img,
                "id": rest.id
            })
        })
        .then(res => {
            if(res.status === 200) {
                //console.log("Worked :)");
                refresh();
            }
            else {
                console.log("Uh oh");
            }
        })
    }

    //useEffect(toggleLike, []);
    // PLANS: 
    // Of course styilize everything. Using basic react bootstrap stuff is kind of boring.
    // I need to do some sort of storage with the likes. I need to keep track of what restaurants
    // the user has liked so far to keep them from just spamming the like button to make sure their
    // favorite restaurant doesn't become the best. I'll probably use localstorage or sessionstorage for that.
    // In the end, I want to make it like a heart button instead of having 2 different buttons
    return <div>
        <h1>Top 10 Restaurants: </h1>
        <p>Only showcasing the most popular restaurants!</p>
        <br></br>
        <Container>
            <Row>
                {restaurants ? Object.values(restaurants).map(rest => (
                    <Col key={rest.restaurant} xs={12} md={4} lg={3} xl={3}>
                        <Card style={{width: '100%', aspectRatio: '1/1'}} onClick={() => {navigate(`/restaurants/${rest.restaurant}`)}}>
                            <h2 style={{margin: 'auto'}}>{rest.restaurant}</h2>
                            <h3>{rest.likes}</h3>
                            <Button variant="success" onClick={(e) => {
                                e.stopPropagation()
                                increaseLike(rest)
                                }}>Like</Button>
                            <Button variant="secondary" onClick={(e) => {
                                e.stopPropagation()
                                decreaseLike(rest)
                            }} >Dislike</Button>
                        </Card>
                    </Col>
                ))
                : <h3>Loading...</h3>}
            </Row>
        </Container>
    </div>
}