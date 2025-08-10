'use client'
import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  Paper,
  Grid,
} from '@mui/material'
import {
  SentimentVeryDissatisfied,
  SentimentSatisfied,
  SentimentVerySatisfied,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { create } from 'zustand'

// Zustand Store テスト
interface TestStore {
  count: number
  angerLevel: number
  incrementCount: () => void
  setAngerLevel: (level: number) => void
}

const useTestStore = create<TestStore>((set) => ({
  count: 0,
  angerLevel: 5,
  incrementCount: () => set((state) => ({ count: state.count + 1 })),
  setAngerLevel: (level) => set({ angerLevel: level }),
}))

// Zod バリデーションスキーマ
const testSchema = z.object({
  feeling: z.string().min(1, '感情を入力してください'),
  intensity: z.number().min(1).max(10),
})

type TestFormData = z.infer<typeof testSchema>

const TestPage = () => {
  const theme = useTheme()
  const { count, angerLevel, incrementCount, setAngerLevel } = useTestStore()
  const [apiTest, setApiTest] = useState<string>('')

  // React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      feeling: '',
      intensity: 5,
    },
  })

  // Axios テスト
  const testAxios = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/posts/1'
      )
      setApiTest(`✅ Axios成功: ${response.data.title}`)
    } catch {
      setApiTest('❌ Axios エラー')
      // console.error(error)
    }
  }

  const onSubmit = (data: TestFormData) => {
    alert(`フォーム送信成功！\n感情: ${data.feeling}\n強度: ${data.intensity}`)
  }

  const getEmotionIcon = (level: number) => {
    if (level <= 3) return <SentimentVerySatisfied color="success" />
    if (level <= 6) return <SentimentSatisfied color="warning" />
    return <SentimentVeryDissatisfied color="error" />
  }

  const getEmotionColor = (level: number) => {
    if (level <= 3) return theme.palette.success.main
    if (level <= 6) return theme.palette.warning.main
    return theme.palette.error.main
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h3" gutterBottom align="center">
          🍌 ゴリラテーマ動作確認 🍌
        </Typography>

        <Grid container spacing={3}>
          {/* Material-UI + Theme テスト */}
          <Grid item xs={12} md={6}>
            <Card className="gorilla-card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  📦 Material-UI v6 テスト
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    className="gorilla-button"
                    onClick={() => alert('ゴリラボタン動作中！🦍')}
                    sx={{ mr: 2 }}
                  >
                    ゴリラボタン
                  </Button>
                  <Button variant="outlined" className="banana-button">
                    バナナボタン
                  </Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                  {[1, 3, 5, 7, 10].map((level) => (
                    <Chip
                      key={level}
                      label={`怒り${level}`}
                      className={`emotion-chip-${level <= 3 ? 'calm' : level <= 6 ? 'happiness' : 'anger'}`}
                      sx={{
                        mr: 1,
                        mb: 1,
                        backgroundColor: getEmotionColor(level),
                        color: 'white',
                      }}
                      icon={getEmotionIcon(level)}
                    />
                  ))}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  ✅ Material-UI v6 コンポーネント
                  <br />
                  ✅ ゴリラテーマ適用
                  <br />✅ アイコン表示
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Zustand テスト */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }} className="score-card">
              <Typography variant="h5" gutterBottom>
                🏪 Zustand 状態管理テスト
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">カウンター: {count}</Typography>
                <Button
                  variant="contained"
                  onClick={incrementCount}
                  sx={{ mr: 2 }}
                >
                  +1
                </Button>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6">
                  怒りレベル: {angerLevel} {getEmotionIcon(angerLevel)}
                </Typography>
                <Box>
                  {[1, 3, 5, 7, 10].map((level) => (
                    <Button
                      key={level}
                      size="small"
                      variant={angerLevel === level ? 'contained' : 'outlined'}
                      onClick={() => setAngerLevel(level)}
                      sx={{ mr: 1 }}
                    >
                      {level}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary">
                ✅ Zustand状態管理
                <br />✅ リアルタイム状態更新
              </Typography>
            </Paper>
          </Grid>

          {/* React Hook Form + Zod テスト */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  📝 React Hook Form + Zod テスト
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    {...register('feeling')}
                    label="今の感情"
                    fullWidth
                    margin="normal"
                    error={!!errors.feeling}
                    helperText={errors.feeling?.message}
                    placeholder="例: イライラしている"
                  />

                  <TextField
                    {...register('intensity', { valueAsNumber: true })}
                    label="強度 (1-10)"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={!!errors.intensity}
                    helperText={errors.intensity?.message}
                    inputProps={{ min: 1, max: 10 }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    フォーム送信テスト
                  </Button>
                </form>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  ✅ React Hook Form
                  <br />
                  ✅ Zodバリデーション
                  <br />✅ TypeScript型安全性
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Axios テスト */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  🌐 Axios API テスト
                </Typography>

                <Button
                  variant="contained"
                  onClick={testAxios}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  API テスト実行
                </Button>

                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body2">
                    {apiTest || 'API テストボタンを押してください'}
                  </Typography>
                </Paper>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  ✅ Axios HTTP クライアント
                  <br />✅ 外部API連携テスト
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* テーマカラーパレット */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  🎨 ゴリラテーマカラーパレット
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        p: 2,
                        borderRadius: 2,
                        textAlign: 'center',
                      }}
                    >
                      Primary
                      <br />
                      {theme.palette.primary.main}
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        p: 2,
                        borderRadius: 2,
                        textAlign: 'center',
                      }}
                    >
                      Secondary
                      <br />
                      {theme.palette.secondary.main}
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.gorilla.banana,
                        color: '#3E2723',
                        p: 2,
                        borderRadius: 2,
                        textAlign: 'center',
                      }}
                    >
                      ゴリラバナナ
                      <br />
                      {theme.palette.gorilla.banana}
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.gorilla.fur,
                        color: 'white',
                        p: 2,
                        borderRadius: 2,
                        textAlign: 'center',
                      }}
                    >
                      ゴリラ毛色
                      <br />
                      {theme.palette.gorilla.fur}
                    </Box>
                  </Grid>
                </Grid>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  ✅ カスタムゴリラテーマ
                  <br />
                  ✅ TypeScript型拡張
                  <br />✅ アンガーマネジメント特化カラー
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 総合テスト結果 */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            🎉 ライブラリ統合テスト完了！
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Next.js 15 + Material-UI v6 + TypeScript + Zustand + Axios + React
            Hook Form + Zod
            <br />
            すべてのライブラリが正常に動作しています！🦍🍌
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default TestPage
