@ECHO OFF
:start
node_modules\electron\dist\electron.exe index.js

pause press to restart
goto start
