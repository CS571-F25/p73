import { useEffect, useState, useContext, useRef } from "react";
import RestaurantsContext from "../RestaurantsContextProvider"
import {Form, Pagination, Button, Card, Container, Row, Col, Stack, Badge, Modal} from "react-bootstrap";
import CreatePagination from "./HandlePagination";
import ToggleLike from "./ToggleLike";
import ShowTagsModal from "./TagsModal";

export default function ViewSpecificRestaurant({rest}) {
    const [isAdd, setIsAdd] = useState(false);
    const {restaurants, refresh} = useContext(RestaurantsContext);
    const existingLikedRestaurants = localStorage.getItem("liked-restaurants")
    const [likedRestaurants, setLikedRestaurants] = useState(() => {
        return JSON.parse(existingLikedRestaurants ? existingLikedRestaurants : "{}");
    });
    const existingMessages = localStorage.getItem("messages");
    // so this one is gonna be almost identical to the previous localstorage one. For each restaurant, instead
    // of having "true" or "false", it'll just be an array of messages that you have typed.
    const [myMessages, setMyMessages] = useState(() => {
        return JSON.parse(existingMessages ? existingMessages : "{}");
    });
    const [messages, setMessages] = useState([]);
    const messageToSend = useRef();
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);

    const messagesPerRestaurant = 5;
    //console.log(restaurants);
    const restaurant = restaurants ? restaurants.filter(r => r.id === rest.id) : null;
    //console.log(rest);
    //console.log(restaurant);
    useEffect( () => {
        fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/messages", {
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            }
        })
        .then(response => response.json())
        .then(data => {
            setMessages(Object.values(data.results));
            //console.log(data.results);
        })
    }, []);

    function  updateLikedRestaurants(id, liked) {
        const updated = {...likedRestaurants, [id]: liked};
        setLikedRestaurants(updated);
        localStorage.setItem("liked-restaurants", JSON.stringify(updated));
    }

    function handleSubmit(e) {
        e?.stopPropagation();
        const newMessage = messageToSend.current.value.trim();
        if(!newMessage) {
            alert("Reviews can't be blank!");
            return;
        }

        const restaurantsMessages = messages.filter(msg => {
            return msg.restaurant === rest.restaurant
        })

        // i mean the ternarny operation is kinda useless now considering it is guaranteed to have a message but whatever
        const updatedMessages = restaurantsMessages[0] ? [...restaurantsMessages[0].messages, newMessage] : [newMessage];
        console.log(restaurantsMessages[0].id);
        fetch(`https://cs571api.cs.wisc.edu/rest/f25/bucket/messages?id=${restaurantsMessages[0].id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            },
            body: JSON.stringify({
                "restaurant": rest.restaurant,
                "messages": updatedMessages,
                "id": restaurantsMessages[0].id
            })
        })
        .then(response => {
            if(response.status === 200) {
                // looks odd but we're just making sure we're appending the message to the correct restaurants msg array
                setMessages(prev => prev.map(msg => msg.id === restaurantsMessages[0].id ? {...msg, messages: updatedMessages } : msg));
                // basically identical to the one above, we just have the storage for all the other restaurants be the same, but for this restaurant
                // if there are any existing messages, add onto it, otherwise start the array for it by adding this message
                const updated = {...myMessages, [rest.restaurant]: [...(myMessages[rest.restaurant] || []), newMessage]};
                setMyMessages(updated);
                localStorage.setItem("messages", JSON.stringify(updated));
                messageToSend.current.value = "";
                alert("Review posed!");
            }
            else {
                console.log("Uh oh");
            }
        })
    }

    if(!restaurant[0]) {
        return <h2>Loading...</h2>
    }

    // this has started to become really ugly and annoying and i have spent the last 2 hours
    // trying to fix this. I got it to work but it's really ugly. Basically, our messages grabs
    // all of the objects and puts them in an array, so we have to grab the messages of the correct
    // restaurants via filtering. But filtering returns an array, which is stupid, so to actually grab
    // the restaurant, we now need to use [0] everywhere AND we need to do .messages Oh but wait! 
    // Maybe it's not even defined because the fetch hasn't finished yet! So now we need to check to see if entry[0]
    // is defined. If it is, then we make a list of messages which is entry[0].messages, OTHERWISE we temporarily assign
    // list to be an EMPTY array. Then we can do the slice stuff and pagination stuff. 
    const entry = messages.filter(msg => {
            return msg.restaurant === rest.restaurant
    });
    const list = entry[0] ? entry[0].messages : []; 
    const currentMessages = list.slice((page * messagesPerRestaurant) - messagesPerRestaurant, page * messagesPerRestaurant);
    //console.log(currentMessages);
    let totalPages = Math.ceil(list.length / messagesPerRestaurant);
    if(totalPages === 0) {
        totalPages = 1;
    }
    let items = [];
    for(let i = 1; i <= totalPages; i++) {
        items.push(
            <Pagination.Item onClick={() => setPage(i)} key={i} active={page === i}>{i}</Pagination.Item>
        );
    }
    // be able to add messages here
    const isLiked = likedRestaurants[restaurant[0].id] === true;

    function handleDelete(message) {
        // this updated is for the localstorage
        const updated = {...myMessages}; // basically just get the messages, and update 
        // what we have stored for this specific restaurant to be what it already is WITHOUT
        // the message we wish to delete 
        updated[rest.restaurant] = updated[rest.restaurant].filter(m => m !== message);
        setMyMessages(updated);
        localStorage.setItem("messages", JSON.stringify(updated));
        const restaurantsMessages = messages.filter(msg => msg.restaurant === rest.restaurant)

        // i really dislike that .filter must return an array even if it's only a single item
        const updatedMessagesArray = restaurantsMessages[0].messages.filter(m => m !== message);

        fetch(`https://cs571api.cs.wisc.edu/rest/f25/bucket/messages?id=${restaurantsMessages[0].id}`, {
            method: "PUT",
            credientials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            },
            body: JSON.stringify({
                "restaurant": rest.restaurant,
                "messages": updatedMessagesArray,
                "id": restaurantsMessages[0].id
            })
        })
        .then(response => {
            if(response.status === 200) {
                setMessages(prev => prev.map(msg => msg.id === restaurantsMessages[0].id ? {...msg, messages: updatedMessagesArray } : msg));
                alert("Successfully deleted post!");
            }
            else {
                console.log("uh oh");
            }
        })
    }
    // parts of the styling were done with AI help. I didn't know how to formulate my question into a proper search
    // so I just asked AI "how can I make this thing smaller" or whatever
    // also found out, when trying to figure out how to make small gray boxes stack on top of each other, about bootstraps stack:
    // https://react-bootstrap.netlify.app/docs/layout/stack/

    // for accessibility stuff, I have found out I can just use aria-label: 
    // https://stackoverflow.com/questions/73038830/how-do-i-write-alt-text-for-an-icon-inside-a-button-tag
    return <div>
        <Card className="rounded-0 border-0 shadow">
            <Card.Img src={restaurant[0].img} alt={`Restaurant Name: ${restaurant[0].restaurant}`} style={{height: "45vh", objectFit: "cover"}}></Card.Img>
        </Card>
        <Container className="my-4">
            <Row className="align-items-center justify-content-between">
                <Col xs="auto">
                    <Stack gap={2} className="mb-3">
                        <h1 className="mb-0">{restaurant[0].restaurant}</h1>
                        <span className="text muted fs-4">{restaurant[0].likes} Likes</span>
                    </Stack>
                    <Stack direction="horizontal" gap={2}>
                        <Button aria-label="Delete Tag" variant="danger" size="sm" onClick={() => {setShowModal(true); setIsAdd(false);}}>-</Button>
                        {restaurant[0].tags.map((tags, i) => {
                            return <Badge key={i} bg="secondary">{tags}</Badge>
                        })}
                        <Button aria-label="Add Tag" variant="success" size="sm" onClick={() => {setShowModal(true); setIsAdd(true);}}>+</Button>
                    </Stack>
                </Col>
                <Col xs="auto">
                    <ToggleLike rest={restaurant[0]} isLiked={isLiked} updateLikedRestaurants={updateLikedRestaurants} refresh={refresh}></ToggleLike>
                </Col>
            </Row>
            {showModal && (
                <ShowTagsModal show={showModal} setIsAddingRest={setShowModal} refresh={refresh} rest={rest} isAdd={isAdd} />
            )}
            <hr></hr>
            <Card className="p-3 shadow-sm mb-4">
                <Form onSubmit={handleSubmit} className="mb-4">
                    <Form.Label htmlFor="messageInput" className="fs-5">Enter In A Review</Form.Label>
                    <Form.Control id="messageInput" ref={messageToSend} className="mb-3"></Form.Control>
                    <Button type="submit">Search</Button>
                </Form>
            </Card>
            <hr></hr>
            <h2 className="mb-3">Reviews</h2>
            {currentMessages ? (
            <Stack gap={3}>
                {currentMessages.map((message, i)=> {
                    let isMine = false;
                    if((myMessages[rest.restaurant] || []).includes(message)) {
                        isMine = true;
                    }
                    return (
                    <Card key={i} className="p-2 shadow-sm" style={{backgroundColor: "#f7f7f7"}}>
                        <span>{message}</span>
                        <br></br>
                        {isMine && (
                            <Button aria-label="Delete Review" size="sm" variant="danger" onClick={() => handleDelete(message)}>Delete Review</Button>
                        )}
                    </Card>
                    )
                })}
            </Stack>)
            : <h2>Loading...</h2>}
            <CreatePagination itemToSlice={list} maxPerPage={messagesPerRestaurant} setPage={setPage} page={page}/>
        </Container>
    </div>
}
