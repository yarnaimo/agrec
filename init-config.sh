#!/bin/sh

CONFIG_DIR=src/.config
CONFIG_PATH=$CONFIG_DIR/default.ts

if [ ! -f $CONFIG_PATH ]; then
    mkdir -p $CONFIG_DIR

    echo "import { Config } from '../services/config'

export const configDefault: Config = {
    webhookUrl: null,
    driveFolder: null,

    reserves: [],
}
" > $CONFIG_PATH
fi
