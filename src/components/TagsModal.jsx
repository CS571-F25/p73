import {Modal, Form, Button} from "react-bootstrap";
import {useRef} from "react";

export default function ShowTagsModal({isAdd, show, setIsAddingRest, refresh, rest}) {
    const tagsRef = useRef();

    async function checkForDuplicates() {
        for(let rests of rest.tags) {
            if(rests.toLowerCase() === tagsRef.current.value.trim().toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    async function handleTagManagement(e) {
        e?.stopPropagation();
        e.preventDefault();
        console.log(tagsRef.current.value); // I unfortunately don't know how to check if what the user enters in is
        // valid or not. Of course, I can check if they actually entered in something separated by commas, but if they entered in gibberish,
        // I can't really do anything about that. 
        const duplicateExists = await checkForDuplicates();
        if(duplicateExists && isAdd) {
            alert("This tag already exists!");
            return;
        }
        else if(!duplicateExists && !isAdd) {
            alert("This restaurant doesn't have that tag!");
            return;
        }

        let newTags = [];
        if(isAdd) {
            newTags = [...rest.tags];
            newTags.push(tagsRef.current.value);
        }
        else {
            newTags = rest.tags.filter(tag => tag.toLowerCase() !== tagsRef.current.value.trim().toLowerCase());
        }

        fetch(`https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants?id=${rest.id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "restaurant": rest.restaurant,
                "likes": rest.likes,
                "img": rest.img,
                "id": rest.id,
                "tags": newTags
            })
        })
        .then(response => {
            if(response.status === 200) {
                if(isAdd) {
                    alert("Successfully added tag!");
                    setIsAddingRest(false);
                    refresh();
                }
                else {
                    alert("Successfully removed tag!");
                    setIsAddingRest(false);
                    refresh();
                }
            }
        })
    }

    return (
        <Modal show={show} centered size="lg" aria-labelledby="contained-modal-title-vcenter" onHide={() => setIsAddingRest(false)}>
            <Modal.Header closeButton>
                {isAdd ? <Modal.Title>Add a Tag!</Modal.Title> : <Modal.Title>Remove a Tag!</Modal.Title>}
            </Modal.Header>

            <Modal.Body>
                <span style={{color: "darkred"}}>* = Required</span>
                <Form onSubmit={handleTagManagement}>
                    { isAdd ? <Form.Label htmlFor="restaurantTags">Add A Tag <span style={{color: "darkred"}}>*</span></Form.Label> : <Form.Label htmlFor="restaurantTags">Remove A Tag <span style={{color: "red"}}>*</span></Form.Label>}
                    <Form.Control id="restaurantTags" ref={tagsRef} placeholder="Example Tag"></Form.Control>
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