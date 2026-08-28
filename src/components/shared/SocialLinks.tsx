import { cn } from '@/utils/cn'

export type SocialUrls = {
  facebook?: string
  instagram?: string
  twitter?: string
  youtube?: string
  tiktok?: string
  linkedin?: string
}

function isHttpUrl(value?: string) {
  const url = (value || '').trim()
  return /^https?:\/\//i.test(url)
}

function BrandIcon({
  className,
  path,
}: {
  className?: string
  path: string
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  )
}

const FacebookIcon = (props: { className?: string }) => (
  <BrandIcon
    {...props}
    path="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.75 8.44-4.91 8.44-9.93z"
  />
)

const InstagramIcon = (props: { className?: string }) => (
  <svg className={props.className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10A2.2 2.2 0 0 0 19.2 17V7A2.2 2.2 0 0 0 17 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zm5.05-3.55a.95.95 0 1 1-.95.95.95.95 0 0 1 .95-.95z" />
  </svg>
)

const XIcon = (props: { className?: string }) => (
  <BrandIcon
    {...props}
    path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
  />
)

const YoutubeIcon = (props: { className?: string }) => (
  <BrandIcon
    {...props}
    path="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.7 12 3.7 12 3.7s-7.5 0-9.38.36A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.3 12 20.3 12 20.3s7.5 0 9.38-.36a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.57V8.43L15.84 12z"
  />
)

const TikTokIcon = (props: { className?: string }) => (
  <BrandIcon
    {...props}
    path="M19.59 6.69A4.83 4.83 0 0 1 15.82 2.5V2h-3.45v13.67a2.89 2.89 0 1 1-2.1-2.78V9.4a6.34 6.34 0 1 0 5.55 6.29V9.16a8.2 8.2 0 0 0 4.77 1.52V6.79a4.84 4.84 0 0 1-1-.1z"
  />
)

const LinkedinIcon = (props: { className?: string }) => (
  <BrandIcon
    {...props}
    path="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77A1.75 1.75 0 0 0 0 1.73v20.54A1.75 1.75 0 0 0 1.77 24h20.46A1.76 1.76 0 0 0 24 22.27V1.73A1.76 1.76 0 0 0 22.23 0z"
  />
)

const networks = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'twitter', label: 'X / Twitter', Icon: XIcon },
  { key: 'youtube', label: 'YouTube', Icon: YoutubeIcon },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon },
] as const

export function hasSocialLinks(social: SocialUrls) {
  return networks.some((item) => isHttpUrl(social[item.key]))
}

export function SocialLinks({
  social,
  tone = 'light',
  className,
}: {
  social: SocialUrls
  tone?: 'light' | 'dark'
  className?: string
}) {
  const links = networks.filter((item) => isHttpUrl(social[item.key]))
  if (links.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {links.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={social[key]!.trim()}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-full transition',
            tone === 'light'
              ? 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/20'
              : 'bg-brand-50 text-brand-800 ring-1 ring-brand-100 hover:bg-brand-100',
          )}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  )
}
