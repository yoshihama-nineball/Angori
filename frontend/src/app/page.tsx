'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import Image from 'next/image'
const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return visibleElements
}

export default function TutorialPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const visibleElements = useScrollAnimation()

  const handleUserRegister = () => {
    console.log('ユーザ登録画面へ遷移')
  }

  const handleGuestLogin = () => {
    console.log('ゲストログイン')
  }

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="sm">
        {/* メイン画像とタイトル */}
        <Box
          id="main-hero"
          data-animate
          sx={{
            textAlign: 'center',
            mb: 6,
            opacity: visibleElements.has('main-hero') ? 1 : 0,
            transform: visibleElements.has('main-hero')
              ? 'translateY(0px)'
              : 'translateY(50px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          {/* 画像エリア */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: 280, md: 320 },
              height: { xs: 280, md: 320 },
              mx: 'auto',
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {/* ゴリラ画像 */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: 240, md: 280 },
                height: { xs: 240, md: 280 },
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: 4,
                border: `4px solid ${theme.palette.gorilla.lightFur}40`,
              }}
            >
              <Image
                src="/angori-image/angori-counseling.jpg"
                alt="アンガーゴリラ"
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                }}
                priority
              />
            </Box>

            {/* スピーチバブル */}
            <Chip
              label="バナナ食うか？"
              size="small"
              sx={{
                position: 'absolute',
                top: 15,
                left: 20,
                zIndex: 1,
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                  '40%': { transform: 'translateY(-10px)' },
                  '60%': { transform: 'translateY(-5px)' },
                },
              }}
            />
            <Chip
              label="どうした？"
              size="small"
              sx={{
                position: 'absolute',
                top: 100,
                right: -30,
                zIndex: 1,
                animation: 'bounce 2s infinite 0.5s',
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                  '40%': { transform: 'translateY(-10px)' },
                  '60%': { transform: 'translateY(-5px)' },
                },
              }}
            />
            <Chip
              label="一緒に解決しよう！"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 0,
                zIndex: 1,
                animation: 'bounce 2s infinite 1s',
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                  '40%': { transform: 'translateY(-10px)' },
                  '60%': { transform: 'translateY(-5px)' },
                },
              }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            color="text.primary"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              lineHeight: 1.3,
            }}
          >
            ゴリラの力で怒りを笑いに
          </Typography>

          <Card elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8 }}
            >
              負の感情で疲れているあなたを、正の感情で強いものは支えます。
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8, mt: 1 }}
            >
              やさしくユーモアあふれたゴリラと一緒に、怒りの感情を楽しくコントロールしませんか？
            </Typography>
          </Card>
        </Box>
        <Box
          id="service-description"
          data-animate
          sx={{
            mb: 6,
            opacity: visibleElements.has('service-description') ? 1 : 0,
            transform: visibleElements.has('service-description')
              ? 'translateY(0px)'
              : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.2s',
          }}
        >
          <Card
            elevation={2}
            sx={{
              p: 4,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 5,
              },
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8, mb: 2 }}
            >
              Angoriは、従来の真面目なアンガーマネジメントアプリとは違い、エンタメ性を重視しています。
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8, mb: 2 }}
            >
              やさしくユーモアあふれたゴリラに相談することで、怒りの感情を客観視し、感情のコントロールスキルを楽しく身につけることができます。
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8 }}
            >
              ASDやHSPなど感情コントロールが難しい方にも使いやすいよう設計されています。
            </Typography>
          </Card>
        </Box>
        <Box
          id="app-features"
          data-animate
          sx={{
            mb: 6,
            opacity: visibleElements.has('app-features') ? 1 : 0,
            transform: visibleElements.has('app-features')
              ? 'translateY(0px)'
              : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.4s',
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            color="text.primary"
            sx={{
              fontWeight: 'bold',
              mb: 4,
              textAlign: 'center',
            }}
          >
            アプリについて
          </Typography>
          <Box
            id="consultation-feature"
            data-animate
            sx={{
              mb: 4,
              opacity: visibleElements.has('consultation-feature') ? 1 : 0,
              transform: visibleElements.has('consultation-feature')
                ? 'translateY(0px)'
                : 'translateY(40px)',
              transition: 'all 0.8s ease-out 0.6s',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: 200, md: 220 },
                height: { xs: 200, md: 220 },
                mx: 'auto',
                mb: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 200, md: 220 },
                  height: { xs: 200, md: 220 },
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: 3,
                  border: `3px solid ${theme.palette.gorilla.lightFur}60`,
                }}
              >
                <Image
                  src="/angori-image/angori-counseling.jpg"
                  alt="アンガーゴリラ"
                  fill
                  style={{
                    objectFit: 'cover',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </Box>
            </Box>

            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                textAlign: 'center',
              }}
            >
              相談室での相談で悩みを解決
            </Typography>

            <Card
              elevation={1}
              sx={{
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, mb: 2 }}
              >
                Dr.ゴリラとの相談で悩みを解決
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, mb: 2 }}
              >
                「今回の怒りはバナナ何本分だ？...いや、10段階中いくつだ？」
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                このようなユーモアあふれる質問に答えることで、怒りの感情を客観視し、AIからのアドバイスを受けることができます。
              </Typography>
            </Card>
          </Box>
          <Box
            id="visualization-feature"
            data-animate
            sx={{
              mb: 6,
              opacity: visibleElements.has('visualization-feature') ? 1 : 0,
              transform: visibleElements.has('visualization-feature')
                ? 'translateY(0px)'
                : 'translateY(40px)',
              transition: 'all 0.8s ease-out 0.8s',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: 200, md: 220 },
                height: { xs: 200, md: 220 },
                mx: 'auto',
                mb: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1) rotate(-5deg)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 200, md: 220 },
                  height: { xs: 200, md: 220 },
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: 3,
                  border: `3px solid ${theme.palette.gorilla.lightFur}60`,
                }}
              >
                <Image
                  src="/angori-image/angori-counseling.jpg"
                  alt="アンガーゴリラ"
                  fill
                  style={{
                    objectFit: 'cover',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </Box>
            </Box>

            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                textAlign: 'center',
              }}
            >
              怒りの傾向を可視化
            </Typography>

            <Card
              elevation={1}
              sx={{
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, mb: 2 }}
              >
                過去のアンガーログの記録・振り返り
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, mb: 2 }}
              >
                怒りの傾向をグラフで可視化し、落ち着きポイントシステムで継続的なモチベーション向上をサポートします。
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                自分の成長過程を楽しく追跡しながら、持続的な感情制御スキルを身につけましょう！
              </Typography>
            </Card>
          </Box>
        </Box>
        <Box
          id="action-buttons"
          data-animate
          sx={{
            mb: 8,
            opacity: visibleElements.has('action-buttons') ? 1 : 0,
            transform: visibleElements.has('action-buttons')
              ? 'translateY(0px)'
              : 'translateY(40px)',
            transition: 'all 0.8s ease-out 1s',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleUserRegister}
            sx={{
              mb: 2,
              py: 2,
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
              },
            }}
          >
            ユーザ登録
          </Button>

          <Button
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            onClick={handleGuestLogin}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
              },
            }}
          >
            ゲスト利用してみる
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
