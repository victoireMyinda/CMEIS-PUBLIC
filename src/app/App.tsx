import { AppRouter } from '@/routes/AppRouter'
import { SiteProvider } from '@/app/SiteProvider'

export default function App() {
  return (
    <SiteProvider>
      <AppRouter />
    </SiteProvider>
  )
}
