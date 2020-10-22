#!/bin/bash
docker exec secretdev \
  secretcli tx send a secret16we5nes8z923n4l2xxyefdfaheghjgcrg44jrx 10000000000uscrt -y -b block \
  --keyring-backend test

docker exec secretdev \
  secretcli tx send a secret10f3hwh8lczhjdje42rtyf3md5edy3htpkpphpl 10000000000uscrt -y -b block \
  --keyring-backend test
  
docker exec secretdev \
  secretcli tx send a secret1a8d9sj4rq3dw9x56f0gc39z5qaqdmalprqx4d9 10000000000uscrt -y -b block \
  --keyring-backend test