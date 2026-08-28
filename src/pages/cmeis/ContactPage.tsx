import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Seo } from '@/components/shared/Seo'
import { PageHero } from '@/components/ui/Feedback'
import { Button } from '@/components/ui/Button'
import { FormField, Input, Textarea, Select } from '@/components/ui/Form'
import { submitContact } from '@/services/contentService'
import { useSite } from '@/app/SiteProvider'
import type { PortalScope } from '@/types'
import { SocialLinks, hasSocialLinks } from '@/components/shared/SocialLinks'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Sujet requis'),
  message: z.string().min(10, 'Message trop court'),
})

type FormValues = z.infer<typeof schema>

export function ContactPage({
  scope = 'cmeis',
  path = '/contact',
}: {
  scope?: PortalScope
  path?: string
}) {
  const site = useSite()
  const portal = scope === 'isssi' ? site.isssi : site
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    await submitContact({ ...values, scope })
    setDone(true)
    reset()
  }

  return (
    <>
      <Seo title="Contact" path={path} />
      <PageHero
        title="Contact"
        subtitle="Écrivez-nous. Réponse prioritaire via email ou WhatsApp."
      />
      <section className="container-app grid gap-8 py-8 sm:py-12 lg:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-line bg-white p-4 sm:p-6">
          <FormField label="Nom complet" htmlFor="name" required error={errors.name?.message}>
            <Input id="name" {...register('name')} />
          </FormField>
          <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
            <Input id="email" type="email" inputMode="email" {...register('email')} />
          </FormField>
          <FormField label="Téléphone" htmlFor="phone" error={errors.phone?.message}>
            <Input id="phone" type="tel" inputMode="tel" {...register('phone')} />
          </FormField>
          <FormField label="Sujet" htmlFor="subject" required error={errors.subject?.message}>
            <Select id="subject" {...register('subject')} defaultValue="">
              <option value="" disabled>
                Choisir…
              </option>
              <option value="Information">Information</option>
              <option value="Admission">Admission</option>
              <option value="Partenariat">Partenariat</option>
              <option value="Autre">Autre</option>
            </Select>
          </FormField>
          <FormField label="Message" htmlFor="message" required error={errors.message?.message}>
            <Textarea id="message" {...register('message')} />
          </FormField>
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Envoi…' : 'Envoyer'}
          </Button>
          {done ? (
            <p className="text-sm font-medium text-brand-700">
              Message envoyé. Merci pour votre contact.
            </p>
          ) : null}
        </form>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-xl font-semibold text-ink">Coordonnées</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>{portal.contact.address}</li>
              <li>{portal.contact.email}</li>
              <li>{portal.contact.phone}</li>
            </ul>
            {hasSocialLinks(portal.social) ? (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-ink">Réseaux sociaux</p>
                <SocialLinks social={portal.social} tone="dark" />
              </div>
            ) : null}
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <iframe
              title="Carte Google Maps"
              src={portal.mapsEmbedUrl}
              className="h-64 w-full border-0 sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  )
}
