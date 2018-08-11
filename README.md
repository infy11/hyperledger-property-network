# Setting Up the Hyperledger Network

### Generate cryto material for different organizations  
Configuration is defined in crypto-config.yaml present in property-network folder

Note: There must me a bin folder in the root directory which is platform dependent refer to hyperledger documentation to know how to generate that. 

                     
```sh
cd property-network
../bin/cryptogen generate --config crypto-config.yaml 
```


### Generate channel artifacts and genesis block    

                        
                     
channel configuration is defined in the file configtx.yaml which is present in property-network directory.
Let's first generate our genesis block  
```sh
../bin/configtxgen -profile FourOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
```

Now we will generate channel block for all our channels namely
 - bank
 - gda
 - advocate
 - builder  

```sh
export CHANNEL_NAME=gda  
../bin/configtxgen -profile FourOrgsChannel -outputCreateChannelTx ./channel-artifacts/$CHANNEL_NAME.tx -channelID $CHANNEL_NAME
```
```sh
export CHANNEL_NAME=advocate  
../bin/configtxgen -profile FourOrgsChannel -outputCreateChannelTx ./channel-artifacts/$CHANNEL_NAME.tx -channelID $CHANNEL_NAME
```
```sh
export CHANNEL_NAME=bank  
../bin/configtxgen -profile FourOrgsChannel -outputCreateChannelTx ./channel-artifacts/$CHANNEL_NAME.tx -channelID $CHANNEL_NAME
```
```sh
export CHANNEL_NAME=builder  
../bin/configtxgen -profile FourOrgsChannel -outputCreateChannelTx ./channel-artifacts/$CHANNEL_NAME.tx -channelID $CHANNEL_NAME
```

## Getting the network up  
After everything setup we will get the network up with the following command 
```sh
docker-compose -f docker-compose-cli.yaml up -d
```
The configuration of network is defined in docker-compose-cli file 

# Now Let's join the nodes to channels  
We have defined a cli node into our channel in which all the tools are preinstalled so we will access other nodes through this node so let's get inside our cli node first 

```sh
docker exec -e COLUMNS="`tput cols`" -e LINES="`tput lines`" -ti cli bash
```

After that to execute a command on a particular node we have to set the enviroment variables for that node so before running commands here are the list of enviroment variables for our nodes 

### GDA  
```sh
CORE_PEER_ADDRESS=peer0.gda.example.com:7051
CORE_PEER_LOCALMSPID="gda"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gda.example.com/peers/peer0.gda.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/gda.example.com/users/Admin@gda.example.com/msp 
export CHANNEL_NAME=gda
```

### Builder  
```sh
CORE_PEER_ADDRESS=peer0.builder.example.com:7051
CORE_PEER_LOCALMSPID="builder"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/builder.example.com/peers/peer0.builder.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/builder.example.com/users/Admin@builder.example.com/msp 
export CHANNEL_NAME=builder
```

### Advocate  

```sh
CORE_PEER_ADDRESS=peer0.advocate.example.com:7051
CORE_PEER_LOCALMSPID="advocate"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/advocate.example.com/peers/peer0.advocate.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/advocate.example.com/users/Admin@advocate.example.com/msp 
export CHANNEL_NAME=advocate
```

### Bank  
```sh
CORE_PEER_ADDRESS=peer0.bank.example.com:7051
CORE_PEER_LOCALMSPID="bank"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bank.example.com/peers/peer0.bank.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bank.example.com/users/Admin@bank.example.com/msp 
export CHANNEL_NAME=bank
```
## Now let's get into the builder node first and then create the channel block  

```sh
peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/$CHANNEL_NAME.tx 
```

This will produce a channel block just keep this block safe it will be needed if any other node will need to join the channel

```sh
peer channel join -b $CHANNEL_NAME.block
```

### Now install the builder chaincode into this node  

```sh
 peer chaincode install -n builder -v 1.0 -p github.com/chaincode/property
```

### Now instantiate the installed chaincode  

```sh
peer chaincode instantiate -o orderer.example.com:7050 -n builder -v 1.0 -c '{"Args":["init"]}' -C $CHANNEL_NAME
```

## Now let's get into the Advocate node first and then create the channel block  

```sh
peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/$CHANNEL_NAME.tx 
```

This will produce a channel block just keep this block safe it will be needed if any other node will need to join the channel

```sh
peer channel join -b $CHANNEL_NAME.block
```

### Now install the builder chaincode into this node  

```sh
 peer chaincode install -n advocate -v 1.0 -p github.com/chaincode/advocate
```

### Now instantiate the installed chaincode  

```sh
peer chaincode instantiate -o orderer.example.com:7050 -n advocate -v 1.0 -c '{"Args":["init"]}' -C $CHANNEL_NAME
```

## Now let's get into the Bank node first and then create the channel block   

```sh
peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/$CHANNEL_NAME.tx 
```

This will produce a channel block just keep this block safe it will be needed if any other node will need to join the channel  

```sh
peer channel join -b $CHANNEL_NAME.block
```

### Now install the builder chaincode into this node  

```sh
 peer chaincode install -n bank -v 1.0 -p github.com/chaincode/bank
```

### Now instantiate the installed chaincode  

```sh
peer chaincode instantiate -o orderer.example.com:7050 -n bank -v 1.0 -c '{"Args":["init"]}' -C $CHANNEL_NAME
```

## Now let's get into the GDA node first and then create the channel block 

```sh
peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/$CHANNEL_NAME.tx 
```

This will produce a channel block just keep this block safe it will be needed if any other node will need to join the channel  

```sh
peer channel join -b $CHANNEL_NAME.block
```

### Now install the builder chaincode into this node   

```sh
 peer chaincode install -n gda -v 1.0 -p github.com/chaincode/gda
```

### Now instantiate the installed chaincode  

```sh
peer chaincode instantiate -o orderer.example.com:7050 -n gda -v 1.0 -c '{"Args":["init"]}' -C $CHANNEL_NAME
```

## Additional steps for GDA node   
We want GDA to join all the channels so that it can monitor all organizations involved in the transaction let's set the gda enviroment variables and let it join the channel 

### joining all the channels   

```sh
peer channel join -b gda.block
peer channel join -b builder.block
peer channel join -b advocate.block
peer channel join -b bank.block
```

Now hyperldger also needs chaincode to be installed in all nodes which are part of same channel so let's install all the chaincodes in gda as well  
 
### Installing chaincode 
```sh
peer chaincode install -n builder -v 1.0 -p github.com/chaincode/property
peer chaincode install -n bank -v 1.0 -p github.com/chaincode/bank
peer chaincode install -n advocate -v 1.0 -p github.com/chaincode/advocate
```
note: we do not need to instantiate the chaincode on this node as they are already instantiated on other nodes.

so with this we are finished with our network setup 

# Generating keystore artifacts for organizations 
we have to generate the artifacts so that node js can can access our network basically if we have CA in our node js we can skip this section and directly obtain the certificate from our CA but we don't currently have CA in our network -

so have created a node js script which can be used to convert cryptogen generated certificate into node js format the script is named as sample js you have to copy the public and private certificate from the cryto-config directory for the respective peer organization and edit the sample.js accordingly i'm not explaining this section in detail because its a temporary workaround in future we will be having a CA .

# Now Let's get our Api server up   
 - Go to Express-api directory and use the followring command 
 - ```sh
   npm install
   ```
 - ```sh
   node start  
    ```
This will bring our api server up 

# Now let's get our Angular ui up

- Go to angular-ui directory
- ```sh
  npm install
  ```
- ```sh 
  ng serve --open 
  ```
