set -x

CMD=$1

[ CMD ] || exit 10

TMP_DIR=`mktemp -d -t clonejs`
cd "`dirname $0`/../"
REPO_DIR=`pwd`

cd $TMP_DIR
let ERR=0
git clone "$REPO_DIR" || ERR=$?
cd clonejs*
npm install || ERR=$?

[ "$ERR" = '0' ] && $CMD || ERR=$?

rm -rf $TMP_DIR
exit $ERR