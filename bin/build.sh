rm -rf .cache

npx @11ty/eleventy

mv _dist yareli.nekoweb.org
tar -c -a -f yareli.nekoweb.org.zip yareli.nekoweb.org
mv yareli.nekoweb.org _build