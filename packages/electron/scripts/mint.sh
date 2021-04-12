alias cardano-cli="/Applications/Daedalus\ Testnet.app/Contents/MacOS/cardano-cli"

cardano-cli transaction build-raw \
  --mary-era \
  --fee $TX_FEE \
  --tx-in $TX_HASH#$TX_IX \
  --tx-out "$TX_OUT_STRING" \
  --mint="$TOKEN_AMOUNT $(< "$APP_DATA_DIR/data/policy/policyId").$TOKEN_NAME" \
  --out-file "$APP_DATA_DIR/data/matx.raw"

cardano-cli transaction sign \
  --signing-key-file "$APP_DATA_DIR/data/payment.skey" \
  --signing-key-file "$APP_DATA_DIR/data/policy/policy.skey" \
  --script-file "$APP_DATA_DIR/data/policy/policy.script" \
  --testnet-magic $TESTNET_ID \
  --tx-body-file "$APP_DATA_DIR/data/matx.raw" \
  --out-file "$APP_DATA_DIR/data/matx.signed"

cardano-cli transaction submit --tx-file "$APP_DATA_DIR/data/matx.signed" --testnet-magic $TESTNET_ID
