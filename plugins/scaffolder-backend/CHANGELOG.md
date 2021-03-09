# @backstage/plugin-scaffolder-backend

## 0.9.1

### Patch Changes

- d7245b733: Remove runDockerContainer, and start using the utility function provided by @backstage/backend-common
- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- c532c1682: Fixes task failures caused by undefined step input
- 761698831: Bump to the latest version of the Knex library.
- Updated dependencies [277644e09]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [905cbfc96]
- Updated dependencies [761698831]
  - @backstage/integration@0.5.1
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4
  - @backstage/catalog-client@0.3.7

## 0.9.0

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

- 96ccc8f69: Removed support for deprecated publisher auth configuration within the `scaffolder` configuration block, such as `scaffolder.github.token`. Access should instead be configured through `integrations` configuration.

  For example, replace the following configuration in `app-config.yaml`

  ```yaml
  scaffolder:
    github:
      token: my-token
  ```

  with

  ```yaml
  integrations:
    github:
      - host: github.com
        token: my-token
  ```

### Patch Changes

- 12d8f27a6: Move logic for constructing the template form to the backend, using a new `./parameter-schema` endpoint that returns the form schema for a given template.
- 12d8f27a6: Add version `backstage.io/v1beta2` schema for Template entities.
- f31b76b44: Consider both authentication methods for both `onprem` and `cloud` BitBucket
- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- d0ed25196: Fixed file path resolution for templates with a file location
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.8.0

### Minor Changes

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

### Patch Changes

- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.7.1

### Patch Changes

- edbc27bfd: Added githubApp authentication to the scaffolder-backend plugin
- fb28da212: Switched to using `'x-access-token'` for authenticating Git over HTTPS towards GitHub.
- 0ada34a0f: Minor typo in migration
- 29c8bcc53: Fixed the `prepare` step for when using local templates that were added to the catalog using the `file:` target configuration.
  No more `EPERM: operation not permitted` error messages.
- a341a8716: Fix parsing of the path to default to empty string not undefined if git-url-parse throws something we don't expect. Fixes the error `The "path" argument must be of type string.` when preparing.
- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
  - @backstage/backend-common@0.5.4
  - @backstage/integration@0.5.0

## 0.7.0

### Minor Changes

- 615103a63: Introduced `v2` Scaffolder REST API, which uses an implementation that is database backed, making the scaffolder instances stateless. The `createRouter` function now requires a `PluginDatabaseManager` instance to be passed in, commonly available as `database` in the plugin environment in the backend.

  This API should be considered unstable until used by the scaffolder frontend.

### Patch Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- ffffea8e6: Minor updates to reflect the changes in `@backstage/integration` that made the fields `apiBaseUrl` and `apiUrl` mandatory.
- Updated dependencies [6ed2b47d6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [72b96e880]
- Updated dependencies [5a5163519]
  - @backstage/catalog-client@0.3.6
  - @backstage/backend-common@0.5.3
  - @backstage/integration@0.4.0

## 0.6.0

### Minor Changes

- cdea0baf1: The scaffolder is updated to generate a unique workspace directory inside the temp folder. This directory is cleaned up by the job processor after each run.

  The prepare/template/publish steps have been refactored to operate on known directories, `template/` and `result/`, inside the temporary workspace path.

  Updated preparers to accept the template url instead of the entire template. This is done primarily to allow for backwards compatibility between v1 and v2 scaffolder templates.

  Fixes broken GitHub actions templating in the Create React App template.

  #### For those with **custom** preparers, templates, or publishers

  The preparer interface has changed, the prepare method now only takes a single argument, and doesn't return anything. As part of this change the preparers were refactored to accept a URL pointing to the target directory, rather than computing that from the template entity.

  The `workingDirectory` option was also removed, and replaced with a `workspacePath` option. The difference between the two is that `workingDirectory` was a place for the preparer to create temporary directories, while the `workspacePath` is the specific folder were the entire templating process for a single template job takes place. Instead of returning a path to the folder were the prepared contents were placed, the contents are put at the `<workspacePath>/template` path.

  ```diff
  type PreparerOptions = {
  -  workingDirectory?: string;
  +  /**
  +   * Full URL to the directory containg template data
  +   */
  +  url: string;
  +  /**
  +   * The workspace path that will eventually be the the root of the new repo
  +   */
  +  workspacePath: string;
    logger: Logger;
  };

  -prepare(template: TemplateEntityV1alpha1, opts?: PreparerOptions): Promise<string>
  +prepare(opts: PreparerOptions): Promise<void>;
  ```

  Instead of returning a path to the folder were the templaters contents were placed, the contents are put at the `<workspacePath>/result` path. All templaters now also expect the source template to be present in the `template` directory within the `workspacePath`.

  ```diff
  export type TemplaterRunOptions = {
  -  directory: string;
  +  workspacePath: string;
    values: TemplaterValues;
    logStream?: Writable;
    dockerClient: Docker;
  };

  -public async run(options: TemplaterRunOptions): Promise<TemplaterRunResult>
  +public async run(options: TemplaterRunOptions): Promise<void>
  ```

  Just like the preparer and templaters, the publishers have also switched to using `workspacePath`. The root of the new repo is expected to be located at `<workspacePath>/result`.

  ```diff
  export type PublisherOptions = {
    values: TemplaterValues;
  -  directory: string;
  +  workspacePath: string;
    logger: Logger;
  };
  ```

### Patch Changes

- a26668913: Attempt to fix windows test errors in master
- 529d16d27: # Repo visibility for GitLab and BitBucket repos

  **NOTE: This changes default repo visibility from `private` to `public` for GitLab and BitBucket** which
  is consistent with the GitHub default. If you were counting on `private` visibility, you'll need to update
  your scaffolder config to use `private`.

  This adds repo visibility feature parity with GitHub for GitLab and BitBucket.

  To configure the repo visibility, set scaffolder._type_.visibility as in this example:

  ```yaml
  scaffolder:
    github:
      visibility: private # 'public' or 'internal' or 'private' (default is 'public')
    gitlab:
      visibility: public # 'public' or 'internal' or 'private' (default is 'public')
    bitbucket:
      visibility: public # 'public' or 'private' (default is 'public')
  ```

- Updated dependencies [c4abcdb60]
- Updated dependencies [2430ee7c2]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [064c513e1]
- Updated dependencies [7881f2117]
- Updated dependencies [3149bfe63]
- Updated dependencies [2e62aea6f]
- Updated dependencies [11cb5ef94]
  - @backstage/integration@0.3.2
  - @backstage/backend-common@0.5.2
  - @backstage/catalog-model@0.7.1

## 0.5.2

### Patch Changes

- 26a3a6cf0: Honor the branch ref in the url when cloning.

  This fixes a bug in the scaffolder prepare stage where a non-default branch
  was specified in the scaffolder URL but the default branch was cloned.
  For example, even though the `other` branch is specified in this example, the
  `master` branch was actually cloned:

  ```yaml
  catalog:
    locations:
      - type: url
        target: https://github.com/backstage/backstage/blob/other/plugins/scaffolder-backend/sample-templates/docs-template/template.yaml
  ```

  This also fixes a 404 in the prepare stage for GitLab URLs.

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [6800da78d]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1
  - @backstage/integration@0.3.1

## 0.5.1

### Patch Changes

- 0ea002378: Fixing issues with templating and full URL's as `storePath`'s

## 0.5.0

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
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [fa8ba330a]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [ed6baab66]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
  - @backstage/integration@0.3.0

## 0.4.1

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- cc068c0d6: Bump the gitbeaker dependencies to 28.x.

  To update your own installation, go through the `package.json` files of all of
  your packages, and ensure that all dependencies on `@gitbeaker/node` or
  `@gitbeaker/core` are at version `^28.0.2`. Then run `yarn install` at the root
  of your repo.

- 711ba55a2: Export all preparers and publishers properly
- Updated dependencies [466354aaa]
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/integration@0.2.0
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.4.0

### Minor Changes

- 5eb8c9b9e: Fix GitLab scaffolder publisher

### Patch Changes

- 7e3451700: bug(scaffolder): Ignore the .git folder when adding dot-files to the index

## 0.3.7

### Patch Changes

- 37a5244ef: Add scaffolding support for Bitbucket Cloud and Server.
- 00042e73c: Moving the Git actions to isomorphic-git instead of the node binding version of nodegit
- 9efbc5585: Add config schema for Bitbucket scaffolder
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2
  - @backstage/integration@0.1.5

## 0.3.6

### Patch Changes

- 19554f6d6: Added GitHub Actions for Create React App, and allow better imports of files inside a module when they're exposed using `files` in `package.json`
- 33a82a713: GitLab preparer uses the right token (primarily the same one as the publisher, falling back to the integrations token)
- aed8f7f12: Clearer error message when preparer or publisher type can't be determined.

## 0.3.5

### Patch Changes

- 94c65a9d4: Added configuration schema for the commonly used properties
- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1

## 0.3.4

### Patch Changes

- 1e22f8e0b: Unify `dockerode` library and type dependency versions
- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.3

### Patch Changes

- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.3.2

### Patch Changes

- ef2831dde: Move constructing the catalog-info.yaml URL for scaffolded components to the publishers
- 5a1d8dca3: Fix React entity YAML filename to new standard
- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.3.1

### Patch Changes

- d33f5157c: Extracted pushToRemote function for reuse between publishers
- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

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

- Updated dependencies [33b7300eb]
  - @backstage/backend-common@0.2.1

## 0.2.0

### Minor Changes

- 3e254503d: Add Azure DevOps support to the scaffolder backend

  This adds support for Azure DevOps to the scaffolder (preparer & publisher). I thought I should get this in there now since #2426 has been merged. I had a previous PR with only the preparer but I closed that in favor of this one.

  I stayed with the 'azure/api' structure but I guess we should try and go the same way as with GitHub here #2501

### Patch Changes

- 0c370c979: Update SSR template to pass CI
- 991a950e0: Added .fromConfig static factories for Preparers and Publishers + read integrations config to support url location types
- c926765a2: Allow templates to be located on non-default branch
- 6840a68df: Add authentication token to Scaffolder GitHub Preparer
- 1c8c43756: The new `scaffolder.github.baseUrl` config property allows to specify a custom base url for GitHub Enterprise instances
- 5e4551e3a: Added support for configuring the working directory of the Scaffolder:

  ```yaml
  backend:
    workingDirectory: /some-dir # Use this to configure a working directory for the scaffolder, defaults to the OS temp-dir
  ```

- e3d063ffa: Introduce PreparerOptions for PreparerBase
- Updated dependencies [3a4236570]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [a768a07fb]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [5adfc005e]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [b3d57961c]
- Updated dependencies [7bbeb049f]
  - @backstage/catalog-model@0.2.0
  - @backstage/backend-common@0.2.0
