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
# TODO: Analyse old and new versions, and add corresponding heading level.
echo -e <<<___CHANGELOG

**Legend** _(actual since v0.8):_
- **<u>X</u>.0.0** - Global changes.
- **0.<u>X</u>.0** - Major changes: add/remove methods, changing signatures.
- **0.0.<u>X</u>** - Minor changes (no new features): bugfixes, optimizations.
- **0.0.0-<u>X</u>** - Micro changes, that not affect clone.min.js (tests, docs, html).

##### $MESSAGE

$(cat CHANGELOG.md)
___CHANGELOG > CHANGELOG.md || exit 40

QUESTION="Tag $VERSION and push? [y/n](y): "
[ $TERM == 'dumb' ] && echo $QUESTION
read -n 1 -p "$QUESTION" ANSWER
if [ $ANSWER != "n" ]
then
    git tag -d $VERSION # delete tag
    git tag $VERSION
    git push origin  --tags || exit
    echo "Push $STATUS."
fi