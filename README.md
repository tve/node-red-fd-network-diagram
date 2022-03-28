Network Diagram FlexDash Widget for Node-RED
============================================

How-To using Docker
-------------------

- create a working directory (or use an existing one)
- get the latest node-red-network-diagram as well as vis-network:
```
  git clone https://github.com/tve/node-red-fd-network-diagram
  cd ./node-red-fd-network-diagram/widgets
  npm install --production
  cd ../..
```
- create a data directory for Node-RED and install node-red-flexdash there:
```
  mkdir network-diagram-data
  cd network-diagram-data
  npm install @flexdash/node-red-flexdash
  cd ..
```
    (An alternative is to install it in the palette manager once Node-RED is up, but that's not
    always the latest version.)
- create a shell script to start Node-RED in docker, adjust paths and ports as desired:
```
#! /usr/bin/env bash
mkdir -p network-diagram-data
docker run --rm -ti -p 1990:1880 \
  -v $PWD/node-red-fd-network-diagram:/usr/src/node-red/node-red-fd-network-diagram \
  -v $PWD/network-diagram-data:/data \
  --entrypoint bash \
  --name network-diagram \
  nodered/node-red:2.2.2 \
  -c "npm i ./node-red-fd-network-diagram; npm start --cache /data/.npm -- -v -userDir /data"
```
- launch the docker container by running the script (`bash ./start.sh` or similar)
- open the flow editor at http://localhost:1990 and import the network-diagram simple example
- deploy
- watch the status of the FlexDash Dev node 'til it's ready, it will take 1-2 minutes the first time
  you launch the docker container
- open FlexDash at http://localhost:1990/flexdash-src, wait a minute for the dashboard to appear
- you should have a widget with a little diagram
- in the flow editor, hit the set_network inject node, then hit the add_nodes inject node, observe the changes

### Running the dev server outside of docker

One annoyance with the FlexDash dev server built into Node-RED is that the first page load takes
a long time. This is not an issue when working on a widget, but it becomes painful when working
on a node because every test cycle requires restarting Node-Red and thus the dev server, and then
wait a minute for the initial dashboard load.

An solution to this is to run the dev server outside of Node-RED so it stays running even when
Node-RED is restarted. Here's how to do this:

(This ended up being a few more steps than I anticipated, some automation is needed...)

- stop the dev server running in Node-RED by editing the FD Dev Server node and unchecking 
  'enable dev server', then deploy (the dev server produces some temp files in the source dir's
  node_modules and having two running at the same time is likely to cause issues)
- create a symlink in the flexdash source directory that points to the widget(s) provided
  by network-diagram, this is how FlexDash finds the extra widgets:
```
  cd network-diagram-data/flexdash-src/xtra
  mkdir nd
  cd nd
  ln -s ../../../../node-red-network-diagram/widgets .
  cd ../..   # ends up in flexdash-src dir
```
- adjust the dev server config file to let it serve the "out of directory" network diagram widgets:
```
  cp vite.config.js myvite.config.js
```
  edit myvite.config.js and after `base: "./",` add
```
  server:{fs:{allow:["../.."]}},
```
- launch the dev server pointing it to the new config file
```
  npm run dev -- -c myvite.config.js
```
- you should see messages that vite is starting up, ending with something like
```
  vite v2.8.6 dev server running at:

  > Local:    http://localhost:3000/
```
- point your web browser at the dev server and tell FlexDash to connect to Node-RED for data
  (ensure the ports are what vite printed and what you used in the docker config for Node-RED):
  http://localhost:3000/flexdash-src?sio=http://localhost:1990/flexdash/io
- you should see two widgets: "Welcome to FlexDash" and the small network-diagram; if you get a
  pop-up to change connections, then the "sio" URL is incorrect or Node-RED is not running
  (if you look into the Node-RED console log you'll see a line printed by FlexDash with
  "sio options" and you need the "path" portion)


Non-docker (untested)
---------------------

- git clone network-diagram: https://github.com/tve/node-red-fd-network-diagram
- install vis-network (`cd node-red-fd-network-diagram/widgets; npm install --production`)
- install it in Node-RED (in the Node-RED dir run `npm install ../path/to/node-red-fd-network-diagram`)
- (this should also install node-red-flexdash because it's a dependency)
- start Node-RED
- create a new flow and import the example flow from the network diagram pkg
- you will need to wait a while the first time while the dev server downloads flexdash and gets it running
- open FlexDash and proceed as with docker
