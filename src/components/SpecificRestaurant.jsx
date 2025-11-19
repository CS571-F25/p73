import { useEffect, useState } from "react";
import {useParams} from "react-router";

export default function ViewSpecificRestaurant(props) {
    const {id} = useParams();
    const [messages, setMessages] = useState([]);
    useEffect( () => {
        fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/messages", {
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            }
        })
        .then(response => response.json())
        .then(data => {
            setMessages(data.results);
            console.log(data.results);
        })
    }, [id]);
    // be able to add messages here
    return <div>
        <h1>{props.rest.restaurant}</h1>
        <h2>{props.rest.likes}</h2>
        {messages ? Object.values(messages).filter(msg => {
            return msg.restaurant === props.rest.restaurant
        }).map(message => (
            message.messages.map((m, i) => {
                return <p key={i}>{m}</p>
            })
        ))
        : <h2>Loading...</h2>}
    </div>
}