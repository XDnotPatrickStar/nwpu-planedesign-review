/* ============================================
   用户系统：多用户隔离、自动登录、用户切换
   ============================================ */

var App = App || {};

App.User = (function() {
  'use strict';

  var USER_LIST_KEY = 'nwpu_plane_user_list';   // 用户列表
  var ACTIVE_USER_KEY = 'nwpu_plane_active_user'; // 当前活跃用户

  /**
   * 获取所有已注册用户
   */
  function getUserList() {
    try {
      var raw = localStorage.getItem(USER_LIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * 保存用户列表
   */
  function saveUserList(list) {
    localStorage.setItem(USER_LIST_KEY, JSON.stringify(list));
  }

  /**
   * 注册新用户
   */
  function register(name) {
    name = name.trim();
    if (!name || name.length > 20) return null;
    if (/[<>"'{}\[\]\\\/]/.test(name)) return null; // 防 XSS

    var list = getUserList();
    if (list.indexOf(name) === -1) {
      list.push(name);
      saveUserList(list);
    }
    setActiveUser(name);
    return name;
  }

  /**
   * 设置活跃用户
   */
  function setActiveUser(name) {
    localStorage.setItem(ACTIVE_USER_KEY, name);
  }

  /**
   * 获取活跃用户
   */
  function getActiveUser() {
    return localStorage.getItem(ACTIVE_USER_KEY) || null;
  }

  /**
   * 登出（切换到选择界面）
   */
  function logout() {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }

  /**
   * 删除用户及其数据
   */
  function deleteUser(name) {
    // 删除数据
    var key = 'nwpu_plane_progress_' + name;
    localStorage.removeItem(key);

    // 从列表中移除
    var list = getUserList().filter(function(u) { return u !== name; });
    saveUserList(list);

    // 如果删除的是当前用户，清空活跃
    if (getActiveUser() === name) {
      logout();
    }
  }

  /**
   * 获取所有用户及其统计摘要
   */
  function getUserSummaries() {
    var list = getUserList();
    return list.map(function(name) {
      var progress;
      try {
        var raw = localStorage.getItem('nwpu_plane_progress_' + name);
        progress = raw ? JSON.parse(raw) : null;
      } catch (e) {
        progress = null;
      }

      var totalAttempts = 0, totalCorrect = 0, wrongCount = 0;
      if (progress && progress.records) {
        for (var qid in progress.records) {
          if (progress.records.hasOwnProperty(qid)) {
            var r = progress.records[qid];
            totalAttempts += r.totalAttempts || 0;
            totalCorrect += r.correctAttempts || 0;
            if (r.wrongHistory && r.wrongHistory.length > 0) {
              wrongCount++;
            }
          }
        }
      }

      return {
        name: name,
        totalAttempts: totalAttempts,
        accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
        wrongCount: wrongCount,
        totalQuestions: progress ? Object.keys(progress.records || {}).length : 0
      };
    });
  }

  return {
    getUserList: getUserList,
    register: register,
    setActiveUser: setActiveUser,
    getActiveUser: getActiveUser,
    logout: logout,
    deleteUser: deleteUser,
    getUserSummaries: getUserSummaries
  };
})();
