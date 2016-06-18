#!/usr/bin/env bash

TMP_PID_FILE="e2e-test-terminal.pid"
TMP_DB_FILE="e2e-test.db"

# npm run build

if [ -f ${TMP_DB_FILE} ]; then
  rm ${TMP_DB_FILE}
fi

gnome-terminal --command="node ./server/index --db=${TMP_DB_FILE} --migrate" --title "pm for e2e test" --disable-factory &
echo ${!} > ${TMP_PID_FILE}

./node_modules/protractor/bin/webdriver-manager update && protractor protractor.conf.js

if [ -f ${TMP_PID_FILE} ]; then
  kill $(cat ${TMP_PID_FILE} && rm ${TMP_PID_FILE})
fi

rm ${TMP_DB_FILE}
