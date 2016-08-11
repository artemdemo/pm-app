#!/usr/bin/env bash

TMP_PID_FILE_NODE="e2e-test-terminal-node.pid"
TMP_DB_FILE="e2e-test.db"

# npm run build

if [ -f ${TMP_DB_FILE} ]; then
  rm ${TMP_DB_FILE}
fi

# Run server with custom db and create all tables:
# node ./server/index --db=e2e-test.db --migrate

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    gnome-terminal --command="node ./server/index --db=${TMP_DB_FILE} --migrate" --title "node server for e2e test" --disable-factory &
    echo ${!} > ${TMP_PID_FILE_NODE}
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # in osx there is a problem with closing terminal from bash
    osascript -e 'tell application "Terminal" to activate' \
              -e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down' \
              -e 'tell application "Terminal" to do script "node ./server/index --db=\"'${TMP_DB_FILE}'\" --migrate" in front window' \
              -e 'tell application "Terminal" to do script "echo \"After test you will need to close this tab manually Ctrl+W\"" in front window'
              # | awk '{print $NF}' > ${TMP_PID_FILE_NODE}
else
    echo 'Unknown OS'
fi

./node_modules/.bin/nightwatch app/e2e/*.js

if [[ "$OSTYPE" == "darwin"* ]]; then
    ps aux | grep node | egrep -o "(\d+).+server\/index" | cut -d' ' -f1 | xargs kill
fi

if [ -f ${TMP_PID_FILE_NODE} ]; then
  kill $(cat ${TMP_PID_FILE_NODE} && rm ${TMP_PID_FILE_NODE})
fi

rm ${TMP_DB_FILE}
