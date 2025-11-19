import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router";


export default function CreateNavbar(props) {
    return <Navbar style={{ backgroundColor: "#92c3fcff"}} variant="light" sticky="top" expand="sm" collapseOnSelect>
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
}