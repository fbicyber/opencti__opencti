FROM tim_python_v3.10:latest AS base

FROM base AS graphql-deps-builder

WORKDIR /opt/opencti-build/opencti-graphql
COPY opencti-graphql/package.json opencti-graphql/yarn.lock opencti-graphql/.yarnrc.yml ./
COPY opencti-graphql/.yarn ./.yarn
COPY opencti-graphql/patch ./patch
RUN echo "~~~ Starting GRAPHQL DEPS BUILDER ..." \
    && set -ex \
    ; apk add --no-cache \
    nodejs-current npm yarn \
    git tini gcc g++ make musl-dev postfix postfix-pcre \
    && corepack enable \
    && npm install -g node-gyp \
    && yarn install --immutable && yarn cache clean --all \
    && echo "... GRAPHQL DEPS BUILDER Done ~~~"


FROM base AS graphql-builder

WORKDIR /opt/opencti-build/opencti-graphql
COPY opencti-graphql/package.json opencti-graphql/yarn.lock opencti-graphql/.yarnrc.yml ./
COPY opencti-graphql/.yarn ./.yarn
COPY opencti-graphql/patch ./patch
RUN echo "~~~ Starting GRAPHQL BUILDER ..." \
    && set -ex \
    ; apk add --no-cache \
    nodejs-current npm yarn \
    git tini gcc g++ make musl-dev postfix postfix-pcre \
    && corepack enable \
    && npm install -g node-gyp \
    && yarn install
COPY opencti-graphql /opt/opencti-build/opencti-graphql
RUN yarn build:prod \
    && echo "... GRAPHQL BUILDER Done ~~~"


FROM base AS front-builder

WORKDIR /opt/opencti-build/opencti-front
COPY opencti-front/package.json opencti-front/yarn.lock opencti-front/.yarnrc.yml ./
COPY opencti-front/.yarn ./.yarn
COPY opencti-front/patch ./patch
RUN echo "~~~ Starting FRONT BUILDER ..." \
    && set -ex \
    ; apk add --no-cache \
    nodejs-current npm yarn \
    git tini gcc g++ make musl-dev cargo postfix postfix-pcre \
    && corepack enable \
    && npm install -g node-gyp \
    # && CXXFLAGS="--std=c++17" 
    && yarn install
COPY opencti-front /opt/opencti-build/opencti-front
COPY opencti-graphql/config/schema/opencti.graphql /opt/opencti-build/opencti-graphql/config/schema/opencti.graphql
RUN yarn build:standalone \
    && echo "... FRONT BUILDER Done ~~~"

FROM base AS app

RUN echo "~~~ Starting APP ..." \
    && set -ex \
    ; apk add --no-cache \
    nodejs-current npm yarn \
    git tini gcc g++ make musl-dev cargo postfix postfix-pcre \
    && corepack enable \
    && pip3 install --no-cache-dir --upgrade pip setuptools wheel \
    && ln -sf python3 /usr/bin/python 

WORKDIR /opt/opencti
COPY opencti-graphql/src/python/requirements.txt ./src/python/requirements.txt
#  requirements.txt must have pycti removed
RUN sed -i 's/^pycti==.*$//' ./src/python/requirements.txt 

RUN pip3 install --no-cache-dir --requirement ./src/python/requirements.txt \
    && pip3 install \
    --no-cache-dir \
    --upgrade pip \
    && apk del git gcc musl-dev

COPY --from=graphql-deps-builder /opt/opencti-build/opencti-graphql/node_modules ./node_modules
COPY --from=graphql-builder /opt/opencti-build/opencti-graphql/build ./build
COPY --from=graphql-builder /opt/opencti-build/opencti-graphql/static ./static
COPY --from=front-builder /opt/opencti-build/opencti-front/builder/prod/build ./public
COPY ../opencti-graphql/src ./src
COPY ../opencti-graphql/config ./config
COPY opencti-graphql/script ./script

ARG UID=10000
ARG GID=10001
ARG USERNAME="_opencti"

ENV PYTHONUNBUFFERED=1
ENV NODE_OPTIONS=--max_old_space_size=12288
ENV NODE_ENV=production

RUN set -ex \
    ; addgroup -g "${GID}" -S "${USERNAME}" \
    && adduser \
    -h /opt/opencti \
    -g "OpenCTI privsep user" \
    -s "/sbin/nologin" \
    -G "${USERNAME}" \
    -S \
    -u "${UID}" \
    "${USERNAME}" \
    && install -o "${UID}" -g "${GID}" -m 0750 -d '/opt/opencti/logs' \
    && echo "*** APP Done ***"

VOLUME ["/opt/opencti/logs"]

USER "${USERNAME}"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "build/back.js", "--conf /opt/opencti/config/TIM.json"]

RUN echo "... NODE BUILD Done ~~~"
