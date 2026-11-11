# 纯文本操作

## 区域与动作

| 想看哪里 | 读取工具 | 原版操作入口 |
| --- | --- | --- |
| 主菜单、新游戏、读档和选项 | `game_menu`、`game_starts` | `activate`、`set_control`、`type`、`open_options` |
| 店面、开关卷帘和叫客 | `game_shop` | `shutter`、`call_customer`、`dismiss_customer` |
| 顾客货物、报价、议价 | `game_trade` | `open_trade`、`next_offer`、`previous_offer`、`open_bargain`、`accept_offer`，确认弹窗用 `game_ui` |
| 物品、背包、柜台、机器内部 | `game_inventory`、`game_item`、`game_machines` | `move_item`、`open_item`、`apply_item`、`use_item`、`item_menu` |
| 展示柜和垃圾桶 | `game_display`、`game_trash` | `move_item` 到 `showcase`。垃圾桶用 `trashItemId` 打开，读桶内真实网格后取放 |
| 睡觉及夜间服务 | `game_sleep` | `open_sleep`、`set_nightly_service`、`confirm_sleep`、`close_sleep` |
| 电话、电话卡和对话 | `game_phone`、`game_dialogue` | `open_phone`、`dial`、`hang_up`、`advance_dialogue`、`choose_dialogue` |
| 经销商订货、送货和整批购买 | `game_phone`、`game_trade` | 见 [电话经销商与批发](phone-suppliers.md) |
| 欠款、租金、服务 | `game_finances`、`game_sleep` | `open_debts`、`open_services`，读取金额后操作对应面板 |
| 文件、笔记本、录音、报纸 | `game_documents`、`game_calendar` | `open_notebook`、`open_recorder`、`open_calendar`，文件用 `open_item` 或 `use_item` |
| 委托、派系、网络升级 | `game_requests`、`game_reputation`、`game_terminal` | `open_terminal` 打开店内委托电脑。王尔德的关系网由 NPC 或电话对话进入 |
| 真伪、估价 | `game_inspection` | 用手持放大镜 `apply_item` 到可检查物品，读取线索并使用面板或 `submit_appraisal` |
| 水质、化学品和植物检测 | `game_inspection.tests` | `apply_item` 使用对应仪器，按面板给出的可用控件操作 |
| 军需与兑换 | `game_commissary` | `buy_commissary`、`redeem_stamps`、`redeem_lottery` |
| 售卖机、饮水机、彩票、街机 | `game_vending`、`game_lottery`、`game_arcade` | `open_vending`、`open_fountain`、`scratch`、`hotkey` |
| 夜间外出、拾荒、治安与店内战斗 | `game_map`、`game_exploration`、`game_security` | 见 [探索与事件](exploration.md) |

## 店铺循环

1. 读取余额、租金倒计时、日历和库存。展示柜用于吸引对相应商品感兴趣的顾客。用 `open_clientele` 后读取 `game_display.clientele`，核对由招牌、展示品和证书影响的来客预估。
2. 送客前读完当前顾客的介绍，确认对方是否同时买货和卖货。有收货意向时，按品类和预算检查仓储、展示柜与交易柜台，把拟出售的货移到 `back` 再读报价。行情、品相和买家限制以当前交易为准。
3. 议价前查可接受价格和可能的声誉代价。折扣可能提高买家预算，先比较折扣前后的可成交数量与实收。批发前按货物尺寸检查实际能放下多少。成交后核对现金变动、物品归属和数量，尤其是要求品类多样的订单。顾客离开前把已购物品从 `front` 移入可控仓位，再确认无遗留。
4. 打烊前处理必需剧情和剩余排队。确认打烊提示可能意味着放弃剩余顾客。之后可外出或打开睡觉面板。
5. 睡前先用 `game_sleep` 读取每项服务的 `id`、选中状态、费用、强制标记和冷却。按目标传 `{"action":"set_nightly_service","serviceId":"实际 ID","enabled":true}`，重读总价，再确认入睡。睡觉会推进日期并触发自动存档。醒来先读 `game_sleep.morningReport`，再核对实际库存、机器产出、到账款项和财务状态。有预定交付时，也查看营业中的 `front` 与来访状态。

## 电话卡、电话簿和剧情

`game_phone.contacts` 是电话簿，`game_phone.cards` 是这局持有或可见的实体名片。卡可能留在柜台、库存或档案箱。常见标识包括 `joe_card`、`card_brewer`、`card_mining`、`card_pharma`、`card_chem` 和 `card_rev`。使用返回的号码，即使 `inPhoneBook` 仍为 false。纸面名片有额外文字时按其 `itemId` 激活并读取 `game_ui`。号码有效也可能因前置条件或冷却暂时不接。

打开电话后用 `dial` 和返回的 `number`。默认按原版手拨流程等待接通，`quick:true` 使用电话簿快捷拨号，有些联系人两种拨号会说不同的话。电话对话用 `channel:"phone"`，柜台对话用 `channel:"store"`。只选择 `enabled:true` 的当前选项索引。电话状态、回电和到店是不同阶段，通话后重读两者。忘记来龙去脉时用对话历史或录音机。

`game_dialogue.response` 是原版物品式选择面板。用 `choose_response` 传面板的 `id` 到 `identifier`，同时传当前选择的 `index`。

## 容器与通用控件

`game_inventory` 的 `areas` 列出仓位角色、格子大小、容器父物品、可见性与锁定。把食物放到交易柜台使用 `move_item` 的 `destination:"back"`，同一格网内整理时给出 `column` 和 `row`。容器、机器、工具作用、堆叠、零件和液体交互可用 `apply_item` 将源物品用到另一件物品上。先用 `game_item` 查标签、配方、能力和数量，完成后重读两个对象。物品 ID 会随拆分、堆叠和消耗改变。

指定格位时可一起传 `orientation`（0 到 3）和 `flipped`。多选用 `select_group` 从空格拉到 `endColumn`、`endRow`，再用 `game_inventory.selection` 校验。`move_group` 用选中的锚点物品和目标格，`clear_selection` 取消。物品操作也包括 `activate_item`、`equip_item`、`configure_item`、`toggle_item`、`unload_item`、`pin_item`。原版排序和撤销对应 `sort_inventory` 与 `undo_sort`。

不规则设备仓的 `blockedCells` 中 1 表示禁放格，物品 `occupiedCells` 中 1 表示占格。精确堆叠使用 `stack_item` 并给出目标物品及数量。按快捷键移动物品时用 `select_item` 配合 `modifier` 绑定，例如 `quick_move_inventory`。需要对物品触发悬停快捷键时用 `hotkey` 并传对应 `itemId`。用 `game_inventory` 确认当前选中或装备的工具。

交易台的秤、报纸、笔记可作为原版证据。先读 `game_trade.evidence`，用 `select_trade_evidence` 选择对应工具或笔记，再对需要它的当前报价特征调用 `expose_trade_feature`。核对特征是否已揭示及是否触发新对话。

进入王尔德关系网后，从 `game_terminal` 查看当前选中的升级、资金、人情、前置条件及冷却，再用原版升级格和确认控件购买。关系网和店内委托电脑各有各的入口。

临时面板通过 `game_ui` 过滤 `category` 或 `query`。点选控件使用 `activate`，改 Toggle 用 `enabled`，滑块用 `value`，范围滑块加 `high`，下拉和标签页用 `index`。用 `scroll` 查找未出现在当前列表视口的条目。需要文字时用 `type` 和对应输入控件 ID。没有进一步授权时，跳过跳到外部网站、退出游戏或覆盖存档的菜单项。

`game_ui.openPanels` 将打开的窗口按前后顺序列出。每项有正文、控件、信息图标说明和可用的关闭按钮 ID。`modal:true` 表示原版确认或选择提示，读正文再决定。`actionable:false` 的控件可能被遮挡或当前无法操作。日历的夜间报告是 `adv_calendar` 中的 `nightly_report`，交易平板是 `negociation_ui`。用 `category` 传面板 ID 或 `windowId` 可单独读取。`hints.visible` 是当前悬浮提示或通知，`recentNotifications` 保留刚消失的短通知。

两个容器重叠时，从 `game_ui.windows` 读取 `windowId`，分别用 `move_window` 放到 `left`、`right` 等位置。用完自己打开的二级界面后，用最新 `windowId` 或 `game_ui.openPanels.closeTarget` 调用 `close_window`，再读 `game_ui` 确认；有确认框先阅读并按目标处理。不要关闭玩家原本打开或还需使用的界面。可滚动库存用 `scroll_inventory` 和仓位 ID。
