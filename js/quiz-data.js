const quizQuestions = [
  {
    scenario: "情境：客服解決方案 Agent",
    question: "生產環境數據顯示，12% 的案例中你的 agent 跳過 get_customer，直接用客戶口述的姓名呼叫 lookup_order，偶爾導致帳戶識別錯誤和錯誤退款。什麼改變最能有效解決這個可靠性問題？",
    options: [
      "A) 加入程式化前置條件，在 get_customer 回傳已驗證的 customer ID 之前，封鎖 lookup_order 和 process_refund 的呼叫",
      "B) 強化 system prompt，聲明 get_customer 身份驗證在任何訂單操作之前是強制性的",
      "C) 加入 few-shot 範例展示 agent 總是先呼叫 get_customer，即使客戶主動提供訂單詳情",
      "D) 實作路由分類器，分析每個請求並只啟用適合該請求類型的工具子集"
    ],
    correct: 0,
    explanation: "當關鍵業務邏輯需要特定工具順序時（如退款前驗證客戶身份），<strong>程式化強制</strong>提供確定性保證，而 prompt 方法（B、C）只能提供機率性合規。選項 D 解決的是工具可用性而非工具順序問題。",
    domain: "D1"
  },
  {
    scenario: "情境：客服解決方案 Agent",
    question: "生產環境 log 顯示，當使用者詢問訂單（如「查看我的訂單 #12345」）時，agent 頻繁呼叫 get_customer 而非 lookup_order。兩個工具的描述都很簡略（「取得客戶資訊」/「取得訂單詳情」）且接受相似的 identifier 格式。改善工具選擇可靠性的最有效第一步是什麼？",
    options: [
      "A) 在 system prompt 加入 5-8 個 few-shot 範例展示正確的工具選擇模式",
      "B) 擴充每個工具的描述，包含它處理的輸入格式、範例查詢、邊界案例，以及何時用它而非類似工具",
      "C) 實作路由層，在每個 turn 前解析使用者輸入，根據偵測到的關鍵字預選適當工具",
      "D) 將兩個工具合併為單一 lookup_entity 工具，接受任何 identifier 並內部決定查詢哪個後端"
    ],
    correct: 1,
    explanation: "Tool descriptions 是 LLM 選擇工具的<strong>主要機制</strong>。描述太簡略時，模型缺乏區分相似工具的 context。B 直接解決根因，低成本高效果。Few-shot（A）增加 token overhead 但沒修復根本問題。路由層（C）過度工程化。合併工具（D）是有效架構但作為「第一步」太重。",
    domain: "D2"
  },
  {
    scenario: "情境：客服解決方案 Agent",
    question: "你的 agent 達到 55% 的首次解決率，遠低於 80% 目標。Log 顯示它 escalate 簡單案例（有照片證據的標準損壞替換），卻嘗試自主處理需要政策例外的複雜情況。什麼方式最能改善 escalation 校準？",
    options: [
      "A) 在 system prompt 加入明確的 escalation 標準和 few-shot 範例，展示何時 escalate vs 自主解決",
      "B) 讓 agent 在每次回覆前自報信心分數（1-10），信心低於閾值時自動路由到人工",
      "C) 部署獨立的分類器模型，基於歷史工單訓練，在主 agent 處理前預測哪些請求需要 escalation",
      "D) 實作情緒分析，偵測客戶挫折程度，負面情緒超過閾值時自動 escalate"
    ],
    correct: 0,
    explanation: "明確的 escalation 標準 + few-shot 範例直接解決根因：不清楚的決策邊界。B 失敗因為 LLM 自報信心校準很差 — agent 在困難案例上反而過度自信。C 過度工程化。D 解決的是不同問題：情緒不等於案例複雜度。",
    domain: "D5"
  },
  {
    scenario: "情境：Claude Code 程式碼生成",
    question: "你想建立一個自訂 /review slash command 來跑你團隊的標準 code review 檢查清單。這個 command 應該在每個開發者 clone 或 pull repo 時自動可用。你應該在哪裡建立這個 command 檔案？",
    options: [
      "A) 在專案 repository 的 .claude/commands/ 目錄中",
      "B) 在每個開發者 home 目錄的 ~/.claude/commands/ 中",
      "C) 在專案根目錄的 CLAUDE.md 檔案中",
      "D) 在 .claude/config.json 檔案中用 commands 陣列"
    ],
    correct: 0,
    explanation: "專案範圍的 slash command 應放在 repository 的 <code>.claude/commands/</code> 目錄中。它們會被版本控制，clone/pull 後自動可用。<code>~/.claude/commands/</code>（B）是個人用，不會透過 version control 共享。CLAUDE.md（C）是專案指令和 context，不是 command 定義。選項 D 描述的機制在 Claude Code 中不存在。",
    domain: "D3"
  },
  {
    scenario: "情境：Claude Code 程式碼生成",
    question: "你被指派將團隊的 monolithic 應用程式重構為微服務。這將涉及數十個檔案的變更，需要決定服務邊界和模組依賴。你應該採取什麼方法？",
    options: [
      "A) 進入 Plan Mode 探索 codebase、理解依賴，在做變更前設計實作方案",
      "B) 直接開始執行，漸進式修改，讓實作過程自然揭露服務邊界",
      "C) 用直接執行搭配詳盡的前置指令，詳細描述每個服務的結構",
      "D) 先用直接執行模式，只在實作中遇到意外複雜度時才切換到 Plan Mode"
    ],
    correct: 0,
    explanation: "Plan Mode 專為涉及大規模變更、多種可行方案和架構決策的複雜任務設計 — 正好是 monolith 轉微服務需要的。B 風險是在發現依賴時已做了大量返工。C 假設你不探索程式碼就知道正確結構。D 忽略了複雜度已在需求中明確陳述。",
    domain: "D3"
  },
  {
    scenario: "情境：Claude Code 程式碼生成",
    question: "你的 codebase 有不同區域的 coding conventions：React 元件用 functional style + hooks，API handler 用 async/await + 特定錯誤處理，database model 用 repository pattern。測試檔散佈在整個 codebase（如 Button.test.tsx 在 Button.tsx 旁邊）。你想要所有測試不論位置都遵循相同 convention。最可維護的方式是什麼？",
    options: [
      "A) 在 .claude/rules/ 建立帶 YAML frontmatter glob pattern 的規則檔，根據檔案路徑條件式套用 convention",
      "B) 把所有 convention 合併到根目錄 CLAUDE.md，依賴 Claude 推斷哪個 section 適用",
      "C) 在 .claude/skills/ 為每種程式碼類型建立 skill，在 SKILL.md 中包含相關 convention",
      "D) 在每個子目錄放一個 CLAUDE.md 檔案，包含該區域的特定 convention"
    ],
    correct: 0,
    explanation: "<code>.claude/rules/</code> + glob pattern（如 <code>**/*.test.tsx</code>）允許根據檔案路徑自動套用 convention，不受目錄位置限制 — 對散佈在 codebase 各處的測試檔至關重要。B 依賴推斷，不可靠。C 需要手動觸發。D 無法跨多目錄套用。",
    domain: "D3"
  },
  {
    scenario: "情境：多 Agent 研究系統",
    question: "研究「AI 對創意產業的影響」後，每個 subagent 都成功完成：web search 找到文章、document analysis 正確摘要論文、synthesis 產出連貫輸出。但最終報告只涵蓋視覺藝術，完全遺漏音樂、寫作和電影製作。Coordinator log 顯示它把主題分解為：「AI 數位藝術創作」「AI 平面設計」「AI 攝影」。最可能的根因是什麼？",
    options: [
      "A) Synthesis agent 缺乏識別收到的 finding 中覆蓋缺口的指令",
      "B) Coordinator agent 的任務分解太狹窄，導致 subagent 分配沒有涵蓋所有相關領域",
      "C) Web search agent 的查詢不夠全面，需要擴展覆蓋更多創意產業類別",
      "D) Document analysis agent 因過度限制的相關性標準過濾掉非視覺創意產業的來源"
    ],
    correct: 1,
    explanation: "Coordinator 的 log 直接揭露了根因：它把「創意產業」只分解為視覺藝術子任務。Subagent 在被分配的範圍內正確執行了任務 — 問題在於它們被分配了什麼。A、C、D 錯誤地歸咎於正確運作的下游 agent。",
    domain: "D1"
  },
  {
    scenario: "情境：多 Agent 研究系統",
    question: "Web search subagent 在研究複雜主題時 timeout。你需要設計失敗資訊如何回傳到 coordinator agent。哪種錯誤傳播方式最能實現智慧恢復？",
    options: [
      "A) 回傳結構化錯誤 context 給 coordinator，包含失敗類型、嘗試的查詢、部分結果和潛在替代方案",
      "B) 在 subagent 內實作自動重試 + 指數退避，所有重試耗盡後才回傳泛用的「搜尋不可用」狀態",
      "C) 在 subagent 內攔截 timeout，回傳標記為成功的空結果集",
      "D) 將 timeout exception 直接傳播到頂層 handler，終止整個研究工作流"
    ],
    correct: 0,
    explanation: "結構化錯誤 context 給 coordinator 做智慧恢復決策所需的資訊 — 是否用修改後的查詢重試、嘗試替代方案、或用部分結果繼續。B 的泛用狀態隱藏了 context。C 壓抑錯誤。D 不必要地終止可以恢復的工作流。",
    domain: "D5"
  },
  {
    scenario: "情境：多 Agent 研究系統",
    question: "Synthesis agent 在結合 finding 時頻繁需要驗證特定 claim。目前需要 2-3 次 round trip 回 coordinator，延遲增加 40%。評估顯示 85% 是簡單事實查核（日期、姓名、統計），15% 需要深入調查。最有效的方法是什麼？",
    options: [
      "A) 給 synthesis agent 一個限定範圍的 verify_fact 工具做簡單查詢，複雜驗證仍透過 coordinator 委派給 web search agent",
      "B) 讓 synthesis agent 累積所有驗證需求，在 pass 結束時批次回傳給 coordinator",
      "C) 給 synthesis agent 存取所有 web search 工具，讓它直接處理任何驗證需求",
      "D) 讓 web search agent 在初始研究時主動快取每個來源的額外 context"
    ],
    correct: 0,
    explanation: "A 應用最小權限原則：只給 synthesis agent 85% 常見案例所需的工具（簡單事實驗證），複雜案例保留現有協調模式。B 的批次方式建立阻塞依賴。C 過度賦權 synthesis agent，違反職責分離。D 依賴無法可靠預測需求的投機性快取。",
    domain: "D2"
  },
  {
    scenario: "情境：Claude Code CI/CD",
    question: "你的 pipeline 腳本執行 claude \"Analyze this pull request for security issues\" 但 job 無限期掛起。Log 表明 Claude Code 在等待互動式輸入。在自動化 pipeline 中正確執行 Claude Code 的方式是什麼？",
    options: [
      "A) 加上 -p flag：claude -p \"Analyze this pull request for security issues\"",
      "B) 在執行指令前設定環境變數 CLAUDE_HEADLESS=true",
      "C) 從 /dev/null 重導向 stdin：claude \"...\" < /dev/null",
      "D) 加上 --batch flag：claude --batch \"...\""
    ],
    correct: 0,
    explanation: "<code>-p</code>（或 <code>--print</code>）flag 是 Claude Code 在非互動模式執行的標準方式。它處理 prompt、輸出結果到 stdout、然後退出，不等待使用者輸入。其他選項引用的是不存在的功能（CLAUDE_HEADLESS、--batch）或不恰當的 Unix workaround。",
    domain: "D3"
  },
  {
    scenario: "情境：Claude Code CI/CD",
    question: "你的團隊想降低自動分析的 API 成本。目前即時 Claude 呼叫驅動兩個工作流：(1) 阻塞式 pre-merge check，開發者必須等它完成才能 merge；(2) 隔夜產生的技術債務報告。主管提議兩者都改用 Message Batches API 以節省 50% 成本。你怎麼評估？",
    options: [
      "A) 只對技術債務報告用 batch processing；pre-merge check 保持即時呼叫",
      "B) 兩個工作流都改用 batch processing，用狀態輪詢檢查完成",
      "C) 兩個工作流都保持即時呼叫以避免 batch 結果排序問題",
      "D) 兩者都改用 batch processing，加上 timeout fallback 到即時呼叫"
    ],
    correct: 0,
    explanation: "Message Batches API 提供 50% 成本節省但處理時間最長 24 小時，無延遲保證。這使它不適合開發者等待結果的阻塞式 pre-merge check，但非常適合隔夜批次工作。B 錯在 batch 不保證「通常更快」。C 是誤解 — batch 結果可用 <code>custom_id</code> 關聯。D 加了不必要的複雜度。",
    domain: "D4"
  },
  {
    scenario: "情境：Claude Code CI/CD",
    question: "一個 PR 修改了 stock tracking 模組的 14 個檔案。你的單次 review 分析所有檔案，結果不一致：有些檔案回饋詳細、有些很表面、明顯 bug 被遺漏、同一 PR 中對相同 pattern 給出矛盾回饋。你怎麼重新架構 review？",
    options: [
      "A) 拆成聚焦的 pass：逐檔分析 local issue，再跑一個獨立的 integration pass 檢查跨檔資料流",
      "B) 要求開發者在自動 review 前將大 PR 拆成每次 3-4 個檔案的小提交",
      "C) 換用更高階模型搭配更大的 context window，讓所有 14 個檔案在一次 pass 中得到足夠注意力",
      "D) 對完整 PR 跑三次獨立 review pass，只標記至少出現在兩次中的問題"
    ],
    correct: 0,
    explanation: "拆成聚焦的 pass 直接解決根因：同時處理太多檔案造成的注意力稀釋。逐檔分析確保一致的深度，獨立的 integration pass 抓跨檔問題。B 把負擔轉嫁給開發者。C 誤解了更大 context window 不解決注意力品質問題。D 要求共識反而會壓抑只被間歇性抓到的真正 bug。",
    domain: "D4"
  }
];
