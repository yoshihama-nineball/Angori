'use client'

import React, { useState, useEffect } from 'react'
import { Typography, Paper, Box } from '@mui/material'
import { ChatContainer } from './ChatContainer'
import { MessageInput } from './MessageInput'
import { CounselingCompletionModal } from './CounselingCompletionModal'
import { questionFlow } from '@/data/questionFlow'
import type { AngerLogFormData, Message } from '@/types/counseling'
import { useCounselingStore } from '../../../lib/stores/counselingStore'
import dayjs from 'dayjs'

export const CounselingLayout = () => {
  const {
    messages,
    currentQuestionIndex,
    isLoading,
    angerLogData,
    addMessage,
    setLoading,
    nextQuestion,
    getCreateAngerLogData,
  } = useCounselingStore()

  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [aiAdvice, setAiAdvice] = useState('')

  // 初期メッセージの設定
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: 'initial',
        content: questionFlow[0].content,
        sender: 'gorilla',
        timestamp: new Date(),
      }
      addMessage(initialMessage)
    }
  }, [messages.length, addMessage])

  // AIアドバイス取得（仮実装）
  const getAIAdvice = async (data: AngerLogFormData): Promise<string> => {
    // TODO: 実際のAI API呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 2000)) // 2秒の遅延をシミュレート

    return `${data.occurred_at}に${data.location}で起きた出来事について、怒りレベル${data.anger_level}ということですね。

今回の状況を客観視できているのは素晴らしいウホ！感情を${Object.keys(data.emotions_felt || {}).join('、')}と具体的に言葉にできたことで、自分の気持ちと向き合えた証拠ウホ。

次回似たようなことがあったら：
• まず深呼吸を3回してみるウホ
• 「これは事実？それとも解釈？」と自分に問いかけてみるウホ
• 怒りの背後にある本当の気持ち（悲しみ、不安など）に注目してみるウホ

君の気持ちを大切にしながら、少しずつ成長していけばいいウホ。今日もよく頑張ったウホ！🦍💚`
  }

  // アンガーログ保存（仮実装）
  const saveAngerLog = async (
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> => {
    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { id: Date.now(), ...data }
  }

  // メッセージ送信処理
  const handleSendMessage = async (content: string) => {
    let displayContent = content.trim()

    // datetime形式の場合は読みやすい形式に変換
    const currentQuestion = questionFlow[currentQuestionIndex]
    if (currentQuestion?.type === 'datetime' && content) {
      try {
        displayContent = dayjs(content).format('YYYY年MM月DD日 HH:mm')
      } catch {
        displayContent = content.trim() // フォーマットに失敗した場合は元の値
      }
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: displayContent, // フォーマットされた内容を表示
      sender: 'user',
      timestamp: new Date(),
    }

    addMessage(userMessage)

    setLoading(true)

    // 次の質問インデックスを計算
    const nextQuestionIndex = currentQuestionIndex + 1

    if (nextQuestionIndex < questionFlow.length) {
      // まだ質問が残っている場合
      setTimeout(
        () => {
          const nextQuestionData = questionFlow[nextQuestionIndex]
          const gorillaMessage: Message = {
            id: `gorilla_${Date.now()}`,
            content: nextQuestionData.content,
            sender: 'gorilla',
            timestamp: new Date(),
            questionType: nextQuestionData.type,
            options: nextQuestionData.options,
          }

          addMessage(gorillaMessage)
          nextQuestion()
          setLoading(false)
        },
        Math.random() * 1000 + 1000
      )
    } else {
      // 最後の質問の場合
      try {
        // 完了メッセージを先に表示
        const finalMessage: Message = {
          id: `final_${Date.now()}`,
          content:
            '相談お疲れさまウホ！今から君専用のアドバイスを考えるから、少し待っててほしいウホ...🤔💭',
          sender: 'gorilla',
          timestamp: new Date(),
        }
        addMessage(finalMessage)

        // 1. AIアドバイス取得
        const advice = await getAIAdvice(angerLogData)
        setAiAdvice(advice)

        // 2. アンガーログ保存（AIアドバイス含む）
        const createData = getCreateAngerLogData()
        await saveAngerLog({
          ...createData,
          ai_advice: advice,
        })

        // 3. 成功メッセージとModal表示
        const successMessage: Message = {
          id: `success_${Date.now()}`,
          content:
            'アドバイスが完成したウホ！記録も保存したから、詳細を確認してみてほしいウホ！🎉',
          sender: 'gorilla',
          timestamp: new Date(),
        }
        addMessage(successMessage)

        // Modal表示
        setShowCompletionModal(true)
      } catch {
        const errorMessage: Message = {
          id: `error_${Date.now()}`,
          content:
            'あれ？何かエラーが起きたウホ...。もう一度試してみてほしいウホ。',
          sender: 'gorilla',
          timestamp: new Date(),
        }
        addMessage(errorMessage)
      } finally {
        setLoading(false)
      }
    }
  }

  // Modal閉じる処理
  const handleCloseModal = () => {
    setShowCompletionModal(false)
  }

  // 現在の質問タイプを取得
  const getCurrentQuestionType = () => {
    if (currentQuestionIndex >= questionFlow.length) return 'text'
    return questionFlow[currentQuestionIndex].type
  }

  const getCurrentOptions = () => {
    if (currentQuestionIndex >= questionFlow.length) return undefined
    return questionFlow[currentQuestionIndex].options
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 'md',
        mx: 'auto',
        py: 2,
        px: 2,
      }}
    >
      {/* チャット部分（スクロール可能） */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
          mb: 2,
        }}
      >
        <ChatContainer />
      </Box>

      {/* 入力エリア（固定） */}
      {!showCompletionModal && (
        <Box
          sx={{
            borderTop: '1px solid #e0e0e0',
            bgcolor: 'white',
            pt: 2,
            pb: 1,
          }}
        >
          <MessageInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            questionType={getCurrentQuestionType()}
            options={getCurrentOptions()}
          />
        </Box>
      )}

      {/* 完了Modal */}
      <CounselingCompletionModal
        open={showCompletionModal}
        onClose={handleCloseModal}
        angerLogData={angerLogData}
        aiAdvice={aiAdvice}
      />

      {/* デバッグ情報（開発時のみ） */}
      {process.env.NODE_ENV === 'development' && (
        <Paper elevation={1} sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="caption" component="div">
            <strong>デバッグ情報:</strong>
          </Typography>
          <Typography
            variant="caption"
            component="pre"
            sx={{ fontSize: '10px', overflow: 'auto' }}
          >
            {JSON.stringify(angerLogData, null, 2)}
          </Typography>
        </Paper>
      )}
    </Box>
  )
}
