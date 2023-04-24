import Layout from "@/components/Layout";
import PostEditDeleteButton from "@/components/PostEditDeleteButton";
import UpvoteSection from "@/components/UpvoteSection";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { PostsDocument, useMeQuery, usePostsQuery } from "@/src/gql/graphql";
import { NetworkStatus } from "@apollo/client";
import { Box, Button, Flex, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Link from "next/link";

export const limit =3;
export default function Home() {
  const{data:meData}=useMeQuery()
  const {data, loading, fetchMore,networkStatus}= usePostsQuery({
    variables:{limit},
    // component nao render boi cai Posts query, se rerender lai khi network status khong doi
    notifyOnNetworkStatusChange: true
  })// doc ra tu cache 

  const loadingMorePosts = networkStatus == NetworkStatus.fetchMore // network status thay doi 
  const loadMorePosts=()=> fetchMore({variables:{cursor: data?.posts?.cursor}})
  return (
      <Layout>
        {loading && !loadingMorePosts?(
          <Flex justifyContent='center' alignItems='center' minH='100vH'>
            <Spinner/>
          </Flex>
        ):(
         <Stack spacing={8}>
            {data?.posts?.paginatedPosts.map(post =>(
              <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
                <UpvoteSection post={post}/>
                <Box flex='1'>
                  <Link href={`/post/${post.id}`}>
                    <Heading fontSize='xl'>{post.title}</Heading>
                  </Link>
                  <Text mt={4}>posted by {post.user.username}</Text>
                  <Flex align='center'>
                    <Text mt={4}>{post.textSnippet}</Text>
                    <Box ml='auto'>         
                      <PostEditDeleteButton 
                      postId={post.id}
                      postOwnerId={post.user.id}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            ))}
         </Stack>
        )}

        {data?.posts?.hasMore &&(
            <Flex>
              <Button m='auto'
                my={8}
                isLoading={loadingMorePosts}
                onClick={loadMorePosts}>
                  {loadingMorePosts ?'Loading':'Show more'}
                </Button>
            </Flex>
        )}
      </Layout>
     
   
  )}

export const getServerSideProps:GetServerSideProps= async(
  context: GetServerSidePropsContext
)=>{
  const apolloClient = initializeApollo()
  await apolloClient.query({
    query: PostsDocument,
    variables:{
      limit
    }
  })
  return addApolloState(apolloClient,{
    props:{}
  })
}
