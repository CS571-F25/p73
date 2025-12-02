import CreateNavbar from "./Navbar";
import {Outlet} from  "react-router";

// I don't know if this counts as a meaningful react component. I think it does because it creates
// the navbar, and that is pretty important for the router, but I have no idea actually
export default function Home (props) {
    return <div>
        <CreateNavbar />
    </div>
}