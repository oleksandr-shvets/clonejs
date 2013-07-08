echo ":: deploy html-pages ::::::::::::::::::::::::::::::"

cd  `dirname $0`/../build/html
git commit -a -m "Deploy html. $1" || exit 10
git push git@github.com:quadroid/clonejs.git gh-pages