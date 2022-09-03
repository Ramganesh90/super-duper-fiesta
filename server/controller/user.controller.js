import { User } from "../models/User.js";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
export const UserSignUp = async (req, res) => {
    const hashPwd = hashSync(req.body.password, 10);
    const newUser = new User({
        username: req.body.username,
        password: hashPwd
    });
    await newUser.save();
    res.status(200).json("User created");
};

export const LoginUser = async (req, res) => {
    const getUser = await User.findOne({ username: req.body.username });
    if (!getUser) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!compareSync(req.body.password, getUser.password)) {
        return res.status(404).json({ message: "Invalid Username/Password" });
    }
    const { _id, username } = getUser;
    res.cookie("access-token", jwt.sign({ _id, username }, "MY_SECRET", { algorithm: "HS256" }), {
        httpOnly: false
    });
    res.status(200).json({ _id, username });
};
