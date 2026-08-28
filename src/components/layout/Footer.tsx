import { Link } from 'react-router-dom'
import { subscribeNewsletter } from '@/services/contentService'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Form'
import { useSite } from '@/app/SiteProvider'
import { SocialLinks } from '@/components/shared/SocialLinks'

export function Footer({ variant = 'cmeis' }: { variant?: 'cmeis' | 'isssi' }) {
  const site = useSite()
  const portal = variant === 'isssi' ? site.isssi : site
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await subscribeNewsletter(email, variant === 'isssi' ? 'isssi' : 'cmeis')
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer
      className={
        variant === 'isssi'
          ? 'mt-auto border-t-4 border-accent-500 bg-brand-900 text-white'
          : 'mt-auto border-t border-line bg-brand-800 text-white'
      }
    >
      <div className="container-app grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img
            src={portal.logoUrl}
            alt={portal.name}
            className={
              variant === 'isssi'
                ? 'mb-3 h-12 w-12 rounded-lg object-cover ring-1 ring-white/20'
                : 'mb-3 h-12 w-12 rounded-xl object-cover ring-1 ring-white/20'
            }
          />
          <p className="font-display text-xl font-semibold">{portal.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/75">{portal.tagline}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-400">
            Contact
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>{portal.contact.address}</li>
            <li>
              <a href={`mailto:${portal.contact.email}`} className="hover:text-white">
                {portal.contact.email}
              </a>
            </li>
            <li>{portal.contact.phone}</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-400">
            Liens
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link to="/actualites" className="hover:text-white">
                Actualités
              </Link>
            </li>
            <li>
              <Link to="/documents" className="hover:text-white">
                Documents
              </Link>
            </li>
            <li>
              <Link to="/isssi/preinscription" className="hover:text-white">
                Préinscription ISSSI
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-400">
            Newsletter
          </p>
          <form onSubmit={onSubmit} className="space-y-2">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
            />
            <Button type="submit" variant="accent" fullWidth>
              S’abonner
            </Button>
            {status === 'ok' ? (
              <p className="text-xs text-accent-400">Inscription enregistrée.</p>
            ) : null}
            {status === 'error' ? (
              <p className="text-xs text-red-300">Erreur, réessayez.</p>
            ) : null}
          </form>
          <div className="mt-4">
            <SocialLinks social={portal.social} tone="light" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {portal.name}. Tous droits réservés.
      </div>
    </footer>
  )
}
