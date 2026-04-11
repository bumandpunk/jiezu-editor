# 同步上游更新指南

## 仓库结构说明

| 远程 | 地址 | 用途 |
|------|------|------|
| `origin` | `github.com/bumandpunk/jiezu-editor` | 你自己的仓库 |
| `upstream` | `github.com/pascalorg/editor` | 原作者仓库 |

| 分支 | 内容 | 说明 |
|------|------|------|
| `main` | 原作者代码（无翻译） | 只用于跟进上游 |
| `i18n-zh` | 翻译版本 | 实际使用的分支 |

---

## 每次原作者发布新版本时的操作步骤

### 第一步：拉取原作者最新代码
```bash
git fetch upstream
```

### 第二步：更新 main 分支
```bash
git checkout main
git merge upstream/main
git push origin main
```

### 第三步：将翻译分支 rebase 到新 main 上
```bash
git checkout i18n-zh
git rebase main
```

> 如果出现冲突（原作者修改了你翻译过的同一行）：
> 1. 打开冲突文件，保留中文翻译版本
> 2. `git add 冲突文件`
> 3. `git rebase --continue`
> 4. 重复直到 rebase 完成

### 第四步：推送翻译分支
```bash
git push origin i18n-zh --force-with-lease
```

---

## 效果示意

原作者新增 commit 后，rebase 会将你的翻译接在最新代码之后：

```
更新前：
main:     A → B → C
i18n-zh:  A → B → C → [翻译]

原作者发布 D、E 后：
main:     A → B → C → D → E
i18n-zh:  A → B → C → D → E → [翻译]
```

---

## 快速命令（复制直接用）

```bash
git fetch upstream
git checkout main && git merge upstream/main && git push origin main
git checkout i18n-zh && git rebase main && git push origin i18n-zh --force-with-lease
```
