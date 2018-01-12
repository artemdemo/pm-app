#!/usr/bin/env bash

# copying hooks
cp -i hooks/pre-commit.sh .git/hooks/pre-commit

# installing last chrome driver
node_modules/selenium-standalone/bin/selenium-standalone install
