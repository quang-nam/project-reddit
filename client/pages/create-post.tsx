import InputField from "@/components/InputField"
import Layout from "@/components/Layout"
import { CreatePostInput, useCreatePostMutation } from "@/src/gql/graphql"
import { useCheckAuth } from "@/utils/useCheckAuth"
import { Box, Button, Flex, Spinner } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import Link from "next/link"
import router from "next/router"



const CreatePost = () => {
    const {data:authData, loading:authLoading}=useCheckAuth()
    const initialValues = { title: '', text: '' }
    const [createPost,_]= useCreatePostMutation()
    const onCreatePostSubmit= async(values: CreatePostInput)=>{   
        await createPost({
			variables: { createPostInput: values },
			update(cache, { data }) {
				cache.modify({
					fields: {
						posts(existing) {
							if (data?.createPost.success && data.createPost.post) {
								// Post:new_id
								const newPostRef = cache.identify(data.createPost.post)

								const newPostsAfterCreation = {
									...existing,
									totalCount: existing.totalCount + 1,
									paginatedPosts: [
										{ __ref: newPostRef },// dua len tren dau 
										...existing.paginatedPosts // [{__ref: 'Post:1'}, {__ref: 'Post:2'}]
									]
								}

								return newPostsAfterCreation
							}
						}
					}
				})
			}
		})
        router.push('/')    
     }
  if(authLoading || (!authLoading && !authData?.me)){
  return (
    <Flex justifyContent='center' alignItems='center' minH='100vH'>
        <Spinner/>
    </Flex>
  )
} else{
    return(
   <Layout>
        <Formik initialValues={initialValues}onSubmit={onCreatePostSubmit}>
            {({isSubmitting})=>(
                <Form>
                    <InputField 
                        name='title' 
                        placeholder='Title' 
                        label='Title' 
                        type='text'
                    />
                    
                <Box mt={4}>
                    <InputField
						textarea
						name='text'
						placeholder='Text'
						label='Text'
						type='textarea'
					/>
                </Box>
                <Flex justifyContent='space-between' alignItems='center' mt={4}>
						<Button
							type='submit'
							colorScheme='teal'
						    isLoading={isSubmitting}
						>
							Create Post
						</Button>
						<Link href='/'>
							<Button colorScheme="teal">Go back to Homepage</Button>
						</Link>
				</Flex>
                </Form>         
            )}
        </Formik>
   </Layout>
 )}
}
export default CreatePost