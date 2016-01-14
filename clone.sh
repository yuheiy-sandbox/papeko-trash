#!/bin/sh
if [ -d dist/ ]; then
  rm -rf dist/
fi

git clone -b gh-pages https://github.com/yuheiy/papeko.git dist
