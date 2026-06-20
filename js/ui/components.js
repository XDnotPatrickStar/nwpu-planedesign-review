/* ============================================
   UI 组件：进度条、计时器、弹窗、Toast等
   ============================================ */

var App = App || {};

App.Components = (function() {
  'use strict';

  // --- 进度条 ---
  function ProgressBar(container) {
    this.container = container;
    this.bar = null;
    this.label = null;
    this._init();
  }

  ProgressBar.prototype._init = function() {
    this.container.innerHTML = '';

    this.label = document.createElement('div');
    this.label.style.cssText = 'font-size:0.85rem;color:var(--text-muted);margin-bottom:6px;text-align:center;';
    this.container.appendChild(this.label);

    var track = document.createElement('div');
    track.className = 'progress-bar';
    this.bar = document.createElement('div');
    this.bar.className = 'fill';
    track.appendChild(this.bar);
    this.container.appendChild(track);
  };

  ProgressBar.prototype.update = function(current, total, correct) {
    var pct = total > 0 ? Math.round((current / total) * 100) : 0;
    this.bar.style.width = pct + '%';
    if (correct !== undefined && correct === current) {
      this.bar.classList.add('success');
    } else {
      this.bar.classList.remove('success');
    }
    this.label.textContent = '进度: ' + current + ' / ' + total + ' (' + pct + '%)';
  };

  // --- 倒计时 ---
  function Timer(container, seconds, onTick, onExpire) {
    this.container = container;
    this.remaining = seconds;
    this.running = false;
    this.interval = null;
    this.onTick = onTick || function() {};
    this.onExpire = onExpire || function() {};
    this._init();
  }

  Timer.prototype._init = function() {
    this.container.innerHTML = '<span class="timer">' + App.Helpers.formatTime(this.remaining) + '</span>';
  };

  Timer.prototype.start = function() {
    var self = this;
    this.running = true;
    this.interval = setInterval(function() {
      self.remaining--;
      self._update();
      self.onTick(self.remaining);

      if (self.remaining <= 0) {
        self.stop();
        self.onExpire();
      }
    }, 1000);
  };

  Timer.prototype.stop = function() {
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  Timer.prototype._update = function() {
    var timeStr = App.Helpers.formatTime(this.remaining);
    var timerEl = this.container.querySelector('.timer');
    if (timerEl) {
      timerEl.textContent = timeStr;
      timerEl.className = 'timer';
      if (this.remaining <= 60) {
        timerEl.classList.add('danger');
      } else if (this.remaining <= 300) {
        timerEl.classList.add('warning');
      }
    }
  };

  Timer.prototype.getElapsed = function() {
    return this._totalSeconds - this.remaining;
  };

  Timer.prototype.setTotal = function(total) {
    this._totalSeconds = total;
  };

  // --- 弹窗 ---
  function Modal(options) {
    this.title = options.title || '';
    this.content = options.content || '';
    this.buttons = options.buttons || [{ text: '确定', class: 'btn-primary', action: function() {} }];
    this.onClose = options.onClose || null;
    this.overlay = null;
    this._render();
  }

  Modal.prototype._render = function() {
    var self = this;

    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';

    var modal = document.createElement('div');
    modal.className = 'modal';

    var title = document.createElement('h2');
    title.textContent = this.title;
    modal.appendChild(title);

    var content = document.createElement('div');
    if (typeof this.content === 'string') {
      content.innerHTML = this.content;
    } else if (this.content instanceof HTMLElement) {
      content.appendChild(this.content);
    }
    modal.appendChild(content);

    var actions = document.createElement('div');
    actions.className = 'modal-actions';

    this.buttons.forEach(function(btn) {
      var button = document.createElement('button');
      button.textContent = btn.text;
      button.className = 'btn ' + (btn.class || 'btn-outline');
      button.addEventListener('click', function() {
        if (btn.action) btn.action();
        self.close();
      });
      actions.appendChild(button);
    });

    modal.appendChild(actions);
    this.overlay.appendChild(modal);

    // 点击遮罩关闭（可选）
    this.overlay.addEventListener('click', function(e) {
      if (e.target === self.overlay) {
        self.close();
      }
    });

    document.body.appendChild(this.overlay);
  };

  Modal.prototype.close = function() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    if (this.onClose) this.onClose();
  };

  // --- Toast ---
  function showToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;

    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(function() {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // --- 确认对话框 ---
  function confirm(title, message, onConfirm, onCancel) {
    new Modal({
      title: title,
      content: '<p>' + message + '</p>',
      buttons: [
        {
          text: '取消',
          class: 'btn-outline',
          action: onCancel || function() {}
        },
        {
          text: '确认',
          class: 'btn-primary',
          action: onConfirm || function() {}
        }
      ]
    });
  }

  // --- 题目导航器（跳转到指定题号） ---
  function QuestionNavigator(container, totalQuestions, currentIndex, onSelect) {
    this.container = container;
    this.total = totalQuestions;
    this.current = currentIndex;
    this.onSelect = onSelect;
    this._render();
  }

  QuestionNavigator.prototype._render = function() {
    var self = this;
    this.container.innerHTML = '';

    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;max-height:300px;overflow-y:auto;padding:8px;';

    for (var i = 0; i < this.total; i++) {
      var dot = document.createElement('div');
      dot.textContent = i + 1;
      dot.style.cssText = 'width:32px;height:32px;display:flex;align-items:center;justify-content:center;' +
        'border-radius:6px;cursor:pointer;font-size:0.8rem;border:1px solid var(--border-color);' +
        'transition:all 0.15s ease;';
      dot.setAttribute('data-index', i);

      if (i === this.current) {
        dot.style.background = 'var(--accent)';
        dot.style.color = '#fff';
        dot.style.borderColor = 'var(--accent)';
      }

      // 检查进度状态
      var progress = App.Storage.loadProgress();
      var record = progress.records[i + 1]; // question id = index + 1 (approximately)
      // 实际上需要根据当前题目列表映射
      // 这里简化处理

      (function(index) {
        dot.addEventListener('click', function() {
          self.onSelect(index);
        });
      })(i);

      wrapper.appendChild(dot);
    }

    this.container.appendChild(wrapper);
  };

  QuestionNavigator.prototype.updateCurrent = function(index) {
    this.current = index;
    var dots = this.container.querySelectorAll('[data-index]');
    dots.forEach(function(dot) {
      var i = parseInt(dot.getAttribute('data-index'));
      dot.style.background = '';
      dot.style.color = '';
      dot.style.borderColor = 'var(--border-color)';
      if (i === index) {
        dot.style.background = 'var(--accent)';
        dot.style.color = '#fff';
        dot.style.borderColor = 'var(--accent)';
      }
    });
  };

  return {
    ProgressBar: ProgressBar,
    Timer: Timer,
    Modal: Modal,
    showToast: showToast,
    confirm: confirm,
    QuestionNavigator: QuestionNavigator
  };
})();
