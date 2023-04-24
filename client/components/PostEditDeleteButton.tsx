import { useDeletePostMutation, useMeQuery } from "@/src/gql/graphql"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, IconButton } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"


interface PostEditDeleteButtonId{
  postId: string,
  postOwnerId: string
}
const PostEditDeleteButton = ({postId, postOwnerId}:PostEditDeleteButtonId) => {
  const router= useRouter()
  const {data: meData}= useMeQuery()
  const [deletePost]= useDeletePostMutation()
  const onPostDelete=async(postId: string) => {
    await deletePost({
      variables: {
        id: postId
      },
      update(cache,{data}){
        if(data?.deletePost.success){
          cache.modify({
            fields:{
              posts(
                existing
              ){
                const newPostsAfterDeletion={
                  ...existing,
                  totalCount: existing.totalCount-1,
                  paginatedPosts: existing.paginatedPosts.filter(
                    (postRefObject:any) => postRefObject.__ref !== `Post:${postId}`
                  )
                }
                return newPostsAfterDeletion
              }
            }
          })
        }
      }
    })
     if(router.route !=='/') router.push("/")
  }
   if(meData?.me?.id !== postOwnerId) return null
  return (
    <Box>
      <Link href={`/post/edit/${postId}`}>
        <IconButton aria-label='Edit' icon={<EditIcon/>} mt={4} />
      </Link>
    
        <IconButton 
          aria-label='Delete' 
          icon={<DeleteIcon/>}
           mt={4} 
           colorScheme="blue"
           onClick={onPostDelete.bind(this, postId)}
        />

    </Box>
  )
}

export default PostEditDeleteButton