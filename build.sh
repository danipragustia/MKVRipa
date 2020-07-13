#!/bin/bash

mkdir -p $(pwd)/_temp
cd $(pwd)/_temp

IFS=$'\n'

electron-packager ../ --all --overwrite

for f in $(find "$1" -mindepth 1 -maxdepth 1 -type d ); do
	zip -r "$f" "$f"
done
