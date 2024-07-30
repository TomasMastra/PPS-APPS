import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'PPS.App2.Examen',
  appName: 'Tabla didactica',
  webDir: 'www',
  server: {
    androidScheme: 'https'

},
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    //launhAutoHide: true,
    backgroundColor: "#ffffffff",
    //androidSplashSourceName: "splash",
    //androidScaleType: "CENTER_TOP",
    showSpinner: false,
    androidSpinnerStyle: "small",
    iosSpinnerStyle: "small",
    spinnerColor: "#999999",
    splashFullScreen: true,
    splashImmersive: true,
  },
},
};
export default config;
