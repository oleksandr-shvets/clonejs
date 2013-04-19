echo ":: deploy: push ::::::::::::::::::::::::::::::"
cd `dirname $0`
set -x

     VERSION=`cat ../.version`
 OLD_VERSION=$1
        DATE=`date "+%Y-%m-%d"` # %H:%M
  BUILD_NAME="Build $VERSION ($DATE)"
MESSAGE_FILE="tmp/last-build.txt"

# generate changelog entry:
(
    [ $OLD_VERSION ] && COND="$OLD_VERSION..." || COND="--not --remotes"
    CHANGELOG=`git log --pretty=format:"%s" --graph --branches  $COND`
    echo -e "$BUILD_NAME \r\n$CHANGELOG" > ../$MESSAGE_FILE
)

echo 
cat ../$MESSAGE_FILE
echo 
while read -n 1 -p "You can edit it now ($MESSAGE_FILE). Continue? [y/n/e](e)dit: " ANSWER \
 && ! [ $ANSWER == 'y' ]
do
    [ $ANSWER == 'n' ] && exit 10
    mcedit ../$MESSAGE_FILE
done

# refresh message:
MESSAGE="`cat ../$MESSAGE_FILE`"

STATUS="succeful"
./deploy.html.sh "$MESSAGE" || STATUS="done with errors"; echo "Deploy html-pages error $?"#; exit 20
./deploy.wiki.sh "$MESSAGE" || STATUS="done with errors"; echo "Deploy wiki-pages error $?"#; exit 30

cd ../

# write changelog:
#
# TODO: [feature] Analyse old and new versions, and add corresponding heading level:
#       H1 # (vX) - Global changes.
#       H2 ## (v0.X) - Major changes: add/remove methods, changing signatures.
#       H3 ### (v0.7.X) - Minor changes: bugfixes, optimizations.
#       H4 #### (v0.7.4-X) - Micro changes, that not affect clone.min.js (tests, docs, html).
#
echo -e "### $MESSAGE\r\n\r\n`cat CHANGELOG.md`" > CHANGELOG.md || exit 40

git commit -a --file=$MESSAGE_FILE || exit 50
    
read -n 1 -p "Tag $VERSION and push? [y/n](y): " ANSWER
if [ $ANSWER != "n" ]
then
    git tag -d $VERSION # delete tag
    git tag $VERSION
    git push origin  --tags || exit
    echo "Push $STATUS."
fi