import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Segment, Header, Button } from "semantic-ui-react";
import { LOGOUT } from "../../redux/actionTypes/user";
import LoginModel from "../LoginModel";

const Navbar = () => {
    const authUser = useSelector((state) => state.user);
    const dispatch = useDispatch();
    return (
        <Segment color="blue">
            <Grid>
                <Grid.Column verticalAlign="middle" width={9}>
                    <Header>Grocery Cart</Header>
                    <p style={{ textAlign: "left" }}>
                        Welcome {authUser && authUser.isAuthenticated ? authUser.username : "Guest"}
                    </p>
                </Grid.Column>
                <Grid.Column floated="right" width={3}>
                    {authUser && authUser.username ? (
                        <Button
                            circular
                            icon="sign-out"
                            content="Log Out"
                            inverted
                            color="blue"
                            onClick={() => dispatch({ type: LOGOUT })}
                        />
                    ) : (
                        <>
                            <LoginModel title="Register" name="signup" />
                            <LoginModel title="Log In" name="sign-in" />
                        </>
                    )}
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default Navbar;
