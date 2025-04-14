<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElInput, ElButton, ElCard, ElMessage } from 'element-plus';
import { AIService } from '../services/AIService';
import { graphStore } from '@/views/store/graph';

const prompt = ref('');
const messages = ref<Array<{role: string, content: string}>>([]);
const loading = ref(false);
const aiService = ref<AIService | null>(null);

// 初始化AI服务
onMounted(() => {
  // 使用qwen2.5:3b模型，可根据性能需求调整
  aiService.value = new AIService('qwen2.5:3b');
});

// 发送消息到AI并处理响应
const sendToAI = async () => {
  if (!prompt.value.trim() || !aiService.value) return;
  
  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: prompt.value
  });
  
  const userPrompt = prompt.value;
  prompt.value = '';
  loading.value = true;
  
  try {
    // 提供上下文信息
    const context = {
      availableShapes: ['rect', 'circle', 'ellipse', 'square', 'cylinder'],
      features: ['可以创建节点', '可以设置位置', '可以自定义属性'],
      nodeList: graphStore().get()?.getNodes()
    };

    console.log('AI请求参数:', { messages: messages.value, context })
    
    const response = await aiService.value.processUserMessage(messages.value, context);
    
    // 添加AI响应
    messages.value.push({
      role: 'assistant',
      content: response.content
    });
    
    // 处理可能的AI命令
    if (response.command) {
      if (window.MCPAI && typeof window.MCPAI.handleCommand === 'function') {
        try {
          const result = window.MCPAI.handleCommand(response.command);
          console.log('AI命令执行结果:', result);
          
          if (result.success) {
            // 添加成功反馈到消息中
            messages.value.push({
              role: 'system',
              content: '✅ 已在画布上创建了图形'
            });
            ElMessage.success('图形已创建');
          } else {
            ElMessage.warning('命令执行未成功: ' + result.message);
          }
        } catch (error) {
          console.error('执行命令时出错:', error);
          ElMessage.error('执行命令时出错');
        }
      }
    }
  } catch (error) {
    console.error('AI请求错误:', error);
    messages.value.push({
      role: 'assistant',
      content: '抱歉，我无法处理您的请求。请稍后再试。'
    });
    ElMessage.error('AI服务请求失败');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <ElCard class="ai-chat-container">
    <div class="ai-chat-messages">
      <div v-for="(message, index) in messages" :key="index" 
          :class="['message', message.role === 'user' ? 'user-message' : 'ai-message']">
        <p>{{ message.content }}</p>
      </div>
    </div>
    
    <div class="ai-chat-input">
      <ElInput v-model="prompt" placeholder="告诉AI您想要创建什么节点..." 
              :disabled="loading" @keyup.enter="sendToAI" />
      <ElButton type="primary" :loading="loading" @click="sendToAI">发送</ElButton>
    </div>
  </ElCard>
</template>

<style scoped>
.ai-chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ai-chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  max-height: 560px;
}

.message {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  background-color: #e1f3ff;
}

.ai-message {
  align-self: flex-start;
  background-color: #f5f5f5;
}

.ai-chat-input {
  display: flex;
  gap: 10px;
}
</style> 