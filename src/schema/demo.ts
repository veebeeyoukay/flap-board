import type { BoardConfig } from './types';

export const DEMO_CONFIG: BoardConfig = {
  schemaVersion: 'flap-board.v1',
  title: 'DEPARTURES',
  showHeader: true,
  columns: [
    { key: 'time', label: 'TIME', widthChars: 5, align: 'center' },
    { key: 'dest', label: 'DESTINATION', widthChars: 16, align: 'left' },
    { key: 'flight', label: 'FLIGHT', widthChars: 7, align: 'center' },
    { key: 'gate', label: 'GATE', widthChars: 4, align: 'center' },
    { key: 'status', label: 'STATUS', widthChars: 8, align: 'left' },
  ],
  rows: [
    { id: 'r1', values: { time: '09:15', dest: 'LONDON LHR', flight: 'BA 178', gate: 'A12', status: 'BOARDING' } },
    { id: 'r2', values: { time: '09:30', dest: 'PARIS CDG', flight: 'AF 023', gate: 'B07', status: 'ON TIME' } },
    { id: 'r3', values: { time: '09:45', dest: 'AMSTERDAM', flight: 'KL 642', gate: 'C03', status: 'DELAYED' } },
    { id: 'r4', values: { time: '10:00', dest: 'FRANKFURT', flight: 'LH 401', gate: 'A09', status: 'ON TIME' } },
    { id: 'r5', values: { time: '10:15', dest: 'MADRID MAD', flight: 'IB 312', gate: 'B12', status: 'BOARDING' } },
    { id: 'r6', values: { time: '10:30', dest: 'ZURICH', flight: 'LX 015', gate: 'C08', status: 'ON TIME' } },
    { id: 'r7', values: { time: '10:45', dest: 'ROME FCO', flight: 'AZ 219', gate: 'D04', status: 'GATE CHG' } },
    { id: 'r8', values: { time: '11:00', dest: 'COPENHAGEN', flight: 'SK 506', gate: 'B05', status: 'ON TIME' } },
    { id: 'r9', values: { time: '11:15', dest: 'BARCELONA', flight: 'VY 901', gate: 'A14', status: 'CANCELLED' } },
    { id: 'r10', values: { time: '11:30', dest: 'VIENNA', flight: 'OS 234', gate: 'C11', status: 'ON TIME' } },
    { id: 'r11', values: { time: '11:45', dest: 'OSLO OSL', flight: 'SK 818', gate: 'B03', status: 'BOARDING' } },
    { id: 'r12', values: { time: '12:00', dest: 'BRUSSELS', flight: 'SN 555', gate: 'D02', status: 'ON TIME' } },
  ],
  theme: 'solari',
  customTheme: null,
  cascadeStaggerMs: 25,
  flapMs: 60,
};

export const STATUS_CYCLE = [
  'ON TIME',
  'BOARDING',
  'DELAYED',
  'GATE CHG',
  'DEPARTED',
  'CANCELLED',
];
