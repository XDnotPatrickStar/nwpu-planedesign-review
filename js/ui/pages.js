/* ============================================
   页面渲染：首页、练习页、考试页、错题本、统计、设置
   ============================================ */

var App = App || {};

App.Pages = (function() {
  'use strict';

  var _currentCleanup = null; // 当前页面的清理函数

  /**
   * 渲染页面到 #content
   */
  function render(pageName, params) {
    // 清理上一页面
    if (typeof _currentCleanup === 'function') {
      _currentCleanup();
      _currentCleanup = null;
    }

    // 更新侧边栏高亮
    highlightSidebar(pageName);

    // 更新页面标题
    var titleMap = {
      'home': '首页',
      'practice': '练习模式',
      'exam': '模拟考试',
      'wrongbook': '错题本',
      'stats': '学习统计',
      'settings': '设置'
    };
    var topbarTitle = document.querySelector('#topbar .page-title');
    if (topbarTitle) {
      topbarTitle.textContent = '✈ ' + (titleMap[pageName] || pageName);
    }

    var content = document.getElementById('content');
    if (!content) return;
    content.innerHTML = '';

    switch (pageName) {
      case 'home': renderHome(content); break;
      case 'practice': renderPractice(content, params); break;
      case 'exam': renderExam(content, params); break;
      case 'wrongbook': renderWrongBook(content); break;
      case 'stats': renderStats(content); break;
      case 'settings': renderSettings(content); break;
      default: renderHome(content);
    }
  }

  // --- 首页 ---
  function renderHome(container) {
    var stats = App.Storage.getStats();
    var wrongList = App.Storage.getWrongQuestions();
    var progress = App.Storage.loadProgress();

    var html = '';
    html += '<div style="margin-bottom:28px;">';
    html += '<h1 style="font-size:1.6rem;margin-bottom:8px;">✈ 飞机设计工程学</h1>';
    html += '<p style="color:var(--text-muted);">填空题复习系统 · 共 ' + QUESTION_BANK.length + ' 题 · 15个知识点领域</p>';
    html += '</div>';

    // 快捷统计
    html += '<div class="stats-grid">';
    html += '<div class="stat-card"><div class="stat-value">' + stats.totalQuestionsPracticed + '</div><div class="stat-label">已练习题数</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + stats.totalAttempts + '</div><div class="stat-label">总答题次数</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + stats.overallAccuracy + '%</div><div class="stat-label">整体正确率</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + wrongList.length + '</div><div class="stat-label">错题数量</div></div>';
    html += '</div>';

    // 练习模式入口
    html += '<h2 style="margin-bottom:16px;font-size:1.15rem;">练习模式</h2>';
    html += '<div class="home-grid">';

    var modes = ['sequential', 'random', 'domain', 'wrongbook', 'flashcard'];
    modes.forEach(function(mode) {
      var meta = App.Practice.getModeMeta(mode);
      html += '<div class="home-card" data-mode="' + mode + '">';
      html += '<div class="card-icon">' + meta.icon + '</div>';
      html += '<div class="card-title">' + meta.name + '</div>';
      html += '<div class="card-desc">' + meta.desc + '</div>';
      html += '</div>';
    });

    // 考试入口
    html += '<div class="home-card" data-mode="exam" style="border-color:var(--accent);">';
    html += '<div class="card-icon">📝</div>';
    html += '<div class="card-title">模拟考试</div>';
    html += '<div class="card-desc">限时作答，模拟真实考试环境</div>';
    html += '</div>';

    html += '</div>';

    container.innerHTML = html;

    // 绑定点击事件
    container.querySelectorAll('.home-card[data-mode]').forEach(function(card) {
      card.addEventListener('click', function() {
        var mode = this.getAttribute('data-mode');
        if (mode === 'exam') {
          showExamConfig();
        } else if (mode === 'domain') {
          showDomainSelector();
        } else if (mode === 'wrongbook') {
          var wrongList = App.Storage.getWrongQuestions();
          if (wrongList.length === 0) {
            App.Components.showToast('太棒了！你还没有错题 😄', 'success');
            return;
          }
          App.Practice.startPractice(mode);
        } else {
          App.Practice.startPractice(mode);
        }
      });
    });
  }

  // --- 练习页面 ---
  function renderPractice(container, params) {
    var mode = params.mode || App.State.get('practiceMode') || 'sequential';
    var questions = App.State.get('currentQuestions');
    var currentIndex = App.State.get('currentIndex');

    if (!questions || questions.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-title">没有题目</div><p>请返回首页选择练习模式</p></div>';
      return;
    }

    var question = questions[currentIndex];
    if (!question) {
      // 已做完所有题
      renderPracticeComplete(container, mode, questions);
      return;
    }

    var meta = App.Practice.getModeMeta(mode);
    var progress = App.State.getProgress();

    var html = '';
    // 顶部信息栏
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">';
    html += '<span style="font-size:0.9rem;color:var(--text-secondary);">' + meta.icon + ' ' + meta.name + ' · 第 ' + (currentIndex + 1) + '/' + questions.length + ' 题</span>';
    html += '<div style="display:flex;gap:8px;">';
    html += '<button class="btn btn-ghost btn-sm" id="btn-nav">📋 题目列表</button>';
    html += '<button class="btn btn-ghost btn-sm" id="btn-quit">✕ 退出</button>';
    html += '</div></div>';

    // 进度条
    html += '<div id="practice-progress"></div>';

    // 快捷键提示（仅多空题显示）
    if (!hasNoBlanks && question.blanks.length > 1) {
      html += '<div style="text-align:center;font-size:0.7rem;color:var(--text-muted);margin-bottom:8px;">';
      html += '<span class="kbd">Tab</span> 下一个空 &nbsp;';
      html += '<span class="kbd">Shift+Tab</span> 上一个空 &nbsp;';
      html += '<span class="kbd">Enter</span> 提交';
      html += '</div>';
    }
    html += '<div class="question-card" id="question-container"></div>';

    // 反馈区
    html += '<div id="feedback-area"></div>';

    // 检查是否为无空陈述题
    var hasNoBlanks = !question.blanks || question.blanks.length === 0;

    // 操作按钮
    html += '<div class="action-bar">';
    html += '<button class="btn btn-outline btn-sm" id="btn-prev" ' + (progress.isFirst ? 'disabled' : '') + '>← 上一题</button>';
    if (hasNoBlanks) {
      html += '<span style="color:var(--text-muted);font-size:0.85rem;padding:10px;">📖 陈述题，无填空</span>';
      html += '<button class="btn btn-primary btn-sm" id="btn-skip">下一题 →</button>';
    } else {
      html += '<button class="btn btn-ghost btn-sm" id="btn-show-answer">💡 显示答案</button>';
      html += '<button class="btn btn-outline btn-sm" id="btn-skip">跳过 →</button>';
      html += '<button class="btn btn-primary" id="btn-submit">✓ 提交</button>';
    }
    html += '</div>';

    // 闪卡模式专用自评按钮
    if (mode === 'flashcard') {
      html += '<div class="action-bar" id="flashcard-actions" style="display:none;">';
      html += '<button class="btn btn-error btn-sm" id="btn-forgot">✗ 没记住</button>';
      html += '<button class="btn btn-success btn-sm" id="btn-remember">✓ 记住了</button>';
      html += '</div>';
    }

    container.innerHTML = html;

    // 渲染题目
    var qContainer = document.getElementById('question-container');

    // 题目元信息
    var metaDiv = document.createElement('div');
    metaDiv.className = 'question-meta';
    metaDiv.innerHTML = '<span class="domain-tag">' + question.domain + '</span>' +
      '<span class="difficulty">' + ('★'.repeat(question.difficulty)) + ('☆'.repeat(3 - question.difficulty)) + '</span>';
    qContainer.appendChild(metaDiv);

    // 渲染题目文本
    App.Renderer.renderQuestion(question, qContainer, {});

    // 渲染进度条
    new App.Components.ProgressBar(document.getElementById('practice-progress'))
      .update(currentIndex + 1, questions.length);

    // 闪卡模式
    if (mode === 'flashcard') {
      // 隐藏输入框，仅显示题目
      var inputs = qContainer.querySelectorAll('.blank-input');
      inputs.forEach(function(inp) { inp.style.display = 'none'; });
      document.getElementById('btn-submit').style.display = 'none';
      document.getElementById('btn-skip').style.display = 'none';
      document.getElementById('btn-show-answer').textContent = '👁 揭晓答案';
    }

    // 事件绑定
    bindPracticeEvents(container, mode, question, questions, currentIndex);

    App.Renderer.focusFirstBlank(qContainer);
  }

  function bindPracticeEvents(container, mode, question, questions, currentIndex) {
    var answered = false;

    var hasNoBlanks = !question.blanks || question.blanks.length === 0;

    // 提交
    var submitBtn = document.getElementById('btn-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        if (answered) return;
        answered = true;

        var qContainer = document.getElementById('question-container');
        var userInputs = App.Renderer.collectInputs(qContainer);
        var result = App.Practice.submitAnswer(question, userInputs);

        // 高亮结果
        App.Renderer.renderQuestion(question, qContainer, { results: result.results, userInputs: userInputs, disabled: true });

        // 反馈
        App.Renderer.renderFeedback(document.getElementById('feedback-area'), result);

        // 手机震动反馈
        if (navigator.vibrate) {
          navigator.vibrate(result.allCorrect ? [50] : [80, 100, 80]);
        }

        // 更新按钮状态
        submitBtn.disabled = true;
        var skipBtn = document.getElementById('btn-skip');
        skipBtn.textContent = '下一题 →';
        skipBtn.classList.add('btn-primary');
        var showBtn = document.getElementById('btn-show-answer');
        if (showBtn) showBtn.style.display = 'none';
      });
    }

    // 显示答案
    var showAnswerBtn = document.getElementById('btn-show-answer');
    if (showAnswerBtn) {
      showAnswerBtn.addEventListener('click', function() {
        if (answered) return;

        if (mode === 'flashcard') {
          // 闪卡：显示答案和自评按钮
          var qContainer = document.getElementById('question-container');
          var inputs = qContainer.querySelectorAll('.blank-input');
          inputs.forEach(function(inp, i) {
            inp.style.display = 'inline-block';
            inp.value = question.blanks[i] ? question.blanks[i].answer : '';
            inp.disabled = true;
            inp.classList.add('correct');
          });
          document.getElementById('flashcard-actions').style.display = 'flex';
          showAnswerBtn.style.display = 'none';
          document.getElementById('btn-skip').style.display = 'none';
        } else {
          // 练习模式：显示答案并禁用
          var qContainer = document.getElementById('question-container');
          App.Renderer.renderQuestion(question, qContainer, { showAnswers: true, disabled: true });
          answered = true;
          var sb = document.getElementById('btn-submit');
          if (sb) sb.disabled = true;
          document.getElementById('btn-skip').textContent = '下一题 →';
          document.getElementById('btn-skip').classList.add('btn-primary');
          this.style.display = 'none';
        }
      });
    }

    // 闪卡自评
    var forgotBtn = document.getElementById('btn-forgot');
    var rememberBtn = document.getElementById('btn-remember');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', function() {
        App.Practice.submitAnswer(question, []); // 记为错误
        goNext(mode, questions, currentIndex);
      });
    }
    if (rememberBtn) {
      rememberBtn.addEventListener('click', function() {
        // 记为正确
        var fakeInputs = question.blanks.map(function(b) { return b.answer; });
        App.Practice.submitAnswer(question, fakeInputs);
        goNext(mode, questions, currentIndex);
      });
    }

    // 跳过/下一题
    document.getElementById('btn-skip').addEventListener('click', function() {
      goNext(mode, questions, currentIndex);
    });

    // 上一题
    document.getElementById('btn-prev').addEventListener('click', function() {
      if (App.State.prevQuestion()) {
        App.Router.navigate('practice/' + mode + '?prev=' + Date.now());
      }
    });

    // 退出
    document.getElementById('btn-quit').addEventListener('click', function() {
      App.Router.navigate('home');
    });

    // 题目列表
    document.getElementById('btn-nav').addEventListener('click', function() {
      showQuestionNav(questions, currentIndex, mode);
    });

    // 键盘快捷键
    var keyHandler = function(e) {
      var tag = document.activeElement ? document.activeElement.tagName : '';
      var isInput = tag === 'INPUT' || tag === 'TEXTAREA';

      // Tab：在空格之间跳转（仅在输入框内时处理）
      if (e.key === 'Tab' && isInput && !e.shiftKey) {
        e.preventDefault();
        var inputs = document.querySelectorAll('.blank-input:not([disabled])');
        if (inputs.length > 1) {
          var currentIdx = Array.prototype.indexOf.call(inputs, document.activeElement);
          var nextIdx = (currentIdx + 1) % inputs.length;
          inputs[nextIdx].focus();
          inputs[nextIdx].select();
        }
        return;
      }
      if (e.key === 'Tab' && e.shiftKey && isInput) {
        e.preventDefault();
        var inputs2 = document.querySelectorAll('.blank-input:not([disabled])');
        if (inputs2.length > 1) {
          var curIdx2 = Array.prototype.indexOf.call(inputs2, document.activeElement);
          var prevIdx2 = curIdx2 <= 0 ? inputs2.length - 1 : curIdx2 - 1;
          inputs2[prevIdx2].focus();
          inputs2[prevIdx2].select();
        }
        return;
      }

      if (e.key === 'Enter' && !answered) {
        e.preventDefault();
        var sb = document.getElementById('btn-submit');
        if (sb && !hasNoBlanks) {
          sb.click();
        } else if (hasNoBlanks) {
          document.getElementById('btn-skip').click();
        }
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        // 如果焦点在输入框中，不拦截空格（用于输入）和右箭头（光标移动）
        if (isInput && (e.key === ' ' || (e.key === 'ArrowRight' && document.activeElement.selectionStart < document.activeElement.value.length))) {
          return;
        }
        e.preventDefault();
        document.getElementById('btn-skip').click();
      } else if (e.key === 'ArrowLeft') {
        if (isInput && document.activeElement.selectionStart > 0) return;
        e.preventDefault();
        if (!App.State.getProgress().isFirst) {
          document.getElementById('btn-prev').click();
        }
      } else if ((e.key === 's' || e.key === 'S') && !isInput) {
        var showBtn = document.getElementById('btn-show-answer');
        if (showBtn && showBtn.style.display !== 'none') {
          showBtn.click();
        }
      }
    };
    document.addEventListener('keydown', keyHandler);

    // ── 移动端滑动手势 ──
    var touchStartX = 0, touchStartY = 0;
    var touchHandler = function(e) {
      if (e.type === 'touchstart') {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      } else if (e.type === 'touchend') {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        // 水平滑动超过 60px 且大于垂直滑动
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
          e.preventDefault();
          if (dx < -40) {
            // 左滑 → 下一题
            document.getElementById('btn-skip').click();
          } else if (dx > 40) {
            // 右滑 → 上一题
            if (!App.State.getProgress().isFirst) {
              document.getElementById('btn-prev').click();
            }
          }
        }
      }
    };
    var mainArea = document.getElementById('main');
    if (mainArea) {
      mainArea.addEventListener('touchstart', touchHandler, { passive: true });
      mainArea.addEventListener('touchend', touchHandler, { passive: false });
    }

    _currentCleanup = function() {
      document.removeEventListener('keydown', keyHandler);
      if (mainArea) {
        mainArea.removeEventListener('touchstart', touchHandler);
        mainArea.removeEventListener('touchend', touchHandler);
      }
    };
  }

  function goNext(mode, questions, currentIndex) {
    if (App.State.nextQuestion()) {
      App.Router.navigate('practice/' + mode + '?t=' + Date.now()); // 强制刷新
    } else {
      // 本轮完成
      var content = document.getElementById('content');
      renderPracticeComplete(content, mode, questions);
    }
  }

  function renderPracticeComplete(container, mode, questions) {
    var stats = App.Storage.getStats();
    container.innerHTML = '';

    var html = '<div class="empty-state">';
    html += '<div class="empty-icon">🎉</div>';
    html += '<div class="empty-title">本轮练习完成！</div>';
    html += '<p style="margin-bottom:20px;">共完成 ' + questions.length + ' 道题，整体正确率 ' + stats.overallAccuracy + '%</p>';

    // 本轮统计
    var progress = App.Storage.loadProgress();
    var correctCount = 0;
    var attemptCount = 0;
    questions.forEach(function(q) {
      var r = progress.records[q.id];
      if (r) {
        attemptCount += r.totalAttempts;
        correctCount += r.correctAttempts;
      }
    });
    html += '<div style="margin-bottom:24px;color:var(--text-muted);">本轮正确率: ' +
      (attemptCount > 0 ? Math.round((correctCount / attemptCount) * 100) : 0) + '%</div>';

    html += '<div class="action-bar" style="justify-content:center;">';
    html += '<button class="btn btn-primary" onclick="App.Router.navigate(\'home\')">返回首页</button>';
    html += '<button class="btn btn-outline" onclick="App.Practice.startPractice(\'' + mode + '\')">再来一轮</button>';
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
  }

  // --- 考试页面 ---
  function renderExam(container, params) {
    var questions = App.State.get('currentQuestions');
    var examConfig = App.State.get('examConfig');

    if (!questions || questions.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📝</div><div class="empty-title">没有考试题目</div></div>';
      return;
    }

    if (examConfig.submitted) {
      renderExamResult(container);
      return;
    }

    var html = '';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">';
    html += '<span style="font-size:0.9rem;color:var(--text-secondary);">📝 模拟考试 · ' + questions.length + ' 题</span>';
    html += '<div id="exam-timer"></div>';
    html += '</div>';

    // 题目滚动列表
    html += '<div id="exam-questions" style="max-height:60vh;overflow-y:auto;padding-right:8px;"></div>';

    // 操作按钮
    html += '<div class="action-bar" style="position:sticky;bottom:0;background:var(--bg-primary);padding:16px 0;margin-top:16px;">';
    html += '<button class="btn btn-ghost btn-sm" id="btn-exam-quit">退出考试</button>';
    html += '<span style="flex:1;"></span>';
    html += '<button class="btn btn-primary btn-lg" id="btn-exam-submit">交卷 ✈</button>';
    html += '</div>';

    container.innerHTML = html;

    // 渲染所有题目
    var questionsContainer = document.getElementById('exam-questions');
    questions.forEach(function(q, index) {
      var card = document.createElement('div');
      card.className = 'question-card';
      card.id = 'exam-q-' + q.id;

      var header = document.createElement('div');
      header.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:12px;';
      header.innerHTML = '<span style="font-weight:600;">第 ' + (index + 1) + ' 题</span>' +
        '<span class="domain-tag">' + q.domain + '</span>';
      card.appendChild(header);

      var qText = document.createElement('div');
      card.appendChild(qText);

      // 渲染题目文本（含inline空白输入框）
      App.Renderer.renderQuestion(q, qText, {});

      // 保存答案的事件（只收集blank-input）
      (function(qid) {
        card.addEventListener('input', function() {
          var inputs = card.querySelectorAll('.blank-input');
          var userInputs = [];
          inputs.forEach(function(inp) { userInputs.push(inp.value.trim()); });
          App.State.saveExamAnswer(qid, userInputs);
        });
      })(q.id);

      questionsContainer.appendChild(card);
    });

    // 恢复已保存的答案
    questions.forEach(function(q) {
      if (examConfig.answers[q.id]) {
        var card = document.getElementById('exam-q-' + q.id);
        if (card) {
          var inputs = card.querySelectorAll('.blank-input');
          var savedInputs = examConfig.answers[q.id];
          inputs.forEach(function(inp, i) {
            if (savedInputs[i]) inp.value = savedInputs[i];
          });
        }
      }
    });

    // 计时器
    var timer = new App.Components.Timer(
      document.getElementById('exam-timer'),
      examConfig.timeLimit,
      null,
      function() { submitExam(questions); }
    );
    timer.setTotal(examConfig.timeLimit);
    timer.start();
    _currentCleanup = function() { timer.stop(); };

    // 提交按钮
    document.getElementById('btn-exam-submit').addEventListener('click', function() {
      App.Components.confirm(
        '确认交卷',
        '确定要提交试卷吗？交卷后无法修改答案。',
        function() { submitExam(questions); }
      );
    });

    // 退出
    document.getElementById('btn-exam-quit').addEventListener('click', function() {
      App.Components.confirm(
        '退出考试',
        '退出后考试进度将丢失，确定退出吗？',
        function() { App.Router.navigate('home'); }
      );
    });
  }

  function submitExam(questions) {
    // 收集最新答案
    questions.forEach(function(q) {
      var card = document.getElementById('exam-q-' + q.id);
      if (card) {
        var inputs = card.querySelectorAll('.blank-input');
        var userInputs = [];
        inputs.forEach(function(inp) { userInputs.push(inp.value.trim()); });
        App.State.saveExamAnswer(q.id, userInputs);
      }
    });

    var examConfig = App.State.get('examConfig');
    var answers = examConfig.answers;
    var timeUsed = Math.floor((Date.now() - examConfig.startTime) / 1000);

    // 判分
    var result = App.Practice.gradeExam(questions, answers);
    result.timeUsed = timeUsed;

    // 保存考试记录
    App.Storage.addExamRecord(result);

    // 标记已提交
    App.State.set('examConfig', Object.assign({}, examConfig, { submitted: true, result: result }));

    // 重新渲染
    var content = document.getElementById('content');
    renderExamResult(content);
  }

  function renderExamResult(container) {
    var examConfig = App.State.get('examConfig');
    var result = examConfig.result;

    if (!result) {
      container.innerHTML = '<p>没有考试结果</p>';
      return;
    }

    var html = '';
    html += '<div class="result-header">';
    html += '<div style="font-size:1.1rem;color:var(--text-muted);margin-bottom:8px;">考试成绩</div>';
    html += '<div class="result-score" style="color:' + (result.score >= 60 ? 'var(--success)' : 'var(--error)') + '">' + result.score + '</div>';
    html += '<div style="color:var(--text-muted);">分</div>';
    html += '</div>';

    html += '<div class="result-detail">';
    html += '<div class="stat-card"><div class="stat-value">' + result.totalQuestions + '</div><div class="stat-label">题目总数</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + result.correct + '/' + result.totalBlanks + '</div><div class="stat-label">正确空数</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + App.Helpers.formatTime(result.timeUsed) + '</div><div class="stat-label">用时</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + (result.score >= 60 ? '✅ 通过' : '❌ 未通过') + '</div><div class="stat-label">结果</div></div>';
    html += '</div>';

    // 各领域得分
    html += '<div class="card" style="margin-bottom:20px;">';
    html += '<div class="card-header">各领域得分</div>';
    html += '<div class="bar-chart">';
    var domains = Object.keys(result.domainScores);
    domains.forEach(function(domain) {
      var ds = result.domainScores[domain];
      var pct = ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : 0;
      html += '<div class="bar-row">';
      html += '<div class="bar-label">' + domain + '</div>';
      html += '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:' + (pct >= 60 ? 'var(--success)' : 'var(--error)') + ';"></div></div>';
      html += '<div class="bar-value">' + ds.correct + '/' + ds.total + '</div>';
      html += '</div>';
    });
    html += '</div></div>';

    // 每题详情
    html += '<div class="card">';
    html += '<div class="card-header">答题详情</div>';
    result.details.forEach(function(detail, idx) {
      var q = QUESTION_BANK.find(function(q) { return q.id === detail.questionId; });
      if (!q) return;
      var icon = detail.allCorrect ? '✅' : '❌';
      html += '<div style="padding:12px 0;border-bottom:1px solid var(--border-color);">';
      html += '<div style="display:flex;gap:8px;align-items:flex-start;">';
      html += '<span>' + icon + '</span>';
      html += '<span style="font-size:0.9rem;flex:1;">' + (idx + 1) + '. ' + q.text.replace(/\{\{(\d+)\}\}/g, '______') + '</span>';
      html += '</div>';
      html += '<div style="margin-left:28px;font-size:0.85rem;color:var(--text-muted);margin-top:4px;">';
      detail.results.forEach(function(r) {
        if (r.correct) {
          html += '空' + r.blankId + ': ✓ <span style="color:var(--success);">' + r.correctAnswer + '</span> ';
        } else {
          html += '空' + r.blankId + ': ✗ <span style="color:var(--error);">你填「' + (r.userInput || '未填') + '」</span> → <span style="color:var(--success);">' + r.correctAnswer + '</span> ';
        }
      });
      html += '</div></div>';
    });
    html += '</div>';

    html += '<div class="action-bar" style="justify-content:center;margin-top:20px;">';
    html += '<button class="btn btn-primary" onclick="App.Router.navigate(\'home\')">返回首页</button>';
    html += '<button class="btn btn-outline" onclick="App.Practice.startPractice(\'wrongbook\')">练习错题</button>';
    html += '</div>';

    container.innerHTML = html;
  }

  // --- 错题本 ---
  function renderWrongBook(container) {
    var wrongList = App.Storage.getWrongQuestions();

    var html = '<h1 style="font-size:1.3rem;margin-bottom:20px;">📕 错题本</h1>';

    if (wrongList.length === 0) {
      html += '<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-title">太棒了！你还没有错题</div><p>继续保持！</p></div>';
      container.innerHTML = html;
      return;
    }

    html += '<p style="color:var(--text-muted);margin-bottom:16px;">共 ' + wrongList.length + ' 道错题</p>';

    // 按领域分组
    var byDomain = {};
    wrongList.forEach(function(w) {
      var q = QUESTION_BANK.find(function(qq) { return qq.id === w.questionId; });
      if (!q) return;
      var domain = q.domain;
      if (!byDomain[domain]) byDomain[domain] = [];
      byDomain[domain].push({ wrong: w, question: q });
    });

    var domains = Object.keys(byDomain);
    domains.forEach(function(domain) {
      html += '<h3 style="font-size:1rem;margin:20px 0 12px;color:var(--text-secondary);">' + domain + ' (' + byDomain[domain].length + '题)</h3>';
      html += '<div class="wrong-list">';

      byDomain[domain].forEach(function(item) {
        var w = item.wrong;
        var q = item.question;
        html += '<div class="wrong-item" data-question-id="' + q.id + '">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
        html += '<span style="font-weight:600;">#' + q.id + '</span>';
        html += '<span class="wrong-count">错' + w.wrongCount + '次</span>';
        html += '</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-muted);margin-top:6px;">';
        html += q.text.replace(/\{\{(\d+)\}\}/g, function(m, id) {
          var b = q.blanks.find(function(bb) { return bb.id === parseInt(id); });
          return '<strong style="color:var(--text-secondary);">[' + (b ? b.answer : '___') + ']</strong>';
        });
        html += '</div>';
        if (w.lastWrong && w.lastWrong.inputs) {
          html += '<div style="font-size:0.78rem;color:var(--error);margin-top:4px;">你的错误: ' + w.lastWrong.inputs.join(', ') + '</div>';
        }
        html += '</div>';
      });

      html += '</div>';
    });

    html += '<div class="action-bar" style="justify-content:center;margin-top:20px;">';
    html += '<button class="btn btn-primary" id="btn-practice-wrong">练习全部错题</button>';
    html += '<button class="btn btn-outline" id="btn-clear-wrong">清空错题本</button>';
    html += '</div>';

    container.innerHTML = html;

    // 点击错题可跳转
    container.querySelectorAll('.wrong-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var qid = parseInt(this.getAttribute('data-question-id'));
        var q = QUESTION_BANK.find(function(qq) { return qq.id === qid; });
        if (q) {
          App.State.setQuestions([q]);
          App.Router.navigate('practice/sequential');
        }
      });
    });

    document.getElementById('btn-practice-wrong').addEventListener('click', function() {
      App.Practice.startPractice('wrongbook');
    });

    document.getElementById('btn-clear-wrong').addEventListener('click', function() {
      App.Components.confirm(
        '清空错题本',
        '确定要清空所有错题记录吗？此操作不可撤销。',
        function() {
          App.Storage.clearAll();
          App.Components.showToast('错题本已清空', 'success');
          App.Router.navigate('home');
        }
      );
    });
  }

  // --- 统计页面 ---
  function renderStats(container) {
    var stats = App.Storage.getStats();
    var progress = App.Storage.loadProgress();
    var wrongList = App.Storage.getWrongQuestions();

    var html = '<h1 style="font-size:1.3rem;margin-bottom:20px;">📊 学习统计</h1>';

    // 概览卡片
    html += '<div class="stats-grid">';
    html += '<div class="stat-card"><div class="stat-value">' + stats.totalQuestionsPracticed + '/' + QUESTION_BANK.length + '</div><div class="stat-label">已练习题数</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + stats.totalAttempts + '</div><div class="stat-label">总答题次数</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + stats.overallAccuracy + '%</div><div class="stat-label">整体正确率</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + wrongList.length + '</div><div class="stat-label">当前错题数</div></div>';
    html += '<div class="stat-card"><div class="stat-value">🔥 ' + stats.streakDays + '</div><div class="stat-label">连续学习天数</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + stats.examCount + '</div><div class="stat-label">考试次数</div></div>';
    html += '</div>';

    // 各领域掌握度
    html += '<div class="card" style="margin-bottom:20px;">';
    html += '<div class="card-header">各领域掌握度</div>';
    html += '<div class="bar-chart">';

    DOMAINS.forEach(function(domain) {
      var domainQs = QUESTION_BANK.filter(function(q) { return q.domain === domain; });
      var totalAttempts = 0;
      var totalCorrect = 0;
      domainQs.forEach(function(q) {
        var r = progress.records[q.id];
        if (r) {
          totalAttempts += r.totalAttempts;
          totalCorrect += r.correctAttempts;
        }
      });
      var pct = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
      var color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)';
      html += '<div class="bar-row">';
      html += '<div class="bar-label">' + domain + '</div>';
      html += '<div class="bar-track"><div class="bar-fill" style="width:' + (pct || 1) + '%;background:' + color + ';"></div></div>';
      html += '<div class="bar-value">' + pct + '%</div>';
      html += '</div>';
    });

    html += '</div></div>';

    // 考试历史
    if (stats.examHistory && stats.examHistory.length > 0) {
      html += '<div class="card">';
      html += '<div class="card-header">考试历史</div>';
      html += '<table class="table">';
      html += '<thead><tr><th>日期</th><th>题目数</th><th>正确数</th><th>得分</th><th>用时</th></tr></thead>';
      html += '<tbody>';

      var history = stats.examHistory.slice().reverse(); // 最近的在前面
      history.forEach(function(record) {
        html += '<tr>';
        html += '<td>' + App.Helpers.formatDate(record.date) + '</td>';
        html += '<td>' + record.totalQuestions + '</td>';
        html += '<td>' + record.correct + '</td>';
        html += '<td style="font-weight:600;color:' + (record.score >= 60 ? 'var(--success)' : 'var(--error)') + '">' + record.score + '</td>';
        html += '<td>' + App.Helpers.formatTime(record.timeUsed || 0) + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table></div>';
    }

    container.innerHTML = html;
  }

  // --- 设置页面 ---
  function renderSettings(container) {
    var settings = App.Storage.getSettings();

    var html = '<h1 style="font-size:1.3rem;margin-bottom:20px;">⚙ 设置</h1>';

    // 外观设置
    html += '<div class="card settings-group">';
    html += '<h3>外观</h3>';
    html += '<div class="setting-row">';
    html += '<label>主题</label>';
    html += '<select id="setting-theme" class="btn btn-outline btn-sm">';
    html += '<option value="dark"' + (settings.theme === 'dark' ? ' selected' : '') + '>暗色</option>';
    html += '<option value="light"' + (settings.theme === 'light' ? ' selected' : '') + '>亮色</option>';
    html += '</select>';
    html += '</div>';
    html += '</div>';

    // 考试默认设置
    html += '<div class="card settings-group">';
    html += '<h3>考试默认参数</h3>';
    html += '<div class="setting-row">';
    html += '<label>默认题数</label>';
    html += '<input type="range" id="setting-count" min="10" max="' + QUESTION_BANK.length + '" value="' + settings.examQuestionCount + '" style="width:160px;">';
    html += '<span id="setting-count-val" style="font-weight:600;">' + settings.examQuestionCount + '</span>';
    html += '</div>';
    html += '<div class="setting-row">';
    html += '<label>时间限制（分钟）</label>';
    html += '<input type="range" id="setting-time" min="10" max="120" step="5" value="' + settings.examTimeLimit + '" style="width:160px;">';
    html += '<span id="setting-time-val" style="font-weight:600;">' + settings.examTimeLimit + '</span>';
    html += '</div>';
    html += '</div>';

    // 数据管理
    html += '<div class="card settings-group">';
    html += '<h3>数据管理</h3>';
    html += '<div class="action-bar">';
    html += '<button class="btn btn-outline btn-sm" id="btn-export">📤 导出进度 (JSON)</button>';
    html += '<button class="btn btn-outline btn-sm" id="btn-import">📥 导入进度 (JSON)</button>';
    html += '<button class="btn btn-error btn-sm" id="btn-clear-all">🗑 清除所有数据</button>';
    html += '</div>';
    html += '<input type="file" id="import-file" accept=".json" style="display:none;">';
    html += '</div>';

    container.innerHTML = html;

    // 事件绑定
    document.getElementById('setting-theme').addEventListener('change', function() {
      var theme = this.value;
      App.Storage.updateSettings({ theme: theme });
      document.documentElement.setAttribute('data-theme', theme);
      App.Components.showToast('主题已切换', 'info', 1500);
    });

    var countSlider = document.getElementById('setting-count');
    countSlider.addEventListener('input', function() {
      document.getElementById('setting-count-val').textContent = this.value;
    });
    countSlider.addEventListener('change', function() {
      App.Storage.updateSettings({ examQuestionCount: parseInt(this.value) });
      App.Components.showToast('已保存', 'success', 1500);
    });

    var timeSlider = document.getElementById('setting-time');
    timeSlider.addEventListener('input', function() {
      document.getElementById('setting-time-val').textContent = this.value;
    });
    timeSlider.addEventListener('change', function() {
      App.Storage.updateSettings({ examTimeLimit: parseInt(this.value) });
      App.Components.showToast('已保存', 'success', 1500);
    });

    document.getElementById('btn-export').addEventListener('click', function() {
      var data = App.Storage.exportData();
      var blob = new Blob([data], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'nwpu_plane_progress_' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      URL.revokeObjectURL(url);
      App.Components.showToast('导出成功', 'success', 1500);
    });

    document.getElementById('btn-import').addEventListener('click', function() {
      document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        var success = App.Storage.importData(ev.target.result);
        if (success) {
          App.Components.showToast('导入成功！刷新页面查看', 'success', 2000);
        } else {
          App.Components.showToast('导入失败：数据格式不正确', 'error', 3000);
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-clear-all').addEventListener('click', function() {
      App.Components.confirm(
        '清除所有数据',
        '确定要清除所有练习记录和设置吗？此操作不可撤销。建议先导出备份。',
        function() {
          App.Storage.clearAll();
          App.Components.showToast('所有数据已清除', 'info', 2000);
          setTimeout(function() { App.Router.navigate('home'); }, 500);
        }
      );
    });
  }

  // --- 辅助函数 ---

  function showExamConfig() {
    var settings = App.Storage.getSettings();
    new App.Components.Modal({
      title: '模拟考试配置',
      content: '<div style="display:flex;flex-direction:column;gap:16px;">' +
        '<div><label style="display:block;margin-bottom:4px;">题目数量: <strong id="exam-cfg-count">' + settings.examQuestionCount + '</strong></label>' +
        '<input type="range" id="exam-cfg-count-slider" min="10" max="' + QUESTION_BANK.length + '" value="' + settings.examQuestionCount + '" style="width:100%;"></div>' +
        '<div><label style="display:block;margin-bottom:4px;">时间限制: <strong id="exam-cfg-time">' + settings.examTimeLimit + '</strong> 分钟</label>' +
        '<input type="range" id="exam-cfg-time-slider" min="10" max="120" step="5" value="' + settings.examTimeLimit + '" style="width:100%;"></div>' +
        '</div>',
      buttons: [
        { text: '取消', class: 'btn-outline', action: function() {} },
        {
          text: '开始考试',
          class: 'btn-primary',
          action: function() {
            var count = parseInt(document.getElementById('exam-cfg-count').textContent);
            var timeLimit = parseInt(document.getElementById('exam-cfg-time').textContent);
            App.Practice.startExam({ questionCount: count, timeLimit: timeLimit });
          }
        }
      ]
    });

    // 延迟绑定滑块事件
    setTimeout(function() {
      var countSlider = document.getElementById('exam-cfg-count-slider');
      var timeSlider = document.getElementById('exam-cfg-time-slider');
      if (countSlider) {
        countSlider.addEventListener('input', function() {
          document.getElementById('exam-cfg-count').textContent = this.value;
        });
      }
      if (timeSlider) {
        timeSlider.addEventListener('input', function() {
          document.getElementById('exam-cfg-time').textContent = this.value;
        });
      }
    }, 100);
  }

  function showDomainSelector() {
    var domains = App.Helpers.getDomains(QUESTION_BANK);
    var html = '<div class="domain-grid">';
    domains.forEach(function(domain) {
      html += '<span class="domain-chip' + (App.State.get('selectedDomains').indexOf(domain) !== -1 ? ' selected' : '') + '" data-domain="' + domain + '">' + domain + '</span>';
    });
    html += '</div>';

    new App.Components.Modal({
      title: '选择练习领域',
      content: html,
      buttons: [
        {
          text: '全选',
          class: 'btn-ghost btn-sm',
          action: function() {
            App.State.set('selectedDomains', domains.slice());
            // 重新打开
          }
        },
        { text: '取消', class: 'btn-outline', action: function() {} },
        {
          text: '开始练习',
          class: 'btn-primary',
          action: function() {
            var chips = document.querySelectorAll('.domain-chip.selected');
            var selected = [];
            chips.forEach(function(c) { selected.push(c.getAttribute('data-domain')); });
            if (selected.length === 0) {
              App.Components.showToast('请至少选择一个领域', 'warning');
              return;
            }
            App.State.set('selectedDomains', selected);
            App.Practice.startPractice('domain', { domains: selected });
          }
        }
      ]
    });

    // 绑定芯片点击
    setTimeout(function() {
      document.querySelectorAll('.domain-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
          this.classList.toggle('selected');
        });
      });
    }, 100);
  }

  function showQuestionNav(questions, currentIndex, mode) {
    var html = '';
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var done = false;
      var progress = App.Storage.loadProgress();
      if (progress.records[q.id] && progress.records[q.id].totalAttempts > 0) {
        done = true;
      }
      html += '<div style="display:inline-block;width:36px;height:36px;text-align:center;line-height:36px;' +
        'border-radius:6px;cursor:pointer;margin:3px;font-size:0.78rem;' +
        (i === currentIndex ? 'background:var(--accent);color:#fff;' : '') +
        (done ? 'border:2px solid var(--success);' : 'border:1px solid var(--border-color);') +
        '" data-index="' + i + '">' + (i + 1) + '</div>';
    }

    new App.Components.Modal({
      title: '题目列表 (' + questions.length + '题)',
      content: '<div style="max-height:300px;overflow-y:auto;">' + html + '</div>',
      buttons: [
        { text: '关闭', class: 'btn-outline', action: function() {} }
      ]
    });

    setTimeout(function() {
      document.querySelectorAll('.modal [data-index]').forEach(function(dot) {
        dot.addEventListener('click', function() {
          var idx = parseInt(this.getAttribute('data-index'));
          App.State.goToQuestion(idx);
          App.Router.navigate('practice/' + mode + '?t=' + Date.now());
        });
      });
    }, 100);
  }

  function highlightSidebar(pageName) {
    document.querySelectorAll('.nav-item').forEach(function(item) {
      item.classList.remove('active');
      if (item.getAttribute('data-page') === pageName) {
        item.classList.add('active');
      }
    });

    // 同步高亮移动端底部导航
    if (typeof App !== 'undefined' && App.highlightMobileNav) {
      App.highlightMobileNav(pageName);
    }
  }

  return {
    render: render,
    renderHome: renderHome,
    renderPractice: renderPractice,
    renderExam: renderExam,
    renderWrongBook: renderWrongBook,
    renderStats: renderStats,
    renderSettings: renderSettings
  };
})();
