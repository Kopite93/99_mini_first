import jwt
import hashlib
from flask import *
from pymongo import MongoClient
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup

import dbconfig

app = Flask(__name__)

client = MongoClient(dbconfig.MONGODB_SETTING.values())
db = client.test

SECRET_KEY = "PricEat"

@app.route('/')
def home():
    try:
        if request.cookies.get('mytoken') is None:
            return render_template('main.html')
        else:
            member = jwt.decode(request.cookies.get('mytoken'), SECRET_KEY, algorithms='HS256')
            return render_template('main.html',member=member)
    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        return redirect(url_for("login"))

@app.route('/login')
def login():
    # 로그인 페이지
    return render_template('login.html')

@app.route('/sign_in', methods=['POST'])
def sign_in():
    # 로그인 기능 구현
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    # 비밀번호를 암호화
    pw_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'username': username_receive, 'password': pw_hash})

    if result is not None:
        payload = {
         'id': username_receive,
         'exp': datetime.utcnow() + timedelta(seconds=60 * 60 * 24)  # 로그인 24시간 유지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})

@app.route('/sign_up/save', methods=['POST'])
def sign_up():
    username_receive = request.form['username_give']
    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()
    doc = {
        "username": username_receive,                               # 아이디
        "password": password_hash,                                  # 비밀번호
        "profile_name": username_receive,                           # 프로필 이름 기본값은 아이디
        "profile_pic": "",                                          # 프로필 사진 파일 이름
        "profile_pic_real": "profile_pics/profile_placeholder.png", # 프로필 사진 기본 이미지
        "profile_info": ""                                          # 프로필 한 마디
    }
    db.users.insert_one(doc)
    return jsonify({'result': 'success'})


@app.route('/sign_up/check_dup', methods=['POST'])
def check_dup():
    username_receive = request.form['username_give']
    exists = bool(db.users.find_one({"username":username_receive}))
    return jsonify({'result': 'success', 'exists':exists})

@app.route("/store", methods=["GET"])
def stores_get():
    stores_list = list(db.restaurant.find({}, {'_id': False}))
    return jsonify({'stores_list': stores_list})

@app.route('/store_desc', methods=['GET'])
def store_desc():
    name = request.args.get('name')
    return render_template('detail.html', name=name)

@app.route('/search', methods=['POST'])
def search():
    guname_receive = request.form['guname_give']
    price_receive = request.form['price_give']
    results = list(db.restaurant.find({"dong_name": guname_receive}, {'_id': False}))
    name = []
    asd = []
    res = []
    for result in results:
        name.append(result['name'])
    price1 = list(db.test.find({}, {'_id': False}))
    for price in price1:
        if price_receive in price['menu']:
            asd.append(price)
    for a in asd:
        res.append(a['name'])

    final = list(set(name) & set(res))
    gu_name = []
    img = []
    for x in final:
        r_final = list(db.test.find({'name': x}, {'_id': False}))
        gu_name.append(r_final[0]['name'])
        img.append(r_final[0]['img'])
    rr_final = dict(zip(gu_name, img))
    return jsonify({'final_list': rr_final})


@app.route('/review', methods=['POST'])
def review_post():
    review_text_receive = request.form['review_text_give']
    name_receive = request.form['name_give']
    doc = {
        'review_text':review_text_receive,
        'name':name_receive,
    }
    db.reviews.insert_one(doc)

    return jsonify({'msg': '등록 완료'})

@app.route("/review", methods=["GET"])
def reviews_get():
    review_list = list(db.reviews.find({}, {'_id': False}))
    return jsonify({'reviews': review_list})

@app.route("/search_desc")
def search_desc():
    return render_template('search.html')

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)