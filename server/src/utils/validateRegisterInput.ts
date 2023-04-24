import { RegisterInput } from "../types/RegisterInput";

export const validateRegisterInput = (registerInput: RegisterInput)=>{
        if(!registerInput.email.includes('@'))
            return {
                message: 'Invalid email',
                error: [
                    {field: 'email', message: 'Email must include @ symbol'}
                ]
            }

            if(registerInput.username.includes('@'))
            return {
                message: 'Invalid username',
                error: [
                    {field: 'username', message: 'Username can not include @ symbol'}
                ]
            }

        if(registerInput.username.length <=2)
        return {
            message: 'Invalid username',
            error: [
                {field: 'username', message:'Length must be greater than 2'}
            ]
        }

        if(registerInput.password.length <=8)
        return {
            message: 'Invalid password',
            error: [
                {field: 'password', message:'Length must be greater than 8'}
            ]
        }
        return null
}