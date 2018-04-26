module.exports = [
  {
    request: {
      path: '/repos/nodejs/node/statuses/1234567890123456789012345678901234567890',
      method: 'POST'
    },
    response: {
      status: 201,
      body: {
        'url': 'https://api.github.com/repos/octocat/Hello-World/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e',
        'avatar_url': 'https://github.com/images/error/hubot_happy.gif',
        'id': 1,
        'state': 'success',
        'description': 'Build has completed successfully',
        'target_url': 'https://ci.example.com/1000/output',
        'context': 'continuous-integration/jenkins',
        'created_at': '2012-07-20T01:19:13Z',
        'updated_at': '2012-07-20T01:19:13Z',
        'creator': {
          'login': 'octocat',
          'id': 1,
          'avatar_url': 'https://github.com/images/error/octocat_happy.gif',
          'gravatar_id': '',
          'url': 'https://api.github.com/users/octocat',
          'html_url': 'https://github.com/octocat',
          'followers_url': 'https://api.github.com/users/octocat/followers',
          'following_url': 'https://api.github.com/users/octocat/following{/other_user}',
          'gists_url': 'https://api.github.com/users/octocat/gists{/gist_id}',
          'starred_url': 'https://api.github.com/users/octocat/starred{/owner}{/repo}',
          'subscriptions_url': 'https://api.github.com/users/octocat/subscriptions',
          'organizations_url': 'https://api.github.com/users/octocat/orgs',
          'repos_url': 'https://api.github.com/users/octocat/repos',
          'events_url': 'https://api.github.com/users/octocat/events{/privacy}',
          'received_events_url': 'https://api.github.com/users/octocat/received_events',
          'type': 'User',
          'site_admin': false
        }
      }
    }
  }
]
