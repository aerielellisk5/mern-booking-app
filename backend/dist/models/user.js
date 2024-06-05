"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    // how this appears into the database, except for id
    // uppercase for String
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            this.password = yield bcryptjs_1.default.hash(this.password, 8);
        }
        next();
    });
});
// before any updates get saved to the documents
// if any updates to the password happens, we want to use bcrypt to encrypt it
// then it will continue to go and do the next thing
// decided to do this step here instead of in the Users route "users.ts"
const User = mongoose_1.default.model("User", userSchema);
// const User = mongoose.model<UserType> |UserType from above, line 4| ("User |name of the document that is associated with the model|", userSchema)
exports.default = User;
// Why did we have to create a Type and Schema? 
// type ==> whenever we create a user, the intellisense will help us; when we are in the frontend, it will make sure that we are using the right fields
