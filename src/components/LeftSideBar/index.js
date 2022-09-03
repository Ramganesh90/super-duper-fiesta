import React, { useState } from "react";
import { Grid, Menu, Segment } from "semantic-ui-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import CartComponent from "../../pages/cart";
import ProductComponent from "../../pages/products";

const LeftSideBar = () => {
    let navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("products");
    const handleItemClick = (e) => {
        const target = e.target.innerText.toLowerCase();
        setActiveItem(target);
        if (target === "products") {
            navigate("/");
        } else {
            navigate(target);
        }
    };
    return (
        <Grid>
            <Grid.Column stretched width={3}>
                <Menu secondary vertical style={{ margin: "0 20px" }}>
                    <Menu.Item name="products" active={activeItem === "products"} onClick={handleItemClick} />
                    <Menu.Item name="cart" active={activeItem === "cart"} onClick={handleItemClick} />
                </Menu>
            </Grid.Column>
            <Grid.Column stretched widescreen={12}>
                <Segment>
                    <Routes>
                        <Route path="/" exact element={<ProductComponent />} />
                        <Route path="/cart" element={<CartComponent />} />
                    </Routes>
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default LeftSideBar;
