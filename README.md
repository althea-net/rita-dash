# Althea Router Dashboard

This is a web interface that can be used to manage the settings and configuration of an Althea router. The default location for these files is /www/althea and the dashboard can be accessed in a browser by visiting <https://192.168.10.1/althea/>

## Development

The app is implemented with React. To get started:

```bash
  git clone https://github.com/althea-mesh/althea-dash
  cd althea-dash
  yarn
  yarn start
```

1.) Make sure openwrt_upload is running

2.) run ssh -L localhost:4877:localhost:4877 root@192.168.10.1 in terminal

3.) navigate to althea-dash repo and run yarn start

4.) Navigate to localhost:3005 in browser

### Formatting

```bash
yarn
node_modules/.bin/prettier --write src/*.js src/**/*.js src/**/**/*.js
```
