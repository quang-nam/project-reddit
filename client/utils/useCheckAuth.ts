import { useMeQuery } from "@/src/gql/graphql"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const useCheckAuth =() => {
    const router = useRouter()
    const {data, loading}= useMeQuery()
    useEffect(() => {
      if(!loading){
      if( data?.me &&(
        router.route==='/login'|| 
        router.route==='/forgot-password'||
        router.route==='/register'||
        router.route==='/change-password')
       
        ){
          router.replace('/')
      }else if(!data?.me && router.route!=='/login'){
        router.replace('/login')
      }
    }}, [loading, router, data])
     return {data, loading}
}