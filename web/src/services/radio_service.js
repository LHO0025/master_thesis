export function fetchBufferSize(ssid) {
    return fetch("http://localhost:7979/buffer_size/" + ssid)
}


function fetchStationInfo() {
    return mock_data
}

export const mock_data = {
    "cir_peaks": [
        {
            "index": 709,
            "value": 9.130324363708496
        },
        {
            "index": 965,
            "value": -2.9400711059570312
        },
        {
            "index": 1061,
            "value": -3.0812363624572754
        },
        {
            "index": 1974,
            "value": -3.223097085952759
        },
        {
            "index": 454,
            "value": -3.3064792156219482
        },
        {
            "index": 1125,
            "value": -3.5289623737335205
        }
    ],
    "demodulator": {
        "fic": {
            "numcrcerrors": 322
        },
        "frequencycorrection": -2802,
        "snr": 11,
        "time_last_fct0_frame": 1729852970650
    },
    "ensemble": {
        "ecc": "0xe2",
        "id": "0x2001",
        "label": {
            "fig2charset": "Undefined",
            "fig2label": "",
            "fig2rfu": false,
            "label": "TELEKO DAB1     ",
            "shortlabel": "TELEKO 1"
        }
    },
    "messages": [],
    "receiver": {
        "hardware": {
            "gain": 22.899999618530273,
            "name": "Realtek, RTL2838UHIDIR, 00000001"
        },
        "software": {
            "coarsecorrectorenabled": true,
            "fftwindowplacement": "ThresholdBeforePeak",
            "freqsyncmethod": "PatternOfZeros",
            "lastchannelchange": 1729852970650,
            "name": "welle.io",
            "version": "v2.4-4-g5481d57e"
        }
    },
    "services": [
        {
            "audiolevel": null,
            "channels": 0,
            "components": [
                {
                    "ascty": "DAB+",
                    "caflag": false,
                    "componentnr": 0,
                    "dscty": null,
                    "label": {
                        "fig2charset": "Undefined",
                        "fig2label": "",
                        "fig2rfu": false,
                        "label": "",
                        "shortlabel": ""
                    },
                    "primary": true,
                    "scid": null,
                    "subchannel": {
                        "bitrate": 96,
                        "cu": 144,
                        "language": 6,
                        "languagestring": "Czech",
                        "protection": "EEP 1-A",
                        "sad": 288,
                        "subchid": 2
                    },
                    "transportmode": "audio"
                }
            ],
            "dls": {
                "label": "",
                "lastchange": 0,
                "time": 0
            },
            "errorcounters": {
                "aacerrors": 0,
                "frameerrors": 0,
                "rserrors": 0,
                "time": 0
            },
            "label": {
                "fig2charset": "Undefined",
                "fig2label": "",
                "fig2rfu": false,
                "label": "CRo-SEVER       ",
                "shortlabel": "R-SEVER"
            },
            "language": 0,
            "languagestring": "",
            "mode": "invalid",
            "mot": {
                "lastchange": 0,
                "time": 0
            },
            "programType": 9,
            "ptystring": "Talk",
            "samplerate": 0,
            "sid": "0x2709",
            "url_mp3": "/mp3/0x2709",
            "xpaderror": {
                "haserror": false
            }
        },
        {
            "audiolevel": null,
            "channels": 0,
            "components": [
                {
                    "ascty": "DAB+",
                    "caflag": false,
                    "componentnr": 0,
                    "dscty": null,
                    "label": {
                        "fig2charset": "Undefined",
                        "fig2label": "",
                        "fig2rfu": false,
                        "label": "",
                        "shortlabel": ""
                    },
                    "primary": true,
                    "scid": null,
                    "subchannel": {
                        "bitrate": 96,
                        "cu": 144,
                        "language": 6,
                        "languagestring": "Czech",
                        "protection": "EEP 1-A",
                        "sad": 0,
                        "subchid": 4
                    },
                    "transportmode": "audio"
                }
            ],
            "dls": {
                "label": "",
                "lastchange": 0,
                "time": 0
            },
            "errorcounters": {
                "aacerrors": 0,
                "frameerrors": 0,
                "rserrors": 0,
                "time": 0
            },
            "label": {
                "fig2charset": "Undefined",
                "fig2label": "",
                "fig2rfu": false,
                "label": "Radio PROGLAS   ",
                "shortlabel": "PROGLAS"
            },
            "language": 0,
            "languagestring": "",
            "mode": "invalid",
            "mot": {
                "lastchange": 0,
                "time": 0
            },
            "programType": 20,
            "ptystring": "Religion",
            "samplerate": 0,
            "sid": "0x2aa1",
            "url_mp3": "/mp3/0x2aa1",
            "xpaderror": {
                "haserror": false
            }
        },
        {
            "audiolevel": null,
            "channels": 0,
            "components": [
                {
                    "ascty": "DAB+",
                    "caflag": false,
                    "componentnr": 0,
                    "dscty": null,
                    "label": {
                        "fig2charset": "Undefined",
                        "fig2label": "",
                        "fig2rfu": false,
                        "label": "",
                        "shortlabel": ""
                    },
                    "primary": true,
                    "scid": null,
                    "subchannel": {
                        "bitrate": 96,
                        "cu": 144,
                        "language": 6,
                        "languagestring": "Czech",
                        "protection": "EEP 1-A",
                        "sad": 144,
                        "subchid": 13
                    },
                    "transportmode": "audio"
                }
            ],
            "dls": {
                "label": "",
                "lastchange": 0,
                "time": 0
            },
            "errorcounters": {
                "aacerrors": 0,
                "frameerrors": 0,
                "rserrors": 0,
                "time": 0
            },
            "label": {
                "fig2charset": "Undefined",
                "fig2label": "",
                "fig2rfu": false,
                "label": "DAB plus TOP40  ",
                "shortlabel": "TOP40"
            },
            "language": 0,
            "languagestring": "",
            "mode": "invalid",
            "mot": {
                "lastchange": 0,
                "time": 0
            },
            "programType": 10,
            "ptystring": "Pop Music",
            "samplerate": 0,
            "sid": "0x2fb5",
            "url_mp3": "/mp3/0x2fb5",
            "xpaderror": {
                "haserror": false
            }
        },
        {
            "audiolevel": null,
            "channels": 0,
            "components": [
                {
                    "ascty": "DAB+",
                    "caflag": false,
                    "componentnr": 0,
                    "dscty": null,
                    "label": {
                        "fig2charset": "Undefined",
                        "fig2label": "",
                        "fig2rfu": false,
                        "label": "",
                        "shortlabel": ""
                    },
                    "primary": true,
                    "scid": null,
                    "subchannel": {
                        "bitrate": 96,
                        "cu": 144,
                        "language": 6,
                        "languagestring": "Czech",
                        "protection": "EEP 1-A",
                        "sad": 720,
                        "subchid": 5
                    },
                    "transportmode": "audio"
                }
            ],
            "dls": {
                "label": "",
                "lastchange": 0,
                "time": 0
            },
            "errorcounters": {
                "aacerrors": 0,
                "frameerrors": 0,
                "rserrors": 0,
                "time": 0
            },
            "label": {
                "fig2charset": "Undefined",
                "fig2label": "",
                "fig2rfu": false,
                "label": "Radio 7         ",
                "shortlabel": "Radio 7"
            },
            "language": 0,
            "languagestring": "",
            "mode": "invalid",
            "mot": {
                "lastchange": 0,
                "time": 0
            },
            "programType": 9,
            "ptystring": "Talk",
            "samplerate": 0,
            "sid": "0x2fb9",
            "url_mp3": "/mp3/0x2fb9",
            "xpaderror": {
                "haserror": false
            }
        },
        {
            "audiolevel": null,
            "channels": 0,
            "components": [
                {
                    "ascty": "DAB+",
                    "caflag": false,
                    "componentnr": 0,
                    "dscty": null,
                    "label": {
                        "fig2charset": "Undefined",
                        "fig2label": "",
                        "fig2rfu": false,
                        "label": "",
                        "shortlabel": ""
                    },
                    "primary": true,
                    "scid": null,
                    "subchannel": {
                        "bitrate": 96,
                        "cu": 144,
                        "language": 6,
                        "languagestring": "Czech",
                        "protection": "EEP 1-A",
                        "sad": 576,
                        "subchid": 0
                    },
                    "transportmode": "audio"
                }
            ],
            "dls": {
                "label": "",
                "lastchange": 0,
                "time": 0
            },
            "errorcounters": {
                "aacerrors": 0,
                "frameerrors": 0,
                "rserrors": 0,
                "time": 0
            },
            "label": {
                "fig2charset": "Undefined",
                "fig2label": "",
                "fig2rfu": false,
                "label": "ZUN radio       ",
                "shortlabel": "ZUN"
            },
            "language": 0,
            "languagestring": "",
            "mode": "invalid",
            "mot": {
                "lastchange": 0,
                "time": 0
            },
            "programType": 10,
            "ptystring": "Pop Music",
            "samplerate": 0,
            "sid": "0x2f76",
            "url_mp3": "/mp3/0x2f76",
            "xpaderror": {
                "haserror": false
            }
        },
        {
            "audiolevel": null,
            "channels": 0,
            "components": [
                {
                    "ascty": "DAB+",
                    "caflag": false,
                    "componentnr": 0,
                    "dscty": null,
                    "label": {
                        "fig2charset": "Undefined",
                        "fig2label": "",
                        "fig2rfu": false,
                        "label": "",
                        "shortlabel": ""
                    },
                    "primary": true,
                    "scid": null,
                    "subchannel": {
                        "bitrate": 96,
                        "cu": 144,
                        "language": 6,
                        "languagestring": "Czech",
                        "protection": "EEP 1-A",
                        "sad": 432,
                        "subchid": 1
                    },
                    "transportmode": "audio"
                }
            ],
            "dls": {
                "label": "",
                "lastchange": 0,
                "time": 0
            },
            "errorcounters": {
                "aacerrors": 0,
                "frameerrors": 0,
                "rserrors": 0,
                "time": 0
            },
            "label": {
                "fig2charset": "Undefined",
                "fig2label": "",
                "fig2rfu": false,
                "label": "CRo-H. KRALOVE  ",
                "shortlabel": "R-HK"
            },
            "language": 0,
            "languagestring": "",
            "mode": "invalid",
            "mot": {
                "lastchange": 0,
                "time": 0
            },
            "programType": 9,
            "ptystring": "Talk",
            "samplerate": 0,
            "sid": "0x280a",
            "url_mp3": "/mp3/0x280a",
            "xpaderror": {
                "haserror": false
            }
        }
    ],
    "tii": [],
    "utctime": {
        "day": 25,
        "hour": 10,
        "lto": 2,
        "minutes": 42,
        "month": 10,
        "year": 2024
    }
}

