echo ":: deploy wiki-pages ::::::::::::::::::::::::::::::"

cd `dirname $0`/../wiki
cp ../README.md Home.md        || exit 10
git commit -a -m "Deploy $1"   || exit 20
git push