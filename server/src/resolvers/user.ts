import { User } from '../entities/User'
import {Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from 'type-graphql'
import argon2 from 'argon2'
import { UserMutationResponse } from '../types/UserMutationResponse'
import { RegisterInput } from '../types/RegisterInput'
import { validateRegisterInput } from '../utils/validateRegisterInput'
import { LoginInput } from '../types/LoginInput'
import { Context } from '../types/Context'
import { COOKIE_NAME } from '../constants'
import { ForgotPasswordInput } from '../types/ForgotPassword'
import { sendEmail } from '../utils/sendEmail'
import { TokenModel } from '../model/Token'
import {v4 as uuidv4} from 'uuid'
import { ChangePasswordInput } from '../types/ChangePasswordInput'
@Resolver(_of => User)
export class UserResolver{
    // bao ve email nguoi dung
    @FieldResolver(_returns => String)
      email(@Root() user:User, @Ctx(){req}:Context){
         return req.session.userId === user.id? user.email:''
      }
    @Query(_return => User,{nullable: true})
       async me(@Ctx() {req}:Context):Promise<User| undefined| null>{
         if(!req.session.userId ) return null;
         const user = await User.findOne(req.session.userId)
         return user
       }

    @Mutation(_returns =>UserMutationResponse,{nullable: true})
   async register(
       @Arg('registerInput') registerInput: RegisterInput,
       @Ctx() {req}:Context
    ):Promise<UserMutationResponse> {// khop voi returns ben tren 
        const validateRegisterInputError= validateRegisterInput(registerInput)
        if(validateRegisterInputError !== null){
            return {
                code: 400,
                success: false,
                ...validateRegisterInputError
            }
        }

       
        try{
        const {username, email, password}= registerInput
        const existingUser = await User.findOne({
            where:[{username},{email }]
        })
        if(existingUser) return {
            code: 400,
            success: false,
            message: 'Duplicate username or email',
            error:[
                {field:existingUser.username ===username ?'username':'email',
                message: `${existingUser.username === username ?
                'Username':'Email'}already exist`}
            ]
        }
        const hashedPassword = await argon2.hash(password)
        const newUser =  User.create({
            username, 
            password: hashedPassword,
            email
        })

           await User.save(newUser)
        // create new session
        req.session.userId= newUser.id

        return {
            code: 200,
            success: true,
            message:'User registration sucessful',
            user: newUser
        }
        
    }
        catch(err){
            return{
                code: 500,
                success: false,
                message: `Internal server error ${err.message}`
            }

        }
    }

    @Mutation(_returns => UserMutationResponse)
    async login(
        @Arg('loginInput'){usernameOrEmail, password}:LoginInput,
        @Ctx() {req}:Context
        ):Promise<UserMutationResponse>{
            try{
                const existingUser = await User.findOne({
                    where: usernameOrEmail.includes('@')
                    ? { email: usernameOrEmail }
                    : { username: usernameOrEmail }
                })
       
        if(!existingUser)
        return {
            code: 400,
            success: false,
            message:"User not found",
            error:[
                {field:'usernameOrEmail', message:'Username or email not correct'}
            ]
        }
        const passwordValid= await argon2.verify(existingUser.password, password)

        if(!passwordValid)
        return {
            code: 400,
            success: false,
            message:"Password not correct",
            error:[
                {field:'password', message:"Incorrect password"}
            ]
        }
        // create session and return cookie
        req.session.userId= existingUser.id
            // tạo userId: 1 
        return{
            code: 200,
            success: true,
            message:'User login successful',
            user:existingUser
        }

        }catch(err){
            return {
				code: 500,
				success: false,
				message: `Internal server error ${err.message}`
			}
        }
    }

    @Mutation(_returns => Boolean)
     logout(@Ctx() {req, res}: Context):Promise<boolean>{
        return new Promise((resolve, _reject)=>{
            res.clearCookie(COOKIE_NAME)
            req.session.destroy((err)=>{
                if(err){
                    console.log("ERROR WHEN LOGOUT", err)
                    resolve(false)
                }else{
                    console.log("LOGOUT OK")
                    resolve(true)
                }
            })
        })
    }
    @Mutation(_returns => Boolean)
    async forgotPassword(
        @Arg('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput)
        :Promise<boolean>
        {
            const user = await User.findOne({email: forgotPasswordInput.email})
            if(!user) return true;
            // make sure to find only 1 user 
            await TokenModel.findOneAndDelete({userId: `${user.id}`})
            // token reset randomly 
            const resetToken = uuidv4()
            const hashRestToken = await argon2.hash(resetToken)

          
            // save token to db ( with userId)
            await new TokenModel({userId:`${user.id}`, token:hashRestToken}).save()
            // send reset password link via user mail
            // after user input there password, connect from font-end to server to change their password 
            // bản ghi sẽ được xóa khỏi db sau 15 ph
            await sendEmail(forgotPasswordInput.email,
                `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${user.id}">Click here to reset your password</a>`
                )
            return true;
    }   

    @Mutation(_returns=> UserMutationResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('userId') userId: string,
        @Arg('changePasswordInput') changePasswordInput: ChangePasswordInput
    ): Promise<UserMutationResponse> {
        if(changePasswordInput.newPassword.length <=2){
            return{
                code: 400,
                success: false,
                message:'Invalid password',
                error:[
                    {field:'newPassword',
                    message:'Length must be greater than 2'}
                ]
            }
        }
        try {
            // take reset password record 
            const resetPassWordRecord = await TokenModel.findOne({userId})
            if(!resetPassWordRecord){
                return{
                    code: 400,
                    success: false,
                    message:'Invalid or expired password reset token',
                    error:[
                        {field:'token',
                        message:'Invalid or expired password reset token'}
                    ]
                }
            }
            // verify password token argument and token from the db
            
            const resetPasswordTokenValid = argon2.verify(resetPassWordRecord.token, token)
            if(!resetPasswordTokenValid){
                return{
                    code: 400,
                    success: false,
                    message:'Invalid or expired password reset token',
                    error:[
                        {
                            field:'token',
                            message:'Invalid or expired password reset token'
                        }
                    ]
                }
            }
            // userid
            const userIdNum = parseInt(userId)
            const user= await User.findOne(userIdNum)
            if(!user){
                return{
                    code: 400,
                    success: false,
                    message:"User no longer exist",
                    error:[
                        {
                            field:'token',
                            message:'User no longer exist'
                        }
                    ]
                }
            }
            // save db
            const updatePassword = await argon2.hash(changePasswordInput.newPassword)
            await User.update({id: userIdNum}, {password: updatePassword})
            // delete resetpassword
            await resetPassWordRecord.deleteOne()
            return{
                code: 200,
                success: true,
                message:'User password reset successfully',
                user
            }
        } catch (error) {
            console.log(error)
			return {
				code: 500,
				success: false,
				message: `Internal server error ${error.message}`
			}
        }
    }

}