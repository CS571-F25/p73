import {Outlet} from "react-router";
import CreateNavbar from "./Navbar";

export default function Home (props) {
    return <div>
        <CreateNavbar />
        <div style={{margin: "1rem"}}>
            <Outlet />
        </div>
    </div>
}