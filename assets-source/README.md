# 角色素材来源与适配

- 当前奶蛙使用 V9 修正版，调整绿眼圈、长头身和夸张笑脸。新版素材、网页来源和提示词见 [奶蛙形象修正](naiwa-v9-prompt.md)。以下记录保留早期版本制作过程。

- 奶龙原图：https://www.nailongsol.fun/static/media/s2.021de792d76f3625c2ee.png 。原图自带透明度，未重绘。游戏使用相同 PNG。
- 奶蛙参考原图：https://raw.githubusercontent.com/Marshall-Jimmy/naiwa-universe/master/public/images/poseNotShot.png 。来源页：https://github.com/Marshall-Jimmy/naiwa-universe 。原始图片保存在 naiwa-pose.png。
- 奶蛙使用内置 image_gen 去背景，结果在 dist/assets/characters/naiwa.png；保留透明 alpha。基于网络素材提取，并非官方动画动作帧。
- V8 为两个角色分别生成了九种独立动作表情；游戏根据操作自动切换并轻微摆动。完整提示词和图集路径见 [动作表情说明](expression-prompts.md)。两角色共享既有碰撞参数。

## 去背景提示词（内置 image_gen）
Use case: background-extraction. Edit target: provided image of the yellow Naiwa meme character standing in a street, raising both arms with peace signs. Extract ONLY that exact yellow character as a clean full-body transparent PNG cutout for a small game sprite. Preserve its distinctive enormous round black eyes with olive-green rims, small curved smile, elongated round yellow body, short legs, all fingers, colors and original pose and texture. Remove the entire street, scenery, shadows, speech bubbles and all Chinese text. Do not redesign the character. Fit the whole character closely centered on a square transparent canvas with 5 percent padding, neither feet nor hands cropped. No skateboard, no new objects, no text, no watermark. True transparent alpha background.
