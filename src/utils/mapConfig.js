export const OVERVIEW_REGION = "四川";

export const MAP_CENTERS = {
  四川: [103.7, 30.65],
  总公司: [103.7, 30.65],
  涪城: [104.679127, 31.467673],
  广汉: [104.28249, 30.97706],
  安州: [104.56735, 31.45475],
  南充: [106.118889, 30.781529],
  射洪: [105.38836, 30.87113],
  成华: [104.10194, 30.65984],
};

export const DIRECT_REGION_NAMES = ["涪城", "安州", "成华"];

export function isOverviewRegion(region) {
  return !region || region === OVERVIEW_REGION || region === "总公司";
}

export function getMapCenter(region) {
  return MAP_CENTERS[region] || MAP_CENTERS[OVERVIEW_REGION];
}

export function getMapZoom(region) {
  return isOverviewRegion(region) ? 8 : 14;
}

export function getRegionKeyword(region) {
  if (isOverviewRegion(region)) {
    return "";
  }

  return DIRECT_REGION_NAMES.includes(region) ? region : `四川省${region}`;
}

export function getDeviceStatusText(style) {
  const statusMap = {
    0: "正常",
    1: "离线",
    2: "故障",
  };

  return statusMap[style] || "--";
}
