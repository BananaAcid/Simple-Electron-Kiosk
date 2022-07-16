while [  true ]; do
	../node_modules/.bin/electron   -r ts-node/register --no-warnings   ../index.ts
	read -p "Press [Enter] key to start electron again, or CTRL+C to exit"
done