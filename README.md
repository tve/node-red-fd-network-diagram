Network Diagram FlexDash Widget for Node-RED
============================================

How-To
------

- create a working directory, I'm using /home/flexdash
- git clone the flexdash sources: https://github.com/tve/flexdash
- git clone node-red-flexdash : https://github.com/flexdash/node-red-flexdash
- git clone network-diagram: : https://github.com/tve/node-red-fd-network-diagram
- create a shell script to start Node-RED in docker, adjust paths and ports:
```
#! /usr/bin/env bash
SRC=/home/flexdash
mkdir -p network-diagram-data
docker run --rm -ti -p 1990:1880 -p 3000:3000 \
  -v $SRC/node-red-fd-network-diagram:/usr/src/node-red/node-red-fd-network-diagram \
  -v $SRC/node-red-flexdash:/usr/src/node-red/node-red-flexdash \
  -v $PWD/network-diagram-data:/data \
  -v $SRC/flexdash:/data/flexdash-src \
  --entrypoint bash \
  --name network-diagram \
  nodered/node-red:2.2.2 \
  -c "npm i ./node-red-flexdash ./node-red-fd-network-diagram; npm start --cache /data/.npm -- -v -userDir /data"
```
- launch the docker container by running the script
- open the flow editor at http://localhost:1990 and import the network-diagram simple example
- deploy
- open FlexDash at http://localhost:1990/flexdash-src, wait a minute for the dashboard to appear
- you should have a widget with a 3-node diagram
- in the flow editor, hit the set_network inject node, then hit the add_nodes inject node, observe the changes
