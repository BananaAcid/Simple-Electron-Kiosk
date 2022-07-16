@ECHO OFF
:start
..\node_modules\electron\dist\electron.exe -r ts-node/register --no-warnings ../index.ts

pause press to restart
goto start
