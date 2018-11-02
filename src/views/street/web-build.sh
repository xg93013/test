#!/bin/bash
globalRootPath='/usr/local/data/moduleDir'
moduleDir=`grep -A 0 'name' package.json | cut -d '"' -f 4`
if [ ! -d $globalRootPath/$moduleDir ]; then
	mkdir $globalRootPath/$moduleDir
fi

if [ ! -d $globalRootPath/$moduleDir/src/svg ]; then
	mkdir -p $globalRootPath/$moduleDir/src/svg	
fi

cp -f -R ./src/svg/* $globalRootPath/$moduleDir/src/svg

if [ ! -d node_modules ]; then
	echo "null node_modules"
else 
	rm -rf node_modules
fi

cp -f package.json $globalRootPath/$moduleDir/

npm install --prefix $globalRootPath/$moduleDir/

ln -s $globalRootPath/$moduleDir/node_modules node_modules

npm run build


