import {Link} from "react-router";

export default function NoMatch(props) {

    return (
        <div>
            <h2>404</h2>
            <p>This page doesn't exist!</p>
            <p>
                <Link to="/">Back to safety</Link>
            </p>
        </div>
    );
}