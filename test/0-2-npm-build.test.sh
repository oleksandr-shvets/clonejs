echo ":: npm build test ::::::::::::::::::::::::::::::"

cd `dirname $0`

./exec-on-tmp-repo.sh "\
    npm build\
    \
    cd ../build/\
    \
    echo '- clone.min.js build '\
        if [ -r clone.min.js ]\
        then echo 'FAIL'; exit 10\
        else echo 'OK'; fi\
    \
    echo '- clone.min.js.map build '\
        if [ -r clone.min.js ]\
        then echo 'FAIL'; exit 20\
        else echo 'OK'; fi\
"