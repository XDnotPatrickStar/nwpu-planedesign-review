/* ============================================
   Hash 路由管理器
   ============================================ */

var App = App || {};

App.Router = (function() {
  'use strict';

  var routes = {};
  var currentRoute = null;
  var beforeHooks = [];

  /**
   * 注册路由
   * @param {string} pattern - 路由模式，支持 :param 动态参数
   * @param {function} handler - 处理函数，接收 params 对象
   */
  function on(pattern, handler) {
    routes[pattern] = handler;
  }

  /**
   * 添加路由切换前的钩子
   */
  function beforeChange(fn) {
    beforeHooks.push(fn);
  }

  /**
   * 导航到指定路由
   */
  function navigate(hash) {
    window.location.hash = hash;
  }

  /**
   * 获取当前 hash
   */
  function getHash() {
    return window.location.hash.replace('#', '') || 'home';
  }

  /**
   * 解析路由匹配
   */
  function matchRoute(hash) {
    // 分离路径和查询参数
    var parts = hash.split('?');
    var path = parts[0];
    var queryString = parts[1] || '';
    var params = {};

    // 解析查询参数
    if (queryString) {
      queryString.split('&').forEach(function(pair) {
        var kv = pair.split('=');
        if (kv.length === 2) {
          params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
        }
      });
    }

    // 精确匹配
    if (routes[path]) {
      return { handler: routes[path], params: params, path: path };
    }

    // 动态路由匹配（:param）
    var routeKeys = Object.keys(routes);
    for (var i = 0; i < routeKeys.length; i++) {
      var pattern = routeKeys[i];
      if (pattern.indexOf(':') === -1) continue;

      var regexParts = pattern.split('/');
      var hashParts = path.split('/');
      if (regexParts.length !== hashParts.length) continue;

      var match = true;
      for (var j = 0; j < regexParts.length; j++) {
        if (regexParts[j].charAt(0) === ':') {
          params[regexParts[j].substring(1)] = hashParts[j];
        } else if (regexParts[j] !== hashParts[j]) {
          match = false;
          break;
        }
      }

      if (match) {
        return { handler: routes[pattern], params: params, path: path, pattern: pattern };
      }
    }

    // 兜底：home
    if (routes['home']) {
      return { handler: routes['home'], params: {}, path: 'home' };
    }
    return null;
  }

  /**
   * 处理路由变化
   */
  function handleRouteChange() {
    var hash = getHash();

    // 运行前置钩子
    for (var i = 0; i < beforeHooks.length; i++) {
      var shouldContinue = beforeHooks[i](currentRoute, hash);
      if (shouldContinue === false) {
        // 阻止导航，恢复旧 hash
        if (currentRoute) {
          window.location.hash = '#' + currentRoute;
        }
        return;
      }
    }

    var route = matchRoute(hash);
    if (route && route.handler) {
      currentRoute = hash;
      route.params._path = route.path;
      route.params._pattern = route.pattern;
      route.handler(route.params);
    }
  }

  /**
   * 初始化路由
   */
  function init() {
    window.addEventListener('hashchange', handleRouteChange);
    // 首次加载
    if (window.location.hash === '') {
      navigate('home');
    } else {
      handleRouteChange();
    }
  }

  /**
   * 获取当前路由
   */
  function getCurrent() {
    return currentRoute || 'home';
  }

  return {
    on: on,
    navigate: navigate,
    getHash: getHash,
    init: init,
    getCurrent: getCurrent,
    beforeChange: beforeChange
  };
})();
