<img width="130" src="http://techblog.recruit-lifestyle.co.jp/status-back/media/status-back-logo.svg" />

# status-back v1.0.0

[![CircleCI](https://circleci.com/gh/recruit-lifestyle/status-back.svg?style=svg)](https://circleci.com/gh/recruit-lifestyle/status-back)
[![codecov](https://codecov.io/gh/recruit-lifestyle/status-back/branch/master/graph/badge.svg)](https://codecov.io/gh/recruit-lifestyle/status-back)

> :arrow_left::large_blue_circle: Send the status back to the github from CI environment

# :cd: Install

Via npm:

    npm i -g status-back

This installs `status-back` to your system.

# CLI Usage

```
  Usage: status-back [options] [<description>, [<url>]]

  Options:
    -p, --pending - - - - - - - Set the commit status pending.
    -s, --success - - - - - - - Set the commit status success.
    -f, --failure - - - - - - - Set the commit status failure.
    -e, --error - - - - - - - - Set the commit status error.
    -t, --token <token> - - - - Set the github token. Required.
                                Optionally set by GITHUB_TOKEN env var.
    -r, --repo <repo> - - - - - Set the repo slug. e.g. nodejs/node. Requird.
                                Optionally set by GITHUB_REPO env var.
    --sha1 <sha1> - - - - - - - Set the sha1 of the commit. Default is the current sha1.
                                Optionally set by STATUS_SHA1.
                                If not specified, the sha1 of current dir is used.
    -c, --context <context> - - Set the context of the commit status. e.g. ci/build. Required.
                                Optionally set by STATUS_CONTEXT env var.
    --github-api <url>  - - - - Set the url of the github api. Set this when you use with github enterprise.
                                Optionally set by GITHUB_API env var.

  Example:
    status-back -s -t 12345... -r nodejs/node -c ci/build "build success!" https://ci.server/build/12345

    status-back -f -t 12345... -r nodejs/node -c ci/build "build failure!" https://ci.server/build/12346 --github-api https://github.my-company/api/v3
```

# Examples & recipes

## Usage with Jenkins declarative pipeline

In CI settings, we recommend to use enviroment variables for setting common parameters.

```groovy
pipeline {
  envrionment {
    GITHUB_TOKEN = credentials 'github-token'
    GITHUB_API = 'https://mycompany.github/api/v3'
    GITHUB_REPO = 'myorg/myrepo'
  }

  stages {
    stage('install') {
      steps {
        sh 'yarn'
      }
    }

    stage('lint') {
      environment {
        STATUS_CONTEXT = 'jenkins/lint'
      }

      steps {
        sh 'npx status-back -p "Linting..." $BUILD_URL'
        sh 'npm run lint'
      }

      post {
        success {
          sh 'npx status-back -s "Lint success!" $BUILD_URL'
        }
        failure {
          sh 'npx status-back -f "Lint failed!" $BUILD_URL'
        }
      }
    }

    stage('test') {
      environment {
        STATUS_CONTEXT = 'jenkins/test'
      }

      steps {
        sh 'npx status-back -p "Testing..." $BUILD_URL'
        sh 'npm test'
      }

      post {
        success {
          sh 'npx status-back -s "Test success!" $BUILD_URL'
        }
        failure {
          sh 'npx status-back -f "Test failed!" $BUILD_URL'
        }
      }
    }
  }
}
```

# License

Apache 2.0

**Note**: This library is inspired by [commit-status][] by [dtinth][], but is a bit more focused on usages in Github Enterprise environment, rather than github.com.



[commit-status]: https://www.npmjs.com/package/commit-status
[dtinth]: https://github.com/dtinth

