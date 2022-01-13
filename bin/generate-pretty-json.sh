#!/bin/bash

DIR="${1}"

if [ -z "${DIR}" ] ; then
  echo "usage: generate-pretty-json.sh JSON-DIRECTORY" >&2
  exit 1
fi


find "${DIR}" -name "*.json" -not -name "*.pretty.json" | while read json ; do
  json_pp -json_opt pretty,utf8 < "${json}" > "${json%.json}.pretty.json"
done
