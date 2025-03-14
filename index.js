require("dotenv").config();

const port = 8080,
  allowedOrigins = [
    "https://z2xlch.csb.app"
  ], //Origin: <scheme>://<hostname>:<port>
  RESSEND = (res, e) => {
    res.send(e);
    //res.end();
  },
  refererOrigin = (req, res) => {
    var origin = req.query.origin;
    if (!origin) {
      origin = req.headers.origin;
      //"no newaccount made body",  //...printObject(req) //: origin + " " + (storeId ? "storeId" : "")
    }
    return origin;
  },
  allowOriginType = (origin, res) => {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", ["POST", "OPTIONS", "GET"]);
    res.setHeader("Access-Control-Allow-Headers", [
      "Content-Type",
      "Access-Control-Request-Method",
      "Access-Control-Request-Methods",
      "Access-Control-Request-Headers"
    ]);
    //if (res.secure) return null;
    //allowedOrigins[allowedOrigins.indexOf(origin)]
    res.setHeader("Allow", ["POST", "OPTIONS", "GET"]);
    res.setHeader("Content-Type", "Application/JSON");
    var goAhead = true;
    if (!goAhead) return true;
    //if (!res.secure) return true;
    //https://stackoverflow.com/questions/12027187/difference-between-allow-and-access-control-allow-methods-in-http-response-h
  },
  preflight = (req, res) => {
    const origin = req.headers.origin;
    app.use(cors({ origin })); //https://stackoverflow.com/questions/36554375/getting-the-req-origin-in-express
    if (
      [...(req.path.includes("/users") || req.path.includes("/create") || req.path.includes("/delete") ? allowedOrigins : [req.headers.origin]), ...req.body.payingDomains].indexOf(
        req.headers.origin
      ) === -1
    )
      return res.send({
        statusCode: 401,
        error: "no access for this origin- " + req.headers.origin
      });
    if (allowOriginType(origin, res))
      return res.send({
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    //"Cannot setHeader headers after they are sent to the client"

    res.send({
      statusCode: 204
    }) //res.sendStatus(200);
  },
  //const printObject = (o) => Object.keys(o).map((x) => {return {[x]: !o[x] ? {} : o[x].constructor === Object ? printObject(o[x]) : o[x] };});
  standardCatch = (res, e, extra, name) => {
    RESSEND(res, {
      statusCode: 402,
      statusText: "no caught",
      name,
      error: e,
      extra
    });
  },
  timeout = require("connect-timeout"),
  //fetch = require("node-fetch"),
  express = require("express"),
  app = express(),
  issue = express.Router(),
  cors = require("cors"),
  nano = require('nano')('http://127.0.0.1:5984');
//FIREBASEADMIN = FIREBASEADMIN.toSource(); //https://dashboard.stripe.com/account/apikeys

app.use(timeout("10s"));
//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
//https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
//http://johnzhang.io/options-req-in-express
//var origin = req.get('origin');

const nonbody = express
  .Router()
  .get("/", (req, res) => res.status(200).send("home path"))
  .options("/*", preflight);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var statusCode = 200,
  statusText = "ok";
//https://support.stripe.com/questions/know-your-customer-(kyc)-requirements-for-connected-accounts
issue
  /*.post("/getUser", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    nano.db.create('passport_users', async (err) => {
      if (err) return res.send({
        statusCode, statusText,
        message: "created database: passport_users"
      })
      //database exists
      const { uid } = req.body;
      const users = nano.use('passport_users');
      await users.get(uid, { revs_info: true }, async (err, body) => {
        if (err) {
          //document doesn't exist
          return res.send({
            statusCode,
            statusText,
            error: "no user by id: " + uid
          });
        }
        res.send({
          statusCode,
          statusText,
          user: body
        });
      })

    });
  })
  .post("/createNumber", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    nano.db.create('passport_numbers', async (err) => {
      if (err) return res.send({
        statusCode, statusText,
        message: "created database: passport_numbers"
      })
      //database exists
      const { number } = req.body;
      const numbers = nano.use('passport_numbers');
      await numbers.get(number, { revs_info: true }, async (err, body) => {
        if (err) {
          //document doesn't exist
          await numbers.insert({
            uid: req.body.uid
          }, number)
        } else await numbers.insert({
          uid: req.body.uid,
          _rev: body.rev
        }, number);
        res.send({
          statusCode,
          statusText,
          authenticated: !err
        });
      })

    });
  })
  .post("/checkNumber", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    nano.db.create('passport_numbers', async (err) => {
      if (err) return res.send({
        statusCode, statusText,
        message: "created database: passport_numbers"
      })
      //database exists
      const { number } = req.body;
      const numbers = nano.use('passport_numbers');
      await numbers.get(number, { revs_info: true }, async (err, body) => {
        if (err) {
          //document doesn't exist
          await numbers.insert({
          }, number)
        } else await numbers.insert({
          _rev: body.rev
        }, number);
        res.send({
          statusCode,
          statusText,
          authenticate: !err
        });
      })

    });
  })
  .post("/crown", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    nano.db.create('passport_users', async (err) => {
      if (err) return res.send({
        statusCode, statusText,
        message: "created database: passport_users"
      })
      //database exists
      const users = nano.use('passport_users');
      await users.get(studentId, { revs_info: true }, async (err, body) => {
        if (err) {
          //document doesn't exist
          await users.insert({
            admin: req.body.admin
          }, studentId)
        } else await users.insert({
          admin: req.body.admin,
          _rev: body.rev
        }, studentId);
        res.send({
          statusCode,
          statusText,
          data: "set/update successfully!"
        });
      })

    });
  })
  .post("/users", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    nano.db.create('passport_users', async (err) => {
      if (err) return res.send({
        statusCode, statusText,
        message: "created database: passport_users"
      })
      //database exists
      if (err.error === "file_exists") {
        const alice = nano.use('passport_users');
        await alice.list().then((body) => {
          res.send({
            statusCode,
            statusText,
            users: body.rows.filter(x => {
              if (!x.usernameAsArray.includes(req.body.usernameAsArray)) {
                return false;
              }
              return x;
            })
          });
        });
      } else res.send({
        statusCode,
        statusText,
        error: err
      });

    });
  })*/
  .post("/leaderboard", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    nano.db.create('passport_leaders', async (err) => {
      if (err) {
        if (err.error !== "file_exists") return res.send({
          statusCode,
          statusText,
          error: err
        });
        if (err.error === "file_exists") return res.send({
          statusCode,
          statusText,
          message: "created database: passport_leaders"
        });
      }
      const alice = nano.use('passport_leaders');
      const q = {
        selector: {},
        fields: ["eventsAttended", "fullName", "username"],
        limit: 5000
      };
      //strip PII
      await alice.find(q, (body) => {
        const leaders = body.rows/*.map(x => {
              return { 
                eventsAttended: x.eventsAttended,
                fullName: x.fullName,
                username: x.username
              }
            })*/.sort((a, b) => {
          a.eventsAttended - b.eventsAttended
        });
        res.send({
          statusCode,
          statusText,
          leaders
        });
      });
      /*await alice.get(eventId, { revs_info: true }, async (err, body) => {
        if (err) {
          //document doesn't exist
          /*alice.insert(
            { "views": 
              { "by_events_attended": 
                { "map": function(doc) { emit([doc.eventsAttended], doc._id); } } 
              }
            }, '_design/design_doc', (err)=>{
              res.send({
                statusCode,
                statusText,
                body: "created design doc for leaderboard"
              })
            });* /
        } else await alice.find({
          selector: {
            eventsAttended: { "$gt": 25 }
          },
          fields: ["name", "age", "tags", "url"],
          limit: 50
        }, (err, body) => {


          //await alice.view('designDoc', 'byEventsAttended', function(err, body) {
          if (!err) {
            res.send({
              statusCode,
              statusText,
              leaders: body.rows
            });
          } else res.send({
            statusCode,
            statusText,
            error: err
          });
        });
      })*/


    });
  })
  .post("/create", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    nano.db.create('passport_events', async (err) => {
      if (err) {
        if (err.error !== "file_exists") return res.send({
          statusCode,
          statusText,
          error: err
        });
        if (err.error === "file_exists") return res.send({
          statusCode,
          statusText,
          message: "created database: passport_events"
        });
      }
      const alice = nano.use('passport_events');
      await alice.insert({
        title: req.body.title,
        date: req.body.date,
        descriptionLink: req.body.descriptionLink,
        location: req.body.location,
        department: req.body.department,
        school: req.body.school,
        attendees: [],
      })



    });
  })
  .post("/delete", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    nano.db.create('passport_events', async (err) => {
      if (err) {
        if (err.error !== "file_exists") return res.send({
          statusCode,
          statusText,
          error: err
        });
        if (err.error === "file_exists") return res.send({
          statusCode,
          statusText,
          message: "created database: passport_events"
        });
      }
      const alice = nano.use('passport_events');
      await alice.get(eventId, { revs_info: true }, async (err, body) => {
        if (err) {
          //document doesn't exist
          res.send({
            statusCode,
            statusText,
            error: "Event doesn't exist"
          });
        } else await alice.destroy(eventId, body.rev)

      })


    });
  })
  .post("/list", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    await nano.auth("admin", "password").then(() => {

      nano.db.create('passport_events', async (err) => {
        if (!err) return res.send({
          statusCode,
          statusText,
          message: "created database: passport_events"
        });
        if (err.error !== "file_exists") return res.send({
          statusCode,
          statusText,
          error: err
        });
        const alice = nano.use('passport_events');
        await alice.list().then((body) => {
          res.send({
            statusCode,
            statusText,
            events: body.rows
          });
        });
      });

    })
  })
  .post("/attend", async (req, res) => {
    if (allowOriginType(req.headers.origin, res))
      return RESSEND(res, {
        statusCode,
        statusText: "not a secure origin-referer-to-host protocol"
      });
    nano.db.create('passport_events', async (err) => {
      if (err) {
        if (err.error !== "file_exists") return res.send({
          statusCode,
          statusText,
          error: err
        });
        if (err.error === "file_exists") return res.send({
          statusCode,
          statusText,
          message: "created database: passport_events"
        });
      }
      //passport_events database exists
      if (err.error === "file_exists") {
        nano.db.create('passport_leaders', async (err) => {
          if (err) {
            if (err.error !== "file_exists") {
              return res.send({
                statusCode,
                statusText,
                error: err
              });
            }
            // passport_leaders database exists
            const events = nano.use('passport_events');
            await events.get(eventId, { revs_info: true }, async (err, body) => {
              if (err) {
                //document doesn't exist
                return res.send({
                  statusCode,
                  statusText,
                  error: "event doesn't exist"
                });
              }
              if (body.attendees.includes(req.body.studentId)) return res.send({
                statusCode,
                statusText,
                error: "already attended"
              });
              await events.insert({ attendees: [...body.attendees, req.body.studentId], _rev: body.rev }, eventId, async (err) => {
                if (err) {
                  return res.send({
                    statusCode,
                    statusText,
                    error: "update failed"
                  });
                }
                const leaders = nano.use('passport_leaders');
                await leaders.get(studentId, { revs_info: true }, async (err, body) => {
                  if (err) {
                    //document doesn't exist
                    return await leaders.insert({
                      studentId: req.body.studentId,
                      address: req.body.address,
                      fullName: req.body.fullName,
                      username: req.body.username,
                      eventsAttended: 0,
                    }, studentId)
                  }
                  await leaders.insert({
                    studentId: req.body.studentId,
                    address: req.body.address,
                    fullName: req.body.fullName,
                    username: req.body.username,
                    eventsAttended: body.eventsAttended + 1,
                    _rev: body.rev
                  }, studentId)
                  res.send({
                    statusCode,
                    statusText,
                    data: "set/update successfully!"
                  });
                })

              })

            })

          }
        })
      } else res.send({
        statusCode,
        statusText,
        error: err
      });

    });
  });
//https://stackoverflow.com/questions/31928417/chaining-multiple-pieces-of-middleware-for-specific-route-in-expressjs
app.use(nonbody, issue); //methods on express.Router() or use a scoped instance
app.listen(port, () => console.log(`localhost:${port}`));
process.stdin.resume(); //so the program will not close instantly
function exitHandler(exited, exitCode) {
  if (exited) {
    //mccIdTimeoutNames.forEach((x) => clearTimeout(mccIdTimeouts[x]));
    console.log("clean");
  }
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (exited.mounted) process.exit(); //bind-only not during declaration
} //bind declare (this,update) when listened on:
process.on("uncaughtException", exitHandler.bind(null, { mounted: true }));
process.on("exit", exitHandler.bind(null, { clean: true }));
function errorHandler(err, req, res, next) {
  console.log("Oops", err);
}
app.use(errorHandler);