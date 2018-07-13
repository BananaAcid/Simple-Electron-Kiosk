@ECHO OFF
:start
app-kiosk\node_modules\electron\dist\electron.exe app-kiosk/loader.babel.js

pause press to restart
goto start
