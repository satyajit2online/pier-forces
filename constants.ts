// A truncated version of the provided data to serve as an initial state example
// The full processing will happen via the file upload or this default string
export const DEFAULT_CSV_DATA = `TABLE:  Pier Forces,,,,,,,,,,
Story,Pier,Output Case,Case Type,Location,P,V2,V3,T,M2,M3
,,,,,kN,kN,kN,kN-m,kN-m,kN-m
Terrace,C1,DLLL,Combination,Top,-298.5779,-44.3873,-1.1293,0.4818,1.9439,72.4595
Terrace,C1,DLLL,Combination,Bottom,-350.2984,-44.3873,-1.1293,0.4818,-1.2747,-54.0442
Terrace,C2,DLLL,Combination,Top,-335.935,-102.4432,-8.8932,-0.8284,13.4614,172.5257
Terrace,C2,DLLL,Combination,Bottom,-375.9019,-102.4432,-8.8932,-0.8284,-11.8842,-119.4374
Terrace,C4,DLLL,Combination,Top,-346.9644,106.5354,-10.0011,0.51,15.5666,-178.575
Terrace,C4,DLLL,Combination,Bottom,-386.9303,106.5354,-10.0011,0.51,-12.9365,125.051
Floor 6,C1,DLLL,Combination,Top,-631.2265,-29.9375,1.451,0.1405,-2.3095,41.7582
Floor 6,C1,DLLL,Combination,Bottom,-654.7321,-29.9375,1.451,0.1405,1.8257,-43.5636
Floor 5,C1,DLLL,Combination,Top,-931.2702,-29.8219,0.7425,0.1015,-1.1377,42.8566
Floor 5,C1,DLLL,Combination,Bottom,-954.7758,-29.8219,0.7425,0.1015,0.9786,-42.1358
Floor 4,C1,DLLL,Combination,Top,-1226.4923,-25.0955,0.6664,0.11,-1.0945,35.1664
Floor 4,C1,DLLL,Combination,Bottom,-1249.9979,-25.0955,0.6664,0.11,0.8046,-36.3556
Floor 3,C1,DLLL,Combination,Top,-1515.4051,-18.8146,0.4006,0.1257,-0.7856,27.444
Floor 3,C1,DLLL,Combination,Bottom,-1538.9107,-18.8146,0.4006,0.1257,0.3561,-26.1775
Floor 2,C1,DLLL,Combination,Top,-1795.8235,-15.3171,0.4637,0.111,-0.6442,21.3579
Floor 2,C1,DLLL,Combination,Bottom,-1819.329,-15.3171,0.4637,0.111,0.6772,-22.296
Floor 1,C1,DLLL,Combination,Top,-2061.4518,-1.3394,-2.5829,2.6443,-0.2058,-6.379
Floor 1,C1,DLLL,Combination,Bottom,-2098.5658,-1.3394,-2.5829,2.6443,-7.9545,-10.3971
STILT,C1,DLLL,Combination,Top,-2177.5909,6.5365,-8.1383,3.3152,11.77,-8.8061
STILT,C1,DLLL,Combination,Bottom,-2212.8492,6.5365,-8.1383,3.3152,-11.4242,9.8229
BASEMENT,C1,DLLL,Combination,Top,-2287.5058,-0.1726,-5.3184,2.3293,9.0787,2.7554
BASEMENT,C1,DLLL,Combination,Bottom,-2322.7642,-0.1726,-5.3184,2.3293,-6.0789,2.2636
BASEMENT -1,C1,DLLL,Combination,Top,-2362.9934,-20.6263,-5.4757,2.2304,5.0327,7.2592
BASEMENT -1,C1,DLLL,Combination,Bottom,-2381.5504,-20.6263,-5.4757,2.2304,-3.1809,-23.6802
`;

export const STORY_ORDER = [
  'Terrace',
  'Floor 6',
  'Floor 5',
  'Floor 4',
  'Floor 3',
  'Floor 2',
  'Floor 1',
  'STILT',
  'BASEMENT',
  'BASEMENT -1'
];
