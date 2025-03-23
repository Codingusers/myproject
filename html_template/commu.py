from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
# 啟用跨域資源共享(CORS)
CORS(app)

# 初始化 Ollama 客戶端
llm = ollama.Client(host="http://localhost:11434")

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # 從前端獲取用戶訊息
        user_input = request.json.get('message')
        
        if not user_input:
            return jsonify({"error": "沒有收到訊息"}), 400
            
        # 傳送訊息給 Ollama 並取得回應
        # response = llm.chat(model="deepseek-r1:1.5b", messages=[
        #     {
        #         "role": "user",
        #         "content": user_input
        #     }
        # ])


        response = llm.chat(model="gemma3:4b", messages=[
            {
                "role": "user",
                "content": user_input
            }
        ])
        
        # 從 Ollama 響應中提取文本
        response_text = response['message']['content']
        
        # 返回 Ollama 的回應
        return jsonify({"response": response_text})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)