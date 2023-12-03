# モジュールのインポート
import datetime
from flask import Flask, request, render_template, jsonify
import openai_test as openai
import firebase_admin
from firebase_admin import credentials, firestore

# firebaseへの接続準備
cred = credentials.Certificate('./webapp-adminsdk.json')
firebase_app = firebase_admin.initialize_app(cred) 
db = firestore.client()

# OpenAIに接続するためのキー
openai.api_key = 'sk-abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKL'

# Flaskの初期化
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# ホームページ
@app.route("/")
def home():
    return render_template(
        'original_webapp_v0.3_index.html'
    )

@app.route("/talkroom")
def talkroom():
    return render_template(
        'original_webapp_v0.3_talkroom.html'
    )

# 有名人からの回答を得るルーティング
@app.route('/answer', methods=['POST'])
def getAnswer():

    # リクエスト情報の取得
    promptJson = request.json
    # chara_num = promptJson['chara_num']
    character = promptJson['character']
    print(character)
    question_sentence = promptJson['question_sentence']

    # OpenAI APIから回答を得る
    try:
        response = openai.ChatCompletion.create( model = 'gpt-3.5-turbo',
                                                 messages = [
                                                     {'role': 'system', 'content': f'{character}になりきって{character}らしい口調で元気に回答してください。'},
                                                     {'role': 'user', 'content': question_sentence}],
                                                 temperature = 0.7,
                                                 max_tokens = 500)
    except Exception as e:
        print(e)
        result = 'アプリへの操作が込み合っているようです。1分程度時間をおいて再度試してみてください。'
        return jsonify({'result': result})
    
    # OpenAI APIからのレスポンスから回答を取得
    answer = response.choices[0].message.content

    # 得られたデータをFirestoreへ保存
    ref = db.collection('answer_log_original2')
    new_doc = ref.document()
    new_doc.set({
        'id': new_doc.id,
        # 'chara_num': chara_num,
        'character': character,
        'question': question_sentence,
        'answer': answer,
        'date': datetime.datetime.today(),
        'like': 0
    })

    # フロントエンドへ回答を渡す
    return jsonify({'answer': answer.replace('\n', '<br>')})

# 過去の回答を取得するルーティング
@app.route('/dblogpage')
def dblogpage():

    # Firestoreから並び替えたデータを取得する準備
    ref = db.collection('answer_log_original2')
    ref = ref.order_by('date', direction=firestore.Query.DESCENDING)
    docs = ref.stream()

    # Firestoreからデータを取得
    answer_log_data_list = []
    for doc in docs:
        # 取得したデータをpythonで取り扱えるように変換
        doc_dict = doc.to_dict()

        # 取得したデータの改行コードをHTMLの改行に変換
        question = doc_dict['question'].replace('\n', '<br>')
        answer = doc_dict['answer'].replace('\n', '<br>')

        # 取得してきたデータJsonのリストに変換
        append_data = {
            'id': doc_dict['id'],
            # 'chara_num':doc_dict['chara_num'],
            'character': doc_dict['character'],
            'question': question,
            'answer': answer,
            'date': doc_dict['date'].strftime('%Y/%m/%d %H:%M:%S'),
            'like': doc_dict['like']
        }
        answer_log_data_list.append(append_data)
    
    # テンプレートに取得データのJsonリストを渡す
    return render_template(
        'original_webapp_v0.3_dblog.html',
        answer_log_data_list = answer_log_data_list
    )

# 「いいね」をカウントアップするルーティング
@app.route('/postlike', methods=['POST'])
def postlike():
    # 「いいね」の対象となる回答のIDを取得
    promptJson = request.json
    answer_log_id = promptJson['id']
   
    # 回答IDに一致する回答をFirestoreから取得
    ref = db.collection('answer_log_original2')
    docs = ref.where('id', '==', answer_log_id).stream()
    
    # 更新前のデータを取得する。（forだが1回しか処理が実行されない）
    for doc in docs:
        doc_dict = doc.to_dict()
        doc_like = doc_dict['like']

    # 取得した回答の「いいね」をカウントアップ
    ref.document(answer_log_id).update({'like': doc_like+1})

    # カウントアップ後の「いいね」の値をフロントエンドに渡す
    return {'result':doc_like+1}

# Flaskサーバーを起動する
if __name__ == '__main__':
    app.run(debug=True, port=5001)