import React from "react";
import { Container, Grid, Header, Segment } from "semantic-ui-react";

const CartComponent = () => {
    return (
        <Container>
            <Header>Cart Items Preveiew</Header>
            <Segment>
                <Grid>
                    <Grid.Column widescreen={10}>Items</Grid.Column>
                    <Grid.Column width={3}>Quantity</Grid.Column>
                    <Grid.Column width={2}>Total</Grid.Column>
                </Grid>
                <hr />
                <Header>Total</Header>
            </Segment>
        </Container>
    );
};

export default CartComponent;
