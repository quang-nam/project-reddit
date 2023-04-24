import { createPostInput } from "../types/createPostInput";
import { Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root, UseMiddleware, registerEnumType } from "type-graphql";
import { PostMuationResponse } from "../types/PostMutationResponse";
import { Post } from "../entities/Post";
import { UpdatePostInput } from "../types/updatePostInput";
import { checkAuth } from "../middleware/checkAuth";
import { User } from "../entities/User";
import { PaginatedPosts } from "../types/PaginatedPosts";
import { LessThan } from "typeorm";
import { Context } from "../types/Context";
import { __Type } from "graphql";
import { VoteType } from "../types/VoteType";
import { UserInputError } from "apollo-server-express";
import { Upvote } from "../entities/Upvote";

registerEnumType(VoteType, {
    name: "VoteType", // this one is mandator
  });


@Resolver(_of => Post)
export class PostResolver{
    @FieldResolver(_returns => String)
     // lay ra tu database tu 1 hay nhieu truong ntn ko 
       textSnippet(@Root() root: Post){
        return root.text.slice(0,80)
       }

       @FieldResolver(_returns => User)
        async user(@Root() root: Post){
            return await User.findOne(root.userId)
        }
        @FieldResolver(_returns=>VoteType)
         async voteType(@Root() root: Post, @Ctx(){req}:Context){
            // tra lai dang vote tuong ung 
            // chua log in
            if(!req.session.userId) return 0;
            // log in roi 
            const existingVote = await Upvote.findOne({
                postId: root.id,
                userId: req.session.userId
            })
            return existingVote? existingVote.value: 0;
         }
    @Mutation(_returns => PostMuationResponse)
    @UseMiddleware(checkAuth)
    async createPost(
        @Arg('createPostInput'){title, text}:createPostInput,
        @Ctx(){req}:Context):Promise<PostMuationResponse>{
        try{
            const newPost = Post.create({
               title,
               text,
               userId: req.session.userId
            })
            await Post.save(newPost);
            return{
                code:200,
                success:true,
                message: "Create post successfully",
              
            }
        }catch(err){
            return{
                code: 500,
                success:false,
                message:"Internal Server Error"
            }
        }
    }

    @Query(_returns =>PaginatedPosts,{nullable:true})
    async posts(
        @Arg('limit',__type=>Int) limit: number,
        @Arg('cursor',{nullable: true}) cursor?: string
    ):Promise<PaginatedPosts| null>{
        try {
            // Post.find({
            //     where:{
            //         createdAt: LessThan(cursor)
            //     },
            //     order:{
            //         createdAt: 'DESC'
            //     },
            //     take: 1
            // })
          
            const totalPostCount = await Post.count()
            const realLimit= Math.min(10, limit)
            const findOptions: {[key: string]: any}= {
                order: {
                    createdAt:'DESC',
                }, 
                take: realLimit // the number of results to return
            }
        

            let lastPost: Post[]=[]
            if(cursor){ // position of cursor 
                findOptions.where= {createdAt: LessThan(cursor)}
                lastPost= await Post.find({
                    order: {
                        createdAt: 'DESC'
                    }, take: 1
                })
            }
            const posts = await Post.find(findOptions)
            return {
                totalCount: totalPostCount,
                cursor: posts[posts.length-1].createdAt,
                // so sanh phai dua ve string vi date ko so sanh dc
                hasMore: cursor? 
                        posts[posts.length-1].createdAt.toString() !==
                        lastPost[0].createdAt.toString():
                        posts.length !== totalPostCount,
                paginatedPosts: posts
            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    @Query(_returns => Post,{nullable:true})
    async post(
        // @Arg (dinh nghia type cho graphql)
        @Arg('id',_type=>ID) id:number 
    ):Promise<Post | undefined>{
        try {
            const post = await Post.findOne(id);
            return post
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    // update post
    @Mutation(_return => PostMuationResponse)
    @UseMiddleware(checkAuth)
    async updatePost(
        @Arg('updatePostInput') updatePostInput: UpdatePostInput,@Ctx(){req}:Context
    ):Promise<PostMuationResponse>{
        const {id, title, text} = updatePostInput;
        const existingPost = await Post.findOne(id);
        if(!existingPost)
          return{
            code: 400,
            success: false,
            message:"Can not find your post"
          }
        if(existingPost.userId !== req.session.userId){
            return{
                code: 401,
                success: false,
                message:"Unauthorized to update the post"
            }
        }
        // update post 
        existingPost.title= title;
        existingPost.text= text;

        await existingPost.save();
        return{
            code: 200,
            success: true,
            message:"Post updated successfully",
            post: existingPost
        }
    }

    @Mutation(_returns => PostMuationResponse)
    @UseMiddleware(checkAuth)
    async deletePost(
        @Arg('id', _types => ID) id: number,
        @Ctx(){req}:Context
    ):Promise<PostMuationResponse>{

        const existingPost = await Post.findOne(id)
        if(!existingPost)
            return{
                code: 400,
                success: false,
                message:"Can not find your post"
            }

            if(existingPost.userId !== req.session.userId){
                return{
                    code: 401,
                    success: false,
                    message:"Unauthorized to update the post"
                }
            }
        await Post.delete(id)
        return {
            code: 200,
            success: true,
            message:"Delete post successfully",
            post: existingPost
        }
    }
    @Mutation(_return => PostMuationResponse)
	@UseMiddleware(checkAuth)
	async vote(
        @Arg('postId',_type=> Int) postId: number,
        @Arg('inputVoteValue',_type=>VoteType) inputVoteValue:VoteType,
        @Ctx(){
            req: {
                session: {userId}
            }, connection
        }:Context
    ):Promise<PostMuationResponse>{
        return await connection.transaction(async TransactionEntityManager=>{
            // check if the post exists
            let post = await TransactionEntityManager.findOne(Post,postId)
            if(!post) throw new UserInputError('Post not found')
            // check if user has voted or not 
            const existingPost = await TransactionEntityManager.findOne(Upvote,{
                postId,
                userId
            })
            if(existingPost && existingPost.value !== inputVoteValue){
                await TransactionEntityManager.save(Upvote,{
                    ...existingPost,
                    value: inputVoteValue
                })
            // cap nhat diem ben Post
            post.points= post.points + 2* inputVoteValue
            post = await TransactionEntityManager.save(post)
            }
            // not found existing post
            if(!existingPost){
                const newPost = TransactionEntityManager.create(Upvote,{
                    userId,
                    postId,
                    value: inputVoteValue
                })
                await TransactionEntityManager.save(newPost)
                post.points= post.points+ inputVoteValue
                post= await TransactionEntityManager.save(post)
            }
            return{
                code: 200,
                success: true,
                message: 'Post voted',
                post
            }
        }
      )
    }
}