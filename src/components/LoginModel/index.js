import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Modal } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../redux/actions/user";

const LoginModel = (props) => {
    const [open, setOpen] = useState(false);
    const [isLogin] = useState(props.name !== "signup");
    const [user, setUser] = useState({});
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.user);
    useEffect(() => {
        if (authUser.isAuthenticated) setOpen(false);
    }, [authUser]);

    const validateForm = () => {
        if (!user.username || !user.password) {
            alert("Invalid Username/Password");
            return false;
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };
    const handleSubmit = (e) => {
        if (isLogin) {
            validateForm();
            dispatch(userLogin(user));
        }
        if (!isLogin) {
            if (!user.password || !user.confirmPassword || user.password !== user.confirmPassword) {
                alert("Invalid password/confirm password");
            }
        }
        console.log("🚀 ~ file: index.js ~ line 16 ~ handleSubmit ~ user", user);
        e.preventDefault();
    };
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button circular icon={props.name} content={props.title} inverted color="blue" />}>
            <Modal.Header>{props.title}</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form onSubmit={handleSubmit}>
                        <Form.Field>
                            <label>Username</label>
                            <input
                                placeholder="User Name"
                                name="username"
                                value={user.username || ""}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input
                                placeholder="Password"
                                type="password"
                                name="password"
                                value={user.password || ""}
                                onChange={handleChange}
                            />
                        </Form.Field>
                        {!isLogin && (
                            <>
                                <Form.Field>
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        value={user.confirmPassword || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Checkbox
                                        label="I agree to the Terms and Conditions"
                                        name="legal"
                                        value={(user.legal && user.legal.toString()) || ""}
                                        onChange={() => setUser({ ...user, legal: !Boolean(user.legal) })}
                                    />
                                </Form.Field>
                            </>
                        )}

                        <Modal.Actions>
                            <Button color="green" type="submit">
                                {props.title}
                            </Button>
                            <Button color="red" type="submit" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                        </Modal.Actions>
                    </Form>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
};

export default LoginModel;
