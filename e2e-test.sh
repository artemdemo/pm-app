#!/usr/bin/env bash

TMP_PID_FILE_NODE="e2e-test-terminal-node.pid"
TMP_DB_FILE="e2e-test.db"

# npm run build

if [ -f ${TMP_DB_FILE} ]; then
  rm ${TMP_DB_FILE}
fi

gnome-terminal --command="node ./server/index --db=${TMP_DB_FILE} --migrate" --title "node server for e2e test" --disable-factory &
echo ${!} > ${TMP_PID_FILE_NODE}

./node_modules/.bin/nightwatch app/e2e

if [ -f ${TMP_PID_FILE_NODE} ]; then
  kill $(cat ${TMP_PID_FILE_NODE} && rm ${TMP_PID_FILE_NODE})
fi

rm ${TMP_DB_FILE}
