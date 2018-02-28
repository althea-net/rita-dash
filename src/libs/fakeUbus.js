export default class Ubus {
  async call(sessionID, obj, method, args) {
    console.log("fakeUbus", sessionID, JSON.stringify([obj, method, args]));

    if (
      JSON.stringify(obj, method, args) ===
      `["uci","get",{"config":"wireless"}]`
    ) {
    }

    if (
      JSON.stringify(obj, method, args) ===
      `["uci","get",{"config":"tunneldigger"}]`
    ) {
    }
  }
}
