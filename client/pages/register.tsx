import InputField from "@/components/InputField"
import Wrapper from "@/components/Wrapper"
import { mapFieldErrors } from "@/helpers/mapFieldErrors"
import { MeDocument, MeQuery, RegisterInput, useRegisterMutation } from "@/src/gql/graphql"
import { useCheckAuth } from "@/utils/useCheckAuth"
import { Box, Button, Flex, FormControl, Spinner, useToast } from "@chakra-ui/react"
import { Form, Formik, FormikHelpers } from "formik"
import { useRouter } from "next/router"

const Register = () => {
   const router = useRouter()
   const {data:AuthData, loading:AuthLoading}= useCheckAuth()
   const toast = useToast()
    const initialValues:RegisterInput={username:'',email:'', password:''}
    const [registerUser, {loading:_registerUserLoading,data, error}]= useRegisterMutation()
    const onRegisterSubmit=async(
      values:RegisterInput,
      {setErrors}:FormikHelpers<RegisterInput>)=>{
      const response = await registerUser({
        variables:{
          registerInput: values
        }, update(cache, {data}){
          console.log('data register', data)
          if(data?.register?.success){
            cache.writeQuery<MeQuery>({
              query: MeDocument,
              data:{ me: data.register.user}
            })
          }
        }
      })
      console.log(response)
      if(response.data?.register?.error)
      {
        setErrors(mapFieldErrors(response.data?.register?.error))
      }else if(response.data?.register?.user){
        // register successfully
        toast({
          title: `Welcome ${response.data?.register?.user.username}`,
          description: "Register is successful",
          status: 'success',
          duration: 3000,
          isClosable: true,
        })   
        router.push('/')
      }
    }
  return (
    <>
    {
      AuthLoading && (!AuthLoading && AuthData?.me) ?
      ( <Flex justifyContent='center' alignItems='center' minH='100vH'>
          <Spinner/>
        </Flex> )
      :
      ( <Wrapper size="small">
        {error && <p>Failed to register</p>}
        {data  && data.register?.success && <p>Register successfully</p>}
           <Formik 
           initialValues ={initialValues}
           onSubmit={onRegisterSubmit}>
          { 
              ({isSubmitting})=>(
                <Form>
                  <FormControl>
                    <InputField      
                    placeholder="Username"
                    label="Username"
                    name="username"
                    type="text"
                    />
                  <Box mt={4}>
                    <InputField
                     name="email"
                     label="Email"
                     type="text"
                     placeholder="Email"
                    />
                  </Box>
                  <Box mt={4}>
                    <InputField
                    placeholder="Password"
                    label="Password"
                    name="password"
                    type="password"
                    />
                    </Box>
                    <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>
                      Register
                    </Button>
                  </FormControl>
              
                </Form>
              )
          }
          
      </Formik>
      </Wrapper>)
    }
    </>
   
   
  )
}

export default Register