// Minimal Turbo remote cache server (the open /v8/artifacts protocol that
// self-hosted caches like ducktors/turborepo-remote-cache implement).
// It is content-addressable by the INPUT hash Turbo sends - it does NOT verify
// that the uploaded bytes actually correspond to those inputs. That is the flaw:
// any client holding a write token can store arbitrary bytes under any hash.
import { createServer } from "node:http";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const PORT = Number(process.env.PORT || 9099);
const STORE = "/tmp/turbo-remote-store";
const TOKEN = "poc-write-token"; // every branch / CI job shares this
mkdirSync(STORE, { recursive: true });

const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const auth = req.headers["authorization"] || "";
  const m = url.pathname.match(/^\/v8\/artifacts\/([^/?]+)$/);

  // status handshake
  if (url.pathname === "/v8/artifacts/status") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ status: "enabled" }));
  }
  // analytics events - accept and ignore
  if (url.pathname === "/v8/artifacts/events") {
    req.resume();
    res.writeHead(200, { "content-type": "application/json" });
    return res.end("[]");
  }

  // token check - realistic: writes require a token (which every CI branch has)
  if (m && auth !== `Bearer ${TOKEN}`) {
    res.writeHead(401);
    return res.end("unauthorized");
  }

  if (m && req.method === "PUT") {
    const hash = m[1];
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const buf = Buffer.concat(chunks);
      // NO validation that buf corresponds to `hash`'s inputs. Whatever you send,
      // we store. This is the poisoning primitive.
      writeFileSync(`${STORE}/${hash}`, buf);
      log(`PUT  /v8/artifacts/${hash}  <- ${buf.length} bytes  STORED (no content check)`);
      res.writeHead(202, { "content-type": "application/json" });
      res.end(JSON.stringify({ urls: [`${hash}`] }));
    });
    return;
  }

  if (m && (req.method === "GET" || req.method === "HEAD")) {
    const hash = m[1];
    const p = `${STORE}/${hash}`;
    if (!existsSync(p)) {
      log(`GET  /v8/artifacts/${hash}  -> 404`);
      res.writeHead(404);
      return res.end("not found");
    }
    const buf = readFileSync(p);
    log(`GET  /v8/artifacts/${hash}  -> 200  (${buf.length} bytes served from cache)`);
    res.writeHead(200, { "content-type": "application/octet-stream" });
    return res.end(req.method === "HEAD" ? undefined : buf);
  }

  res.writeHead(404);
  res.end("nope");
}).listen(PORT, "127.0.0.1", () => log(`remote cache listening on http://127.0.0.1:${PORT}`));
