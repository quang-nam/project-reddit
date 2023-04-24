import Layout from "@/components/Layout"
import PostEditDeleteButton from "@/components/PostEditDeleteButton"
import { addApolloState, initializeApollo } from "@/lib/apolloClient"
import { PostDocument, PostIdsDocument, PostIdsQuery, PostQuery, usePostQuery } from "@/src/gql/graphql"
import { Alert, AlertIcon, AlertTitle, Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react"
import { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { limit } from "../index"


const Post = () => {
    const router = useRouter()
    const {data, loading, error}= usePostQuery({
        variables:{id:router.query.id as string}})
    if(loading){
        return (
        <Layout>
            <Flex justifyContent='center' alignItems='center' minH='100vh'>
                <Spinner />
            </Flex>
        </Layout>
        )  
    }
    if(error || !data?.post){
        return(
            <Layout>
                <Alert status="error">
                    <AlertIcon/>
                    <AlertTitle>{error ? error.message:"Post not found"}</AlertTitle>
                </Alert>
                <Box >
                    <Link href='/'>
                        <Button>Back to homepage</Button>
                    </Link>
                   
                </Box>
            </Layout>
        )
    }
  return (
     <Layout>
        <Heading mb={4}>{data.post.title}</Heading>
        <Box mb={4}>{data.post.text}</Box>
        <Flex mt={4} justifyContent='space-between' alignItems='center'>
            <PostEditDeleteButton postId={data.post.id} postOwnerId={data.post.userId.toString()}/>
            <Link href='/'>
                <Button colorScheme="teal">Back to Homepage</Button>
            </Link>
            
        </Flex>
     </Layout>
  )
}
// trc khi co duong link dong 
export const getStaticPaths:GetStaticPaths= async()=>{
    //[
    // {params: {id: '15'}}
    // {params: {id: '16'}}
    //]
    const apolloClient = initializeApollo()

	const { data } = await apolloClient.query<PostIdsQuery>({
		query: PostIdsDocument,
		variables: { limit }
	})

	return {
		paths: data.posts!.paginatedPosts.map(post => ({
			params: { id: `${post.id}` }
		})),
		fallback: 'blocking'// load xong moi render 
	}
}
export const getStaticProps:GetStaticProps<
        { [key: string]: any },
        { id: string }
> = async(context)=>{
    const apolloClient = initializeApollo()

	await apolloClient.query<PostQuery>({
		query: PostDocument,
		variables: { id: context.params?.id }
	})

	return addApolloState(apolloClient, { props: {} })
}

export default Post