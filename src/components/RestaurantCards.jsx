import {Card, Button, Stack, Container, Row, Col} from "react-bootstrap";
import ToggleLike from "./ToggleLike";
import {useNavigate} from "react-router";
import {useState} from "react"

export default function RestaurantCard({refresh, rest}) {
    // I am writing this after having reviewed a bunch of local storage stuff for HW11, so the
    // idea for likedRestaurants came from HW11 to some extent. Since I am only storing restaurants the
    // user liked, and not the message history for each persona, I don't actually need to care about the key
    // anymore, so I can just set it to something like "liked-restaurants"
    const existingLikedRestaurants = localStorage.getItem("liked-restaurants")
    const [likedRestaurants, setLikedRestaurants] = useState(() => {
        return JSON.parse(existingLikedRestaurants ? existingLikedRestaurants : "{}");
    });
    const navigate = useNavigate();
        
    function  updateLikedRestaurants(id, liked) {
        // the idea is literally just create a function where the key is the restaurants id, 
        // and 1 = liked, 0 = not liked. Simple as that. When we need to update the local storage 
        // b/c we liked a restaurant, we need to update it similar to what I did in I think HW5 with
        // the badger cats. Just create a new updated object, have all of them be the same, and the one restaurant
        // that was updated (given by id), set that one to be either 1 or 0 based on what we updated it to.
        // then save that to localstorage
        const updated = {...likedRestaurants, [id]: liked};
        setLikedRestaurants(updated);
        localStorage.setItem("liked-restaurants", JSON.stringify(updated));
    }

    const isLiked = likedRestaurants[rest.id] === true;
    return (
        <Card className="shadow" style={{width: '100%', aspectRatio: '1/1'}} onClick={() => {navigate(`/restaurants/${rest.restaurant}`)}}>
            <Card.Img variant="top" src={rest.img} style={{width: "100%", height: "50%", objectFit: "cover"}} alt={rest.restaurant} />
            <Card.Body className="d-flex flex-column align-items-center">
            <Stack gap={0}>
                <span className="fw-bold fs-5">{rest.restaurant}</span>
                <span className="fs-6 mb-3"> Likes: {rest.likes}</span>
            </Stack>
            <Container className="mb-3">
                {rest.tags.map((tag, i) => (
                    <span key={i} className="badge bg-secondary me-1">
                        {tag}
                    </span>
                ))}
            </Container>
            <ToggleLike rest={rest} isLiked={isLiked} updateLikedRestaurants={updateLikedRestaurants} refresh={refresh} />
            </Card.Body>
        </Card>
    )
}