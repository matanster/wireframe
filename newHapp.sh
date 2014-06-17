echo
echo "attempting to change heroku target to new app named $1"
echo "old git remotes are:"
git remote -v
git remote remove heroku
git remote add heroku "git@heroku.com:$1.git"
echo "new git remotes are:"
git remote -v
echo