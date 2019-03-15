// dj 30925
// justin thomas 33448
// woods 08793

// fowler 32102
// rose 22405
// rahm 46970
// koepka 36689

// descham 47959
// finau 29725
// matsu 32839
// fleetwood 30911

// watson 25804
// reed 34360
// casey 25364
// molina 25198

// shaffle 48081
// webb 29221
// mickelson 01810

// kuchar 23108
// scott 24502
// noen 27349
// snedecker 27649

// horscel 29420
// cameron smaith 35891
// zj 24024
// keegan 33141
// stanley 30110

// woodland 31323
// hoffman 12716

// na 25396
// kisber 29478
// hatton 34363
// poutler

// champ 52372
// hossler 35461
// grillo 31646
// grace 29974

const teams = [
  {
    label: 'Steve',
    teamTotal: 0,
    slug: '/team/steve',
    activePlayers: [],
    playerList: [
      '30925',
      '22405',
      '47959',
      '25804',
      '48081',
      '23108',
      '35891',
      '31323',
      '29478',
      '29974'
    ]
  },
  {
    label: 'Jerry',
    teamTotal: 0,
    slug: '/team/jerry',
    activePlayers: [],
    playerList: [
      '33448',
      '22405',
      '47959',
      '25198',
      '29221',
      '23108',
      '30110',
      '31323',
      '25396',
      '52372'
    ]
  },
  {
    label: 'Matt L',
    teamTotal: 0,
    slug: '/team/mattl',
    activePlayers: [],
    playerList: [
      '33448',
      '36689',
      '30911',
      '34360',
      '29221',
      '27649',
      '33141',
      '12716',
      '26499',
      '46501'
    ]
  },
  {
    label: 'Mike',
    teamTotal: 0,
    slug: '/team/mike',
    activePlayers: [],
    playerList: [
      '30925',
      '32102',
      '29725',
      '34360',
      '01810',
      '23108',
      '29420',
      '12716',
      '24138',
      '29974'
    ]
  },
  {
    label: 'Ryan G',
    teamTotal: 0,
    slug: '/team/ryang',
    activePlayers: [],
    playerList: [
      '30925',
      '22405',
      '29725',
      '25364',
      '48081',
      '23108',
      '29420',
      '31323',
      '29478',
      '34256'
    ]
  },
  {
    label: 'Gaspar',
    teamTotal: 0,
    slug: '/team/gaspar',
    activePlayers: [],
    playerList: [
      '30925',
      '36689',
      '29725',
      '25364',
      '48081',
      '23108',
      '29420',
      '31323',
      '34363',
      '29974'
    ]
  },
  {
    label: 'Woogs',
    teamTotal: 0,
    slug: '/team/woogs',
    activePlayers: [],
    playerList: [
      '08793',
      '32102',
      '30911',
      '25198',
      '48081',
      '23108',
      '29420',
      '12716',
      '25396',
      '39971'
    ]
  },
  {
    label: 'Shane',
    teamTotal: 0,
    slug: '/team/shane',
    activePlayers: [],
    playerList: [
      '33448',
      '46970',
      '29725',
      '34360',
      '48081',
      '27349',
      '29420',
      '31323',
      '29478',
      '52372'
    ]
  },
  {
    label: 'Lucas',
    teamTotal: 0,
    slug: '/team/lucas',
    activePlayers: [],
    playerList: [
      '33448',
      '22405',
      '29725',
      '25804',
      '29221',
      '23108',
      '33141',
      '31323',
      '29478',
      '52372'
    ]
  },
  {
    label: 'Ryan',
    teamTotal: 0,
    slug: '/team/ryan',
    activePlayers: [],
    playerList: [
      '08793',
      '32102',
      '47959',
      '25364',
      '48081',
      '23108',
      '29420',
      '31323',
      '34363',
      '46501'
    ]
  },
  {
    label: 'Jake',
    teamTotal: 0,
    slug: '/team/jake',
    activePlayers: [],
    playerList: [
      '30925',
      '46970',
      '29725',
      '25364',
      '29221',
      '24502',
      '29420',
      '31323',
      '34363',
      '31646'
    ]
  },
  {
    label: 'Will',
    teamTotal: 0,
    slug: '/team/will',
    activePlayers: [],
    playerList: [
      '33448',
      '22405',
      '32839',
      '34360',
      '48081',
      '24502',
      '24024',
      '31323',
      '29478',
      '35461'
    ]
  },
  {
    label: 'Brad',
    teamTotal: 0,
    slug: '/team/brad',
    activePlayers: [],
    playerList: [
      '33448',
      '22405',
      '29725',
      '25804',
      '29221',
      '23108',
      '35891',
      '12716',
      '29478',
      '35461'
    ]
  },
  {
    label: 'Matt',
    teamTotal: 0,
    slug: '/team/matt',
    activePlayers: [],
    playerList: [
      '30925',
      '32102',
      '47959',
      '25804',
      '48081',
      '23108',
      '29420',
      '31323',
      '25396',
      '52372'
    ]
  }
];

const initialState = {
  teams: teams
};

const TeamReducer = (state = initialState, action) => {
  return state;
};

export default TeamReducer;
