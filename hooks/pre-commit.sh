#!/bin/sh

YELLOW='\033[1;33m'
BLUE='\033[1;34m'
RED='\033[1;31m'
NC='\033[0m'

# --cached      - difference of staged files
# --name-only   - list of file names that changed
# --diff-filter - filter staged files.
#   Select only files that are:
#     A - Added
#     C - Copied
#     M - Modified
#     R - Renamed
# More about `git diff`:
# https://git-scm.com/docs/git-diff
files=$(git diff --cached --name-only --diff-filter=ACMR | egrep '\.js[x]?$')

if [ -n "$files" ]; then
    PATH=$(npm bin):$PATH eslint $files
    RESULT=$?
    if [ $RESULT -ne 0 ]
    then
        printf "${RED}[!] ${BLUE}Commit aborted, please fix the problems in order to continue${NC} \n"
        printf "(You can use --no-verify to bypass it) \n"
        exit 1
    else
        exit 0
    fi
fi
