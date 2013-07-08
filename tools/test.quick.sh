echo ":: run quick tests :::::::::::::::::::::::::::::::::::"
#set -x

cd `dirname $0`/../

for SCRIPT in test/*.test.js
do
   node_modules/nodeunit/bin/nodeunit $SCRIPT || exit
done