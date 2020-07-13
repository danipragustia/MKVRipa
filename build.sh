#!/bin/bash


mkdir -p $(pwd)/_temp
cd $(pwd)/_temp

IFS=$'\n'
VERSION=`node -p "require('../package.json').version"`

electron-packager ../ --all --overwrite

for f in $(find -mindepth 1 -maxdepth 1 -type d ); do
	zip -r "$f-$VERSION.zip" "$f"
done
