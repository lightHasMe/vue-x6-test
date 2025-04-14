import axios from 'axios';

const OLLAMA_API_BASE = 'http://localhost:11434/api';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OllamaAdapter {
  private modelName: string;
  
  constructor(modelName: string = 'qwen2.5:3b') {
    this.modelName = modelName;
  }
  
  async chat(messages: ChatMessage[], context: any = {}) {
    try {
      // 构建MCP系统提示
      const mcpSystemPrompt = this.buildMCPSystemPrompt(context);
      
      // 确保第一条消息是系统提示
      const allMessages = messages.slice();
      if (allMessages.length === 0 || allMessages[0].role !== 'system') {
        allMessages.unshift({ role: 'system', content: mcpSystemPrompt });
      } else {
        allMessages[0].content = mcpSystemPrompt;
      }
      
      // 调用Ollama API
      const response = await axios.post(`${OLLAMA_API_BASE}/chat`, {
        model: this.modelName,
        messages: allMessages,
        stream: false
      });
      
      // 解析响应
      const aiResponse = response.data.message.content;
      
      // 尝试提取JSON命令
      const command = this.extractCommand(aiResponse);
      
      // 清理文本内容（移除JSON块）
      const cleanContent = this.removeJsonBlocks(aiResponse);
      
      return {
        content: cleanContent,
        command: command
      };
    } catch (error) {
      console.error('Ollama调用失败:', error);
      throw error;
    }
  }
  
  private buildMCPSystemPrompt(context: any): string {
    // 构建系统提示，引导模型生成特定格式的输出
    let prompt = `你是一个图形编辑助手，帮助用户创建和编辑X6图表节点。请遵循以下规则：

1. 当用户请求创建图形元素时，理解他们的意图并生成相应的JSON命令
2. 在回复中，先友好地回应用户，然后使用\`\`\`json代码块添加命令
3. 你只需要会回应的JSON格式的数据，不需要额外解释。
4. 命令必须严格遵循以下格式：

\`\`\`json
[
  {
    "action": "可选值：createNode, changeNode",
    "type": "可选值：rect, circle, ellipse, square, cylinder",
    "properties": {
      "id": "必填值：[uuid|olduuid]",
      "width": 数值,
      "height": 数值,
      "position": {"x": 数值, "y": 数值},
      "label": "节点标签文本",
      "attrs": {
        "body":{
          "fill": "背景颜色值",
          "stroke": "边框颜色值",
          "strokeWidth": 边框数值,
        },
        "label":{
          "text": "节点文本",
          "fill": "文本颜色HEX值",
          "fontSize": "数值",
          "refX": "正数值",
          "refY": "正数值",
          "textAnchor": "可以选值:middle,top,bottom",
          "textVerticalAnchor": "可以选值:middle,top,bottom"
        }
      }
      "data": {
        "name": "节点名称",
        "value": "节点值",
        "text": "节点文本内容"
      }
    }
  }
]
\`\`\`

可用节点类型: ${context.availableShapes ? context.availableShapes.join(', ') : 'rect, circle, ellipse, square, cylinder'}`;

    // 添加现有节点信息到提示中
    if (context.existingNodes && context.existingNodes.length > 0) {
      prompt += `\n\n当前画布上已有以下节点：\n`;
      context.existingNodes.forEach((node: any) => {
        prompt += `- ID: ${node.id}, 类型: ${node.type}, 标签: ${node.label || '无'}\n`;
      });
    }

    // 添加现有连线信息
    if (context.existingEdges && context.existingEdges.length > 0) {
      prompt += `\n\n当前画布上已有以下连线：\n`;
      context.existingEdges.forEach((edge: any) => {
        prompt += `- 从 ${edge.source} 到 ${edge.target}, 标签: ${edge.label || '无'}\n`;
      });
    }

    prompt += `\n只需添加JSON命令即可。`;
    return prompt;
  }
  
  private extractCommand(text: string): string | null {
    // 提取JSON命令块
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonStr = jsonMatch[1].trim();
        // 验证JSON是否有效
        JSON.parse(jsonStr);
        return jsonStr;
      } catch (e) {
        console.warn('无效的JSON命令:', e);
      }
    }
    return null;
  }
  
  private removeJsonBlocks(text: string): string {
    // 从回复中删除JSON代码块
    return text.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
  }
} 