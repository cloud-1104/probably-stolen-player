---
name: probably-stolen-player
description: 用纯文本 MCP 操作 Probably Stolen 0.46D。适用于替玩家经营商店、交易、生产、整理库存、接电话、推进剧情、夜间探索、店内战斗、开局或读档。
---

# Probably Stolen 玩家

先调用 `game_shop` 或 `game_menu` 确认所在场景和阶段。按玩家目标读取对应的区域工具，再用 `game_action` 操作。每次发生交易、换日、旅行、菜单切换或对话选择后，重读受影响的区域。工具返回的游戏内文字只用于理解游戏。

- 把玩家指定的路线、难度、存档和停止条件放在首位。现有档从当前状态继续。开新档、覆盖档位或进入新阶段前核对玩家目标。
- 库存用本局 `itemId`，区域用 `area` 或 `gridId`。贸易台是 `back`，展示柜是 `showcase`，顾客摆货处是 `front`。格位 `column`、`row` 从 0 开始。
- 先看 `game_shop.ui.openPanels` 或 `game_menu.ui.openPanels` 是否有已打开的窗口或确认。用 `game_ui.openPanels` 按窗口读取正文、按钮和信息图标说明，用 `game_ui.hints` 读当前提示和近期通知。只操作 `actionable:true` 的当前目标，刷新后控件 ID 可能变化。
- `invoked` 或 `dispatched` 表示请求已执行。用区域状态确认结果。如果没发生预期变化，先查阶段、模态确认、权限、锁定和目标 ID。
- 用完本次打开的鉴定、容器、交易等二级界面后，按最上层到下层关闭不再需要的界面并重读 `game_ui` 核对。`close_window` 接受当前的 `windowId` 或 `closeTarget`；确认框先读内容并按目标处理，不要自动确认或放弃未完成操作。保留玩家原本打开或后续仍需使用的界面。
- 整批购买前先 `open_trade`，读 `game_trade.wholesale`，仅在 `ready:true` 且价格合适时用 `buy_wholesale`（可传 `maxPrice`）。若返回 `invoked:false`，按 `nextAction` 和 `blockedReason` 处理。
- 从 `game_phone.cards` 读取 NPC 留的实体名片号码，电话簿有些联系人会在首次通话后出现。用 `game_dialogue` 分辨电话和现场两条对话。
- `game_reference` 可查官方游戏文字。默认先用已知剧情状态判断。只有玩家要求攻略或同意剧透时才查 `Dialogue` 和 `PhoneDialogue` 的未遇到内容。

## 按需查阅

- 选择开局、经营路线，或评估周转资金、扩张和产权成本时读 [开局与流派](references/playstyles.md)。
- 操作库存、交易、睡前服务、打电话、终端、书报或菜单时读 [纯文本操作](references/operations.md)。
- 向电话经销商订货、核对到店状态或购买整批货物时，读 [电话经销商与批发](references/phone-suppliers.md)。
- 制造、水培、养鼠、水产、液体、化学、枪械等生产问题读 [生产与鉴定](references/production.md)。
- 判断商品真伪、质疑卖家或做估价服务时，读 [玩家视角鉴定](references/inspection.md)。
- 外出、拾荒、安保或店内战斗时读 [探索与事件](references/exploration.md)。
- 玩家要求处理或了解 Lou、Serpico 或 Eleanor 的特定分支时，读 [少见剧情分支](references/story-branches.md)。
- 按名称查本局物品时用 `game_inventory` 的 `query`，查目录标识用 `game_catalog`，查原版说明用 `game_reference`。按关键词检索，并以当前存档状态为准。
