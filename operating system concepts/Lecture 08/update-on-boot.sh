#!/usr/bin/env bash

if [ ${EUID} -ne 0 ]
then
	exit 1 # this is meant to be run as root
fi

apt-get update 1>/dev/null 2>>/root/sys-update.log
