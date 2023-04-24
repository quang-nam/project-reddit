import { ObjectType , Field} from "type-graphql";

@ObjectType()// transform to each type of grapql
export class FieldError{
    @Field()
    field: string

    @Field()
    message: string
}