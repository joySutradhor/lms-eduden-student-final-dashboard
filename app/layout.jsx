import { Work_Sans } from 'next/font/google'



const WorkSans = Work_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: 'Dashboard - Home',
  description: 'ednden  is a best learning platfrom || ednden'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en' data-arp=''>
      <body
        cz-shortcut-listen='true'
        className={`${WorkSans.className}  antialiased bg-no-repeat bg-[#f7f5f5]`}
      >
        {/* <Sidebar /> */}
        {children}
      </body>
    </html>
  )
}