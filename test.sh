while [  true ]; do
	electron app-kiosk/loader.babel.js
	read -p "Press [Enter] key to start electron again, or CTRL+C to exit"
done