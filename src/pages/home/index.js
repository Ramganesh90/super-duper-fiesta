import React from 'react';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import LoginModel from '../../components/LoginModel';

const HomeComponent = () => {
    return (
        <Segment placeholder>
            <Grid columns={2} stackable textAlign='center'>
                <Divider vertical>Or</Divider>

                <Grid.Row verticalAlign='middle'>
                    <Grid.Column>
                        <Header icon>
                            <LoginModel title="Log In" name="sign-in" />
                            Login
                        </Header>
                    </Grid.Column>

                    <Grid.Column>
                        <Header icon>
                            <LoginModel title="Sign up" name="signup" />
                            Sign Up
                        </Header>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default HomeComponent;
