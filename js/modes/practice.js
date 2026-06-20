/* ============================================
   练习模式与考试模式
   ============================================ */

var App = App || {};

App.Practice = (function() {
  'use strict';

  /**
   * 开始练习会话
   * @param {string} mode - 'sequential'|'random'|'domain'|'wrongbook'|'flashcard'
   * @param {object} options - 额外配置
   */
  function startPractice(mode, options) {
    options = options || {};
    App.State.resetSession();
    App.State.set('practiceMode', mode);

    var questions = [];

    switch (mode) {
      case 'sequential':
        questions = QUESTION_BANK.slice();
        break;

      case 'random':
        questions = App.Helpers.shuffle(QUESTION_BANK);
        if (options.count && options.count < questions.length) {
          questions = questions.slice(0, options.count);
        }
        break;

      case 'domain':
        var domains = options.domains || App.State.get('selectedDomains') || [];
        if (domains.length === 0) {
          domains = DOMAINS.slice();
        }
        questions = App.Helpers.filterByDomains(QUESTION_BANK, domains);
        if (options.shuffle !== false) {
          questions = App.Helpers.shuffle(questions);
        }
        break;

      case 'wrongbook':
        var wrongList = App.Storage.getWrongQuestions();
        var wrongIds = wrongList.map(function(w) { return w.questionId; });
        questions = QUESTION_BANK.filter(function(q) {
          return wrongIds.indexOf(q.id) !== -1;
        });
        // 按错误次数降序排列
        questions.sort(function(a, b) {
          var wa = wrongList.find(function(w) { return w.questionId === a.id; });
          var wb = wrongList.find(function(w) { return w.questionId === b.id; });
          return (wb ? wb.wrongCount : 0) - (wa ? wa.wrongCount : 0);
        });
        break;

      case 'flashcard':
        questions = App.Helpers.shuffle(QUESTION_BANK);
        if (options.count) {
          questions = questions.slice(0, options.count);
        }
        break;

      default:
        questions = QUESTION_BANK.slice();
    }

    if (questions.length === 0) {
      App.Components.showToast('没有找到题目', 'info');
      App.Router.navigate('home');
      return;
    }

    App.State.setQuestions(questions);
    App.Router.navigate('practice/' + mode);
  }

  /**
   * 开始考试
   */
  function startExam(config) {
    config = config || {};
    App.State.resetSession();
    App.State.set('practiceMode', 'exam');

    var questionCount = config.questionCount || 50;
    var timeLimit = (config.timeLimit || 60) * 60; // 转换为秒

    // 按领域比例抽题
    var questions = sampleByDomain(QUESTION_BANK, questionCount);

    App.State.setQuestions(questions);
    App.State.update({
      examConfig: {
        questionCount: questionCount,
        timeLimit: timeLimit,
        startTime: Date.now(),
        answers: {},
        submitted: false
      }
    });

    App.Router.navigate('exam');
  }

  /**
   * 按领域比例随机抽题
   */
  function sampleByDomain(allQuestions, count) {
    // 统计各领域题目数
    var domainCounts = {};
    var domainQuestions = {};
    allQuestions.forEach(function(q) {
      if (!domainCounts[q.domain]) {
        domainCounts[q.domain] = 0;
        domainQuestions[q.domain] = [];
      }
      domainCounts[q.domain]++;
      domainQuestions[q.domain].push(q);
    });

    // 按比例抽取
    var total = allQuestions.length;
    var sampled = [];
    var domains = Object.keys(domainQuestions);

    domains.forEach(function(domain) {
      var proportion = domainCounts[domain] / total;
      var n = Math.max(1, Math.round(count * proportion));
      var domainQs = App.Helpers.shuffle(domainQuestions[domain]);
      sampled = sampled.concat(domainQs.slice(0, n));
    });

    // 如果多了就截断，少了就从剩余题目补充
    sampled = App.Helpers.shuffle(sampled);
    if (sampled.length > count) {
      sampled = sampled.slice(0, count);
    } else if (sampled.length < count) {
      var sampledIds = {};
      sampled.forEach(function(q) { sampledIds[q.id] = true; });
      var remaining = allQuestions.filter(function(q) { return !sampledIds[q.id]; });
      sampled = sampled.concat(App.Helpers.shuffle(remaining).slice(0, count - sampled.length));
    }

    return App.Helpers.shuffle(sampled);
  }

  /**
   * 判定并记录单题答案
   */
  function submitAnswer(question, userInputs) {
    var checkResult = App.Helpers.checkAllAnswers(userInputs, question.blanks);

    // 保存到本地存储
    App.Storage.updateQuestionRecord(question.id, checkResult);

    return checkResult;
  }

  /**
   * 判定考试全部答案
   */
  function gradeExam(questions, answers) {
    var results = [];
    var totalCorrect = 0;
    var totalBlanks = 0;
    var domainScores = {};

    questions.forEach(function(q) {
      var userInputs = answers[q.id] || [];
      var checkResult = App.Helpers.checkAllAnswers(userInputs, q.blanks);

      // 统计领域分数
      if (!domainScores[q.domain]) {
        domainScores[q.domain] = { total: 0, correct: 0 };
      }
      domainScores[q.domain].total += q.blanks.length;
      domainScores[q.domain].correct += checkResult.results.filter(function(r) { return r.correct; }).length;

      totalBlanks += q.blanks.length;
      totalCorrect += checkResult.results.filter(function(r) { return r.correct; }).length;

      results.push({
        questionId: q.id,
        allCorrect: checkResult.allCorrect,
        results: checkResult.results,
        userInputs: userInputs
      });

      // 同步更新单题记录
      App.Storage.updateQuestionRecord(q.id, checkResult);
    });

    var score = totalBlanks > 0 ? Math.round((totalCorrect / totalBlanks) * 100) : 0;

    return {
      totalQuestions: questions.length,
      totalBlanks: totalBlanks,
      correct: totalCorrect,
      score: score,
      domainScores: domainScores,
      details: results
    };
  }

  /**
   * 获取当前模式的元数据
   */
  function getModeMeta(mode) {
    var metas = {
      'sequential': { name: '顺序练习', icon: '📋', desc: '按题号顺序逐一练习' },
      'random': { name: '随机练习', icon: '🎲', desc: '随机抽取题目打乱顺序' },
      'domain': { name: '领域练习', icon: '📂', desc: '按知识点领域选择性练习' },
      'wrongbook': { name: '错题重练', icon: '🔄', desc: '针对薄弱环节强化练习' },
      'flashcard': { name: '闪卡模式', icon: '🃏', desc: '快速浏览查漏补缺' },
      'exam': { name: '模拟考试', icon: '📝', desc: '模拟真实考试环境' }
    };
    return metas[mode] || { name: mode, icon: '📖', desc: '' };
  }

  return {
    startPractice: startPractice,
    startExam: startExam,
    submitAnswer: submitAnswer,
    gradeExam: gradeExam,
    getModeMeta: getModeMeta
  };
})();
