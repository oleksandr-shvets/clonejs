echo ":: build API documentation ::::::::::::::::::::::::::::::"

cd `dirname $0`/../lib/jsdoc-toolkit/

./jsrun.sh \
    -v -a -p -r=2 \
    -D="title:clone.js" \
    -d=../../build/html/ \
    -t=./templates/codeview-jsdoc2-template/ \
    ../../src/