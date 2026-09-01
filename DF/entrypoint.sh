#!/bin/sh
set -e
echo "Running Prisma db push..."
echo "Starting application..."
exec node dist/main

