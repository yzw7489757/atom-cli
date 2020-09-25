## 简介

根据目标repo 与 tag 拉取模板仓库。

结合放置在模板根目录的 ask.js ([规范](https://github.com/SBoudrias/Inquirer.js#question)) 文件使用，模板结构内自动识别 ejs 语法的 js/json/html。

``` shell
atom-cli create <projectName>
```

* 从 `https://api.${register}.com/users/${userName}/repos` 自动拉取 prefix 为 atom-template 的 repos。
* 从 `https://api.${register}.com/repos/${userName}/${repo}/tags` 拉取tags，提供选择，由于tags具有不可逆特性，所以会被缓存。

## 清除缓存
一次性清理 repos/tags cache 和 template cache 暂时自己用，没区分开.
``` shell
atom-cli clear cache
```

## 设置
默认的配置项目 [constants](https://github.com/yzw7489757/atom-cli/src/utils/constants.js#L8)
### origin

``` shell
atom-cli config set register <origin>
```

获取
``` shell
atom-cli config get register
```

### User
同理

``` shell
atom-cli config set userName <User>
```

获取
``` shell
atom-cli config get userName
```

## 设置其他

有效的设置属性key

``` js
userName: USERNAME,
register: "github",
protocol: 'https'
repoPrefix: 'atom-template'
```

``` shell
atom-cli config set <key> <value>
```

获取
``` shell
atom-cli config get <key>
```

