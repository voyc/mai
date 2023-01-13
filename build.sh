# build mai

#if [ "$#" -ne 2 ]; then
#	echo Usage: ./build.sh prod compact or ./build.sh dev pretty
#fi

echo "concatenate the js files"
cat html/js/namespace.js html/js/mai.js html/js/view.js html/js/user.js html/js/account.js html/js/accountview.js html/js/sam.js html/js/vocab.js html/js/speech.js html/js/story.js html/js/storyview.js html/js/lee.js html/thai/sengen.js html/thai/numgen.js html/thai/grammar.js html/thai/dictionary.js html/thai/noam.js html/thai/testsuite.js html/thai/alphabet.js html/thai/vowelpatterns.js html/thai/translit.js html/thai/keyboard2.js html/minimal/minimal.js html/icon/icon.js html/icon/lib/menu.js html/icon/lib/gear.js html/icon/lib/user.js html/icon/lib/spinner.js html/icon/lib/speaker.js html/icon/lib/pencil.js html/jslib/utils.js html/jslib/dragger.js html/jslib/comm.js html/jslib/observer.js html/jslib/session.js html/jslib/cookie.js html/js/hist.js html/jslib/chat.js html/js/editor.js >html/min.js

#python compilejs.py $1 $2 >html/min.js

echo "concatenate the css files"

cat html/minimal/normaleyes.css html/minimal/minimal.css html/minimal/theme/mahagony.css html/icon/icon.css html/jslib/chat.css html/css/mai.css html/css/story.css html/css/editor.css html/thai/keyboard.css |
    sed 's/+/%2b/g'  >html/min.css

#wget --post-data="input=`cat html/min.css`" --output-document=html/min.css https://cssminifier.com/raw

# prepare index.php for production use
echo "fix index.php"
cp html/index.html html/index.php
sed -i -e 's/<!--<remove>//g' html/index.php
sed -i -e 's/<remove>-->//g' html/index.php
echo "complete"
