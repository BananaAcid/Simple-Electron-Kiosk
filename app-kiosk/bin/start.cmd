@ECHO OFF
:start
..\node_modules\electron\dist\electron.exe ../loader.babel.js

pause press to restart
goto start
