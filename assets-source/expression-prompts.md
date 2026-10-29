# 动作表情素材（V8）

使用 Codex 内置 image_gen，以现有奶龙、奶蛙透明图作为角色参照，各生成一张透明 3×3 图集。不是官方动画素材。

- 奶龙：`dist/assets/characters/nailong-expressions.png`
- 奶蛙：`dist/assets/characters/naiwa-expressions.png`
- 原始参照与网页来源见 [README](README.md)。
- 九种表情依次为：滑行、蓄力、跳跃、低头、滑杆、刹车、落地、摔倒、通关。
- 游戏根据实际动作切换图集帧，沿用原有碰撞参数；低头使用独立低姿态，不再压扁站姿。
- 浏览器已检查两角色九宫格、实际摔倒结算及 390px 手机布局；35 项自动检查通过。

## 共用提示词

Use case: identity-preserve game sprite sheet. Reference is the exact character identity. Create ONE transparent PNG sprite atlas of the SAME yellow character in NINE clearly different full-body facial-expression poses, precisely a 3-column by 3-row equal-sized grid. No labels, no grid lines, no text, no props, no skateboard, no ground, true alpha transparency. Each character must fit entirely inside its own equal cell with generous 12% padding and no overlap; feet aligned near the cell bottom, head fully visible. Preserve reference 3D soft yellow materials, proportions, face identity, eye design and belly. Readability at small game size is crucial: large expressive face and visibly different mouth/eyes in each cell. Row 1 left to right: (1) relaxed happy cruising smile, arms slightly out for balance; (2) determined concentrating face, lowered eyebrows, puffed cheeks and knees bent preparing to jump; (3) airborne delighted wide-open smiling mouth, raised arms, knees tucked. Row 2 left to right: (4) LOW ducking pose, leaning torso forward horizontally, bent knees, cheeky wink and tongue out, actual low crouch anatomy, not a vertically flattened standing body; (5) confident smug half-smile, one eyebrow raised, arms out balancing on a rail; (6) braking shocked face, round O mouth, wide startled eyes, both hands forward. Row 3 left to right: (7) relieved landing face eyes softly closed, warm smile, knees slightly bent; (8) comically dizzy after falling, spiral pupils, crooked mouth, sitting with legs forward, no injury; (9) victorious laughing face with eyes squeezed happily and arms high in a celebratory V. Match the exact same character across all nine cells. Soft studio lighting and strong clean silhouette. Do not introduce a green frog: this character is yellow.

## 奶蛙追加提示词

This is Naiwa: preserve its enormous round black eyes with olive rims and long yellow frog-like head, tiny smile, no white belly patch.

## 奶龙追加提示词

This is Nailong: preserve its small green eyes, broad muzzle, large pale creamy belly and tiny brown claws.

