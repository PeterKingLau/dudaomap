const BAIDU_MAP_SRC =
  "https://api.map.baidu.com/api?v=1.0&type=webgl&ak=92ocG5CWALrKFvPODxhE2KqKlSbr6o53";

let loadingPromise = null;

export function waitForBMapGL(timeout = 10000) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window is not available"));
  }

  const BMap = getBMapGL();
  if (BMap) {
    return Promise.resolve(BMap);
  }

  if (!loadingPromise) {
    loadingPromise = new Promise((resolve, reject) => {
      ensureBaiduMapScript();

      const startTime = Date.now();
      const timer = window.setInterval(() => {
        const BMap = getBMapGL();
        if (BMap) {
          window.clearInterval(timer);
          resolve(BMap);
          return;
        }

        if (Date.now() - startTime >= timeout) {
          window.clearInterval(timer);
          loadingPromise = null;
          reject(new Error("BMapGL load timeout"));
        }
      }, 50);
    });
  }

  return loadingPromise;
}

export function getBMapGL() {
  return window.BMapGL || globalThis.BMapGL;
}

function ensureBaiduMapScript() {
  const scripts = Array.from(document.scripts);
  const hasScript = scripts.some((script) =>
    script.src.includes("api.map.baidu.com/api"),
  );

  if (hasScript) {
    return;
  }

  const script = document.createElement("script");
  script.src = BAIDU_MAP_SRC;
  script.async = false;
  document.head.appendChild(script);
}
