import React from "react";
import { Card, Image, Button } from "semantic-ui-react";

const ProductsList = () => {
    return (
        <Card.Group>
            <Card>
                <Card.Content>
                    <Card.Header>Steve Sanders</Card.Header>
                    <Card.Meta>Friends of Elliot</Card.Meta>
                    <Card.Description>
                        Steve wants to add you to the group <strong>best friends</strong>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className="ui two buttons">
                        <Button basic color="green">
                            Approve
                        </Button>
                        <Button basic color="red">
                            Decline
                        </Button>
                    </div>
                </Card.Content>
            </Card>
        </Card.Group>
    );
};

export default ProductsList;
