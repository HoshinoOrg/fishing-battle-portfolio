# ポートフォリオ

このリポジトリは、私の個人開発中のプロジェクトです。

開発途中のプロジェクトのため、いくつかの機能が不足していますが、デモとして使用可能なレベルの機能を有しています。

## 概要

釣りのポイント制バトルをするためのアプリです。
SNSの友達と釣りのバトルをするときに使うことを想定しています。


## デモ
URL:https://main.d36ssoxvo58uld.amplifyapp.com/

全ての機能がお使いいただけますが、時間によって以下の画面が切り替わるようになっています。

以下のリンクは時間の調整がしてありますので、ご利用ください。

対戦前の画面：https://main.d36ssoxvo58uld.amplifyapp.com/group/QfbPyQFokd136RJuAyut

対戦中の画面：https://main.d36ssoxvo58uld.amplifyapp.com/group/SW8wmMA8IW3F7moQdJwr

対戦後の画面：https://main.d36ssoxvo58uld.amplifyapp.com/group/5mW7ikH3GoVEMowtCotm


## 機能

- URLベースでの共有機能
- FireStoreのによる、釣果情報の保持
- 釣果ポイントによるランキング機能

## インストール方法

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

4. firebaseConfig.tsに自身のFirebase環境のデータをセット

5. 開発サーバーを起動します：
    ```bash
    npm run dev
    ```

## 使用方法

ポートフォリオを表示するには、ブラウザを開いて `http://localhost:3000` にアクセスしてください。

## 使用技術

- HTML、TailwindCSS、TypeScript
- React,Next
- Firebase
- hosting Amplify
