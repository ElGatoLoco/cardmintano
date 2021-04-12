alias cardano-cli="/Applications/Daedalus\ Testnet.app/Contents/MacOS/cardano-cli"

cardano-cli transaction build-raw \
  --mary-era \
  --fee 0 \
  --tx-in $TX_HASH#$TX_IX \
  --tx-out="$TX_OUT_STRING" \
  --mint="$TOKEN_AMOUNT $(< "$APP_DATA_DIR/data/policy/policyId").$TOKEN_NAME" \
  --out-file "$APP_DATA_DIR/data/matx.raw"

cardano-cli transaction calculate-min-fee \
  --tx-body-file "$APP_DATA_DIR/data/matx.raw" \
  --tx-in-count 1 \
  --tx-out-count 1 \
  --witness-count 1 \
  --testnet-magic $TESTNET_ID \
  --protocol-params-file "$APP_DATA_DIR/data/protocol.json"
