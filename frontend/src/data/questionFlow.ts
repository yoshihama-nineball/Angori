import type { QuestionData } from '@/types/counseling'

export const questionFlow: QuestionData[] = [
  {
    id: 'greeting',
    content:
      'やあ！アンガーマネジメント相談室へようこそウホ！🦍 今日はどんなことがあったのか、一緒に整理してみようウホ。まずは、いやだった出来事がいつ起きたのか教えてほしいウホ！',
    type: 'text',
    field: 'occurred_at',
  },
  {
    id: 'location',
    content:
      'なるほどウホ！それはどこで起きたことなんだウホ？場所を教えてほしいウホ。',
    type: 'text',
    field: 'location',
  },
  {
    id: 'facts',
    content:
      'そうだったのかウホ。次は今回どんなことがあったのか書いてほしいウホ。事実と認知を分けるため、起こった事実だけを書いてほしいウホ！📝',
    type: 'text',
    field: 'situation_description',
  },
  {
    id: 'perception',
    content:
      'そんなことがあったのかウホ。ちなみにその時どのようにできごとをとらえたウホか？君がどう感じたか、どう解釈したかを教えてほしいウホ。',
    type: 'text',
    field: 'perception',
  },
  {
    id: 'emotion',
    content:
      'その時まず最初に感じた感情を選んでほしいウホ。複数選んでも大丈夫ウホ！',
    type: 'emotion',
    options: [
      '怒り',
      '悲しみ',
      '呆れ',
      '恐怖',
      '不安',
      '失望',
      'イライラ',
      '困惑',
    ],
    field: 'emotions_felt',
  },
  {
    id: 'anger_level',
    content:
      '今回の怒りはバナナ何本分...じゃなくて10段階中いくつだウホ？🍌 1が全然怒ってない、10が超激怒ウホ！',
    type: 'rating',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    field: 'anger_level',
  },
  {
    id: 'trigger',
    content:
      '今回の出来事は何がトリガーだったと思うウホか？過去にも似たようなことで怒ったことがあれば、それも教えてほしいウホ。',
    type: 'text',
    field: 'trigger_words',
  },
  {
    id: 'reflection',
    content:
      '最後に、今振り返ってみてどう感じるウホ？気づいたことや、次回同じようなことがあった時にどうしたいかを教えてほしいウホ。',
    type: 'text',
    field: 'reflection',
  },
]
