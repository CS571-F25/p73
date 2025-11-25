import {useEffect, useState, useContext, useRef} from "react";
import {useNavigate} from "react-router";
import {Row, Col, Container, Pagination, Form, Button, Card} from "react-bootstrap";
import RestaurantsContext from "../RestaurantsContextProvider"

export default function Search() {
    const {refresh} = useContext(RestaurantsContext);
    const [restaurants, setRestaurants] = useState({});
    const [page, setPage] = useState(1);
    const restaurantsPerPage = 4;
    const restaurantRef = useRef();
    const navigate = useNavigate();

    function handleSubmit(e) {
        e?.stopPropagation();
        fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants", {
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            }
        })
        .then(response => response.json())
        .then(data => {
            let filterThru = Object.values(data.results);
            //console.log(filterThru);
            //console.log(restaurantRef.current.value);
            // do something to filter restaurants and then return them or something
            filterThru = filterThru.filter(rest => rest.restaurant.toLowerCase().includes(restaurantRef.current.value));
            if(restaurantRef.current.value.toLowerCase() == "all restaurants") {
                filterThru = Object.values(data.results);
            }
            if(restaurantRef.current.value.toLowerCase() == "" || restaurantRef.current.value.toLowerCase() == "clear restaurants") {
                filterThru = [];
            }
            setRestaurants(filterThru);
            setPage(1);

            restaurantRef.current.value = "";
        })
    }

    const currentRestaurants = Object.values(restaurants).slice((page * restaurantsPerPage) - restaurantsPerPage, page * restaurantsPerPage);
    let totalPages = Math.ceil(Object.values(restaurants).length / restaurantsPerPage);
    if(totalPages === 0) {
        totalPages = 1;
    }
    let items = [];
    for(let i = 1; i <= totalPages; i++) {
        items.push(
            <Pagination.Item onClick={() => setPage(i)} key={i} active={page === i}>{i}</Pagination.Item>
        );
    }
    return <div>
        <h1>Search for a restaurant!</h1>
        <p>Try typing the name of a restaurant! We'll show you the best matches. 
            To see all the restaurants, type <b>"all restaurants"</b>. To clear search, type <b>""</b> or <b>"clear restaurants"</b>!
        </p>
        <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor="restaurantInput">Enter Restaurant</Form.Label>
            <Form.Control id="restaurantInput" ref={restaurantRef}></Form.Control>
            <Button type="submit">Search</Button>
        </Form>
        <br></br>
        <br></br>
        <Container>
            <Row>
            {restaurants.length > 0 ? currentRestaurants.map(rest => (
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
            : undefined}
            </Row>
            {restaurants.length > 0 ? 
            <Pagination className="mt-4">
                <Pagination.Item onClick={() => {
                    if(page > 1) {
                        setPage(page - 1);
                    }
                }} disabled={page === 1 || totalPages === 1}>Previous</Pagination.Item>
                {items}
                <Pagination.Item onClick={() => {
                    if(page < totalPages) {
                        setPage(page+1);
                    }
                }} disabled={page === totalPages || totalPages === 1}>Next</Pagination.Item>
            </Pagination>
            : null
        }
        </Container>
    </div>
}