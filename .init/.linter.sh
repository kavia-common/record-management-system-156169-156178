#!/bin/bash
cd /home/kavia/workspace/code-generation/record-management-system-156169-156178/angular_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

