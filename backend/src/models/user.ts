import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
    // lowercase s for string
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

const userSchema = new mongoose.Schema({
    // how this appears into the database, except for id
    // uppercase for String
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});



userSchema.pre("save", async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
});
// before any updates get saved to the documents
// if any updates to the password happens, we want to use bcrypt to encrypt it
// then it will continue to go and do the next thing
// decided to do this step here instead of in the Users route "users.ts"

const User = mongoose.model<UserType>("User", userSchema)
// const User = mongoose.model<UserType> |UserType from above, line 4| ("User |name of the document that is associated with the model|", userSchema)
 
export default User;


// Why did we have to create a Type and Schema? 
// type ==> whenever we create a user, the intellisense will help us; when we are in the frontend, it will make sure that we are using the right fields