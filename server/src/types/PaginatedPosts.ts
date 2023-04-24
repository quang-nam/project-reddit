import { Post } from "../entities/Post";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PaginatedPosts{
    @Field()
    // total posts 
    totalCount: number;

    @Field(_type => Date)
    // 5 post, con tro o post thu 5 => hien tai post thu 5 roi 
    cursor!: Date 

    @Field()
    hasMore!: boolean

    @Field(_type => [Post])
    // danh sach post chinh thuc
    paginatedPosts!:Post[]
    
}