require('dotenv').config()
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { COOKIE_NAME, __prod__ } from './constants'
import { Post } from './entities/Post'
import { User } from './entities/User'
import { HelloResolvers } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import { Context } from './types/Context'
import { Upvote } from './entities/Upvote'
const main = async()=>{
   const connection = await createConnection(
        {
            type:'postgres',
            database:'reddit',
            username:process.env.DB_USERNAME,
            password:process.env.PASSWORD,
            logging: true,
            synchronize: true,// tu dong up len db cua mk luon 
            entities:[User,Post,Upvote] // check bang co chua neu ko co thi tu tao
        }
    )
    
    const app= express()
  
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials:true
    }))
    const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@reddit.v5hihuc.mongodb.net/?retryWrites=true&w=majority`

    await mongoose.connect(mongoUrl)
    console.log('Connect succesfully')
    
    app.use(session({
        name: COOKIE_NAME,
        store: MongoStore.create({ mongoUrl }),
        cookie:{
            maxAge: 1000*60, // 1 hour
            httpOnly: true,// js front end can not read cookies
            secure: __prod__,// cookies only work in https
            sameSite:'lax',// protection against crsf
    
        },
        secret: process.env.SESSION_SECRET_DEV_PROD as string,// ma hoa cho ra value of cookie
        saveUninitialized: false, // don't create session until something stored, not save right from the start
        resave: false, //don't save session if unmodified

      }));
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolvers, UserResolver,PostResolver],
            validate: false
        }),// lây thông tin từ req gửi lên để lấy thông tin ai đang gửi request từ resolver
        context:({req,res}):Context =>({req,res, connection}),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({app, cors: false})
  
    const Port= process.env.PORT || 4000
    app.listen(Port, ()=>
        console.log(`Server started on port ${Port}, graphql server started on localhost:${Port}${apolloServer.graphqlPath}`
    ))
}
    
main()
    . catch(err=>console.log(err))