const heos = require("heos-api");

const fav = {
  kiosk: "http://kioskradiobxl.out.airtime.pro:8000/kioskradiobxl_b",
  lyl: "https://icecast.lyl.live/live",
};
const url = process.env.FAV
  ? fav[process.env.FAV]
  : process.env.URL || "http://kioskradiobxl.out.airtime.pro:8000/kioskradiobxl_b";

heos
  .discoverAndConnect({})
  .then((c) => c.on({ commandGroup: "system", command: "check_account" }, console.log))
  .then((c) =>
    c.onAll((response) => {
      // response.heos.command.command !== "player_now_playing_progress" &&
      //   console.log("MESSAGE", response.heos);
      if (response.heos.command.command === "get_players") {
        if (response?.payload[0].gid !== undefined) {
          c.write("browse", "play_stream", {
            pid: response.payload[0].gid,
            url: url,
          });
        }
        c.write("browse", "play_stream", {
          pid: response.payload[0].pid,
          url: url,
        });
      }
    })
  )
  .then((c) => c.write("system", "register_for_change_events", { enable: "on" }))
  .then((c) => c.write("player", "get_players"));
