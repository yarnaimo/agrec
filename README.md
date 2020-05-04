# agrec

agqr を録画して Google ドライブにアップロードするやつ (v2)

## 📌 v1 → v2 のアップデート方法

1.  v1 の cron ジョブを削除する
1.  `yarn global add pm2`
1.  `git pull && yarn`
1.  設定ファイル を `config.yaml` に移行する (フォーマットは Install の 3. を参照)
1.  `yarn start`

以降は config.yaml が変更されると予約リストが Webhook に通知されます。

## Requirement

Ubuntu 以外は動作確認していません

-   **rtmpdump**
-   **ffmpeg**
-   **Node.js** (>=12)
-   **yarn** (npm を使う場合は適宜読み替えてください)
-   **pm2** (`yarn global add pm2` でインストール)

## Install

### 1. リポジトリを clone して依存関係をインストールする

```
git clone https://github.com/yarnaimo/agrec.git
cd agrec
yarn
```

### 2. Google Drive API の準備

1.  https://developers.google.com/drive/api/v3/quickstart/nodejs の **Enable the Drive API** をクリック
2.  **Download client configuration** をクリックしてダウンロードした `credentials.json` を `.data/` に移動する
3.  `node authorize-google-drive.js` を実行して表示された URL をブラウザで開き、最後に表示されるコードをターミナルに貼り付ける
4.  `.data/token.json` が作られたのを確認する

### 3. 設定ファイルを作る

**`config.yaml`**

```yaml
webhookUrl: 'https://hooks.slack.com/services/xxxxx' # 通知しない場合は null
driveFolder: 'xxxxx' # Google ドライブのフォルダ ID (URL の末尾)

reserves:
    - label: 'himitsubako'
      disabled: false
      audioOnly: true # 録画後に音声のみ抽出する
      wday: 2 # 曜日
      start: [21, 30] # 時, 分
      length: 30 # 長さ (分)
```

### 4.サービスを起動する

```sh
yarn start
```

## v2 以降のアップデート方法

```
git pull
yarn
yarn start
```

## .agserver ファイルについて

録画用 URL が書かれた **`.agserver`** ファイルは git の管理下にあります。

誰かがリモートの `.agserver` を更新したら `git pull` でローカルに反映できますが、遅いときは各自で書き換えてください。

## Dockerでの実行方法

### Requirement

-   **Docker**
-   **Docker Compose**


### Install

#### 1. リポジトリを clone

```
git clone https://github.com/yarnaimo/agrec.git
cd agrec
```

#### 2. 設定ファイルの作成

通常インストール手順の [2. Google Drive API の準備](#2-google-drive-api-の準備) 、および [3. 設定ファイルを作る](#3-設定ファイルを作る) を実施してください。

タイムゾーンが `Asia/Tokyo` で問題ない場合は以下を実行します。

```
cp .env.sample .env
```

それ以外に設定する場合は上記実行後に `.env` ファイルの環境変数 `TZ` の値を変更してください。


#### 3. Dockerコンテナをバックグラウンドで起動

```
docker-compose up -d
```

### アップデート方法

**`config.yaml`** はホスト側のファイルを編集することで反映されます。

**`.agserver`** ファイルの更新だけであれば `git pull` で反映されます。

それ以外の場合は以下を実行してください。

```
git pull
docker-compose up -d --build
```
