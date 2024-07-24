# ポートフォリオ

このリポジトリは、私の個人開発中のプロジェクトです。

開発途中のプロジェクトのため、いくつかの機能が不足していますが、デモとして使用可能なレベルの機能を有しています。

## 概要

釣りのポイント制バトルをするためのアプリです。

SNSの友達と釣りのバトルをするときに使うことを想定しています。

簡単に共有できることを目的としているため、URLごとに対戦用のグループが作成されるような設計になっています。


## デモ
URL:https://main.d36ssoxvo58uld.amplifyapp.com/

全ての機能がお使いいただけますが、時間によって以下の画面が切り替わるようになっています。

以下のリンクは時間の調整がしてありますので、ご利用ください。

- [対戦前の画面](https://main.d36ssoxvo58uld.amplifyapp.com/group/QfbPyQFokd136RJuAyut)
- [対戦中の画面](https://main.d36ssoxvo58uld.amplifyapp.com/group/SW8wmMA8IW3F7moQdJwr)
- [対戦後の画面](https://main.d36ssoxvo58uld.amplifyapp.com/group/5mW7ikH3GoVEMowtCotm)

## 機能

- **グループ作成**: ユーザーは釣りバトル用のグループを作成し、メンバーを追加することができます。
- **スコアリングシステム**: 釣った魚の種類とサイズに基づいて自動的にポイントが計算されます。
- **リアルタイムデータ**: Firebase Firestoreを使用して、釣果情報をリアルタイムで保存および取得します。
- **ランキング機能**: 釣果ポイントに基づいてメンバーのランキングが表示されます。
- **URL共有**: 特定の釣りバトルページのURLを共有することで、他のユーザーがアクセスして結果を確認できます。
- **対戦状態の管理**: バトル前、バトル中、バトル後の3つの状態に応じて画面が自動的に切り替わります。

## 使用技術

- **フロントエンド**: HTML, TailwindCSS, TypeScript
- **フレームワーク**: React, Next.js
- **バックエンド**: Firebase (FireStore)
- **ホスティング**: AWS Amplify


## ローカルで動かす方法

1. リポジトリをクローンします：
    ```bash
    git clone https://github.com/hyrooon/fishing-battle-portfolio.git
    ```
2. プロジェクトディレクトリに移動します：

3. 依存関係をインストールします：
    ```bash
    npm install
    ```

4. Firebase環境の構築

5. firebaseConfig.tsに自身のFirebase環境のデータをセット

6. 開発サーバーを起動します：
    ```bash
    npm run dev
    ```

7. ポートフォリオを表示するには、ブラウザを開いて `http://localhost:3000` にアクセスしてください。

