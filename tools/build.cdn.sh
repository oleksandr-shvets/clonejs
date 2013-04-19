echo ":: build CDN :::::::::::::::::::::::::::::::::::"

cd `dirname $0`

### minify:

./build.minify.sh              || exit
    
### copy to cdn:

cd ../build/

cp clone*.js html/cdn/         || exit 20
cp ../src/clone*.js html/cdn/  || exit 30

echo "Build succeful."