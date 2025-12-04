import {Modal, Form, Button} from "react-bootstrap";
import {useRef} from "react";

export default function AddRestaurantModal({show, setIsAddingRest, refresh}) {
    const nameRef = useRef();
    const tagsRef = useRef();
    const imageRef = useRef();
    const msgRef = useRef();

    async function checkForDuplicates() {
        const response = await fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants", {
            method: "GET",
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            }
        });

        const data = await response.json();
        const restaurants = Object.values(data.results);
        for(let rests of restaurants) {
            if(rests.restaurant.toLowerCase() === nameRef.current.value.trim().toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    async function handleCreateRestaurant(e) {
        e?.stopPropagation();
        e.preventDefault();
        console.log(nameRef.current.value);
        console.log(msgRef.current.value);
        console.log(imageRef.current.value);
        console.log(tagsRef.current.value); // I unfortunately don't know how to check if what the user enters in is
        // valid or not. Of course, I can check if they actually entered in something separated by commas, but if they entered in gibberish,
        // I can't really do anything about that. 
        const tagsToAdd = parseTags(tagsRef.current.value.trim());
        let messages = [];
        messages.push(msgRef.current.value.trim());
        const duplicateExists = await checkForDuplicates();
        if(duplicateExists) {
            alert("This restaurant already exists!");
            return;
        }

        if(!(nameRef.current.value.trim() && msgRef.current.value.trim() && imageRef.current.value.trim() && tagsRef.current.value.trim())) {
            alert("Please enter in something for all boxes!");
            return;
        }
        
        //https://stackoverflow.com/questions/9519569/what-is-the-true-way-of-checking-a-string-for-image-url-and-existence-if-valid
        if(!isImageUrl(imageRef.current.value.trim())) {
            alert("Invalid Image URL!");
            return;
        }

        // so this is gonna be really weird. I need to do 2 fetches for both the restaurants and messages
        // api. One fetch is to create the data. Second fetch will be to use the ID returned by the POST to then update
        // the stuff for the data we just added to the API to also include the ID. So 4 fetches in total
        fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants/", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "restaurant": nameRef.current.value.trim(),
                "likes": 0,
                "img": imageRef.current.value.trim(),
                "tags": tagsToAdd
            })
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            fetch(`https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants/?id=${data.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "restaurant": nameRef.current.value.trim(),
                    "likes": 0,
                    "img": imageRef.current.value.trim(),
                    "id": data.id,
                    "tags": tagsToAdd
                })
            })
            .then(res => {
                if(res.status === 200) {
                    // cool
                }
            })
        });

        // basically initialize the localstorage for this new restaurant
        localStorage.setItem("messages", JSON.stringify({ [nameRef.current.value.trim()]: [msgRef.current.value.trim()]}));
        // now messages
        fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/messages/", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "restaurant": nameRef.current.value.trim(),
                "messages": messages
            })
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            fetch(`https://cs571api.cs.wisc.edu/rest/f25/bucket/messages/?id=${data.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "restaurant": nameRef.current.value.trim(),
                    "messages": messages,
                    "id": data.id
                })
            })
            .then(response => {
                if(response.status === 200) {
                    alert("Successfully created restaurant!");
                    setIsAddingRest(false);
                    refresh();
                }
            })
        })
    }

    function isImageUrl(url) {
        return /\.(jpg|jpeg|png)$/i.test(url)
    }

    function parseTags(str) {
        return str.split(",").map(text => text.trim()).filter(text => text !== "");
    }

    return (
        <Modal show={show} centered size="lg" aria-labelledby="contained-modal-title-vcenter" onHide={() => setIsAddingRest(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Add a Restaurant!</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleCreateRestaurant}>
                    <Form.Label htmlFor="restaurantName">Enter Restaurant Name <span style={{color: "red"}}>*</span> </Form.Label>
                    <Form.Control id="restaurantName" ref={nameRef} placeholder="Example"></Form.Control>
                    <br></br>
                    <Form.Label htmlFor="restaurantImg">Enter Image URL <span style={{color: "red"}}>*</span></Form.Label>
                    <Form.Control id="restaurantImg" ref={imageRef} placeholder="https://example.com/picture.jpg"></Form.Control>
                    <br></br>
                    <Form.Label htmlFor="restaurantTags">Enter Tags <span style={{color: "red"}}>*</span></Form.Label>
                    <Form.Control id="restaurantTags" ref={tagsRef} placeholder="tag1, tag2, tag3"></Form.Control>
                    <br></br>
                    <Form.Label htmlFor="restaurantMessage">Enter Message <span style={{color: "red"}}>*</span></Form.Label>
                    <Form.Control id="restaurantMessage" ref={msgRef} placeholder="Example Review"></Form.Control>
                    <br></br>
                    <Button type="submit">Finish</Button>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setIsAddingRest(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}