/* ============================================
   飞机设计工程学 - 填空题题库 (114题)
   严格按 知识点总结-飞机设计工程学.pdf 顺序
   每个空的答案与原文档下划线位置精确匹配
   ============================================ */

var QUESTION_BANK = [
  // Q1
  { id: 1, text: "{{1}}的方法是飞机总体设计处理问题的基础。",
    blanks: [{ id: 1, answer: "系统工程", alternatives: [] }],
    domain: "飞机总体设计基础", difficulty: 1 },
  // Q2
  { id: 2, text: "1995年，总参、国防科工委等发布了《常规武器装备研制程序》规定了新飞机的研制五阶段，包括论证阶段、{{1}}、工程研制阶段、设计定型阶段、生产定型阶段。",
    blanks: [{ id: 1, answer: "方案阶段", alternatives: [] }],
    domain: "飞机总体设计基础", difficulty: 2 },
  // Q3
  { id: 3, text: "第四代战斗机21世纪初开始服役，突出{{1}}、{{2}}、高机动性和高敏捷性。",
    blanks: [
      { id: 1, answer: "隐身能力", alternatives: [] },
      { id: 2, answer: "超音速巡航能力", alternatives: [] }
    ],
    domain: "飞机总体设计基础", difficulty: 1 },
  // Q4
  { id: 4, text: "现代干线客机典型气动布局应用的翼型包括{{1}}和高效亚音速翼型。",
    blanks: [{ id: 1, answer: "超临界翼型", alternatives: [] }],
    domain: "气动布局与翼型", difficulty: 2 },
  // Q5
  { id: 5, text: "飞机机体结构重量的减轻主要通过采用优质金属材料和{{1}}。",
    blanks: [{ id: 1, answer: "复合材料", alternatives: ["先进复合材料"] }],
    domain: "结构与材料", difficulty: 1 },
  // Q6
  { id: 6, text: "第五代干线飞机的操纵系统通过引入{{1}}，并用液晶平板显示代替驾驶舱的阴极射像管显示。",
    blanks: [{ id: 1, answer: "电传操纵系统", alternatives: ["电传操纵"] }],
    domain: "操纵系统", difficulty: 2 },
  // Q7
  { id: 7, text: "中远程轰炸机要有一定的超音速突防能力，一般采用{{1}}。",
    blanks: [{ id: 1, answer: "变后掠机翼", alternatives: ["变后掠翼"] }],
    domain: "气动布局与翼型", difficulty: 2 },
  // Q8
  { id: 8, text: "飞机的基本型式大致可分为正常式、无尾式、{{1}}和三翼面等。",
    blanks: [{ id: 1, answer: "鸭式", alternatives: [] }],
    domain: "气动布局与翼型", difficulty: 1 },
  // Q9
  { id: 9, text: "现代飞机机翼基本平面形状有：直机翼、后掠翼和{{1}}等。",
    blanks: [{ id: 1, answer: "三角翼", alternatives: [] }],
    domain: "气动布局与翼型", difficulty: 1 },
  // Q10
  { id: 10, text: "大后掠机翼的高速特性较好，小后掠机翼的低速特性较好，要兼顾高速和低速性能，可采用{{1}}。",
    blanks: [{ id: 1, answer: "变后掠机翼", alternatives: ["变后掠翼"] }],
    domain: "气动布局与翼型", difficulty: 2 },
  // Q11
  { id: 11, text: "前掠翼存在{{1}}问题，需要通过各向异性材料来解决。",
    blanks: [{ id: 1, answer: "弯扭耦合或气动弹性发散", alternatives: ["弯扭耦合", "气动弹性发散"] }],
    domain: "气动布局与翼型", difficulty: 3 },
  // Q12
  { id: 12, text: "机翼在机身上的上下位置，通常有三种型式，分别是上单翼、{{1}}和下单翼。",
    blanks: [{ id: 1, answer: "中单翼", alternatives: [] }],
    domain: "气动布局与翼型", difficulty: 1 },
  // Q13
  { id: 13, text: "鸭式布局存在两种型式，远距耦合的操纵鸭翼和近距耦合的{{1}}。",
    blanks: [{ id: 1, answer: "升力鸭翼", alternatives: [] }],
    domain: "气动布局与翼型", difficulty: 2 },
  // Q14
  { id: 14, text: "垂直尾翼一般安装在机身尾部，通常由固定在机身上的垂直安定面和可动的{{1}}组成。",
    blanks: [{ id: 1, answer: "方向舵", alternatives: [] }],
    domain: "尾翼与起落架", difficulty: 1 },
  // Q15
  { id: 15, text: "常见的起落架配置型式包括后三点式、前三点式和{{1}}。",
    blanks: [{ id: 1, answer: "自行车式", alternatives: [] }],
    domain: "尾翼与起落架", difficulty: 1 },
  // Q16
  { id: 16, text: "机身形状可分为正常式机身和{{1}}机身，主要按其使用功能要求确定。",
    blanks: [{ id: 1, answer: "尾撑式", alternatives: [] }],
    domain: "尾翼与起落架", difficulty: 1 },
  // Q17
  { id: 17, text: "确定飞机主要设计参数的方法有两种，分别是原准统计法和{{1}}。",
    blanks: [{ id: 1, answer: "统计分析法", alternatives: [] }],
    domain: "主要设计参数", difficulty: 2 },
  // Q18
  { id: 18, text: "在众多的飞机设计参数中，最重要的参数有三个，分别为正常起飞重量、动力装置的海平面静推力以及{{1}}。由这三个参数可以引出两个相对参数：{{2}}和起飞推重比。",
    blanks: [
      { id: 1, answer: "机翼面积", alternatives: [] },
      { id: 2, answer: "起飞翼载荷", alternatives: ["翼载荷"] }
    ],
    domain: "主要设计参数", difficulty: 3 },
  // Q19
  { id: 19, text: "亚声速时，升阻比直接取决于两个设计因素展弦比以及{{1}}，或者合起来可认为取决于浸湿展弦比。",
    blanks: [{ id: 1, answer: "浸湿面积", alternatives: [] }],
    domain: "主要设计参数", difficulty: 2 },
  // Q20
  { id: 20, text: "其他条件相同时，推重比越大，则相对密度{{1}}，即飞机的静升限{{2}}。",
    blanks: [
      { id: 1, answer: "越小", alternatives: [] },
      { id: 2, answer: "越高", alternatives: [] }
    ],
    domain: "飞行性能", difficulty: 2 },
  // Q21
  { id: 21, text: "其他条件不变时，推重比越大，翼载荷越小，则起飞滑跑距离{{1}}。",
    blanks: [{ id: 1, answer: "越短", alternatives: [] }],
    domain: "飞行性能", difficulty: 1 },
  // Q22
  { id: 22, text: "雷达散射截面积RCS越大，飞机越{{1}}被探测到，隐身性能越{{2}}。",
    blanks: [
      { id: 1, answer: "容易", alternatives: [] },
      { id: 2, answer: "差", alternatives: [] }
    ],
    domain: "隐身与雷达", difficulty: 1 },
  // Q23
  { id: 23, text: "飞机设计对发动机的要求可以综合为三个相对参数的要求，即推重比大、单位迎面推力大、{{1}}。",
    blanks: [{ id: 1, answer: "耗油率低", alternatives: ["低耗油率"] }],
    domain: "动力装置与进气道", difficulty: 2 },
  // Q24
  { id: 24, text: "当飞行速度一定时，活塞发动机的功率随飞行高度的增加而{{1}}。",
    blanks: [{ id: 1, answer: "减小", alternatives: [] }],
    domain: "动力装置与进气道", difficulty: 1 },
  // Q25
  { id: 25, text: "螺旋桨的拉力随飞行速度的增加而{{1}}，随飞行高度的增加而{{2}}。",
    blanks: [
      { id: 1, answer: "减小", alternatives: [] },
      { id: 2, answer: "减小", alternatives: [] }
    ],
    domain: "动力装置与进气道", difficulty: 1 },
  // Q26
  { id: 26, text: "涡扇发动机的外涵道和内涵道的空气流量之比称为{{1}}。",
    blanks: [{ id: 1, answer: "涵道比", alternatives: [] }],
    domain: "动力装置与进气道", difficulty: 1 },
  // Q27
  { id: 27, text: "提高临界马赫数的措施包括：采用很尖的薄翼型，或者采用{{1}}翼型。",
    blanks: [{ id: 1, answer: "超临界", alternatives: [] }],
    domain: "气动布局与翼型", difficulty: 1 },
  // Q28
  { id: 28, text: "对于低速飞机，采用相对弯度{{1}}的翼型，对于高速飞机，选择相对弯度{{2}}的翼型或者对称翼型。",
    blanks: [
      { id: 1, answer: "大", alternatives: [] },
      { id: 2, answer: "小", alternatives: [] }
    ],
    domain: "气动布局与翼型", difficulty: 2 },
  // Q29
  { id: 29, text: "机翼上反可以{{1}}飞机的横向静稳定性。",
    blanks: [{ id: 1, answer: "增加", alternatives: ["增强", "提高"] }],
    domain: "气动布局与翼型", difficulty: 1 },
  // Q30
  { id: 30, text: "后缘襟翼一般布置在机翼后缘的内侧，主要型式有{{1}}、简单式、后退式、开缝式。",
    blanks: [{ id: 1, answer: "开裂式", alternatives: [] }],
    domain: "气动布局与翼型", difficulty: 2 },
  // Q31
  { id: 31, text: "尾翼包括三个功用，配平、{{1}}和操纵。",
    blanks: [{ id: 1, answer: "稳定", alternatives: [] }],
    domain: "尾翼与起落架", difficulty: 1 },
  // Q32
  { id: 32, text: "高速空气动力学表明，流经飞机的气流扰动仅与飞机机体的{{1}}分布相关，而与机体外形无关。",
    blanks: [{ id: 1, answer: "横截面积", alternatives: [] }],
    domain: "主要设计参数", difficulty: 2 },
  // Q33
  { id: 33, text: "前三点式起落架的主要几何参数包括：{{1}}、前主轮距、停机角、着地角、防后倒立角、起落架高度。",
    blanks: [{ id: 1, answer: "主轮距", alternatives: [] }],
    domain: "尾翼与起落架", difficulty: 2 },
  // Q34
  { id: 34, text: "超音速进气道的压缩形式主要有三种：外压式、{{1}}、混合式。",
    blanks: [{ id: 1, answer: "内压式", alternatives: [] }],
    domain: "动力装置与进气道", difficulty: 2 },
  // Q35
  { id: 35, text: "超音速进气道的主要压力损失是激波损失，一般情况下，斜激波数目越多，总压恢复系数{{1}}。",
    blanks: [{ id: 1, answer: "越大", alternatives: [] }],
    domain: "动力装置与进气道", difficulty: 2 },
  // Q36
  { id: 36, text: "尾喷管的主要形式分为四种，分别是{{1}}、引射喷管、可调收敛-扩散喷管、矢量喷管。",
    blanks: [{ id: 1, answer: "收敛喷管", alternatives: [] }],
    domain: "动力装置与进气道", difficulty: 2 },
  // Q37
  { id: 37, text: "超音速进气道压缩面上往往需要进行附面层抽吸，以提高进气道总压恢复系数，主要的机身附面层排除措施有：台阶式隔道、{{1}}、抽吸型附面层隔道、沟槽式附面层隔道等。",
    blanks: [{ id: 1, answer: "附面层旁路管道", alternatives: [] }],
    domain: "动力装置与进气道", difficulty: 3 },
  // Q38
  { id: 38, text: "隐埋式发动机的进气道位置有：{{1}}、机身两侧进气、腹部进气、腋窝进气、背部进气、后机身上方进气以及机翼前缘进气等。",
    blanks: [{ id: 1, answer: "机头进气", alternatives: [] }],
    domain: "动力装置与进气道", difficulty: 2 },
  // Q39
  { id: 39, text: "飞机在巡航状态飞行时，应具有{{1}}的升阻比，最低的油耗，同时飞机的阻力应该最小。",
    blanks: [{ id: 1, answer: "最大", alternatives: [] }],
    domain: "飞行性能", difficulty: 1 },
  // Q40
  { id: 40, text: "飞机在起飞着陆状态应具有{{1}}的可用升力系数，以改善飞机的低速性能，缩短起飞着陆滑跑距离，并改善机动性。",
    blanks: [{ id: 1, answer: "最大", alternatives: [] }],
    domain: "飞行性能", difficulty: 1 },
  // Q41
  { id: 41, text: "对于机动类飞机，应该布置{{1}}，以保证飞机倒飞时供油不致中断。",
    blanks: [{ id: 1, answer: "倒飞油箱", alternatives: [] }],
    domain: "飞行性能", difficulty: 2 },
  // Q42
  { id: 42, text: "平飞最小需用推力在{{1}}升阻比时达到，喷气式飞机的最大航程在{{2}}状态时达到，最大续航时间在{{3}}状态时达到。",
    blanks: [
      { id: 1, answer: "最大", alternatives: [] },
      { id: 2, answer: "0.866倍最大升阻比", alternatives: [] },
      { id: 3, answer: "最大升阻比", alternatives: [] }
    ],
    domain: "飞行性能", difficulty: 3 },
  // Q43
  { id: 43, text: "螺旋桨飞机的最大航程在{{1}}升阻比状态时达到，最大航时在{{2}}状态达到。",
    blanks: [
      { id: 1, answer: "最大", alternatives: [] },
      { id: 2, answer: "0.866倍最大升阻比", alternatives: [] }
    ],
    domain: "飞行性能", difficulty: 3 },
  // Q44
  { id: 44, text: "增升装置主要是增加翼型的{{1}}、并对附面层进行控制，推迟翼面上的气流分离。",
    blanks: [{ id: 1, answer: "相对弯度", alternatives: [] }],
    domain: "飞行性能", difficulty: 2 },
  // Q45
  { id: 45, text: "增升装置推迟翼面上的气流分离，增大机翼的{{1}}，对后退式襟翼，还增大了机翼面积。",
    blanks: [{ id: 1, answer: "最大升力系数", alternatives: [] }],
    domain: "飞行性能", difficulty: 1 },
  // Q46
  { id: 46, text: "我国规定，飞机的寿命周期分为四个阶段，分别是{{1}}、采购阶段、使用保障阶段、退役处置阶段。",
    blanks: [{ id: 1, answer: "研制阶段", alternatives: [] }],
    domain: "飞机总体设计基础", difficulty: 2 },
  // Q47
  { id: 47, text: "飞机寿命周期费用以发生的时间阶段可分为：{{1}}、生产费用、地面保障设施与最初的备件费用、专用设施费用、使用保障/维护费用以及处置费等。",
    blanks: [{ id: 1, answer: "研究、发展、试验与鉴定费用", alternatives: ["研究发展试验与鉴定费用"] }],
    domain: "飞机总体设计基础", difficulty: 2 },
  // Q48
  { id: 48, text: "寿命周期分析方法主要有三种：{{1}}、参数法、工程估算法。",
    blanks: [{ id: 1, answer: "类比法", alternatives: [] }],
    domain: "飞机总体设计基础", difficulty: 1 },
  // Q49
  { id: 49, text: "飞机作战能力的评估方法大概可以分为五类：性能对比法、{{1}}、专家评估法、空战仿真法、实验统计法。",
    blanks: [{ id: 1, answer: "解析及算法", alternatives: ["解析法"] }],
    domain: "飞机总体设计基础", difficulty: 2 },
  // Q50
  { id: 50, text: "飞机效费权衡分析的目标就是要追求高的{{1}}。而不应该是片面追求高的效能，或者片面追求低的寿命周期费用。",
    blanks: [{ id: 1, answer: "效费比", alternatives: [] }],
    domain: "飞机总体设计基础", difficulty: 1 },
  // Q51
  { id: 51, text: "经过合理设计的翼型（具有一定的弯度、厚度）与空气相对运动时会产生{{1}}，作用于压心，增量作用于焦点。",
    blanks: [{ id: 1, answer: "升力", alternatives: [] }],
    domain: "结构力学", difficulty: 2 },
  // Q52
  { id: 52, text: "机翼在气动力作用下会发生弯曲变形。当作用力通过{{1}}时，机翼仅出现弯曲变形，当作用力未通过刚心时，机翼同时弯曲和{{2}}。",
    blanks: [
      { id: 1, answer: "刚心", alternatives: [] },
      { id: 2, answer: "扭转", alternatives: [] }
    ],
    domain: "结构力学", difficulty: 3 },
  // Q53
  { id: 53, text: "飞行器在空气动力作用下发生弹性变形，这种变形反过来又使空气动力随之改变，从而导致进一步的弹性变形，这样就构成了一种结构变形与空气动力交互作用的{{1}}现象。",
    blanks: [{ id: 1, answer: "气动弹性", alternatives: [] }],
    domain: "气动弹性", difficulty: 1 },
  // Q54
  { id: 54, text: "飞机结构通常包括: {{1}}、{{2}}、{{3}}、发动机短舱、起落架、操纵系统及其他系统的结构件。",
    blanks: [
      { id: 1, answer: "机身", alternatives: [] },
      { id: 2, answer: "机翼", alternatives: [] },
      { id: 3, answer: "尾翼", alternatives: [] }
    ],
    domain: "结构力学", difficulty: 1 },
  // Q55
  { id: 55, text: "承力结构通常包括: {{1}}，纵向构件，横向构件，{{2}}。",
    blanks: [
      { id: 1, answer: "蒙皮", alternatives: [] },
      { id: 2, answer: "接头", alternatives: [] }
    ],
    domain: "结构力学", difficulty: 2 },
  // Q56
  { id: 56, text: "飞机{{1}}与{{2}}所构成的蒙皮结构具有较大承载力及刚度，而自重却很轻，起到{{3}}和{{4}}气动载荷的作用。",
    blanks: [
      { id: 1, answer: "蒙皮", alternatives: [] },
      { id: 2, answer: "骨架", alternatives: [] },
      { id: 3, answer: "承受", alternatives: [] },
      { id: 4, answer: "传递", alternatives: [] }
    ],
    domain: "结构力学", difficulty: 2 },
  // Q57
  { id: 57, text: "长桁的功能是：长桁承受局部空气力载荷；支持和加强蒙皮；并将{{1}}互相连系起来。",
    blanks: [{ id: 1, answer: "翼肋", alternatives: [] }],
    domain: "结构力学", difficulty: 2 },
  // Q58
  { id: 58, text: "机翼受到弯曲时，上、下翼面的长桁产生{{1}}和{{2}}的轴向力，形成弯矩。",
    blanks: [
      { id: 1, answer: "拉伸", alternatives: [] },
      { id: 2, answer: "压缩", alternatives: [] }
    ],
    domain: "结构力学", difficulty: 2 },
  // Q59
  { id: 59, text: "支撑蒙皮承受气动载荷的元件是{{1}}和{{2}}。",
    blanks: [
      { id: 1, answer: "长桁", alternatives: [] },
      { id: 2, answer: "翼肋", alternatives: [] }
    ],
    domain: "结构力学", difficulty: 2 },
  // Q60
  { id: 60, text: "支撑长桁承受气动载荷的元件是{{1}}。",
    blanks: [{ id: 1, answer: "翼肋", alternatives: [] }],
    domain: "结构力学", difficulty: 2 },
  // Q61
  { id: 61, text: "在盒段中，{{1}}、{{2}}、{{3}}及{{4}}与翼肋相连接，故翼肋是被支持在一个由这些元件组成的多闭室盒式梁上。",
    blanks: [
      { id: 1, answer: "蒙皮", alternatives: [] },
      { id: 2, answer: "长桁", alternatives: [] },
      { id: 3, answer: "梁缘", alternatives: [] },
      { id: 4, answer: "梁(墙)腹板", alternatives: ["梁腹板", "墙腹板"] }
    ],
    domain: "结构力学", difficulty: 3 },
  // Q62
  { id: 62, text: "翼肋把自身收集的气动载荷传递给由{{1}}、{{2}}组成的单闭室薄壁梁结构。",
    blanks: [
      { id: 1, answer: "蒙皮壁板", alternatives: ["蒙皮"] },
      { id: 2, answer: "翼梁腹板", alternatives: ["梁腹板"] }
    ],
    domain: "结构力学", difficulty: 3 },
  // Q63
  { id: 63, text: "机翼中，{{1}}对剪切具有最佳受力特性，提供支撑刚度最大，所以剪力由{{1}}来承受。",
    blanks: [{ id: 1, answer: "梁腹板", alternatives: ["翼梁腹板"] }],
    domain: "结构力学", difficulty: 2 },
  // Q64
  { id: 64, text: "在对称/反对称的弯矩、剪力和扭矩中，能够在中央翼中实现自平衡的载荷有{{1}}、{{2}}。",
    blanks: [
      { id: 1, answer: "对称弯矩", alternatives: [] },
      { id: 2, answer: "反对称扭矩", alternatives: [] }
    ],
    domain: "结构力学", difficulty: 3 },
  // Q65
  { id: 65, text: "采用连接接头将机身与机翼进行相互连接的{{1}}连接方式，具有结构简单，不占用机身空间的优势，在中小型飞机中得到广泛的应用。",
    blanks: [{ id: 1, answer: "集中式", alternatives: [] }],
    domain: "结构力学", difficulty: 2 },
  // Q66
  { id: 66, text: "力学性能是指材料受力时在{{1}}和{{2}}方面表现出来的性能。",
    blanks: [
      { id: 1, answer: "强度", alternatives: [] },
      { id: 2, answer: "变形", alternatives: [] }
    ],
    domain: "材料力学性能", difficulty: 1 },
  // Q67
  { id: 67, text: "描述材料承载能力的强度指标有：{{1}}、{{2}}、{{3}}。",
    blanks: [
      { id: 1, answer: "比例极限", alternatives: [] },
      { id: 2, answer: "屈服强度", alternatives: [] },
      { id: 3, answer: "极限强度", alternatives: [] }
    ],
    domain: "材料力学性能", difficulty: 2 },
  // Q68
  { id: 68, text: "描述材料变形行为特点的指标包括：{{1}}、{{2}}。",
    blanks: [
      { id: 1, answer: "延伸率", alternatives: [] },
      { id: 2, answer: "收缩率", alternatives: ["断面收缩率"] }
    ],
    domain: "材料力学性能", difficulty: 2 },
  // Q69
  { id: 69, text: "在工程中按延伸率区分{{1}}材料和{{2}}材料。",
    blanks: [
      { id: 1, answer: "塑性", alternatives: [] },
      { id: 2, answer: "脆性", alternatives: [] }
    ],
    domain: "材料力学性能", difficulty: 1 },
  // Q70
  { id: 70, text: "{{1}}是指结构元件内力平衡形态发生变化时引起的结构承载能力下降，即出现屈曲变形形态的问题。",
    blanks: [{ id: 1, answer: "结构失稳", alternatives: [] }],
    domain: "结构稳定性", difficulty: 1 },
  // Q71
  { id: 71, text: "当结构的外载荷达到某一值时，若增加一微小扰动，则结构的平衡位置将发生很大的变化，这种情况叫做{{1}}或{{2}}，对应的载荷即通常所说的{{3}}。",
    blanks: [
      { id: 1, answer: "屈曲", alternatives: [] },
      { id: 2, answer: "失稳屈曲", alternatives: ["失稳"] },
      { id: 3, answer: "临界屈曲载荷", alternatives: ["临界载荷"] }
    ],
    domain: "结构稳定性", difficulty: 3 },
  // Q72
  { id: 72, text: "长桁等型材失稳可能有多种形式，当型材有蒙皮或腹板支持时，其主要失稳形式为两类:一为在垂直于蒙皮或腹板平面内轴线发生弯曲的{{1}}；二为型材上局部发生的皱折或压屈失稳。",
    blanks: [{ id: 1, answer: "总体失稳", alternatives: [] }],
    domain: "结构稳定性", difficulty: 2 },
  // Q73
  { id: 73, text: "结构疲劳是指结构在重复载荷作用下经常因疲劳而产生{{1}}，最终导致疲劳破坏，是因循环应力或交变应力而使材料抵抗裂纹扩展和断裂能力减弱的现象。",
    blanks: [{ id: 1, answer: "裂纹", alternatives: [] }],
    domain: "疲劳与断裂", difficulty: 1 },
  // Q74
  { id: 74, text: "疲劳破坏的过程包括：{{1}}、{{2}}、{{3}}和{{4}}。",
    blanks: [
      { id: 1, answer: "裂纹成核阶段", alternatives: ["裂纹成核"] },
      { id: 2, answer: "微观裂纹扩展阶段", alternatives: ["微观裂纹扩展"] },
      { id: 3, answer: "宏观裂纹扩展阶段", alternatives: ["宏观裂纹扩展"] },
      { id: 4, answer: "非稳定扩展阶段", alternatives: ["失稳扩展阶段"] }
    ],
    domain: "疲劳与断裂", difficulty: 3 },
  // Q75
  { id: 75, text: "结构疲劳破坏的断口包括：{{1}}、{{2}}和{{3}}。",
    blanks: [
      { id: 1, answer: "疲劳裂纹源区", alternatives: ["疲劳源区"] },
      { id: 2, answer: "疲劳裂纹扩展区", alternatives: ["裂纹扩展区"] },
      { id: 3, answer: "快速断裂区", alternatives: ["瞬断区"] }
    ],
    domain: "疲劳与断裂", difficulty: 3 },
  // Q76
  { id: 76, text: "疲劳裂纹扩展区具有因裂纹宏观张开闭合形成明显的{{1}}、从疲劳源开始沿弧形向四周推进、垂直裂纹扩展方向、断口粗糙不规则。",
    blanks: [{ id: 1, answer: "疲劳条带", alternatives: ["疲劳辉纹"] }],
    domain: "疲劳与断裂", difficulty: 2 },
  // Q77
  { id: 77, text: "疲劳失效以前所经历的应力或应变循环次数称为{{1}}。",
    blanks: [{ id: 1, answer: "疲劳寿命", alternatives: [] }],
    domain: "疲劳与断裂", difficulty: 1 },
  // Q78
  { id: 78, text: "在一定的循环特征下，材料可以承受无限次应力循环而不发生破坏的最大应力，称为在这一循环特征下的持久极限或{{1}}。",
    blanks: [{ id: 1, answer: "疲劳极限", alternatives: [] }],
    domain: "疲劳与断裂", difficulty: 1 },
  // Q79
  { id: 79, text: "试件和构件的尺寸对其疲劳强度影响极大。一般来说，构件和试样的尺寸增大时，疲劳强度{{1}}。这种疲劳强度随构件尺寸的增大而降低的现象称为{{2}}。",
    blanks: [
      { id: 1, answer: "降低", alternatives: [] },
      { id: 2, answer: "尺寸效应", alternatives: [] }
    ],
    domain: "疲劳与断裂", difficulty: 2 },
  // Q80
  { id: 80, text: "气动弹性问题是指飞机结构中的翼面部件由于结构刚度不足或刚度分配不合理而导致{{1}}与{{2}}相互耦合作用，从而产生复杂效应，甚至导致结构破坏的一类问题。",
    blanks: [
      { id: 1, answer: "气动力", alternatives: [] },
      { id: 2, answer: "结构变形", alternatives: ["弹性变形"] }
    ],
    domain: "气动弹性", difficulty: 1 },
  // Q81
  { id: 81, text: "颤振是气动翼面的一种自激振动。由有关部件的{{1}}、{{2}}和{{3}}的综合作用所引起。",
    blanks: [
      { id: 1, answer: "气动力", alternatives: [] },
      { id: 2, answer: "惯性力", alternatives: [] },
      { id: 3, answer: "弹性特性", alternatives: ["弹性力"] }
    ],
    domain: "气动弹性", difficulty: 2 },
  // Q82
  { id: 82, text: "飞机在使用期间或制造初期允许存在{{1}}，甚至允许主要受力构件发生裂纹。利用断裂力学理论与试验结果，设计使得结构裂纹在{{2}}不危及安全，保证结构有足够的{{3}}、刚度（能继续承载），利用定期检查维修保证飞机结构使用的安全可靠，且不致发生灾难事故。",
    blanks: [
      { id: 1, answer: "缺陷", alternatives: [] },
      { id: 2, answer: "一定限度内", alternatives: [] },
      { id: 3, answer: "剩余强度", alternatives: [] }
    ],
    domain: "疲劳与断裂", difficulty: 2 },
  // Q83
  { id: 83, text: "只有进一步增加外载，才能迫使裂纹继续扩展，则该裂纹属于{{1}}。",
    blanks: [{ id: 1, answer: "稳定扩展", alternatives: [] }],
    domain: "疲劳与断裂", difficulty: 1 },
  // Q84
  { id: 84, text: "裂纹一经开裂，即使外载不增加，裂纹也会迅速扩展下去，则该裂纹属于{{1}}。",
    blanks: [{ id: 1, answer: "非稳定扩展", alternatives: ["失稳扩展"] }],
    domain: "疲劳与断裂", difficulty: 1 },
  // Q85
  { id: 85, text: "机体结构设计的基本任务是:根据飞机型号设计{{1}}，以及据此制定的飞机三面图、总体布置图、外形图和规定的载荷情况、环境情况、使用方法，并结合对结构设计的基本要求，设计出合乎使用要求，且{{2}}、{{3}}、{{4}}、{{5}}品质合格，工艺性良好，满足{{6}}的机体结构。",
    blanks: [
      { id: 1, answer: "技术要求", alternatives: [] },
      { id: 2, answer: "强度", alternatives: [] },
      { id: 3, answer: "刚度", alternatives: [] },
      { id: 4, answer: "疲劳", alternatives: [] },
      { id: 5, answer: "损伤容限", alternatives: [] },
      { id: 6, answer: "重量指标", alternatives: [] }
    ],
    domain: "结构设计", difficulty: 3 },
  // Q86
  { id: 86, text: "新机研制中结构设计工作一般要经过{{1}}、{{2}}、{{3}}、试制与试验、试飞与设计定型和生产定型等六个阶段。",
    blanks: [
      { id: 1, answer: "方案论证", alternatives: [] },
      { id: 2, answer: "初步设计", alternatives: [] },
      { id: 3, answer: "详细设计", alternatives: [] }
    ],
    domain: "结构设计", difficulty: 2 },
  // Q87
  { id: 87, text: "除{{1}}外，作用在飞机某方向上的所有{{2}}（不包括{{1}}）的合力与{{3}}的比值，称为该方向上的{{4}}。",
    blanks: [
      { id: 1, answer: "重力", alternatives: [] },
      { id: 2, answer: "外力", alternatives: [] },
      { id: 3, answer: "当时飞机重量", alternatives: ["飞机重量"] },
      { id: 4, answer: "过载系数", alternatives: [] }
    ],
    domain: "结构设计", difficulty: 3 },
  // Q88
  { id: 88, text: "机翼的设计载荷包括由空气压力和惯性载荷所引起的{{1}}、{{2}}和{{3}}。",
    blanks: [
      { id: 1, answer: "剪力", alternatives: [] },
      { id: 2, answer: "弯矩", alternatives: [] },
      { id: 3, answer: "扭矩", alternatives: [] }
    ],
    domain: "结构设计", difficulty: 1 },
  // Q89
  { id: 89, text: "在各种设计情况下，飞机结构应该保证在使用载荷（或使用环境）作用下，结构不应有{{1}}。",
    blanks: [{ id: 1, answer: "残余的永久变形", alternatives: ["永久变形", "残余变形"] }],
    domain: "结构设计", difficulty: 2 },
  // Q90
  { id: 90, text: "疲劳设计的起点是完好无损的结构，终点是结构中有一处或多处发生开裂，产生{{1}}。",
    blanks: [{ id: 1, answer: "工程可检的裂纹", alternatives: ["可检裂纹"] }],
    domain: "疲劳与断裂", difficulty: 2 },
  // Q91
  { id: 91, text: "适航性包括{{1}}和{{2}}。",
    blanks: [
      { id: 1, answer: "初始适航性", alternatives: [] },
      { id: 2, answer: "持续适航性", alternatives: [] }
    ],
    domain: "结构设计", difficulty: 2 },
  // Q92
  { id: 92, text: "结构设计应当保证结构有足够的强度、刚度、寿命和损伤容限，不出现不允许的气动弹性问题和振动问题，在这些条件得到满足的前提下，使得结构的重量尽可能{{1}}。",
    blanks: [{ id: 1, answer: "轻", alternatives: [] }],
    domain: "结构设计", difficulty: 1 },
  // Q93
  { id: 93, text: "安全系数是指{{1}}与{{2}}的比值。一般取{{3}}。",
    blanks: [
      { id: 1, answer: "设计载荷", alternatives: [] },
      { id: 2, answer: "使用载荷", alternatives: [] },
      { id: 3, answer: "1.5", alternatives: [] }
    ],
    domain: "结构设计", difficulty: 1 },
  // Q94
  { id: 94, text: "避免有害的气动弹性问题，要求结构不仅要有足够的静强度，而且还应有足够的{{1}}，不仅要避免结构处于共振点附近，而且还要保证结构不出现过大的变形而影响飞机性能。",
    blanks: [{ id: 1, answer: "刚度", alternatives: [] }],
    domain: "结构设计", difficulty: 2 },
  // Q95
  { id: 95, text: "操纵系统是按{{1}}设计的。",
    blanks: [{ id: 1, answer: "刚度", alternatives: [] }],
    domain: "操纵系统", difficulty: 1 },
  // Q96 - 原文档无下划线，为陈述知识点
  { id: 96, text: "飞机飞行操纵系统的传动机构包括硬式传动机构、软式传动机构和混合式等类型。",
    blanks: [],
    domain: "操纵系统", difficulty: 1, _note: "原文档无下划线，为陈述题" },
  // Q97
  { id: 97, text: "飞机飞行操纵系统在设计过程中，除过强度、刚度、重量等一般设计要求，所必须的特殊要求为{{1}}和{{2}}。",
    blanks: [
      { id: 1, answer: "保证驾驶员能正常操纵飞机", alternatives: [] },
      { id: 2, answer: "具有良好的动态品质", alternatives: [] }
    ],
    domain: "操纵系统", difficulty: 2 },
  // Q98
  { id: 98, text: "飞机主操纵系统是用来操纵副翼、方向舵和{{1}}，以改变或保持飞机的飞行状态。",
    blanks: [{ id: 1, answer: "升降舵", alternatives: [] }],
    domain: "操纵系统", difficulty: 1 },
  // Q99
  { id: 99, text: "飞机飞行操纵系统的硬式传动机构的组成元件一般有：{{1}}、导向滑轮、摇臂。",
    blanks: [{ id: 1, answer: "传动杆", alternatives: [] }],
    domain: "操纵系统", difficulty: 2 },
  // Q100
  { id: 100, text: "操纵系统构件强度校核时，安全系数一般取值为{{1}}。",
    blanks: [{ id: 1, answer: "1.5", alternatives: [] }],
    domain: "操纵系统", difficulty: 1 },
  // Q101
  { id: 101, text: "飞机主操纵系统是用来操纵副翼、方向舵和{{1}}，以改变或保持飞机的飞行状态。",
    blanks: [{ id: 1, answer: "升降舵", alternatives: [] }],
    domain: "操纵系统", difficulty: 1 },
  // Q102
  { id: 102, text: "当燃油本身的压力小于{{1}}时，燃油就会汽化。同时随着压力的降低，溶解于燃油中的空气也会少量析出，这些燃油蒸汽和空气在燃油中形成汽泡。",
    blanks: [{ id: 1, answer: "饱和蒸气压", alternatives: [] }],
    domain: "燃油系统", difficulty: 2 },
  // Q103
  { id: 103, text: "燃油系统的高空性是指：指保证向发动机{{1}}所能达到的飞行高度。",
    blanks: [{ id: 1, answer: "连续供油", alternatives: [] }],
    domain: "燃油系统", difficulty: 1 },
  // Q104
  { id: 104, text: "通气增压系统的方案有：独立连通式、有通气增压总管的系统、{{1}}。",
    blanks: [{ id: 1, answer: "有压力输油功能的系统", alternatives: [] }],
    domain: "燃油系统", difficulty: 3 },
  // Q105
  { id: 105, text: "燃油系统由几大分系统组成：供油分系统、{{1}}、通气增压分系统、加油和放油分系统。",
    blanks: [{ id: 1, answer: "输油系统", alternatives: [] }],
    domain: "燃油系统", difficulty: 2 },
  // Q106
  { id: 106, text: "飞机燃油系统在向发动机进行供油时的动力来源包括：发动机引气的增量压力、燃油泵动力、{{1}}。",
    blanks: [{ id: 1, answer: "燃油重力", alternatives: [] }],
    domain: "燃油系统", difficulty: 2 },
  // Q107
  { id: 107, text: "在燃油系统供油过程中，与燃油流动阻力产生的燃油压力损失有关的因素有：燃油运动和管路之间的摩擦力和{{1}}。",
    blanks: [{ id: 1, answer: "管路上布置的相关燃油部件", alternatives: [] }],
    domain: "燃油系统", difficulty: 3 },
  // Q108
  { id: 108, text: "预防微生物对燃油系统的危害非常重要，可以通过在燃油中添加杀菌类添加剂、电磁辐射、在燃油系统内加装细菌过滤装置和{{1}}的方式来实现。",
    blanks: [{ id: 1, answer: "在燃油系统内涂覆防护层", alternatives: ["涂覆防护层"] }],
    domain: "燃油系统", difficulty: 2 },
  // Q109
  { id: 109, text: "液压泵是液压系统的能源附件，也是液压系统的心脏，它为液压系统提供一定压力和流量的油液，从而把机械能转换为{{1}}。",
    blanks: [{ id: 1, answer: "液压能", alternatives: [] }],
    domain: "液压系统", difficulty: 1 },
  // Q110
  { id: 110, text: "在液压系统中，液体在管路中的能量损失，具体表现为液体压力的降低，即压力损失，包括{{1}}。",
    blanks: [{ id: 1, answer: "沿程损失和局部损失", alternatives: ["沿程损失、局部损失"] }],
    domain: "液压系统", difficulty: 2 },
  // Q111
  { id: 111, text: "液压油的黏温特性是：温度越低，黏度越大；压力越大，黏度{{1}}。",
    blanks: [{ id: 1, answer: "越大", alternatives: [] }],
    domain: "液压系统", difficulty: 1 },
  // Q112
  { id: 112, text: "常见的液压油种类有：植物基液压油、{{1}}、磷酸酯基液压油。",
    blanks: [{ id: 1, answer: "矿物基液压油", alternatives: [] }],
    domain: "液压系统", difficulty: 2 },
  // Q113 - 原文档无下划线，为陈述知识点
  { id: 113, text: "液压系统的设计要求包括性能要求、使用要求、载荷要求。",
    blanks: [],
    domain: "液压系统", difficulty: 1, _note: "原文档无下划线，为陈述题" },
  // Q114
  { id: 114, text: "液压系统中蓄能器的功用有：减少压力冲击、作为辅助动力源、{{1}}。",
    blanks: [{ id: 1, answer: "维持系统压力", alternatives: [] }],
    domain: "液压系统", difficulty: 1 }
];

var DOMAINS = [
  "飞机总体设计基础",
  "气动布局与翼型",
  "尾翼与起落架",
  "主要设计参数",
  "隐身与雷达",
  "动力装置与进气道",
  "飞行性能",
  "结构与材料",
  "结构力学",
  "材料力学性能",
  "结构稳定性",
  "疲劳与断裂",
  "气动弹性",
  "结构设计",
  "操纵系统",
  "燃油系统",
  "液压系统"
];
