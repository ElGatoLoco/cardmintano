alias cardano-cli="/Applications/Daedalus\ Testnet.app/Contents/MacOS/cardano-cli"

if [ "$APP_DATA_DIR" == "" ] ||
[ "$TESTNET_ID" == "" ] ||
[ "$CARDANO_NODE_SOCKET_PATH" == "" ]; then
   exit 1
fi

if [ ! -d "$APP_DATA_DIR/data" ]; then
  mkdir -p "$APP_DATA_DIR/data"

  cardano-cli stake-address key-gen \
    --verification-key-file "$APP_DATA_DIR/data/stake.vkey" \
    --signing-key-file "$APP_DATA_DIR/data/stake.skey"

  cardano-cli address key-gen \
    --verification-key-file "$APP_DATA_DIR/data/payment.vkey" \
    --signing-key-file "$APP_DATA_DIR/data/payment.skey"

  cardano-cli address build \
    --payment-verification-key-file "$APP_DATA_DIR/data/payment.vkey" \
    --stake-verification-key-file "$APP_DATA_DIR/data/stake.vkey" \
    --out-file "$APP_DATA_DIR/data/payment.addr" \
    --testnet-magic $TESTNET_ID

  cardano-cli query protocol-parameters \
    --testnet-magic $TESTNET_ID \
    --mary-era \
    --out-file "$APP_DATA_DIR/data/protocol.json"

  mkdir "$APP_DATA_DIR/data/policy"

  cardano-cli address key-gen \
    --verification-key-file "$APP_DATA_DIR/data/policy/policy.vkey" \
    --signing-key-file "$APP_DATA_DIR/data/policy/policy.skey"

  touch "$APP_DATA_DIR/data/policy/policy.script" && echo "" > "$APP_DATA_DIR/data/policy/policy.script"

  echo "{" >> "$APP_DATA_DIR/data/policy/policy.script"
  echo "  \"keyHash\": \"$(cardano-cli address key-hash --payment-verification-key-file "$APP_DATA_DIR/data/policy/policy.vkey")\"," >> "$APP_DATA_DIR/data/policy/policy.script"
  echo "  \"type\": \"sig\"" >> "$APP_DATA_DIR/data/policy/policy.script"
  echo "}" >> "$APP_DATA_DIR/data/policy/policy.script"

  cardano-cli transaction policyid --script-file "$APP_DATA_DIR/data/policy/policy.script" >> "$APP_DATA_DIR/data/policy/policyId"
fi

echo $(< "$APP_DATA_DIR/data/payment.addr")
