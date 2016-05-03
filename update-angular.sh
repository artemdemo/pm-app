#!/bin/bash

# This script will remove current angular2 library and it's components
# And then install new versions from npm
# At the end it will run `npm run build` and `npm start`

YELLOW='\033[1;33m'
BLUE='\033[1;34m'
RED='\033[1;31m'
NC='\033[0m'

printf "\n"
printf "${BLUE}This command will replace angular2 and it's components with the last ones from npm${NC} \n"
printf "${YELLOW}Proceed?${NC} \n"
read -p "[y|n] " -n 1 -r < /dev/tty
echo

if echo $REPLY | grep -E '^[Yy]$' > /dev/null
then
    printf "\n"
    printf "${BLUE}Removing angular2 and it's components ${NC} \n"
    npm uninstall @angular/common @angular/compiler @angular/core @angular/http @angular/platform-browser @angular/platform-browser-dynamic @angular/router-deprecated zone.js es6-shim reflect-metadata rxjs ts-loader typescript --save-dev

    printf "\n"
    printf "${BLUE}Installing last version of angular2 and it's components${NC} \n"
    npm i @angular/common @angular/compiler @angular/core @angular/http @angular/platform-browser @angular/platform-browser-dynamic @angular/router-deprecated zone.js es6-shim reflect-metadata rxjs ts-loader typescript --save-dev

    printf "\n"
    printf "${BLUE}Building project${NC} \n"
    npm run build

    printf "\n"
    printf "${YELLOW}All done, you can open project in your browser${NC} \n"
    printf "${RED}[!] ${BLUE}Pay attention that there may be ${RED}breaking changes${BLUE}:${NC} "
    printf "https://github.com/angular/angular/blob/master/CHANGELOG.md \n"

fi
