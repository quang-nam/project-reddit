
import { Field, ID, ObjectType } from 'type-graphql'
import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'
import { User } from './User'
import { Upvote } from './Upvote'


@ObjectType()
@Entity()
export class Post extends BaseEntity{
    @Field(_type=> ID)
    @PrimaryGeneratedColumn()
    id!: number


    @Field()
    @Column()
    title!: string

    // @Field({nullable: true})
    // @Column({nullable: true})
    @Field()
    @Column()
    userId!: number

    @Field()
    @ManyToOne(()=> User, user =>user.posts)
    user:User

    @OneToMany(_to=>Upvote, upvote=> upvote.post)
    upvotes: Upvote[]

    // upvote -down vote
    @Field()
    @Column({default:0})
    points!: number

    @Field()
    voteType!: number

    @Field()
    @Column()
    text!:string

    @Field()
    @CreateDateColumn({type:'timestamptz'})
    createdAt : Date 

    @Field()
    @UpdateDateColumn({type:'timestamptz'})
    updatedAt : Date
}