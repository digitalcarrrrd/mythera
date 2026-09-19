import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'MYTHRA — A one-person Hollywood studio',description:'Original drama built for the AI era. Explore the experiment, discover the method, and build your MYTHRA collaboration path.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
