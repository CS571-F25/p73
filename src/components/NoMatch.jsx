import {Link} from "react-router";

export default function NoMatch(props) {

    return (
        <div>
            <h1>404</h1>
            <p>This page doesn't exist!</p>
            <p>
                <Link to="/">Back to safety</Link>
            </p>
        </div>
    );
}