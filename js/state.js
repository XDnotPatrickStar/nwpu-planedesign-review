/* ============================================
   全局状态管理
   ============================================ */

var App = App || {};

App.State = (function() {
  'use strict';

  // 当前会话状态
  var _state = {
    // 当前轮次的题目列表
    currentQuestions: [],
    // 当前题目索引
    currentIndex: 0,
    // 当前页面
    currentPage: 'home',
    // 练习模式: sequential | random | domain | wrongbook | flashcard | exam
    practiceMode: 'sequential',
    // 考试配置
    examConfig: {
      questionCount: 50,
      timeLimit: 3600, // 秒
      startTime: null,
      answers: {},     // { questionId: [userInput1, userInput2, ...] }
      submitted: false
    },
    // 领域筛选（domain模式使用）
    selectedDomains: [],
    // 用户操作历史（用于撤销）
    history: []
  };

  /**
   * 获取当前状态
   */
  function getState() {
    return _state;
  }

  /**
   * 获取特定属性
   */
  function get(key) {
    return _state[key];
  }

  /**
   * 设置属性
   */
  function set(key, value) {
    _state[key] = value;
  }

  /**
   * 批量设置
   */
  function update(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        _state[key] = obj[key];
      }
    }
  }

  /**
   * 设置当前题目列表
   */
  function setQuestions(questions) {
    _state.currentQuestions = questions;
    _state.currentIndex = 0;
  }

  /**
   * 获取当前题目
   */
  function getCurrentQuestion() {
    if (_state.currentQuestions.length === 0) return null;
    if (_state.currentIndex >= _state.currentQuestions.length) return null;
    return _state.currentQuestions[_state.currentIndex];
  }

  /**
   * 移动到下一题
   * @returns {boolean} 是否还有下一题
   */
  function nextQuestion() {
    if (_state.currentIndex < _state.currentQuestions.length - 1) {
      _state.currentIndex++;
      return true;
    }
    return false;
  }

  /**
   * 移动到上一题
   * @returns {boolean} 是否还有上一题
   */
  function prevQuestion() {
    if (_state.currentIndex > 0) {
      _state.currentIndex--;
      return true;
    }
    return false;
  }

  /**
   * 跳到指定索引
   */
  function goToQuestion(index) {
    if (index >= 0 && index < _state.currentQuestions.length) {
      _state.currentIndex = index;
      return true;
    }
    return false;
  }

  /**
   * 获取进度信息
   */
  function getProgress() {
    return {
      current: _state.currentIndex + 1,
      total: _state.currentQuestions.length,
      percent: _state.currentQuestions.length > 0
        ? Math.round(((_state.currentIndex + 1) / _state.currentQuestions.length) * 100)
        : 0,
      isLast: _state.currentIndex >= _state.currentQuestions.length - 1,
      isFirst: _state.currentIndex === 0
    };
  }

  /**
   * 保存考试答案
   */
  function saveExamAnswer(questionId, userInputs) {
    _state.examConfig.answers[questionId] = userInputs;
  }

  /**
   * 重置会话
   */
  function resetSession() {
    _state.currentQuestions = [];
    _state.currentIndex = 0;
    _state.practiceMode = 'sequential';
    _state.selectedDomains = [];
    _state.examConfig = {
      questionCount: 50,
      timeLimit: 3600,
      startTime: null,
      answers: {},
      submitted: false
    };
  }

  return {
    getState: getState,
    get: get,
    set: set,
    update: update,
    setQuestions: setQuestions,
    getCurrentQuestion: getCurrentQuestion,
    nextQuestion: nextQuestion,
    prevQuestion: prevQuestion,
    goToQuestion: goToQuestion,
    getProgress: getProgress,
    saveExamAnswer: saveExamAnswer,
    resetSession: resetSession
  };
})();
