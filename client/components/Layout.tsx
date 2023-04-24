
import { ReactNode } from "react"
import NavBar from "./NavBar"
import Wrapper from "./Wrapper"

interface ILayoutProps{
    children: ReactNode
}

const Layout = ({children}:ILayoutProps) => {
  return (
    <div>
        <NavBar/>
        <Wrapper>{children}</Wrapper>
    </div>
  )
}

export default Layout