import {useState, useEffect} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {Link, Outlet} from "react-router";
import RestaurantsProvider from "../RestaurantsContextProvider";
//import { RestaurantsProvider } from "../RestaurantsContextProvider";


export default function CreateNavbar(props) {

    const [restaurants, setRestaurants] = useState([]);
    
        function refresh() {
            fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants", {
                headers: {
                    "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
                }
            })
            .then(response => response.json())
            .then(data => {
                // need to do object.values because the bucket api has data.results be an object,
                // not a list of objects. So we have to convert that into a list of objects
                // via data.results. This is also important because .map, .find, .filter (all the
                // declarative programming things) can't be used on an object, but can be used on an
                // array of objects. 
                setRestaurants(Object.values(data.results)); 
                console.log(Object.values(data.results));
            })
        }
    
        useEffect(refresh, []);

    return (
    <div>
    <Navbar style={{ backgroundColor: "#92c3fcff"}} variant="light" sticky="top" expand="sm" collapseOnSelect>
        <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Brand>
                Menu Meter
            </Navbar.Brand>
            <Navbar.Collapse id="responsive-navbar-nav" className="me-auto">
                <Nav>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/restaurants">Restaurants</Nav.Link>
                    <Nav.Link as={Link} to="/search">Search</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    <div style={{margin: "1rem" }}>
        <RestaurantsProvider.Provider value={{restaurants, refresh}}>
            <Outlet />
        </RestaurantsProvider.Provider>
        </div>
    </div>
    )
}