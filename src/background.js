// const openCGPT = () => {
//     chrome.tabs.create({ url: "https://chat.openai.com/chat" });
// };
// chrome.runtime.onInstalled.addListener(() => {
//     // openCGPT();
// });

chrome.action.onClicked.addListener(function (tab) {
    // 在这里执行您想要的操作，例如向当前标签页发送消息
    console.log('Extension icon clicked!');
  
    // 如果您需要与当前标签页上的内容脚本交互，可以发送消息
    chrome.tabs.sendMessage(tab.id, { action: 'save' });
  });