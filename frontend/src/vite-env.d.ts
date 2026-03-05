/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Web Components JSX declarations
declare namespace JSX {
  interface IntrinsicElements {
    'wokwi-led': any;
    'wokwi-resistor': any;
    'wokwi-pushbutton': any;
    'wokwi-arduino-uno': any;
    'wokwi-arduino-mega': any;
    'wokwi-arduino-nano': any;
    'wokwi-pi-pico': any;
    'wokwi-esp32-devkit-v1': any;
    'wokwi-membrane-keypad': any;
    'wokwi-lcd1602': any;
    'wokwi-neopixel': any;
    'wokwi-servo': any;
    'wokwi-potentiometer': any;
    'wokwi-slide-switch': any;
    'wokwi-dht22': any;
    'wokwi-ds1307': any;
    'wokwi-hc-sr04': any;
    'wokwi-ir-receiver': any;
    'wokwi-pir-motion-sensor': any;
    'wokwi-photoresistor-sensor': any;
  }
}
