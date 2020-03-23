# agrec

agqr を録画するやつ

## Requirement

-   **Node.js** (>=12)
-   **yarn** (npm を使う場合は適宜読み替えてください)

## Install

### リポジトリを clone する

```
git clone https://github.com/yarnaimo/agrec.git
```

### 設定ファイルを作る

**`src/.config/env-default.ts`**

```ts
import { Env } from '../services/env'

export const envDefault: Env = {
    webhookUrl: 'https://hooks.slack.com/services/xxxxx', // 通知しない場合は null

    reserves: [
        {
            label: 'himitsubako', // ラベル (ファイル名の prefix)
            dow: 2, // 曜日
            hour: 21, // 時
            minute: 30, // 分
        },
    ],
}
```

### 録画テストスクリプトを cron に登録する

agqr は URL がよく変わるので一定間隔で録画テストを行い、失敗したら slack に通知を送るようにする

```sh
0 0,12  * * *  root   cd path/agrec && yarn ts-node src/api/test-rec.ts
```

### 自動録画スクリプトを cron に登録する

```sh
* *     * * *  root   cd path/agrec && yarn ts-node src/api/start-ready-reserves.ts
```

## .agserver ファイルについて

録画用 URL が書かれた **`.agserver`** ファイルは git の管理下にあります。

誰かがリモートの `.agserver` を更新したら `git pull` でローカルに反映できますが、遅いときは各自で書き換えてください。
