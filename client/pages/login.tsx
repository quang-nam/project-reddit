import InputField from "@/components/InputField"
import Wrapper from "@/components/Wrapper"
import { mapFieldErrors } from "@/helpers/mapFieldErrors"
import { LoginInput, MeDocument, MeQuery, useLoginMutation } from "@/src/gql/graphql"
import { useCheckAuth } from "@/utils/useCheckAuth"
import { Box, Button, Flex, Spinner } from "@chakra-ui/react"
import { Form, Formik, FormikHelpers } from "formik"
import { useToast } from '@chakra-ui/react'
import { useRouter } from "next/router"
import Link from "next/link"

 const Login =()=>{
  const router = useRouter()// lay router hien tai
  const {data:AuthData, loading: AuthLoading}= useCheckAuth()
  const toast = useToast()
  const initialValue: LoginInput = {
    usernameOrEmail:'',
    password: ''
  }
  const [loginUser, {loading:_loadingLoginUser, error}]= useLoginMutation()
  const onLoginSubmit=async (
    values: LoginInput,
    {setErrors}:FormikHelpers<LoginInput>
  )=>{
    const response = await loginUser({
      variables:{
        loginInput: values
      },
      update(cache, { data }) {
				console.log('DATA LOGIN', data)

				// const meData = cache.readQuery({ query: MeDocument })
				// console.log('MEDATA', meData)

				if (data?.login?.success) {
					cache.writeQuery<MeQuery>({
						query: MeDocument,
						data: { me: data.login.user }
					})
				}
			}
		})
  
    if(response.data?.login?.error){
      setErrors(mapFieldErrors(response.data.login?.error))
    }else{
      toast({
        title: `Welcome ${response.data?.login?.user?.username}`,
        description: "Login is successful",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })   
        router.push('/')
    }}
   
  return(
    <>
    {
      AuthLoading && (!AuthLoading && AuthData?.me) ? 
      ( 
      <Flex justifyContent='center' alignItems='center' minH='100vH'>
      <Spinner/>
    </Flex>
         )
      :
      (<Wrapper size="small">
      {error && <p>Failed to login, internal server error</p>}  
      <Formik initialValues={initialValue} onSubmit={onLoginSubmit}>
          {
            ({isSubmitting})=>(
              <Form>
                <InputField
                 name='usernameOrEmail' 
                 placeholder='Username or Email'
                label='Username or Email'
                 type='text'                
                />
              <Box mt={4}/>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
              <Flex mt={2}>
                <Link href="/forgot-password">Forgot password</Link>
              </Flex>
              <Box mt={2}/>
             
              <Button type="submit" colorScheme='teal' mt={4} isLoading={isSubmitting}>
                Login
              </Button>
              
              </Form>

            )
          }
      </Formik>
    </Wrapper>)
    }
   
  </>
  )

 }

 export default Login;