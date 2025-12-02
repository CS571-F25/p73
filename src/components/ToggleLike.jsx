import {Button} from "react-bootstrap";
import {useState, useEffect} from "react";

export default function ToggleLike({rest, isLiked, updateLikedRestaurants, refresh}) {
    // I could just do useContext for the refresh, but I am lazy
    function toggleLike(rest, isLiked) {
        const updatedLikes = isLiked ? rest.likes - 1 : rest.likes + 1;
        //console.log(rest);
        fetch(`https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants?id=${rest.id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
            },
            body: JSON.stringify({
                "restaurant": rest.restaurant,
                "likes": updatedLikes,
                "img": rest.img,
                "id": rest.id,
                "tags": rest.tags
            })
        })
        .then(res => {
            if(res.status === 200) {
                updateLikedRestaurants(rest.id, !isLiked);
                refresh();
            }
            else {
                console.log("Uh oh");
            }
        })
    }

    return <>
        <Button className="w-100" variant={isLiked ? "danger" : "success"} onClick={(e) => {
            e.stopPropagation()
            toggleLike(rest, isLiked)
        }}>{isLiked ? "Unlike" : "Like"}</Button>
    </>
}