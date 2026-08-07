import { NavLink, Link } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import { cmeisNav, filterNavByDisabledPages, isssiNav } from '@/app/siteConfig'
import { useSite } from '@/app/SiteProvider'
import { useUiStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { useMemo } from 'react'

const isssiMobileGroups = [
  {
    title: 'Institut',
    paths: ['/isssi', '/isssi/mot-direction', '/isssi/vision-mission', '/isssi/campus'],
  },
  {
    title: 'Admission',
    paths: ['/isssi/filieres', '/isssi/admission', '/isssi/frais', '/isssi/preinscription'],
  },
  {
    title: 'Infos',
    paths: ['/isssi/actualites', '/isssi/galerie', '/isssi/contact'],
  },
] as const

export function Header({ variant = 'cmeis' }: { variant?: 'cmeis' | 'isssi' }) {
  const site = useSite()
  const portal = variant === 'isssi' ? site.isssi : site
  const { mobileNavOpen, setMobileNavOpen, setSearchOpen } = useUiStore()
  const items = useMemo(
    () =>
      filterNavByDisabledPages(
        variant === 'isssi' ? isssiNav : cmeisNav,
        site.disabledPageSlugs,
      ),
    [variant, site.disabledPageSlugs],
  )
  const home = variant === 'isssi' ? '/isssi' : '/'

  return (
    <header
      className={cn(
        'sticky top-0 z-40 backdrop-blur-md',
        variant === 'isssi'
          ? 'border-b border-brand-100 bg-[#f3f6f4]/95'
          : 'border-b border-line/80 bg-surface/90',
      )}
    >
      <div className="container-app flex h-16 items-center justify-between gap-3">
        <Link to={home} className="flex min-w-0 items-center gap-2.5">
          <img
            src={portal.logoUrl}
            alt={portal.name}
            className={cn(
              'h-10 w-10 shrink-0 object-cover ring-1 ring-brand-200/80',
              variant === 'isssi' ? 'rounded-lg' : 'rounded-xl',
            )}
          />
          <span className="truncate font-display text-lg font-semibold text-brand-800">
            {portal.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Navigation principale">
          {items.slice(0, variant === 'isssi' ? 7 : 6).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/' || item.to === '/isssi'}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-100 text-brand-800'
                    : 'text-muted hover:bg-brand-50 hover:text-brand-800',
                )
              }
            >
              {'shortLabel' in item && item.shortLabel ? item.shortLabel : item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Rechercher"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          {variant === 'cmeis' && site.isssi.siteEnabled ? (
            <Link
              to="/isssi"
              className="hidden rounded-xl bg-accent-500 px-3 py-2 text-sm font-semibold text-ink sm:inline-flex"
            >
              ISSSI
            </Link>
          ) : variant === 'isssi' ? (
              <Link
                to="/isssi/preinscription"
                className="hidden rounded-lg bg-accent-500 px-3 py-2 text-sm font-semibold text-ink sm:inline-flex lg:hidden xl:inline-flex"
              >
                Préinscription
              </Link>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            className="xl:hidden"
            aria-label={mobileNavOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {mobileNavOpen ? (
        <div
          className={cn(
            'border-t xl:hidden',
            variant === 'isssi' ? 'border-brand-100 bg-white' : 'border-line bg-white',
          )}
        >
          {variant === 'isssi' ? (
            <nav className="container-app max-h-[78dvh] overflow-y-auto py-3 safe-pb">
              <Link
                to="/isssi/preinscription"
                onClick={() => setMobileNavOpen(false)}
                className="mb-3 flex min-h-12 items-center justify-center rounded-lg bg-accent-500 px-4 text-center text-base font-semibold text-ink"
              >
                Préinscription
              </Link>
              {isssiMobileGroups.map((group) => (
                <div key={group.title} className="mb-3">
                  <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-700">
                    {group.title}
                  </p>
                  <div className="grid gap-1">
                    {group.paths.map((path) => {
                      const item = items.find((n) => n.to === path)
                      if (!item) return null
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.to === '/isssi'}
                          onClick={() => setMobileNavOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'rounded-lg px-3 py-3 text-base font-medium',
                              isActive
                                ? 'bg-brand-100 text-brand-900'
                                : 'text-ink active:bg-brand-50',
                            )
                          }
                        >
                          <span className="block leading-tight">{item.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              ))}
              <Link
                to="/"
                onClick={() => setMobileNavOpen(false)}
                className="mt-1 flex min-h-11 items-center justify-center rounded-lg border border-brand-100 px-4 text-sm font-semibold text-brand-800"
              >
                Retour CMEIS-DG3
              </Link>
            </nav>
          ) : (
            <nav className="container-app flex max-h-[75vh] flex-col gap-1 overflow-y-auto py-3 safe-pb">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-3 text-base font-medium',
                      isActive ? 'bg-brand-100 text-brand-800' : 'text-ink hover:bg-brand-50',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {site.isssi.siteEnabled ? (
                <div className="mt-2 grid gap-2 border-t border-line pt-3">
                  <Link
                    to="/isssi"
                    onClick={() => setMobileNavOpen(false)}
                    className="rounded-xl bg-accent-500 px-4 py-3 text-center font-semibold text-ink"
                  >
                    Accéder à l’ISSSI
                  </Link>
                </div>
              ) : null}
            </nav>
          )}
        </div>
      ) : null}
    </header>
  )
}
