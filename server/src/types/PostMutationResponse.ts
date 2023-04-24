import { Post } from "../entities/Post";
import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./FieldError";
import { IMutationResponse } from "./MutationResponse";

@ObjectType({implements: IMutationResponse})
export class PostMuationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string | undefined;

    @Field({nullable: true})
    post ?: Post

    @Field(_type =>[FieldError],{nullable: true})
     error?: FieldError[]
     
}