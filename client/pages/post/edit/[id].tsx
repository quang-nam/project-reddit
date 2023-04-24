import InputField from "@/components/InputField"
import Layout from "@/components/Layout"
import { UpdatePostInput, useMeQuery, usePostQuery, useUpdatePostMutation } from "@/src/gql/graphql"
import { Alert, AlertIcon, AlertTitle, Box, Button, Flex, Spinner } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import Link from "next/link"
import { useRouter } from "next/router"


const PostEdit = () => {
  const router = useRouter()
  const postId= router.query.id as string 
  const {data:meData, loading:meLoading}= useMeQuery()
  const{data, loading:postLoading}= usePostQuery({
    variables:{id: postId}
  })
  const initialValue ={
    title: data?.post?.title as string,
    text: data?.post?.text as string
  }

  const [updatePost,_]= useUpdatePostMutation()
  const onUpdatePostSubmit=async(values: Omit<UpdatePostInput,'id'>)=>{
     await updatePost({
      variables:{
        updatePostInput:{
          id: postId,
          ...values
        }
      }
     })
     console.log('update post',updatePost)
     router.back()
  }
  if(meLoading || postLoading){
    <Layout>
            <Flex justifyContent='center' alignItems='center' minH='100vh'>
                <Spinner />
            </Flex>
    </Layout>
  }
  // khong tim duoc post
  if(!data?.post)
    return(
      <Layout>
          <Alert status="error">
            <AlertIcon/>
            <AlertTitle>Post not found</AlertTitle>
          </Alert>
          <Box mt={4}>
					<Link href='/'>
						<Button>Back to Homepage</Button>
					</Link>
				</Box>
      </Layout>
    )
    // tim duoc post check userId 
  if(!meLoading && !postLoading && meData?.me?.id !== data?.post?.userId.toString())
  return (
      <Layout>
      <Alert status="error">
          <AlertIcon/>
          <AlertTitle>Unauthorized to edit</AlertTitle>
      </Alert>
      <Box mt={4}>
          <Link href='/'>
              <Button>Back to homepage</Button>
          </Link>
      </Box>
  </Layout>
  )

  return (
    <div>
      <Layout>
      <Formik initialValues={initialValue} onSubmit={onUpdatePostSubmit}>
          {
            ({isSubmitting})=>(
              <Form>
                <InputField
                 name='title' 
                 placeholder='Title'
                label='title'
                 type='text'                
                />
              <Box mt={4}/>
              <InputField
                textarea
                name="text"
                placeholder="Text"
                label="text"
                type="textarea"
              />
              <Flex mt={4} justifyContent='space-between' alignItems='center'>
                <Link href="/">
                 <Button colorScheme="teal">Back to HomePage</Button>
                </Link>
                
              <Button type="submit" colorScheme='teal' isLoading={isSubmitting}>
                Update Post
              </Button>
              </Flex>
              </Form>

            )
          }
      </Formik>
      </Layout>
    </div>
  )
}

export default PostEdit