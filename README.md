# agrec

agqr を録画するやつ

## Requirement

-   **rtmpdump**
-   **Node.js** (>=12)
-   **yarn** (npm を使う場合は適宜読み替えてください)

## Install

### リポジトリを clone して依存関係をインストールする

```
git clone https://github.com/yarnaimo/agrec.git
cd agrec
yarn
```

### 設定ファイルを作る

**`src/.config/default.ts`**

```ts
import { Config } from '../services/config'

export const configDefault: Config = {
    webhookUrl: 'https://hooks.slack.com/services/xxxxx', // 通知しない場合は null

    reserves: [
        {
            label: 'himitsubako', // ラベル (ファイル名の prefix)
            dow: 2, // 曜日
            start: [21, 30], // 時, 分
            durationMinutes: 30, // 長さ (分)
        },
    ],
}
```

### 録画テストスクリプトを cron に登録する

agqr は URL がよく変わるので一定間隔で録画テストを行うようにする (失敗したら config で設定した webhook に通知される)

```sh
0 0,12  * * *   cd path/agrec && node dist/api/test-rec.js >> .data/cron.log 2>&1
```

### 自動録画スクリプトを cron に登録する

```sh
* *     * * *   cd path/agrec && node dist/api/start-ready-reserves.js >> .data/cron.log 2>&1
```

## .agserver ファイルについて

録画用 URL が書かれた **`.agserver`** ファイルは git の管理下にあります。

誰かがリモートの `.agserver` を更新したら `git pull` でローカルに反映できますが、遅いときは各自で書き換えてください。
