import {User} from '../models/user.model.js';
import { ApiResponse } from "../utils/api_response.js";
import { ApiError } from "../utils/api_error.js";
import { asyncHandler } from "../utils/async-handlers.js";
import { sendEmail, emailVerificationMailgenContent, forgotPasswordMailgenContent } from "../utils/mail.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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
const registerUser = asyncHandler(async (req, res) => {
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
                mailgenContent:emailVerificationMailgenContent(
                    user.username,
                    `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedTokens}`
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

const login = asyncHandler(async (req, res) => {
    const {email, password, username} = req.body;

    if(!email){
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken  -emailVerificationToken -emailVerificationTokenExpiry");

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {user: loggedInUser, accessToken, refreshToken},
                "User logged in successfully"
            )
        )
       


});

const logoutUser = asyncHandler(async (req, res)=> {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null,
            },
        },
        {
            new: true,
        },
    );
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )
 });

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        )
});


const verifyEmail = asyncHandler(async (req, res) => {
    const {verificationToken} = req.params

    if(!verificationToken){
        throw new ApiError(400, "Email verification token is missing");
    }

    let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken, 
        emailVerificationTokenExpiry: {$gt: Date.now()}
    });

    if(!user){
        throw new ApiError(400, "Invalid email verification token or expired token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified: true,
                },
                "Email verified successfully"
            )
        )
});

const resendEmailVerification = asyncHandler(async (req, res) => {
        const user = await User.findById(req.user?._id);

        if(!user){
            throw new ApiError(404, "User does not exist");
        }

        if(user.isEmailVerified){
            throw new ApiError(409, "Email is already verified");
        }

        const {unHashedTokens, hashedToken, tokenExpiry} = 
        user.generateTemporaryToken();

        user.emailVerificationToken = hashedToken;
        user.emailVerificationTokenExpiry = tokenExpiry;

        await user.save({validateBeforeSave: false});

        await sendEmail(
            {
                email: user?.email,
                subject: "Please verify your email",
                mailgenContent:emailVerificationMailgenContent(
                    user.username,
                    `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedTokens}`
                )
            }
        )

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Verification email has been sent on your email"
            )
        )

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized access, refresh token is missing");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(404, "Invalid refresh token, user does not exist");
        }
        
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired");
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const {accessToken, refreshToken: newRefreshToken} = await 
        generateAccessAndRefreshTokens(user._id);

        user.refreshToken = newRefreshToken;
        await user.save()

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed successfully"
            )
        )

    }
    catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }

})


const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "User does not exist");
    }   

    const {unHashedTokens, hashedToken, tokenExpiry} = 
    user.generateTemporaryToken();

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false});

    await sendEmail(
        {
            email: user?.email,
            subject: "Reset your password",
            mailgenContent:forgotPasswordMailgenContent(
                user.username,
                `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedTokens}`
            )
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset email has been sent on your email id"
            )
        )

});


const resetForgotPassword = asyncHandler(async (req, res) => 
{
    const {resetToken  } = req.params;
    const {newPassword} = req.body;

    let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new ApiError(400, "Invalid or expired reset token");
    }

    user.forgotPasswordTokenExpiry = undefined;
    user.forgotPasswordToken = undefined;

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password has been reset successfully"
            )
        )

});


const changeCurrentPassword = asyncHandler(async (req, res) => 
{
    const {currentPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password has been changed successfully"
            )
        )
    
});


export {
    registerUser, 
    login, 
    logoutUser, 
    verifyEmail, 
    getCurrentUser, 
    resendEmailVerification,
    refreshAccessToken,
    forgotPasswordRequest,
    resetForgotPassword,
    changeCurrentPassword
};


