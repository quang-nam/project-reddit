import { Box } from "@chakra-ui/react"
import { ReactNode } from "react"

type WrapperSize='regular'|'small'
interface IWrapper{
    children: ReactNode,
    size?: WrapperSize
}

const Wrapper =({children, size='regular'}:IWrapper)=>{
    return(
        <Box 
        maxW={size === 'regular' ?'800px':'400px'} 
        mt={8} 
        w='100%' 
        mx="auto">
            {children}
        </Box>
    )

}
export default Wrapper