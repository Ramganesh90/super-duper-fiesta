import React from 'react'
import { Container, Icon, Menu } from 'semantic-ui-react'

const Navbar = () => {
    return (
        <Menu>
            <Container>
                <Menu.Item as='a' header>
                    <Icon.Group size='huge'>
                        <Icon size='big' name='circle outline' />
                        <Icon name='user' />
                    </Icon.Group>
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default Navbar