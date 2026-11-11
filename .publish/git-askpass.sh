#!/bin/sh
# Git askpass helper for the House-Design publish push.
# Reads GITHUB_DASHBOARD_TOKEN from the environment. Do not run with -x.
set +x
prompt=$1
case "$prompt" in
  *[Uu]sername*) printf '%s\n' "x-access-token" ;;
  *) printf '%s\n' "${GITHUB_DASHBOARD_TOKEN}" ;;
esac
