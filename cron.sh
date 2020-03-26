#!/bin/sh

node_modules/.bin/ts-node -T $1 >> .data/cron.log 2>&1
