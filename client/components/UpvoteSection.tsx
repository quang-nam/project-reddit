import { PostWithUserInfoFragment, VoteType, useVoteMutation } from "@/src/gql/graphql"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { Flex, IconButton } from "@chakra-ui/react"
import { useState } from "react"

interface UpvoteSectionProps{
 post: PostWithUserInfoFragment
}
enum VoteTypeValues{
    Upvote =1 ,
    Downvote= -1
}
const UpvoteSection = ({post}:UpvoteSectionProps) => {
    const [vote, {loading}]= useVoteMutation()
    const [loadingState, setLoadingState]= useState<
    'upvote-loading'|'downvote-loading'|'not-loading'>('not-loading')
    const upvote = async(postId: string)=>{
        setLoadingState('upvote-loading')
        await vote({
            variables:{inputVoteValue:VoteType.Upvote, postId:parseInt(postId)}
        })
    }
    const downVote = async(postId: string)=>{
        setLoadingState('downvote-loading')
        await vote({
            variables:{inputVoteValue: VoteType.Downvote, postId:parseInt(postId)}
        })
    }
  return (
    <Flex direction='column' alignItems='center' mr={4}>
        <IconButton 
            icon={<ChevronUpIcon/>} 
            aria-label="upvote" 
            onClick={upvote.bind(this, post.id)}
            isLoading={loading && loadingState==='upvote-loading' }/>
        {post.points}
        <IconButton 
            icon={<ChevronDownIcon/>} 
            aria-label="downvote"
            onClick={downVote.bind(this,post.id)}
            isLoading={loading && loadingState==='downvote-loading'}/>
    </Flex>
  )
}

export default UpvoteSection