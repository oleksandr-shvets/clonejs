echo ":: development setup :::::::::::::::::::::::::::::::::"
set -x

cd `dirname $0`/../

mkdir tmp

git submodule init
git submodule update

#for MODULE in node_modules/*
#do
#
#done