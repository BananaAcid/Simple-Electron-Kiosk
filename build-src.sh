echo "expecting electron + packager to be installed globally 'npm i electron -g && npm i electron-packager -g' "
echo "expecting 'app-kiosk/npi i' had been run to initilaize dependencies"

electron-packager app-kiosk/. Simple-Electron-Kiosk_win_x64_asar --overwrite --asar --platform=win32 --arch=x64 --prune=true --out=build --version-string.CompanyName="Nabil Redmann" --version-string.FileDescription="Simple Electron Kiosk" --version-string.ProductName="Simple-Electron-Kiosk"

electron-packager app-kiosk/. Simple-Electron-Kiosk_win_x64 --overwrite --platform=win32 --arch=x64 --prune=true --out=build --version-string.CompanyName="Nabil Redmann" --version-string.FileDescription="Simple Electron Kiosk" --version-string.ProductName="Simple-Electron-Kiosk"

electron-packager app-kiosk/. Simple-Electron-Kiosk_osx_asar --overwrite --asar --platform=darwin --arch=x64 --prune=true --out=build --version-string.CompanyName="Nabil Redmann" --version-string.FileDescription="Simple Electron Kiosk" --version-string.ProductName="Simple-Electron-Kiosk"

electron-packager app-kiosk/. Simple-Electron-Kiosk_osx --overwrite--platform=darwin --arch=x64 --prune=true --out=build --version-string.CompanyName="Nabil Redmann" --version-string.FileDescription="Simple Electron Kiosk" --version-string.ProductName="Simple-Electron-Kiosk"
