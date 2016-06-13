#!/usr/bin/env bash

TMP_PID_FILE="e2e-test-terminal.pid"

npm run build

gnome-terminal --command="npm start" --title "node server window for e2e test" --disable-factory &
echo ${!} > ${TMP_PID_FILE}

./node_modules/protractor/bin/webdriver-manager update && protractor protractor.conf.js

if [ -f ${TMP_PID_FILE} ]; then
  kill $(cat ${TMP_PID_FILE} && rm ${TMP_PID_FILE})
fi
