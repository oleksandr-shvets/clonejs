echo ":: run all tests :::::::::::::::::::::::::::::::::"
set -x

cd `dirname $0`/../

# slow tests:
for SCRIPT in test/*.test.sh
do
   $SCRIPT
   [ $? -eq 0 ] || exit
done

# quick tests:
tools/test.quick.sh