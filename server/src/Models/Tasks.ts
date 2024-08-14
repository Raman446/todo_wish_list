import mongoose,{Schema} from "mongoose";

const taskSchema : Schema = new Schema({
    userID : {type: String, required: true },
    todoHeading: {type: String, required: true },
    todoDetail: {type: String, required: true },
    endingdate: {type: String, required: true },
    status: {type: String, required: true },
})

export default mongoose.model("tasks", taskSchema)