import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFloat } from '@/components/shared/WhatsAppFloat'
import { MobileSearch } from '@/components/shared/MobileSearch'
import { MaintenancePage } from '@/components/shared/MaintenancePage'
import { Spinner } from '@/components/ui/Feedback'
import { useSite } from '@/app/SiteProvider'
import { useUiStore } from '@/store'

export function PublicLayout({ variant = 'cmeis' }: { variant?: 'cmeis' | 'isssi' }) {
  const location = useLocation()
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)
  const site = useSite()
  const portal = variant === 'isssi' ? site.isssi : site

  useEffect(() => {
    setMobileNavOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname, setMobileNavOpen])

  if (!site.ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface">
        <Spinner />
      </div>
    )
  }

  if (!portal.siteEnabled) {
    return (
      <MaintenancePage
        siteName={portal.name}
        logoUrl={portal.logoUrl}
        message={portal.maintenanceMessage}
      />
    )
  }

  return (
    <div
      className={
        variant === 'isssi'
          ? 'flex min-h-dvh flex-col bg-[#f3f6f4] [font-feature-settings:"ss01"]'
          : 'flex min-h-dvh flex-col'
      }
    >
      {variant === 'isssi' ? (
        <div className="h-1 bg-accent-500" aria-hidden />
      ) : null}
      <Header variant={variant} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer variant={variant} />
      <WhatsAppFloat variant={variant} />
      <MobileSearch />
    </div>
  )
}
