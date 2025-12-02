import { HashRouter, Route, Routes } from 'react-router'
import { useEffect, useState } from "react";
//import './App.css'
import Home from './components/home'
import Restaurants from "./components/Restaurants"
import Search from "./components/Blog"
import NoMatch from "./components/NoMatch"
import Landing from "./components/Landing"
import SpecificRestaurant from "./components/SpecificRestaurant"
import RestaurantsProvider from './RestaurantsContextProvider';

function App() {
  const [restaurants, setRestaurants] = useState([]);

  function refresh() {
    fetch('https://cs571api.cs.wisc.edu/rest/f25/bucket/restaurants', {
      method: "GET",
      headers: {
        "X-CS571-ID": "bid_798df9ba4f1590b9279a55c6fe470c2556e7bdf95f6f0427f298f943d287ba94"
      }
    })
    .then(response => response.json())
    .then(data => {
      setRestaurants(Object.values(data.results));
    })
  }

  useEffect(refresh, []);

  // just moved the context provider from the navbar up to here  because of the "create restaurants"
  // thing im trying to do. I need it to also create a page for the restaurants
  return (
  <RestaurantsProvider.Provider value={{restaurants, refresh}}>
  <HashRouter>
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
  </RestaurantsProvider.Provider>
  )
}

export default App
