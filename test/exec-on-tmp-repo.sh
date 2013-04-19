set +x

CMD=$1

[ CMD ] || exit 10

TMP_DIR=`mktemp -d -t clonejs`
REPO_DIR=`pwd`

cd $TMP_DIR
ERR=0

MODULE_DIR=node_modules/clonejs
if [ !  -d $MODULE_DIR ]; then
    rm -rf $MODULE_DIR
    git clone "$REPO_DIR" $MODULE_DIR || ERR=$?
    #npm install clonejs || ERR=$?
fi

[ ERR -eq 0 ] && $CMD || ERR=$?

rm -rf $TMP_DIR
exit $ERR