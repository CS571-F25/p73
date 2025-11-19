import {useEffect, useState, useContext, useRef} from "react";
import {Row, Col, Container, Pagination, Form, Button} from "react-bootstrap";

export default function Search() {
    const [restaurants, setRestaurants] = useState({});
    const restaurantRef = useRef();

    function handleSubmit(e) {
        e?.stopPropagation();
        fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants", {
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            }
        })
        .then(response => response.json())
        .then(data => {
            // do something to filter restaurants and then return them or something
        })
    }
    return <div>
        <h1>Search for a restaurant!</h1>
        <p>In the files, you'll see this is called Blog. That's because I originally planned
            on this being a blog but I changed my mind. I will change the file names later. 
        </p>
        <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor="restaurantInput">Enter Restaurant</Form.Label>
            <Form.Control id="restaurantInput" ref={restaurantRef}></Form.Control>
            <Button type="submit">Search</Button>
        </Form>
    </div>
}