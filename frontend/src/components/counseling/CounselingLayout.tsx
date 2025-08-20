'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { ChatContainer } from './ChatContainer'
import { MessageInput } from './MessageInput'
import { CounselingCompletionModal } from './CounselingCompletionModal'
import { questionFlow } from '@/data/questionFlow'
import type { AngerLogFormData, Message } from '@/types/counseling'
import { useCounselingStore } from '../../../lib/stores/counselingStore'
import { createAngerLog } from '../../../lib/api/anger_log'
import dayjs from 'dayjs'
import { CreateAngerLogData } from '@/schemas/anger_log'

export const CounselingLayout = () => {
  const {
    messages,
    currentQuestionIndex,
    isLoading,
    angerLogData,
    addMessage,
    setLoading,
    nextQuestion,
    updateAngerLogField,
    resetChat,
  } = useCounselingStore()

  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [aiAdvice, setAiAdvice] = useState('')
  const [, setSavedAngerLogId] = useState<number | null>(null)

  // useEffect(() => {
  //   if (currentQuestionIndex >= questionFlow.length && !showCompletionModal) {
  //     // 相談が完了しているがモーダルが表示されていない場合はリセット
  //     resetChat()
  //   }
  // }, [currentQuestionIndex, showCompletionModal, resetChat])

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

  // AngerLogFormDataをCreateAngerLogDataに変換
  const convertToCreateData = (
    formData: AngerLogFormData
  ): CreateAngerLogData => {
    return {
      anger_level: formData.anger_level,
      occurred_at: formData.occurred_at,
      situation_description: formData.situation_description,
      location: formData.location || '',
      trigger_words: formData.trigger_words || '',
      perception: formData.perception,
      emotions_felt: formData.emotions_felt || {},
      reflection: formData.reflection || '',
    }
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
        displayContent = content.trim()
      }
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: displayContent,
      sender: 'user',
      timestamp: new Date(),
    }

    addMessage(userMessage)

    if (currentQuestion) {
      updateAngerLogField(currentQuestion.field, content.trim())
    }

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

        // AngerLog保存（AIアドバイス自動生成）
        const createData = convertToCreateData(angerLogData)
        const result = await createAngerLog(createData)

        if (result.errors.length > 0) {
          // エラーメッセージを表示
          const errorMessage: Message = {
            id: `error_${Date.now()}`,
            content: `エラーが発生したウホ: ${result.errors.join(', ')}。もう一度試してみてほしいウホ。`,
            sender: 'gorilla',
            timestamp: new Date(),
          }
          addMessage(errorMessage)
        } else if (result.angerLog) {
          // 成功時の処理
          setSavedAngerLogId(result.angerLog.id)
          setAiAdvice(
            result.angerLog.ai_advice || 'AIアドバイスの生成に失敗しました。'
          )

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
        }
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
    resetChat()
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
        height: '88vh',
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
      {/* {process.env.NODE_ENV === 'development' && (
        <Paper elevation={1} sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
          <Typography variant="caption" component="div">
            <strong>デバッグ情報:</strong>
          </Typography>
          <Typography
            variant="caption"
            component="pre"
            sx={{ fontSize: '10px', overflow: 'auto' }}
          >
            {JSON.stringify({ ...angerLogData, savedAngerLogId }, null, 2)}
          </Typography>
        </Paper>
      )} */}
    </Box>
  )
}
