import React from "react";
import International from "images/flags/international.png";
import CA from "images/flags/CA.png";
import CO from "images/flags/CO.png";
import MX from "images/flags/MX.png";
import US from "images/flags/US.png";

const flagMap = {
  AC: () => <img src={International} alt="International" />,
  AD: () => <img src={International} alt="International" />,
  AE: () => <img src={International} alt="International" />,
  AF: () => <img src={International} alt="International" />,
  AG: () => <img src={International} alt="International" />,
  AI: () => <img src={International} alt="International" />,
  AL: () => <img src={International} alt="International" />,
  AM: () => <img src={International} alt="International" />,
  AO: () => <img src={International} alt="International" />,
  AR: () => <img src={International} alt="International" />,
  AS: () => <img src={International} alt="International" />,
  AT: () => <img src={International} alt="International" />,
  AU: () => <img src={International} alt="International" />,
  AW: () => <img src={International} alt="International" />,
  AX: () => <img src={International} alt="International" />,
  AZ: () => <img src={International} alt="International" />,
  BA: () => <img src={International} alt="International" />,
  BB: () => <img src={International} alt="International" />,
  BD: () => <img src={International} alt="International" />,
  BE: () => <img src={International} alt="International" />,
  BF: () => <img src={International} alt="International" />,
  BG: () => <img src={International} alt="International" />,
  BH: () => <img src={International} alt="International" />,
  BI: () => <img src={International} alt="International" />,
  BJ: () => <img src={International} alt="International" />,
  BL: () => <img src={International} alt="International" />,
  BM: () => <img src={International} alt="International" />,
  BN: () => <img src={International} alt="International" />,
  BO: () => <img src={International} alt="International" />,
  BQ: () => <img src={International} alt="International" />,
  BR: () => <img src={International} alt="International" />,
  BS: () => <img src={International} alt="International" />,
  BT: () => <img src={International} alt="International" />,
  BW: () => <img src={International} alt="International" />,
  BY: () => <img src={International} alt="International" />,
  BZ: () => <img src={International} alt="International" />,
  CA: () => <img src={CA} alt="Canada Flag" />,
  CC: () => <img src={International} alt="International" />,
  CD: () => <img src={International} alt="International" />,
  CF: () => <img src={International} alt="International" />,
  CG: () => <img src={International} alt="International" />,
  CH: () => <img src={International} alt="International" />,
  CI: () => <img src={International} alt="International" />,
  CK: () => <img src={International} alt="International" />,
  CL: () => <img src={International} alt="International" />,
  CM: () => <img src={International} alt="International" />,
  CN: () => <img src={International} alt="International" />,
  CO: () => <img src={CO} alt="Colombian Flag" />,
  CR: () => <img src={International} alt="International" />,
  CU: () => <img src={International} alt="International" />,
  CV: () => <img src={International} alt="International" />,
  CW: () => <img src={International} alt="International" />,
  CX: () => <img src={International} alt="International" />,
  CY: () => <img src={International} alt="International" />,
  CZ: () => <img src={International} alt="International" />,
  DE: () => <img src={International} alt="International" />,
  DJ: () => <img src={International} alt="International" />,
  DK: () => <img src={International} alt="International" />,
  DM: () => <img src={International} alt="International" />,
  DO: () => <img src={International} alt="International" />,
  DZ: () => <img src={International} alt="International" />,
  EC: () => <img src={International} alt="International" />,
  EE: () => <img src={International} alt="International" />,
  EG: () => <img src={International} alt="International" />,
  EH: () => <img src={International} alt="International" />,
  ER: () => <img src={International} alt="International" />,
  ES: () => <img src={International} alt="International" />,
  ET: () => <img src={International} alt="International" />,
  FI: () => <img src={International} alt="International" />,
  FJ: () => <img src={International} alt="International" />,
  FK: () => <img src={International} alt="International" />,
  FM: () => <img src={International} alt="International" />,
  FO: () => <img src={International} alt="International" />,
  FR: () => <img src={International} alt="International" />,
  GA: () => <img src={International} alt="International" />,
  GB: () => <img src={International} alt="International" />,
  GD: () => <img src={International} alt="International" />,
  GE: () => <img src={International} alt="International" />,
  GF: () => <img src={International} alt="International" />,
  GG: () => <img src={International} alt="International" />,
  GH: () => <img src={International} alt="International" />,
  GI: () => <img src={International} alt="International" />,
  GL: () => <img src={International} alt="International" />,
  GM: () => <img src={International} alt="International" />,
  GN: () => <img src={International} alt="International" />,
  GP: () => <img src={International} alt="International" />,
  GQ: () => <img src={International} alt="International" />,
  GR: () => <img src={International} alt="International" />,
  GT: () => <img src={International} alt="International" />,
  GU: () => <img src={International} alt="International" />,
  GW: () => <img src={International} alt="International" />,
  GY: () => <img src={International} alt="International" />,
  HK: () => <img src={International} alt="International" />,
  HN: () => <img src={International} alt="International" />,
  HR: () => <img src={International} alt="International" />,
  HT: () => <img src={International} alt="International" />,
  HU: () => <img src={International} alt="International" />,
  ID: () => <img src={International} alt="International" />,
  IE: () => <img src={International} alt="International" />,
  IL: () => <img src={International} alt="International" />,
  IM: () => <img src={International} alt="International" />,
  IN: () => <img src={International} alt="International" />,
  IO: () => <img src={International} alt="International" />,
  IQ: () => <img src={International} alt="International" />,
  IR: () => <img src={International} alt="International" />,
  IS: () => <img src={International} alt="International" />,
  IT: () => <img src={International} alt="International" />,
  JE: () => <img src={International} alt="International" />,
  JM: () => <img src={International} alt="International" />,
  JO: () => <img src={International} alt="International" />,
  JP: () => <img src={International} alt="International" />,
  KE: () => <img src={International} alt="International" />,
  KG: () => <img src={International} alt="International" />,
  KH: () => <img src={International} alt="International" />,
  KI: () => <img src={International} alt="International" />,
  KM: () => <img src={International} alt="International" />,
  KN: () => <img src={International} alt="International" />,
  KP: () => <img src={International} alt="International" />,
  KR: () => <img src={International} alt="International" />,
  KW: () => <img src={International} alt="International" />,
  KY: () => <img src={International} alt="International" />,
  KZ: () => <img src={International} alt="International" />,
  LA: () => <img src={International} alt="International" />,
  LB: () => <img src={International} alt="International" />,
  LC: () => <img src={International} alt="International" />,
  LI: () => <img src={International} alt="International" />,
  LK: () => <img src={International} alt="International" />,
  LR: () => <img src={International} alt="International" />,
  LS: () => <img src={International} alt="International" />,
  LT: () => <img src={International} alt="International" />,
  LU: () => <img src={International} alt="International" />,
  LV: () => <img src={International} alt="International" />,
  LY: () => <img src={International} alt="International" />,
  MA: () => <img src={International} alt="International" />,
  MC: () => <img src={International} alt="International" />,
  MD: () => <img src={International} alt="International" />,
  ME: () => <img src={International} alt="International" />,
  MF: () => <img src={International} alt="International" />,
  MG: () => <img src={International} alt="International" />,
  MH: () => <img src={International} alt="International" />,
  MK: () => <img src={International} alt="International" />,
  ML: () => <img src={International} alt="International" />,
  MM: () => <img src={International} alt="International" />,
  MN: () => <img src={International} alt="International" />,
  MO: () => <img src={International} alt="International" />,
  MP: () => <img src={International} alt="International" />,
  MQ: () => <img src={International} alt="International" />,
  MR: () => <img src={International} alt="International" />,
  MS: () => <img src={International} alt="International" />,
  MT: () => <img src={International} alt="International" />,
  MU: () => <img src={International} alt="International" />,
  MV: () => <img src={International} alt="International" />,
  MW: () => <img src={International} alt="International" />,
  MX: () => <img src={MX} alt="Mexico" />,
  MY: () => <img src={International} alt="International" />,
  MZ: () => <img src={International} alt="International" />,
  NA: () => <img src={International} alt="International" />,
  NC: () => <img src={International} alt="International" />,
  NE: () => <img src={International} alt="International" />,
  NF: () => <img src={International} alt="International" />,
  NG: () => <img src={International} alt="International" />,
  NI: () => <img src={International} alt="International" />,
  NL: () => <img src={International} alt="International" />,
  NO: () => <img src={International} alt="International" />,
  NP: () => <img src={International} alt="International" />,
  NR: () => <img src={International} alt="International" />,
  NU: () => <img src={International} alt="International" />,
  NZ: () => <img src={International} alt="International" />,
  OM: () => <img src={International} alt="International" />,
  PA: () => <img src={International} alt="International" />,
  PE: () => <img src={International} alt="International" />,
  PF: () => <img src={International} alt="International" />,
  PG: () => <img src={International} alt="International" />,
  PH: () => <img src={International} alt="International" />,
  PK: () => <img src={International} alt="International" />,
  PL: () => <img src={International} alt="International" />,
  PM: () => <img src={International} alt="International" />,
  PR: () => <img src={International} alt="International" />,
  PS: () => <img src={International} alt="International" />,
  PT: () => <img src={International} alt="International" />,
  PW: () => <img src={International} alt="International" />,
  PY: () => <img src={International} alt="International" />,
  QA: () => <img src={International} alt="International" />,
  RE: () => <img src={International} alt="International" />,
  RO: () => <img src={International} alt="International" />,
  RS: () => <img src={International} alt="International" />,
  RU: () => <img src={International} alt="International" />,
  RW: () => <img src={International} alt="International" />,
  SA: () => <img src={International} alt="International" />,
  SB: () => <img src={International} alt="International" />,
  SC: () => <img src={International} alt="International" />,
  SD: () => <img src={International} alt="International" />,
  SE: () => <img src={International} alt="International" />,
  SG: () => <img src={International} alt="International" />,
  SH: () => <img src={International} alt="International" />,
  SI: () => <img src={International} alt="International" />,
  SJ: () => <img src={International} alt="International" />,
  SK: () => <img src={International} alt="International" />,
  SL: () => <img src={International} alt="International" />,
  SM: () => <img src={International} alt="International" />,
  SN: () => <img src={International} alt="International" />,
  SO: () => <img src={International} alt="International" />,
  SR: () => <img src={International} alt="International" />,
  SS: () => <img src={International} alt="International" />,
  ST: () => <img src={International} alt="International" />,
  SV: () => <img src={International} alt="International" />,
  SX: () => <img src={International} alt="International" />,
  SY: () => <img src={International} alt="International" />,
  SZ: () => <img src={International} alt="International" />,
  TA: () => <img src={International} alt="International" />,
  TC: () => <img src={International} alt="International" />,
  TD: () => <img src={International} alt="International" />,
  TG: () => <img src={International} alt="International" />,
  TH: () => <img src={International} alt="International" />,
  TJ: () => <img src={International} alt="International" />,
  TK: () => <img src={International} alt="International" />,
  TL: () => <img src={International} alt="International" />,
  TM: () => <img src={International} alt="International" />,
  TN: () => <img src={International} alt="International" />,
  TO: () => <img src={International} alt="International" />,
  TR: () => <img src={International} alt="International" />,
  TT: () => <img src={International} alt="International" />,
  TV: () => <img src={International} alt="International" />,
  TW: () => <img src={International} alt="International" />,
  TZ: () => <img src={International} alt="International" />,
  UA: () => <img src={International} alt="International" />,
  UG: () => <img src={International} alt="International" />,
  US: () => <img src={US} alt="US Flag" />,
  UY: () => <img src={International} alt="International" />,
  UZ: () => <img src={International} alt="International" />,
  VA: () => <img src={International} alt="International" />,
  VC: () => <img src={International} alt="International" />,
  VE: () => <img src={International} alt="International" />,
  VG: () => <img src={International} alt="International" />,
  VI: () => <img src={International} alt="International" />,
  VN: () => <img src={International} alt="International" />,
  VU: () => <img src={International} alt="International" />,
  WF: () => <img src={International} alt="International" />,
  WS: () => <img src={International} alt="International" />,
  XK: () => <img src={International} alt="International" />,
  YE: () => <img src={International} alt="International" />,
  YT: () => <img src={International} alt="International" />,
  ZA: () => <img src={International} alt="International" />,
  ZM: () => <img src={International} alt="International" />,
  ZW: () => <img src={International} alt="International" />,
};

export default flagMap;
