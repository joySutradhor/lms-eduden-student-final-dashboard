export const metadata = {
  title: 'Login',
  description: 'Dashboard Login',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
