import { Navigate, Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Images,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/firebase/config'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/Button'
import { FormField, Input } from '@/components/ui/Form'
import { Seo } from '@/components/shared/Seo'
import { cn } from '@/utils/cn'
import type { AppUser, UserRole } from '@/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { mockNews, mockDocuments, mockPrograms } from '@/services/mockData'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/actualites', label: 'Actualités', icon: Newspaper },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
  { to: '/admin/galerie', label: 'Galerie', icon: Images },
  { to: '/admin/filieres', label: 'Filières', icon: GraduationCap },
  { to: '/admin/preinscriptions', label: 'Préinscriptions', icon: ClipboardList },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
  { to: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

function DemoUser(): AppUser {
  return {
    id: 'demo',
    uid: 'demo',
    email: 'admin@cmeis-dg3.org',
    displayName: 'Admin Démo',
    role: 'admin',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function AdminAuthProvider() {
  const { setUser, setLoading, user, loading } = useAuthStore()

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }
    return onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        setUser(null)
        return
      }
      setUser({
        id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'Administrateur',
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })
  }, [setUser, setLoading])

  if (loading && isFirebaseConfigured) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        Chargement…
      </div>
    )
  }

  return <Outlet context={{ user }} />
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function AdminLoginPage() {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  if (user) return <Navigate to="/admin" replace />

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setError('')
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, values.email, values.password)
      } else {
        setUser(DemoUser())
      }
      navigate('/admin')
    } catch {
      setError('Identifiants invalides')
    }
  }

  return (
    <>
      <Seo title="Admin — Connexion" path="/admin/login" />
      <div className="flex min-h-dvh items-center justify-center bg-brand-50 px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4 rounded-2xl border border-line bg-white p-5 shadow-soft"
        >
          <h1 className="font-display text-2xl font-semibold text-ink">Administration</h1>
          <p className="text-sm text-muted">
            {isFirebaseConfigured
              ? 'Connectez-vous avec Firebase Auth.'
              : 'Mode démo : n’importe quels identifiants valides ouvrent le back-office.'}
          </p>
          <FormField label="Email" required>
            <Input type="email" {...register('email')} />
          </FormField>
          <FormField label="Mot de passe" required>
            <Input type="password" {...register('password')} />
          </FormField>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" fullWidth disabled={isSubmitting}>
            Se connecter
          </Button>
          <Link to="/" className="block text-center text-sm text-brand-700">
            Retour au site
          </Link>
        </form>
      </div>
    </>
  )
}

export function RequireAdmin() {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/admin/login" replace />
  return <Outlet />
}

export function AdminLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const onLogout = async () => {
    if (auth) await signOut(auth)
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <p className="font-display font-semibold text-brand-800">CMEIS Admin</p>
        </div>
        <p className="truncate text-sm text-muted">{user?.displayName}</p>
      </header>

      <div className="md:grid md:grid-cols-[240px_1fr]">
        <aside
          className={cn(
            'border-b border-line bg-white md:min-h-[calc(100dvh-3.5rem)] md:border-b-0 md:border-r',
            open ? 'block' : 'hidden md:block',
          )}
        >
          <nav className="flex flex-col gap-1 p-3">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium',
                    isActive ? 'bg-brand-100 text-brand-800' : 'text-muted hover:bg-brand-50',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => void onLogout()}
              className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </nav>
        </aside>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <Seo title="Admin Dashboard" path="/admin" />
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Actualités', value: mockNews.length },
          { label: 'Documents', value: mockDocuments.length },
          { label: 'Filières', value: mockPrograms.length },
          { label: 'Préinscriptions', value: 0 },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-brand-800">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted">
        Back-office Mobile First. Connectez Firebase pour synchroniser les données live.
      </p>
    </div>
  )
}

function AdminListShell({
  title,
  rows,
}: {
  title: string
  rows: { id: string; primary: string; secondary?: string }[]
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <Button size="sm">Ajouter</Button>
      </div>
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {rows.map((row) => (
          <div key={row.id} className="px-4 py-3">
            <p className="font-medium text-ink">{row.primary}</p>
            {row.secondary ? <p className="text-sm text-muted">{row.secondary}</p> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminNewsPage() {
  return (
    <AdminListShell
      title="Actualités"
      rows={mockNews.map((n) => ({ id: n.id, primary: n.title, secondary: n.status }))}
    />
  )
}

export function AdminDocumentsPage() {
  return (
    <AdminListShell
      title="Documents"
      rows={mockDocuments.map((d) => ({ id: d.id, primary: d.title, secondary: d.category }))}
    />
  )
}

export function AdminGalleryPage() {
  return <AdminListShell title="Galerie" rows={[{ id: '1', primary: 'Albums institutionnels' }]} />
}

export function AdminProgramsPage() {
  return (
    <AdminListShell
      title="Filières"
      rows={mockPrograms.map((p) => ({ id: p.id, primary: p.title, secondary: p.level }))}
    />
  )
}

export function AdminRegistrationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Préinscriptions</h1>
        <Button size="sm" variant="secondary">
          Export Excel
        </Button>
      </div>
      <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-sm text-muted">
        Les préinscriptions Firestore apparaîtront ici. L’export Excel sera branché sur
        Cloud Functions / génération CSV côté admin.
      </p>
    </div>
  )
}

export function AdminMessagesPage() {
  return <AdminListShell title="Messages" rows={[{ id: '1', primary: 'Boîte de réception vide (démo)' }]} />
}

export function AdminUsersPage() {
  const roles: UserRole[] = ['superadmin', 'admin', 'editor', 'viewer']
  return (
    <AdminListShell
      title="Utilisateurs"
      rows={roles.map((r) => ({ id: r, primary: r, secondary: 'Rôle système' }))}
    />
  )
}

export function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Paramètres</h1>
      <div className="rounded-2xl border border-line bg-white p-4 text-sm text-muted">
        WhatsApp, email, réseaux sociaux et textes globaux seront gérés via la collection
        <code className="mx-1">settings</code>.
      </div>
    </div>
  )
}
