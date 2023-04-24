import { FieldError } from "@/src/gql/graphql";

export const mapFieldErrors= (errors: FieldError[]):{[key:string]: string}=>{
   return errors.reduce((accumulatedError, error)=>(
        {
            ...accumulatedError,
            [error.field]:error.message
        }
   ),{})
}