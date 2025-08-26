import http from "node:http";
import { readdir, open } from "node:fs/promises";

const server = http.createServer(async (req, res) => {
  if (req.url === "/") {
    const itemsList = await readdir("./storage");
    let dynamicHTML = "";

    itemsList.forEach((item) => {
      dynamicHTML += `<li><a href = "./${item}">${item}</a><br></li>`;
    });

    res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    </head>
    <body>
    <h1>My Files</h1>
    <ul>
    ${dynamicHTML}
    </ul>
    </body>
    </html>
    `);
  } else {
    try {
      const fileHandle = await open(`./storage${decodeURIComponent(req.url)}`);
      const readStream = fileHandle.createReadStream();
      readStream.pipe(res);
    } catch (err) {
      console.log(err.message);
      res.end("page not found");
    }
  }
});

server.listen(5000, "0.0.0.0", () => {
  console.log("Server started");
});
