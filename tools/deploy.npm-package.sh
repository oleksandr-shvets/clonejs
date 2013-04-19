echo ":: deploy npm-package ::::::::::::::::::::::::::::::"

VERSION=`cat ../.version`

cd  `dirname $0`/../tmp/

rm -rf clean-repo
git clone ../ clean-repo         || exit 10

cd clean-repo
npm unpublish "clonejs@$VERSION" || exit 20
npm publish                      || exit
