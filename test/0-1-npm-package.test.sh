#!/bin/sh
echo ":: npm package test ::::::::::::::::::::::::::::::"

`dirname $0`/exec-on-tmp-repo.sh "npm test clonejs"