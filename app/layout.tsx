import "./globals.css"

export const metadata = {
    title: "Perspectives.ai",
    description: "It’s for the seeker, the skeptic, the believer, and the curious.",
}

const RootLayout = ({children}) => {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout
