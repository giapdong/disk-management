#!/bin/bash

yarn build:ts
mkdir -p build/static
cp src/static/disk.template.html build/static/disk.template.html