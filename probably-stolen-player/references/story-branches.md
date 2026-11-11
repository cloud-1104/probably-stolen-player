# 少见剧情分支

适用 Steam Build 26525552（100-Rev13）。以下是原版调用链的静态核对。按当前存档的来客、选项和提示推进。Serpico 和 Eleanor 的常规来客排程由剧情模式驱动，无尽模式会跳过这组排程。

## Lou 的储物柜

- 收到 `lou_locker` 后，用 `game_item` 读原版提示里的累计货值、要求金额和剩余夜数。要求金额是当前难度下 Lou 勒索额的一半，按提示里的实值准备。
- 要交货时，把货物移入储物柜内的仓位，再把柜子放到顾客前台 `front`。原版在离店或睡觉时检查前台的柜子。计价用其中物品的议价价值，发射器单独处理。不要把仍未装够的柜子留在前台就离开。
- 已收到共和国发射器 `republic_transmitter` 且玩家选择协助抓捕时，把发射器放入 Lou 将带走的箱柜。柜子被收走时会处理抓捕分支。交货与抓捕都可能消耗箱柜内容，先按玩家目标选择分支。 [100-Rev13 修复公告](https://steamcommunity.com/games/4348910/announcements/detail/676262871030563153)

## Serpico 的信和送食物

- Georgio 送信并提出代送后，按 `game_dialogue` 当前可用选项操作。可以花 150 信用点代送，或在下层区声望至少 40 时请他免费帮忙。前者检查现金，后者检查声望。
- 亲自送食物时，在信所给的窗口去垃圾倾倒场 `dumping_ground`。用 `game_item` 查食物的 `CALORIE_VALUE_TAG`，原版按每件热量乘以堆叠数量累计，目标为 2000 kcal。
- 在 `game_inventory` 找 `slotRole` 为 `ground` 的 `after_hours` 格网，把食物放在地面。口袋和背包有独立的仓位。用 `return_to_store` 后，确认原版的地面遗留物提示才会真正离开。离开时原版累计食物，每天第一次留下部分食物可延长一天。次晨用 `game_sleep.morningReport` 核对送达记录。 [1.0.0.12 更新公告](https://steamcommunity.com/games/4348910/announcements/detail/676262871030562822)

## Eleanor 的保释

- Eleanor 被捕后，治安官最早在两天后来店。用 `game_dialogue` 读实际选项。可以付 500 信用点，也可以在治安部声望至少 40 时免费担保。
- 付费或担保后，Eleanor 最早次日回来，随后才继续后续故事。选择后继续读完对话，按 `game_shop` 的日期和实际来客核对进展。 [1.0.0.12 更新公告](https://steamcommunity.com/games/4348910/announcements/detail/676262871030562822)
