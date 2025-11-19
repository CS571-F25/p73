import { HashRouter, Route, Routes } from 'react-router'
import { useEffect, useState } from "react";
//import './App.css'
import Home from './components/home'
import Restaurants from "./components/Restaurants"
import Search from "./components/Blog"
import NoMatch from "./components/NoMatch"
import Landing from "./components/Landing"
import SpecificRestaurant from "./components/SpecificRestaurant"

function App() {
  const [restaurants, setRestaurants] = useState({});

  useEffect( () => {
    fetch('https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants', {
      method: "GET",
      headers: {
        "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
      }
    })
    .then(response => response.json())
    .then(data => {
      setRestaurants(data.results);
    })
  }, []);

  return <HashRouter>
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<Landing />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="search" element={<Search />} />
        {
          Object.values(restaurants).map(rest => {
            return <Route key={rest.restaurant} path={`restaurants/${rest.restaurant}`} element={<SpecificRestaurant rest={rest} />} />
          })
        }
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  </HashRouter>
}

export default App
