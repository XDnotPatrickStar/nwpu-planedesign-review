/* ============================================
   工具函数：答案匹配、洗牌、格式化等
   ============================================ */

var App = App || {};

App.Helpers = (function() {
  'use strict';

  // --- 答案匹配 ---

  /**
   * 规范化文本：去除首尾空格、全角转半角、统一标点
   */
  function normalize(text) {
    if (!text) return '';
    var result = text.trim();
    // 全角转半角（字母、数字、符号）
    result = result.replace(/[！-～]/g, function(ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
    });
    // 中文标点转标准（可调整）
    result = result.replace(/，/g, ',');
    result = result.replace(/；/g, ';');
    result = result.replace(/：/g, ':');
    result = result.replace(/（/g, '(');
    result = result.replace(/）/g, ')');
    return result;
  }

  /**
   * Levenshtein 编辑距离
   */
  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var matrix = [];
    for (var i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (var j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (var i = 1; i <= b.length; i++) {
      for (var j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  /**
   * 模糊匹配：基于编辑距离的相似度
   * @param {string} userInput - 用户输入
   * @param {string} correctAnswer - 正确答案
   * @param {number} threshold - 相似度阈值 (0-1)，默认0.85
   * @returns {boolean}
   */
  function fuzzyMatch(userInput, correctAnswer, threshold) {
    if (!threshold) threshold = 0.85;
    if (!userInput || !correctAnswer) return false;
    var maxLen = Math.max(userInput.length, correctAnswer.length);
    if (maxLen === 0) return true;
    var dist = levenshtein(userInput, correctAnswer);
    var similarity = 1 - dist / maxLen;
    return similarity >= threshold;
  }

  /**
   * 判定单个空的答案是否正确
   * @param {string} userInput - 用户输入
   * @param {string} correctAnswer - 正确答案
   * @param {string[]} alternatives - 可接受的替代答案
   * @returns {{correct: boolean, isExact: boolean, isAlternative: boolean, isFuzzy: boolean}}
   */
  function checkAnswer(userInput, correctAnswer, alternatives) {
    var input = normalize(userInput);
    var correct = normalize(correctAnswer);

    // 空输入直接判错
    if (!input) return { correct: false, isExact: false, isAlternative: false, isFuzzy: false };

    // 1. 精确匹配
    if (input === correct) {
      return { correct: true, isExact: true, isAlternative: false, isFuzzy: false };
    }

    // 2. 替代答案匹配
    if (alternatives && alternatives.length > 0) {
      for (var i = 0; i < alternatives.length; i++) {
        if (input === normalize(alternatives[i])) {
          return { correct: true, isExact: false, isAlternative: true, isFuzzy: false };
        }
      }
    }

    // 3. 模糊匹配（仅当长度差异不超过3个字符时）
    var lenDiff = Math.abs(input.length - correct.length);
    if (lenDiff <= 3 && fuzzyMatch(input, correct)) {
      return { correct: true, isExact: false, isAlternative: false, isFuzzy: true };
    }

    return { correct: false, isExact: false, isAlternative: false, isFuzzy: false };
  }

  /**
   * 判定一道题所有空的答案
   * @param {string[]} userInputs - 用户对各空的输入
   * @param {object[]} blankConfigs - 空的配置 [{answer, alternatives}, ...]
   * @returns {{allCorrect: boolean, results: object[]}}
   */
  function checkAllAnswers(userInputs, blankConfigs) {
    var results = [];
    var allCorrect = true;

    for (var i = 0; i < blankConfigs.length; i++) {
      var userInput = (userInputs && userInputs[i]) ? userInputs[i] : '';
      var config = blankConfigs[i];
      var result = checkAnswer(userInput, config.answer, config.alternatives || []);
      result.blankId = config.id || (i + 1);
      result.userInput = userInput;
      result.correctAnswer = config.answer;
      results.push(result);
      if (!result.correct) allCorrect = false;
    }

    return { allCorrect: allCorrect, results: results };
  }

  // --- 随机与排序 ---

  /**
   * Fisher-Yates 洗牌算法
   */
  function shuffle(arr) {
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = result[i];
      result[i] = result[j];
      result[j] = tmp;
    }
    return result;
  }

  /**
   * 从数组中随机抽取 n 个元素
   */
  function sample(arr, n) {
    var shuffled = shuffle(arr);
    return shuffled.slice(0, Math.min(n, arr.length));
  }

  // --- 格式化 ---

  /**
   * 格式化时间（秒 -> MM:SS 或 HH:MM:SS）
   */
  function formatTime(seconds) {
    if (seconds < 0) seconds = 0;
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var parts = [];
    if (h > 0) parts.push(String(h).padStart(2, '0'));
    parts.push(String(m).padStart(2, '0'));
    parts.push(String(s).padStart(2, '0'));
    return parts.join(':');
  }

  /**
   * 格式化日期
   */
  function formatDate(timestamp) {
    var d = new Date(timestamp);
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    var h = String(d.getHours()).padStart(2, '0');
    var min = String(d.getMinutes()).padStart(2, '0');
    return y + '-' + m + '-' + day + ' ' + h + ':' + min;
  }

  /**
   * 计算百分比
   */
  function percent(part, total) {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  }

  // --- 生成题目列表的工具 ---

  /**
   * 按领域筛选题目
   */
  function filterByDomains(questions, domains) {
    if (!domains || domains.length === 0) return questions.slice();
    return questions.filter(function(q) {
      return domains.indexOf(q.domain) !== -1;
    });
  }

  /**
   * 获取所有唯一的领域列表
   */
  function getDomains(questions) {
    var seen = {};
    var domains = [];
    for (var i = 0; i < questions.length; i++) {
      var d = questions[i].domain;
      if (!seen[d]) {
        seen[d] = true;
        domains.push(d);
      }
    }
    return domains;
  }

  /**
   * 生成唯一ID（用于考试记录等）
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  // --- 导出 ---
  return {
    normalize: normalize,
    levenshtein: levenshtein,
    fuzzyMatch: fuzzyMatch,
    checkAnswer: checkAnswer,
    checkAllAnswers: checkAllAnswers,
    shuffle: shuffle,
    sample: sample,
    formatTime: formatTime,
    formatDate: formatDate,
    percent: percent,
    filterByDomains: filterByDomains,
    getDomains: getDomains,
    generateId: generateId
  };
})();
