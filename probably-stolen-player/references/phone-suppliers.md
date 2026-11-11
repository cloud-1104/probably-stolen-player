# 电话经销商与批发

适用 Steam Build 26525552（100-Rev13）和 Game MCP 1.2.3。

## 打电话和选套餐

1. 用 `game_phone.cards` 找实体名片，或用 `game_phone.contacts` 找电话簿联系人。先 `open_phone` 再 `dial`。电话簿快捷拨号可传 `quick:true`。首次通话通常要完整推进介绍。
2. 用 `game_phone.activeCall` 读当前原版台词、选项和 `index`。`offer.advertisedQuantity` 是电话写的数量，`advertisedDays` 是电话所说的时间。`price:null` 表示电话阶段没有整批结算价。
3. 用 `game_action` 传 `{"action":"choose_dialogue","channel":"phone","index":实际序号}` 选择当前启用的选项。继续推进通话，查看 `game_phone.visits.scheduled` 的剩余天数和 `visits.waiting` 的排队情况。早晨拨号的实际排期可能比台词多一天。
4. 联系人的 `state` 和 `cooldown` 表示原版供货状态。`canAnswer` 只表示电话能接通；对方在冷却时也可能接起电话告知缺货。下单会进入冷却。首通赠样会单独排期。

| 联系人 | 常规订货 | 大单解锁 |
| --- | --- | --- |
| 红小鬼啤酒经销商 | 电话显示 8 或 16 份啤酒 | 向该供货方累计消费 400 |
| Caulson 矿业供货商 | 电话显示 6 或 12 份矿石 | 累计消费 350 |
| Dale 药品供货商 | 电话显示 5 或 9 支奥克西莫注射器 | 累计消费 500 |
| Ashish 化学品供货商 | 电话显示 8 或 16 份梦尘 | 累计消费 400 |
| Odin 革命商人 | 通话约他到店，由玩家向他出售商品。打开平板后用 `game_trade.customer` 核对意向和预算 | 镇压和黑名单会影响通话 |
| 王尔德的助手 | 选浏览服务后推进台词，进入王尔德关系网 | 打开后用 `game_terminal` 读人情、升级及费用 |

## 到店、核对和购买

1. 送货人到店后，读完介绍，让货物摆到柜台。用 `game_trade.supplierVisit` 区分送货和免费样品。免费样品直接归玩家，按库存核对。
2. 付费货物用 `open_trade` 打开原版交易平板。读 `game_trade.wholesale` 的实时报价 `price`、折扣 `wholesaleDiscount`、实际货物和 `ready`。以实际交付数量和整批价为准。Dale 的大单电话写 9 支，这个 Build 的到店代码摆出 10 支。
3. 在 `ready:true` 且价格符合玩家目标时，用 `buy_wholesale` 提交原版整批购买。可以同时传 `maxPrice` 限制本次能接受的整批总价。完成后重读 `game_trade` 和 `game_inventory` 核对扣款、归属和数量。

Ashish 同时收货和供货。若 `blockedReason` 为 `player_goods_on_back_counter`，把 `competingItems` 中玩家自己的货移回库存再重读报价。这样可以让原版平板从玩家卖货切回整批购买。

电话订单、到店报价和付款是三个阶段。整批订单可能锁定单件购买。Odin 的电话选项标为 `sell_to_merchant`，王尔德的服务选项会转入关系网，两者走各自的原版面板。
