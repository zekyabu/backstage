# @backstage/create-app

## 1.0.0

### Patch Changes

- b03fba0dc: Adds "yarn dev" command to simplify local development.

  To add the command to an existing application, first add it to the `scripts`
  section of your monorepo root `package.json` like so:

  ```diff
   "scripts": {
  +    "dev": "concurrently \"yarn start\" \"yarn start-backend\"",
       "start": "yarn workspace app start",
       "start-backend": "yarn workspace backend start",
  ```

  And then add the `concurrently` package to your monorepo, like so:

  ```sh
  yarn add concurrently@6.0.0 --dev -W
  ```

  Notes:

  - This needs to be done to the monorepo root, not your frontend or backend package.
  - The `--dev -W` will add it only to `devDependencies`, and force it to the monorepo main root.

  You can then run `yarn dev` which will start both the Backstage frontend and backend in a single window.

- Updated dependencies [13fb84244]
- Updated dependencies [4f3d0dce0]
- Updated dependencies [d7245b733]
- Updated dependencies [393b623ae]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [c532c1682]
- Updated dependencies [761698831]
- Updated dependencies [aa095e469]
- Updated dependencies [761698831]
- Updated dependencies [9f7dc10fb]
- Updated dependencies [eabe89d38]
- Updated dependencies [93c62c755]
- Updated dependencies [2089de76b]
- Updated dependencies [c9b5c1eca]
- Updated dependencies [dc1fc92c8]
- Updated dependencies [2089de76b]
- Updated dependencies [868e4cdf2]
- Updated dependencies [02d78290a]
- Updated dependencies [a501128db]
- Updated dependencies [ca4a904f6]
- Updated dependencies [5f1b7ea35]
- Updated dependencies [5ab5864f6]
- Updated dependencies [4202807bb]
  - @backstage/plugin-github-actions@0.4.0
  - @backstage/plugin-catalog@0.4.2
  - @backstage/backend-common@0.5.6
  - @backstage/plugin-app-backend@0.3.9
  - @backstage/plugin-scaffolder-backend@0.9.1
  - @backstage/catalog-model@0.7.4
  - @backstage/catalog-client@0.3.7
  - @backstage/plugin-catalog-backend@0.6.5
  - @backstage/plugin-techdocs-backend@0.6.4
  - @backstage/plugin-techdocs@0.6.1
  - @backstage/plugin-auth-backend@0.3.4
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4
  - @backstage/plugin-explore@0.3.1
  - @backstage/plugin-scaffolder@0.7.1
  - @backstage/cli@0.6.4

## 0.3.12

### Patch Changes

- f71589800: The api-docs plugin has been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page.

  If you want to have a button that links to the scaffolder plugin from the API explorer, apply the following changes to `packages/app/src/App.tsx`:

  ```diff
  + import { apiDocsPlugin } from '@backstage/plugin-api-docs';
    import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

    const app = createApp({
      // ...
      bindRoutes({ bind }) {
  +     bind(apiDocsPlugin.externalRoutes, {
  +       createComponent: scaffolderPlugin.routes.root,
  +     });
      },
    });
  ```

  If you choose to not bind the routes, the button to create new APIs is not displayed.

- 7a1b2ba0e: Migrated away from using deprecated routes and router components at top-level in the app, and instead use routable extension pages.

  To apply this change to an existing app, make the following changes to `packages/app/src/App.tsx`:

  Update imports and remove the usage of the deprecated `app.getRoutes()`.

  ```diff
  -import { Router as DocsRouter } from '@backstage/plugin-techdocs';
  +import { TechdocsPage } from '@backstage/plugin-techdocs';
   import { CatalogImportPage } from '@backstage/plugin-catalog-import';
  -import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';
  -import { SearchPage as SearchRouter } from '@backstage/plugin-search';
  -import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
  +import { TechRadarPage } from '@backstage/plugin-tech-radar';
  +import { SearchPage } from '@backstage/plugin-search';
  +import { UserSettingsPage } from '@backstage/plugin-user-settings';
  +import { ApiExplorerPage } from '@backstage/plugin-api-docs';
   import { EntityPage } from './components/catalog/EntityPage';
   import { scaffolderPlugin, ScaffolderPage } from '@backstage/plugin-scaffolder';
  ```

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
-const deprecatedAppRoutes = app.getRoutes();

````

As well as update or add the following routes:

```diff
   <Route path="/create" element={<ScaffolderPage />} />
-  <Route path="/docs" element={<DocsRouter />} />
+  <Route path="/docs" element={<TechdocsPage />} />
+  <Route path="/api-docs" element={<ApiExplorerPage />} />
   <Route
     path="/tech-radar"
-    element={<TechRadarRouter width={1500} height={800} />}
+    element={<TechRadarPage width={1500} height={800} />}
   />
   <Route path="/catalog-import" element={<CatalogImportPage />} />
-  <Route
-    path="/search"
-    element={<SearchRouter/>}
-  />
-  <Route path="/settings" element={<SettingsRouter />} />
-  {deprecatedAppRoutes}
+  <Route path="/search" element={<SearchPage />} />
+  <Route path="/settings" element={<UserSettingsPage />} />
````

If you have added additional plugins with registered routes or are using `Router` components from other plugins, these should be migrated to use the `*Page` components as well. See [this commit](https://github.com/backstage/backstage/commit/abd655e42d4ed416b70848ffdb1c4b99d189f13b) for more examples of how to migrate.

For more information and the background to this change, see the [composability system migration docs](https://backstage.io/docs/plugins/composability).

- 415a3a42d: Updated the default `App` test to work better on Windows.

  To apply this change to an existing app, replace the `process.env.APP_CONFIG` definition in `packages/app/src/App.test.tsx` with the following:

  ```ts
  process.env = {
    NODE_ENV: 'test',
    APP_CONFIG: [
      {
        data: {
          app: { title: 'Test' },
          backend: { baseUrl: 'http://localhost:7000' },
          techdocs: {
            storageUrl: 'http://localhost:7000/api/techdocs/static/docs',
          },
        },
        context: 'test',
      },
    ] as any,
  };
  ```

- Updated dependencies [b2a5320a4]
- Updated dependencies [12d8f27a6]
- Updated dependencies [507513fed]
- Updated dependencies [52b5bc3e2]
- Updated dependencies [ecdd407b1]
- Updated dependencies [32a003973]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [1987c9341]
- Updated dependencies [f31b76b44]
- Updated dependencies [15eee03bc]
- Updated dependencies [f43192207]
- Updated dependencies [cfc83cac1]
- Updated dependencies [8adb48df4]
- Updated dependencies [bc327dc42]
- Updated dependencies [2386de1d3]
- Updated dependencies [9ce68b677]
- Updated dependencies [10362e9eb]
- Updated dependencies [e37d2de99]
- Updated dependencies [813c6a4f2]
- Updated dependencies [11c6208fe]
- Updated dependencies [8106c9528]
- Updated dependencies [05183f202]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [f71589800]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [d4f0a1406]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [d0ed25196]
- Updated dependencies [4c049a1a1]
- Updated dependencies [96ccc8f69]
- Updated dependencies [3af994c81]
- Updated dependencies [b33e553b2]
- Updated dependencies [04667f571]
- Updated dependencies [b93538acc]
- Updated dependencies [8871e7523]
- Updated dependencies [dbea11072]
  - @backstage/plugin-circleci@0.2.11
  - @backstage/plugin-github-actions@0.3.5
  - @backstage/plugin-scaffolder@0.7.0
  - @backstage/plugin-scaffolder-backend@0.9.0
  - @backstage/cli@0.6.3
  - @backstage/plugin-techdocs-backend@0.6.3
  - @backstage/plugin-catalog-backend@0.6.4
  - @backstage/plugin-api-docs@0.4.8
  - @backstage/plugin-catalog@0.4.1
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5
  - @backstage/plugin-proxy-backend@0.2.5
  - @backstage/plugin-auth-backend@0.3.3
  - @backstage/plugin-explore@0.3.0
  - @backstage/plugin-techdocs@0.6.0
  - @backstage/plugin-catalog-import@0.4.3
  - @backstage/core@0.7.0
  - @backstage/plugin-lighthouse@0.2.13
  - @backstage/plugin-search@0.3.3
  - @backstage/plugin-tech-radar@0.3.7
  - @backstage/plugin-user-settings@0.2.7

## 0.3.11

### Patch Changes

- 4594f7efc: Add the google analytics scripts in the `index.html` template for new applications.

  To apply this change to an existing application, change the following in `packages\app\public\index.html`:

  ```diff
      <title><%= app.title %></title>

  +    <% if (app.googleAnalyticsTrackingId && typeof app.googleAnalyticsTrackingId
  +    === 'string') { %>
  +    <script
  +      async
  +      src="https://www.googletagmanager.com/gtag/js?id=<%= app.googleAnalyticsTrackingId %>"
  +    ></script>
  +    <script>
  +      window.dataLayer = window.dataLayer || [];
  +      function gtag() {
  +        dataLayer.push(arguments);
  +      }
  +      gtag('js', new Date());
  +
  +      gtag('config', '<%= app.googleAnalyticsTrackingId %>');
  +    </script>
  +    <% } %>
    </head>
  ```

- 08fa2176a: **BREAKING CHANGE**

  The Scaffolder and Catalog plugins have been migrated to partially require use of the [new composability API](https://backstage.io/docs/plugins/composability). The Scaffolder used to register its pages using the deprecated route registration plugin API, but those registrations have been removed. This means you now need to add the Scaffolder plugin page to the app directly.

  The Catalog plugin has also been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page. This means you need to migrate the catalog plugin to use the new extension components, as well as bind the external route.

  Apply the following changes to `packages/app/src/App.tsx`:

  ```diff
  -import { Router as CatalogRouter } from '@backstage/plugin-catalog';
  +import {
  +  catalogPlugin,
  +  CatalogIndexPage,
  +  CatalogEntityPage,
  +} from '@backstage/plugin-catalog';
  +import { scaffolderPlugin, ScaffolderPage } from '@backstage/plugin-scaffolder';

  # The following addition to the app config allows the catalog plugin to link to the
  # component creation page, i.e. the scaffolder. You can chose a different target if you want to.
   const app = createApp({
     apis,
     plugins: Object.values(plugins),
  +  bindRoutes({ bind }) {
  +    bind(catalogPlugin.externalRoutes, {
  +      createComponent: scaffolderPlugin.routes.root,
  +    });
  +  }
   });

  # Apply these changes within FlatRoutes. It is important to have migrated to using FlatRoutes
  # for this to work, if you haven't done that yet, see the previous entries in this changelog.
  -  <Route
  -    path="/catalog"
  -    element={<CatalogRouter EntityPage={EntityPage} />}
  -  />
  +  <Route path="/catalog" element={<CatalogIndexPage />} />
  +  <Route
  +    path="/catalog/:namespace/:kind/:name"
  +    element={<CatalogEntityPage />}
  +  >
  +    <EntityPage />
  +  </Route>
     <Route path="/docs" element={<DocsRouter />} />
  +  <Route path="/create" element={<ScaffolderPage />} />
  ```

  The scaffolder has been redesigned to be horizontally scalable and to persistently store task state and execution logs in the database. Component registration has moved from the frontend into a separate registration step executed by the `TaskWorker`. This requires that a `CatalogClient` is passed to the scaffolder backend instead of the old `CatalogEntityClient`.

  The default catalog client comes from the `@backstage/catalog-client`, which you need to add as a dependency in `packages/backend/package.json`.

  Once the dependency has been added, apply the following changes to`packages/backend/src/plugins/scaffolder.ts`:

  ```diff
   import {
     CookieCutter,
     createRouter,
     Preparers,
     Publishers,
     CreateReactAppTemplater,
     Templaters,
  -  CatalogEntityClient,
   } from '@backstage/plugin-scaffolder-backend';
  +import { CatalogClient } from '@backstage/catalog-client';

   const discovery = SingleHostDiscovery.fromConfig(config);
  -const entityClient = new CatalogEntityClient({ discovery });
  +const catalogClient = new CatalogClient({ discoveryApi: discovery })

   return await createRouter({
     preparers,
     templaters,
     publishers,
     logger,
     config,
     dockerClient,
  -  entityClient,
     database,
  +  catalogClient,
   });
  ```

  See the `@backstage/scaffolder-backend` changelog for more information about this change.

- Updated dependencies [ec504e7b4]
- Updated dependencies [3a58084b6]
- Updated dependencies [a5f42cf66]
- Updated dependencies [e488f0502]
- Updated dependencies [e799e74d4]
- Updated dependencies [dc12852c9]
- Updated dependencies [a5f42cf66]
- Updated dependencies [a8953a9c9]
- Updated dependencies [f37992797]
- Updated dependencies [347137ccf]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [d6593abe6]
- Updated dependencies [bad21a085]
- Updated dependencies [e8e35fb5f]
- Updated dependencies [9615e68fb]
- Updated dependencies [e780e119c]
- Updated dependencies [437bac549]
- Updated dependencies [9f2b3a26e]
- Updated dependencies [49f9b7346]
- Updated dependencies [1c06cb312]
- Updated dependencies [968b588f7]
- Updated dependencies [3a58084b6]
- Updated dependencies [2499f6cde]
- Updated dependencies [5469a9761]
- Updated dependencies [a1f5e6545]
- Updated dependencies [60d1bc3e7]
- Updated dependencies [2c1f2a7c2]
- Updated dependencies [6266ddd11]
  - @backstage/plugin-auth-backend@0.3.2
  - @backstage/core@0.6.3
  - @backstage/plugin-scaffolder@0.6.0
  - @backstage/plugin-scaffolder-backend@0.8.0
  - @backstage/test-utils@0.1.8
  - @backstage/plugin-catalog@0.4.0
  - @backstage/plugin-catalog-import@0.4.2
  - @backstage/plugin-techdocs@0.5.8
  - @backstage/plugin-techdocs-backend@0.6.2
  - @backstage/plugin-explore@0.2.7
  - @backstage/plugin-api-docs@0.4.7
  - @backstage/catalog-model@0.7.2
  - @backstage/cli@0.6.2
  - @backstage/plugin-tech-radar@0.3.6
  - @backstage/plugin-app-backend@0.3.8
  - @backstage/plugin-catalog-backend@0.6.3
  - @backstage/config@0.1.3
  - @backstage/plugin-circleci@0.2.10
  - @backstage/plugin-github-actions@0.3.4
  - @backstage/plugin-lighthouse@0.2.12
  - @backstage/plugin-search@0.3.2

## 0.3.10

### Patch Changes

- d50e9b81e: Updated docker build to use `backstage-cli backend:bundle` instead of `backstage-cli backend:build-image`.

  To apply this change to an existing application, change the following in `packages/backend/package.json`:

  ```diff
  -  "build": "backstage-cli backend:build",
  -  "build-image": "backstage-cli backend:build-image --build --tag backstage",
  +  "build": "backstage-cli backend:bundle",
  +  "build-image": "docker build ../.. -f Dockerfile --tag backstage",
  ```

  Note that the backend build is switched to `backend:bundle`, and the `build-image` script simply calls `docker build`. This means the `build-image` script no longer builds all packages, so you have to run `yarn build` in the root first.

  In order to work with the new build method, the `Dockerfile` at `packages/backend/Dockerfile` has been updated with the following contents:

  ```dockerfile
  # This dockerfile builds an image for the backend package.
  # It should be executed with the root of the repo as docker context.
  #
  # Before building this image, be sure to have run the following commands in the repo root:
  #
  # yarn install
  # yarn tsc
  # yarn build
  #
  # Once the commands have been run, you can build the image using `yarn build-image`

  FROM node:14-buster-slim

  WORKDIR /app

  # Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
  # The skeleton contains the package.json of each package in the monorepo,
  # and along with yarn.lock and the root package.json, that's enough to run yarn install.
  ADD yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./

  RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

  # Then copy the rest of the backend bundle, along with any other files we might want.
  ADD packages/backend/dist/bundle.tar.gz app-config.yaml ./

  CMD ["node", "packages/backend", "--config", "app-config.yaml"]
  ```

  Note that the base image has been switched from `node:14-buster` to `node:14-buster-slim`, significantly reducing the image size. This is enabled by the removal of the `nodegit` dependency, so if you are still using this in your project you will have to stick with the `node:14-buster` base image.

  A `.dockerignore` file has been added to the root of the repo as well, in order to keep the docker context upload small. It lives in the root of the repo with the following contents:

  ```gitignore
  .git
  node_modules
  packages
  !packages/backend/dist
  plugins
  ```

- 532bc0ec0: Upgrading to lerna@4.0.0.
- Updated dependencies [16fb1d03a]
- Updated dependencies [92f01d75c]
- Updated dependencies [6c4a76c59]
- Updated dependencies [32a950409]
- Updated dependencies [491f3a0ec]
- Updated dependencies [f10950bd2]
- Updated dependencies [914c89b13]
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [257a753ff]
- Updated dependencies [d872f662d]
- Updated dependencies [edbc27bfd]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
- Updated dependencies [9337f509d]
- Updated dependencies [0ada34a0f]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [d9687c524]
- Updated dependencies [53b69236d]
- Updated dependencies [29c8bcc53]
- Updated dependencies [3600ac3b0]
- Updated dependencies [07e226872]
- Updated dependencies [b0a41c707]
- Updated dependencies [f62e7abe5]
- Updated dependencies [a341a8716]
- Updated dependencies [96f378d10]
- Updated dependencies [532bc0ec0]
- Updated dependencies [688b73110]
  - @backstage/backend-common@0.5.4
  - @backstage/plugin-auth-backend@0.3.1
  - @backstage/plugin-scaffolder@0.5.1
  - @backstage/plugin-catalog@0.3.2
  - @backstage/core@0.6.2
  - @backstage/cli@0.6.1
  - @backstage/plugin-user-settings@0.2.6
  - @backstage/plugin-scaffolder-backend@0.7.1
  - @backstage/plugin-api-docs@0.4.6
  - @backstage/plugin-catalog-import@0.4.1
  - @backstage/plugin-github-actions@0.3.3
  - @backstage/plugin-lighthouse@0.2.11
  - @backstage/plugin-techdocs-backend@0.6.1
  - @backstage/plugin-catalog-backend@0.6.2
  - @backstage/plugin-circleci@0.2.9
  - @backstage/plugin-explore@0.2.6
  - @backstage/plugin-search@0.3.1
  - @backstage/plugin-techdocs@0.5.7

## 0.3.9

### Patch Changes

- 615103a63: Pass on plugin database management instance that is now required by the scaffolder plugin.

  To apply this change to an existing application, add the following to `src/plugins/scaffolder.ts`:

  ```diff
  export default async function createPlugin({
    logger,
    config,
  +  database,
  }: PluginEnvironment) {

  // ...omitted...

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
      dockerClient,
      entityClient,
  +    database,
    });
  }
  ```

- 30e200d12: `@backstage/plugin-catalog-import` has been refactored, so the `App.tsx` of the backstage apps need to be updated:

  ```diff
  // packages/app/src/App.tsx

       <Route
         path="/catalog-import"
  -      element={<CatalogImportPage catalogRouteRef={catalogRouteRef} />}
  +      element={<CatalogImportPage />}
       />
  ```

- f4b576d0e: TechDocs: Add comments about migrating away from basic setup in app-config.yaml
- Updated dependencies [753bb4c40]
- Updated dependencies [1deb31141]
- Updated dependencies [6ed2b47d6]
- Updated dependencies [77ad0003a]
- Updated dependencies [6b26c9f41]
- Updated dependencies [b3f0c3811]
- Updated dependencies [d2441aee3]
- Updated dependencies [727f0deec]
- Updated dependencies [fb53eb7cb]
- Updated dependencies [07bafa248]
- Updated dependencies [ca559171b]
- Updated dependencies [ffffea8e6]
- Updated dependencies [f5e564cd6]
- Updated dependencies [f3fbfb452]
- Updated dependencies [615103a63]
- Updated dependencies [68dd79d83]
- Updated dependencies [84364b35c]
- Updated dependencies [41af18227]
- Updated dependencies [82b2c11b6]
- Updated dependencies [1df75733e]
- Updated dependencies [965e200c6]
- Updated dependencies [b51ee6ece]
- Updated dependencies [e5da858d7]
- Updated dependencies [9230d07e7]
- Updated dependencies [f5f45744e]
- Updated dependencies [0fe8ff5be]
- Updated dependencies [5a5163519]
- Updated dependencies [82b2c11b6]
- Updated dependencies [8f3443427]
- Updated dependencies [08142b256]
- Updated dependencies [08142b256]
- Updated dependencies [b51ee6ece]
- Updated dependencies [804502a5c]
  - @backstage/plugin-catalog-import@0.4.0
  - @backstage/plugin-auth-backend@0.3.0
  - @backstage/plugin-catalog@0.3.1
  - @backstage/plugin-scaffolder@0.5.0
  - @backstage/plugin-scaffolder-backend@0.7.0
  - @backstage/plugin-catalog-backend@0.6.1
  - @backstage/plugin-circleci@0.2.8
  - @backstage/plugin-search@0.3.0
  - @backstage/plugin-app-backend@0.3.7
  - @backstage/backend-common@0.5.3
  - @backstage/plugin-api-docs@0.4.5
  - @backstage/plugin-lighthouse@0.2.10
  - @backstage/plugin-techdocs@0.5.6
  - @backstage/test-utils@0.1.7
  - @backstage/plugin-github-actions@0.3.2
  - @backstage/plugin-explore@0.2.5
  - @backstage/plugin-techdocs-backend@0.6.0
  - @backstage/core@0.6.1
  - @backstage/plugin-tech-radar@0.3.5

## 0.3.8

### Patch Changes

- 019fe39a0: **BREAKING CHANGE**: The `useEntity` hook has been moved from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
  To apply this change to an existing app, add `@backstage/plugin-catalog-react` to your dependencies in `packages/app/package.json`, and update
  the import inside `packages/app/src/components/catalog/EntityPage.tsx` as well as any other places you were using `useEntity` or any other functions that were moved to `@backstage/plugin-catalog-react`.
- 436ca3f62: Remove techdocs.requestUrl and techdocs.storageUrl from app-config.yaml
- Updated dependencies [ceef4dd89]
- Updated dependencies [720149854]
- Updated dependencies [c777df180]
- Updated dependencies [398e1f83e]
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [b712841d6]
- Updated dependencies [a5628df40]
- Updated dependencies [2430ee7c2]
- Updated dependencies [3149bfe63]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [bc5082a00]
- Updated dependencies [6e612ce25]
- Updated dependencies [e44925723]
- Updated dependencies [b37501a3d]
- Updated dependencies [a26668913]
- Updated dependencies [025e122c3]
- Updated dependencies [e9aab60c7]
- Updated dependencies [21e624ba9]
- Updated dependencies [19fe61c27]
- Updated dependencies [e9aab60c7]
- Updated dependencies [da9f53c60]
- Updated dependencies [a08c4b0b0]
- Updated dependencies [24e47ef1e]
- Updated dependencies [bc5082a00]
- Updated dependencies [b37501a3d]
- Updated dependencies [90c8f20b9]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [529d16d27]
- Updated dependencies [54c7d02f7]
- Updated dependencies [de98c32ed]
- Updated dependencies [806929fe2]
- Updated dependencies [019fe39a0]
- Updated dependencies [cdea0baf1]
- Updated dependencies [019fe39a0]
- Updated dependencies [11cb5ef94]
  - @backstage/plugin-catalog-import@0.3.7
  - @backstage/plugin-scaffolder@0.4.2
  - @backstage/plugin-techdocs-backend@0.5.5
  - @backstage/cli@0.6.0
  - @backstage/core@0.6.0
  - @backstage/plugin-api-docs@0.4.4
  - @backstage/plugin-catalog@0.3.0
  - @backstage/theme@0.2.3
  - @backstage/plugin-lighthouse@0.2.9
  - @backstage/backend-common@0.5.2
  - @backstage/plugin-catalog-backend@0.6.0
  - @backstage/plugin-techdocs@0.5.5
  - @backstage/plugin-user-settings@0.2.5
  - @backstage/catalog-model@0.7.1
  - @backstage/plugin-scaffolder-backend@0.6.0
  - @backstage/plugin-app-backend@0.3.6
  - @backstage/plugin-tech-radar@0.3.4
  - @backstage/plugin-explore@0.2.4
  - @backstage/plugin-circleci@0.2.7
  - @backstage/plugin-github-actions@0.3.1
  - @backstage/plugin-search@0.2.7
  - @backstage/test-utils@0.1.6
  - @backstage/plugin-auth-backend@0.2.12
  - @backstage/plugin-proxy-backend@0.2.4
  - @backstage/plugin-rollbar-backend@0.1.7

## 0.3.7

### Patch Changes

- Updated dependencies [26a3a6cf0]
- Updated dependencies [12a56cdfe]
- Updated dependencies [664dd08c9]
- Updated dependencies [9dd057662]
- Updated dependencies [ef7957be4]
- Updated dependencies [0b1182346]
- Updated dependencies [d7b1d317f]
- Updated dependencies [a91aa6bf2]
- Updated dependencies [39b05b9ae]
- Updated dependencies [4eaa06057]
  - @backstage/backend-common@0.5.1
  - @backstage/plugin-scaffolder-backend@0.5.2
  - @backstage/cli@0.5.0
  - @backstage/plugin-catalog@0.2.14
  - @backstage/plugin-catalog-backend@0.5.5
  - @backstage/plugin-catalog-import@0.3.6
  - @backstage/plugin-scaffolder@0.4.1
  - @backstage/plugin-auth-backend@0.2.12
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/test-utils@0.1.6
  - @backstage/theme@0.2.2
  - @backstage/plugin-api-docs@0.4.3
  - @backstage/plugin-app-backend@0.3.5
  - @backstage/plugin-circleci@0.2.6
  - @backstage/plugin-explore@0.2.3
  - @backstage/plugin-github-actions@0.3.0
  - @backstage/plugin-lighthouse@0.2.8
  - @backstage/plugin-proxy-backend@0.2.4
  - @backstage/plugin-rollbar-backend@0.1.7
  - @backstage/plugin-search@0.2.6
  - @backstage/plugin-tech-radar@0.3.3
  - @backstage/plugin-techdocs@0.5.4
  - @backstage/plugin-techdocs-backend@0.5.4
  - @backstage/plugin-user-settings@0.2.4

## 0.3.6

### Patch Changes

- d3947caf3: Fix accidental dependency on non-existent dependencies.
- Updated dependencies [a4e636c8f]
- Updated dependencies [099c5cf4f]
- Updated dependencies [0ea002378]
- Updated dependencies [a08db734c]
  - @backstage/plugin-catalog@0.2.13
  - @backstage/plugin-scaffolder-backend@0.5.1

## 0.3.6

### Minor Changes

- ed6baab66: - Deprecating the `scaffolder.${provider}.token` auth duplication and favoring `integrations.${provider}` instead. If you receive deprecation warnings your config should change like the following:

  ```yaml
  scaffolder:
    github:
      token:
        $env: GITHUB_TOKEN
      visibility: public
  ```

  To something that looks like this:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
  scaffolder:
    github:
      visibility: public
  ```

  You can also configure multiple different hosts under the `integration` config like the following:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
      - host: ghe.mycompany.com
        token:
          $env: GITHUB_ENTERPRISE_TOKEN
  ```

  This of course is the case for all the providers respectively.

  - Adding support for cross provider scaffolding, you can now create repositories in for example Bitbucket using a template residing in GitHub.

  - Fix GitLab scaffolding so that it returns a `catalogInfoUrl` which automatically imports the project into the catalog.

  - The `Store Path` field on the `scaffolder` frontend has now changed so that you require the full URL to the desired destination repository.

  `backstage/new-repository` would become `https://github.com/backstage/new-repository` if provider was GitHub for example.

### Patch Changes

- a284f5bc1: Due to a package name change from `@kyma-project/asyncapi-react` to
  `@asyncapi/react-component` the jest configuration in the root `package.json`
  has to be updated:

  ```diff
     "jest": {
       "transformModules": [
  -      "@kyma-project/asyncapi-react
  +      "@asyncapi/react-component"
       ]
     }
  ```

- 89278acab: Migrate to using `FlatRoutes` from `@backstage/core` for the root app routes.

  This is the first step in migrating applications as mentioned here: https://backstage.io/docs/plugins/composability#porting-existing-apps.

  To apply this change to an existing app, switch out the `Routes` component from `react-router` to `FlatRoutes` from `@backstage/core`.
  This also allows you to remove any `/*` suffixes on the route paths. For example:

  ```diff
  import {
     OAuthRequestDialog,
     SidebarPage,
     createRouteRef,
  +  FlatRoutes,
   } from '@backstage/core';
   import { AppSidebar } from './sidebar';
  -import { Route, Routes, Navigate } from 'react-router';
  +import { Route, Navigate } from 'react-router';
   import { Router as CatalogRouter } from '@backstage/plugin-catalog';
  ...
           <AppSidebar />
  -        <Routes>
  +        <FlatRoutes>
  ...
             <Route
  -            path="/catalog/*"
  +            path="/catalog"
               element={<CatalogRouter EntityPage={EntityPage} />}
             />
  -          <Route path="/docs/*" element={<DocsRouter />} />
  +          <Route path="/docs" element={<DocsRouter />} />
  ...
             <Route path="/settings" element={<SettingsRouter />} />
  -        </Routes>
  +        </FlatRoutes>
         </SidebarPage>
  ```

- 26d3b24f3: fix routing and config for user-settings plugin

  To make the corresponding change in your local app, add the following in your App.tsx

  ```
  import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
  ...
  <Route path="/settings" element={<SettingsRouter />} />
  ```

  and the following to your plugins.ts:

  ```
  export { plugin as UserSettings } from '@backstage/plugin-user-settings';
  ```

- 92dbbcedd: Add `*-credentials.yaml` to gitignore to prevent accidental commits of sensitive credential information.

  To apply this change to an existing installation, add these lines to your `.gitignore`

  ```gitignore
  # Sensitive credentials
  *-credentials.yaml
  ```

- d176671d1: use `fromConfig` for all scaffolder helpers, and use the url protocol for app-config location entries.

  To apply this change to your local installation, replace the contents of your `packages/backend/src/plugins/scaffolder.ts` with the following contents:

  ```ts
  import {
    CookieCutter,
    createRouter,
    Preparers,
    Publishers,
    CreateReactAppTemplater,
    Templaters,
    CatalogEntityClient,
  } from '@backstage/plugin-scaffolder-backend';
  import { SingleHostDiscovery } from '@backstage/backend-common';
  import type { PluginEnvironment } from '../types';
  import Docker from 'dockerode';

  export default async function createPlugin({
    logger,
    config,
  }: PluginEnvironment) {
    const cookiecutterTemplater = new CookieCutter();
    const craTemplater = new CreateReactAppTemplater();
    const templaters = new Templaters();
    templaters.register('cookiecutter', cookiecutterTemplater);
    templaters.register('cra', craTemplater);

    const preparers = await Preparers.fromConfig(config, { logger });
    const publishers = await Publishers.fromConfig(config, { logger });

    const dockerClient = new Docker();

    const discovery = SingleHostDiscovery.fromConfig(config);
    const entityClient = new CatalogEntityClient({ discovery });

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
      dockerClient,
      entityClient,
    });
  }
  ```

  This will ensure that the `scaffolder-backend` package can add handlers for the `url` protocol which is becoming the standard when registering entities in the `catalog`

- 9d1d1138e: Ensured that versions bumps of packages used in the app template trigger a release of this package when needed.
- db05f7a35: Remove the `@types/helmet` dev dependency from the app template. This
  dependency is now unused as the package `helmet` brings its own types.

  To update your existing app, simply remove the `@types/helmet` dependency from
  the `package.json` of your backend package.

- Updated dependencies [def2307f3]
- Updated dependencies [46bba09ea]
- Updated dependencies [efd6ef753]
- Updated dependencies [0b135e7e0]
- Updated dependencies [593632f07]
- Updated dependencies [2b514d532]
- Updated dependencies [318a6af9f]
- Updated dependencies [33846acfc]
- Updated dependencies [294a70cab]
- Updated dependencies [b604a9d41]
- Updated dependencies [ac7be581a]
- Updated dependencies [a187b8ad0]
- Updated dependencies [0ea032763]
- Updated dependencies [8855f61f6]
- Updated dependencies [5345a1f98]
- Updated dependencies [ed6baab66]
- Updated dependencies [ad838c02f]
- Updated dependencies [f04db53d7]
- Updated dependencies [a5e27d5c1]
- Updated dependencies [0643a3336]
- Updated dependencies [debf359b5]
- Updated dependencies [a2291d7cc]
- Updated dependencies [f9ba00a1c]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/plugin-catalog-backend@0.5.4
  - @backstage/plugin-github-actions@0.3.0
  - @backstage/core@0.5.0
  - @backstage/backend-common@0.5.0
  - @backstage/plugin-catalog@0.2.12
  - @backstage/plugin-catalog-import@0.3.5
  - @backstage/cli@0.4.7
  - @backstage/plugin-api-docs@0.4.3
  - @backstage/plugin-scaffolder@0.4.0
  - @backstage/plugin-scaffolder-backend@0.5.0
  - @backstage/plugin-techdocs@0.5.4
  - @backstage/plugin-techdocs-backend@0.5.4
  - @backstage/plugin-auth-backend@0.2.11
  - @backstage/plugin-lighthouse@0.2.8
  - @backstage/plugin-circleci@0.2.6
  - @backstage/plugin-search@0.2.6
  - @backstage/plugin-explore@0.2.3
  - @backstage/plugin-tech-radar@0.3.3
  - @backstage/plugin-user-settings@0.2.4
  - @backstage/plugin-app-backend@0.3.4
  - @backstage/plugin-proxy-backend@0.2.4
  - @backstage/plugin-rollbar-backend@0.1.7

## 0.3.5

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- cc068c0d6: Bump the gitbeaker dependencies to 28.x.

  To update your own installation, go through the `package.json` files of all of
  your packages, and ensure that all dependencies on `@gitbeaker/node` or
  `@gitbeaker/core` are at version `^28.0.2`. Then run `yarn install` at the root
  of your repo.

## 0.3.4

### Patch Changes

- 643dcec7c: noop release for create-app to force re-deploy

## 0.3.3

### Patch Changes

- bd9c6719f: Bumping the version for `create-app` so that we can use the latest versions of internal packages and rebuild the version which is passed to the package.json

## 0.3.2

### Patch Changes

- c2b52d9c5: Replace `register-component` plugin with new `catalog-import` plugin
- fc6839f13: Bump `sqlite3` to v5.

  To apply this change to an existing app, change the version of `sqlite3` in the `dependencies` of `packages/backend/package.json`:

  ```diff
       "pg": "^8.3.0",
  -    "sqlite3": "^4.2.0",
  +    "sqlite3": "^5.0.0",
       "winston": "^3.2.1"
  ```

  Note that the `sqlite3` dependency may not be preset if you chose to use PostgreSQL when creating the app.

- 8d68e4cdc: Removed the Circle CI sidebar item, since the target page does not exist.

  To apply this change to an existing app, remove `"CircleCI"` sidebar item from `packages/app/src/sidebar.tsx`, and the `BuildIcon` import if it is unused.

- 1773a5182: Removed lighthouse plugin from the default set up plugins, as it requires a separate Backend to function.

  To apply this change to an existing app, remove the following:

  1. The `lighthouse` block from `app-config.yaml`.
  2. The `@backstage/plugin-lighthouse` dependency from `packages/app/package.json`.
  3. The `@backstage/plugin-lighthouse` re-export from `packages/app/src/plugins.ts`.
  4. The Lighthouse sidebar item from `packages/app/src/sidebar.tsx`, and the `RuleIcon` import if it is unused.

## 0.3.1

### Patch Changes

- 4e0e3b1bf: Add missing `yarn clean` for app.

  For users with existing Backstage installations, add the following under the `scripts` section in `packages/app/package.json`, after the "lint" entry:

  ```json
  "clean": "backstage-cli clean",
  ```

  This will add the missing `yarn clean` for the generated frontend.

- 352a6581f: Added `"start-backend"` script to root `package.json`.

  To apply this change to an existing app, add the following script to the root `package.json`:

  ```json
  "start-backend": "yarn workspace backend start"
  ```

## 0.3.0

### Minor Changes

- 0101c7a16: Add search plugin to default template for CLI created apps

### Patch Changes

- a8573e53b: techdocs-backend: Simplified file, removing individual preparers and generators.
  techdocs-backend: UrlReader is now available to use in preparers.

  In your Backstage app, `packages/backend/plugins/techdocs.ts` file has now been simplified,
  to remove registering individual preparers and generators.

  Please update the file when upgrading the version of `@backstage/plugin-techdocs-backend` package.

  ```typescript
  const preparers = await Preparers.fromConfig(config, {
    logger,
    reader,
  });

  const generators = await Generators.fromConfig(config, {
    logger,
  });

  const publisher = await Publisher.fromConfig(config, {
    logger,
    discovery,
  });
  ```

  You should be able to remove unnecessary imports, and just do

  ```typescript
  import {
    createRouter,
    Preparers,
    Generators,
    Publisher,
  } from '@backstage/plugin-techdocs-backend';
  ```

## 0.2.5

### Patch Changes

- 2783ec018: In the techdocs-backend plugin (`packages/backend/src/plugins/techdocs.ts`), create a publisher using

  ```
    const publisher = Publisher.fromConfig(config, logger, discovery);
  ```

  instead of

  ```
    const publisher = new LocalPublish(logger, discovery);
  ```

  An instance of `publisher` can either be a local filesystem publisher or a Google Cloud Storage publisher.

  Read more about the configs here https://backstage.io/docs/features/techdocs/configuration
  (You will also have to update `techdocs.storage.type` to `local` or `googleGcs`. And `techdocs.builder` to either `local` or `external`.)

## 0.2.4

### Patch Changes

- 94348441e: Add `"files": ["dist"]` to both app and backend packages. This ensures that packaged versions of these packages do not contain unnecessary files.

  To apply this change to an existing app, add the following to `packages/app/package.json` and `packages/backend/package.json`:

  ```json
    "files": [
      "dist"
    ]
  ```

- cb5fc4b29: Adjust template to the latest changes in the `api-docs` plugin.

  ## Template Changes

  While updating to the latest `api-docs` plugin, the following changes are
  necessary for the `create-app` template in your
  `app/src/components/catalog/EntityPage.tsx`. This adds:

  - A custom entity page for API entities
  - Changes the API tab to include the new `ConsumedApisCard` and
    `ProvidedApisCard` that link to the API entity.

  ```diff
   import {
  +  ApiDefinitionCard,
  -  Router as ApiDocsRouter,
  +  ConsumedApisCard,
  +  ProvidedApisCard,
  +  ConsumedApisCard,
  +  ConsumingComponentsCard,
  +  ProvidedApisCard,
  +  ProvidingComponentsCard
   } from '@backstage/plugin-api-docs';

  ...

  +const ComponentApisContent = ({ entity }: { entity: Entity }) => (
  +  <Grid container spacing={3} alignItems="stretch">
  +    <Grid item md={6}>
  +      <ProvidedApisCard entity={entity} />
  +    </Grid>
  +    <Grid item md={6}>
  +      <ConsumedApisCard entity={entity} />
  +    </Grid>
  +  </Grid>
  +);

   const ServiceEntityPage = ({ entity }: { entity: Entity }) => (
     <EntityPageLayout>
       <EntityPageLayout.Content
        path="/"
        title="Overview"
        element={<OverviewContent entity={entity} />}
      />
      <EntityPageLayout.Content
        path="/ci-cd/*"
        title="CI/CD"
        element={<CICDSwitcher entity={entity} />}
      />
      <EntityPageLayout.Content
        path="/api/*"
        title="API"
  -     element={<ApiDocsRouter entity={entity} />}
  +     element={<ComponentApisContent entity={entity} />}
      />
  ...

  -export const EntityPage = () => {
  -  const { entity } = useEntity();
  -  switch (entity?.spec?.type) {
  -    case 'service':
  -      return <ServiceEntityPage entity={entity} />;
  -    case 'website':
  -      return <WebsiteEntityPage entity={entity} />;
  -    default:
  -      return <DefaultEntityPage entity={entity} />;
  -  }
  -};

  +export const ComponentEntityPage = ({ entity }: { entity: Entity }) => {
  +  switch (entity?.spec?.type) {
  +    case 'service':
  +      return <ServiceEntityPage entity={entity} />;
  +    case 'website':
  +      return <WebsiteEntityPage entity={entity} />;
  +    default:
  +      return <DefaultEntityPage entity={entity} />;
  +  }
  +};
  +
  +const ApiOverviewContent = ({ entity }: { entity: Entity }) => (
  +  <Grid container spacing={3}>
  +    <Grid item md={6}>
  +      <AboutCard entity={entity} />
  +    </Grid>
  +    <Grid container item md={12}>
  +      <Grid item md={6}>
  +        <ProvidingComponentsCard entity={entity} />
  +      </Grid>
  +      <Grid item md={6}>
  +        <ConsumingComponentsCard entity={entity} />
  +      </Grid>
  +    </Grid>
  +  </Grid>
  +);
  +
  +const ApiDefinitionContent = ({ entity }: { entity: ApiEntity }) => (
  +  <Grid container spacing={3}>
  +    <Grid item xs={12}>
  +      <ApiDefinitionCard apiEntity={entity} />
  +    </Grid>
  +  </Grid>
  +);
  +
  +const ApiEntityPage = ({ entity }: { entity: Entity }) => (
  +  <EntityPageLayout>
  +    <EntityPageLayout.Content
  +      path="/*"
  +      title="Overview"
  +      element={<ApiOverviewContent entity={entity} />}
  +    />
  +    <EntityPageLayout.Content
  +      path="/definition/*"
  +      title="Definition"
  +      element={<ApiDefinitionContent entity={entity as ApiEntity} />}
  +    />
  +  </EntityPageLayout>
  +);
  +
  +export const EntityPage = () => {
  +  const { entity } = useEntity();
  +
  +  switch (entity?.kind?.toLowerCase()) {
  +    case 'component':
  +      return <ComponentEntityPage entity={entity} />;
  +    case 'api':
  +      return <ApiEntityPage entity={entity} />;
  +    default:
  +      return <DefaultEntityPage entity={entity} />;
  +  }
  +};
  ```

- 1e22f8e0b: Unify `dockerode` library and type dependency versions

## 0.2.3

### Patch Changes

- 68fdc3a9f: Optimized the `yarn install` step in the backend `Dockerfile`.

  To apply these changes to an existing app, make the following changes to `packages/backend/Dockerfile`:

  Replace the `RUN yarn install ...` line with the following:

  ```bash
  RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"
  ```

- 4a655c89d: Removed `"resolutions"` entry for `esbuild` in the root `package.json` in order to use the version specified by `@backstage/cli`.

  To apply this change to an existing app, remove the following from your root `package.json`:

  ```json
  "resolutions": {
    "esbuild": "0.6.3"
  },
  ```

- ea475893d: Add [API docs plugin](https://github.com/backstage/backstage/tree/master/plugins/api-docs) to new apps being created through the CLI.

## 0.2.2

### Patch Changes

- 7d7abd50c: Add `app-backend` as a backend plugin, and make a single docker build of the backend the default way to deploy backstage.

  Note that the `app-backend` currently only is a solution for deployments of the app, it's not a dev server and is not intended for local development.

  ## Template changes

  As a part of installing the `app-backend` plugin, the below changes where made. The changes are grouped into two steps, installing the plugin, and updating the Docker build and configuration.

  ### Installing the `app-backend` plugin in the backend

  First, install the `@backstage/plugin-app-backend` plugin package in your backend. These changes where made for `v0.3.0` of the plugin, and the installation process might change in the future. Run the following from the root of the repo:

  ```bash
  cd packages/backend
  yarn add @backstage/plugin-app-backend
  ```

  For the `app-backend` to get access to the static content in the frontend we also need to add the local `app` package as a dependency. Add the following to your `"dependencies"` in `packages/backend/package.json`, assuming your app package is still named `app` and on version `0.0.0`:

  ```json
  "app": "0.0.0",
  ```

  Don't worry, this will not cause your entire frontend dependency tree to be added to the app, just double check that `packages/app/package.json` has a `"bundled": true` field at top-level. This signals to the backend build process that the package is bundled and that no transitive dependencies should be included.

  Next, create `packages/backend/src/plugins/app.ts` with the following:

  ```ts
  import { createRouter } from '@backstage/plugin-app-backend';
  import { PluginEnvironment } from '../types';

  export default async function createPlugin({
    logger,
    config,
  }: PluginEnvironment) {
    return await createRouter({
      logger,
      config,
      appPackageName: 'app',
    });
  }
  ```

  In `packages/backend/src/index.ts`, make the following changes:

  Add an import for the newly created plugin setup file:

  ```ts
  import app from './plugins/app';
  ```

  Setup the following plugin env.

  ```ts
  const appEnv = useHotMemoize(module, () => createEnv('app'));
  ```

  Change service builder setup to include the `app` plugin as follows. Note that the `app` plugin is not installed on the `/api` route with most other plugins.

  ```ts
  const service = createServiceBuilder(module)
    .loadConfig(config)
    .addRouter('/api', apiRouter)
    .addRouter('', await app(appEnv));
  ```

  You should now have the `app-backend` plugin installed in your backend, ready to serve the frontend bundle!

  ### Docker build setup

  Since the backend image is now the only one needed for a simple Backstage deployment, the image tag name in the `build-image` script inside `packages/backend/package.json` was changed to the following:

  ```json
  "build-image": "backstage-cli backend:build-image --build --tag backstage",
  ```

  For convenience, a `build-image` script was also added to the root `package.json` with the following:

  ```json
  "build-image": "yarn workspace backend build-image",
  ```

  In the root of the repo, a new `app-config.production.yaml` file was added. This is used to set the appropriate `app.baseUrl` now that the frontend is served directly by the backend in the production deployment. It has the following contents:

  ```yaml
  app:
    # Should be the same as backend.baseUrl when using the `app-backend` plugin
    baseUrl: http://localhost:7000

  backend:
    baseUrl: http://localhost:7000
    listen:
      port: 7000
  ```

  In order to load in the new configuration at runtime, the command in the `Dockerfile` at the repo root was changed to the following:

  ```dockerfile
  CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
  ```

## 0.2.1

### Patch Changes

- c56e28375: Fix missing api-docs plugin registration in app template

## 0.2.0

### Minor Changes

- 6d29605db: Change the default backend plugin mount point to /api
- 5249594c5: Add service discovery interface and implement for single host deployments

  Fixes #1847, #2596

  Went with an interface similar to the frontend DiscoveryApi, since it's dead simple but still provides a lot of flexibility in the implementation.

  Also ended up with two different methods, one for internal endpoint discovery and one for external. The two use-cases are explained a bit more in the docs, but basically it's service-to-service vs callback URLs.

  This did get me thinking about uniqueness and that we're heading towards a global namespace for backend plugin IDs. That's probably fine, but if we're happy with that we should leverage it a bit more to simplify the backend setup. For example we'd have each plugin provide its own ID and not manually mount on paths in the backend.

  Draft until we're happy with the implementation, then I can add more docs and changelog entry. Also didn't go on a thorough hunt for places where discovery can be used, but I don't think there are many since it's been pretty awkward to do service-to-service communication.

- 56e4eb589: Make CSP configurable to fix app-backend served app not being able to fetch

  See discussion [here on discord](https://discordapp.com/channels/687207715902193673/687235481154617364/758721460163575850)

- d7873e1aa: Default to using internal scope for new plugins
- 6f447b3fc: Remove identity-backend

  Not used, and we're heading down the route of identities in the catalog

- 61db1ddc6: Allow node v14 and add to master build matrix

  - Upgrade sqlite3@^5.0.0 in @backstage/plugin-catalog-backend
  - Add Node 14 to engines in @backstage/create-app

- a768a07fb: Add the ability to import users from GitHub Organization into the catalog.

  The token needs to have the scopes `user:email`, `read:user`, and `read:org`.

- f00ca3cb8: Auto-create plugin databases

  Relates to #1598.

  This creates databases for plugins before handing off control to plugins.

  The list of plugins currently need to be hard-coded depending on the installed plugins. A later PR will properly refactor the code to provide a factory pattern where plugins specify what they need, and Knex instances will be provided based on the input.

- 6d97d2d6f: The InfoCard variant `'height100'` is deprecated. Use variant `'gridItem'` instead.

  When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
  Set to the `'gridItem'` variant to display the InfoCard with full height suitable for Grid:
  `<InfoCard variant="gridItem">...</InfoCard>`

  Changed the InfoCards in '@backstage/plugin-github-actions', '@backstage/plugin-jenkins', '@backstage/plugin-lighthouse'
  to pass an optional variant to the corresponding card of the plugin.

  As a result the overview content of the EntityPage shows cards with full height suitable for Grid.

- 7aff112af: The default mount point for backend plugins have been changed to /api. These changes are done in the backend package itself, so it is recommended that you sync up existing backend packages with this new pattern.

### Patch Changes

- e67d49bf5: Sync scaffolded backend with example
- 961414d55: Remove discovery api override
- 440a17b39: Bump @backstage/catalog-backend and pass the now required UrlReader interface to the plugin
- 8c2b76e45: **BREAKING CHANGE**

  The existing loading of additional config files like `app-config.development.yaml` using APP_ENV or NODE_ENV has been removed.
  Instead, the CLI and backend process now accept one or more `--config` flags to load config files.

  Without passing any flags, `app-config.yaml` and, if it exists, `app-config.local.yaml` will be loaded.
  If passing any `--config <path>` flags, only those files will be loaded, **NOT** the default `app-config.yaml` one.

  The old behaviour of for example `APP_ENV=development` can be replicated using the following flags:

  ```bash
  --config ../../app-config.yaml --config ../../app-config.development.yaml
  ```

- 5a920c6e4: Updated naming of environment variables. New pattern [NAME]\_TOKEN for GitHub, GitLab, Azure & GitHub Enterprise access tokens.

  ### Detail:

  - Previously we have to export same token for both, catalog & scaffolder

  ```bash
  export GITHUB_ACCESS_TOKEN=foo
  export GITHUB_PRIVATE_TOKEN=foo
  ```

  with latest changes, only single export is sufficient.

  ```bash
  export GITHUB_TOKEN=foo
  export GITLAB_TOKEN=foo
  export GHE_TOKEN=foo
  export AZURE_TOKEN=foo
  ```

  ### list:

  <table>
    <tr>
      <th>Old name</th>
      <th>New name</th>
    </tr>
    <tr>
      <td>GITHUB_ACCESS_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITHUB_PRIVATE_TOKEN</td>
      <td>GITHUB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_ACCESS_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>GITLAB_PRIVATE_TOKEN</td>
      <td>GITLAB_TOKEN</td>
    </tr>
    <tr>
      <td>AZURE_PRIVATE_TOKEN</td>
      <td>AZURE_TOKEN</td>
    </tr>
    <tr>
      <td>GHE_PRIVATE_TOKEN</td>
      <td>GHE_TOKEN</td>
    </tr>
  </table>

- 67d76b419: Fix for configured templates using 'url' locations even though it's not supported yet
- 7bbeb049f: Change loadBackendConfig to return the config directly
