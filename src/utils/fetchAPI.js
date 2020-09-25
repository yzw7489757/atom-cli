const axios = require('axios')
const fs = require('fs')
const { downloadDirectory } = require('./constants')
const { promisify } = require('util');
const config = require('../actions/config');
const { setCache, readCache } = require('./cache');

let downLoadGit = require('download-git-repo');
const { exit } = require('process');
downLoadGit = promisify(downLoadGit);

const repoPrefix = config('getVal', 'repoPrefix');
const register = config('getVal', 'register');
const userName = config('getVal', 'userName');
const protocol = config('getVal', 'protocol');

// TODO：缓存和请求区分开来
const fetchRepoList = async () => {
  let repoList = null;
  const cacheName = `${register}/${userName}/${repoPrefix}repoList`;

  try{
    const { data } = await axios.get(`${protocol}://api.${register}.com/users/${userName}/repos?per_page=100&type=owner`)
    repoList = data
    if(repoList) {
      setCache(cacheName, repoList)
    }
  } catch(e) {
    console.log('\n\ngithub get repoList api call failed, will use local cache data\n\n');
    repoList = readCache(cacheName, []);
  }

  if(!repoList || repoList.length === 0) {
    throw new Error('\n\nThe specified organization has no repository list data or the local cache does not exist!\n\n')
  }

  repoList = repoList.filter(repo => {
    return repo.name.indexOf(repoPrefix) !== -1
  });

  if(repoList.length === 0) {
    console.log('\n warn: target user not has any repo. \n')
    exit();
  }

  return repoList
}

const fetchTagList = async (repo) => {
  const cacheName = `${register}/${userName}/_${repo}/tags`
  const tagList = await new Promise((resolve) => {
    axios.get(`${protocol}://api.${register}.com/repos/${userName}/${repo}/tags`).then((res) => {
      const { data } = res;
      setCache(cacheName, data)
      return resolve(data)
    }, err => {
      // 使用缓存
      console.log(`\n ${err.code} \ngithub get tags api call failed, will use local cache data\n\n`);
      const cache = readCache(cacheName, [])
      if(!cache) {
        throw new Error('\n\nThe specified organization has no tag list data or the local cache does not exist!\n\n')
      }
      return resolve(cache)
    })
  })

  // console.log(tagList);
  if(tagList.length === 0) {
    console.log('\n warn: target repo not has tags. \n')
    exit()
  }
  return tagList
};

// TODO: cache updated
const download = async (repo, tag) => {
  let api = `${userName}/${repo}`;
  if (tag) api += `#${tag}`;
  const dest = `${downloadDirectory}/${repo}/${tag}`; // 将模板下载到对应的目录中
  // 每个 tag 都是肯定不会更新。可以充分利用缓存。
  if(fs.existsSync(dest)) {
    // 本地存在了
  } else {
    await downLoadGit(api, dest);
  }
  
  return dest;
};

module.exports = {
  fetchRepoList,
  fetchTagList,
  download
}