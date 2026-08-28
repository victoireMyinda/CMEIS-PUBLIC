import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { Seo } from '@/components/shared/Seo'
import { PageHero } from '@/components/ui/Feedback'
import { Button } from '@/components/ui/Button'
import { FormField, Input, Select, Textarea } from '@/components/ui/Form'
import { provincesRdc } from '@/app/siteConfig'
import { listenPrograms, listenShortCourses, submitRegistration } from '@/services/contentService'
import { useRegistrationDraftStore } from '@/store'
import type { ProgramItem, ShortCourseItem } from '@/types'

const fullSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  postnom: z.string().min(2, 'Postnom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  sexe: z.enum(['M', 'F'], { required_error: 'Sexe requis' }),
  dateNaissance: z.string().min(1, 'Date requise'),
  province: z.string().min(1, 'Province requise'),
  telephone: z
    .string()
    .min(9, 'Téléphone invalide')
    .regex(/^[0-9+\s-]+$/, 'Téléphone invalide'),
  email: z.string().email('Email invalide'),
  filiereId: z.string().min(1, 'Filière ou formation requise'),
  niveauEtudes: z.string().min(1, 'Niveau requis'),
  ecoleProvenance: z.string().min(2, 'École requise'),
  anneeAcademique: z.string().min(4, 'Année requise'),
  commentaire: z.string().optional(),
})

type FormValues = z.infer<typeof fullSchema>

const stepFields: (keyof FormValues)[][] = [
  ['nom', 'postnom', 'prenom', 'sexe', 'dateNaissance'],
  ['province', 'telephone', 'email'],
  ['filiereId', 'niveauEtudes', 'ecoleProvenance', 'anneeAcademique', 'commentaire'],
]

const stepTitles = ['Identité', 'Coordonnées', 'Parcours', 'Confirmation']

export function PreinscriptionPage() {
  const [searchParams] = useSearchParams()
  const offerFromUrl = searchParams.get('filiere') || searchParams.get('formation') || ''
  const { draft, setDraft, clearDraft } = useRegistrationDraftStore()
  const [step, setStep] = useState(draft.step ?? 0)
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const [programs, setPrograms] = useState<ProgramItem[]>([])
  const [courses, setCourses] = useState<ShortCourseItem[]>([])

  useEffect(() => {
    const unsubPrograms = listenPrograms(setPrograms)
    const unsubCourses = listenShortCourses(setCourses)
    return () => {
      unsubPrograms()
      unsubCourses()
    }
  }, [])

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      nom: draft.nom || '',
      postnom: draft.postnom || '',
      prenom: draft.prenom || '',
      sexe: draft.sexe,
      dateNaissance: draft.dateNaissance || '',
      province: draft.province || '',
      telephone: draft.telephone || '',
      email: draft.email || '',
      filiereId: draft.filiereId || offerFromUrl || '',
      niveauEtudes: draft.niveauEtudes || '',
      ecoleProvenance: draft.ecoleProvenance || '',
      anneeAcademique: draft.anneeAcademique || '2026-2027',
      commentaire: draft.commentaire || '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (!offerFromUrl) return
    const exists =
      programs.some((p) => p.id === offerFromUrl) || courses.some((c) => c.id === offerFromUrl)
    if (exists) setValue('filiereId', offerFromUrl)
  }, [offerFromUrl, programs, courses, setValue])

  useEffect(() => {
    const sub = watch((values) => {
      setDraft({ ...values, step })
    })
    return () => sub.unsubscribe()
  }, [watch, setDraft, step])

  const next = async () => {
    const fields = stepFields[step]
    if (!fields) return
    const ok = await trigger(fields)
    if (!ok) return
    const nextStep = Math.min(step + 1, stepTitles.length - 1)
    setDraft({ ...getValues(), step: nextStep })
    setStep(nextStep)
  }

  const back = () => {
    const prev = Math.max(step - 1, 0)
    setStep(prev)
    setDraft({ step: prev })
  }

  const selectedCourse = courses.find((c) => c.id === watch('filiereId'))
  const selectedProgram = programs.find((p) => p.id === watch('filiereId'))
  const selectedOffer = selectedCourse || selectedProgram
  const offerLabel = selectedCourse ? 'Formation' : 'Filière'

  const onSubmit = async (values: FormValues) => {
    const course = courses.find((c) => c.id === values.filiereId)
    const program = programs.find((p) => p.id === values.filiereId)
    const result = await submitRegistration({
      ...values,
      filiereLabel: course?.title || program?.title || values.filiereId,
      offerKind: course ? 'short_course' : 'filiere',
    })
    setSubmittedId(result.id)
    clearDraft()
  }

  if (submittedId) {
    return (
      <>
        <Seo title="Préinscription confirmée" path="/isssi/preinscription" />
        <section className="container-app py-16 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-brand-600" />
          <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
            Demande enregistrée
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Merci. Votre préinscription a bien été reçue. Conservez votre numéro de
            référence&nbsp;: <strong className="text-ink">{submittedId}</strong>. Notre équipe
            vous contactera pour la suite de la procédure.
          </p>
        </section>
      </>
    )
  }

  const values = getValues()

  return (
    <>
      <Seo
        title="Préinscription"
        description="Wizard mobile de préinscription ISSSI"
        path="/isssi/preinscription"
      />
      <PageHero
        title="Préinscription"
        eyebrow="ISSSI"
        subtitle="Parcours en étapes, sauvegarde automatique sur votre téléphone."
      />

      <section className="container-app py-8 sm:py-10">
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wide text-muted">
            <span>
              Étape {step + 1}/{stepTitles.length}
            </span>
            <span>{stepTitles[step]}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${((step + 1) / stepTitles.length) * 100}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-line bg-white p-4 sm:p-6"
        >
          {step === 0 ? (
            <>
              <FormField label="Nom" required error={errors.nom?.message}>
                <Input autoComplete="family-name" {...register('nom')} />
              </FormField>
              <FormField label="Postnom" required error={errors.postnom?.message}>
                <Input {...register('postnom')} />
              </FormField>
              <FormField label="Prénom" required error={errors.prenom?.message}>
                <Input autoComplete="given-name" {...register('prenom')} />
              </FormField>
              <FormField label="Sexe" required error={errors.sexe?.message}>
                <Select {...register('sexe')} defaultValue="">
                  <option value="" disabled>
                    Sélectionner
                  </option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </Select>
              </FormField>
              <FormField
                label="Date de naissance"
                required
                error={errors.dateNaissance?.message}
              >
                <Input type="date" {...register('dateNaissance')} />
              </FormField>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <FormField label="Province" required error={errors.province?.message}>
                <Select {...register('province')} defaultValue="">
                  <option value="" disabled>
                    Sélectionner
                  </option>
                  {provincesRdc.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Téléphone" required error={errors.telephone?.message}>
                <Input type="tel" inputMode="tel" {...register('telephone')} />
              </FormField>
              <FormField label="Email" required error={errors.email?.message}>
                <Input type="email" inputMode="email" {...register('email')} />
              </FormField>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <FormField
                label="Filière ou formation courte"
                required
                error={errors.filiereId?.message}
              >
                <Select {...register('filiereId')} defaultValue="">
                  <option value="" disabled>
                    Sélectionner
                  </option>
                  {programs.length > 0 ? (
                    <optgroup label="Filières académiques">
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                  {courses.length > 0 ? (
                    <optgroup label="Formations courtes ISSSI Academy">
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                </Select>
              </FormField>
              <FormField label="Niveau d’études" required error={errors.niveauEtudes?.message}>
                <Select {...register('niveauEtudes')} defaultValue="">
                  <option value="" disabled>
                    Sélectionner
                  </option>
                  <option value="Diplômé d'État">Diplômé d’État</option>
                  <option value="Graduat">Graduat</option>
                  <option value="Licence">Licence</option>
                  <option value="Professionnel / Formation continue">
                    Professionnel / Formation continue
                  </option>
                  <option value="Autre">Autre</option>
                </Select>
              </FormField>
              <FormField
                label="École de provenance"
                required
                error={errors.ecoleProvenance?.message}
              >
                <Input {...register('ecoleProvenance')} />
              </FormField>
              <FormField
                label="Année académique"
                required
                error={errors.anneeAcademique?.message}
              >
                <Input {...register('anneeAcademique')} />
              </FormField>
              <FormField label="Commentaire" error={errors.commentaire?.message}>
                <Textarea {...register('commentaire')} />
              </FormField>
            </>
          ) : null}

          {step === 3 ? (
            <div className="space-y-2 text-sm text-muted">
              <p>
                <strong className="text-ink">Identité :</strong> {values.prenom} {values.nom}{' '}
                {values.postnom}
              </p>
              <p>
                <strong className="text-ink">Contact :</strong> {values.telephone} ·{' '}
                {values.email}
              </p>
              <p>
                <strong className="text-ink">Province :</strong> {values.province}
              </p>
              <p>
                <strong className="text-ink">{offerLabel} :</strong> {selectedOffer?.title}
              </p>
              <p>
                <strong className="text-ink">Année :</strong> {values.anneeAcademique}
              </p>
              <p className="pt-2 text-xs">
                En soumettant, vous confirmez l’exactitude des informations.
              </p>
            </div>
          ) : null}

          <div className="flex gap-3 pt-2">
            {step > 0 ? (
              <Button type="button" variant="secondary" fullWidth onClick={back}>
                Retour
              </Button>
            ) : null}
            {step < stepTitles.length - 1 ? (
              <Button type="button" fullWidth onClick={() => void next()}>
                Continuer
              </Button>
            ) : (
              <Button type="submit" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Envoi…' : 'Soumettre'}
              </Button>
            )}
          </div>
        </form>
      </section>
    </>
  )
}
