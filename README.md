# agrec

agqr を録画して Google ドライブにアップロードするやつ

## Requirement

Ubuntu 以外は動作確認していません

-   **rtmpdump**
-   **ffmpeg**
-   **Node.js** (>=12)
-   **yarn** (npm を使う場合は適宜読み替えてください)
-   **ts-node** (`yarn global add ts-node` でインストール)

## Install

### リポジトリを clone して依存関係をインストールする

```
git clone https://github.com/yarnaimo/agrec.git
cd agrec
yarn
```

### Google Drive API の準備

1.  https://developers.google.com/drive/api/v3/quickstart/nodejs の **Enable the Drive API** をクリック
2.  **Download client configuration** をクリックしてダウンロードした `credential.json` を `.data/` に移動する
3.  `node authorize-google-drive.js` を実行して表示された URL をブラウザで開き、最後に表示されるコードをターミナルに貼り付ける
4.  `.data/token.json` が作られたのを確認する

### 設定ファイルを作る

**`src/.config/default.ts`**

```ts
import { Config } from '../services/config'

export const configDefault: Config = {
    webhookUrl: 'https://hooks.slack.com/services/xxxxx', // 通知しない場合は null
    driveFolder: 'xxxxx', // Google ドライブのフォルダ ID (URL の末尾)

    reserves: [
        {
            active: true,
            audioOnly: true, // 録画後に音声のみ抽出する
            label: 'himitsubako', // ラベル (ファイル名の prefix)
            dow: 2, // 曜日
            start: [21, 30], // 時, 分
            durationMinutes: 30, // 長さ (分)
        },
    ],
}
```

### 録画テストスクリプト / 自動録画スクリプトを cron に登録する

agqr は URL がよく変わるので一定間隔で録画テストを行うようにする (失敗したら config で設定した webhook に通知される)

```sh
PATH=/usr/bin:/usr/local/bin:$PATH

0 0,12  * * *   cd path/agrec && ./cron.sh src/api/test-rec.ts
* *     * * *   cd path/agrec && ./cron.sh src/api/start-ready-reserves.ts
```

## .agserver ファイルについて

録画用 URL が書かれた **`.agserver`** ファイルは git の管理下にあります。

誰かがリモートの `.agserver` を更新したら `git pull` でローカルに反映できますが、遅いときは各自で書き換えてください。
