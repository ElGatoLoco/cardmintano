alias cardano-cli="/Applications/Daedalus\ Testnet.app/Contents/MacOS/cardano-cli"

cardano-cli query utxo --address $(< "$APP_DATA_DIR/data/payment.addr") \
  --testnet-magic $TESTNET_ID \
  --mary-era
