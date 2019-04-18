const fs = require('fs');
const path = require('path');
const NFSClient = require('./nfsclient');

const config = require('../config/config.json');

const { randomString, getRandomNameWithMaxLength } = require('./random');

module.exports = (route) => {
  const { validate, httpProxy } = route.middlewares;
  const { expect } = route;
  const { hashPassword } = route.kdf;
  const http = route.tools.httpRequest;
  const Sql = route.tools.sql;

  const sequelize = new Sql(route.locals.config.db.database, route.locals.config.db.username, route.locals.config.db.password, { // eslint-disable-line max-len
    host: route.locals.config.db.host || 'localhost',
    port: route.locals.config.db.port || 3306,
    dialect: 'mysql',
    // logging: Debug('db'),
    logging: false,
  });

  const Kunde = sequelize.import(path.resolve('./models/Kunde.js'));
  const User = sequelize.import(path.resolve('./models/User.js'));
  const AccessToken = sequelize.import(path.resolve('./models/AccessToken.js'));

  const RANCHER_URL = `http://${config.rancher.host}:${config.rancher.port}/v2-beta/projects/${config.rancher.projectId}`;

  const httpOptions = {
    headers: {
      authorization: `Basic ${new Buffer(`${config.rancher.username}:${config.rancher.password}`).toString('base64')}`,
    },
  };

  route.post('/login', httpProxy({
    target: config.cloudcontractsProxy.url,
    changeOrigin: true,
  }));

  route.post('/create-customer', (req, res, next) => {
    AccessToken.findById(req.headers.authorization)
      .then(token => http.get(`${config.cloudcontractsProxy.url}/${token.userId}`, { headers: { authorization: req.headers.authorization } })) // eslint-disable-line max-len
      .then((user) => {
        if (config.cloudcontractsProxy.allowedUsers.includes(user.username)) {
          req.user = user;
          next();
        } else {
          next({ statusCode: 401, msg: 'Unauthorized' });
        }
      })
      .catch(() => next({ statusCode: 401, msg: 'Unauthorized' }));
  }, validate({
    body: {
      customer: expect.object().keys({
        name: expect.string().required(),
        kdnr: expect.string().required(),
        maxUsers: expect.number().required(),
      }),
      user: expect.object().keys({
        username: expect.string().required(),
        email: expect.string().email().required(),
        vorname: expect.string().required(),
        nachname: expect.string().required(),
      }),
      createdBy: expect.string(),
    },
  }), (req, res) => {
    const userPassword = randomString(22);
    const maria = {
      username: '', // getRandomNameWithMaxLength(16 /* 657k different possibilities*/ ), // randomString(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'); // is also database and service name
      password: randomString(16),
    };
    let idKunde;
    let user;
    let service;

    // check if customer or user (username, email) exists!
    Promise.all([
      route.retryPromise(() => new Promise((resolve, reject) => {
        maria.username = getRandomNameWithMaxLength(16 /* 657k different possibilities */);

        Kunde.count({
          where: {
            $or: [{
              name: req.body.customer.name,
            }, {
              instanceUrl: `http://${maria.username}:3000`,
            }],
          },
        })
          .then((count) => {
            if (count > 0) {
              reject({ statusCode: 409, msg: `found customer (${req.body.customer.name}) or unique name (${maria.username}) already exists!` });
            } else {
              resolve();
            }
          })
          .catch(reject);
      }), 3, 0),
      new Promise((resolve, reject) => {
        User.count({
          where: {
            $or: [{
              username: req.body.user.username,
            }, {
              email: req.body.user.email,
            }],
          },
        })
          .then((count) => {
            if (count > 0) {
              reject({ statusCode: 409, msg: `username (${req.body.user.username}) or email (${req.body.user.email}) already exists!` });
            } else {
              resolve();
            }
          });
      }),
    ])
      .then(() => Kunde.create({
        name: req.body.customer.name,
        kdnr: req.body.customer.kdnr,
        status: 1,
        maxusers: req.body.customer.maxUsers,
        quota: 4096,
        createdBy: req.body.createdBy,
        instanceUrl: `http://${maria.username.replace('_', '-')}:3000`,
      })
        .then((kunde) => {
          idKunde = kunde.id;
          return Promise.resolve(kunde);
        }))
      .then(kunde => hashPassword(userPassword, 'bcrypt')
        .then(password => User.create({
          username: req.body.user.username,
          password,
          email: req.body.user.email,
          idKunde: kunde.id,
          benachrichtigungsfrist1: 90,
          benachrichtigungsfrist2: 60,
          benachrichtigungsfrist3: 30,
          vorname: req.body.user.vorname,
          nachname: req.body.user.nachname,
          benachrichtigung: true,
        })
          .then((result) => {
            user = result.get({ plain: true });
            return Promise.resolve(user);
          })))
      .then(() => sequelize.query(`create database ${maria.username};`))
      .then(() => sequelize.query(`GRANT ALL PRIVILEGES ON ${maria.username}.* TO ${maria.username}@'%' IDENTIFIED BY '${maria.password}';`))
      .then(() => sequelize.query(`GRANT DELETE, INSERT, SELECT, UPDATE ON cloudcontracts.* TO ${maria.username}@'%';`))
      .then(() => {
        const db = new Sql(maria.username, route.locals.config.db.username, route.locals.config.db.password, { // eslint-disable-line max-len
          host: route.locals.config.db.host || 'localhost',
          port: route.locals.config.db.port || 3306,
          dialect: 'mysql',
          // logging: Debug('db'),
          logging: false,
        });

        fs.readdirSync(path.resolve('cc', 'models')).forEach(n => db.import(path.resolve('cc', 'models', n)));

        return db.sync().then(() => db);
      })
      .then(db => Promise.all([
        Promise.all(fs.readdirSync(path.resolve('cc', 'modelData')).map(n => db.models[n.replace('.json', '')].bulkCreate(JSON.parse(fs.readFileSync(path.resolve('cc', 'modelData', n)).toString())))),
        db.models.RoleMapping.create({
          principalType: 'USER',
          principalId: user.id,
          roleId: 1,
        }),
        db.query(`
          CREATE
              SQL SECURITY INVOKER
          VIEW userlist AS
              SELECT
                  u.id AS id,
                  u.username AS username,
                  u.email AS email,
                  u.status AS status,
                  u.created AS created,
                  u.lastUpdated AS lastUpdated,
                  u.idKunde AS idKunde,
                  u.benachrichtigungsfrist1 AS benachrichtigungsfrist1,
                  u.benachrichtigungsfrist2 AS benachrichtigungsfrist2,
                  u.benachrichtigungsfrist3 AS benachrichtigungsfrist3,
                  u.idStellvertreter AS idStellvertreter,
                  u.stellvertreterAktiv AS stellvertreterAktiv,
                  u.vorname AS vorname,
                  u.nachname AS nachname,
                  u.benachrichtigung AS benachrichtigung,
                  r.id AS roleId,
                  r.name AS roleName,
                  r.description AS roleDescription
              FROM
                  ((cloudcontracts.User u
                  JOIN RoleMapping rm ON ((u.id = rm.principalId)))
                  JOIN Role r ON ((rm.roleId = r.id)));`),
        db.query(`
          CREATE
              SQL SECURITY DEFINER
          VIEW vertragsliste AS
              SELECT
                  v.id AS id,
                  v.Bezeichnung AS bezeichnung,
                  v.Vertragsnr AS vertragsnr,
                  v.LaufzeitEnde AS laufzeitende,
                  v.Kuendigungsdatum AS kuendigungsdatum,
                  v.idVertragspartner AS idVertragspartner,
                  v.idKategorie AS idKategorie,
                  v.Status AS status,
                  s.name AS statusName,
                  p.Firmenname AS firmenname
              FROM
                  ((vertrag v
                  JOIN vertragspartner p ON ((p.id = v.idVertragspartner)))
                  JOIN status s ON ((s.id = v.Status)));`),
        db.query(`
          CREATE
              SQL SECURITY INVOKER
          VIEW vertragspartnerliste AS
              SELECT
                  p.id AS id,
                  p.Firmenname AS firmenname,
                  p.KundenNr AS kundennr,
                  v.id AS idVertrag,
                  v.Bezeichnung AS bezeichnung,
                  v.Vertragsnr AS vertragsnr,
                  v.LaufzeitEnde AS laufzeitende,
                  v.Kuendigungsfrist AS kuendigungsfrist
              FROM
                  (vertragspartner p
                  LEFT JOIN vertrag v ON ((p.id = v.idVertragspartner)));`),
      ]))
      .then(() => {
        // create config files
        const nfs = new NFSClient({
          host: route.locals.config.nfs.host,
          exportPath: route.locals.config.nfs.exportPath,
          protocol: 'tcp',
          authenticationMethod: 'unix',
        });

        const configJson = JSON.parse(fs.readFileSync(path.resolve('cc', 'config.json')).toString());
        const datasourcesJson = JSON.parse(fs.readFileSync(path.resolve('cc', 'datasources.json')).toString());
        const modelConfigJson = JSON.parse(fs.readFileSync(path.resolve('cc', 'model-config.json')).toString());

        datasourcesJson.cloudcontracts.password = maria.password;
        datasourcesJson.cloudcontracts.user = maria.username;
        datasourcesJson.cm4it.database = maria.username;
        datasourcesJson.cm4it.user = maria.username;
        datasourcesJson.cm4it.password = maria.password;

        return nfs.mount()
          .then(root => nfs.mkdir(root, `${maria.username.replace('_', '-')}-config`))
          .then(root => Promise.all([
            nfs.writeFile(root, 'config.json', new Buffer(JSON.stringify(configJson, undefined, 2))),
            nfs.writeFile(root, 'datasources.json', new Buffer(JSON.stringify(datasourcesJson, undefined, 2))),
            nfs.writeFile(root, 'model-config.json', new Buffer(JSON.stringify(modelConfigJson, undefined, 2))),
          ]))
          .then(() => nfs.unmount());
      })
      .then(() => http.get(`${RANCHER_URL}/stacks/?name=cloudcontracts`, httpOptions))
      .then(result => http.post(`${RANCHER_URL}/service`, {
        scale: 1,
        assignServiceIpAddress: false,
        startOnCreate: true,
        type: 'service',
        stackId: result.data[0].id,
        launchConfig: {
          instanceTriggeredStop: 'stop',
          kind: 'container',
          networkMode: 'managed',
          privileged: false,
          publishAllPorts: false,
          readOnly: false,
          runInit: false,
          startOnCreate: true,
          stdinOpen: false,
          tty: false,
          vcpu: 1,
          type: 'launchConfig',
          labels: {
            'io.rancher.container.pull_image': 'always',
          },
          restartPolicy: {
            name: 'always',
          },
          secrets: [],
          dataVolumes: [`${maria.username.replace('_', '-')}-config:/usr/src/app/config:ro`, `${maria.username.replace('_', '-')}-storage:/usr/src/app/storage`],
          dataVolumesFrom: [],
          dns: [],
          dnsSearch: [],
          capAdd: [],
          capDrop: [],
          devices: [],
          logConfig: {
            driver: '',
            config: {},
          },
          dataVolumesFromLaunchConfigs: [],
          imageUuid: 'docker:032884098185.dkr.ecr.eu-central-1.amazonaws.com/cloudcontracts:18.2.1',
          ports: [],
          environment: {
            CUSTOMER_ID: idKunde,
          },
          healthCheck: {
            type: 'instanceHealthCheck',
            healthyThreshold: 2,
            initializingTimeout: 60000,
            interval: 4000,
            name: null,
            port: 3000,
            reinitializingTimeout: 60000,
            requestLine: null,
            responseTimeout: 3000,
            strategy: 'recreate',
            unhealthyThreshold: 3,
          },
          volumeDriver: 'rancher-nfs',
          blkioWeight: null,
          cgroupParent: null,
          count: null,
          cpuCount: null,
          cpuPercent: null,
          cpuPeriod: null,
          cpuQuota: null,
          cpuSet: null,
          cpuSetMems: null,
          cpuShares: null,
          createIndex: null,
          created: null,
          deploymentUnitUuid: null,
          description: null,
          diskQuota: null,
          domainName: null,
          externalId: null,
          firstRunning: null,
          healthInterval: null,
          healthRetries: null,
          healthState: null,
          healthTimeout: null,
          hostname: null,
          ioMaximumBandwidth: null,
          ioMaximumIOps: null,
          ip: null,
          ip6: null,
          ipcMode: null,
          isolation: null,
          kernelMemory: null,
          memory: null,
          memoryMb: null,
          memoryReservation: null,
          memorySwap: null,
          memorySwappiness: null,
          milliCpuReservation: null,
          oomScoreAdj: null,
          pidMode: null,
          pidsLimit: null,
          removed: null,
          requestedIpAddress: null,
          shmSize: null,
          startCount: null,
          stopSignal: null,
          user: null,
          userdata: null,
          usernsMode: null,
          uts: null,
          uuid: null,
          workingDir: null,
          networkLaunchConfig: null,
        },
        secondaryLaunchConfigs: [],
        name: maria.username.replace('_', '-'),
        description: null,
        createIndex: null,
        created: null,
        externalId: null,
        healthState: null,
        kind: null,
        removed: null,
        selectorContainer: null,
        selectorLink: null,
        uuid: null,
        vip: null,
        fqdn: null,
      }, httpOptions)
        .then((serviceData) => {
          service = serviceData;
          return Promise.resolve(service);
        }))
      .then(() => http.get(`${RANCHER_URL}/services?name=postoffice`, httpOptions))
      .then(result => http.post(`${RANCHER_URL}/services/${service.id}/?action=setservicelinks`, {
        serviceLinks: [{
          name: '',
          serviceId: result.data[0].id,
        }],
      }, httpOptions))
      .then(() => http.get(`${RANCHER_URL}/services?name=cloudcontracts-proxy`, httpOptions))
      .then(result => http.post(`${RANCHER_URL}/services/${result.data[0].id}/?action=addservicelink`, {
        serviceLink: {
          serviceId: service.id,
        },
      }, httpOptions))
      .then(() => http.post(`${RANCHER_URL}/stacks/${service.stackId}?action=activateservices`, '', httpOptions)) // TODO: only activate the created service
      .then(() => { // eslint-disable-line arrow-body-style
        // send credentials to user
        /*
        console.log('mail', {
          recipient: user.email,
          subject: 'Zugangsdaten zu CloudContracts',
          content: `Hallo ${user.vorname} ${user.nachname},\n\nhiermit möchten wir Ihnen Ihre Zugangsdaten zu CloudContracts (https://cloudcontracts.pco-cloud.de) zukommen lassen:\n- Benutzername: ${user.username}\n- E-Mail-Adresse: ${user.email}\n- Passwort: ${userPassword}\n\nMit freundlichen Grüßen,\nIhr CloudContracts Team`,
          type: 'Text',
        });
        */
        return http.post(config.postoffice.url, {
          recipient: user.email,
          subject: 'Zugangsdaten zu CloudContracts',
          content: `Hallo ${user.vorname} ${user.nachname},\n\nhiermit möchten wir Ihnen Ihre Zugangsdaten zu CloudContracts (https://cloudcontracts.pco-cloud.de) zukommen lassen:\n- Benutzername: ${user.username}\n- E-Mail-Adresse: ${user.email}\n- Passwort: ${userPassword}\n\nMit freundlichen Grüßen,\nIhr CloudContracts Team`,
          type: 'Text',
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      })
      .then(() => res.send())
      .catch((err) => {
        console.log(err); // eslint-disable-line no-console
        res.status(err.statusCode || 500).send(err.msg || err);
      });
  });

  /*route.delete('/destroy-customer/:id', (req, res, next) => {
    AccessToken.findById(req.headers.authorization)
      .then(token => http.get(`${config.cloudcontractsProxy.url}/${token.userId}`, { headers: { authorization: req.headers.authorization } })) // eslint-disable-line max-len
      .then((user) => {
        if (config.cloudcontractsProxy.allowedUsers.includes(user.username)) {
          req.user = user;
          next();
        } else {
          next({ statusCode: 401, msg: 'Unauthorized' });
        }
      })
      .catch(() => next({ statusCode: 401, msg: 'Unauthorized' }));
  }, (req, res) => {
    Kunde.findById(req.params.id)
      .then(kunde => console.log(kunde));
  });*/
};
