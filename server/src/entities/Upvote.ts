
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Upvote extends BaseEntity{
    // phan biet cac ban ghi voi nhau 
    @PrimaryColumn()
    userId!: number;
    @PrimaryColumn()
    postId!: number;
    // bang trung gian 1 nhieu 
    @ManyToOne(_to => Post, post=> post.upvotes)
    post!: Post

    // tao user
    @ManyToOne(_to => User, user=> user.upvotes)
    user!: User
    @Column()
    value!: number;
}