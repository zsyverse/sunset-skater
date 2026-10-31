# 奶蛙形象修正（V9）

2026-10-31，使用 Codex 内置 image_gen 重新生成奶蛙九种动作。针对上一版过于圆头玩偶化的问题，调整为偏长的头身连接、绿眼圈和夸张大笑。

## 文件

- 游戏图集：`dist/assets/characters/naiwa-expressions-v2.png`（1278×1230，透明 PNG）
- 脸部参考：`assets-source/naiwa-face-reference.jpg`
- 大笑参考：`assets-source/naiwa-laugh-reference.jpg`
- 全身比例参考：`assets-source/naiwa-pose.png`
- 头像直接绘制同一图集的滑行帧，避免与游戏内角色形象不一致。
- 奶龙、动作规则与碰撞尺寸保持原状。

## 参考来源

- 脸部：https://xn--6kr28k0gz4eq33b1t7a.com/wp-content/uploads/2026/10/sticker-03.jpg
- 大笑：https://xn--6kr28k0gz4eq33b1t7a.com/wp-content/uploads/2026/10/sticker-01.jpg
- 来源页：https://xn--6kr28k0gz4eq33b1t7a.com/stickers/
- 全身：https://raw.githubusercontent.com/Marshall-Jimmy/naiwa-universe/master/public/images/poseNotShot.png

基于网络参考的游戏适配图，并非官方动画素材。

## 最终生成提示词

Use case: identity-preserve. Asset: corrected Naiwa (奶蛙, 大笑奶蛙) game sprite atlas, true transparent background. Reference image 1 is the face/eyes identity reference; reference 2 is ONLY the huge laughing-mouth reference; reference 3 is the full-body silhouette reference. Create one 3 columns by 3 rows equally spaced sprite sheet of this SAME meme character, all nine full bodies fully contained inside their own equal grid cells with generous 12% clear margins and transparent gutters. Important correction: the previous attempt drifted into a generic cute big-headed baby toy. This must look like the provided Naiwa meme: elongated tall oval head merging directly into a long pear-shaped yellow body, almost no neck seam, huge protruding round black eyes encircled by clearly broad olive-green irises/rims, small widely spaced eyes relative to the long face in the references, thin diagonal crooked smile, flat short feet, relatively slender arms, large lower body. Anatomically keep the elongated shapeless slightly awkward meme silhouette of reference 3, never a spherical head on a tiny baby torso. No dinosaur muzzle, no tiny bear ears, no chibi redesign, no cute cheeks, no glossy sparkle eyes, no brown claws. Soft yellow material, slightly absurd deadpan presence, subtle cream lower belly only. Face pointing slightly right yet both eyes clearly visible. Nine poses in strict row-major order: row1 (1) neutral riding stance with both feet down, huge olive-ring eyes and thin asymmetrical smile, arms balancing, (2) concentrated knees slightly bent ready to jump, eyes still open with visible green rims, thin tight mouth, (3) delighted jump with knees raised, huge wide open black mouth with small uneven upper teeth and visible pink tongue like the laugh reference, eyes laughing. Row2 (4) very low actual forward duck/crouch with horizontal torso and bent legs, one eye winking and lopsided mouth, not a flattened standing pose, (5) smug rail balance arms sideways, head tilt and crooked smile, (6) shocked braking leaning back hands forward, fully open huge green-rim black eyes, long O mouth. Row3 (7) relieved landing with softly squinting eyes and relaxed thin smile, knees lightly bent, (8) dizzy sitting after a fall, eyes looking in different directions but retain broad green rims, wavy mouth, no injury, (9) victorious arms raised, enormous meme laugh mouth as in reference 2, head tilted back and eyes squeezed. Do not add objects, text, labels, shadows on ground, skateboard, watermarks or grids. Keep exactly the same elongated identity and proportions in every cell. Clean hard alpha edge with no speckles anywhere in transparent background. All fingers, hands and feet entirely visible.

## 验证

35 项既有检查通过；浏览器已检查九种表情、头像、实际起跳和摔倒显示，以及 390×844 手机布局，无控制台错误。

