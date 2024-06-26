const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid E-mail"

        ]
    },
    password: {
        type: String,
        required: [true, "Please add a Password"],
        minLength: [6, "Password must be upto 6 charaters"],

    },
    photo: {
        type: String,
        required: [true, "Please add a Profile Pic"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone: {
        type: String,

        default: "+91"
    },
    bio: {
        type: String,
        maxLength: [250, "Bio must not exceed 23 characters"],

        default: "Bio"
    }
}, {
    timestamps: true,
});
//encription of password
userSchema.pre("save",async function(next)
{
    if(!this.isModified("password")){
        return next();
    }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password=hashedPassword;
        next();
});
const User = mongoose.model("User", userSchema)
module.exports = User