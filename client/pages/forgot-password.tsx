import InputField from "@/components/InputField"
import Wrapper from "@/components/Wrapper"
import { ForgotPasswordInput, useForgotPasswordMutation } from "@/src/gql/graphql"
import { useCheckAuth } from "@/utils/useCheckAuth"
import { Box, Button, Flex, Spinner } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { default as Link } from "next/link"

const ForgotPassWord = () => {
    const {data: AuthData, loading: AuthLoading}= useCheckAuth()
    const initialValues={email:''}
    const [forgotpassword, {loading, data}]= useForgotPasswordMutation()
    const onForgotPassWordSubmit = async(values: ForgotPasswordInput)=>{
        await forgotpassword({
            variables: {forgotPasswordInput: values}
        })
    }
    if( AuthLoading || (!AuthLoading && AuthData?.me)){
        return (        
            <Flex justifyContent='center' alignItems='center' minH='100vH'>
               <Spinner/>
            </Flex>
           )
    }
  return (
    <div>
        <Wrapper size="small">
            <Formik initialValues={initialValues} onSubmit={onForgotPassWordSubmit}>
                {({isSubmitting})=>
                !loading && data ?(<Box>PLease check your inbox</Box>):
                    (<Form>
                        <InputField
                            name="email"
                            placeholder="Email"
                            label="Email"
                            type="email"
                        />

                           <Flex mt={2}>
                                <Link href='/login'>Back to login page</Link>
                            </Flex>  
                        <Button
                            type="submit"
                            colorScheme="teal"
                            mt={4}
                            isLoading={isSubmitting}
                        >
                            Send Reset Password Email
                        </Button>
                    </Form>)
                }
            </Formik>
        </Wrapper>
    </div>
  )
}

export default ForgotPassWord