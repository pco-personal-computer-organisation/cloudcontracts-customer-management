FROM node:6
MAINTAINER Daniel Lemper <daniel.lemper@pco-online.de>

WORKDIR /usr/src/app/

RUN apt-get update && apt-get install -y libkrb5-dev nfs-common

COPY package.json .
COPY *.js ./
COPY README.md .

RUN mkdir src models #tests client
COPY src/ src/
COPY models/ models/
COPY client/ client/
COPY cc/ cc/
#COPY tests/ tests/

COPY ./entrypoint.sh /

VOLUME config

RUN npm install
RUN npm run build

#HEALTHCHECK --interval=5m --timeout=3s CMD curl -f http://localhost:3000/ || exit 1
ENV NODE_ENV=production

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD node .
