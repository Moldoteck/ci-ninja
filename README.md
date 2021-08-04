# ci-ninja
CI service written in node for docker containers, inspired by [ci-ninja](https://github.com/backmeupplz/ci-ninja)

# Usage
1. `git clone https://github.com/Moldoteck/ci-ninja` on the server
2. Add repository names and docker container names, as well as root folder, like:
```
let docker_name = ''
if (payload.repository.name.includes('TestRepo'))
  docker_name = 'testrepo'
...
exec('sudo docker-compose restart ' + line, { cwd: '../RootFolder' }, execCallback)
```
3. Add ci-ninja.service
4. Add Webhook from your GitHub repository to `http://{server-ip}:61439/`

TODO: explain how webhook should be added
TODO: repo and container names should be in an JSON file
TODO: explain easiest way to create service for debian/ubuntu
TODO: explain how to deal with IP in google cloud

Docker & docker-compose:
https://docs.docker.com/engine/install/ubuntu/
https://docs.docker.com/compose/install/

Aaaaand you're done.

# Samples
### `ci-ninja.service`
Go to systemd:
`cd /etc/systemd/system`
and create file like this:
`sudo nano ci-ninja.service`
and past the following config. Don't forget to modify root-to-path part

My sample systemd service for ubuntu to run ci-ninja
```
[Unit]
Description=Service to start ci-ninja
After=network.target

[Service]
WorkingDirectory=/root-path-to-ninja/ci-ninja
ExecStart=/usr/bin/node /root-path-to-ninja/ci-ninja/index.js

[Install]
WantedBy=multi-user.target
```
Reload the service files to include the new service.
`sudo systemctl daemon-reload`

Start your service
`sudo systemctl start ci-ninja.service`

To enable your service on every reboot
`sudo systemctl enable ci-ninja.service`

# License
MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!
