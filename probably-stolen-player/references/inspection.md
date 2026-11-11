# 玩家视角鉴定

适用 Steam Build 26525552（100-Rev13）和 Game MCP 1.2.3。

1. 用 `game_inventory` 找手持放大镜 `magnifier` 和商品。通过 `game_action` 调用 `apply_item`，将放大镜的 ID 传给 `itemId`，商品的 ID 传给 `targetItemId`。
2. 用 `game_inspection` 确认面板和商品匹配，再读 `evidence`。字段只描述面板当前显示的部件、印字和外观。字段为空时，说明此处没有可读取的线索。
3. `item.authenticity.claim` 是原版公开的标称情况。`status: "unrevealed"` 时，按当前线索提出判断。证据不足时保留不确定性。等原版揭示后，`game_item` 和 `game_inspection` 才会返回 `verdict` 和原版结果文案。商品从某个区域移到另一个区域后可用原运行 ID 重读。
4. 质疑面板开放时，用 `game_ui` 读取具体选项，或使用 `game_inspection.controls`。用 `set_control` 选定一项证据，再用 `activate` 提交。对质会关闭检查面板。继续读 `game_dialogue` 并推进原版对话，然后用原商品 ID 调用 `game_item` 核对结果。对质失败后仍可能没有揭示。

## 原版样张的对照要点

| 品类 | 对照要点 |
| --- | --- |
| Hemingway 香烟 | 比对完整圆形封条、花体品牌字样、菱形细枝徽记和红米双色盒身。仅在对应部件可见时判断。撕开的封条、拼字变化、徽记方向变化和盒面偏色属于不同的质疑理由。 |
| 共和国粮票 | 比对深蓝细体三行 `REPUBLIC / SOCIAL / PROGRAM`、带圆环的菱形十字徽记和铜棕色芯片。原版 160 信用点及以上的常规真票带金色封印，小额真票也可能无封印。 |
| Immunivax 注射器 | 核对标签 `Carmicheal Pharmaceutical` 与 `Immunivax`。常规序列号是 7 位，前三位在 125–455。召回前缀为 250、251、301、355、385、386、421。用标签、序列号、壳体和灯色区分仿冒与过期或不可用。绿色、橙色和红色是观察线索，原版揭示前仅表述推断。 |

等离子电池、肋肉三明治、义手和浆果也有独立外观描述，适合用于估值。估价客户到店时，用 `game_inspection.appraisal.pendingItems` 找柜台上的待估品，使用放大镜后提交 `submit_appraisal` 与 `amount`。客户接受后会在柜台留下收据，用 `appraisal.receipts` 读取最近 12 张持有收据中的评分、报价、真值和费用。更早的收据可从库存找到后用 `game_item` 读取。客户拒绝时，先读原版对话的反馈。估价与真伪揭示是独立流程。

## 其他检测面板

| 用具 | 读取方式 |
| --- | --- |
| 水质试纸 `water_test_strip` | 用在液体容器上，再读 `game_inspection.tests.waterStrip` 的标称、检测结果、纯度。 |
| 水质扫描仪 `aquascan` | 读 `tests.waterScanner` 的检测结果和污染物。 |
| 化学扫描仪 `chem_scanner` | 读 `tests.chemicalScanner` 的标称、检测结果、成分、可见作用和体积。 |
| 植物分析仪 `plant_analyser` | 读 `tests.plantAnalyser` 的营养范围、耗水、污染敏感度和其它说明。 |

上述字段对应原版当前开启的面板。若结果还没显示，等待片刻再读。原版允许质疑或对齐标签时，使用对应 `confront.target` 或 `matchLabel.target`，只激活 `enabled: true` 的按钮。金属纯度或耐久若已被原版公开，则从 `game_item.tooltip` 查看已检测结果。本版本没有核实正常玩法中可用的独立金属纯度分析仪。商家的标称和物品估值都可以作为公开报价线索。
