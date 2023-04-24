import { ObjectType, Field, ID} from 'type-graphql'
import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm'
import { Post } from './Post'
import { Upvote } from './Upvote'

@ObjectType()// noi chuyen tu type sang grapql 
@Entity()// db table noi chuyen tu type sang postgresql
export class User extends BaseEntity{
    @Field(_type => ID) // dac trung cho thang orm
    @PrimaryGeneratedColumn()
    id!: number
    
    @Field(_type => String)
    @Column({unique: true})// 1 cot trong database change ts -> sql
    username! : string

    @Field()
    @Column({unique: true})
    email! : string

    @Column()
    password! : string

    @OneToMany(()=> Post, post => post.user)
    posts: Post[]

    @OneToMany(_to =>Upvote, upvote=> upvote.user)
    upvotes: Upvote[]
    
    @Field()
    @CreateDateColumn()
    createdAt : Date 

    @Field()
    @UpdateDateColumn()
    updatedAt : Date
}