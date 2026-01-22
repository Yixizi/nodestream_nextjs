export const generateGoogleFormScript = (
  webhookUrl: string
) => `function onFormSubmit(e) {
      var formResponse = e.response;
      var itemResponses = formResponse.getItemResponses();
    
      // 构建 responses 对象（将每个表单问题及其回答整理成键值对）
      var responses = {};
      for (var i = 0; i < itemResponses.length; i++) {
        var itemResponse = itemResponses[i];
        responses[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
      }
    
      // 准备发送到 Webhook 的数据负载（payload）
      var payload = {
        formId: e.source.getId(),                 // 表单 ID
        formTitle: e.source.getTitle(),           // 表单标题
        responseId: formResponse.getId(),         // 本次提交的响应 ID
        timestamp: formResponse.getTimestamp(),   // 提交时间
        respondentEmail: formResponse.getRespondentEmail(), // 提交者邮箱
        responses: responses                      // 所有题目与对应答案
      };
    
      // 配置发送到 Webhook 的 HTTP 请求参数
      var options = {
        'method': 'post',                         // 使用 POST 请求
        'contentType': 'application/json',        // 请求体类型为 JSON
        'payload': JSON.stringify(payload)        // 将 payload 转为 JSON 字符串
      };
    
      // Webhook 地址（由外部传入并替换）
      var WEBHOOK_URL = '${webhookUrl}';
    
      try {
        // 向 Webhook 发送请求
        UrlFetchApp.fetch(WEBHOOK_URL, options);
      } catch(error) {
        // Webhook 调用失败时记录错误
        console.error('Webhook 调用失败:', error);
      }
    }`;
