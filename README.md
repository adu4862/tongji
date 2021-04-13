# tongji

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).


docker 运行
docker image build -t yl/tongji:v01 .

docker run -dt -p 8080:3000 yl/tongji:v01
