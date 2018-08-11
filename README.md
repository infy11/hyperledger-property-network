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





  - Import a HTML file and watch it magically convert to Markdown
  - Drag and drop images (requires your Dropbox account be linked)


You can also:
  - Import and save files from GitHub, Dropbox, Google Drive and One Drive
  - Drag and drop markdown and HTML files into Dillinger
  - Export documents as Markdown, HTML and PDF

Markdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site][df1]

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.

### Tech

Dillinger uses a number of open source projects to work properly:

* [AngularJS] - HTML enhanced for web apps!
* [Ace Editor] - awesome web-based text editor
* [markdown-it] - Markdown parser done right. Fast and easy to extend.
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]
* [Gulp] - the streaming build system
* [Breakdance](http://breakdance.io) - HTML to Markdown converter
* [jQuery] - duh

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd dillinger
$ npm install -d
$ node app
```

For production environments...

```sh
$ npm install --production
$ NODE_ENV=production node app
```

### Plugins

Dillinger is currently extended with the following plugins. Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md][PlDb] |
| Github | [plugins/github/README.md][PlGh] |
| Google Drive | [plugins/googledrive/README.md][PlGd] |
| OneDrive | [plugins/onedrive/README.md][PlOd] |
| Medium | [plugins/medium/README.md][PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |


### Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantanously see your updates!

Open your favorite Terminal and run these commands.

First Tab:
```sh
$ node app
```

Second Tab:
```sh
$ gulp watch
```

(optional) Third:
```sh
$ karma test
```
#### Building for source
For production release:
```sh
$ gulp build --prod
```
Generating pre-built zip archives for distribution:
```sh
$ gulp build dist --prod
```
### Docker
Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the Dockerfile if necessary. When ready, simply use the Dockerfile to build the image.

```sh
cd dillinger
docker build -t joemccann/dillinger:${package.json.version}
```
This will create the dillinger image and pull in the necessary dependencies. Be sure to swap out `${package.json.version}` with the actual version of Dillinger.

Once done, run the Docker image and map the port to whatever you wish on your host. In this example, we simply map port 8000 of the host to port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 8000:8080 --restart="always" <youruser>/dillinger:${package.json.version}
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:8000
```

#### Kubernetes + Google Cloud

See [KUBERNETES.md](https://github.com/joemccann/dillinger/blob/master/KUBERNETES.md)


### Todos

 - Write MORE Tests
 - Add Night Mode

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/joemccann/dillinger>
   [git-repo-url]: <https://github.com/joemccann/dillinger.git>
   [john gruber]: <http://daringfireball.net>
   [df1]: <http://daringfireball.net/projects/markdown/>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [Ace Editor]: <http://ace.ajax.org>
   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
