#!/bin/bash

#set -e

echo "running $@ after rpc"

rpc.statd
rpcbind

exec "$@"
