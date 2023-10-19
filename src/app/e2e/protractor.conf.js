exports.config = {
    framework: 'jasmine',
    specs: ['login.e2e-spec.ts'],
    capabilities: {
      browserName: 'chrome',
    },
    directConnect: true,
    baseUrl: 'http://localhost:4200/',
  };
  