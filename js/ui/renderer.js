/* ============================================
   题目渲染器：{{n}} 模板解析 → DOM 渲染
   ============================================ */

var App = App || {};

App.Renderer = (function() {
  'use strict';

  /**
   * 解析题目文本，将其分解为文本段和空位段
   * 例如 "{{1}}的方法是飞机{{2}}的基础。" →
   *   [{type:'blank', id:1}, {type:'text', content:'的方法是飞机'}, {type:'blank', id:2}, {type:'text', content:'的基础。'}]
   */
  function parseSegments(text) {
    var segments = [];
    var regex = /\{\{(\d+)\}\}/g;
    var lastIndex = 0;
    var match;

    while ((match = regex.exec(text)) !== null) {
      // 前面的文本
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }
      // 空位
      segments.push({
        type: 'blank',
        id: parseInt(match[1]),
        index: segments.filter(function(s) { return s.type === 'blank'; }).length
      });
      lastIndex = match.index + match[0].length;
    }

    // 末尾文本
    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }

    return segments;
  }

  /**
   * 渲染题目到容器中
   * @param {object} question - 题目数据
   * @param {HTMLElement} container - 目标容器
   * @param {object} options - 配置选项
   *   - disabled: 是否禁用输入
   *   - showAnswers: 是否显示正确答案
   *   - userInputs: 用户之前输入的答案数组
   *   - results: checkAllAnswers 返回的结果（用于高亮正误）
   *   - compact: 紧凑模式（用于错题本列表预览）
   */
  function renderQuestion(question, container, options) {
    options = options || {};
    container.innerHTML = '';

    if (options.compact) {
      return renderCompact(question, container, options);
    }

    var segments = parseSegments(question.text);
    var qDiv = document.createElement('div');
    qDiv.className = 'question-text';

    var blankIndex = 0;

    segments.forEach(function(seg) {
      if (seg.type === 'text') {
        var span = document.createElement('span');
        span.textContent = seg.content;
        span.className = 'text-segment';
        qDiv.appendChild(span);
      } else if (seg.type === 'blank') {
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'blank-input';
        input.setAttribute('data-blank-id', seg.id);
        input.setAttribute('data-blank-index', blankIndex);

        // 设置答案
        if (options.showAnswers && question.blanks[blankIndex]) {
          input.value = question.blanks[blankIndex].answer;
          input.disabled = true;
          input.classList.add('correct');
        } else if (options.userInputs && options.userInputs[blankIndex]) {
          input.value = options.userInputs[blankIndex];
        }

        // 结果高亮
        if (options.results && options.results[blankIndex]) {
          var r = options.results[blankIndex];
          if (r.correct) {
            input.classList.add('correct');
          } else {
            input.classList.add('incorrect');
            if (!options.userInputs || !options.userInputs[blankIndex]) {
              input.value = r.userInput || '';
            }
          }
          input.disabled = true;
        } else if (options.disabled) {
          input.disabled = true;
        }

        // 自动调整宽度
        input.style.width = Math.max(100, Math.min(280,
          (question.blanks[blankIndex] ? question.blanks[blankIndex].answer.length * 20 : 120))) + 'px';

        input.addEventListener('input', function() {
          // 动态调整输入框宽度
          var len = this.value.length || 1;
          this.style.width = Math.max(80, Math.min(300, len * 22 + 20)) + 'px';
        });

        qDiv.appendChild(input);
        blankIndex++;
      }
    });

    container.appendChild(qDiv);
    return qDiv;
  }

  /**
   * 紧凑渲染（用于错题本列表）
   */
  function renderCompact(question, container, options) {
    var text = question.text;
    var blanks = question.blanks;

    // 替换 {{n}} 为答案显示
    var displayText = text.replace(/\{\{(\d+)\}\}/g, function(match, id) {
      var blank = blanks.find(function(b) { return b.id === parseInt(id); });
      if (blank) {
        return '<strong class="answer-highlight">' + blank.answer + '</strong>';
      }
      return '______';
    });

    var div = document.createElement('div');
    div.innerHTML = displayText;
    div.className = 'compact-question';
    container.appendChild(div);
  }

  /**
   * 构建答案输入区（用于考试模式中批量输入）
   */
  function renderAnswerInputs(question, container, options) {
    options = options || {};
    container.innerHTML = '';

    question.blanks.forEach(function(blank, index) {
      var row = document.createElement('div');
      row.className = 'answer-row';

      var label = document.createElement('label');
      label.textContent = '空' + blank.id + ':';
      row.appendChild(label);

      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'input';
      input.setAttribute('data-blank-index', index);
      input.placeholder = '请输入答案';

      if (options.showAnswers) {
        input.value = blank.answer;
        input.disabled = true;
        input.classList.add('success');
      } else if (options.userInputs && options.userInputs[index]) {
        input.value = options.userInputs[index];
      }

      if (options.results && options.results[index]) {
        var r = options.results[index];
        input.classList.add(r.correct ? 'success' : 'error');
        input.disabled = true;
      } else if (options.disabled) {
        input.disabled = true;
      }

      row.appendChild(input);
      container.appendChild(row);
    });
  }

  /**
   * 收集所有空位的用户输入
   * @param {HTMLElement} container - 包含输入框的容器
   * @returns {string[]}
   */
  function collectInputs(container) {
    var inputs = container.querySelectorAll('.blank-input, .input[data-blank-index]');
    var result = [];
    inputs.forEach(function(input) {
      result.push(input.value.trim());
    });
    return result;
  }

  /**
   * 聚焦到第一个空位
   */
  function focusFirstBlank(container) {
    var firstInput = container.querySelector('.blank-input:not([disabled]), .input[data-blank-index]:not([disabled])');
    if (firstInput) {
      setTimeout(function() { firstInput.focus(); }, 100);
    }
  }

  /**
   * 渲染反馈信息
   */
  function renderFeedback(container, checkResult) {
    container.innerHTML = '';

    if (checkResult.allCorrect) {
      container.innerHTML = '<div class="feedback correct">✓ 全部正确！</div>';
    } else {
      var html = '<div class="feedback incorrect">✗ 有错误<br>';
      checkResult.results.forEach(function(r) {
        if (!r.correct) {
          var displayInput = r.userInput || '(未填写)';
          html += '空' + r.blankId + ': 你填的「' + displayInput + '」 → 正确答案「<span class="correct-answer">' + r.correctAnswer + '</span>」<br>';
        }
      });
      html += '</div>';
      container.innerHTML = html;
    }
  }

  return {
    parseSegments: parseSegments,
    renderQuestion: renderQuestion,
    renderAnswerInputs: renderAnswerInputs,
    collectInputs: collectInputs,
    focusFirstBlank: focusFirstBlank,
    renderFeedback: renderFeedback
  };
})();
