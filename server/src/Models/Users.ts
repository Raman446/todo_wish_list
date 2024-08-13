import mongoose,{Schema, Document} from "mongoose";

const userSchema: Schema = new Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    password: { type: String, required: true }
});

export default mongoose.model('users', userSchema)