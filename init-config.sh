#!/bin/sh

CONFIG_PATH=src/.config/default.ts

if [ ! -f $CONFIG_PATH ]; then
    echo "import { Config } from '../services/config'

export const configDefault: Config = {
    webhookUrl: null,
    driveFolder: null,

    reserves: [],
}
" > $CONFIG_PATH
fi
