import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Grid, Menu, Segment } from "semantic-ui-react";

import HomeComponent from "./pages/home";
import AboutComponent from "./pages/about";
import Navbar from "./components/Navbar";

const App = () => {
    let navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("home");
    const handleItemClick = (e) => {
        const target = e.target.innerText.toLowerCase();
        setActiveItem(target);
        if (target === "home") { 
            navigate("/");
         }
        else { 
            navigate(target); 
        }
    }
    return <div>

        <header>
            <h3>Tiny App</h3>
            <Navbar />
        </header>
        <Grid>
            <Grid.Column width={4}>
                <Menu fluid vertical tabular>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        name='about'
                        active={activeItem === 'about'}
                        onClick={handleItemClick}
                    />
                </Menu>
            </Grid.Column>

            <Grid.Column stretched width={12}>
                <Segment>
                    <Routes>
                        <Route path="/" exact element={<HomeComponent />} />
                        <Route path="/about" element={<AboutComponent />} />
                    </Routes>
                </Segment>
            </Grid.Column>
        </Grid>
    </div>

}
export default App;
