import kv from "@/lib/redis";
import { getNowMs } from "@/lib/time";

const FETCH_LUA = `
local raw = redis.call("GET", KEYS[1])
if not raw then
  return { err = "NOT_FOUND" }
end

local paste = cjson.decode(raw)
local now = tonumber(ARGV[1])

if paste.expires_at ~= cjson.null and now > paste.expires_at then
  return { err = "NOT_FOUND" }
end

if paste.max_views ~= cjson.null and paste.views >= paste.max_views then
  return { err = "NOT_FOUND" }
end

paste.views = paste.views + 1

if paste.max_views ~= cjson.null and paste.views > paste.max_views then
  return { err = "NOT_FOUND" }
end

redis.call("SET", KEYS[1], cjson.encode(paste))

local remaining_views = cjson.null
if paste.max_views ~= cjson.null then
  remaining_views = paste.max_views - paste.views
end

return cjson.encode({
  content = paste.content,
  remaining_views = remaining_views,
  expires_at = paste.expires_at
})
`;

export async function fetchPasteAtomic(req: Request, id: string) {
  const now = getNowMs(req);
  const key = `paste:${id}`;
   console.log("Fetching paste with key:", key, "at time:", now);
  return kv.eval(FETCH_LUA, [key], [String(now)]);
}
