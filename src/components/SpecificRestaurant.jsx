import { useEffect, useState, useContext } from "react";
import {useParams} from "react-router";
import RestaurantsContext from "../RestaurantsContextProvider"


// BUGS:
// Currently if you update the likes in Restaurants.jsx, then visit the restaurant, it will NOT update the restaurants likes UNLESS you refresh the page. 
// I probably need to use contexts then to store the likes :(
export default function ViewSpecificRestaurant({rest}) {
    const {restaurants, refresh} = useContext(RestaurantsContext);
    const [messages, setMessages] = useState([]);
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
            setMessages(data.results);
            //console.log(data.results);
        })
    }, []);

    if(!restaurant) {
        return <h2>Loading...</h2>
    }

    // be able to add messages here
    return <div>
        <h1>{restaurant[0].restaurant}</h1>
        <h2>{restaurant[0].likes}</h2>
        {messages ? Object.values(messages).filter(msg => {
            return msg.restaurant === rest.restaurant
        }).map(message => (
            message.messages.map((m, i) => {
                return <p key={i}>{m}</p>
            })
        ))
        : <h2>Loading...</h2>}
    </div>
}
