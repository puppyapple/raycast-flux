# raycast-flux

Generate images with Flux.
通过Raycast调用本地flux模型生成图片。

# Usage

1. 安装`mflux`库（[filipstrand/mflux](https://github.com/filipstrand/mflux)）
   ```bash
   pip install mflux
   ```
2. 下载`flux`模型（本地运行`mflux`会自动通过`huggingface`下载）


3. 安装[Raycast - Your shortcut to everything](https://www.raycast.com/)

   > 还没有用过这个`MAC`插件的朋友，强烈安利一下！！！

4. 克隆本项目到本地
   ```bash
   git clone https://github.com/puppyapple/raycast-flux.git
   ```
5. 进入项目目录并安装依赖
   ```bash
   cd raycast-flux
   npm install
   ```
   如果没有安装`npm`，请先安装`npm`。
   ```bash
   brew install npm
   ```
6. 运行插件：打开`Raycast`，输入`flux`搜索，第一个结果就是，回车即可
   ![flux-2024-11-28-13-33-53](https://erxuanyi-1257355350.cos.ap-beijing.myqcloud.com/flux-2024-11-28-13-33-53.png)


7. 第一次运行可能会要求输入一个路径变量`mfluxExecutablePath`，对应的是前面安装的`mflux`库的`mflux-generate`命令的路径，可以通过`which`命令获取
   ```bash
   which mflux-generate
   ```
   另外还有一个可选路径变量`savePath`，对应的是生成图片的保存路径，默认是`/Users/xxxx/Pictures/Diffusion/mflux`，这两个路径都可以通过`Command`配置来重新设置
   > ⚠️ 注意这里一定要用绝对路径且不要带有`~`来表示用户根目录

   ![mflux_path-2024-11-28-13-34-57](https://erxuanyi-1257355350.cos.ap-beijing.myqcloud.com/mflux_path-2024-11-28-13-34-57.png)
   ![path_setting-2024-11-28-13-34-57](https://erxuanyi-1257355350.cos.ap-beijing.myqcloud.com/path_setting-2024-11-28-13-34-57.png)

8. 输入参数生成图片，目前的参数有以下几个：
   - `prompt`: 提示词，必填
   - `model`: 模型名称，目前有`shuttle`, `schnell`, `dev`三个模型
   > `mflux`默认是不支持`shuttle`模型的，我是通过指定模型路径的方式来绕过这个限制的，具体可以参考之前的文章[论取名蹭热度的水平，这个文生图大模型已经妥妥的Next Level！｜继续在MBP M4 Max上跑大模型](https://mp.weixin.qq.com/s/OTC0chM-URmW_qV22ZXOuQ)
   - `width`: 宽度，默认`1024`
   - `height`: 高度，默认`1024`
   - `steps`: 步数，默认`4`
   - `seed`: 随机种子，默认`None`
   - `Auto Preview`: 生成完成后自动通过预览打开，默认**勾选**

   ![running-2024-11-28-13-36-12](https://erxuanyi-1257355350.cos.ap-beijing.myqcloud.com/running-2024-11-28-13-36-12.png)

模型正在运行的时候会如上图所示，左下角显示`Processing Generating image...`，如果勾选了`Auto Preview`，那么生成完成后会自动打开图片，因此运行的时候可以不用一直盯着这个窗口，去干别的事情。