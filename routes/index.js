var express = require('express');
var router = express.Router();
const https = require('https');
const http = require('http');
const axios = require('axios');
const client = new axios.Axios();

router.post('/check', (req,res,next) => {
  const { origin, host} = req.body;

  try {
    const x = http.request({
      host,
      method:"POST",
      path:"/check",
      protocol:"http:",
      headers: {
        "Host": host,
        "Origin": origin,
      }}, (response) => {
        var data = '';
        

        response.on('data', (chunk) => {
          if(chunk){
            data += chunk;
          }
        });
        response.on('end', () => {
          console.log("send: ", data);
          return res.status(200).send(data);
        });
      });
      x.end();
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).send(error)
  }
})

/* GET home page. */
router.post('/start', function (req, res, next) {
  const { randid, cc, origin, host } = req.body;
  try {
    const x = https.request({
      // host: `front46.omegle.com`,
      host: host,
      method: "POST",
      // path:`/start?caps=recaptcha2,t3&firstevents=1&spid=&randid=3ABQC5LE&cc=9e6116565a7b635909f16a8c5112f11f86b74f2d&lang=en`,
      path: `/start?caps=recaptcha2,t3&firstevents=1&spid=&randid=${randid}&cc=${cc}&lang=en`,
      protocol: "https:",
      // pathname:"start",
      // search:'caps=recaptcha2,t3&firstevents=1&spid=&randid=3ABQC5LE&cc=0dc6f6509372be05107a969b077eedb5f905d1b3&lang=en',
      headers: {
        "Origin": origin
      },
    }, (response) => {
      var data = '';
      response.on('data', (chunk) => {
        console.log("gotchunk", JSON.parse(chunk));
        data += chunk;
      });


      // Ending the response 
      response.on('end', () => {
        data = JSON.parse(data.toString());
        if (data.events?.[0][0] === 'error') {
          res.status(400).send({ events: data.events });
        } else {
          res.status(200).send({ clientID: data.clientID, events: data.events });
        }
      });
      response.on("error", error => {
        console.log(
          "error: ", error
        )
      })
    }).on("error", (err) => {
      console.log("Error: ", err)
      res.send({ message: err });
    }).end();
  } catch (error) {
    console.log("err: ", error);
    res.send({ message: error });
  }
  

});

router.post('/events', function (req, res, next) {
  const { origin, host, id } = req.body;
  const reqBody = `${encodeURI("id")}=${encodeURI(id)}`
  try {
    const x = https.request({
      // host: `front46.omegle.com`,
      host: host,
      method: "POST",
      // path:`/start?caps=recaptcha2,t3&firstevents=1&spid=&randid=3ABQC5LE&cc=9e6116565a7b635909f16a8c5112f11f86b74f2d&lang=en`,
      path: `/events`,
      protocol: "https:",
      // pathname:"start",
      // search:'caps=recaptcha2,t3&firstevents=1&spid=&randid=3ABQC5LE&cc=0dc6f6509372be05107a969b077eedb5f905d1b3&lang=en',
      headers: {
        "Host": host,
        "Origin": origin,
        "Content-Length": reqBody?.length ?? 0,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }, (response) => {
      var data = '';
      response.on('data', (chunk) => {
        if(chunk){
          data += chunk;
        }
      });
      response.on('end', () => {
        console.log("end: ", data);
        return res.status(200).send(data);
      });
    }).on("error", (err) => {
      console.log("Error: ", err)
      return res.send({ message: err });
    })
    x.write(reqBody);
    x.end();
  } catch (error) {
    console.log("err: ", error);
    return res.send({ message: error });
  }

});

router.post('/typing', (req,res,next) => {
  const { origin, host, id } = req.body;
  const reqBody = `${encodeURI("id")}=${encodeURI(id)}`

  try {
    const x = https.request({
      host,
      method:"POST",
      path:"/typing",
      protocol:"https:",
      headers: {
        "Host": host,
        "Origin": origin,
        "Content-Length": reqBody?.length ?? 0,
        'Content-Type': 'application/x-www-form-urlencoded',
      }}, (response) => {
        response.on('data', (data) => {
          return res.status(200).send("ok");
        });
      });
      x.write(reqBody);
      x.end();
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).send(error)
  }
});

router.post('/stoppedTyping', (req,res,next) => {
  const { origin, host, id } = req.body;
  const reqBody = `${encodeURI("id")}=${encodeURI(id)}`

  try {
    const x = https.request({
      host,
      method:"POST",
      path:"/stoppedTyping",
      protocol:"https:",
      headers: {
        "Host": host,
        "Origin": origin,
        "Content-Length": reqBody?.length ?? 0,
        'Content-Type': 'application/x-www-form-urlencoded',
      }}, (response) => {
        response.on('data', () => {
          return res.status(200).send("ok");
        });
      });
      x.write(reqBody);
      x.end();
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).send(error)
  }
})

router.post('/send', (req,res,next) => {
  const { origin, host, id, msg } = req.body;
  const reqBody = `${encodeURI("id")}=${encodeURI(id)}&${encodeURI("msg")}=${encodeURI(msg)}`

  try {
    const x = https.request({
      host,
      method:"POST",
      path:"/send",
      protocol:"https:",
      headers: {
        "Host": host,
        "Origin": origin,
        "Content-Length": reqBody?.length ?? 0,
        'Content-Type': 'application/x-www-form-urlencoded',
      }}, (response) => {
        response.on('data', () => {
          return res.status(200).send("ok");
        });
      });
      x.write(reqBody);
      x.end();
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).send(error)
  }
})
router.post('/disconnect', (req,res,next) => {
  const { origin, host, id } = req.body;
  const reqBody = `${encodeURI("id")}=${encodeURI(id)}}`

  try {
    const x = https.request({
      host,
      method:"POST",
      path:"/disconnect",
      protocol:"https:",
      headers: {
        "Host": host,
        "Origin": origin,
        "Content-Length": reqBody?.length ?? 0,
        'Content-Type': 'application/x-www-form-urlencoded',
      }}, (response) => {
        response.on('data', () => {
          return res.status(200).send("ok");
        });
      });
      x.write(reqBody);
      x.end();
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).send(error)
  }
})

router.post('/test', (req,res,next) => {
  const { origin, host, id } = req.body;
  const reqBody = `${encodeURI("id")}=${encodeURI(id)}}`

  try {
    const x = https.request({
      host: "www.google.com",
      method:"GET",
      path:"/",
      protocol:"https:",
      headers: {
        "Host": host,
        "Origin": origin,
        "Content-Length": reqBody?.length ?? 0,
      }}, (response) => {
        var data = '';

        response.on('data', (chunk) => {
          if(chunk){
            data += chunk;
          }
        });
        response.on('end', () => {
          return res.status(200).send(data);
        });
      });
      x.write(reqBody);
      x.end();
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).send(error)
  }
})

// router.post('/events2', (req, res,next) => {
//   const { origin, host, id } = req.body;
//   const reqBody = JSON.stringify({id});

//   try {
//     const x = client.post(`https://`)
//   } catch (error) {
    
//   }
// })

module.exports = router;
