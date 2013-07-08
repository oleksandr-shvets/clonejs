echo ":: release :::::::::::::::::::::::::::::::::::::"
cd `dirname $0`

NEW_VERSION="$1"
OLD_VERSION=`cat ../.version`

if [ -z $1 ]
then
    ./test.quick.sh
      
    echo 
    echo "Usage: $0 VERSION"
    echo "Last release is: $OLD_VERSION"
    exit 10
fi

echo ":: Building release $NEW_VERSION ::"
set -x

./build.cdn.sh || exit 15

./test.sh || (echo -e "\r\nPlease fix all tests to continue."; exit 20)

# write $NEW_VERSION into .version file (without CRLF):
echo "$NEW_VERSION" | tr -d "[\r\n]" > ../.version

# replace version in files:
sed -i "" "s/\( *\"version\" *: *\"\)$OLD_VERSION\(\" *,\)/\1$NEW_VERSION\2/g" \
    ../package.json \
    ../component.json \
    || exit 30
sed -i "" "s/\(@version \)$OLD_VERSION/\1$NEW_VERSION/g" \
    ../src/clone.js \
    || exit 40
    
./build.docs.sh                || exit 50
./build.html.sh                || exit 60

./deploy.push.sh $OLD_VERSION  || exit 70

./deploy.npm-package.sh        || exit 80

echo "Release $NEW_VERSION succeful!"