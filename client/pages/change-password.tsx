import InputField from "@/components/InputField"
import Wrapper from "@/components/Wrapper"
import { mapFieldErrors } from "@/helpers/mapFieldErrors"
import { ChangePasswordInput, MeDocument, MeQuery, useChangePasswordMutation } from "@/src/gql/graphql"
import { useCheckAuth } from "@/utils/useCheckAuth"
import {  Alert, AlertIcon, AlertTitle, Box, Button, Flex, Spinner } from "@chakra-ui/react"
import { Form, Formik, FormikHelpers } from "formik"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"


const ChangePassword = () => {
    const initialValues={newPassword:''}
    const {data:authData, loading: authLoading}= useCheckAuth()
    const router = useRouter()
    const [ChangePassword]=useChangePasswordMutation()
    const [tokenError, setTokenError]= useState("")
  
    const onChangePasswordSubmit=async(
        values: ChangePasswordInput,
        {setErrors}:FormikHelpers<ChangePasswordInput>)=>{
    if(router.query.userId && router.query.token){
       const response= await ChangePassword({
            variables: {
                userId: router.query.userId as string,
                token: router.query.token as string,
                changePasswordInput: values
            }, 
            update(cache,{data}){
                if(data?.changePassword.success){
                    cache.writeQuery<MeQuery>({
                        query: MeDocument,
                        data:{me: data.changePassword.user}
                    })
                }
            }
        })
        // 2 loi sai 1: input 2: token loi
        if(response.data?.changePassword.error){
            const fieldErrors= mapFieldErrors(response.data.changePassword.error)
            if('token' in fieldErrors){
                setTokenError(fieldErrors.token)
            }
                setErrors(fieldErrors)
        }
            else if(response.data?.changePassword.user){
                router.push('/')
            }

        }}
     if(authLoading || (!authLoading && authData?.me)){
        return(
            <Wrapper>
                <Flex justifyContent='center' alignItems='center' minH='100vH'>
                    <Spinner/>
                </Flex>
            </Wrapper>
          
        )
     }else if(!router.query.token || !router.query.userId){
        return(
            <Wrapper size="small">
            <Alert status="error">
                <AlertIcon/>
                <AlertTitle>Invalid password change request</AlertTitle>
            </Alert>

              <Flex alignItems='center'>
                 <Link href='/login'>Back to login page</Link>
              </Flex>
          </Wrapper>
        )
     }
  return (
    <Wrapper size="small">
    <Formik initialValues={initialValues} onSubmit={onChangePasswordSubmit}>
        {({ isSubmitting }) => (
            <Form>
                <InputField
                    name='newPassword'
                    placeholder='New password'
                    label='New password'
                    type='password'
                />
                {tokenError && 
                    <Flex>
                        <Box color='red' mr={2}>
                            {tokenError}
                        </Box>
                        <Link href='/forgot-password'>Back to forgot page</Link>
                    </Flex>
                }
                <Button
                    type='submit'
                    colorScheme='teal'
                    mt={4}
                    isLoading={isSubmitting}
                >
                    Change Password
                </Button>
            </Form>
        )}
    </Formik>
</Wrapper>
  )
}


export default ChangePassword