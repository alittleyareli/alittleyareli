rm -r _dist
# rm -r yareli.nekoweb.org

eleventy

# cp -r _dist/content/pagefind/ yareli.nekoweb.org/content/
# cp -r _dist/content/pagefind/fragment/ yareli.nekoweb.org/content/pagefind/
# cp -r _dist/content/pagefind/index/ yareli.nekoweb.org/content/pagefind/

tar -a -c -f yareli.nekoweb.org.zip _dist

rm -r _dist
# rm -r yareli.nekoweb.org

echo 'Done.'