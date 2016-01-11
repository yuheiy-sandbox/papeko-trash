#!/bin/sh
cd dist/
git add --all
git commit -m 'Build'
git push origin gh-pages
cd ../
