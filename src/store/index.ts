import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Registration } from '@/types'

interface UiState {
  mobileNavOpen: boolean
  searchOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  searchOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}))

type RegistrationDraft = Partial<Registration> & { step?: number }

interface RegistrationDraftState {
  draft: RegistrationDraft
  setDraft: (data: RegistrationDraft) => void
  clearDraft: () => void
}

export const useRegistrationDraftStore = create<RegistrationDraftState>()(
  persist(
    (set) => ({
      draft: { step: 0 },
      setDraft: (data) =>
        set((state) => ({ draft: { ...state.draft, ...data } })),
      clearDraft: () => set({ draft: { step: 0 } }),
    }),
    { name: 'cmeis-registration-draft' },
  ),
)
