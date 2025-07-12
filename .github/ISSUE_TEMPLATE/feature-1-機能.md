---
name: feature 1 機能
about: 機能追加のIssueです
title: ''
labels: enhancement
assignees: yoshihama-nineball

---

以下、アカウント作成機能を例にテンプレを記載してみた。参考にして書くこと。

## 概要
フロントエンド、バックエンド両方にアカウント作成機能を実装してテストコードを書く。

## 目的
- アプリの認証機能の第一歩のユーザ登録機能を追加し、次のユーザアカウント確認機能につなげるため
- [Resend](https://resend.com)というメール配信サービスを使って、認証コードを送れるようにするため

## 作業内容
### 事前準備
- [ ] [Resend](https://resend.com)でAPIを作成し、環境変数を設定する

### バックエンド
- [ ] modelsでuserとpostの関連付けを書く(ER図はこのリポジトリとBLOG-MERN-APPのREADMEにある)
- [ ] authのrouterとcontrollerの追加
- [ ] パスワードのハッシュ化
- [ ] アカウント確認のためのtoken生成(認証コード)
- [ ] メール配信サービス[Resend](https://resend.com)を使ってユーザ作成時にメールを送信できるように実装
- [ ] 単体テスト
- [ ] 結合テスト
- [ ] `yarn fix`で整形
- [ ] `yarn build`でビルド

### フロントエンド
- [ ] page.tsxの追加
- [ ] `components/auth/LoginForm.tsx`の作成
- [ ] サーバーアクションの作成
- [ ] スキーマの作成
- [ ] 機能実装
- [ ] 単体テスト
- [ ] 結合テスト(可能であれば)
- [ ] `yarn fix`で整形
- [ ] `yarn build`でビルド


### ドメイン設定 (オプション)
- [ ] カスタムドメインの設定
- [ ] SSL証明書の確認

## 完了条件
- [ ] アカウント作成機能を実装し、所持するメールアドレスを用いてメール配信できることを実際確認できること。
- [ ] 実装後、`yarn fix`でコード品質を保つこと
- [ ] バックエンドでアカウント作成の単体テストが書けていること
- [ ] バックエンドでアカウント作成の結合が書けていること
- [ ] フロントエンドでアカウント作成の単体テストが書けていること
- [ ] 実装後、フロントエンド、バックエンドともにbuildが完了していること。

## 📚 参考資料
- [Resend](https://resend.com)
- [フォームのuseActionState](https://ja.react.dev/reference/react/useActionState)

## 🔗 関連Issue
TODO: 次のアカウント確認機能の#を追加する


## メモ
以前作成した家計簿アプリの実装を参考にする
