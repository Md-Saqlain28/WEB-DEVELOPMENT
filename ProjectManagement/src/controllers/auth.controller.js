import {user} from '../models/user.model.js';
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async-handlers.js";
import {sendEmail} from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return { accessToken, refreshToken };
    }catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
}
const registerUser = asynchandler(async (req, res) => {
    const {email, username, password, role} = req.body

    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(400, "User with email or username already exists", [])
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false,
    })

    const {unHashedTokens, hashedToken, tokenExpiry} = 
        user.generateTemporaryToken();

        user.emailVerificationToken = hashedToken;
        user.emailVerificationTokenExpiry = tokenExpiry;

        await user.save({validateBeforeSave: false});

        await sendEmail(
            {
                email: user?.email,
                subject: "Please verify your email",
                mailgenContent: emailVerificationMailgenContent(
                    user.username,
                    `{req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedTokens}`
                )
            }
        )     

       const createdUser = await User.findById(user._id).select("-password -refreshToken  -emailVerificationToken -emailVerificationTokenExpiry");

       if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering a user")
       }

       return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user : createdUser},
                "User registered Successfully and verification email has been sent on your email"
            )
        )
});


export {registerUser};


