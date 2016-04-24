#!/bin/bash
 
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
RED='\033[1;31m'
NC='\033[0m'
 
protected_branch='master'  
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
 
if [ $protected_branch = $current_branch ]  
then
	printf "${YELLOW}Wait\n"
	printf "${BLUE}You're about to push ${RED}MASTER${BLUE}, is that what you intended?${NC} \n"
	read -p "[y|n] " -n 1 -r < /dev/tty
	echo
	if echo $REPLY | grep -E '^[Yy]$' > /dev/null
	then
		exit 0 # push will execute
	fi
	exit 1 # push will not execute
else  
    exit 0 # push will execute
fi