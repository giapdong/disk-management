#!/bin/bash

yarn build:ts
mkdir build/static
cp src/static/disk.template.html build/static/disk.template.html