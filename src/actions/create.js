/** 
 * @desc   : desc 
 * @author : ziwen
 * @date   : 2020-9-4 16:57:27
 */
const Inquirer = require('Inquirer');
const fs = require('fs')
const path = require('path')
const { promisify } = require('util');
const { wrapFetchAddLoding } = require('../utils')
const MetalSmith = require('metalsmith'); // 遍历文件夹
let { render } = require('consolidate').ejs;
const { fetchRepoList, fetchTagList, download } = require('../utils/fetchAPI')
let ncp = require('ncp');

ncp = promisify(ncp);
render = promisify(render);

module.exports = async (projectName) => {
  let repos = await wrapFetchAddLoding(fetchRepoList, 'fetching repo list')();
  

  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: repos, // 选择模式
  });

  // 拉tags 选择版本
  let tags = await wrapFetchAddLoding(fetchTagList, 'fetching tag list')(repo);
  tags = tags.map((item) => item.name);

  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: 'please choice repo template to create project',
    choices: tags,
  });

  const target = await wrapFetchAddLoding(download, 'download template')(repo, tag);

  await new Promise((resovle, reject) => {
    MetalSmith(__dirname)
      .source(target)
      .destination(path.join(path.resolve(), projectName)) // 输出渲染后的结果
      .use(async (files, metal, done) => {
        let askQuestion
        if (!fs.existsSync(path.join(target, 'ask.js'))) {
          // 没有ask.js文件，执行默认ask
          askQuestion = require(path.join('../utils/ask'))({ projectName });
        } else {
          askQuestion = require(path.join(target, 'ask.js'))
        }

        const result = await Inquirer.prompt(askQuestion);
        const data = metal.metadata();
        Object.assign(data, result); // 将询问的结果放到metadata中保证在下一个中间件中可以获取到
        delete files['ask.js'];
        done();
      })
      .use((files, metal, done) => {
        Reflect.ownKeys(files).forEach(async (file) => {
          if(file.includes('package-lock') || file.includes('node_module')) return;
          let content = files[file].contents.toString();
          if (file.includes('.js') || file.includes('.json') || file.includes('.html')) {
            if (content.includes('<%')) { 
              content = await render(content, metal.metadata()); // 渲染模板
              files[file].contents = Buffer.from(content);
            }
          }
        });
        done();
      })
      .build((err) => { // 执行中间件
        if (!err) {
          resovle();
        } else {
          reject();
        }
      });
  });
};