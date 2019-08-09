import { useEffect, useState } from "react";
import { get, useStore } from "store";

const AbortController = window.AbortController;

const useWifiSettings = () => {
  const [, dispatch] = useStore();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      (async () => {
        try {
          const wifiSettings = await get("/wifi_settings", true, 5000, signal);
          const channels = [];

          await Promise.all(
            wifiSettings.map(async setting => {
              let radio = setting.device.sectionName;
              channels[radio] = [];
              try {
                channels[radio] = await get(
                  `/wifi_settings/get_channels/${radio}`,
                  true,
                  5000,
                  signal
                );
              } catch (e) {
                if (e.message && e.message.includes("aborted")) return;
                setError(true);
              }
              return channels[radio];
            })
          );

          dispatch({ type: "channels", channels });
          dispatch({ type: "wifiSettings", wifiSettings });
        } catch (e) {
          if (e.message && e.message.includes("aborted")) return;
          setError(true);
        }

        setLoading(false);
      })();
      return () => controller.abort();
    },
    [dispatch]
  );

  return [error, loading];
};

export default useWifiSettings;
