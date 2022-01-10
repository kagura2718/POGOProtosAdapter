#!/bin/bash

DIR="${1}"

if [ -z "${DIR}" ] ; then
  exit 1
fi


find "${DIR}" -name "*.json" -not -name "*.pretty.json" | while read json ; do
  json_pp < "${json}" > "${json%.json}.pretty.json"
done
