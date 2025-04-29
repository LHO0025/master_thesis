#!/bin/bash

CHANNELS=()
RTL_TCP=()
PLAYBACK=()
USERS=()

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -c|--channels)
            shift
            while [[ "$#" -gt 0 && "$1" != -* ]]; do
                CHANNELS+=("$1")
                shift
            done
            ;;
        -rtl_tcp)
            shift
            while [[ "$#" -gt 0 && "$1" != -* ]]; do
                RTL_TCP+=("$1")
                shift
            done
            ;;
        -p|--playback)
            shift
            while [[ "$#" -gt 0 && "$1" != -* ]]; do
                PLAYBACK+=("$1")
                shift
            done
            ;;
        -u|--users)
            shift
            while [[ "$#" -gt 0 && "$1" != -* ]]; do
                USERS+=("$1")
                shift
            done
            ;;
        *)
            echo "Unknown argument: $1"
            exit 1
            ;;
    esac
done

# Build web client
cd ./web
IP=$(hostname -I | awk '{print $1}')
sed -i "s|^VITE_SERVER_URL=.*|VITE_SERVER_URL=http://$IP:5000|" ".env"
npm run build
cd ../

# Clean up old web output
rm -rf server/assets/*
rm -rf server/templates/*
mv web/dist/assets/* server/assets/
mv web/dist/index.html server/templates/

# Build demodulator (welle-cli)
mkdir -p demodulator/build  # <-- create build folder if it doesn't exist
cd demodulator/build
make
cd ../../

# Replace old welle-cli binary
if [ -f server/welle-cli ]; then
    rm server/welle-cli
fi
mv demodulator/build/welle-cli server/


cd server

CMD="python server_new.py -c ${CHANNELS[@]}"

if [ ${#RTL_TCP[@]} -gt 0 ]; then
    CMD+=" -rtl_tcp ${RTL_TCP[@]}"
fi

if [ ${#PLAYBACK[@]} -gt 0 ]; then
    CMD+=" -p ${PLAYBACK[@]}"
fi

if [ ${#USERS[@]} -gt 0 ]; then
    CMD+=" -u ${USERS[@]}"
fi

eval $CMD
