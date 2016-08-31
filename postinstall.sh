#!/usr/bin/env bash

# copying hooks
cp -i hooks/pre-commit.sh .git/hooks/pre-commit
cp -i hooks/pre-push.sh .git/hooks/pre-push

# installing last chrome driver
node_modules/selenium-standalone/bin/selenium-standalone install
