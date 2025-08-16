import { create } from 'zustand'
import type { Message, AngerLogFormData } from '@/types/counseling'
import type { CreateAngerLogData } from '@/schemas/anger_log'

interface CounselingState {
  messages: Message[]
  currentQuestionIndex: number
  isLoading: boolean
  angerLogData: AngerLogFormData
  isInitialized: boolean
  addMessage: (message: Message) => void
  setLoading: (loading: boolean) => void
  nextQuestion: () => void
  updateAngerLogField: (
    field: keyof AngerLogFormData,
    value: string | number | Record<string, boolean>
  ) => void
  getCreateAngerLogData: () => CreateAngerLogData
  resetChat: () => void
}

const initialAngerLogData: AngerLogFormData = {
  occurred_at: '',
  location: '',
  situation_description: '',
  perception: '',
  emotions_felt: {},
  anger_level: 1,
  trigger_words: '',
  reflection: '',
}

export const useCounselingStore = create<CounselingState>((set, get) => ({
  messages: [],
  currentQuestionIndex: 0,
  isLoading: false,
  angerLogData: initialAngerLogData,
  isInitialized: false,

  addMessage: (message) => {
    const state = get()
    // 初期メッセージの重複を防ぐ
    if (message.id === 'initial' && state.isInitialized) {
      return
    }
    set((state) => ({
      messages: [...state.messages, message],
      isInitialized: message.id === 'initial' ? true : state.isInitialized,
    }))
  },

  setLoading: (loading) => set({ isLoading: loading }),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  updateAngerLogField: (field, value) =>
    set((state) => {
      const updatedData = { ...state.angerLogData }

      if (field === 'emotions_felt' && typeof value === 'string') {
        const emotions = value.split(', ').filter((e) => e.trim())
        updatedData.emotions_felt = emotions.reduce(
          (acc, emotion) => {
            acc[emotion.trim()] = true
            return acc
          },
          {} as Record<string, boolean>
        )
      } else if (field === 'anger_level') {
        updatedData.anger_level = parseInt(value as string) || 1
      } else if (field === 'perception') {
        updatedData.situation_description =
          `${updatedData.situation_description}\n\n【認知・解釈】\n${value}`.trim()
      } else {
        // 型アサーションで解決
        ;(updatedData as Record<string, unknown>)[field] = value
      }

      return { angerLogData: updatedData }
    }),

  getCreateAngerLogData: (): CreateAngerLogData => {
    const data = get().angerLogData
    return {
      occurred_at: data.occurred_at,
      location: data.location || '',
      situation_description: data.situation_description,
      trigger_words: data.trigger_words || '',
      emotions_felt: data.emotions_felt,
      anger_level: data.anger_level,
    }
  },

  resetChat: () =>
    set({
      messages: [],
      currentQuestionIndex: 0,
      isLoading: false,
      angerLogData: initialAngerLogData,
      isInitialized: false,
    }),
}))
