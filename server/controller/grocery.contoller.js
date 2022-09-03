import Grocery from "../models/Grocery.js";

export const getGroceries = async (req, res) => {
    const groceries = await Grocery.find();
    return res.status(200).json(groceries);
};
