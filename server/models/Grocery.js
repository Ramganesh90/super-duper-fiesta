import mongoose from "mongoose";

const GrocerySchema = new mongoose.Schema({
    grocery_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

export default mongoose.model("Grocery", GrocerySchema);
