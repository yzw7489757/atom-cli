module.exports = {
  create: {
    description: 'create project',
    alias: 'cr',
    completeAlias: 'create',
    examples: [
      'atom-cli create <template-name>',
    ],
  },
  config: {
    description: 'config info',
    alias: 'c',
    completeAlias: 'config',
    examples: [
      'atom-cli config get <k>',
      'atom-cli config set <k> <v>',
    ],
  },
  clear: {
    description: 'clear cache',
    alias: 'cc',
    completeAlias: 'clear',
    examples: [
      'atom-cli clear cache <register>',
      'atom-cli clear cache <register> <userName>',
      // TODO: support clear template
    ]
  },
  '*': {
    description: 'command not found',
  },
};