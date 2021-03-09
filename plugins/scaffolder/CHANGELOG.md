# @backstage/plugin-scaffolder

## 0.7.1

### Patch Changes

- 2089de76b: Make use of the new core `ItemCardGrid` and `ItemCardHeader` instead of the deprecated `ItemCard`.
- 4202807bb: Added a default type when is not defined in the schema to prevent id collision
- Updated dependencies [277644e09]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [905cbfc96]
- Updated dependencies [2089de76b]
- Updated dependencies [dc1fc92c8]
  - @backstage/integration@0.5.1
  - @backstage/catalog-model@0.7.4
  - @backstage/catalog-client@0.3.7
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4

## 0.7.0

### Minor Changes

- 8106c9528: The scaffolder has been updated to support the new `v1beta2` template schema which allows for custom template actions!

  See documentation for more information how to create and register new template actions.

  **Breaking changes**

  The backend scaffolder plugin now needs a `UrlReader` which can be pulled from the PluginEnvironment.

  The following change is required in `backend/src/plugins/scaffolder.ts`

  ```diff
   export default async function createPlugin({
     logger,
     config,
     database,
  +  reader,
   }: PluginEnvironment): Promise<Router> {

    // omitted code

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
      dockerClient,
      database,
      catalogClient,
  +   reader,
    });
  ```

### Patch Changes

- 12d8f27a6: Move logic for constructing the template form to the backend, using a new `./parameter-schema` endpoint that returns the form schema for a given template.
- bc327dc42: Tweak the template cards to be even more compliant with MUI examples, and a little bit more dense.
- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.6.0

### Minor Changes

- a5f42cf66: The Scaffolder and Catalog plugins have been migrated to partially require use of the [new composability API](https://backstage.io/docs/plugins/composability). The Scaffolder used to register its pages using the deprecated route registration plugin API, but those registrations have been removed. This means you now need to add the Scaffolder plugin page to the app directly.

  The page is imported from the Scaffolder plugin and added to the `<FlatRoutes>` component:

  ```tsx
  <Route path="/create" element={<ScaffolderPage />} />
  ```

  The Catalog plugin has also been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page. This means you need to migrate the catalog plugin to use the new extension components, as well as bind the external route.

  To use the new extension components, replace existing usage of the `CatalogRouter` with the following:

  ```tsx
  <Route path="/catalog" element={<CatalogIndexPage />} />
  <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
    <EntityPage />
  </Route>
  ```

  And to bind the external route from the catalog plugin to the scaffolder template index page, make sure you have the appropriate imports and add the following to the `createApp` call:

  ```ts
  import { catalogPlugin } from '@backstage/plugin-catalog';
  import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

  const app = createApp({
    // ...
    bindRoutes({ bind }) {
      bind(catalogPlugin.externalRoutes, {
        createComponent: scaffolderPlugin.routes.root,
      });
    },
  });
  ```

- d0760ecdf: Moved common useStarredEntities hook to plugin-catalog-react
- e8e35fb5f: Adding Search and Filter features to Scaffolder/Templates Grid

### Patch Changes

- a5f42cf66: # Stateless scaffolding

  The scaffolder has been redesigned to be horizontally scalable and to persistently store task state and execution logs in the database.

  Each scaffolder task is given a unique task ID which is persisted in the database.
  Tasks are then picked up by a `TaskWorker` which performs the scaffolding steps.
  Execution logs are also persisted in the database meaning you can now refresh the scaffolder task status page without losing information.

  The task status page is now dynamically created based on the step information stored in the database.
  This allows for custom steps to be displayed once the next version of the scaffolder template schema is available.

  The task page is updated to display links to both the git repository and to the newly created catalog entity.

  Component registration has moved from the frontend into a separate registration step executed by the `TaskWorker`. This requires that a `CatalogClient` is passed to the scaffolder backend instead of the old `CatalogEntityClient`.

  Make sure to update `plugins/scaffolder.ts`

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

  As well as adding the `@backstage/catalog-client` packages as a dependency of your backend package.

- e488f0502: Update messages that process during loading, error, and no templates found.
  Remove unused dependencies.
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [a1f5e6545]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.5.1

### Patch Changes

- 6c4a76c59: Make the `TemplateCard` conform to what material-ui recommends in their examples. This fixes the extra padding around the buttons.
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4

## 0.5.0

### Minor Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.

### Patch Changes

- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.4.2

### Patch Changes

- 720149854: Migrated to new composability API, exporting the plugin as `scaffolderPlugin`. The template list page (`/create`) is exported as the `TemplateIndexPage` extension, and the templating page itself is exported as `TemplatePage`.
- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.4.1

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- Updated dependencies [9dd057662]
- Updated dependencies [0b1182346]
  - @backstage/plugin-catalog@0.2.14

## 0.4.0

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

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [a187b8ad0]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-catalog@0.2.12

## 0.3.6

### Patch Changes

- 8e083f41f: Bug fix: User can retry creating a new component if an error occurs, without having to reload the page.
- 947d3c269: You can now maximize the logs into full-screen by clicking the button under each step of the job
- Updated dependencies [9c09a364f]
  - @backstage/plugin-catalog@0.2.10

## 0.3.5

### Patch Changes

- 19554f6d6: Added GitHub Actions for Create React App, and allow better imports of files inside a module when they're exposed using `files` in `package.json`
- Updated dependencies [1dc445e89]
- Updated dependencies [342270e4d]
  - @backstage/core@0.4.2
  - @backstage/plugin-catalog@0.2.8

## 0.3.4

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/plugin-catalog@0.2.7

## 0.3.3

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.3.2

### Patch Changes

- a9fd599f7: Add Analyze location endpoint to catalog backend. Add catalog-import plugin and replace import-component with it. To start using Analyze location endpoint, you have add it to the `createRouter` function options in the `\backstage\packages\backend\src\plugins\catalog.ts` file:

  ```ts
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    const {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
    } = await builder.build();

    return await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
      logger: env.logger,
    });
  }
  ```

- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5

## 0.3.1

### Patch Changes

- ef2831dde: Move constructing the catalog-info.yaml URL for scaffolded components to the publishers
- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-catalog@0.2.3

## 0.3.0

### Minor Changes

- 59166e5ec: `createRouter` of scaffolder backend will now require additional option as `entityClient` which could be generated by `CatalogEntityClient` in `plugin-scaffolder-backend` package. Here is example to generate `entityClient`.

  ```js
  import { CatalogEntityClient } from '@backstage/plugin-scaffolder-backend';
  import { SingleHostDiscovery } from '@backstage/backend-common';

  const discovery = SingleHostDiscovery.fromConfig(config);
  const entityClient = new CatalogEntityClient({ discovery });
  ```

  - Scaffolder's API `/v1/jobs` will accept `templateName` instead of `template` Entity.

### Patch Changes

- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
- Updated dependencies [2d0bd1be7]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-catalog@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- fb74f1db6: Make title meaningful after component creation

  Fixes #2458.

  After the change, the UX should look like this:

  ### If the component creation was successful:

  ![successfully-created-component](https://user-images.githubusercontent.com/33940798/94339294-8bd1e000-0016-11eb-885b-7936fcc23b63.gif)

  ### If the component creation failed:

  ![failed-to-create-component](https://user-images.githubusercontent.com/33940798/94339296-90969400-0016-11eb-9a74-ce16b3dd8d88.gif)

- c5ef12926: fix the accordion details design when job stage fail
- 1c8c43756: The new `scaffolder.github.baseUrl` config property allows to specify a custom base url for GitHub Enterprise instances
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [368fd8243]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [f0aa01bcc]
- Updated dependencies [0aecfded0]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [8b9c8196f]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [60d40892c]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [2ebcfac8d]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [0b956f21b]
- Updated dependencies [97c2cb19b]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/plugin-catalog@0.2.0
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
