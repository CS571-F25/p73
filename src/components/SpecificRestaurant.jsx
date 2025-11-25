import { useEffect, useState, useContext, useRef } from "react";
import {useParams} from "react-router";
import RestaurantsContext from "../RestaurantsContextProvider"
import {Form, Pagination, Button} from "react-bootstrap";


// BUGS:
// Currently if you update the likes in Restaurants.jsx, then visit the restaurant, it will NOT update the restaurants likes UNLESS you refresh the page. 
// I probably need to use contexts then to store the likes :(
export default function ViewSpecificRestaurant({rest}) {
    const {restaurants, refresh} = useContext(RestaurantsContext);
    const [messages, setMessages] = useState([]);
    const messageToSend = useRef();
    const [page, setPage] = useState(1);

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
                setMessages(prev => prev.map(msg => msg.id === restaurantsMessages[0].id ? {...msg, messages: updatedMessages } : msg));
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
    return <div>
        <h1>{restaurant[0].restaurant}</h1>
        <h2>{restaurant[0].likes}</h2>
        <hr></hr>
        <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor="messageInput">Enter In A Review</Form.Label>
            <Form.Control id="messageInput" ref={messageToSend}></Form.Control>
            <Button type="submit">Search</Button>
        </Form>
        <hr></hr>
        <h3>Reviews</h3>
        {currentMessages ? currentMessages.map((message, i)=> (
            <p key={i}>{message}</p>
        ))
        : <h2>Loading...</h2>}

        {list.length > messagesPerRestaurant ? 
        <Pagination>
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
        : null}
    </div>
}
