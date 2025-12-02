import {useState, useEffect} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {Link, Outlet} from "react-router";
import RestaurantsProvider from "../RestaurantsContextProvider";
//import { RestaurantsProvider } from "../RestaurantsContextProvider";
import crest from "../assets/fantastic.png";

export default function CreateNavbar(props) {

    // moved the context providing stuff out of the navbar to app.jsx because of routing purposes.
    // Basically, I want it so that when we create a new restaurant, a new page is made for it. But, since
    // the context is here, not in app.jsx, we can't actually do that. So I just moved the context out to app.jsx.
    /*
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
                //console.log(Object.values(data.results));
            })
        }
    
        useEffect(refresh, []);
    */
    return (
    <div>
    <Navbar style={{ backgroundColor: "black"}} variant="dark" sticky="top" expand="sm" collapseOnSelect>
        <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Brand className="d-flex align-items-center">
                <img
                    alt="Menu Ranker Logo"
                    src={crest}
                    width="60"
                    height="60"
                    style={{marginRight: "10px"}}
                    className="d-inline-block align-top"
                />{' '}
                <span className="fs-4 text-white">Menu Ranker</span>
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
    {
        // so I had basically stolen this navbar from one of the HWs we did, and they used
        // a margin of 1rem, which I also copied. Then when trying to style my website, I realzied
        // that I couldn't have anything reach the edges of the screen no matter how I tried. 
        // Eventually I realized it was this, but I was really confused for that period of time
    }
    <div style={{margin: 0, padding: 0}}>
        <Outlet />
    </div>
    </div>
    )
}