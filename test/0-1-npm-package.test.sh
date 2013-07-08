#!/bin/sh
echo ":: npm package test ::::::::::::::::::::::::::::::"
set -x

`dirname $0`/exec-on-tmp-repo.sh "npm test"