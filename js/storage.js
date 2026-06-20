/* ============================================
   localStorage 读写封装（支持多用户隔离）
   ============================================ */

var App = App || {};

App.Storage = (function() {
  'use strict';

  var BASE_KEY = 'nwpu_plane_progress';
  var VERSION = 1;

  /** 获取当前用户的存储键 */
  function getStorageKey() {
    var user = App.User ? App.User.getActiveUser() : null;
    if (user) {
      return BASE_KEY + '_' + user;
    }
    return BASE_KEY + '_guest';
  }

  /**
   * 获取默认进度数据
   */
  function getDefaultProgress() {
    return {
      version: VERSION,
      records: {},        // { questionId: Record }
      examHistory: [],    // [ExamResult]
      settings: {
        theme: 'dark',
        fontSize: 'medium',
        examQuestionCount: 50,
        examTimeLimit: 60, // 分钟
        autoRemoveWrong: 3 // 连续答对N次从错题本移除
      },
      stats: {
        totalPracticeSessions: 0,
        streakDays: 0,
        lastPracticeDate: null
      }
    };
  }

  /**
   * 读取进度
   */
  function loadProgress() {
    try {
      var raw = localStorage.getItem(getStorageKey());
      if (!raw) return getDefaultProgress();

      var data = JSON.parse(raw);

      // 版本迁移
      if (!data.version || data.version < VERSION) {
        data = migrate(data);
      }

      // 确保所需字段存在
      if (!data.records) data.records = {};
      if (!data.examHistory) data.examHistory = [];
      if (!data.settings) data.settings = getDefaultProgress().settings;
      if (!data.stats) data.stats = getDefaultProgress().stats;

      return data;
    } catch (e) {
      console.warn('Failed to load progress, using defaults:', e);
      return getDefaultProgress();
    }
  }

  /**
   * 保存进度
   */
  function saveProgress(progress) {
    try {
      var json = JSON.stringify(progress);
      localStorage.setItem(getStorageKey(), json);
      return true;
    } catch (e) {
      console.error('Failed to save progress:', e);
      // 尝试清理旧数据
      if (e.name === 'QuotaExceededError') {
        // 保留最近50条考试记录
        if (progress.examHistory && progress.examHistory.length > 50) {
          progress.examHistory = progress.examHistory.slice(-50);
          return saveProgress(progress);
        }
      }
      return false;
    }
  }

  /**
   * 更新单题记录
   */
  function updateQuestionRecord(questionId, result) {
    var progress = loadProgress();
    if (!progress.records[questionId]) {
      progress.records[questionId] = {
        totalAttempts: 0,
        correctAttempts: 0,
        consecutiveCorrect: 0,
        lastAttemptTime: null,
        lastCorrect: false,
        wrongHistory: [],
        mastery: 0,
        bookmarked: false
      };
    }

    var record = progress.records[questionId];
    record.totalAttempts++;
    if (result.allCorrect) {
      record.correctAttempts++;
      record.consecutiveCorrect++;
      record.lastCorrect = true;
    } else {
      record.consecutiveCorrect = 0;
      record.lastCorrect = false;
      record.wrongHistory.push({
        time: Date.now(),
        inputs: result.results.map(function(r) { return r.userInput; }),
        blankIds: result.results.filter(function(r) { return !r.correct; }).map(function(r) { return r.blankId; })
      });
      // 只保留最近10条错误记录
      if (record.wrongHistory.length > 10) {
        record.wrongHistory = record.wrongHistory.slice(-10);
      }
    }
    record.lastAttemptTime = Date.now();
    record.mastery = record.totalAttempts > 0
      ? Math.round((record.correctAttempts / record.totalAttempts) * 100) / 100
      : 0;

    // 更新学习天数统计
    updateStreak(progress);

    saveProgress(progress);
    return record;
  }

  /**
   * 更新连续学习天数
   */
  function updateStreak(progress) {
    var today = new Date();
    var todayStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

    var lastDate = progress.stats.lastPracticeDate;
    if (lastDate === todayStr) return; // 今天已经记录过

    if (lastDate) {
      var lastParts = lastDate.split('-');
      var lastDay = new Date(parseInt(lastParts[0]), parseInt(lastParts[1]) - 1, parseInt(lastParts[2]));
      var diffDays = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        progress.stats.streakDays++;
      } else if (diffDays > 1) {
        progress.stats.streakDays = 1;
      }
    } else {
      progress.stats.streakDays = 1;
    }
    progress.stats.lastPracticeDate = todayStr;
  }

  /**
   * 获取错题列表
   * @returns {Array} [{questionId, wrongCount, lastWrong, ...}]
   */
  function getWrongQuestions() {
    var progress = loadProgress();
    var wrongList = [];

    for (var qid in progress.records) {
      if (progress.records.hasOwnProperty(qid)) {
        var record = progress.records[qid];
        if (record.wrongHistory && record.wrongHistory.length > 0) {
          wrongList.push({
            questionId: parseInt(qid),
            wrongCount: record.wrongHistory.length,
            totalAttempts: record.totalAttempts,
            mastery: record.mastery,
            lastWrong: record.wrongHistory[record.wrongHistory.length - 1],
            consecutiveCorrect: record.consecutiveCorrect
          });
        }
      }
    }

    // 按错误次数降序排列
    wrongList.sort(function(a, b) {
      return b.wrongCount - a.wrongCount;
    });

    return wrongList;
  }

  /**
   * 添加考试记录
   */
  function addExamRecord(result) {
    var progress = loadProgress();
    progress.examHistory.push({
      id: App.Helpers ? App.Helpers.generateId() : Date.now().toString(36),
      date: Date.now(),
      totalQuestions: result.totalQuestions,
      correct: result.correct,
      score: result.score,
      timeUsed: result.timeUsed,
      domainScores: result.domainScores || {},
      details: result.details || []
    });

    // 保留最近100条考试记录
    if (progress.examHistory.length > 100) {
      progress.examHistory = progress.examHistory.slice(-100);
    }

    updateStreak(progress);
    saveProgress(progress);
  }

  /**
   * 获取统计数据
   */
  function getStats() {
    var progress = loadProgress();
    var totalQuestions = Object.keys(progress.records).length;
    var totalAttempts = 0;
    var totalCorrect = 0;

    var domainStats = {};
    for (var qid in progress.records) {
      if (progress.records.hasOwnProperty(qid)) {
        var r = progress.records[qid];
        totalAttempts += r.totalAttempts;
        totalCorrect += r.correctAttempts;
      }
    }

    return {
      totalQuestionsPracticed: totalQuestions,
      totalAttempts: totalAttempts,
      totalCorrect: totalCorrect,
      overallAccuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      examCount: progress.examHistory.length,
      streakDays: progress.stats.streakDays,
      examHistory: progress.examHistory
    };
  }

  /**
   * 获取设置
   */
  function getSettings() {
    var progress = loadProgress();
    return progress.settings;
  }

  /**
   * 更新设置
   */
  function updateSettings(newSettings) {
    var progress = loadProgress();
    for (var key in newSettings) {
      if (newSettings.hasOwnProperty(key) && progress.settings.hasOwnProperty(key)) {
        progress.settings[key] = newSettings[key];
      }
    }
    saveProgress(progress);
  }

  /**
   * 导出数据（JSON 字符串）
   */
  function exportData() {
    var progress = loadProgress();
    return JSON.stringify(progress, null, 2);
  }

  /**
   * 导入数据
   * @returns {boolean} 是否成功
   */
  function importData(jsonStr) {
    try {
      var data = JSON.parse(jsonStr);
      if (!data.version || !data.records) {
        throw new Error('Invalid data format');
      }
      saveProgress(data);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  /**
   * 清除所有数据
   */
  function clearAll() {
    try {
      localStorage.removeItem(getStorageKey());
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 数据版本迁移
   */
  function migrate(oldData) {
    // 目前是 v1，无需迁移
    // 未来版本升级时在此处理
    var defaults = getDefaultProgress();
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key) && !(key in oldData)) {
        oldData[key] = defaults[key];
      }
    }
    oldData.version = VERSION;
    return oldData;
  }

  return {
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    updateQuestionRecord: updateQuestionRecord,
    getWrongQuestions: getWrongQuestions,
    addExamRecord: addExamRecord,
    getStats: getStats,
    getSettings: getSettings,
    updateSettings: updateSettings,
    exportData: exportData,
    importData: importData,
    clearAll: clearAll
  };
})();
