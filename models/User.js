const mongoose = require("mongoose");
const { Schema, model } = mongoose;
var uniqueValidator = require('mongoose-unique-validator');
const statesArray = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];


const userSchema = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: 'First name is required'
        },
        lastName: {
            type: String,
            trim: true,
            required: 'Last name is required'
        },
        profilePicture: {
            imgName: String,
            imgPath: {type: String, default: "./theme/images/users/default_profile.png"}
        },
        backgroundPicture: {
            imgName: String,
            imgPath: {type: String, default: "../images/covers/1.jpg"}
        },
        // the email the user will use on the site ()
        email: {
            type: String,
            trim: true,
            unique: 'Email already exists',
            match: [/.+\@.+\..+/, 'Please fill a valid email address'],
            required: 'Email is required'
        },

        // the users password (hashed) // Erick, I removed the default placeholders here to make the form work
        password: { 
            type: String
        },

        age: {
            type: String
        },

        address: {
            street: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
                uppercase: true,
                enum: statesArray,
            },
            zip: {
                type: String,
            }
        },

        // the code sent to user email in order to validate email authenticity
        // for now we will not add this to our example app. But if you fork and clone this app maybe you can create the needed code for practice
        confirmationCode: {
            type: String
        },
        // the boards that have been created by the user
        userPost: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Post"
                }
            ]
        },

        // User profile information
        about: {
            type: String,
            trim: true
        },

        // when a user is flagged for inappropriate conduct (specify amount to lock user)
        // for now we will not add this to our example app. But if you fork and clone this app maybe you can create the needed code for practice
        flags: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                }
            ]
        },

        // this is if the user has received too many flags and is now banned from the site.
        // for now we will not add this to our example app. But if you fork and clone this app maybe you can create the needed code for practice
        banned: {
            type: Boolean
        },

        // all users set to User role, can only be upgraded to Mediator or Admin by an Admin.
        // for now we will not add this to our example app. But if you fork and clone this app maybe you can create the needed code for practice
        role: {
            type: String,
            enum: ["User", "Mediator", "Admin"],
            default: "User"
        },

        // the boards that the user is following
        // for now we will not add this to our example app. But if you fork and clone this app maybe you can create the needed code for practice
        followingPost: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Post"
                }
            ]
        },

        // the users that this user is following
        // for now we will not add this to our example app. But if you fork and clone this app maybe you can create a route to do so as practice
        // for now we will not add this to our example app. But if you fork and clone this app maybe you can create the needed code for practice
        followingUser: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                }
            ]
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);


userSchema.plugin(uniqueValidator);
module.exports = model("User", userSchema);