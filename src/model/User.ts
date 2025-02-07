import mongoose , {Schema, Document} from "mongoose";

export interface Event extends Document{
    _id: string;
    title: string;
    content: string;
    image: string;
    createdAt: Date; 
}

const EventSchema: Schema<Event> = new Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    image:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    college: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username should be Unique"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, "Email should be Unique"],
        unique: [true, "Email should be unique"], 
        match: [/.+\@.+\..+/,"Please use a valid email address"]
    },
    password:{
        type: String,
        required:[true,"Password in Required"],
        match: [/^\S*$/, 'Password cannot contain spaces']
    },
    college:{
        type: String,
        required: [true,"College Name is Required"]
    },
    verifyCode:{
        type: String,
        required:[true, "Verify code required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true,"Verify code expiry Required"]
    },
    isVerified:{
        type: Boolean,
        default: false
    }
})

export interface Club extends Document{
    clubname: string;
    email: string;
    password: string;
    college: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    events: Event[];
}

const ClubSchema: Schema<Club> = new Schema({
    clubname:{
        type: String,
        required: [true, "Clubname is Required"],
        unique: [true, "Club Name should be unique"],
    },
    email:{
        type: String,
        required:[true,"Email is Required"],
        unique:[true,"Email should be unique"],
        match: [/.+\@.+\..+/,'please use a valid email address']
    },
    password:{
        type: String,
        required:[true,"Password is Required"],
        match: [/^\S*$/, 'Password cannot contain spaces']
    },
    verifyCode:{
        type: String,
        required:[true,"Verify Code is Required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required:[true, "Verify Code Expiry is Required"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    events: [EventSchema]
})

const EventModel = (mongoose.models.Event as mongoose.Model<Event>) || mongoose.model<Event>("Event",EventSchema)

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

const ClubModel = (mongoose.models.Club as mongoose.Model<Club>) || mongoose.model<Club>("Club",ClubSchema)

export {EventModel, UserModel, ClubModel};