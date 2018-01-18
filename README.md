# About

A package to restify a oracle DB.
I have not worked on securing the rest services. At the moment this is not ready to be exposed externally at all.
I build this for an minimal user internal facing application to read data from a database.

This package is by no means complete.
Please do a pull request to add more functionality.

## Setup
`git clone github.com/s41nn0n/oDBRestify.git; cd oDBRestify; npm install`

Follow:
(oracledb Quick Install)[https://github.com/oracle/node-oracledb/blob/master/INSTALL.md#quickstart]

`export LD_LIBRARY_PATH=/opt/oracle/instantclient_12_1`

`npm start`

## TODO

- [ ] SECURITY
- [ ] GET
- [ ] PUT
- [ ] DELETE
- [ ] UPDATE
- [ ] OpenAPI
- [ ] Cache
- [ ] Code Standard
- [ ] Dockerize
- [ ] Testing Scripts

## Security
- [ ] Auth
- [ ] Database Restrictions
- [ ] Request Limitations

I was thinking that we could leave some of the auth to other applications.

## Resources & Attributions
- [nodejs](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [oracle/node-oracledb](https://github.com/oracle/node-oracledb)

## Testing
I have tested this on Ubuntu Ubuntu 17.04
