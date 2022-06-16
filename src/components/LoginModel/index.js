import React, { useState } from 'react'
import { Button, Checkbox, Form, Icon, Modal } from 'semantic-ui-react'

const LoginModel = (props) => {
    const [open, setOpen] = useState(false);
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Icon name={props.name} />}
        >
            <Modal.Header>
                {props.title}
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form>
                        <Form.Field>
                            <label>First Name</label>
                            <input placeholder='First Name' />
                        </Form.Field>
                        <Form.Field>
                            <label>Last Name</label>
                            <input placeholder='Last Name' />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox label='I agree to the Terms and Conditions' />
                        </Form.Field>
                        <Modal.Actions>
                            <Button color='green' type='submit'>{props.title}</Button>
                            <Button color='red' type='submit' onClick={() => setOpen(false)}>Cancel</Button>
                        </Modal.Actions>
                    </Form>
                </Modal.Description>
            </Modal.Content>

        </Modal>
    )
}

export default LoginModel