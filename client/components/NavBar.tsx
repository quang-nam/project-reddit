import { MeDocument, MeQuery, useLogoutMutation, useMeQuery } from "@/src/gql/graphql"
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react"
import NextLink from 'next/link'

const NavBar = () => {
    const {data, loading:useMeLoading, error:_error}= useMeQuery()
    const [logout,{loading:useLogoutMuationLoading}]= useLogoutMutation()

    const logoutUser=async()=>{
        await logout({
            update(cache, {data}){
                if(data?.logout){
                    cache.writeQuery<MeQuery>({
                        query: MeDocument,
                        data:{me: null}
                    })
                }
            }
        })
    }
    let body 
    if(useMeLoading){
        body = null
    }else if(!data?.me){
        body =(
            <>
             <NextLink href='/login'>
                    <Link mr={2}>Login</Link>
                </NextLink >
                <NextLink href='/register'>
                    <Link>Register</Link>
                </NextLink>
            </>
        )
    } else{// co du lieu data.me thi tuc la da dang nhap roi 
        body= (
            <Flex>
                <NextLink href='/create-post'>
                    <Button mr={2}>Create Post</Button>
                </NextLink >
                <Button 
                    onClick={logoutUser} 
                    isLoading={useLogoutMuationLoading}>
                     Logout
                </Button>
            </Flex>
        
          )
    }
  return (

    
     <Box bg='tan' p={4}>
        <Flex maxW={800} justifyContent='space-between' align='center' m='auto'>
            <NextLink href='/'>
                <Heading>Reddit</Heading>
            </NextLink>
            <Box>
               {body}
            </Box>
        </Flex>
     </Box>
   
  )
}

export default NavBar