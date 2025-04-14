interface Window {
  MCPAI: {
    createNode: (type: string, properties: any) => any;
    handleCommand: (command: string) => any;
  };
} 