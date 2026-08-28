import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { Spinner } from '@/components/ui/Feedback'

const HomePage = lazy(() =>
  import('@/pages/cmeis/HomePage').then((m) => ({ default: m.HomePage })),
)
const AboutPage = lazy(() =>
  import('@/pages/cmeis/StaticPages').then((m) => ({ default: m.AboutPage })),
)
const VisionMissionPage = lazy(() =>
  import('@/pages/cmeis/StaticPages').then((m) => ({ default: m.VisionMissionPage })),
)
const DomainsPage = lazy(() =>
  import('@/pages/cmeis/StaticPages').then((m) => ({ default: m.DomainsPage })),
)
const ProgramsPage = lazy(() =>
  import('@/pages/cmeis/StaticPages').then((m) => ({ default: m.ProgramsPage })),
)
const ServicesPage = lazy(() =>
  import('@/pages/cmeis/StaticPages').then((m) => ({ default: m.ServicesPage })),
)
const PartnersPage = lazy(() =>
  import('@/pages/cmeis/StaticPages').then((m) => ({ default: m.PartnersPage })),
)
const NewsListPage = lazy(() =>
  import('@/pages/cmeis/NewsPages').then((m) => ({ default: m.NewsListPage })),
)
const NewsDetailPage = lazy(() =>
  import('@/pages/cmeis/NewsPages').then((m) => ({ default: m.NewsDetailPage })),
)
const DocumentsPage = lazy(() =>
  import('@/pages/cmeis/MediaPages').then((m) => ({ default: m.DocumentsPage })),
)
const GalleryPage = lazy(() =>
  import('@/pages/cmeis/MediaPages').then((m) => ({ default: m.GalleryPage })),
)
const ContactPage = lazy(() =>
  import('@/pages/cmeis/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const IsssiHomePage = lazy(() =>
  import('@/pages/isssi/IsssiPages').then((m) => ({ default: m.IsssiHomePage })),
)
const IsssiDirectorPage = lazy(() =>
  import('@/pages/isssi/IsssiPages').then((m) => ({ default: m.IsssiDirectorPage })),
)
const IsssiVisionPage = lazy(() =>
  import('@/pages/isssi/IsssiPages').then((m) => ({ default: m.IsssiVisionPage })),
)
const IsssiCampusPage = lazy(() =>
  import('@/pages/isssi/IsssiPages').then((m) => ({ default: m.IsssiCampusPage })),
)
const IsssiAdmissionPage = lazy(() =>
  import('@/pages/isssi/IsssiPages').then((m) => ({ default: m.IsssiAdmissionPage })),
)
const IsssiFeesPage = lazy(() =>
  import('@/pages/isssi/IsssiPages').then((m) => ({ default: m.IsssiFeesPage })),
)
const ProgramsListPage = lazy(() =>
  import('@/pages/isssi/ProgramsPages').then((m) => ({ default: m.ProgramsListPage })),
)
const ProgramDetailPage = lazy(() =>
  import('@/pages/isssi/ProgramsPages').then((m) => ({ default: m.ProgramDetailPage })),
)
const ShortCoursesPage = lazy(() =>
  import('@/pages/isssi/ShortCoursesPages').then((m) => ({ default: m.ShortCoursesPage })),
)
const ShortCourseDetailPage = lazy(() =>
  import('@/pages/isssi/ShortCoursesPages').then((m) => ({ default: m.ShortCourseDetailPage })),
)
const PreinscriptionPage = lazy(() =>
  import('@/features/registration/PreinscriptionPage').then((m) => ({
    default: m.PreinscriptionPage,
  })),
)

function LazyFallback() {
  return (
    <div className="flex justify-center py-24">
      <Spinner />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LazyFallback />}>
        <Routes>
          <Route element={<PublicLayout variant="cmeis" />}>
            <Route index element={<HomePage />} />
            <Route path="a-propos" element={<AboutPage />} />
            <Route path="vision-mission" element={<VisionMissionPage />} />
            <Route path="domaines" element={<DomainsPage />} />
            <Route path="programmes" element={<ProgramsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="actualites" element={<NewsListPage />} />
            <Route path="actualites/:slug" element={<NewsDetailPage />} />
            <Route path="galerie" element={<GalleryPage scope="cmeis" />} />
            <Route path="documents" element={<DocumentsPage scope="cmeis" />} />
            <Route path="partenaires" element={<PartnersPage />} />
            <Route path="contact" element={<ContactPage scope="cmeis" />} />
          </Route>

          <Route path="isssi" element={<PublicLayout variant="isssi" />}>
            <Route index element={<IsssiHomePage />} />
            <Route path="mot-direction" element={<IsssiDirectorPage />} />
            <Route path="vision-mission" element={<IsssiVisionPage />} />
            <Route path="campus" element={<IsssiCampusPage />} />
            <Route path="filieres" element={<ProgramsListPage />} />
            <Route path="filieres/:slug" element={<ProgramDetailPage />} />
            <Route path="formations-courtes" element={<ShortCoursesPage />} />
            <Route path="formations-courtes/:slug" element={<ShortCourseDetailPage />} />
            <Route path="admission" element={<IsssiAdmissionPage />} />
            <Route path="frais" element={<IsssiFeesPage />} />
            <Route path="preinscription" element={<PreinscriptionPage />} />
            <Route
              path="actualites"
              element={<NewsListPage scope="isssi" basePath="/isssi/actualites" />}
            />
            <Route
              path="actualites/:slug"
              element={<NewsDetailPage basePath="/isssi/actualites" />}
            />
            <Route
              path="galerie"
              element={<GalleryPage scope="isssi" path="/isssi/galerie" />}
            />
            <Route
              path="documents"
              element={<DocumentsPage scope="isssi" />}
            />
            <Route
              path="contact"
              element={<ContactPage scope="isssi" path="/isssi/contact" />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
