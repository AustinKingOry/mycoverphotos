import { ThemeProvider } from "./components/theme-provider"
import Layout from "./components/layout/Layout"
import "./index.css"
import MainSection from "./components/sections/MainSection"

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
		<Layout>
    		<MainSection />
		</Layout>
	</ThemeProvider>
  )
}

