import { createTheme } from '@mui/material/styles'

// TypeScript型定義を先に定義
declare module '@mui/material/styles' {
  interface Palette {
    gorilla: {
      fur: string
      lightFur: string
      darkFur: string
      skin: string
      banana: string
      lightBanana: string
      bananaAccent: string
      leaf: string
      rock: string
      soil: string
      anger: string
      sadness: string
      happiness: string
      calm: string
    }
  }

  interface PaletteOptions {
    gorilla?: {
      fur: string
      lightFur: string
      darkFur: string
      skin: string
      banana: string
      lightBanana: string
      bananaAccent: string
      leaf: string
      rock: string
      soil: string
      anger: string
      sadness: string
      happiness: string
      calm: string
    }
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700', // バナナイエロー
      light: '#FFFF57',
      dark: '#C8A415',
      contrastText: '#5D4037', // ブラウンテキスト
    },
    secondary: {
      main: '#5D4037', // ブラウン（現在これが効いていない）
      light: '#8D6E63',
      dark: '#3E2723',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFEF7', // 薄いグレー
      paper: '#FFFFFF', // 極薄いクリーム
    },
    text: {
      primary: '#5D4037', // メインブラウン（現在の#8B4513から変更）
      secondary: '#8D6E63', // ライトブラウン（現在の#A0522Dから変更）
    },
    error: {
      main: '#D32F2F', // 怒りの赤
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#FF8F00', // 警告のオレンジ
      light: '#FFB74D',
      dark: '#EF6C00',
    },
    info: {
      main: '#1976D2', // 悲しみの青
      light: '#42A5F5',
      dark: '#1565C0',
    },
    success: {
      main: '#388E3C', // 喜びの緑
      light: '#66BB6A',
      dark: '#2E7D32',
    },
    // ゴリラ専用カラーパレット
    gorilla: {
      // ゴリラの体色
      fur: '#3E2723', // ダークブラウン（毛色）
      lightFur: '#5D4037', // ミディアムブラウン
      darkFur: '#2D2D2D', // 濃い黒
      skin: '#8D6E63', // 肌色（ライトブラウン）

      // バナナ系
      banana: '#FFD700', // 濃いバナナイエロー
      lightBanana: '#FFFF57', // ライトバナナ
      bananaAccent: '#FFA000', // バナナオレンジ

      // ジャングル要素
      leaf: '#2E7D32', // 深緑
      rock: '#6D4C41', // 岩の色
      soil: '#4E342E', // 土の色

      // 感情カラー
      anger: '#D32F2F', // 怒り（赤）
      sadness: '#1976D2', // 悲しみ（青）
      happiness: '#FFD700', // 喜び（バナナ）
      calm: '#8D6E63', // 穏やか（ライトブラウン）
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background: #FFFEF7;
          background-attachment: fixed;
          font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
        }
        
        /* ゴリラスタイルのカード */
        .gorilla-card {
          background: linear-gradient(145deg, #FFFACD 0%, #FFF8DC 100%);
          border: 2px solid #8D6E63;
          border-radius: 16px;
          box-shadow: 
            0 4px 16px rgba(94, 64, 55, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          position: relative;
        }
        
        .gorilla-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #5D4037, #8D6E63, #FFD700);
          border-radius: 18px;
          z-index: -1;
        }
        
        /* スコア表示 */
        .score-display {
          background: radial-gradient(circle, #3E2723 0%, #2D2D2D 100%);
          color: #FFD700;
          border: 3px solid #8D6E63;
          border-radius: 50%;
          box-shadow: 
            0 6px 20px rgba(94, 64, 55, 0.3),
            inset 0 2px 4px rgba(255, 215, 0, 0.2);
        }
        
        /* ゴリラボタン */
        .gorilla-button {
          background: linear-gradient(45deg, #5D4037 30%, #8D6E63 70%);
          color: #FFD700;
          border: 2px solid #FFD700;
          border-radius: 12px;
          padding: 12px 24px;
          box-shadow: 0 4px 15px rgba(94, 64, 55, 0.3);
          transition: all 0.3s ease;
          font-weight: bold;
          text-transform: none;
        }
        
        .gorilla-button:hover {
          background: linear-gradient(45deg, #3E2723 30%, #5D4037 70%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(94, 64, 55, 0.4);
          border-color: #FFFF57;
        }
        
        /* 感情チップ */
        .emotion-chip-anger {
          background: linear-gradient(45deg, #D32F2F, #EF5350);
          color: white;
          border: 1px solid #C62828;
        }
        
        .emotion-chip-sadness {
          background: linear-gradient(45deg, #1976D2, #42A5F5);
          color: white;
          border: 1px solid #1565C0;
        }
        
        .emotion-chip-happiness {
          background: linear-gradient(45deg, #FFD700, #FFFF57);
          color: #3E2723;
          border: 1px solid #C8A415;
        }
        
        .emotion-chip-calm {
          background: linear-gradient(45deg, #8D6E63, #A1887F);
          color: white;
          border: 1px solid #6D4C41;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1rem',
        },
        containedPrimary: {
          backgroundColor: '#FFD700',
          color: '#5D4037',
          '&:hover': {
            backgroundColor: '#C8A415',
          },
        },
        containedSecondary: {
          backgroundColor: '#5D4037',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#3E2723',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          border: '1px solid #8D6E63',
          backgroundColor: 'rgba(255, 250, 205, 0.8)',
          color: '#3E2723',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(94, 64, 55, 0.2)',
          },
        },
      },
    },
    // theme.ts の components に追加
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFACD', // アプリ背景と同じ
          borderRadius: 16,
          border: '1px solid #E0E0E0',
          padding: '8px',
          boxShadow: '0 8px 32px rgba(94, 64, 55, 0.2)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#3E2723', // ダークブラウン
          fontWeight: 600,
          textAlign: 'center',
          paddingBottom: '8px',
          fontSize: '1.25rem',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: '#5D4037', // ミディアムブラウン
          textAlign: 'center',
          paddingTop: '16px',
          paddingBottom: '16px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          justifyContent: 'center',
          gap: '16px',
          paddingBottom: '16px',
          paddingTop: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF', // 白背景
            '& fieldset': {
              borderColor: '#D7CCC8',
            },
            '&:hover fieldset': {
              borderColor: '#8D6E63',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF', // フォーカス時も白背景
              '& fieldset': {
                borderColor: '#FFD700',
                borderWidth: '2px',
              },
            },
            // 入力文字の色を強制的に指定（重要！）
            '& input': {
              color: '#3E2723 !important',
              fontSize: '1rem',
              fontWeight: 500,
              '&:focus': {
                color: '#3E2723 !important', // フォーカス時も確実に
                backgroundColor: 'transparent !important',
              },
            },
            // textarea の場合も同様
            '& textarea': {
              color: '#3E2723 !important',
              fontSize: '1rem',
              fontWeight: 500,
              '&:focus': {
                color: '#3E2723 !important',
                backgroundColor: 'transparent !important',
              },
            },
            // プレースホルダーの色
            '& input::placeholder': {
              color: '#8D6E63',
              opacity: 0.7,
            },
            '& textarea::placeholder': {
              color: '#8D6E63',
              opacity: 0.7,
            },
          },
          // ラベルの色
          '& .MuiInputLabel-root': {
            color: '#8D6E63',
            '&.Mui-focused': {
              color: '#FFD700',
              fontWeight: 600,
            },
          },
          // ヘルパーテキストの色
          '& .MuiFormHelperText-root': {
            color: '#8D6E63',
            '&.Mui-error': {
              color: '#D32F2F',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E0E0E0',
          '&.MuiPaper-elevation1': {
            boxShadow: '0 2px 8px rgba(94, 64, 55, 0.1)',
          },
          '&.MuiPaper-elevation2': {
            boxShadow: '0 4px 12px rgba(94, 64, 55, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFF8DC',
          color: '#5D4037',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #E0E0E0',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E0E0E0',
          borderRadius: 16,
          '&:hover': {
            boxShadow: '0 4px 12px rgba(94, 64, 55, 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      '"Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
    h1: {
      fontWeight: 700,
      color: '#3E2723',
      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    h2: {
      fontWeight: 700,
      color: '#3E2723',
    },
    h3: {
      fontWeight: 600,
      color: '#5D4037',
    },
    h4: {
      fontWeight: 600,
      color: '#5D4037',
    },
    h5: {
      fontWeight: 600,
      color: '#5D4037',
    },
    h6: {
      fontWeight: 600,
      color: '#5D4037',
    },
    button: {
      fontWeight: 700,
    },
    body1: {
      color: '#3E2723',
    },
    body2: {
      color: '#5D4037',
    },
    caption: {
      color: '#5D4037',
    },
  },
  shadows: [
    'none',
    '0 2px 8px rgba(94, 64, 55, 0.1)',
    '0 4px 12px rgba(94, 64, 55, 0.15)',
    '0 6px 16px rgba(94, 64, 55, 0.2)',
    '0 8px 20px rgba(94, 64, 55, 0.25)',
    '0 10px 24px rgba(94, 64, 55, 0.3)',
    '0 12px 28px rgba(94, 64, 55, 0.35)',
    '0 14px 32px rgba(94, 64, 55, 0.4)',
    '0 16px 36px rgba(94, 64, 55, 0.45)',
    '0 18px 40px rgba(94, 64, 55, 0.5)',
    '0 20px 44px rgba(94, 64, 55, 0.55)',
    '0 22px 48px rgba(94, 64, 55, 0.6)',
    '0 24px 52px rgba(94, 64, 55, 0.65)',
    '0 26px 56px rgba(94, 64, 55, 0.7)',
    '0 28px 60px rgba(94, 64, 55, 0.75)',
    '0 30px 64px rgba(94, 64, 55, 0.8)',
    '0 32px 68px rgba(94, 64, 55, 0.85)',
    '0 34px 72px rgba(94, 64, 55, 0.9)',
    '0 36px 76px rgba(94, 64, 55, 0.95)',
    '0 38px 80px rgba(94, 64, 55, 1)',
    '0 40px 84px rgba(94, 64, 55, 1)',
    '0 42px 88px rgba(94, 64, 55, 1)',
    '0 44px 92px rgba(94, 64, 55, 1)',
    '0 46px 96px rgba(94, 64, 55, 1)',
    '0 48px 100px rgba(94, 64, 55, 1)',
  ],
})

// 怒り度に応じた色を取得する関数
export const getAngerColor = (level: number): string => {
  const colors = {
    1: '#E8F5E8', // 非常に穏やか
    2: '#C8E6C9',
    3: '#A5D6A7',
    4: '#81C784',
    5: '#66BB6A', // 普通
    6: '#FFB74D',
    7: '#FFA726',
    8: '#FF9800',
    9: '#FF5722',
    10: '#D32F2F', // 非常に怒り
  }
  const key = Math.min(Math.max(1, level), 10) as keyof typeof colors
  return colors[key]
}

// スコアに応じた色を取得する関数
export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#FFD700' // 金色
  if (score >= 60) return '#C0C0C0' // 銀色
  return '#CD7F32' // 銅色
}

export default theme
