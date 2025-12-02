import {useEffect, useState, useContext, useRef} from "react";
import {useNavigate} from "react-router";
import {Row, Col, Container, Pagination, Form, Button, Card, Dropdown, DropdownButton, ButtonGroup, Modal} from "react-bootstrap";
import RestaurantsContext from "../RestaurantsContextProvider"
import AddRestaurantModal from "./RestaurantsModal";
import CreateFilters from "./Filters";
import CreatePagination from "./HandlePagination";
import RestaurantCard from "./RestaurantCards";

export default function Search() {
    // was really confused on this for a while. Turns out if we pass in restaurants and refresh
    // through a context, if we we wish to use this context, then we need to create an object
    // with keys exactly matching what it was passed in as. I actually found out about this through this
    // stack overflow: https://stackoverflow.com/questions/68747749/javascript-match-defined-values-in-all-objects-and-return-rest-of-values-in-vari
    // (literally just googled: "javascript why do my object names need to match what object is returned by a function")
    // where the actual question mentions destructuring and links me to the official page for destructuring. So the next
    // thing was how to get past destructuring. The simple solution was to change my restaurants state variable to NOT be 
    // named restaurants, but then it would be annoying to replace every use of restaurants with something else. The javascript
    // documentation for destructuring actually helps with this. I can just do x: y to solve that issue, so
    // restaurants: allRestaurants is equivalent to const allRestaurants = restaurants.
    const { restaurants : allRestaurants, refresh} = useContext(RestaurantsContext);
    const existingLikedRestaurants = localStorage.getItem("liked-restaurants")
    const [likedRestaurants, setLikedRestaurants] = useState(() => {
        return JSON.parse(existingLikedRestaurants ? existingLikedRestaurants : "{}");
    });

    const [isAddingRest, setIsAddingRest] = useState(false); // similar to that one react native hw, if this is true,
    // it should pull up a second modal window for the user to basically add a restaurant to the the API
    const [restaurants, setRestaurants] = useState([]);
    const [searchFilterRestaurants, setSearchRestaurants] = useState([]);
    const [page, setPage] = useState(1);
    const restaurantsPerPage = 4;
    const restaurantRef = useRef();
    
    const navigate = useNavigate();
    let allFilters = [];
    for(let rest of allRestaurants) {
        //console.log(rest);
        for(let tag of rest.tags) {
            if(!allFilters.includes(tag)) {
                allFilters.push(tag);
            }
        }
    }

    const [selectedPrice, setSelectedPrice] = useState("");
    const [selectedCuisine, setSelectedCuisine] = useState("");
    const [selectedOther, setSelectedOther] = useState("");

    function clearFilters() {
        setSelectedCuisine("");
        setSelectedOther("");
        setSelectedPrice("");
    }

    function createFilterCategories(tags) {
        const priceFilters = ["$", "$$", "$$$"];
        const cuisineFilters = ["pizza", "indian", "chinese", "spanish", "japanese", "italian", "mediterranean", "middle eastern", "filipino"];
        const cuisine = [];
        const price = [];
        const misc = [];

        // ever since finding out about .includes I have fallen in love with it. I wish C also had 
        // something like this, but alas, I have to iterate through every array manually :(
        for(let tag of tags) {
            //console.log(tag);
            if(priceFilters.includes(tag)) {
                price.push(tag);
            }
            else if(cuisineFilters.includes(tag.toLowerCase())) {
                cuisine.push(tag);
            }
            else {
                misc.push(tag);
            }
        }

        return {price, cuisine, misc};
    }

    function  updateLikedRestaurants(id, liked) {
        const updated = {...likedRestaurants, [id]: liked};
        setLikedRestaurants(updated);
        localStorage.setItem("liked-restaurants", JSON.stringify(updated));
    }

    useEffect(() => {
        setSearchRestaurants(allRestaurants);
    }, [allRestaurants]);

    function handleSubmit(e) {
        e?.stopPropagation();
        e.preventDefault();
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
            filterThru = filterThru.filter(rest => rest.restaurant.toLowerCase().includes(restaurantRef.current.value.toLowerCase()));
            if(restaurantRef.current.value.toLowerCase() == "all restaurants") {
                filterThru = Object.values(data.results);
            }
            if(restaurantRef.current.value.toLowerCase() == "clear restaurants") { // idk why u would need this, will probably remove
                filterThru = [];
            }
            if(restaurantRef.current.value.toLowerCase() == "my liked") {
                filterThru = allRestaurants.filter(rest => likedRestaurants[rest.id]);
            }

            /*
            filterThru = filterThru.filter(rest => {
                // out of the restaurants, filter them down based on the users selected filters
                // if a filter has been chosen, then only select the restaurants in our current set of restaurants
                // that have that filter, otherwise just allow all the restaurants b/c a filter hasn't been chosen
                const matchPrices = selectedPrice ? rest.tags.includes(selectedPrice) : true;
                const matchCuisines = selectedCuisine ? rest.tags.includes(selectedCuisine) : true;
                const matchOthers = selectedOther ? rest.tags.includes(selectedOther) : true;
                return matchCuisines && matchOthers && matchPrices;
            })
            */

            setSearchRestaurants(filterThru);
            setPage(1);

            restaurantRef.current.value = "";
        })
    }

    // the pagination stuff is ripped entirely off from what I did in HW4 (you can see the code is nearly 1:1)
    const currentRestaurants = restaurants.slice((page * restaurantsPerPage) - restaurantsPerPage, page * restaurantsPerPage);
    let totalPages = Math.ceil(restaurants.length / restaurantsPerPage);
    if(totalPages === 0) {
        totalPages = 1;
    }
    let items = [];
    for(let i = 1; i <= totalPages; i++) {
        items.push(
            <Pagination.Item onClick={() => setPage(i)} key={i} active={page === i}>{i}</Pagination.Item>
        );
    }

    // everytime we call refresh() it refreshes the restaurants state, BUT, we have a separate
    // local state variable that holds all the filtered data. Everytime we call refresh, this filtered data
    // is not updated to reflect the updates (the likes), so we use this useEffect that is called after
    // every refresh() that just basically updates our filtered list to reflect the new likes.
    useEffect(() => {
        setRestaurants(prev => prev.map(rest => {
            const updated = allRestaurants.find(specific => specific.id === rest.id);
            return updated !== undefined ? updated : rest;
        }));
    }, [allRestaurants]);

    // ok so I am running into the issue that if I want BOTH the users search and filters to narrow it down,
    // I need to use another state variable, where I have that state variable updated by the search. THEN, 
    // using that state variable (that holds the filtered down restaurants from the user search), we can apply the
    // filters then save that to the restaurants state variable. The reason I need to do this is for this specific test case:
    // say you search for "Kasama", then the restaurants state array only holds the "Kasama" restaurant. Now you apply a filter to it
    // that doesn't show Kasama anymore (so no restaurants showcased). If you try to clear the filters, the useEffect below WILL
    // execute, but the issue is that it uses prev from restaurants, and since restaurants is empty, clearing the filters doesn't actually do anything
    // (i.e., when we apply a filter it is a 'permanent' change. I need this to be temporary), and using two different states can fix that.
    // But it is really late now and I am tired, so I will do this tomorrow and I hope that will be almost all of my functionality for the website complete. 
    // I might do one extra thing where if the restaurant the user searches for doesn't exist, then they can add it to the API. 
    // Pretty simple to do, will be very similar to badger chat, so it shouldn't be too difficult. After that I need to work on styling 
    // which will be annoying and I will have to scower through a bunch of docs to find the correct styling options and whatnot
    useEffect(() => {
        setRestaurants(
            searchFilterRestaurants.filter(rest => {
                const matchPrices = selectedPrice ? rest.tags.includes(selectedPrice) : true;
                const matchCuisines = selectedCuisine ? rest.tags.includes(selectedCuisine) : true;
                const matchOthers = selectedOther ? rest.tags.includes(selectedOther) : true;
                return matchCuisines && matchOthers && matchPrices;
            })
        );
        setPage(1);
    }, [selectedPrice, selectedCuisine, selectedOther, searchFilterRestaurants]);

    // more destructuring stuff. Kind of annoying. Why do keys NEED to match? What's the benefit of having them match?
    const {price, cuisine, misc} = createFilterCategories(allFilters);
    //console.log(misc);

    return <div style={{background: "linear-gradient(0deg,rgba(255, 255, 255, 1) 0%, rgba(249, 249, 249, 1) 35%, rgba(224, 247, 250, 1) 100%)"}}>
        <div style={{padding: "1rem"}}>
        <h1>Search for a restaurant!</h1>
        <p>Try typing the name of a restaurant! We'll show you the best matches. 
            To see all the restaurants, type <b>"all restaurants"</b>. <br></br>
            You can also look at all your liked restaurants by searching <b>"my liked"</b>. 
        </p>
        <Card className="p-3 shadow-sm mb-4">
            <Form onSubmit={handleSubmit}>
                <Form.Label htmlFor="restaurantInput">Enter Restaurant</Form.Label>
                <Form.Control id="restaurantInput" ref={restaurantRef}></Form.Control>
                <br></br>
                <Button type="submit">Search</Button>
                <br></br>
                <br></br>
                <p>Can't remember the restaurants name but remember the food? Try using a filter to narrow down your search!</p>
                <CreateFilters setSelectedCuisine={setSelectedCuisine} selectedCuisine={selectedCuisine} setSelectedOther={setSelectedOther} selectedOther={selectedOther}
        setSelectedPrice={setSelectedPrice} selectedPrice={selectedPrice} clearFilters={clearFilters} price={price} cuisine={cuisine} misc={misc}/>
            </Form>
        </Card>
        {
            // I had to ask AI on help for the class names :( I do not know them. I think later on I will ask
            // the AI for a list of all the different classNames and what they do so I can just refer to the big list
            // instead of prompting the AI everytime for styling

            // As for the actual dropdown thing, I just looked at this:
            // https://react-bootstrap.netlify.app/docs/components/dropdowns/
            // though the example they gave is a bit misleading. In their example all the buttons
            // are next to each other, but I am pretty sure they're doing like a grid thing for that
        }
        </div>
        <hr></hr>
        <br></br>
        <Container>
            <Row>
            {restaurants.length > 0 ? currentRestaurants.map(rest => {
                const isLiked = likedRestaurants[rest.id] === true;
                return (
                <Col key={rest.restaurant} xs={12} md={4} lg={3} xl={3}>
                    <RestaurantCard isLiked={isLiked} refresh={refresh} rest={rest}/>
                </Col>
            )})
            : 
            <div>
                <p>It seems like no restaurants match your search and/or filters! If you want, you can add the restaurant:</p>
                <Button variant={"success"} onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingRest(true);
                }}>Add a Restaurant!</Button>
            </div>}
            {
                // https://react-bootstrap.netlify.app/docs/components/modal/ literally stole the live demo one
            }
            {isAddingRest && (
                <AddRestaurantModal show={isAddingRest} setIsAddingRest={setIsAddingRest} refresh={refresh} />
            )}
            </Row>
            <CreatePagination itemToSlice={restaurants} maxPerPage={restaurantsPerPage} setPage={setPage} page={page} />
        </Container>
    </div>
}