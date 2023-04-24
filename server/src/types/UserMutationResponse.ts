import { User } from "../entities/User";
import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./FieldError";
import { IMutationResponse } from "./MutationResponse";

@ObjectType({implements: IMutationResponse})
export class UserMutationResponse implements IMutationResponse{
    success: boolean;
    message?: string | undefined;
    code:number 

    @Field({nullable: true})
    user?: User

    @Field(_type => [FieldError], {nullable:true})// array 2 dau 
    error?:FieldError[]
}