// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backendUrls: {
    getNextAppImgIds: "/getNextAppImgIds",
    getAppImgById: "/getAppImgById"
  },
  backendPort: 1,
  supabaseUrl: "https://xshrxoynbpixtqabapnv.supabase.co",
  supbaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjMxMDE2NDA1LCJleHAiOjE5NDY1OTI0MDV9.hGqNzKGuLxRrr9ExUwwJeoA_yzVAnYUt_e9REWiJFzQ"
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
