# 外出、远征、战斗与事件

## 夜间外出

打烊后读取 `game_shop` 和 `game_exploration` 的外出次数、健康与位置。`open_exit` 后若有柜台遗留物提示，先决定是否用 `confirm_exit`，再读取 `departure.choices` 中带包或不带包的选项，按 `index` 调用 `choose_response`。打开地图后用 `game_map` 读地点和事件，`travel` 选地点，`confirm_travel` 按原版按钮确认，等待 `travelling` 结束。

- **垃圾倾倒场 `dumping_ground`**。读取 `game_exploration.scavenging` 的剩余时间、轻伤和重伤概率。用 `scavenge` 执行，再读拾荒库存。可处置危险垃圾，出发和返回前查手持、口袋、背包和地面，避免遗留要带回的货。
- **军需商店 `commissary`**。使用 `open_commissary_trade`，用 `game_commissary` 核对代币余额、库存和单价。用 `redeem_stamps` 兑换邮票，用 `buy_commissary` 按商品标识购买。中奖票用 `redeem_lottery` 兑换信用点，两种兑换各自独立。
- **杰克逊医生 `dr_jackson`**。在解锁后通过地图出发。读现场柜台、对话和升级选项，结合伤势、余额和原版说明选择。
- **事件与撤离**。特殊角色可能封锁地点或改变外出风险。用 `return_to_store` 走原版返程，出现遗留物确认时核对其含义再处理。

## 店内战斗

遇到治安事件先读 `game_security` 的当前目标、拘捕、交火和霰弹枪状态。店内放大镜可用 `magnifier`、`magnify_zoom`、`close_magnifier`；用顾客当前外观、阵营线索、异常静止或横向抖动与已打开的通缉资料交叉判断伪装，不把单一动作当成确认。已解锁且当前顾客允许时，使用 `equip_shotgun`、`shoot` 或 `holster_shotgun`。店内放大顾客与手持鉴定工具是两个机制。

## 功能可用性

外出地点、事件和行动以当前游戏面板返回的可用选项为准。版本更新后重新核对入口和状态，再决定下一步。

## 派系、委托与故事

`game_reputation` 读取声望、影响力与各阈值对应的特权。`game_requests` 读取邮件状态、物品标识、到期日、数量和奖励。打开终端后按委托 ID 调用 `fulfill_request`，交单前先区分真实匹配品和被锁定或贴错标签的货。买卖、举报、敲诈、拒绝服务或支持特定势力可能改变声望与后续来客。

日历、报纸、录音、档案箱、联系人卡、电话、柜台对话和事件纸条承担不同的剧情信息。用 `game_calendar` 查已知市场和派系事件，用 `game_documents`、`game_dialogue`、`game_phone` 跟进当前线索。未遇到的剧情应根据玩家对剧透的要求决定是否从参考表搜索。

场景变化后旧对象 ID 会失效。旅行和店内事件通过重新读取判断结束。玩家只要求某一目标时，完成该目标后在稳定状态停下。
