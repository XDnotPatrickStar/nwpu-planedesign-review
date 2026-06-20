/* ============================================
   主入口：用户认证 → 路由初始化 → 应用启动
   ============================================ */

var App = App || {};

(function() {
  'use strict';

  function init() {
    // ── 步骤 1：检查用户 ──
    var activeUser = App.User.getActiveUser();
    if (!activeUser) {
      showUserLogin();
      return;
    }

    // ── 步骤 2：加载用户设置 ──
    var settings = App.Storage.getSettings();
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');

    // ── 步骤 3：更新顶栏显示用户名 ──
    updateUserDisplay(activeUser);

    // ── 步骤 4：注册路由 ──
    App.Router.on('home', function() {
      App.State.set('currentPage', 'home');
      App.Pages.render('home');
    });

    App.Router.on('practice', function(params) {
      App.State.set('currentPage', 'practice');
      var mode = params.mode || 'sequential';
      App.Pages.render('practice', { mode: mode });
    });

    App.Router.on('practice/:mode', function(params) {
      App.State.set('currentPage', 'practice');
      App.Pages.render('practice', { mode: params.mode });
    });

    App.Router.on('exam', function() {
      App.State.set('currentPage', 'exam');
      App.Pages.render('exam');
    });

    App.Router.on('wrongbook', function() {
      App.State.set('currentPage', 'wrongbook');
      App.Pages.render('wrongbook');
    });

    App.Router.on('stats', function() {
      App.State.set('currentPage', 'stats');
      App.Pages.render('stats');
    });

    App.Router.on('settings', function() {
      App.State.set('currentPage', 'settings');
      App.Pages.render('settings');
    });

    // ── 步骤 5：考试中禁止跳出的守卫 ──
    App.Router.beforeChange(function(from, to) {
      var examConfig = App.State.get('examConfig');
      if (examConfig && !examConfig.submitted && examConfig.startTime) {
        var fromPage = (from || '').replace('#', '');
        if (fromPage === 'exam' && to !== 'exam') {
          App.Components.confirm(
            '考试进行中',
            '退出考试将丢失当前进度，确定要离开吗？',
            function() {
              App.State.resetSession();
              window.location.hash = '#' + to;
            }
          );
          return false;
        }
      }
    });

    // ── 步骤 6：绑定 UI 事件 ──
    bindSidebar();
    bindMobileNav();
    bindMenuToggle();
    bindUserButton();

    // ── 步骤 7：启动路由 ──
    App.Router.init();

    // ── 步骤 8：初始状态 ──
    updateWrongBadge();
    highlightMobileNav('home');

    console.log('✈ 飞机设计工程学填空题复习系统');
    console.log('  当前用户: ' + activeUser);
    console.log('  共 ' + QUESTION_BANK.length + ' 道填空题');
    console.log('  快捷键: Enter=提交, →/空格=下一题, ←=上一题, S=显示答案');
  }

  // ══════════════════════════════════════
  // 用户登录界面
  // ══════════════════════════════════════
  function showUserLogin() {
    var content = document.getElementById('content');
    if (!content) return;

    var users = App.User.getUserSummaries();

    var html = '';
    html += '<div style="max-width:440px;margin:40px auto 0;text-align:center;">';
    html += '<div style="font-size:3rem;margin-bottom:8px;">✈</div>';
    html += '<h1 style="font-size:1.4rem;margin-bottom:4px;">飞机设计工程学</h1>';
    html += '<p style="color:var(--text-muted);margin-bottom:28px;">填空题复习系统 · ' + QUESTION_BANK.length + ' 题</p>';

    // 已有用户列表
    if (users.length > 0) {
      html += '<div style="text-align:left;margin-bottom:20px;">';
      html += '<p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:10px;">选择你的账号继续学习：</p>';
      users.forEach(function(u) {
        html += '<div class="user-card" data-user="' + u.name + '" style="';
        html += 'background:var(--bg-card);border:1px solid var(--border-color);';
        html += 'border-radius:var(--radius);padding:14px 18px;margin-bottom:8px;';
        html += 'cursor:pointer;transition:all var(--transition);';
        html += 'display:flex;justify-content:space-between;align-items:center;';
        html += '" onmouseover="this.style.borderColor=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border-color)\'">';
        html += '<div>';
        html += '<div style="font-weight:600;">' + u.name + '</div>';
        html += '<div style="font-size:0.78rem;color:var(--text-muted);">';
        html += u.totalQuestions + ' 题已练 · 正确率 ' + u.accuracy + '% · ' + u.wrongCount + ' 错题';
        html += '</div></div>';
        html += '<span style="color:var(--accent);font-weight:600;font-size:0.85rem;">进入 →</span>';
        html += '</div>';
      });
      html += '</div>';
    }

    // 新建用户
    html += '<div style="background:var(--bg-card);border:2px dashed var(--accent);';
    html += 'border-radius:var(--radius);padding:20px;margin-top:12px;">';
    html += '<p style="font-weight:600;margin-bottom:12px;">' + (users.length > 0 ? '或者，新建账号：' : '输入昵称开始复习：') + '</p>';
    html += '<div style="display:flex;gap:8px;">';
    html += '<input type="text" id="new-user-input" class="input" placeholder="你的昵称（如：张三）" ';
    html += 'maxlength="20" style="flex:1;text-align:center;" autocomplete="off">';
    html += '<button class="btn btn-primary" id="btn-new-user">开始 ✈</button>';
    html += '</div>';
    html += '<p style="font-size:0.7rem;color:var(--text-muted);margin-top:8px;">';
    html += '你的答题进度将独立保存，与其他人互不影响</p>';
    html += '</div>';

    html += '</div>';
    content.innerHTML = html;

    // 事件绑定
    document.querySelectorAll('.user-card[data-user]').forEach(function(card) {
      card.addEventListener('click', function() {
        var name = this.getAttribute('data-user');
        App.User.setActiveUser(name);
        location.reload();
      });
    });

    document.getElementById('btn-new-user').addEventListener('click', function() {
      var input = document.getElementById('new-user-input');
      var name = input.value.trim();
      if (!name) {
        input.style.borderColor = 'var(--error)';
        input.focus();
        return;
      }
      App.User.register(name);
      location.reload();
    });

    document.getElementById('new-user-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        document.getElementById('btn-new-user').click();
      }
    });

    setTimeout(function() {
      var input = document.getElementById('new-user-input');
      if (input) input.focus();
    }, 200);

    // 隐藏侧边栏和顶栏
    var sidebar = document.getElementById('sidebar');
    var topbar = document.getElementById('topbar');
    var mobileNav = document.getElementById('mobile-nav');
    if (sidebar) sidebar.style.display = 'none';
    if (topbar) topbar.style.display = 'none';
    if (mobileNav) mobileNav.style.display = 'none';
  }

  // ══════════════════════════════════════
  // UI 绑定
  // ══════════════════════════════════════

  function bindSidebar() {
    document.querySelectorAll('.nav-item[data-page]').forEach(function(item) {
      item.addEventListener('click', function() {
        App.Router.navigate(this.getAttribute('data-page'));
        closeSidebar();
      });
    });
  }

  function bindMobileNav() {
    document.querySelectorAll('.mobile-nav-item[data-page]').forEach(function(item) {
      item.addEventListener('click', function() {
        var page = this.getAttribute('data-page');
        if (page === 'practice') page = 'home';
        App.Router.navigate(page);
        closeSidebar();
      });
    });
  }

  function bindMenuToggle() {
    var menuToggle = document.getElementById('menu-toggle');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (menuToggle) {
      menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('show', sidebar.classList.contains('open'));
      });
    }
    if (overlay) {
      overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }
  }

  function bindUserButton() {
    var btn = document.getElementById('btn-user');
    if (btn) {
      btn.addEventListener('click', function() {
        App.User.logout();
        location.reload();
      });
    }
  }

  function closeSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  }

  function updateUserDisplay(name) {
    var el = document.getElementById('current-user-name');
    if (el) el.textContent = name;

    // 恢复侧边栏和顶栏（登录后）
    var sidebar = document.getElementById('sidebar');
    var topbar = document.getElementById('topbar');
    var mobileNav = document.getElementById('mobile-nav');
    if (sidebar) sidebar.style.display = '';
    if (topbar) topbar.style.display = '';
    // mobileNav 由 CSS 媒体查询控制
  }

  function highlightMobileNav(pageName) {
    document.querySelectorAll('.mobile-nav-item').forEach(function(item) {
      item.classList.remove('active');
      var itemPage = item.getAttribute('data-page');
      if (itemPage === pageName || (itemPage === 'practice' && pageName === 'practice')) {
        item.classList.add('active');
      }
    });
    document.querySelectorAll('.nav-item[data-page]').forEach(function(ni) {
      ni.classList.remove('active');
      if (ni.getAttribute('data-page') === pageName) ni.classList.add('active');
    });
  }

  function updateWrongBadge() {
    var wrongList = App.Storage.getWrongQuestions();
    var badge = document.querySelector('.nav-item[data-page="wrongbook"] .nav-badge');
    if (badge) {
      badge.textContent = wrongList.length;
      badge.style.display = wrongList.length > 0 ? '' : 'none';
    }
  }

  /** 公开 API */
  App.highlightMobileNav = highlightMobileNav;
  App.closeSidebar = closeSidebar;
  App.init = init;
  App.updateWrongBadge = updateWrongBadge;

  setInterval(updateWrongBadge, 5000);

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
